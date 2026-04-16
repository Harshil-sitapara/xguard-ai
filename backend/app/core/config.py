from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    # App
    environment: str = "development"
    log_level: str = "INFO"

    # Database
    database_url: str = "postgresql+asyncpg://xguard:xguard_secret@localhost:5432/xguard"

    # Kafka
    kafka_bootstrap_servers: str = "localhost:9092"
    kafka_topic_traffic: str = "network-traffic"
    kafka_topic_alerts: str = "ids-alerts"
    kafka_group_id: str = "xguard-consumer"

    # Security - API Keys
    api_secret_key: str = "dev_secret_change_in_production"
    api_public_key: str = "dev_public_key_for_frontend"  # Limited-scope public token
    
    # CORS
    cors_origins: List[str] = ["http://localhost:3000"]
    
    # Rate Limiting
    rate_limit_enabled: bool = True
    rate_limit_predict: str = "30/minute"  # 30 requests/minute for predictions
    rate_limit_explain: str = "20/minute"  # 20 requests/minute for explanations
    rate_limit_alerts: str = "50/minute"   # 50 requests/minute for alerts fetch
    rate_limit_default: str = "100/minute" # Default for other endpoints

    # Model
    best_model_type: str = "xgboost"
    models_dir: str = "/app/models"

    @property
    def models_path(self) -> Path:
        return Path(self.models_dir)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings: Settings = get_settings()
