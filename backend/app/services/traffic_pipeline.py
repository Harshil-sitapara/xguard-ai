from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime, timezone

from app.db import session as db_session
from app.db.models.alert import Alert
from app.db.models.prediction import Prediction
from app.services.explainer import explainer_service
from app.services.inference import inference_service
from app.services.websocket_manager import ws_manager

logger = logging.getLogger(__name__)


async def process_traffic_message(raw: dict) -> dict:
    features: dict[str, float] = raw.get("features", {})
    source_ip: str | None = raw.get("source_ip")
    dest_ip: str | None = raw.get("destination_ip")

    result = await inference_service.predict(features)
    pred_id = str(uuid.uuid4())

    shap_data: dict = {}
    reason = ""
    if result.is_attack:
        try:
            shap_result = await explainer_service.explain(
                pred_id, features, result.label, inference_service._scaler
            )
            shap_data = {
                "top_features": shap_result.top_features,
                "reason": shap_result.reason,
            }
            reason = shap_result.reason
        except Exception as exc:
            logger.warning("SHAP explanation unavailable for %s: %s", pred_id, exc)

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

    if db_session.AsyncSessionLocal is not None:
        try:
            async with db_session.AsyncSessionLocal() as db:
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
        except Exception as exc:
            logger.warning("Failed to persist processed traffic message: %s", exc)

    await ws_manager.broadcast(json.dumps(payload))
    return payload
