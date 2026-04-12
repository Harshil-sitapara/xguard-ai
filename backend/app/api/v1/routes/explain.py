"""GET /api/v1/explain/{prediction_id} — SHAP explanation for a prediction."""
from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.security import verify_api_key
from app.db.models.prediction import Prediction
from app.services.explainer import explainer_service
from app.services.inference import inference_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/explain", tags=["Explainability"])


class ExplainResponse(BaseModel):
    prediction_id: str
    label: str
    reason: str
    top_features: list[dict]


@router.get("/{prediction_id}", response_model=ExplainResponse, dependencies=[Depends(verify_api_key)])
async def explain(prediction_id: str, db: AsyncSession = Depends(get_db)):
    """Return SHAP feature attributions for a stored prediction."""
    result = await db.execute(
        select(Prediction).where(Prediction.id == prediction_id)
    )
    pred = result.scalar_one_or_none()
    if not pred:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prediction not found")

    # Return cached SHAP if available
    if pred.shap_json:
        return ExplainResponse(
            prediction_id=pred.id,
            label=pred.label,
            reason=pred.shap_json.get("reason", ""),
            top_features=pred.shap_json.get("top_features", []),
        )

    # Check if explainer is available
    if not explainer_service._loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="SHAP explainer not available. Generate SHAP background data by running: python scripts/run_pipeline.py --step shap"
        )
    
    # Compute on demand for benign predictions (not pre-computed)
    shap_result = await explainer_service.explain(
        pred.id,
        pred.features_json or {},
        pred.label,
        inference_service._scaler,
    )
    # Persist for future calls
    pred.shap_json = {"top_features": shap_result.top_features, "reason": shap_result.reason}
    await db.commit()

    return ExplainResponse(
        prediction_id=pred.id,
        label=pred.label,
        reason=shap_result.reason,
        top_features=shap_result.top_features,
    )
