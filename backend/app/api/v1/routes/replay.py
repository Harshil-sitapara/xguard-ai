from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, Field

from app.core.rate_limiter import limiter
from app.core.security import TokenScope, VerifiedToken, verify_api_key
from app.services.traffic_replay import ReplayState, traffic_replay_manager

router = APIRouter(prefix="/replay", tags=["Replay"])


class ReplayStartRequest(BaseModel):
    rate: float = Field(default=10.0, ge=0, le=500)
    limit: int = Field(default=500, ge=0, le=20000)
    attack_only: bool = False


class ReplayStatusResponse(BaseModel):
    running: bool
    enabled: bool
    available: bool
    rate: float
    limit: int
    attack_only: bool
    started_at: str | None = None
    finished_at: str | None = None
    last_error: str | None = None
    message: str
    environment: str


def _allow_replay_control(token: VerifiedToken) -> bool:
    return token.scope == TokenScope.ADMIN or (
        token.scope == TokenScope.PUBLIC and traffic_replay_manager.status().enabled
    )


def _to_response(state: ReplayState) -> ReplayStatusResponse:
    return ReplayStatusResponse(**state.__dict__)


@router.get("/status", response_model=ReplayStatusResponse)
@limiter.limit("60/minute")
async def replay_status(
    request: Request,
    token: VerifiedToken = Depends(verify_api_key),
):
    if token.scope not in {TokenScope.ADMIN, TokenScope.PUBLIC}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint requires replay access.",
        )
    return _to_response(traffic_replay_manager.status())


@router.post("/start", response_model=ReplayStatusResponse)
@limiter.limit("10/minute")
async def replay_start(
    body: ReplayStartRequest,
    request: Request,
    token: VerifiedToken = Depends(verify_api_key),
):
    if not _allow_replay_control(token):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint requires replay control access.",
        )
    try:
        state = await traffic_replay_manager.start(
            rate=body.rate,
            limit=body.limit,
            attack_only=body.attack_only,
        )
        return _to_response(state)
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc


@router.post("/stop", response_model=ReplayStatusResponse)
@limiter.limit("10/minute")
async def replay_stop(
    request: Request,
    token: VerifiedToken = Depends(verify_api_key),
):
    if not _allow_replay_control(token):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint requires replay control access.",
        )
    state = await traffic_replay_manager.stop()
    return _to_response(state)
