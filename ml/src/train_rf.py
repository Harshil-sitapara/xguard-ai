"""
XGuard-AI — Random Forest Training (Baseline Model)

Usage:
    cd ml/src && python train_rf.py
"""
from __future__ import annotations

import json
import logging
import time

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, classification_report,
    f1_score, precision_score, recall_score,
)

from config import MODELS_DIR, PROCESSED_DIR, RF_PARAMS

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger(__name__)


def _load() -> tuple:
    train = pd.read_parquet(PROCESSED_DIR / "train.parquet")
    test = pd.read_parquet(PROCESSED_DIR / "test.parquet")
    cols = [c for c in train.columns if c != "Label"]
    return (
        train[cols].values, train["Label"].values,
        test[cols].values, test["Label"].values,
    )


def run() -> dict:
    X_train, y_train, X_test, y_test = _load()

    logger.info("Training Random Forest …")
    t0 = time.perf_counter()
    model = RandomForestClassifier(**RF_PARAMS)
    model.fit(X_train, y_train)
    train_time = time.perf_counter() - t0

    # Inference latency on 1000 samples
    t0 = time.perf_counter()
    model.predict(X_test[:1000])
    inf_ms = (time.perf_counter() - t0) / 1000 * 1000

    y_pred = model.predict(X_test)
    metrics: dict = {
        "model": "random_forest",
        "accuracy": round(accuracy_score(y_test, y_pred), 6),
        "precision": round(precision_score(y_test, y_pred, average="weighted", zero_division=0), 6),
        "recall": round(recall_score(y_test, y_pred, average="weighted", zero_division=0), 6),
        "f1_weighted": round(f1_score(y_test, y_pred, average="weighted", zero_division=0), 6),
        "train_time_sec": round(train_time, 2),
        "inference_ms_per_sample": round(inf_ms, 4),
    }
    logger.info("RF Metrics: %s", metrics)

    out = MODELS_DIR / "random_forest"
    joblib.dump(model, out / "model.pkl")
    with open(out / "metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)
    with open(out / "classification_report.txt", "w") as f:
        f.write(classification_report(y_test, y_pred))

    logger.info("Random Forest saved → %s", out)
    return metrics


if __name__ == "__main__":
    run()
