"""
XGuard-AI FastAPI Application

Lifespan:
  startup  → load model artefacts, run DB migrations, start Kafka consumer
  shutdown → cancel consumer task
"""
from __future__ import annotations

import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.logging import setup_logging
from app.db.base import Base
from app.db.session import engine
from app.services.explainer import explainer_service
from app.services.inference import inference_service
from app.services.kafka_consumer import consume_forever

setup_logging()
logger = logging.getLogger(__name__)

_consumer_task: asyncio.Task | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _consumer_task

    # ── Startup ───────────────────────────────────────────────────────────
    logger.info("XGuard-AI starting …")

    # Run DB migrations (create tables if not exist)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables ready")

    # Load ML model + SHAP explainer
    inference_service.load(settings.models_path)
    explainer_service.load(settings.models_path)

    # Start Kafka consumer as background task
    _consumer_task = asyncio.create_task(consume_forever())
    logger.info("Kafka consumer task started")

    yield

    # ── Shutdown ──────────────────────────────────────────────────────────
    if _consumer_task:
        _consumer_task.cancel()
        try:
            await _consumer_task
        except asyncio.CancelledError:
            pass
    await engine.dispose()
    logger.info("XGuard-AI shutdown complete")


app = FastAPI(
    title="XGuard-AI",
    description="Explainable AI-Powered Network Intrusion Detection System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
