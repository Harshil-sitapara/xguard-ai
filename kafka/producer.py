"""
XGuard-AI — Kafka Traffic Producer (Demo / Simulation)

Reads rows from the processed test dataset and publishes them to the
'network-traffic' Kafka topic, simulating real-time network monitoring.

Usage:
    pip install -r requirements.txt
    python producer.py --rate 10          # 10 messages/second
    python producer.py --rate 0           # as fast as possible
    python producer.py --attack-only      # only publish attack rows

Environment variables (or edit defaults below):
    KAFKA_BOOTSTRAP_SERVERS   default: localhost:9092
    KAFKA_TOPIC_TRAFFIC       default: network-traffic
    PROCESSED_DIR             default: ../ml/data/processed
"""
from __future__ import annotations

import argparse
import asyncio
import json
import logging
import os
import random
import time
from pathlib import Path

import pandas as pd
from aiokafka import AIOKafkaProducer

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger(__name__)

BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
TOPIC = os.getenv("KAFKA_TOPIC_TRAFFIC", "network-traffic")
# Data Source: Using 'test_mixed.parquet' for balanced simulation if it exists, otherwise fallback to original
PROCESSED_DIR = os.getenv("PROCESSED_DIR", "../ml/data/processed")
DATA_PATH = Path(PROCESSED_DIR) / "test_mixed.parquet"
if not DATA_PATH.exists():
    DATA_PATH = Path(PROCESSED_DIR) / "test.parquet"

SAMPLE_IPS = [
    "192.168.1.10", "10.0.0.5", "172.16.0.3",
    "203.0.113.42", "198.51.100.7",
]


async def produce(rate: float, attack_only: bool) -> None:
    logger.info("Loading dataset from %s …", DATA_PATH)
    df = pd.read_parquet(DATA_PATH)
    feature_cols = [c for c in df.columns if c != "Label"]

    if attack_only:
        df = df[df["Label"] != 0]   # 0 = Benign after LabelEncoder
        logger.info("Attack-only mode: %d rows", len(df))

    producer = AIOKafkaProducer(
        bootstrap_servers=BOOTSTRAP,
        value_serializer=lambda v: json.dumps(v).encode("utf-8"),
    )
    await producer.start()
    logger.info("Producer started → topic: %s | rate: %s msg/s", TOPIC,
                rate if rate > 0 else "unlimited")

    rows = df[feature_cols].to_dict(orient="records")
    sent = 0
    try:
        while True:
            random.shuffle(rows)
            for row in rows:
                payload = {
                    "features": {k: float(v) for k, v in row.items()},
                    "source_ip": random.choice(SAMPLE_IPS),
                    "destination_ip": random.choice(SAMPLE_IPS),
                }
                await producer.send_and_wait(TOPIC, payload)
                sent += 1
                if sent % 100 == 0:
                    logger.info("Sent %d messages", sent)
                if rate > 0:
                    await asyncio.sleep(1 / rate)
    except (KeyboardInterrupt, asyncio.CancelledError):
        logger.info("Stopping producer after %d messages", sent)
    finally:
        await producer.stop()


def main() -> None:
    parser = argparse.ArgumentParser(description="XGuard-AI Kafka Traffic Producer")
    parser.add_argument("--rate", type=float, default=5.0,
                        help="Messages per second (0 = unlimited)")
    parser.add_argument("--attack-only", action="store_true",
                        help="Only publish attack-class rows")
    args = parser.parse_args()
    asyncio.run(produce(args.rate, args.attack_only))


if __name__ == "__main__":
    main()
