"""POST /api/v1/predict  — single and batch prediction endpoints."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_optional_db
from app.core.rate_limiter import limiter
from app.core.security import TokenScope, VerifiedToken, verify_api_key
from app.db.models.prediction import Prediction
from app.schemas.prediction import (
    BatchPredictRequest, BatchPredictionResponse,
    PredictRequest, PredictionResponse,
)
from app.services.inference import inference_service
from app.core.config import settings

from fastapi import UploadFile, File, BackgroundTasks
import pandas as pd
import json
import random
import asyncio
from aiokafka import AIOKafkaProducer

router = APIRouter(prefix="/predict", tags=["Prediction"])

_upload_cancel_requested = False


async def _run_prediction(
    req: PredictRequest, db: AsyncSession | None
) -> PredictionResponse:
    result = await inference_service.predict(req.features)
    prediction_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc)

    if db is None:
        return PredictionResponse(
            id=prediction_id,
            label=result.label,
            confidence=result.confidence,
            is_attack=result.is_attack,
            created_at=created_at,
            source_ip=req.source_ip,
            destination_ip=req.destination_ip,
        )

    pred = Prediction(
        id=prediction_id,
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


@router.post("", response_model=PredictionResponse)
@limiter.limit("30/minute")
async def predict(
    req: PredictRequest,
    request: Request,
    db: AsyncSession | None = Depends(get_optional_db),
    token: VerifiedToken = Depends(verify_api_key),
):
    """Classify a single network flow and return label + confidence."""
    try:
        if not token.has_permission(TokenScope.PREDICT):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This endpoint requires predict scope.",
            )
        return await _run_prediction(req, db)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc


@router.post("/batch", response_model=BatchPredictionResponse)
@limiter.limit("10/minute")
async def predict_batch(
    req: BatchPredictRequest,
    request: Request,
    db: AsyncSession | None = Depends(get_optional_db),
    token: VerifiedToken = Depends(verify_api_key),
):
    """Classify up to 1000 network flows in one request."""
    if not token.has_permission(TokenScope.PREDICT):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint requires predict scope.",
        )
    results = [await _run_prediction(r, db) for r in req.records]
    return BatchPredictionResponse(results=results, total=len(results))


import logging

logger = logging.getLogger(__name__)

async def _process_csv_and_publish(rows: list[dict]):
    """Background task to publish CSV rows to Kafka."""
    try:
        global _upload_cancel_requested
        logger.info(f"Starting to process {len(rows)} rows from CSV")
        
        sample_ips = [
            "192.168.1.10", "10.0.0.5", "172.16.0.3", "203.0.113.42", "198.51.100.7",
        ]

        logger.info(f"Connecting to Kafka at {settings.kafka_bootstrap_servers}")
        producer = AIOKafkaProducer(
            bootstrap_servers=settings.kafka_bootstrap_servers,
            value_serializer=lambda value: json.dumps(value).encode("utf-8"),
        )
        await producer.start()
        
        try:
            for i, row in enumerate(rows):
                if _upload_cancel_requested:
                    logger.info("Upload processing cancelled by user.")
                    break
                
                # Clean row: remove Label if present and strip whitespace from keys
                features = {}
                for k, v in row.items():
                    clean_k = str(k).strip()
                    if clean_k.lower() != "label":
                        try:
                            # Handle pandas NaN or None
                            import math
                            if pd.isna(v) or v == "" or v is None:
                                features[clean_k] = 0.0
                            else:
                                f_val = float(v)
                                if math.isinf(f_val) or math.isnan(f_val):
                                    features[clean_k] = 0.0
                                else:
                                    features[clean_k] = f_val
                        except (ValueError, TypeError):
                            features[clean_k] = 0.0
                    
                payload = {
                    "features": features,
                    "source_ip": random.choice(sample_ips),
                    "destination_ip": random.choice(sample_ips),
                }
                await producer.send_and_wait(settings.kafka_topic_traffic, payload)
                if i % 100 == 0:
                    logger.info(f"Sent {i} messages")
                # Add a random delay to simulate realistic live traffic stream
                await asyncio.sleep(random.uniform(0.0, 2.0))
        finally:
            _upload_cancel_requested = False
            await producer.stop()
            logger.info("Finished processing CSV and stopped producer")
    except Exception as e:
        logger.error(f"Error in _process_csv_and_publish: {e}", exc_info=True)


@router.post("/upload")
@limiter.limit("5/minute")
async def upload_csv_predict(
    background_tasks: BackgroundTasks,
    request: Request,
    file: UploadFile = File(...),
    token: VerifiedToken = Depends(verify_api_key),
):
    """Upload a CSV of network logs to be processed dynamically."""
    
    global _upload_cancel_requested
    _upload_cancel_requested = False

    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV files are supported.",
        )

    try:
        df = pd.read_csv(file.file)
        rows = df.to_dict(orient="records")
        rows_queued = len(rows)
        background_tasks.add_task(_process_csv_and_publish, rows)
        return {"status": "accepted", "rows_queued": rows_queued, "message": "CSV upload accepted. Traffic is being simulated to the dashboard."}
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process CSV: {str(exc)}"
        )

@router.post("/upload/cancel")
async def cancel_upload(token: VerifiedToken = Depends(verify_api_key)):
    """Cancel any active background CSV upload streams."""
    global _upload_cancel_requested
    _upload_cancel_requested = True
    return {"message": "Cancellation requested. The active upload stream will stop momentarily."}
