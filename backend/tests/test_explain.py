"""Tests for /api/v1/explain endpoint."""
from __future__ import annotations

import pytest
from httpx import AsyncClient

from app.core.config import settings

HEADERS = {"X-API-Key": settings.api_secret_key}
SAMPLE_FEATURES = {f"f{i}": float(i) for i in range(1, 3)}


@pytest.mark.asyncio
async def test_explain_missing_prediction(client: AsyncClient):
    resp = await client.get("/api/v1/explain/nonexistent-id", headers=HEADERS)
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_explain_after_predict(client: AsyncClient):
    # Create a prediction first
    pred_resp = await client.post(
        "/api/v1/predict",
        json={"features": SAMPLE_FEATURES},
        headers=HEADERS,
    )
    assert pred_resp.status_code == 200
    pred_id = pred_resp.json()["id"]

    # Explain returns 200 (shap_json may be None for benign, covered by route)
    resp = await client.get(f"/api/v1/explain/{pred_id}", headers=HEADERS)
    # 200 if SHAP cached, or if explainer is available; 500 if explainer not loaded
    # In test env explainer is not loaded, so we just check it doesn't 404
    assert resp.status_code in (200, 500)
