from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """SQLAlchemy declarative base shared by all ORM models."""
    pass


# Import ORM models so they are registered on Base.metadata before create_all().
from app.db.models.alert import Alert  # noqa: E402,F401
from app.db.models.prediction import Prediction  # noqa: E402,F401
