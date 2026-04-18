# Graph Report - D:\MCA Project\ids-final  (2026-04-18)

## Corpus Check
- 86 files detected (~18,835 words): 71 code, 15 docs. This run excludes graphify outputs and is AST-first: graph edges come from local code structure and extracted Python rationale/docstrings; standalone docs are counted in the corpus but not semantically linked in this graph.

## Summary
- 249 nodes · 316 edges · 55 communities detected
- Extraction: 70% EXTRACTED · 30% INFERRED · 0% AMBIGUOUS · INFERRED: 95 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_VerifiedToken  TokenScope|VerifiedToken / TokenScope]]
- [[_COMMUNITY_Prediction  Alert|Prediction / Alert]]
- [[_COMMUNITY_InferenceService  run|InferenceService / run]]
- [[_COMMUNITY_Base  lifespan|Base / lifespan]]
- [[_COMMUNITY_WebSocketManager  Alembic environment — async SQLAlchemy setup.|WebSocketManager / Alembic environment — async SQLAlchemy setup.]]
- [[_COMMUNITY_run  build sequences|run / build sequences]]
- [[_COMMUNITY_run  main|run / main]]
- [[_COMMUNITY_ExplainerService  build reason|ExplainerService / build reason]]
- [[_COMMUNITY_getApiBaseUrl  getWebSocketBaseUrl|getApiBaseUrl / getWebSocketBaseUrl]]
- [[_COMMUNITY_init db  get db|init db / get db]]
- [[_COMMUNITY_run  clean|run / clean]]
- [[_COMMUNITY_Tests for apiv1predict endpoints.|Tests for /api/v1/predict endpoints.]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_health  HealthResponse|health / HealthResponse]]
- [[_COMMUNITY_Settings  get settings|Settings / get settings]]
- [[_COMMUNITY_DummyLimiter  Rate limiting configuration for FastAPI endpoints|DummyLimiter / Rate limiting configuration for FastAPI endpoints]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Tests for apiv1explain endpoint.|Tests for /api/v1/explain endpoint.]]
- [[_COMMUNITY_Dashboard  useAlerts|Dashboard / useAlerts]]
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
- [[_COMMUNITY_XGuard AI ML Configuration Central config for paths, label mappings, and hyperpa|XGuard AI ML Configuration Central config for paths, label mappings, and hyperpa]]
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

