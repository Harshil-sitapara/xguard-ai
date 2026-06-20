"""
XGuard-AI — Inference Service

Loads the XGBoost model and preprocessor artefacts once at startup.
Exposes a thread-safe predict() used by API routes and the Kafka consumer.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path

import joblib
import numpy as np
from starlette.concurrency import run_in_threadpool
import xgboost as xgb

from app.core.config import settings

logger = logging.getLogger(__name__)

# Attack label (any non-Benign class)
BENIGN_LABEL = "Benign"

# Severity thresholds by confidence
def _severity(conf: float) -> str:
    if conf >= 0.95:
        return "CRITICAL"
    if conf >= 0.80:
        return "HIGH"
    if conf >= 0.60:
        return "MEDIUM"
    return "LOW"


@dataclass
class PredictionResult:
    label: str
    confidence: float
    is_attack: bool
    severity: str
    class_probabilities: dict[str, float]


class InferenceService:
    def __init__(self) -> None:
        self._model: xgb.Booster | None = None
        self._scaler = None
        self._label_encoder = None
        self._feature_names: list[str] = []

    def load(self, models_path: Path) -> None:
        logger.info("Loading model artefacts from %s …", models_path)
        prep = models_path / "preprocessor"
        self._scaler = joblib.load(prep / "scaler.pkl")
        self._label_encoder = joblib.load(prep / "label_encoder.pkl")
        self._feature_names = joblib.load(prep / "feature_names.pkl")

        xgb_path = models_path / "xgboost" / "model.json"
        self._model = xgb.Booster()
        self._model.load_model(str(xgb_path))
        logger.info("Model loaded. Classes: %s", list(self._label_encoder.classes_))

    @property
    def feature_names(self) -> list[str]:
        return self._feature_names

    @property
    def classes(self) -> list[str]:
        return list(self._label_encoder.classes_)

    def _predict_sync(self, raw_features: dict[str, float]) -> PredictionResult:
        if self._model is None:
            raise RuntimeError("Inference model not loaded")

        # Build feature vector in correct order; missing features default to 0.0
        vec = np.array(
            [raw_features.get(f, 0.0) for f in self._feature_names], dtype=np.float32
        ).reshape(1, -1)
        vec = np.nan_to_num(vec, nan=0.0, posinf=0.0, neginf=0.0)
        vec_scaled = self._scaler.transform(vec)
        proba = np.asarray(self._model.predict(xgb.DMatrix(vec_scaled)), dtype=np.float32)
        if proba.ndim == 1:
            # Binary models can return the positive-class probability only.
            proba = np.array([[1.0 - float(proba[0]), float(proba[0])]], dtype=np.float32)
        proba = proba[0]
        class_idx = int(np.argmax(proba))
        label = self._label_encoder.classes_[class_idx]
        confidence = float(proba[class_idx])
        return PredictionResult(
            label=label,
            confidence=confidence,
            is_attack=(label != BENIGN_LABEL),
            severity=_severity(confidence) if label != BENIGN_LABEL else "NONE",
            class_probabilities={
                cls: round(float(p), 6)
                for cls, p in zip(self._label_encoder.classes_, proba)
            },
        )

    async def predict(self, raw_features: dict[str, float]) -> PredictionResult:
        """Async wrapper — runs CPU-bound inference in thread pool."""
        return await run_in_threadpool(self._predict_sync, raw_features)


# Module-level singleton — loaded once at app startup via lifespan
inference_service = InferenceService()
