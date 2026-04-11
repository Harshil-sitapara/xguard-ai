# XGuard-AI — Zeroth Review
### MCA Project Work (12 Credits) | VIT Online | March 2026

---

## Slide 1 — Title

**Project Title:** XGuard-AI
**Subtitle:** An Explainable AI-Powered Network Intrusion Detection System

**Core Technologies:**
- Machine Learning
- Big Data Analytics
- Explainable AI (SHAP)

| Field | Value |
|---|---|
| Student Name | [Your Full Name] |
| Registration No. | [Your Reg. No.] |
| Programme | MCA Online — 4th Semester, VIT |
| Project Guide | [Guide Name] |
| Review Date | Friday, 27th March 2026 |

---

## Slide 2 — Problem Statement

> **The Gap:** Traditional signature-based IDS tools (Snort, Suricata) detect only attacks they have already seen. They are completely blind to zero-day and AI-generated threats — and even when they raise an alert, they provide zero explanation to the analyst. In 2026, this is no longer acceptable.

### Three Core Problems

**01 — Zero-Day Blindness**
Signature tools match only known attack patterns. Novel malware — including AI-generated variants — evades detection entirely. Over 45% of 2025 breaches involved previously unseen attack signatures.

**02 — No Explainability**
ML-based IDS systems act as black boxes. Analysts cannot determine why an alert was raised, leading to alert fatigue and real threats buried in thousands of false positives.

**03 — Scale & Real-Time Gap**
Enterprise networks generate terabytes of traffic daily. Legacy tools process in batch mode and cannot support real-time Big Data scale detection — threats persist for hours undetected.

### Key Statistics
- 300% rise in India ransomware — CERT-In 2026
- 2,200+ global cyberattacks per day
- $4.45M average cost per breach — IBM 2025
- 0 sec zero-day detection time in signature tools

---

## Slide 3 — Objectives

**O1 — Real-Time Data Ingestion**
Build a Big Data streaming pipeline using Apache Kafka to continuously ingest and process high-volume network traffic, simulating enterprise-scale real-time monitoring.

**O2 — Multi-Model Intrusion Detection**
Develop and evaluate three ML models — Random Forest, XGBoost, and LSTM — to detect 7 categories of intrusions on the CICIDS2017 dataset with target accuracy >97%.

**O3 — Explainable AI Integration**
Integrate SHAP (SHapley Additive exPlanations) to generate feature-level, human-readable justifications for every detection decision — closing the black-box transparency gap.

**O4 — Live Monitoring Dashboard**
Build a real-time Next.js dashboard with Shadcn UI charts showing live threat alerts, attack breakdowns, traffic trends, and SHAP feature attribution for security analyst use.

**O5 — Performance Benchmarking**
Compare XGuard-AI vs Snort (signature IDS) using precision, recall, F1-score, and detection latency — demonstrating measurable improvement over legacy tools.

---

## Slide 4 — Methodology & Approach

### 5-Stage Pipeline

| Stage | Name | Tools |
|---|---|---|
| 1 | Data Ingestion | Apache Kafka, kafka-python |
| 2 | Preprocessing | Pandas, NumPy, Feature Engineering |
| 3 | Model Training | Random Forest, XGBoost, LSTM (Keras) |
| 4 | XAI Explanation | SHAP TreeExplainer |
| 5 | Dashboard | FastAPI, Next.js, Shadcn UI |

### Research Approach

**Phase 1:** Download CICIDS2017 (2.8M rows, 7 attack classes). Run EDA — class distributions, feature correlations, missing values.

**Phase 2:** Clean data: remove Inf/NaN, apply StandardScaler, SMOTE for class imbalance. Select top features via variance + correlation analysis.

**Phase 3:** Train RF (baseline) → XGBoost (optimized) → LSTM (sequential). Tune with GridSearchCV. Compare accuracy, F1, recall.

**Phase 4:** Apply SHAP TreeExplainer on best model. Generate global summary plots + per-prediction explanations. Build Next.js dashboard with Shadcn UI charts.

### Technology Stack

| Category | Tool |
|---|---|
| Dataset | CICIDS2017 — University of New Brunswick |
| ML Stack | Scikit-learn, XGBoost, Keras |
| Streaming | Apache Kafka |
| XAI | SHAP Library |
| Backend API | FastAPI (Python) |
| Frontend | Next.js + Shadcn UI |
| Language | Python 3.11 |

---

## Slide 5 — Expected Outcomes & Novelty

### Three Key Outcomes

**97%+ — Detection Accuracy**
XGBoost targeting >97% accuracy across 7 attack categories on CICIDS2017 — outperforming signature tools that miss zero-day attacks entirely.

**XAI — Explainable Alerts**
Every prediction gets a SHAP plain-English reason — e.g. "Flagged DDoS: packets/sec 200x above normal" — enabling faster, confident analyst decisions.

**Live — Real-Time Dashboard**
Operational Next.js dashboard with Shadcn UI charts showing live threat feed, attack trends, and SHAP attribution — ready for enterprise SOC environments.

### Key Novelty — What Makes XGuard-AI Different

- SHAP explainability built directly into the detection pipeline — no existing open-source IDS tool (Snort, Suricata, Zeek) offers this capability.
- Three-model comparison (RF + XGBoost + LSTM) with a live Kafka stream — most academic projects train one model on a static CSV file.
- Addresses an active 2025–26 research gap: XAI for IDS remains in its infancy with significant open challenges (Frontiers, 2025).

---

*XGuard-AI | MCA 4th Semester Project | VIT Online | March 2026*
