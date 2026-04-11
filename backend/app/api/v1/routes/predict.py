"""POST /api/v1/predict  — single and batch prediction endpoints."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.security import verify_api_key
from app.db.models.prediction import Prediction
from app.schemas.prediction import (
    BatchPredictRequest, BatchPredictionResponse,
    PredictRequest, PredictionResponse,
)
from app.services.inference import inference_service

router = APIRouter(prefix="/predict", tags=["Prediction"])


async def _run_prediction(req: PredictRequest, db: AsyncSession) -> PredictionResponse:
    result = await inference_service.predict(req.features)
    pred = Prediction(
        id=str(uuid.uuid4()),
        label=result.label,
        confidence=result.confidence,
        is_attack=result.is_attack,
        features_json=req.features,
        source_ip=req.source_ip,
        destination_ip=req.destination_ip,
    )
    db.add(pred)
    await db.commit()
    await db.refresh(pred)
    return PredictionResponse.model_validate(pred)


@router.post("", response_model=PredictionResponse, dependencies=[Depends(verify_api_key)])
async def predict(req: PredictRequest, db: AsyncSession = Depends(get_db)):
    """Classify a single network flow and return label + confidence."""
    return await _run_prediction(req, db)


@router.post("/batch", response_model=BatchPredictionResponse, dependencies=[Depends(verify_api_key)])
async def predict_batch(req: BatchPredictRequest, db: AsyncSession = Depends(get_db)):
    """Classify up to 1000 network flows in one request."""
    results = [await _run_prediction(r, db) for r in req.records]
    return BatchPredictionResponse(results=results, total=len(results))
