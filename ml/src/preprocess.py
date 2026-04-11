"""
XGuard-AI — Data Preprocessing Pipeline

Steps:
  1. Extract MachineLearningCSV.zip → data/raw/
  2. Load all day-wise CSVs, strip column whitespace
  3. Drop identifier columns (IPs, timestamps, Flow ID)
  4. Replace ±Inf with NaN, drop NaN rows, drop duplicates
  5. Map raw CICIDS2017 labels → 9 unified categories
  6. Train/test stratified split
  7. SMOTE oversampling on train set (minority classes only)
  8. StandardScaler fit on train, transform both splits
  9. Save train.parquet, test.parquet + fitted artefacts

Usage:
    cd ml/src && python preprocess.py
"""
from __future__ import annotations

import logging
import zipfile

import joblib
import numpy as np
import pandas as pd
from imblearn.over_sampling import SMOTE
from imblearn.under_sampling import RandomUnderSampler
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler

from config import (
    DATASET_ZIP, DROP_COLS, LABEL_MAP, MODELS_DIR,
    PROCESSED_DIR, RAW_DIR, RANDOM_STATE, TEST_SIZE,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
logger = logging.getLogger(__name__)


def _extract_zip() -> list:
    if not DATASET_ZIP.exists():
        raise FileNotFoundError(f"Dataset ZIP not found: {DATASET_ZIP}")
    logger.info("Extracting %s → %s", DATASET_ZIP.name, RAW_DIR)
    with zipfile.ZipFile(DATASET_ZIP, "r") as zf:
        zf.extractall(RAW_DIR)
    files = list(RAW_DIR.rglob("*.csv"))
    logger.info("Extracted %d CSV files", len(files))
    return files


def _load_csvs(csv_files: list) -> pd.DataFrame:
    frames = []
    for f in csv_files:
        logger.info("  Loading & chunk-cleaning: %s", f.name)
        df = pd.read_csv(f, low_memory=False)
        df.columns = df.columns.str.strip()
        
        # 1. Drop unused columns immediately
        existing_drop = [c for c in DROP_COLS if c in df.columns]
        df.drop(columns=existing_drop, inplace=True)
        
        # 2. Replace Inf and drop NAs on the chunk
        df.replace([np.inf, -np.inf], np.nan, inplace=True)
        df.dropna(inplace=True)
        
        # 3. Downcast numeric types to save RAM
        for col in df.select_dtypes(include=['float64']).columns:
            df[col] = df[col].astype(np.float32)
        for col in df.select_dtypes(include=['int64']).columns:
            df[col] = pd.to_numeric(df[col], downcast='integer')

        # 4. Drop duplicates chunk-wise to prevent global memory issues
        df.drop_duplicates(inplace=True)

        frames.append(df)
        
    logger.info("Concatenating chunks ...")
    combined = pd.concat(frames, ignore_index=True)
    
    # Global drop_duplicates skipped because of local RAM limit (causes 20MB hash allocation crash)
    logger.info("Combined shape: %s", combined.shape)
    return combined


def _clean(df: pd.DataFrame) -> pd.DataFrame:
    # Cleaning is now done efficiently during _load_csvs to prevent OOM errors.
    return df


def _encode_labels(df: pd.DataFrame) -> tuple[pd.DataFrame, LabelEncoder]:
    df["Label"] = df["Label"].map(LABEL_MAP)
    unmapped = df["Label"].isna().sum()
    if unmapped:
        logger.warning("Dropping %d rows with unmapped labels", unmapped)
        df.dropna(subset=["Label"], inplace=True)
    le = LabelEncoder()
    df["Label"] = le.fit_transform(df["Label"])
    logger.info("Encoded classes: %s", list(le.classes_))
    return df, le


def run() -> None:
    # 1. Locate CSVs
    raw_csvs = list(RAW_DIR.rglob("*.csv"))
    if not raw_csvs:
        raw_csvs = _extract_zip()

    # 2. Load
    df = _load_csvs(raw_csvs)

    # 3. Clean
    df = _clean(df)

    # 4. Encode labels
    df, le = _encode_labels(df)

    feature_names = [c for c in df.columns if c != "Label"]
    X = df[feature_names].astype(np.float32)
    y = df["Label"].values

    # 5. Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y
    )
    logger.info("Train: %d | Test: %d", len(X_train), len(X_test))

    # 6. Balance Dataset (train only)
    logger.info("Balancing dataset to prevent OOM and speed up training ...")
    unique, counts = np.unique(y_train, return_counts=True)
    counts_dict = dict(zip(unique, counts))
    
    # Under-sample huge classes (like Benign) to max 250,000
    under_strategy = {k: min(v, 250000) for k, v in counts_dict.items()}
    rus = RandomUnderSampler(sampling_strategy=under_strategy, random_state=RANDOM_STATE)
    X_train_res, y_train_res = rus.fit_resample(X_train, y_train)
    
    # Over-sample tiny classes to min 50,000
    over_strategy = {k: max(v, 50000) for k, v in under_strategy.items()}
    smote = SMOTE(sampling_strategy=over_strategy, random_state=RANDOM_STATE)
    X_train_res, y_train_res = smote.fit_resample(X_train_res, y_train_res)
    
    logger.info("Post-resampling train shape: %s", X_train_res.shape)

    # 7. Scale
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train_res)
    X_test_scaled = scaler.transform(X_test)

    # 8. Save parquet splits
    pd.DataFrame(X_train_scaled, columns=feature_names).assign(Label=y_train_res).to_parquet(
        PROCESSED_DIR / "train.parquet", index=False
    )
    pd.DataFrame(X_test_scaled, columns=feature_names).assign(Label=y_test).to_parquet(
        PROCESSED_DIR / "test.parquet", index=False
    )

    # 9. Save fitted artefacts
    prep_dir = MODELS_DIR / "preprocessor"
    joblib.dump(scaler, prep_dir / "scaler.pkl")
    joblib.dump(le, prep_dir / "label_encoder.pkl")
    joblib.dump(feature_names, prep_dir / "feature_names.pkl")
    logger.info("Preprocessing complete. Artefacts → %s", prep_dir)


if __name__ == "__main__":
    run()
