from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class AlertResponse(BaseModel):
    id: str
    created_at: datetime
    prediction_id: str
    attack_type: str
    confidence: float
    severity: str
    reason: str | None = None
    source_ip: str | None = None
    destination_ip: str | None = None

    model_config = {"from_attributes": True}


class AlertsListResponse(BaseModel):
    alerts: list[AlertResponse]
    total: int
    total_predictions: int = 0
    page: int
    page_size: int
