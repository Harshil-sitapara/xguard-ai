"""
XGuard-AI Kafka Traffic Producer

Reads rows from a processed parquet split and publishes them to the
`network-traffic` Kafka topic, simulating real-time network monitoring.

Usage:
    pip install -r requirements.txt
    python producer.py --rate 10
    python producer.py --rate 0
    python producer.py --attack-only
    python producer.py --dataset-path ../ml/data/processed/test.parquet --single-pass --max-messages 500

Environment variables:
    KAFKA_BOOTSTRAP_SERVERS   default: localhost:9092
    KAFKA_TOPIC_TRAFFIC       default: network-traffic
    PROCESSED_DIR             default: ../ml/data/processed
    MODELS_DIR                default: ../ml/models
"""
from __future__ import annotations

import argparse
import asyncio
import json
import logging
import os
import random
from pathlib import Path

import joblib
import pandas as pd
from aiokafka import AIOKafkaProducer

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger(__name__)

BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
TOPIC = os.getenv("KAFKA_TOPIC_TRAFFIC", "network-traffic")
PROCESSED_DIR = os.getenv("PROCESSED_DIR", "../ml/data/processed")
MODELS_DIR = os.getenv("MODELS_DIR", "../ml/models")
DEFAULT_SCALER_PATH = Path(MODELS_DIR) / "preprocessor" / "scaler.pkl"
DEFAULT_BACKGROUND_PATH = Path(MODELS_DIR) / "xgboost" / "shap_background.pkl"

SAMPLE_IPS = [
    "192.168.1.10",
    "10.0.0.5",
    "172.16.0.3",
    "203.0.113.42",
    "198.51.100.7",
]


def _default_dataset_path() -> Path:
    mixed_path = Path(PROCESSED_DIR) / "test_mixed.parquet"
    if mixed_path.exists():
        return mixed_path
    return Path(PROCESSED_DIR) / "test.parquet"


def _prepare_rows(
    dataset_path: Path,
    attack_only: bool,
    scaler_path: Path | None,
    max_messages: int,
    background_path: Path | None,
) -> tuple[list[dict], str]:
    if not scaler_path or not scaler_path.exists():
        raise FileNotFoundError(f"Replay scaler not found at {scaler_path}.")

    scaler = joblib.load(scaler_path)

    if dataset_path.exists():
        logger.info("Loading dataset from %s ...", dataset_path)
        df = pd.read_parquet(dataset_path)
        feature_cols = [column for column in df.columns if column != "Label"]

        if attack_only:
            df = df[df["Label"] != 0]
            logger.info("Attack-only mode: %d rows", len(df))

        if df.empty:
            raise RuntimeError("No rows available for the selected replay filters.")

        if max_messages > 0:
            sample_size = min(max_messages, len(df))
            df = df.sample(n=sample_size)
            logger.info("Prepared %d sampled replay rows", sample_size)

        unscaled = scaler.inverse_transform(df[feature_cols])
        df = pd.DataFrame(unscaled, columns=feature_cols, index=df.index).assign(Label=df["Label"].values)
        logger.info("Inverse-transformed replay rows using scaler at %s", scaler_path)
        return df[feature_cols].to_dict(orient="records"), "held-out test split"

    if attack_only:
        raise RuntimeError(
            "Attack-only replay requires the labeled held-out dataset. "
            "Bundled background traffic does not include labels."
        )

    if not background_path or not background_path.exists():
        raise FileNotFoundError(
            f"Replay dataset not found at {dataset_path}, and no background replay source was found at {background_path}."
        )

    logger.info("Held-out dataset missing, loading background replay rows from %s ...", background_path)
    background_bundle = joblib.load(background_path)
    feature_names = background_bundle.get("feature_names")
    background_rows = background_bundle.get("background")
    if feature_names is None or background_rows is None:
        raise RuntimeError("Background replay bundle is missing feature names or row data.")

    df = pd.DataFrame(background_rows, columns=feature_names)
    if max_messages > 0:
        sample_size = min(max_messages, len(df))
        df = df.sample(n=sample_size)
        logger.info("Prepared %d sampled background replay rows", sample_size)

    unscaled = scaler.inverse_transform(df[feature_names])
    df = pd.DataFrame(unscaled, columns=feature_names, index=df.index)
    logger.info("Inverse-transformed background replay rows using scaler at %s", scaler_path)
    return df.to_dict(orient="records"), "bundled model background"


async def produce(
    rate: float,
    attack_only: bool,
    dataset_path: Path,
    max_messages: int,
    single_pass: bool,
    scaler_path: Path | None,
    background_path: Path | None,
) -> None:
    rows, source_name = _prepare_rows(
        dataset_path,
        attack_only,
        scaler_path,
        max_messages,
        background_path,
    )

    producer = AIOKafkaProducer(
        bootstrap_servers=BOOTSTRAP,
        value_serializer=lambda value: json.dumps(value).encode("utf-8"),
    )
    await producer.start()
    logger.info(
        "Producer started -> topic: %s | rate: %s msg/s | source: %s",
        TOPIC,
        rate if rate > 0 else "unlimited",
        source_name,
    )

    sent = 0
    try:
        while True:
            random.shuffle(rows)
            for row in rows:
                payload = {
                    "features": {key: float(value) for key, value in row.items()},
                    "source_ip": random.choice(SAMPLE_IPS),
                    "destination_ip": random.choice(SAMPLE_IPS),
                }
                await producer.send_and_wait(TOPIC, payload)
                sent += 1
                if sent % 100 == 0:
                    logger.info("Sent %d messages", sent)
                if max_messages > 0 and sent >= max_messages:
                    logger.info("Reached max message limit (%d)", max_messages)
                    return
                if rate > 0:
                    await asyncio.sleep(1 / rate)
            if single_pass:
                logger.info("Single-pass replay complete after %d messages", sent)
                return
    except (KeyboardInterrupt, asyncio.CancelledError):
        logger.info("Stopping producer after %d messages", sent)
    finally:
        await producer.stop()


def main() -> None:
    parser = argparse.ArgumentParser(description="XGuard-AI Kafka Traffic Producer")
    parser.add_argument("--rate", type=float, default=5.0, help="Messages per second (0 = unlimited)")
    parser.add_argument("--attack-only", action="store_true", help="Only publish attack-class rows")
    parser.add_argument(
        "--dataset-path",
        type=Path,
        default=_default_dataset_path(),
        help="Parquet dataset to replay",
    )
    parser.add_argument(
        "--max-messages",
        type=int,
        default=0,
        help="Stop after sending N messages (0 = unlimited)",
    )
    parser.add_argument(
        "--single-pass",
        action="store_true",
        help="Walk the dataset once instead of looping forever",
    )
    parser.add_argument(
        "--scaler-path",
        type=Path,
        default=DEFAULT_SCALER_PATH,
        help="Scaler artefact used to inverse-transform processed rows before publishing",
    )
    parser.add_argument(
        "--background-path",
        type=Path,
        default=DEFAULT_BACKGROUND_PATH,
        help="Fallback background-row bundle used when the labeled replay dataset is unavailable",
    )
    args = parser.parse_args()
    asyncio.run(
        produce(
            rate=args.rate,
            attack_only=args.attack_only,
            dataset_path=args.dataset_path,
            max_messages=args.max_messages,
            single_pass=args.single_pass,
            scaler_path=args.scaler_path,
            background_path=args.background_path,
        )
    )


if __name__ == "__main__":
    main()
