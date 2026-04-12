---
name: XGuard AI IDS Project Instructions
description: "Workspace conventions, build commands, architecture, and development setup for the IDS (Intrusion Detection System) project. Uses FastAPI backend, Next.js frontend, ML models (XGBoost, LSTM, RF), Kafka streaming, and PostgreSQL. Follow these for productive work across all components."
---

# XGuard AI IDS Project Instructions

This workspace implements a **real-time Intrusion Detection System (IDS)** with AI explainability. It integrates an ML backend (FastAPI), streaming infrastructure (Kafka), and interactive dashboard (Next.js).

## Quick Architecture

```
┌─────────────────────────────┐       ┌──────────────────────┐
│  ML Pipeline                │       │  Kafka Producer      │
│  (train: RF, XGBoost, LSTM) │       │  (network flows)     │
└──────────┬──────────────────┘       └──────────┬───────────┘
           │                                     │
           │  (loaded at startup)                │  (publishes to topic)
           │                                     │
           └──────────────┬──────────────────────┘
                          │
        ┌─────────────────▼──────────────────┐
        │  Backend (FastAPI @ :8000)         │
        │  • Kafka Consumer → predict        │
        │  • SHAP Explainer                  │
        │  • WebSocket broadcasts            │
        └────────┬─────────────────┬─────────┘
                 │                 │
        ┌────────▼────────┐   ┌────▼──────────┐
        │  PostgreSQL     │   │  Frontend     │
        │  (predictions   │   │  (Next.js @   │
        │   & alerts)     │   │   :3000)      │
        └─────────────────┘   └───────────────┘
```

## Build & Test Commands

### Backend (FastAPI + SQLAlchemy + Async)

| Task | Command | Notes |
|------|---------|-------|
| Install deps | `pip install -r backend/requirements.txt` | Python 3.11+, async-first |
| Run tests | `cd backend && pytest` | pytest.ini: asyncio_mode=auto, uses in-memory SQLite |
| Dev server | `cd backend && uvicorn app.main:app --reload` | Hot-reload @ localhost:8000 |
| Migrations | auto on startup | Alembic manages schema via `Base.metadata.create_all()` |
| API docs | `http://localhost:8000/docs` (Swagger UI) | Auto-generated from FastAPI |

### Frontend (Next.js + TypeScript + Tailwind)

| Task | Command | Notes |
|------|---------|-------|
| Install deps | `cd frontend && npm install` | Node 18.19+ recommended |
| Dev server | `npm run dev` | Turbopack @ localhost:3000 |
| Build prod | `npm run build && npm run start` | Production bundle |
| Lint | `npm run lint` | ESLint 9 + Prettier |
| Type check | `npm run typecheck` | tsc --noEmit |

### ML Pipeline (XGBoost, LSTM, Random Forest)

| Task | Command | Duration | Notes |
|------|---------|----------|-------|
| Full retrain | `cd ml && python scripts/run_pipeline.py --step all` | 20–60 min | Preprocess → Train all 3 models → Evaluate → SHAP analysis |
| Train one model | `python scripts/run_pipeline.py --step train --model xgboost` | varies | Output: `ml/models/{xgboost,lstm,random_forest}/` |
| Preprocess only | `--step preprocess` | ~5 min | CICIDS2017 dataset → scaled, encoded labels |
| Evaluate metrics | `--step evaluate` | ~10 min | Generates `ml/models/evaluation_report.json` |
| SHAP analysis | `--step shap` | ~15 min | Creates SHAP background pickle + summary plots |

### Infrastructure & Real-Time Simulation

| Task | Command | Notes |
|------|---------|-------|
| Start all services | `docker compose up -d` | Kafka, Postgres, Backend, Zookeeper (health checks ~30s) |
| Simulate traffic | `cd kafka && python producer.py --rate 10` | 10 flows/sec to topic `network-traffic` |
| Attack-only mode | `python producer.py --attack-only` | Only malicious flows |
| Health check | `curl http://localhost:8000/api/v1/health` | Should return `{"status": "ok"}` |
| Backend logs | `docker compose logs -f backend` | Follow real-time logs |

