"""GET /api/v1/health — liveness and readiness check."""
from __future__ import annotations

import logging

from fastapi import APIRouter
from pydantic import BaseModel

from app.core.config import settings
from app.services.explainer import explainer_service
from app.services.inference import inference_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/health", tags=["Health"])


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    shap_loaded: bool
    shap_error: str | None = None
    model_type: str
    environment: str


@router.get("", response_model=HealthResponse)
async def health():
    """Returns service health. No auth required — suitable for load balancer checks."""
    return HealthResponse(
        status="ok",
        model_loaded=inference_service._model is not None,
        shap_loaded=explainer_service.loaded,
        shap_error=explainer_service.load_error,
        model_type=settings.best_model_type,
        environment=settings.environment,
    )
