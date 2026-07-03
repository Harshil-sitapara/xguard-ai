"""Alerts: REST history + WebSocket live stream."""
from __future__ import annotations

import asyncio
import logging

from fastapi import APIRouter, Depends, HTTPException, Query, Request, WebSocket, WebSocketDisconnect, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_optional_db
from app.core.config import settings
from app.core.rate_limiter import limiter
from app.core.security import TokenScope, VerifiedToken, verify_api_key
from app.db.models.alert import Alert
from app.db.models.prediction import Prediction
from app.schemas.alert import AlertResponse, AlertsListResponse
from app.services.websocket_manager import ws_manager

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("")
@limiter.limit("50/minute")
async def list_alerts(
    request: Request,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    attack_type: str | None = Query(None),
    db: AsyncSession | None = Depends(get_optional_db),
    token: VerifiedToken = Depends(verify_api_key),
) -> AlertsListResponse:
    """Paginated alert history with optional attack_type filter."""
    try:
        if not token.has_permission(TokenScope.ALERTS):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This endpoint requires alerts scope.",
            )
        if db is None:
            logger.warning("Alerts requested while database is unavailable")
            return AlertsListResponse(
                alerts=[],
                total=0,
                total_predictions=0,
                page=page,
                page_size=page_size,
            )
        q = select(Alert).order_by(Alert.created_at.desc())
        count_q = select(func.count()).select_from(Alert)
        pred_count_q = select(func.count()).select_from(Prediction)

        if attack_type:
            q = q.where(Alert.attack_type == attack_type)
            count_q = count_q.where(Alert.attack_type == attack_type)

        total = (
            await asyncio.wait_for(
                db.execute(count_q),
                timeout=settings.db_query_timeout_seconds,
            )
        ).scalar_one()
        total_predictions = (
            await asyncio.wait_for(
                db.execute(pred_count_q),
                timeout=settings.db_query_timeout_seconds,
            )
        ).scalar_one()

        rows = (
            await asyncio.wait_for(
                db.execute(q.offset((page - 1) * page_size).limit(page_size)),
                timeout=settings.db_query_timeout_seconds,
            )
        ).scalars().all()
        return AlertsListResponse(
            alerts=[AlertResponse.model_validate(r) for r in rows],
            total=total,
            total_predictions=total_predictions,
            page=page,
            page_size=page_size,
        )
    except HTTPException:
        raise
    except asyncio.TimeoutError as exc:
        logger.warning("Alerts endpoint timed out after %.1f seconds", settings.db_query_timeout_seconds)
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Alert history query timed out. Check database connectivity.",
        ) from exc
    except Exception as exc:
        logger.exception("Alerts endpoint failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc


@router.delete("")
async def clear_alerts(
    db: AsyncSession | None = Depends(get_optional_db),
    token: VerifiedToken = Depends(verify_api_key),
):
    """Clear all historical alerts and predictions from the database."""
    from fastapi import HTTPException, status
    from sqlalchemy import text
    
    if not token.has_permission(TokenScope.ALERTS):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint requires alerts scope.",
        )
    
    if db is None:
        raise HTTPException(status_code=503, detail="Database is unavailable")
        
    try:
        from app.services.kafka_consumer import trigger_seek_to_end
        # Instantly skip all pending messages in the active Kafka queue
        trigger_seek_to_end()
        
        # Using DELETE instead of TRUNCATE to avoid AccessExclusiveLock which hangs 
        # if the background kafka consumer is currently holding a lock
        await db.execute(text("DELETE FROM alerts;"))
        await db.execute(text("DELETE FROM predictions;"))
        await db.commit()
        return {"message": "All dashboard history cleared successfully."}
    except Exception as exc:
        await db.rollback()
        logger.exception("Failed to clear alerts database")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        ) from exc


@router.websocket("/live")
async def alerts_live(ws: WebSocket):
    """WebSocket endpoint — streams real-time alert JSON as events arrive."""
    await ws_manager.connect(ws)
    try:
        while True:
            await ws.receive_text()   # keep connection alive; client can send pings
    except WebSocketDisconnect:
        ws_manager.disconnect(ws)
