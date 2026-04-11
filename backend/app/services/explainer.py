"""
XGuard-AI — SHAP Explainer Service

Generates per-prediction SHAP explanations using TreeExplainer.
Loaded once at startup; explain() called on-demand per API request.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path

import joblib
import numpy as np
import shap
from starlette.concurrency import run_in_threadpool
import xgboost as xgb

logger = logging.getLogger(__name__)

TOP_N = 10  # feature contributions returned per explanation


@dataclass
class SHAPResult:
    prediction_id: str
    label: str
    top_features: list[dict]   # [{feature, shap_value, direction}]
    reason: str                # plain-English summary


def _build_reason(label: str, top_features: list[dict]) -> str:
    if label == "Benign":
        return "Traffic classified as benign. No anomalous feature patterns detected."
    top = top_features[:3]
    parts = [f"{f['feature']} ({f['direction']}, impact={abs(f['shap_value']):.3f})" for f in top]
    return f"Flagged as {label}. Key indicators: {'; '.join(parts)}."


class ExplainerService:
    def __init__(self) -> None:
        self._explainer: shap.TreeExplainer | None = None
        self._feature_names: list[str] = []
        self._label_encoder = None

    def load(self, models_path: Path) -> None:
        xgb_dir = models_path / "xgboost"
        model = xgb.Booster()
        model.load_model(str(xgb_dir / "model.json"))

        bg_data = joblib.load(str(xgb_dir / "shap_background.pkl"))
        self._feature_names = bg_data["feature_names"]
        self._explainer = shap.TreeExplainer(model, data=bg_data["background"])
        self._label_encoder = joblib.load(str(models_path / "preprocessor" / "label_encoder.pkl"))
        logger.info("SHAP explainer loaded (background=%d rows)", len(bg_data["background"]))

    def _explain_sync(
        self,
        prediction_id: str,
        raw_features: dict[str, float],
        label: str,
        scaler,
    ) -> SHAPResult:
        vec = np.array(
            [raw_features.get(f, 0.0) for f in self._feature_names], dtype=np.float32
        ).reshape(1, -1)
        vec_scaled = scaler.transform(vec)

        label_idx = list(self._label_encoder.classes_).index(label)
        shap_vals = self._explainer.shap_values(vec_scaled)

        # shap_vals: either list[n_classes x (1, n_features)] or array (1, n_features, n_classes)
        if isinstance(shap_vals, list):
            sv = shap_vals[label_idx][0]
        elif isinstance(shap_vals, np.ndarray):
            if len(shap_vals.shape) == 3:
                # New SHAP versions return (n_samples, n_features, n_classes)
                sv = shap_vals[0, :, label_idx]
            else:
                sv = shap_vals[0]
        else:
            sv = shap_vals[0]

        # Build top-N sorted by absolute value
        pairs = sorted(
            zip(self._feature_names, sv),
            key=lambda x: abs(x[1]),
            reverse=True,
        )[:TOP_N]

        top_features = [
            {
                "feature": name,
                "shap_value": round(float(val), 6),
                "direction": "increases risk" if val > 0 else "decreases risk",
            }
            for name, val in pairs
        ]
        return SHAPResult(
            prediction_id=prediction_id,
            label=label,
            top_features=top_features,
            reason=_build_reason(label, top_features),
        )

    async def explain(
        self,
        prediction_id: str,
        raw_features: dict[str, float],
        label: str,
        scaler,
    ) -> SHAPResult:
        return await run_in_threadpool(
            self._explain_sync, prediction_id, raw_features, label, scaler
        )


explainer_service = ExplainerService()
