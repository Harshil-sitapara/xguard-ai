from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )
    prediction_id: Mapped[str] = mapped_column(String(36), index=True)
    attack_type: Mapped[str] = mapped_column(String(64), index=True)
    confidence: Mapped[float] = mapped_column(Float)
    severity: Mapped[str] = mapped_column(String(16))  # LOW | MEDIUM | HIGH | CRITICAL
    reason: Mapped[str] = mapped_column(String(512), nullable=True)
    source_ip: Mapped[str] = mapped_column(String(64), nullable=True)
    destination_ip: Mapped[str] = mapped_column(String(64), nullable=True)