## God Nodes (most connected - your core abstractions)
1. `Prediction` - 16 edges
2. `VerifiedToken` - 14 edges
3. `TokenScope` - 13 edges
4. `Base` - 9 edges
5. `Alert` - 9 edges
6. `POST /api/v1/predict  — single and batch prediction endpoints.` - 8 edges
7. `Classify a single network flow and return label + confidence.` - 8 edges
8. `Classify up to 1000 network flows in one request.` - 8 edges
9. `_process_message()` - 8 edges
10. `Alerts: REST history + WebSocket live stream.` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Alembic environment — async SQLAlchemy setup.` --uses--> `Base`  [INFERRED]
  D:/MCA Project/ids-final/backend/alembic/env.py → D:/MCA Project/ids-final/backend/app/db/base.py
- `_prepare_database()` --calls--> `init_db()`  [INFERRED]
  D:/MCA Project/ids-final/backend/app/main.py → D:/MCA Project/ids-final/backend/app/db/session.py
- `lifespan()` --calls--> `consume_forever()`  [INFERRED]
  D:/MCA Project/ids-final/backend/app/main.py → D:/MCA Project/ids-final/backend/app/services/kafka_consumer.py
- `XGuard-AI FastAPI Application  Lifespan:   startup  → load model artefacts, run` --uses--> `Base`  [INFERRED]
  D:/MCA Project/ids-final/backend/app/main.py → D:/MCA Project/ids-final/backend/app/db/base.py
- `Initialize the DB engine and ensure tables exist.` --uses--> `Base`  [INFERRED]
  D:/MCA Project/ids-final/backend/app/main.py → D:/MCA Project/ids-final/backend/app/db/base.py

## Communities

### Community 0 - "VerifiedToken / TokenScope"
Cohesion: 0.14
Nodes (25): BaseModel, Enum, explain(), ExplainResponse, GET /api/v1/explain/{prediction_id} — SHAP explanation for a prediction., Return SHAP feature attributions for a stored prediction., predict(), predict_batch() (+17 more)

### Community 1 - "Prediction / Alert"
Cohesion: 0.2
Nodes (14): Alert, AlertResponse, AlertsListResponse, alerts_live(), list_alerts(), Alerts: REST history + WebSocket live stream., Paginated alert history with optional attack_type filter., WebSocket endpoint — streams real-time alert JSON as events arrive. (+6 more)

### Community 2 - "InferenceService / run"
Cohesion: 0.14
Nodes (9): XGuard-AI — Cross-Model Evaluation Report  Loads metrics.json from all three tra, run(), InferenceService, PredictionResult, XGuard-AI — Inference Service  Loads the XGBoost model and preprocessor artefa, _severity(), XGuard-AI — SHAP Global Analysis on XGBoost Model  Produces:   - shap_summary.pn, run() (+1 more)

### Community 3 - "Base / lifespan"
Cohesion: 0.16
Nodes (8): Base, SQLAlchemy declarative base shared by all ORM models., Shared test fixtures., DeclarativeBase, lifespan(), _prepare_database(), XGuard-AI FastAPI Application  Lifespan:   startup  → load model artefacts, run, Initialize the DB engine and ensure tables exist.

### Community 4 - "WebSocketManager / Alembic environment — async SQLAlchemy setup."
Cohesion: 0.18
Nodes (4): Alembic environment — async SQLAlchemy setup., run_migrations_online(), WebSocket connection manager for broadcasting live alerts., WebSocketManager

### Community 5 - "run / build sequences"
Cohesion: 0.21
Nodes (9): Async wrapper — runs CPU-bound inference in thread pool., _build_model(), _build_sequences(), XGuard-AI — LSTM Training (Research Comparison Model)  LSTM is trained for acade, Sliding-window sequence builder., run(), _load(), XGuard-AI — Random Forest Training (Baseline Model)  Usage:     cd ml/src && pyt (+1 more)

### Community 6 - "run / main"
Cohesion: 0.22
Nodes (8): main(), produce(), XGuard-AI — Kafka Traffic Producer (Demo / Simulation)  Reads rows from the proc, main(), XGuard-AI — Pipeline Runner CLI  Usage:     python scripts/run_pipeline.py --ste, _load(), XGuard-AI — XGBoost Training (Production Model)  XGBoost is selected as the prod, run()

### Community 7 - "ExplainerService / build reason"
Cohesion: 0.24
Nodes (5): _build_reason(), ExplainerService, XGuard-AI — SHAP Explainer Service  Generates per-prediction SHAP explanations u, Load SHAP explainer. Non-critical - predictions work without it., SHAPResult

### Community 8 - "getApiBaseUrl / getWebSocketBaseUrl"
Cohesion: 0.4
Nodes (9): fetchExplanation(), fetchHistory(), getApiBaseUrl(), getWebSocketBaseUrl(), isSecureBrowserContext(), stripTrailingSlash(), toHttpUrl(), toWebSocketUrl() (+1 more)

### Community 9 - "init db / get db"
Cohesion: 0.31
Nodes (8): get_db(), get_optional_db(), init_db(), _normalize_database_url(), Yield a database session when available, otherwise fall back to None., Translate URL query params unsupported by asyncpg into connect_args., Initialize database engine and session factory. Called during app startup., Get async database session. Raises error if database not available.

### Community 10 - "run / clean"
Cohesion: 0.48
Nodes (6): _clean(), _encode_labels(), _extract_zip(), _load_csvs(), XGuard-AI — Data Preprocessing Pipeline  Steps:   1. Extract MachineLearningCSV., run()

### Community 11 - "Tests for /api/v1/predict endpoints."
Cohesion: 0.33
Nodes (1): Tests for /api/v1/predict endpoints.

### Community 12 - "Community 12"
Cohesion: 0.33
Nodes (0): 

### Community 13 - "health / HealthResponse"
Cohesion: 0.5
Nodes (4): health(), HealthResponse, GET /api/v1/health — liveness and readiness check., Returns service health. No auth required — suitable for load balancer checks.

### Community 14 - "Settings / get settings"
Cohesion: 0.5
Nodes (3): BaseSettings, get_settings(), Settings

### Community 15 - "DummyLimiter / Rate limiting configuration for FastAPI endpoints"
Cohesion: 0.4
Nodes (3): DummyLimiter, Rate limiting configuration for FastAPI endpoints, No-op decorator if slowapi unavailable

### Community 16 - "Community 16"
Cohesion: 0.4
Nodes (0): 

### Community 17 - "Tests for /api/v1/explain endpoint."
Cohesion: 0.5
Nodes (1): Tests for /api/v1/explain endpoint.

### Community 18 - "Dashboard / useAlerts"
Cohesion: 0.5
Nodes (2): Dashboard(), useAlerts()

### Community 19 - "Community 19"
Cohesion: 0.5
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 0.67
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 0.67
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 0.67
Nodes (0): 

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

### Community 32 - "XGuard AI ML Configuration Central config for paths, label mappings, and hyperpa"
Cohesion: 1.0
Nodes (1): XGuard-AI ML Configuration Central config for paths, label mappings, and hyperpa

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (0): 

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

## Knowledge Gaps
- **31 isolated node(s):** `GET /api/v1/health — liveness and readiness check.`, `Returns service health. No auth required — suitable for load balancer checks.`, `Rate limiting configuration for FastAPI endpoints`, `No-op decorator if slowapi unavailable`, `Token permission scopes` (+26 more)
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
- **Thin community `Community 31`** (2 nodes): `utils.ts`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `XGuard AI ML Configuration Central config for paths, label mappings, and hyperpa`** (2 nodes): `XGuard-AI ML Configuration Central config for paths, label mappings, and hyperpa`, `config.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (2 nodes): `generate_mixed_data.py`, `main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (1 nodes): `test_inference.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (1 nodes): `deps.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `router.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (1 nodes): `__init__.py`
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
- **Thin community `Community 47`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `next.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (1 nodes): `attack-chart.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (1 nodes): `shap-dialog.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `_process_message()` connect `Prediction / Alert` to `InferenceService / run`, `WebSocketManager / Alembic environment — async SQLAlchemy setup.`, `run / build sequences`, `ExplainerService / build reason`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `Prediction` connect `Prediction / Alert` to `VerifiedToken / TokenScope`, `Base / lifespan`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `Base` connect `Base / lifespan` to `Prediction / Alert`, `WebSocketManager / Alembic environment — async SQLAlchemy setup.`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Are the 14 inferred relationships involving `Prediction` (e.g. with `Alerts: REST history + WebSocket live stream.` and `Paginated alert history with optional attack_type filter.`) actually correct?**
  _`Prediction` has 14 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `VerifiedToken` (e.g. with `Alerts: REST history + WebSocket live stream.` and `Paginated alert history with optional attack_type filter.`) actually correct?**
  _`VerifiedToken` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `TokenScope` (e.g. with `Alerts: REST history + WebSocket live stream.` and `Paginated alert history with optional attack_type filter.`) actually correct?**
  _`TokenScope` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Are the 10 inferred relationships involving `str` (e.g. with `list_alerts()` and `_run_prediction()`) actually correct?**
  _`str` has 10 INFERRED edges - model-reasoned connections that need verification._