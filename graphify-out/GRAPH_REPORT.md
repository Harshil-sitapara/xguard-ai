# Graph Report - D:\MCA Project\ids-final  (2026-04-19)

## Corpus Check
- 75 files · ~49,743 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 290 nodes · 413 edges · 57 communities detected
- Extraction: 70% EXTRACTED · 30% INFERRED · 0% AMBIGUOUS · INFERRED: 123 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]

## God Nodes (most connected - your core abstractions)
1. `Prediction` - 18 edges
2. `VerifiedToken` - 17 edges
3. `TokenScope` - 16 edges
4. `TrafficReplayManager` - 13 edges
5. `Alert` - 11 edges
6. `Base` - 10 edges
7. `getApiBaseUrl()` - 9 edges
8. `POST /api/v1/predict  — single and batch prediction endpoints.` - 8 edges
9. `Classify a single network flow and return label + confidence.` - 8 edges
10. `Classify up to 1000 network flows in one request.` - 8 edges

## Surprising Connections (you probably didn't know these)
- `Alembic environment — async SQLAlchemy setup.` --uses--> `Base`  [INFERRED]
  D:/MCA Project/ids-final/backend/alembic/env.py → D:\MCA Project\ids-final\backend\app\db\base.py
- `lifespan()` --calls--> `consume_forever()`  [INFERRED]
  D:\MCA Project\ids-final\backend\app\main.py → D:\MCA Project\ids-final\backend\app\services\kafka_consumer.py
- `XGuard-AI FastAPI Application  Lifespan:   startup  → load model artefacts, run` --uses--> `Base`  [INFERRED]
  D:/MCA Project/ids-final/backend/app/main.py → D:\MCA Project\ids-final\backend\app\db\base.py
- `Initialize the DB engine and ensure tables exist.` --uses--> `Base`  [INFERRED]
  D:\MCA Project\ids-final\backend\app\main.py → D:\MCA Project\ids-final\backend\app\db\base.py
- `_run_prediction()` --calls--> `Prediction`  [INFERRED]
  D:\MCA Project\ids-final\backend\app\api\v1\routes\predict.py → D:\MCA Project\ids-final\backend\app\db\models\prediction.py

## Communities

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (28): Alert, AlertResponse, AlertsListResponse, alerts_live(), list_alerts(), Alerts: REST history + WebSocket live stream., Paginated alert history with optional attack_type filter., WebSocket endpoint — streams real-time alert JSON as events arrive. (+20 more)

### Community 1 - "Community 1"
Cohesion: 0.1
Nodes (17): Base, SQLAlchemy declarative base shared by all ORM models., Shared test fixtures., DeclarativeBase, lifespan(), _prepare_database(), XGuard-AI FastAPI Application  Lifespan:   startup  → load model artefacts, run, Initialize the DB engine and ensure tables exist. (+9 more)

