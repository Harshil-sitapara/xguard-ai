"""Alerts: REST history + WebSocket live stream."""
from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
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
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    attack_type: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    token: VerifiedToken = Depends(verify_api_key),
) -> AlertsListResponse:
    """Paginated alert history with optional attack_type filter."""
    if not token.has_permission(TokenScope.ALERTS):
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint requires alerts scope.",
        )
    q = select(Alert).order_by(Alert.created_at.desc())
    count_q = select(func.count()).select_from(Alert)
    pred_count_q = select(func.count()).select_from(Prediction)
    
    if attack_type:
        q = q.where(Alert.attack_type == attack_type)
        count_q = count_q.where(Alert.attack_type == attack_type)

    total = (await db.execute(count_q)).scalar_one()
    total_predictions = (await db.execute(pred_count_q)).scalar_one()
    
    rows = (await db.execute(q.offset((page - 1) * page_size).limit(page_size))).scalars().all()
    return AlertsListResponse(
        alerts=[AlertResponse.model_validate(r) for r in rows],
        total=total,
        total_predictions=total_predictions,
        page=page,
        page_size=page_size,
    )


@router.websocket("/live")
async def alerts_live(ws: WebSocket):
    """WebSocket endpoint — streams real-time alert JSON as events arrive."""
    await ws_manager.connect(ws)
    try:
        while True:
            await ws.receive_text()   # keep connection alive; client can send pings
    except WebSocketDisconnect:
        ws_manager.disconnect(ws)
