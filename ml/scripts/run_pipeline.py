"""
XGuard-AI — Pipeline Runner CLI

Usage:
    python scripts/run_pipeline.py --step all
    python scripts/run_pipeline.py --step preprocess
    python scripts/run_pipeline.py --step train --model xgboost
    python scripts/run_pipeline.py --step evaluate
    python scripts/run_pipeline.py --step shap
"""
from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

# Add ml/src to path so all module imports resolve
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger(__name__)


def main() -> None:
    parser = argparse.ArgumentParser(description="XGuard-AI ML Pipeline Runner")
    parser.add_argument(
        "--step",
        choices=["all", "preprocess", "train", "evaluate", "shap"],
        default="all",
    )
    parser.add_argument(
        "--model",
        choices=["all", "rf", "xgboost", "lstm"],
        default="all",
        help="Model to train (only used with --step train)",
    )
    args = parser.parse_args()

    if args.step in ("all", "preprocess"):
        logger.info("══ STEP: PREPROCESS ══")
        import preprocess; preprocess.run()

    if args.step in ("all", "train"):
        if args.model in ("all", "rf"):
            logger.info("══ STEP: TRAIN — Random Forest ══")
            import train_rf; train_rf.run()
        if args.model in ("all", "xgboost"):
            logger.info("══ STEP: TRAIN — XGBoost ══")
            import train_xgboost; train_xgboost.run()
        if args.model in ("all", "lstm"):
            logger.info("══ STEP: TRAIN — LSTM ══")
            import train_lstm; train_lstm.run()

    if args.step in ("all", "evaluate"):
        logger.info("══ STEP: EVALUATE ══")
        import evaluate; evaluate.run()

    if args.step in ("all", "shap"):
        logger.info("══ STEP: SHAP ANALYSIS ══")
        import shap_analysis; shap_analysis.run()

    logger.info("Pipeline complete ✅")


if __name__ == "__main__":
    main()
