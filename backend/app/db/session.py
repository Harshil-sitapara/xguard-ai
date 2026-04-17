from __future__ import annotations

import logging
from collections.abc import AsyncGenerator
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

logger = logging.getLogger(__name__)

# Database engine initialized lazily (None if DATABASE_URL is invalid)
engine: Optional[object] = None
AsyncSessionLocal: Optional[object] = None


def _normalize_database_url(raw_url: str) -> tuple[str, dict]:
    """Translate URL query params unsupported by asyncpg into connect_args."""
    parts = urlsplit(raw_url)
    query = dict(parse_qsl(parts.query, keep_blank_values=True))
    connect_args: dict = {"server_settings": {"jit": "off"}}

    scheme = parts.scheme
    if scheme in {"postgres", "postgresql"}:
        scheme = "postgresql+asyncpg"

    sslmode = query.pop("sslmode", None)
    if sslmode:
        connect_args["ssl"] = sslmode

    normalized_url = urlunsplit(
        (scheme, parts.netloc, parts.path, urlencode(query), parts.fragment)
    )
    return normalized_url, connect_args


def init_db(database_url: str | None = None):
    """Initialize database engine and session factory. Called during app startup."""
    global engine, AsyncSessionLocal
    raw_database_url = database_url or settings.database_url
    
    if not raw_database_url:
        logger.warning("⚠ DATABASE_URL not configured - running without persistence")
        return False
    
    try:
        normalized_url, connect_args = _normalize_database_url(raw_database_url)
        engine = create_async_engine(
            normalized_url,
            connect_args=connect_args,
            pool_size=10,
            max_overflow=20,
            echo=settings.environment == "development",
        )
        AsyncSessionLocal = async_sessionmaker(
            engine, class_=AsyncSession, expire_on_commit=False
        )
        logger.info("✓ Database engine initialized")
        return True
    except Exception as e:
        logger.warning(f"⚠ Failed to initialize database: {e}")
        logger.info("  App will continue without database persistence")
        engine = None
        AsyncSessionLocal = None
        return False


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Get async database session. Raises error if database not available."""
    if not AsyncSessionLocal:
        init_db()

    if not AsyncSessionLocal:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database is unavailable. Check DATABASE_URL configuration.",
        )

    async def _open_verified_session() -> AsyncGenerator[AsyncSession, None]:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
            yield session

    try:
        async for session in _open_verified_session():
            yield session
    except Exception as exc:
        logger.warning("Database session unavailable: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database is unavailable.",
        ) from exc


async def get_optional_db() -> AsyncGenerator[AsyncSession | None, None]:
    """Yield a database session when available, otherwise fall back to None."""
    try:
        async for session in get_db():
            yield session
            return
    except HTTPException as exc:
        if exc.status_code != status.HTTP_503_SERVICE_UNAVAILABLE:
            raise
        logger.warning("Continuing without database access: %s", exc.detail)
        yield None
