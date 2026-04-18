"""
XGuard-AI Kafka consumer background task.

Subscribes to the `network-traffic` topic and keeps retrying until the local
broker is ready.
"""
from __future__ import annotations

import asyncio
import json
import logging
import uuid
from datetime import datetime, timezone

from aiokafka import AIOKafkaConsumer
from aiokafka.errors import KafkaConnectionError

from app.core.config import settings
from app.db.models.alert import Alert
from app.db.models.prediction import Prediction
from app.db.session import AsyncSessionLocal
from app.services.explainer import explainer_service
from app.services.inference import inference_service
from app.services.websocket_manager import ws_manager

logger = logging.getLogger(__name__)


async def _process_message(raw: dict) -> None:
    features: dict[str, float] = raw.get("features", {})
    source_ip: str | None = raw.get("source_ip")
    dest_ip: str | None = raw.get("destination_ip")

    result = await inference_service.predict(features)
    pred_id = str(uuid.uuid4())

    shap_data: dict = {}
    reason = ""
    if result.is_attack:
        shap_result = await explainer_service.explain(
            pred_id, features, result.label, inference_service._scaler
        )
        shap_data = {
            "top_features": shap_result.top_features,
            "reason": shap_result.reason,
        }
        reason = shap_result.reason

    async with AsyncSessionLocal() as db:
        pred = Prediction(
            id=pred_id,
            label=result.label,
            confidence=result.confidence,
            is_attack=result.is_attack,
            features_json=features,
            shap_json=shap_data if shap_data else None,
            source_ip=source_ip,
            destination_ip=dest_ip,
        )
        db.add(pred)

        if result.is_attack:
            alert = Alert(
                id=str(uuid.uuid4()),
                prediction_id=pred_id,
                attack_type=result.label,
                confidence=result.confidence,
                severity=result.severity,
                reason=reason,
                source_ip=source_ip,
                destination_ip=dest_ip,
            )
            db.add(alert)

        await db.commit()

        payload = {
            "id": pred_id,
            "prediction_id": pred_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "attack_type": result.label if result.is_attack else "Benign",
            "is_attack": result.is_attack,
            "confidence": result.confidence,
            "severity": result.severity if result.is_attack else "None",
            "reason": reason,
            "source_ip": source_ip,
            "destination_ip": dest_ip,
        }
        await ws_manager.broadcast(json.dumps(payload))


async def consume_forever() -> None:
    """
    Connect to Kafka and consume messages from the configured topic.

    When the broker is not ready yet, keep retrying instead of parking forever.
    """
    retry_delay = max(float(settings.kafka_retry_delay_seconds), 1.0)
    attempt = 0

    while True:
        try:
            consumer = AIOKafkaConsumer(
                settings.kafka_topic_traffic,
                bootstrap_servers=settings.kafka_bootstrap_servers,
                group_id=settings.kafka_group_id,
                value_deserializer=lambda v: json.loads(v.decode("utf-8")),
                auto_offset_reset="latest",
                enable_auto_commit=True,
            )
            await consumer.start()
            attempt = 0
            logger.info("Kafka consumer started - topic: %s", settings.kafka_topic_traffic)
        except asyncio.CancelledError:
            raise
        except (KafkaConnectionError, OSError, ConnectionError, asyncio.TimeoutError) as exc:
            attempt += 1
            logger.warning(
                "Kafka connection attempt %s failed: %s: %s",
                attempt,
                type(exc).__name__,
                exc,
            )
            logger.info("Retrying Kafka connection in %.1f seconds", retry_delay)
            await asyncio.sleep(retry_delay)
            continue
        except Exception as exc:
            logger.error("Unexpected error while starting Kafka consumer: %s", exc, exc_info=True)
            await asyncio.sleep(retry_delay)
            continue

        try:
            async for msg in consumer:
                try:
                    await _process_message(msg.value)
                except Exception as exc:
                    logger.error("Error processing Kafka message: %s", exc, exc_info=True)
        finally:
            await consumer.stop()
            logger.info("Kafka consumer stopped")

        logger.info("Kafka consumer loop ended, reconnecting in %.1f seconds", retry_delay)
        await asyncio.sleep(retry_delay)
