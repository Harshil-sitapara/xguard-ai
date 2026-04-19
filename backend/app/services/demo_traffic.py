from __future__ import annotations

import json
import random
from functools import lru_cache
from pathlib import Path
from typing import Literal

DemoScenario = Literal["benign", "attack", "mixed"]

INTERNAL_IPS = [
    "10.0.0.12",
    "10.0.0.25",
    "10.0.0.47",
    "192.168.1.18",
    "192.168.1.23",
]

EXTERNAL_IPS = [
    "185.220.101.15",
    "203.0.113.42",
    "198.51.100.77",
    "45.83.64.9",
    "91.134.22.31",
]


@lru_cache
def _load_samples() -> list[dict]:
    sample_path = Path(__file__).resolve().parents[1] / "data" / "demo_samples.json"
    return json.loads(sample_path.read_text(encoding="utf-8"))


def _sample_pool(kind: DemoScenario) -> list[dict]:
    samples = _load_samples()
    benign = [sample for sample in samples if sample["label_hint"] == "Benign"]
    attacks = [sample for sample in samples if sample["label_hint"] != "Benign"]

    if kind == "benign":
        return benign
    if kind == "attack":
        return attacks
    return samples


def _to_payload(sample: dict) -> dict:
    is_attack = sample["label_hint"] != "Benign"
    if is_attack:
        source_ip = random.choice(EXTERNAL_IPS)
        destination_ip = random.choice(INTERNAL_IPS)
    else:
        source_ip = random.choice(INTERNAL_IPS)
        destination_ip = random.choice(INTERNAL_IPS)

    return {
        "features": dict(sample["features"]),
        "source_ip": source_ip,
        "destination_ip": destination_ip,
    }


def build_demo_payloads(kind: DemoScenario, count: int) -> list[dict]:
    benign = _sample_pool("benign")
    attacks = _sample_pool("attack")
    mixed = _sample_pool("mixed")

    payloads: list[dict] = []
    for index in range(count):
        if kind == "benign":
            sample = benign[index % len(benign)]
        elif kind == "attack":
            sample = random.choice(attacks)
        else:
            sample = benign[0] if index % 2 == 0 else random.choice(attacks)
            if index % 5 == 4:
                sample = random.choice(mixed)
        payloads.append(_to_payload(sample))

    return payloads
