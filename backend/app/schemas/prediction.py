from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    features: dict[str, float] = Field(..., description="Feature name → value mapping")
    source_ip: str | None = None
    destination_ip: str | None = None


class BatchPredictRequest(BaseModel):
    records: list[PredictRequest] = Field(..., max_length=1000)


class PredictionResponse(BaseModel):
    id: str
    label: str
    confidence: float
    is_attack: bool
    created_at: datetime
    source_ip: str | None = None
    destination_ip: str | None = None

    model_config = {"from_attributes": True}


class BatchPredictionResponse(BaseModel):
    results: list[PredictionResponse]
    total: int