---

## Development Setup (First Time)

1. **Clone & Environment**
   ```bash
   git clone <repo>
   cd ids-final
   cp .env.example .env  # **Mandatory**
   # Edit .env: set API_SECRET_KEY, DB credentials, Kafka broker
   ```

2. **Train ML Models** (~20–60 min)
   ```bash
   cd ml
   python scripts/run_pipeline.py --step all
   # Outputs trained models → ml/models/{xgboost,lstm,random_forest}/
   ```

3. **Start Infrastructure**
   ```bash
   docker compose up -d
   # Waits for Kafka, Postgres, health checks
   ```

4. **Verify Backend Ready**
   ```bash
   curl http://localhost:8000/api/v1/health
   # Returns: {"status": "ok"}
   ```

5. **Start Frontend Dev Server**
   ```bash
   cd frontend
   npm install
   npm run dev
   # Open http://localhost:3000
   ```

6. **Simulate Traffic** (in separate terminal)
   ```bash
   cd kafka
   python producer.py --rate 10
   ```

**Expected**: Backend logs show predictions flowing; frontend dashboard displays live alerts with SHAP explanations.

---

## Directory Structure & Conventions

```
.github/                           # Workspace customizations
app/core/config.py                 # Pydantic BaseSettings (load .env)
README.md                          # Project overview + mermaid diagrams
docs/
  ├── SETUP.md                    # Detailed setup guide (link esp. for new devs)
  ├── API.md                      # API endpoint specs + auth (X-API-Key required)
  └── MODEL_GUIDE.md              # ML model selection, retraining, hyperparameters

backend/
  ├── app/
  │   ├── api/v1/routes/          # Endpoint handlers (predict, explain, etc.)
  │   ├── services/
  │   │   ├── inference.py        # XGBoost predict() calls
  │   │   ├── explainer.py        # SHAP TreeExplainer
  │   │   ├── kafka_consumer.py   # Async consumer → predict → broadcast
  │   │   └── websocket_manager.py# Frontend real-time updates
  │   ├── db/models/              # SQLAlchemy ORM models (Alert, Prediction)
  │   └── core/
  │       ├── config.py           # Environment config
  │       ├── logging.py          # Structured logging
  │       └── security.py         # API key validation
  ├── tests/                      # pytest fixtures, unit/integration tests
  └── requirements.txt            # Pin exact versions (critical for production)

frontend/
  ├── app/
  │   ├── layout.tsx              # Root layout (providers, theme)
  │   └── page.tsx                # Home page → Dashboard
  ├── components/
  │   ├── ui/                     # shadcn primitives (Button, Card, Dialog, etc.)
  │   └── dashboard/              # Feature components (charts, SHAP dialog, feed)
  ├── hooks/use-alerts.ts         # WebSocket listener hook
  ├── lib/api.ts                  # Fetch wrapper + backend client
  └── tsconfig.json               # Strict mode enabled

ml/
  ├── data/
  │   ├── raw/MachineLearningCVE/ # CICIDS2017 CSVs
  │   └── processed/              # Parquet files (preprocessed)
  ├── models/
  │   ├── xgboost/                # Primary model (model.json, metrics.json)
  │   ├── random_forest/
  │   └── lstm/
  ├── src/
  │   ├── preprocess.py           # Feature scaling, label encoding
  │   ├── train_xgboost.py        # Train XGBoost (e.g., max_depth tuning)
  │   ├── train_lstm.py           # Keras LSTM for academic comparison
  │   ├── train_rf.py             # Random Forest baseline
  │   └── shap_analysis.py        # SHAP TreeExplainer background prep
  └── scripts/run_pipeline.py     # CLI orchestrator (⬅ use this for training)

kafka/producer.py                 # Simulate network flows → Kafka topic
```

