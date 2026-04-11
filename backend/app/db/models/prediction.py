from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import JSON, DateTime, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    label: Mapped[str] = mapped_column(String(64), index=True)
    confidence: Mapped[float] = mapped_column(Float)
    is_attack: Mapped[bool] = mapped_column(default=False)
    features_json: Mapped[dict] = mapped_column(JSON, nullable=True)
    shap_json: Mapped[dict] = mapped_column(JSON, nullable=True)
    source_ip: Mapped[str] = mapped_column(String(64), nullable=True)
    destination_ip: Mapped[str] = mapped_column(String(64), nullable=True)
