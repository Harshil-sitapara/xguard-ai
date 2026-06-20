# XGuard-AI — Setup Guide

## Prerequisites

| Tool | Min Version | Purpose |
|---|---|---|
| Python | 3.11 | ML pipeline + backend |
| Docker Desktop | 4.x | Kafka + PostgreSQL |
| Docker Compose | v2 | Multi-service orchestration |

---

## Step 1 — Clone & Configure

```bash
cp .env.example .env
```

Edit `.env`:
- `API_SECRET_KEY` → generate with `openssl rand -hex 32`
- All other defaults work with local Docker

---

## Step 2 — Train the ML Models

```bash
cd ml
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # Linux/macOS

pip install -r requirements.txt

# Run full pipeline: preprocess → train all → evaluate → SHAP
python scripts/run_pipeline.py --step all

# Or run individual steps:
python scripts/run_pipeline.py --step preprocess
python scripts/run_pipeline.py --step train --model xgboost
python scripts/run_pipeline.py --step evaluate
python scripts/run_pipeline.py --step shap
```

> **Note:** Full pipeline on CICIDS2017 (~2.8M rows) takes 20–60 min depending on hardware.  
> XGBoost GridSearchCV is the slowest step.

On completion you will have:
```
ml/models/
├── preprocessor/   scaler.pkl, label_encoder.pkl, feature_names.pkl
├── xgboost/        model.json, metrics.json, shap_background.pkl, shap_summary.png
├── random_forest/  model.pkl, metrics.json
├── lstm/           model.keras, metrics.json
└── evaluation_report.json
```

---

## Step 3 — Start Infrastructure + Backend

```bash
# From project root:
docker compose up -d

# Wait for all services to be healthy (~30s), then verify:
curl http://localhost:8000/api/v1/health
# → {"status": "ok", "model_loaded": true, ...}
```

Services:
| Service | Port | URL |
|---|---|---|
| FastAPI Backend | 8000 | http://localhost:8000 |
| API Docs (Swagger) | 8000 | http://localhost:8000/docs |
| PostgreSQL | 5432 | localhost:5432 |
| Kafka | 9092 | localhost:9092 |

---

## Step 4 — Test a Prediction

```bash
# Set your API key (from .env)
API_KEY="your_api_secret_key"

curl -X POST http://localhost:8000/api/v1/predict \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"features": {"Flow Duration": 1000, "Total Fwd Packets": 5}}'
```

If you run the frontend locally or on Vercel, set `NEXT_PUBLIC_API_TOKEN`
to the same API key value the dashboard should send to the backend.
A blank token will break the REST calls used for alerts history and SHAP lookups.

---

## Step 5 — Simulate Live Traffic (Kafka Producer)

```bash
cd kafka
pip install -r requirements.txt

# Stream 10 messages/second from test dataset
python producer.py --rate 10

# Attack-only mode (triggers alerts)
python producer.py --rate 5 --attack-only
```

Watch live alerts via WebSocket:
```javascript
const ws = new WebSocket("ws://localhost:8000/api/v1/alerts/live");
ws.onmessage = (e) => console.log(JSON.parse(e.data));
```

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ | — | PostgreSQL async connection string |
| `KAFKA_BOOTSTRAP_SERVERS` | ✅ | `kafka:29092` | Kafka broker address |
| `API_SECRET_KEY` | ✅ | — | X-API-Key header value |
| `CORS_ORIGINS` | ⬜ | `http://localhost:3000` | Allowed CORS origins |
| `BEST_MODEL_TYPE` | ⬜ | `xgboost` | Model used for inference |
| `MODELS_DIR` | ⬜ | `/app/models` | Path to model artefacts |
| `ENVIRONMENT` | ⬜ | `development` | Enables SQL echo in dev |
| `LOG_LEVEL` | ⬜ | `INFO` | Python log level |

---

## Stopping Services

```bash
docker compose down       
docker compose down -v    
```
