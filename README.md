# XGuard-AI: Intelligent Intrusion Detection System

XGuard-AI is an ML-powered intrusion detection system built on the widely-recognized CICIDS2017 dataset.

This branch (`develop`) tracks **Milestones 1, 2, and 3** for our initial project review. It focuses strictly on the Data Engineering, Preprocessing Pipeline, and the Model Training & Evaluation phase, before any streaming pipelines or web dashboard integrations.

## Milestones Achieved
1. **Data Engineering & EDA**: Extensive data loading, null removal, and label simplification. EDA notebooks found in `ml/notebooks/`.
2. **Preprocessing Pipeline**: Pipeline combining SMOTE for imbalanced classes and `StandardScaler` for feature normalization. Found in `ml/src/preprocess.py`.
3. **Model Training & Evaluation**: We trained Random Forest, XGBoost, and an LSTM benchmark classifier to select the highest-performing network IDS model based on weighted F1 score and inference latency.

## Project Structure
```text
ids-final/
├── CIC-IDS-2017 - dataset/  ← Ensure dataset is placed here
├── ml/                      ← Core machine learning module
│   ├── notebooks/           ← EDA and visualization
│   ├── src/                 ← Data preprocessing & model code
│   └── scripts/             ← Runner scripts
└── README.md
```

## Running the Pipeline

### 1. Setup Environment
Requires Python 3.11+.

```bash
cd ids-final
python -m venv .venv

# Windows
.venv\Scripts\activate
# Mac/Linux
source .venv/bin/activate

pip install -r ml/requirements.txt
```

### 2. Prepare the Dataset
Ensure the raw `MachineLearningCSV.zip` from CICIDS2017 is extracted to `CIC-IDS-2017 - dataset/MachineLearningCSV/`.

### 3. Run the ML Pipeline
This single orchestrator script will run preprocessing, feature selection, training of all 3 models, and performance evaluation.
```bash
python ml/scripts/run_pipeline.py --step all
```

To run individual steps:
```bash
python ml/scripts/run_pipeline.py --step preprocess
python ml/scripts/run_pipeline.py --step train --model xgboost
python ml/scripts/run_pipeline.py --step evaluate
```

The output metrics and evaluation log will be saved to `ml/models/`.
