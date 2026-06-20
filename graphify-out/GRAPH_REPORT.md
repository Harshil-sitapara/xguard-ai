# Graph Report - D:\MCA Project\ids-final  (2026-06-20)

## Corpus Check
- 84 files · ~84,084 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 352 nodes · 562 edges · 70 communities detected
- Extraction: 61% EXTRACTED · 39% INFERRED · 0% AMBIGUOUS · INFERRED: 218 edges (avg confidence: 0.59)
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
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]

## God Nodes (most connected - your core abstractions)
1. `Prediction` - 31 edges
2. `VerifiedToken` - 28 edges
3. `TokenScope` - 27 edges
4. `Alert` - 15 edges
5. `PredictionResponse` - 15 edges
6. `BatchPredictionResponse` - 15 edges
7. `PredictRequest` - 14 edges
8. `BatchPredictRequest` - 14 edges
9. `TrafficReplayManager` - 14 edges
10. `getApiBaseUrl()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Alembic environment — async SQLAlchemy setup.` --uses--> `Base`  [INFERRED]
  D:/MCA Project/ids-final/backend/alembic/env.py → D:\MCA Project\ids-final\backend\app\db\base.py
- `main()` --calls--> `init_db()`  [INFERRED]
  D:\MCA Project\ids-final\backend\check_db.py → D:\MCA Project\ids-final\backend\app\db\session.py
- `lifespan()` --calls--> `consume_forever()`  [INFERRED]
  D:\MCA Project\ids-final\backend\app\main.py → D:\MCA Project\ids-final\backend\app\services\kafka_consumer.py
- `XGuard-AI FastAPI Application  Lifespan:   startup  → load model artefacts, run` --uses--> `Base`  [INFERRED]
  D:/MCA Project/ids-final/backend/app/main.py → D:\MCA Project\ids-final\backend\app\db\base.py
- `Initialize the DB engine and ensure tables exist.` --uses--> `Base`  [INFERRED]
  D:\MCA Project\ids-final\backend\app\main.py → D:\MCA Project\ids-final\backend\app\db\base.py

## Communities

