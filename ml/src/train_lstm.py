"""
XGuard-AI — LSTM Training (Research Comparison Model)

LSTM is trained for academic benchmarking against XGBoost and Random Forest.
It is NOT used as the production serving model due to:
  - 10x higher inference latency vs XGBoost
  - Requires sequence windowing (adds complexity to API)
  - No native SHAP TreeExplainer support (requires slower KernelExplainer)

See docs/MODEL_GUIDE.md for full model selection rationale.

Usage:
    cd ml/src && python train_lstm.py
"""
from __future__ import annotations

import json
import logging
import time

import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score, classification_report,
    f1_score, precision_score, recall_score,
)

from config import LSTM_CONFIG, MODELS_DIR, PROCESSED_DIR

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger(__name__)

SEQ_LEN: int = LSTM_CONFIG["sequence_length"]


def _build_sequences(X: np.ndarray, y: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Sliding-window sequence builder."""
    Xs, ys = [], []
    for i in range(len(X) - SEQ_LEN):
        Xs.append(X[i: i + SEQ_LEN])
        ys.append(y[i + SEQ_LEN])
    return np.array(Xs, dtype=np.float32), np.array(ys, dtype=np.int32)


def _build_model(n_features: int, n_classes: int):
    from tensorflow.keras.layers import LSTM, BatchNormalization, Dense, Dropout
    from tensorflow.keras.models import Sequential

    cfg = LSTM_CONFIG
    model = Sequential([
        LSTM(cfg["lstm_units"][0], return_sequences=True, input_shape=(SEQ_LEN, n_features)),
        BatchNormalization(),
        Dropout(cfg["dropout_rate"]),
        LSTM(cfg["lstm_units"][1]),
        BatchNormalization(),
        Dropout(cfg["dropout_rate"]),
        Dense(64, activation="relu"),
        Dense(n_classes, activation="softmax"),
    ])
    model.compile(optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"])
    return model


def run() -> dict:
    train = pd.read_parquet(PROCESSED_DIR / "train.parquet")
    test = pd.read_parquet(PROCESSED_DIR / "test.parquet")
    cols = [c for c in train.columns if c != "Label"]

    X_train = train[cols].values.astype(np.float32)
    y_train = train["Label"].values.astype(np.int32)
    X_test = test[cols].values.astype(np.float32)
    y_test = test["Label"].values.astype(np.int32)

    logger.info("Building sequences (SEQ_LEN=%d) …", SEQ_LEN)
    X_tr_seq, y_tr_seq = _build_sequences(X_train, y_train)
    X_te_seq, y_te_seq = _build_sequences(X_test, y_test)

    n_classes = len(np.unique(y_train))
    model = _build_model(X_tr_seq.shape[2], n_classes)

    from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
    callbacks = [
        EarlyStopping(monitor="val_loss", patience=LSTM_CONFIG["patience"], restore_best_weights=True),
        ReduceLROnPlateau(monitor="val_loss", factor=0.5, patience=3, min_lr=1e-6),
    ]

    logger.info("Training LSTM …")
    t0 = time.perf_counter()
    model.fit(
        X_tr_seq, y_tr_seq,
        validation_split=0.1,
        epochs=LSTM_CONFIG["epochs"],
        batch_size=LSTM_CONFIG["batch_size"],
        callbacks=callbacks,
        verbose=1,
    )
    train_time = time.perf_counter() - t0

    t0 = time.perf_counter()
    model.predict(X_te_seq[:1000], verbose=0)
    inf_ms = (time.perf_counter() - t0) / 1000 * 1000

    y_pred = np.argmax(model.predict(X_te_seq, verbose=0), axis=1)
    metrics: dict = {
        "model": "lstm",
        "accuracy": round(accuracy_score(y_te_seq, y_pred), 6),
        "precision": round(precision_score(y_te_seq, y_pred, average="weighted", zero_division=0), 6),
        "recall": round(recall_score(y_te_seq, y_pred, average="weighted", zero_division=0), 6),
        "f1_weighted": round(f1_score(y_te_seq, y_pred, average="weighted", zero_division=0), 6),
        "train_time_sec": round(train_time, 2),
        "inference_ms_per_sample": round(inf_ms, 4),
    }
    logger.info("LSTM Metrics: %s", metrics)

    out = MODELS_DIR / "lstm"
    model.save(str(out / "model.keras"))
    with open(out / "metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)
    with open(out / "classification_report.txt", "w") as f:
        f.write(classification_report(y_te_seq, y_pred))

    logger.info("LSTM saved → %s", out)
    return metrics


if __name__ == "__main__":
    run()
