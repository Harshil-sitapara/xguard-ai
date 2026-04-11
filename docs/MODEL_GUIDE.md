# XGuard-AI — Model Guide

## Why XGBoost is the Production Serving Model

XGuard-AI trains three models for academic comparison: **Random Forest**, **XGBoost**, and **LSTM**.
XGBoost is selected as the single model served by the FastAPI inference API. This document explains
the reasoning and how to retrain or switch models.

---

## Model Comparison

| Criterion | Random Forest | **XGBoost** ✅ | LSTM |
|---|---|---|---|
| Expected F1 (CICIDS2017) | ~95% | **~97–99%** | ~94–97% |
| Inference latency (CPU) | ~5 ms | **<1 ms** | ~20–50 ms |
| SHAP support | TreeExplainer | **TreeExplainer (O(TL))** | KernelExplainer (slow) |
| Model file size | ~500 MB (.pkl) | **~10 MB (.json)** | ~20 MB (.keras) |
| Serialisation portability | Joblib only | **JSON — no framework lock-in** | Keras format |
| GPU training | ❌ | **✅ tree_method=hist** | ✅ |
| Sequence data needed | ❌ | ❌ | ✅ (adds API complexity) |

### Decision Summary

1. **Accuracy:** XGBoost achieves the highest F1-weighted score on CICIDS2017 tabular features.
2. **SHAP Compatibility:** `shap.TreeExplainer` on XGBoost runs in `O(T × L)` — exponentially faster
   than `shap.KernelExplainer` required for LSTM. This makes real-time per-prediction explanations
   feasible without a dedicated explanation service.
3. **Deployment Simplicity:** The `.json` model format loads without a matching scikit-learn/Keras
   version, avoiding dependency hell across environments.
4. **LSTM Trade-off:** LSTM requires reshaping every input into a sliding window of 10 flows, which
   adds stateful logic to the API. For a real-time single-flow classification API, this is unnecessary
   overhead without proportional accuracy gain.

> All three models are still fully trained and their metrics are saved to `ml/models/evaluation_report.json`.
> LSTM results are included in the academic evaluation section of the project.

---

## How to Retrain

```bash
cd ml

# Retrain a specific model
python scripts/run_pipeline.py --step train --model xgboost

# Retrain all models + run evaluation
python scripts/run_pipeline.py --step train
python scripts/run_pipeline.py --step evaluate
python scripts/run_pipeline.py --step shap
```

---

## Tuning XGBoost Hyperparameters

Edit `ml/src/config.py`:

```python
XGB_PARAM_GRID = {
    "n_estimators": [200, 300, 500],    # add more estimators
    "max_depth": [6, 8, 10],
    "learning_rate": [0.1, 0.05, 0.01],
    "subsample": [0.8, 1.0],
    "colsample_bytree": [0.8, 1.0],
}
```

Then re-run `--step train --model xgboost`. The best params are saved to `metrics.json`.

---

## Switching the Serving Model

To serve Random Forest instead of XGBoost:

1. In `.env`, set `BEST_MODEL_TYPE=random_forest`
2. Update `backend/app/services/inference.py` to load `model.pkl` via `joblib.load` instead of
   `XGBClassifier().load_model()`
3. Update `backend/app/services/explainer.py` to use `shap.TreeExplainer(rf_model)` — this works
   identically for scikit-learn tree ensembles

> **Note:** SHAP background pickle (`shap_background.pkl`) is XGBoost-only. For RF, remove the
> `data=` parameter from `TreeExplainer(model)`.

---

## Adding a New Attack Class

If you have additional labelled data with a new attack category:

1. Add the label mapping in `ml/src/config.py` → `LABEL_MAP`
2. Place new CSV files in `ml/data/raw/`
3. Re-run the full pipeline: `python scripts/run_pipeline.py --step all`
4. The new class will be included automatically by `LabelEncoder`

---

## Evaluation Report

After training, open `ml/models/evaluation_report.json` for the full comparison table,
or run:

```bash
python scripts/run_pipeline.py --step evaluate
```