### Community 0 - "Community 0"
Cohesion: 0.18
Nodes (31): BaseModel, Enum, explain(), ExplainResponse, GET /api/v1/explain/{prediction_id} — SHAP explanation for a prediction., Return SHAP feature attributions for a stored prediction., POST /api/v1/predict  — single and batch prediction endpoints., Background task to publish CSV rows to Kafka. (+23 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (22): trackEvent(), fetchExplanation(), fetchHistory(), fetchReplayStatus(), getApiBaseUrl(), getWebSocketBaseUrl(), isSecureBrowserContext(), readErrorMessage() (+14 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (18): Base, SQLAlchemy declarative base shared by all ORM models., main(), Shared test fixtures., DeclarativeBase, lifespan(), _prepare_database(), XGuard-AI FastAPI Application  Lifespan:   startup  → load model artefacts, run (+10 more)

### Community 3 - "Community 3"
Cohesion: 0.1
Nodes (15): XGuard-AI — Cross-Model Evaluation Report  Loads metrics.json from all three tra, run(), InferenceService, PredictionResult, XGuard-AI — Inference Service  Loads the XGBoost model and preprocessor artefa, Async wrapper — runs CPU-bound inference in thread pool., _severity(), _build_model() (+7 more)

### Community 4 - "Community 4"
Cohesion: 0.19
Nodes (19): Alert, AlertResponse, AlertsListResponse, Alerts: REST history + WebSocket live stream., WebSocket endpoint — streams real-time alert JSON as events arrive., Paginated alert history with optional attack_type filter., WebSocket endpoint — streams real-time alert JSON as events arrive., WebSocket endpoint — streams real-time alert JSON as events arrive. (+11 more)

### Community 5 - "Community 5"
Cohesion: 0.21
Nodes (8): _allow_replay_control(), replay_start(), replay_status(), replay_stop(), ReplayStatusResponse, _to_response(), ReplayState, TrafficReplayManager

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (15): clear_alerts(), list_alerts(), cancel_upload(), predict(), predict_batch(), _process_csv_and_publish(), _run_prediction(), upload_csv_predict() (+7 more)

### Community 7 - "Community 7"
Cohesion: 0.24
Nodes (11): applyAnalyticsContext(), getAnalyticsClient(), getUserProperties(), hasFirebaseConfig(), isDevelopmentLikeEnvironment(), setAnalyticsContext(), shouldDisableAnalytics(), toEventParams() (+3 more)

### Community 8 - "Community 8"
Cohesion: 0.19
Nodes (10): _default_dataset_path(), main(), _prepare_rows(), produce(), XGuard-AI — Kafka Traffic Producer (Demo / Simulation)  Reads rows from the proc, main(), XGuard-AI — Pipeline Runner CLI  Usage:     python scripts/run_pipeline.py --ste, _load() (+2 more)

### Community 9 - "Community 9"
Cohesion: 0.18
Nodes (5): alerts_live(), Alembic environment — async SQLAlchemy setup., run_migrations_online(), WebSocket connection manager for broadcasting live alerts., WebSocketManager

### Community 10 - "Community 10"
Cohesion: 0.2
Nodes (5): _build_reason(), ExplainerService, XGuard-AI — SHAP Explainer Service  Generates per-prediction SHAP explanations u, Load SHAP explainer. Non-critical - predictions work without it., SHAPResult

### Community 11 - "Community 11"
Cohesion: 0.33
Nodes (3): BaseSettings, get_settings(), Settings

### Community 12 - "Community 12"
Cohesion: 0.48
Nodes (6): _clean(), _encode_labels(), _extract_zip(), _load_csvs(), XGuard-AI — Data Preprocessing Pipeline  Steps:   1. Extract MachineLearningCSV., run()

### Community 13 - "Community 13"
Cohesion: 0.33
Nodes (1): Tests for /api/v1/predict endpoints.

### Community 14 - "Community 14"
Cohesion: 0.5
Nodes (4): health(), HealthResponse, GET /api/v1/health — liveness and readiness check., Returns service health. No auth required — suitable for load balancer checks.

### Community 15 - "Community 15"
Cohesion: 0.4
Nodes (0): 

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
Cohesion: 1.0
Nodes (2): CollapsibleContent(), useCollapsibleContext()

### Community 22 - "Community 22"
Cohesion: 0.67
Nodes (0): 

### Community 23 - "Community 23"
Cohesion: 1.0
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
Nodes (1): XGuard-AI ML Configuration Central config for paths, label mappings, and hyperpa

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

### Community 57 - "Community 57"
Cohesion: 1.0
Nodes (0): 

### Community 58 - "Community 58"
Cohesion: 1.0
Nodes (0): 

### Community 59 - "Community 59"
Cohesion: 1.0
Nodes (0): 

### Community 60 - "Community 60"
Cohesion: 1.0
Nodes (0): 

### Community 61 - "Community 61"
Cohesion: 1.0
Nodes (0): 

### Community 62 - "Community 62"
Cohesion: 1.0
Nodes (0): 

### Community 63 - "Community 63"
Cohesion: 1.0
Nodes (1): Load SHAP explainer. Non-critical - predictions work without it.

### Community 64 - "Community 64"
Cohesion: 1.0
Nodes (1): Async wrapper — runs CPU-bound inference in thread pool.

### Community 65 - "Community 65"
Cohesion: 1.0
Nodes (1): Dependency: validates X-API-Key header and returns token info.     Supports both

### Community 66 - "Community 66"
Cohesion: 1.0
Nodes (1): Dependency to enforce token scope on specific endpoints

### Community 67 - "Community 67"
Cohesion: 1.0
Nodes (1): Async wrapper — runs CPU-bound inference in thread pool.

### Community 68 - "Community 68"
Cohesion: 1.0
Nodes (1): Returns service health. No auth required — suitable for load balancer checks.

### Community 69 - "Community 69"
Cohesion: 1.0
Nodes (1): Load SHAP explainer. Non-critical - predictions work without it.

## Knowledge Gaps
- **39 isolated node(s):** `GET /api/v1/health — liveness and readiness check.`, `Returns service health. No auth required — suitable for load balancer checks.`, `Rate limiting configuration for FastAPI endpoints`, `No-op decorator if slowapi unavailable`, `Token permission scopes` (+34 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 23`** (2 nodes): `logging.py`, `setup_logging()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (2 nodes): `layout.tsx`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (2 nodes): `page.tsx`, `HomePage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (2 nodes): `layout.tsx`, `DashboardLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (2 nodes): `theme-toggle.tsx`, `ThemeToggle()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (2 nodes): `AppAnalytics()`, `app-analytics.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (2 nodes): `stat-cards.tsx`, `StatCards()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (2 nodes): `Badge()`, `badge.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (2 nodes): `cn()`, `button.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (2 nodes): `dialog.tsx`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (2 nodes): `separator.tsx`, `Separator()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (2 nodes): `skeleton.tsx`, `Skeleton()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (2 nodes): `use-alerts.ts`, `useAlerts()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (2 nodes): `utils.ts`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (2 nodes): `XGuard-AI ML Configuration Central config for paths, label mappings, and hyperpa`, `config.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (2 nodes): `generate_mixed_data.py`, `main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (1 nodes): `test_inference.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (1 nodes): `deps.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (1 nodes): `router.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `next.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (1 nodes): `tailwind.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 57`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (1 nodes): `attack-chart.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (1 nodes): `shap-dialog.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (1 nodes): `landing-page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 61`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 62`** (1 nodes): `__init__.py`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 63`** (1 nodes): `Load SHAP explainer. Non-critical - predictions work without it.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 64`** (1 nodes): `Async wrapper — runs CPU-bound inference in thread pool.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 65`** (1 nodes): `Dependency: validates X-API-Key header and returns token info.     Supports both`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 66`** (1 nodes): `Dependency to enforce token scope on specific endpoints`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 67`** (1 nodes): `Async wrapper — runs CPU-bound inference in thread pool.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 68`** (1 nodes): `Returns service health. No auth required — suitable for load balancer checks.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 69`** (1 nodes): `Load SHAP explainer. Non-critical - predictions work without it.`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Prediction` connect `Community 4` to `Community 0`, `Community 2`, `Community 6`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `process_traffic_message()` connect `Community 4` to `Community 9`, `Community 10`, `Community 3`, `Community 6`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `Base` connect `Community 2` to `Community 9`, `Community 4`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Are the 29 inferred relationships involving `Prediction` (e.g. with `Alerts: REST history + WebSocket live stream.` and `Paginated alert history with optional attack_type filter.`) actually correct?**
  _`Prediction` has 29 INFERRED edges - model-reasoned connections that need verification._
- **Are the 23 inferred relationships involving `VerifiedToken` (e.g. with `Alerts: REST history + WebSocket live stream.` and `Paginated alert history with optional attack_type filter.`) actually correct?**
  _`VerifiedToken` has 23 INFERRED edges - model-reasoned connections that need verification._
- **Are the 23 inferred relationships involving `TokenScope` (e.g. with `Alerts: REST history + WebSocket live stream.` and `Paginated alert history with optional attack_type filter.`) actually correct?**
  _`TokenScope` has 23 INFERRED edges - model-reasoned connections that need verification._
- **Are the 15 inferred relationships involving `str` (e.g. with `list_alerts()` and `clear_alerts()`) actually correct?**
  _`str` has 15 INFERRED edges - model-reasoned connections that need verification._