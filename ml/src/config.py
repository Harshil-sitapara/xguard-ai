"""XGuard-AI ML Configuration
Central config for paths, label mappings, and hyperparameters.
Import this in every training/preprocessing script.
"""
from pathlib import Path

# ── Directory Layout ──────────────────────────────────────────────────────
ML_DIR = Path(__file__).resolve().parents[1]          # ml/
ROOT = ML_DIR.parent                                   # ids-final/
DATA_DIR = ML_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"
MODELS_DIR = ML_DIR / "models"
DATASET_ZIP = ROOT / "CIC-IDS-2017 - dataset" / "MachineLearningCSV.zip"

# Create required directories on import
for _d in (
    RAW_DIR, PROCESSED_DIR,
    MODELS_DIR / "random_forest",
    MODELS_DIR / "xgboost",
    MODELS_DIR / "lstm",
    MODELS_DIR / "preprocessor",
):
    _d.mkdir(parents=True, exist_ok=True)

# ── Label Mapping ─────────────────────────────────────────────────────────
# Maps all 15+ raw CICIDS2017 class names → 9 unified attack categories.
LABEL_MAP: dict[str, str] = {
    "BENIGN": "Benign",
    "DoS Hulk": "DoS",
    "DoS GoldenEye": "DoS",
    "DoS slowloris": "DoS",
    "DoS Slowhttptest": "DoS",
    "DDoS": "DDoS",
    "FTP-Patator": "Brute Force",
    "SSH-Patator": "Brute Force",
    "Web Attack \x96 Brute Force": "Web Attack",
    "Web Attack \x96 XSS": "Web Attack",
    "Web Attack \x96 Sql Injection": "Web Attack",
    "Web Attack - Brute Force": "Web Attack",
    "Web Attack - XSS": "Web Attack",
    "Web Attack - Sql Injection": "Web Attack",
    "Infiltration": "Infiltration",
    "Bot": "Botnet",
    "Heartbleed": "Heartbleed",
    "PortScan": "PortScan",
}

# Columns dropped before training (identifiers, not features)
DROP_COLS: list[str] = [
    "Flow ID", " Source IP", " Destination IP", " Timestamp",
    "Source IP", "Destination IP", "Timestamp",
]

# ── Split Config ──────────────────────────────────────────────────────────
TEST_SIZE = 0.2
RANDOM_STATE = 42

# ── Random Forest Hyperparameters ─────────────────────────────────────────
RF_PARAMS: dict = {
    "n_estimators": 200,
    "max_depth": 20,
    "min_samples_leaf": 2,
    "class_weight": "balanced",
    "n_jobs": -1,
    "random_state": RANDOM_STATE,
}

# ── XGBoost Hyperparameters ───────────────────────────────────────────────
XGB_BASE_PARAMS: dict = {
    "eval_metric": "mlogloss",
    "n_jobs": -1,
    "random_state": RANDOM_STATE,
    "tree_method": "hist",   # fast CPU training; auto-selects GPU if available
}

XGB_PARAM_GRID: dict = {
    "n_estimators": [200, 300],
    "max_depth": [6, 8],
    "learning_rate": [0.1, 0.05],
    "subsample": [0.8],
    "colsample_bytree": [0.8],
}

# ── LSTM Config ───────────────────────────────────────────────────────────
LSTM_CONFIG: dict = {
    "sequence_length": 10,
    "lstm_units": [128, 64],
    "dropout_rate": 0.3,
    "batch_size": 512,
    "epochs": 50,
    "patience": 5,
}
