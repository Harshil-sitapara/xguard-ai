from __future__ import annotations

import logging
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

logger = logging.getLogger(__name__)

# Create engine, but handle invalid database URL gracefully
try:
    engine = create_async_engine(
        settings.database_url,
        pool_size=10,
        max_overflow=20,
        echo=settings.environment == "development",
    )
    logger.info("✓ Database engine created")
except Exception as e:
    logger.warning(f"⚠ Failed to create database engine: {e}")
    logger.info("  Check DATABASE_URL format: should be postgresql+asyncpg://user:pass@host:5432/db")
    engine = None

AsyncSessionLocal = None
if engine:
    AsyncSessionLocal = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    if not AsyncSessionLocal:
        raise RuntimeError("Database not configured. Set DATABASE_URL environment variable.")
    async with AsyncSessionLocal() as session:
        yield session