---

## Key Technology Stack

| Layer | Tech | Version | Purpose |
|-------|------|---------|---------|
| **Backend** | FastAPI, Uvicorn | 0.111+, 0.29+ | ASGI web framework + async runner |
| **Backend ORM** | SQLAlchemy | 2.0.30+ | Async ORM for Postgres |
| **Backend Async** | aiokafka, asyncpg | 0.10+, 0.29+ | Async Kafka + Postgres drivers |
| **ML Serving** | XGBoost | 2.1.3 | Primary inference model |
| **ML Train** | scikit-learn, TensorFlow | 1.6.1, 2.19.0 | RF baseline; LSTM academic |
| **Explainability** | SHAP | 0.46+ | TreeExplainer for XGBoost |
| **Testing** | pytest, pytest-asyncio | 8.2+, 0.23.7+ | Unit + async integration tests |
| **Frontend** | Next.js, React, TypeScript | 16.1.7, 19.2.4, 5.9.3 | SSR framework + FE type safety |
| **Frontend UI** | Tailwind CSS, shadcn/ui | 4.2.1, 4.1.2 | Utility CSS + component library |
| **Streaming** | Kafka, Zookeeper | 7.6.0 (Confluent) | Event streaming backbone |
| **Database** | PostgreSQL | 16-alpine | Persistent storage |

---

## Coding Standards & Patterns

### Python (Backend + ML)
- **Type hints** required (PEP 484): `def predict(features: dict[str, float]) -> dict[str, Any]:`
- **Docstrings** on all public functions (module, class, method level)
- **Async-first** for I/O: FastAPI routes, Kafka consumers, DB queries use `async/await`
- **Config via Pydantic** `BaseSettings` in `app/core/config.py` (load from `.env`)
- **Error handling**: Raise `HTTPException(status_code, detail)` from FastAPI routes
- **Database**: Declarative SQLAlchemy models (see `backend/app/db/models/`)
- **Testing**: Use pytest fixtures (`conftest.py`), dependency_overrides for mocks

#### Example FastAPI Route
```python
@router.post("/api/v1/predict")
async def predict_route(req: PredictionRequest, db: AsyncSession = Depends(get_db)) -> dict:
    features = req.features  # Pydantic validation
    pred = InferenceService.predict(features)
    alert = Alert(prediction_id=pred["id"], label=pred["label"])
    db.add(alert)
    await db.commit()
    return pred
```

### TypeScript (Frontend)
- **Strict mode** enabled (`tsconfig.json`)
- **Component-driven** folder structure (`components/{ui,dashboard}`)
- **API calls isolated** in `lib/api.ts` (fetch wrapper)
- **Hooks** in `hooks/` (e.g., `use-alerts.ts` listens to WebSocket)
- **Styling** via Tailwind utilities + shadcn presets (no custom CSS unless necessary)

#### Example Next.js Component
```typescript
// components/dashboard/stat-cards.tsx
import { Card } from "@/components/ui/card";

export function StatCards({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card><p className="text-lg font-bold">{alerts.length}</p></Card>
    </div>
  );
}
```

### Database (SQLAlchemy + Alembic)
- **Define models** in `backend/app/db/models/`
- **Auto-migration** on backend startup (vs. manual `alembic upgrade head`)
- **Async sessions** via `AsyncSession` (see `backend/app/db/session.py`)

---

## API Reference (Link to Full Docs)

**See [docs/API.md](../docs/API.md) for complete endpoint specs.**

### Auth
- All endpoints except `/api/v1/health` require header: `X-API-Key: <API_SECRET_KEY>`
- Key from `.env` `API_SECRET_KEY`

