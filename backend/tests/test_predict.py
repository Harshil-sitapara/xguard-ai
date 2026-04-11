"""Tests for /api/v1/predict endpoints."""
from __future__ import annotations

import pytest
from httpx import AsyncClient

from app.core.config import settings

HEADERS = {"X-API-Key": settings.api_secret_key}
SAMPLE_FEATURES = {f"f{i}": float(i) for i in range(1, 3)}


@pytest.mark.asyncio
async def test_predict_single(client: AsyncClient):
    resp = await client.post(
        "/api/v1/predict",
        json={"features": SAMPLE_FEATURES},
        headers=HEADERS,
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["label"] == "DDoS"
    assert data["is_attack"] is True
    assert 0 < data["confidence"] <= 1


@pytest.mark.asyncio
async def test_predict_no_api_key(client: AsyncClient):
    resp = await client.post("/api/v1/predict", json={"features": SAMPLE_FEATURES})
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_predict_batch(client: AsyncClient):
    resp = await client.post(
        "/api/v1/predict/batch",
        json={"records": [{"features": SAMPLE_FEATURES}] * 3},
        headers=HEADERS,
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 3
    assert len(data["results"]) == 3


@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    resp = await client.get("/api/v1/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"
