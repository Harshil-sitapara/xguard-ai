import pandas as pd
import os
from pathlib import Path

DATA_DIR = Path("ml/data/processed")
INPUT_FILE = DATA_DIR / "test.parquet"
OUTPUT_FILE = DATA_DIR / "test_mixed.parquet"

def main():
    if not INPUT_FILE.exists():
        print(f"Error: {INPUT_FILE} not found.")
        return

    print(f"Loading {INPUT_FILE}...")
    df = pd.read_parquet(INPUT_FILE)
    
    # 0 is Benign, 1-7 are Attacks
    benign_df = df[df["Label"] == 0]
    attack_df = df[df["Label"] != 0]
    
    print(f"Initial: {len(benign_df)} Benign, {len(attack_df)} Attacks.")
    
    # Take a balanced sample (up to 10k of each)
    n_sample = min(len(benign_df), len(attack_df), 10000)
    
    benign_sample = benign_df.sample(n=n_sample, random_state=42)
    attack_sample = attack_df.sample(n=n_sample, random_state=42)
    
    mixed_df = pd.concat([benign_sample, attack_sample]).sample(frac=1, random_state=42)
    
    print(f"Saving {len(mixed_df)} rows to {OUTPUT_FILE} (50/50 split)...")
    mixed_df.to_parquet(OUTPUT_FILE)
    print("Done!")

if __name__ == "__main__":
    main()
