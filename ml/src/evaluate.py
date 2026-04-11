"""
XGuard-AI — Cross-Model Evaluation Report

Loads metrics.json from all three trained models and prints a comparison table.
Also saves evaluation_report.json to ml/models/.

Usage:
    cd ml/src && python evaluate.py
"""
from __future__ import annotations

import json
import logging

from config import MODELS_DIR

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger(__name__)

METRIC_KEYS = [
    "accuracy", "precision", "recall", "f1_weighted",
    "train_time_sec", "inference_ms_per_sample",
]


def run() -> dict:
    results: dict = {}
    for name in ("random_forest", "xgboost", "lstm"):
        path = MODELS_DIR / name / "metrics.json"
        if not path.exists():
            logger.warning("Skipping %s — metrics.json not found", name)
            continue
        with open(path) as f:
            results[name] = json.load(f)

    if not results:
        logger.error("No model metrics found. Run training scripts first.")
        return {}

    # Pretty comparison table
    col_w = 20
    header = f"{'Metric':<30}" + "".join(f"{k:<{col_w}}" for k in results)
    sep = "─" * (30 + col_w * len(results))
    logger.info("\n%s\n%s\n%s", sep, header, sep)
    for key in METRIC_KEYS:
        row = f"{key:<30}" + "".join(f"{str(data.get(key, 'N/A')):<{col_w}}" for data in results.values())
        logger.info(row)
    logger.info(sep)

    best = max(results, key=lambda m: results[m].get("f1_weighted", 0))
    logger.info("\n✅  Best model by F1-weighted: %s", best.upper())

    report = {"models": results, "best_model": best}
    out = MODELS_DIR / "evaluation_report.json"
    with open(out, "w") as f:
        json.dump(report, f, indent=2)
    logger.info("Evaluation report → %s", out)
    return report


if __name__ == "__main__":
    run()