### Key Endpoints
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/health` | GET | Service health check |
| `/api/v1/predict` | POST | Single flow prediction + SHAP metadata |
| `/api/v1/predict/batch` | POST | Batch predict (≤1000 flows) |
| `/api/v1/explain/{prediction_id}` | GET | SHAP feature attributions |

---

## ML Model Selection & Retraining

**See [docs/MODEL_GUIDE.md](../docs/MODEL_GUIDE.md) for detailed model comparison.**

### Why XGBoost (Production Model)
- **Speed**: ~<1ms inference per flow
- **Accuracy**: Highest F1 on CIC-IDS 2017
- **SHAP**: `TreeExplainer` is O(n) fast (vs. O(2^n) for `ExactExplainer`)
- **Size**: Compact `model.json` → easy deployment

### Retrain a Model
```bash
cd ml
python scripts/run_pipeline.py --step train --model xgboost
# Or: --model lstm, --model random_forest
```

### Switch Serving Model
Edit `.env` field: `BEST_MODEL_TYPE=xgboost` (or `lstm`, `random_forest`)

---

## Environment Setup

Create `.env` from `.env.example` and set:

| Variable | Default | Description |
|----------|---------|-------------|
| `API_SECRET_KEY` | *(required)* | Secret key for X-API-Key auth |
| `DATABASE_URL` | `postgres://xguard:xguard_secret@localhost:5432/xguard` | Postgres connection (used by backend, alembic) |
| `POSTGRES_PASSWORD` | `xguard_secret` | Postgres container password |
| `KAFKA_BOOTSTRAP_SERVERS` | `localhost:9092` | Kafka broker address |
| `BEST_MODEL_TYPE` | `xgboost` | Which model to load for inference |

---

## Common Development Tasks

### Add a New API Endpoint
1. Create handler in `backend/app/api/v1/routes/<name>.py`
2. Define Pydantic request/response in `backend/app/schemas/`
3. Add business logic in `backend/app/services/`
4. Include in router: `app.include_router(router)` in `main.py`
5. Test via `pytest tests/test_<name>.py`
6. Docs auto-update at `/docs`

### Modify Database Schema
1. Update model in `backend/app/db/models/`
2. Auto-migration runs on startup (✓ simple)
3. Or manually: `alembic revision --autogenerate -m "description"`

### Update Frontend
1. Edit component in `frontend/components/dashboard/` or `frontend/app/`
2. `npm run dev` hot-reloads
3. Call backend API via `lib/api.ts`

### Debug Backend Predictions
```bash
cd backend
pytest -v tests/test_predict.py  # Unit tests
pytest -v tests/test_explain.py  # SHAP tests
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend fails to start | Check `.env` exists, `DATABASE_URL` is valid, models trained |
| Kafka consumer not consuming | Ensure producer is running: `python kafka/producer.py --rate 5` |
| Database migration error | Delete `.venv`, reinstall; if persists, check `alembic/versions/` |
| SHAP explain returns null | Ensure XGBoost model loaded correctly; check backend logs |
| Frontend won't connect to backend | Check API URL in `lib/api.ts`; verify backend @ `:8000/docs` responds |

---

## Next Steps & Customization

- **For new features**: Refer to [docs/SETUP.md](../docs/SETUP.md) for environment steps, [docs/API.md](../docs/API.md) for endpoint specs
- **For ML improvements**: See [docs/MODEL_GUIDE.md](../docs/MODEL_GUIDE.md) for hyperparameter tuning, cross-validation
- **For performance profiling**: Check backend logs via `docker compose logs -f backend`
- **For real-world deployment**: See `backend/Dockerfile` for multi-stage build strategy

---

## References

| Document | Location | Use For |
|----------|----------|---------|
| Project README | `../README.md` | Architecture diagrams, high-level overview |
| Setup Guide | `../docs/SETUP.md` | Environment configuration, prerequisites |
| API Reference | `../docs/API.md` | Endpoint specs, request/response schemas, auth |
| Model Guide | `../docs/MODEL_GUIDE.md` | ML model selection, retraining, evaluation |

