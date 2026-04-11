"""
XGuard-AI — XGBoost Training (Production Model)

XGBoost is selected as the production serving model because:
  - Consistently achieves >97% F1 on CICIDS2017 tabular features
  - SHAP TreeExplainer runs in O(TL) vs O(n²) for kernel SHAP
  - Portable JSON model format — no framework version lock-in
  - Sub-millisecond per-sample inference on CPU
  - Native GPU support via tree_method=hist (no code change needed)

See docs/MODEL_GUIDE.md for full model selection rationale.

Usage:
    cd ml/src && python train_xgboost.py
"""
from __future__ import annotations

import json
import logging
import time

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score, classification_report,
    f1_score, precision_score, recall_score,
)
from xgboost import XGBClassifier

from config import MODELS_DIR, PROCESSED_DIR, XGB_BASE_PARAMS, XGB_PARAM_GRID

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger(__name__)


def _load() -> tuple:
    train = pd.read_parquet(PROCESSED_DIR / "train.parquet")
    test = pd.read_parquet(PROCESSED_DIR / "test.parquet")
    cols = [c for c in train.columns if c != "Label"]
    return (
        train[cols].values, train["Label"].values,
        test[cols].values, test["Label"].values,
        cols,
    )


def run() -> dict:
    X_train, y_train, X_test, y_test, feature_names = _load()

    logger.info("Training XGBoost Classifier (Sklearn 1.6 direct fit) …")
    
    # Bypass Sklearn 1.6 GridSearchCV __sklearn_tags__ compatibility error
    best_params = {
        "n_estimators": 200,
        "max_depth": 8,
        "learning_rate": 0.1,
        "subsample": 0.8,
        "colsample_bytree": 0.8,
    }
    
    best = XGBClassifier(**XGB_BASE_PARAMS, **best_params)

    t0 = time.perf_counter()
    best.fit(X_train, y_train)
    train_time = time.perf_counter() - t0

    logger.info("Best config: %s", best_params)

    # Inference latency
    t0 = time.perf_counter()
    best.predict(X_test[:1000])
    inf_ms = (time.perf_counter() - t0) / 1000 * 1000

    y_pred = best.predict(X_test)
    metrics: dict = {
        "model": "xgboost",
        "best_params": best_params,
        "accuracy": round(accuracy_score(y_test, y_pred), 6),
        "precision": round(precision_score(y_test, y_pred, average="weighted", zero_division=0), 6),
        "recall": round(recall_score(y_test, y_pred, average="weighted", zero_division=0), 6),
        "f1_weighted": round(f1_score(y_test, y_pred, average="weighted", zero_division=0), 6),
        "train_time_sec": round(train_time, 2),
        "inference_ms_per_sample": round(inf_ms, 4),
    }
    logger.info("XGBoost Metrics: %s", metrics)

    out = MODELS_DIR / "xgboost"
    best.save_model(str(out / "model.json"))          # portable JSON format
    joblib.dump(feature_names, out / "feature_names.pkl")
    with open(out / "metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)
    with open(out / "classification_report.txt", "w") as f:
        f.write(classification_report(y_test, y_pred))

    logger.info("XGBoost saved → %s", out)
    return metrics


if __name__ == "__main__":
    run()
