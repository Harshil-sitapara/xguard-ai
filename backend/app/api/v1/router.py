from fastapi import APIRouter

from app.api.v1.routes import alerts, explain, health, predict, replay

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health.router)
api_router.include_router(predict.router)
api_router.include_router(explain.router)
api_router.include_router(alerts.router)
api_router.include_router(replay.router)
