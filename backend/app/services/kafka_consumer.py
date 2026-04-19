"""
XGuard-AI Kafka consumer background task.

Subscribes to the `network-traffic` topic and keeps retrying until the local
broker is ready.
"""
from __future__ import annotations

import asyncio
import json
import logging

from aiokafka import AIOKafkaConsumer
from aiokafka.errors import KafkaConnectionError

from app.core.config import settings
from app.services.traffic_pipeline import process_traffic_message

logger = logging.getLogger(__name__)


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
                    await process_traffic_message(msg.value)
                except Exception as exc:
                    logger.error("Error processing Kafka message: %s", exc, exc_info=True)
        finally:
            await consumer.stop()
            logger.info("Kafka consumer stopped")

        logger.info("Kafka consumer loop ended, reconnecting in %.1f seconds", retry_delay)
        await asyncio.sleep(retry_delay)
