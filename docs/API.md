# XGuard-AI — API Reference

**Base URL:** `http://localhost:8000/api/v1`  
**Authentication:** All endpoints (except `/health`) require `X-API-Key: <your_key>` header.

---

## Health

### `GET /health`
No auth required. Used by Docker health checks and load balancers.

**Response `200`:**
```json
{
  "status": "ok",
  "model_loaded": true,
  "shap_loaded": true,
  "shap_error": null,
  "model_type": "xgboost",
  "environment": "development"
}
```

---

## Prediction

### `POST /predict`
Classify a single network flow.

**Request:**
```json
{
  "features": {
    "Flow Duration": 1200,
    "Total Fwd Packets": 12,
    "Total Backward Packets": 8,
    "Flow Bytes/s": 4500.0
  },
  "source_ip": "192.168.1.5",
  "destination_ip": "10.0.0.1"
}
```

**Response `200`:**
```json
{
  "id": "3f2a1b4c-...",
  "label": "DDoS",
  "confidence": 0.9812,
  "is_attack": true,
  "created_at": "2026-04-04T07:00:00Z",
  "source_ip": "192.168.1.5",
  "destination_ip": "10.0.0.1"
}
```

---

### `POST /predict/batch`
Classify up to 1000 flows in a single request.

**Request:**
```json
{
  "records": [
    { "features": { "Flow Duration": 1200 } },
    { "features": { "Flow Duration": 500 } }
  ]
}
```

**Response `200`:**
```json
{
  "results": [ ...PredictionResponse... ],
  "total": 2
}
```

---

## Explainability

### `GET /explain/{prediction_id}`
Returns SHAP feature attributions for a stored prediction.

**Response `200`:**
```json
{
  "prediction_id": "3f2a1b4c-...",
  "label": "DDoS",
  "reason": "Flagged as DDoS. Key indicators: Flow Bytes/s (increases risk, impact=0.821); Total Fwd Packets (increases risk, impact=0.543); Flow Duration (decreases risk, impact=0.102).",
  "top_features": [
    { "feature": "Flow Bytes/s", "shap_value": 0.821, "direction": "increases risk" },
    { "feature": "Total Fwd Packets", "shap_value": 0.543, "direction": "increases risk" }
  ]
}
```

**Response `404`:** Prediction ID not found.

---

## Alerts

### `GET /alerts`
Paginated alert history.

**Query params:**
| Param | Type | Default | Description |
|---|---|---|---|
| `page` | int | 1 | Page number |
| `page_size` | int | 50 | Results per page (max 200) |
| `attack_type` | string | — | Filter by attack type |

**Response `200`:**
```json
{
  "alerts": [
    {
      "id": "...",
      "created_at": "2026-04-04T07:00:00Z",
      "prediction_id": "...",
      "attack_type": "DDoS",
      "confidence": 0.98,
      "severity": "CRITICAL",
      "reason": "Flagged as DDoS ...",
      "source_ip": "192.168.1.5",
      "destination_ip": "10.0.0.1"
    }
  ],
  "total": 142,
  "page": 1,
  "page_size": 50
}
```

**Severity levels:** `LOW` (<60%) `MEDIUM` (60-80%) `HIGH` (80-95%) `CRITICAL` (>95%)

---

### `WS /alerts/live`
WebSocket endpoint for real-time alert streaming.

```javascript
const ws = new WebSocket("ws://localhost:8000/api/v1/alerts/live");
ws.onmessage = (event) => {
  const alert = JSON.parse(event.data);
  console.log(alert.attack_type, alert.severity, alert.reason);
};
```

Each message is the same schema as a single alert object above.

---

## Interactive Docs

Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)  
ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
