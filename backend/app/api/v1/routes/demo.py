from __future__ import annotations

import asyncio
from typing import Literal

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status
from pydantic import BaseModel, Field

from app.core.rate_limiter import limiter
from app.core.security import TokenScope, VerifiedToken, verify_api_key
from app.services.demo_traffic import DemoScenario, build_demo_payloads
from app.services.traffic_pipeline import process_traffic_message

router = APIRouter(prefix="/demo", tags=["Demo"])


class DemoSimulateRequest(BaseModel):
    scenario: DemoScenario = "mixed"
    count: int = Field(default=12, ge=1, le=50)
    interval_ms: int = Field(default=500, ge=0, le=5000)


class DemoSimulateResponse(BaseModel):
    accepted: bool
    scenario: Literal["benign", "attack", "mixed"]
    count: int
    interval_ms: int


async def _run_demo_stream(scenario: DemoScenario, count: int, interval_ms: int) -> None:
    payloads = build_demo_payloads(scenario, count)
    for index, payload in enumerate(payloads):
        await process_traffic_message(payload)
        if interval_ms > 0 and index < len(payloads) - 1:
            await asyncio.sleep(interval_ms / 1000)


@router.post("/simulate", response_model=DemoSimulateResponse)
@limiter.limit("5/minute")
async def simulate_demo_traffic(
    body: DemoSimulateRequest,
    background_tasks: BackgroundTasks,
    request: Request,
    token: VerifiedToken = Depends(verify_api_key),
):
    if token.scope not in {TokenScope.ADMIN, TokenScope.PUBLIC}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint requires demo access.",
        )

    background_tasks.add_task(
        _run_demo_stream,
        body.scenario,
        body.count,
        body.interval_ms,
    )

    return DemoSimulateResponse(
        accepted=True,
        scenario=body.scenario,
        count=body.count,
        interval_ms=body.interval_ms,
    )
