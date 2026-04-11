"""
XGuard-AI — SHAP Global Analysis on XGBoost Model

Produces:
  - shap_summary.png   : bar chart of top-20 global feature importances
  - shap_background.pkl: small background dataset for runtime TreeExplainer

Usage:
    cd ml/src && python shap_analysis.py
"""
from __future__ import annotations

import logging
import warnings

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import shap
import xgboost as xgb

from config import MODELS_DIR, PROCESSED_DIR

warnings.filterwarnings("ignore")
logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger(__name__)

N_EXPLAIN = 2000    # rows for summary plot
N_BACKGROUND = 500  # rows saved for runtime explainer


def run() -> None:
    xgb_dir = MODELS_DIR / "xgboost"
    
    # Use native XGBoost Booster to avoid Scikit-Learn 1.6 wrapper incompatibility 
    model = xgb.Booster()
    model.load_model(str(xgb_dir / "model.json"))

    test = pd.read_parquet(PROCESSED_DIR / "test.parquet")
    feature_names = [c for c in test.columns if c != "Label"]
    X_test = test[feature_names].values.astype(np.float32)

    # SHAP TreeExplainer — O(TL) complexity, no approximation needed for trees
    logger.info("Building SHAP TreeExplainer …")
    explainer = shap.TreeExplainer(model)

    rng = np.random.default_rng(42)
    idx = rng.choice(len(X_test), size=min(N_EXPLAIN, len(X_test)), replace=False)
    X_sample = X_test[idx]

    logger.info("Computing SHAP values for %d samples …", len(X_sample))
    shap_values = explainer.shap_values(X_sample)

    # Mean absolute SHAP across all classes
    if isinstance(shap_values, list):
        mean_abs = np.mean([np.abs(sv) for sv in shap_values], axis=0)
    else:
        mean_abs = np.abs(shap_values)

    # Global summary bar plot
    logger.info("Generating summary plot …")
    plt.figure(figsize=(12, 8))
    shap.summary_plot(mean_abs, X_sample, feature_names=np.array(feature_names),
                      plot_type="bar", show=False, max_display=20)
    plt.tight_layout()
    plt.savefig(str(xgb_dir / "shap_summary.png"), dpi=150, bbox_inches="tight")
    plt.close()
    logger.info("shap_summary.png saved")

    # Background dataset for runtime use
    bg_idx = rng.choice(len(X_test), size=N_BACKGROUND, replace=False)
    joblib.dump(
        {"background": X_test[bg_idx], "feature_names": feature_names},
        str(xgb_dir / "shap_background.pkl"),
    )
    logger.info("shap_background.pkl saved (%d rows)", N_BACKGROUND)
    logger.info("SHAP analysis complete → %s", xgb_dir)


if __name__ == "__main__":
    run()
