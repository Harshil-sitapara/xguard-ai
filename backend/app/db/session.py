from __future__ import annotations

import logging
from collections.abc import AsyncGenerator
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from typing import Optional

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

    sslmode = query.pop("sslmode", None)
    if sslmode:
        connect_args["ssl"] = sslmode

    normalized_url = urlunsplit(
        (parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment)
    )
    return normalized_url, connect_args

def init_db():
    """Initialize database engine and session factory. Called during app startup."""
    global engine, AsyncSessionLocal
    
    if not settings.database_url:
        logger.warning("⚠ DATABASE_URL not configured - running without persistence")
        return False
    
    try:
        database_url, connect_args = _normalize_database_url(settings.database_url)
        engine = create_async_engine(
            database_url,
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
        raise RuntimeError(
            "Database not configured. Set DATABASE_URL with correct format: "
            "postgresql+asyncpg://user:pass@host:port/db?sslmode=require"
        )
    async with AsyncSessionLocal() as session:
        yield session
