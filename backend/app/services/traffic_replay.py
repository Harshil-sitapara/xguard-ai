from __future__ import annotations

import asyncio
import logging
import os
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

from app.core.config import settings

logger = logging.getLogger(__name__)


@dataclass
class ReplayState:
    running: bool = False
    enabled: bool = False
    available: bool = False
    rate: float = 10.0
    limit: int = 0
    attack_only: bool = False
    started_at: str | None = None
    finished_at: str | None = None
    last_error: str | None = None
    message: str = ""
    environment: str = settings.environment


class TrafficReplayManager:
    def __init__(self) -> None:
        self._lock = asyncio.Lock()
        self._process: asyncio.subprocess.Process | None = None
        self._watch_task: asyncio.Task | None = None
        self._stderr_task: asyncio.Task | None = None
        self._stop_requested = False
        self._last_process_line: str | None = None
        self._state = ReplayState()

    def _enabled(self) -> bool:
        return settings.traffic_replay_enabled

    def _dataset_path(self) -> Path:
        return settings.traffic_replay_dataset

    def _producer_script(self) -> Path:
        return settings.app_root / "kafka" / "producer.py"

    def _scaler_path(self) -> Path:
        return settings.models_path / "preprocessor" / "scaler.pkl"

    def _background_path(self) -> Path:
        return settings.models_path / "xgboost" / "shap_background.pkl"

    def _is_running(self) -> bool:
        return self._process is not None and self._process.returncode is None

    def _base_state(self) -> ReplayState:
        dataset_path = self._dataset_path()
        producer_script = self._producer_script()
        scaler_path = self._scaler_path()
        background_path = self._background_path()
        has_labeled_dataset = dataset_path.exists()
        has_background_fallback = background_path.exists()

        available = (
            self._enabled()
            and settings.kafka_enabled
            and producer_script.exists()
            and scaler_path.exists()
            and (has_labeled_dataset or has_background_fallback)
        )

        if not self._enabled():
            message = "Traffic replay is disabled by configuration."
        elif not settings.kafka_enabled:
            message = "Kafka is disabled, so replay cannot publish traffic."
        elif not producer_script.exists():
            message = f"Kafka producer script not found at {producer_script}."
        elif not scaler_path.exists():
            message = f"Replay scaler not found at {scaler_path}."
        elif has_labeled_dataset:
            message = "Ready to replay the held-out 20% test split."
        elif has_background_fallback:
            message = (
                "Ready to replay bundled model background traffic "
                "(held-out test split is not packaged in this deployment)."
            )
        else:
            message = (
                f"Held-out test dataset not found at {dataset_path}, and no bundled "
                f"background replay source was found at {background_path}."
            )

        return ReplayState(
            running=False,
            enabled=self._enabled(),
            available=available,
            message=message,
        )

    def status(self) -> ReplayState:
        base = self._base_state()
        self._state.enabled = base.enabled
        self._state.available = base.available

        if not self._is_running() and not self._state.last_error and not self._state.message:
            self._state.message = base.message
        elif (
            not self._is_running()
            and not self._state.last_error
            and self._state.started_at
            and self._state.message.startswith("Replaying")
        ):
            self._state.finished_at = self._state.finished_at or datetime.now(timezone.utc).isoformat()
            self._state.message = "Replay complete."

        self._state.running = self._is_running()
        return self._state

    async def start(self, rate: float, limit: int, attack_only: bool) -> ReplayState:
        async with self._lock:
            if self._is_running():
                raise RuntimeError("Traffic replay is already running.")

            base = self._base_state()
            if not base.available:
                self._state = base
                raise RuntimeError(base.message)

            self._stop_requested = False
            self._last_process_line = None

            dataset_path = self._dataset_path()
            scaler_path = self._scaler_path()
            producer_script = self._producer_script()
            background_path = self._background_path()
            using_labeled_dataset = dataset_path.exists()

            if attack_only and not using_labeled_dataset:
                raise RuntimeError(
                    "Attack-only replay requires the labeled held-out dataset, which is "
                    "not packaged in this deployment."
                )

            command = [
                sys.executable,
                str(producer_script),
                "--rate",
                str(rate),
                "--dataset-path",
                str(dataset_path),
                "--single-pass",
                "--scaler-path",
                str(scaler_path),
                "--background-path",
                str(background_path),
            ]
            if limit > 0:
                command.extend(["--max-messages", str(limit)])
            if attack_only:
                command.append("--attack-only")

            env = os.environ.copy()
            env["KAFKA_BOOTSTRAP_SERVERS"] = settings.kafka_bootstrap_servers
            env["KAFKA_TOPIC_TRAFFIC"] = settings.kafka_topic_traffic
            env["MODELS_DIR"] = str(settings.models_path)
            env["PYTHONUNBUFFERED"] = "1"

            try:
                self._process = await asyncio.create_subprocess_exec(
                    *command,
                    cwd=str(settings.app_root),
                    env=env,
                    stdout=asyncio.subprocess.DEVNULL,
                    stderr=asyncio.subprocess.PIPE,
                )
            except OSError as exc:
                raise RuntimeError(f"Could not start replay producer: {exc}") from exc

            self._state = ReplayState(
                running=True,
                enabled=base.enabled,
                available=base.available,
                rate=rate,
                limit=limit,
                attack_only=attack_only,
                started_at=datetime.now(timezone.utc).isoformat(),
                message=(
                    f"Replaying {'held-out test traffic' if using_labeled_dataset else 'bundled background traffic'} "
                    f"at {rate if rate > 0 else 'max'} msg/s"
                    + (" (attacks only)." if attack_only else ".")
                ),
            )

            if self._process.stderr is not None:
                self._stderr_task = asyncio.create_task(self._capture_stderr(self._process.stderr))
            self._watch_task = asyncio.create_task(self._watch_process(self._process))
            return self._state

    async def stop(self) -> ReplayState:
        async with self._lock:
            process = self._process
            if process is None or process.returncode is not None:
                self._process = None
                self._state.running = False
                self._state.message = self._state.message or "Traffic replay is idle."
                return self._state

            self._stop_requested = True
            process.terminate()
            try:
                await asyncio.wait_for(process.wait(), timeout=5)
            except asyncio.TimeoutError:
                process.kill()
                await process.wait()

            self._state.running = False
            self._state.finished_at = datetime.now(timezone.utc).isoformat()
            self._state.message = "Traffic replay stopped."
            self._process = None
            return self._state

    async def _capture_stderr(self, stream: asyncio.StreamReader) -> None:
        while True:
            line = await stream.readline()
            if not line:
                return
            text = line.decode("utf-8", errors="replace").strip()
            if not text:
                continue
            self._last_process_line = text
            logger.info("Replay producer | %s", text)

    async def _watch_process(self, process: asyncio.subprocess.Process) -> None:
        return_code = await process.wait()
        if self._stderr_task is not None:
            await self._stderr_task

        async with self._lock:
            self._process = None
            self._state.running = False
            self._state.finished_at = datetime.now(timezone.utc).isoformat()

            if self._stop_requested:
                self._state.message = "Traffic replay stopped."
                self._stop_requested = False
                return

            if return_code == 0:
                self._state.message = "Replay complete."
                self._state.last_error = None
                return

            message = self._last_process_line or f"Replay process exited with code {return_code}."
            logger.warning("Traffic replay failed: %s", message)
            self._state.last_error = message
            self._state.message = message


traffic_replay_manager = TrafficReplayManager()
