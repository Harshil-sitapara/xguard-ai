import pandas as pd
import xgboost as xgb
import json

df = pd.read_parquet('ml/data/processed/test.parquet').head(20000)
X = df.drop(columns=['Label'])

booster = xgb.Booster()
booster.load_model('ml/models/xgboost/model.json')

dmatrix = xgb.DMatrix(X)
preds = booster.predict(dmatrix)

print("Actual Distribution:")
print(df['Label'].value_counts())

print("\nPredictions Distribution:")
print(pd.Series(preds.argmax(axis=1)).value_counts())
