"""Shared test fixtures."""
from __future__ import annotations

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.services.inference import inference_service

# In-memory SQLite for tests
TEST_DB_URL = "sqlite+aiosqlite:///:memory:"


@pytest_asyncio.fixture(scope="session")
async def db_engine():
    engine = create_async_engine(TEST_DB_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest_asyncio.fixture
async def db_session(db_engine):
    factory = async_sessionmaker(db_engine, class_=AsyncSession, expire_on_commit=False)
    async with factory() as session:
        yield session


@pytest_asyncio.fixture
async def client(db_session):
    app.dependency_overrides[get_db] = lambda: db_session

    # Patch model so tests don't need real artefacts
    class _FakeResult:
        label = "DDoS"
        confidence = 0.97
        is_attack = True
        severity = "CRITICAL"
        class_probabilities = {"Benign": 0.03, "DDoS": 0.97}

    inference_service._predict_sync = lambda features: _FakeResult()
    inference_service._model = object()  # truthy
    inference_service._feature_names = ["f1", "f2"]
    inference_service._scaler = None
    inference_service._label_encoder = type("LE", (), {"classes_": ["Benign", "DDoS"]})()

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()
