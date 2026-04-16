"""
XGuard-AI — Kafka Consumer Background Task

Subscribes to the 'network-traffic' topic.
For each message: predict → explain → persist to DB → broadcast via WebSocket.
"""
from __future__ import annotations

import asyncio
import json
import logging
import uuid
from datetime import datetime, timezone

from aiokafka import AIOKafkaConsumer
from sqlalchemy.ext.asyncio import AsyncSession

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
    reason: str = ""
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

        # Broadcast ALL traffic to connected WebSocket clients
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
    Connect to Kafka and consume messages from network-traffic topic.
    Gracefully handles connection failures and continues on errors.
    """
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
        logger.info("✓ Kafka consumer started — topic: %s", settings.kafka_topic_traffic)
        try:
            async for msg in consumer:
                try:
                    await _process_message(msg.value)
                except Exception as exc:
                    logger.error("Error processing Kafka message: %s", exc, exc_info=True)
        finally:
            await consumer.stop()
            logger.info("Kafka consumer stopped")
    except (OSError, ConnectionError, asyncio.TimeoutError) as e:
        logger.warning(f"⚠ Kafka connection failed (running without streaming): {type(e).__name__}: {e}")
        logger.info("  Predictions via REST API endpoints will still work")
        # Keep the task alive but don't crash the app
        await asyncio.sleep(float('inf'))  # Sleep forever (will be cancelled at shutdown)
    except Exception as e:
        logger.error(f"❌ Unexpected error in Kafka consumer: {e}", exc_info=True)
        raise