### Community 2 - "Community 2"
Cohesion: 0.2
Nodes (9): _allow_replay_control(), replay_start(), replay_status(), replay_stop(), ReplayStartRequest, ReplayStatusResponse, _to_response(), ReplayState (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.22
Nodes (16): fetchExplanation(), fetchHistory(), fetchReplayStatus(), getApiBaseUrl(), getWebSocketBaseUrl(), isSecureBrowserContext(), readErrorMessage(), startTrafficReplay() (+8 more)

### Community 4 - "Community 4"
Cohesion: 0.26
Nodes (14): BaseModel, predict(), predict_batch(), POST /api/v1/predict  — single and batch prediction endpoints., Classify a single network flow and return label + confidence., Classify up to 1000 network flows in one request., _run_prediction(), BatchPredictionResponse (+6 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (6): Alembic environment — async SQLAlchemy setup., run_migrations_online(), consume_forever(), process_traffic_message(), WebSocket connection manager for broadcasting live alerts., WebSocketManager

### Community 6 - "Community 6"
Cohesion: 0.18
Nodes (6): XGuard-AI — Cross-Model Evaluation Report  Loads metrics.json from all three tra, run(), InferenceService, PredictionResult, XGuard-AI — Inference Service  Loads the XGBoost model and preprocessor artefa, _severity()

### Community 7 - "Community 7"
Cohesion: 0.21
Nodes (10): _default_dataset_path(), main(), _prepare_rows(), produce(), XGuard-AI — Kafka Traffic Producer (Demo / Simulation)  Reads rows from the proc, main(), XGuard-AI — Pipeline Runner CLI  Usage:     python scripts/run_pipeline.py --ste, _load() (+2 more)

### Community 8 - "Community 8"
Cohesion: 0.21
Nodes (9): Async wrapper — runs CPU-bound inference in thread pool., _build_model(), _build_sequences(), XGuard-AI — LSTM Training (Research Comparison Model)  LSTM is trained for acade, Sliding-window sequence builder., run(), _load(), XGuard-AI — Random Forest Training (Baseline Model)  Usage:     cd ml/src && pyt (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.24
Nodes (5): _build_reason(), ExplainerService, XGuard-AI — SHAP Explainer Service  Generates per-prediction SHAP explanations u, Load SHAP explainer. Non-critical - predictions work without it., SHAPResult

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (3): BaseSettings, get_settings(), Settings

### Community 11 - "Community 11"
Cohesion: 0.48
Nodes (6): _clean(), _encode_labels(), _extract_zip(), _load_csvs(), XGuard-AI — Data Preprocessing Pipeline  Steps:   1. Extract MachineLearningCSV., run()

### Community 12 - "Community 12"
Cohesion: 0.33
Nodes (1): Tests for /api/v1/predict endpoints.

### Community 13 - "Community 13"
Cohesion: 0.33
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 0.5
Nodes (4): health(), HealthResponse, GET /api/v1/health — liveness and readiness check., Returns service health. No auth required — suitable for load balancer checks.

### Community 15 - "Community 15"
Cohesion: 0.4
Nodes (3): DummyLimiter, Rate limiting configuration for FastAPI endpoints, No-op decorator if slowapi unavailable

### Community 16 - "Community 16"
Cohesion: 0.4
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 0.5
Nodes (1): Tests for /api/v1/explain endpoint.

### Community 18 - "Community 18"
Cohesion: 0.5
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 0.67
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 0.67
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 0.67
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (2): CollapsibleContent(), useCollapsibleContext()

### Community 23 - "Community 23"
Cohesion: 0.67
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (1): XGuard-AI ML Configuration Central config for paths, label mappings, and hyperpa

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Community 36"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Community 40"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Community 42"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Community 43"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Community 46"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Community 48"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Community 49"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "Community 50"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "Community 51"
Cohesion: 1.0
Nodes (0): 

### Community 52 - "Community 52"
Cohesion: 1.0
Nodes (0): 

### Community 53 - "Community 53"
Cohesion: 1.0
Nodes (0): 

### Community 54 - "Community 54"
Cohesion: 1.0
Nodes (0): 

### Community 55 - "Community 55"
Cohesion: 1.0
Nodes (0): 

### Community 56 - "Community 56"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **32 isolated node(s):** `GET /api/v1/health — liveness and readiness check.`, `Returns service health. No auth required — suitable for load balancer checks.`, `Rate limiting configuration for FastAPI endpoints`, `No-op decorator if slowapi unavailable`, `Token permission scopes` (+27 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 24`** (2 nodes): `logging.py`, `setup_logging()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (2 nodes): `stat-cards.tsx`, `StatCards()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (2 nodes): `Badge()`, `badge.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (2 nodes): `cn()`, `button.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (2 nodes): `separator.tsx`, `Separator()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (2 nodes): `skeleton.tsx`, `Skeleton()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (2 nodes): `use-alerts.ts`, `useAlerts()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (2 nodes): `utils.ts`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (2 nodes): `XGuard-AI ML Configuration Central config for paths, label mappings, and hyperpa`, `config.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (2 nodes): `generate_mixed_data.py`, `main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (1 nodes): `test_inference.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (1 nodes): `deps.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (1 nodes): `router.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (1 nodes): `next.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (1 nodes): `attack-chart.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `shap-dialog.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `process_traffic_message()` connect `Community 5` to `Community 8`, `Community 9`, `Community 4`, `Community 0`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `Prediction` connect `Community 0` to `Community 1`, `Community 4`, `Community 5`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `Base` connect `Community 1` to `Community 0`, `Community 5`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `Prediction` (e.g. with `Alerts: REST history + WebSocket live stream.` and `Paginated alert history with optional attack_type filter.`) actually correct?**
  _`Prediction` has 16 INFERRED edges - model-reasoned connections that need verification._
- **Are the 12 inferred relationships involving `VerifiedToken` (e.g. with `Alerts: REST history + WebSocket live stream.` and `Paginated alert history with optional attack_type filter.`) actually correct?**
  _`VerifiedToken` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Are the 12 inferred relationships involving `TokenScope` (e.g. with `Alerts: REST history + WebSocket live stream.` and `Paginated alert history with optional attack_type filter.`) actually correct?**
  _`TokenScope` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Are the 12 inferred relationships involving `str` (e.g. with `list_alerts()` and `_run_prediction()`) actually correct?**
  _`str` has 12 INFERRED edges - model-reasoned connections that need verification._