"""
XGuard-AI — SHAP Explainer Service

Generates per-prediction SHAP explanations using TreeExplainer.
Loaded once at startup; explain() called on-demand per API request.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path

import joblib
import numpy as np
import shap
from starlette.concurrency import run_in_threadpool
import xgboost as xgb

logger = logging.getLogger(__name__)

TOP_N = 10  # feature contributions returned per explanation


@dataclass
class SHAPResult:
    prediction_id: str
    label: str
    top_features: list[dict]   # [{feature, shap_value, direction}]
    reason: str                # plain-English summary


THREAT_DESCRIPTIONS = {
    "PortScan": "This activity matches the signature of a PortScan attack. The attacker is actively probing multiple ports on your network to discover open services and vulnerabilities.",
    "DDoS": "A Distributed Denial of Service (DDoS) attack is currently overwhelming the network. Abnormal volumes of requests are being sent to exhaust system resources.",
    "Bot": "Suspicious automated bot activity detected. The network patterns resemble typical botnet communications or automated scraping behaviors.",
    "Infiltration": "Potential network infiltration detected. The system has identified traffic patterns consistent with unauthorized access attempts or malware lateral movement.",
    "Web Attack \u00ad Brute Force": "A Web Brute Force attack is underway. The attacker is making repeated, rapid attempts to guess passwords or exploit authentication endpoints.",
    "Web Attack \u00ad XSS": "Cross-Site Scripting (XSS) attack detected in web traffic. The payload contains suspicious scripts aimed at compromising web applications.",
    "Web Attack \u00ad Sql Injection": "SQL Injection attempt identified. The traffic contains malformed database queries attempting to extract or manipulate internal database records.",
    "FTP-Patator": "FTP brute-force attack (FTP-Patator) detected. The attacker is attempting to guess FTP credentials through repeated automated logins.",
    "SSH-Patator": "SSH brute-force attack (SSH-Patator) detected. The attacker is attempting to gain unauthorized shell access via repeated SSH logins.",
    "DoS slowloris": "Slowloris Denial of Service attack detected. The attacker is attempting to keep many connections open as long as possible.",
    "DoS Slowhttptest": "Slow HTTP Test (DoS) detected. The attacker is sending HTTP requests in fragments to exhaust the server's connection pool.",
    "DoS Hulk": "HTTP Unbearable Load King (HULK) DoS attack detected. A massive volume of unique, obfuscated HTTP requests is attempting to bypass caching.",
    "DoS GoldenEye": "GoldenEye DoS attack detected. The attacker is exploiting HTTP KeepAlive and NoCache features to exhaust server sockets.",
    "Heartbleed": "Heartbleed vulnerability exploit attempt detected. The traffic contains malformed TLS heartbeat requests aiming to leak server memory.",
}

FEATURE_DESCRIPTIONS = {
    "Flow Duration": "the total duration of the connection",
    "Total Fwd Packets": "the number of packets sent by the source",
    "Total Backward Packets": "the number of packets returned by the destination",
    "Total Length of Fwd Packets": "the total amount of data sent by the source",
    "Total Length of Bwd Packets": "the total amount of data returned by the destination",
    "Fwd Packet Length Max": "the maximum size of a packet sent by the source",
    "Fwd Packet Length Min": "the minimum size of a packet sent by the source",
    "Fwd Packet Length Mean": "the average size of packets sent by the source",
    "Bwd Packet Length Max": "the maximum size of a packet returned by the destination",
    "Bwd Packet Length Min": "the minimum size of a packet returned by the destination",
    "Bwd Packet Length Mean": "the average size of packets returned by the destination",
    "Flow Bytes/s": "the rate of data transfer in bytes per second",
    "Flow Packets/s": "the rate of packet transfer per second",
    "Flow IAT Mean": "the average time between packets in the flow",
    "Flow IAT Std": "the variation in time between packets",
    "Fwd IAT Total": "the total time between forward packets",
    "Bwd IAT Total": "the total time between backward packets",
    "Fwd PSH Flags": "the number of times the PSH flag was set by the source",
    "Bwd PSH Flags": "the number of times the PSH flag was set by the destination",
    "Fwd URG Flags": "the number of times the URG flag was set by the source",
    "Bwd URG Flags": "the number of times the URG flag was set by the destination",
    "Fwd Header Length": "the total size of all forward packet headers",
    "Bwd Header Length": "the total size of all backward packet headers",
    "Fwd Packets/s": "the rate of forward packets per second",
    "Bwd Packets/s": "the rate of backward packets per second",
    "Min Packet Length": "the smallest packet size observed in the flow",
    "Max Packet Length": "the largest packet size observed in the flow",
    "Packet Length Mean": "the average packet size in the flow",
    "Packet Length Std": "the variation in packet sizes",
    "Packet Length Variance": "the variance in packet sizes",
    "FIN Flag Count": "the number of times the FIN flag was set",
    "SYN Flag Count": "the number of times the SYN flag was set",
    "RST Flag Count": "the number of times the RST flag was set",
    "PSH Flag Count": "the number of times the PSH flag was set",
    "ACK Flag Count": "the number of times the ACK flag was set",
    "URG Flag Count": "the number of times the URG flag was set",
    "CWE Flag Count": "the number of times the CWE flag was set",
    "ECE Flag Count": "the number of times the ECE flag was set",
    "Down/Up Ratio": "the ratio of incoming to outgoing traffic",
    "Average Packet Size": "the overall average size of packets",
    "Avg Fwd Segment Size": "the average size of forward segments",
    "Avg Bwd Segment Size": "the average size of backward segments",
    "Fwd Header Length.1": "the total size of forward packet headers",
    "Subflow Fwd Packets": "the number of forward packets in subflows",
    "Subflow Fwd Bytes": "the amount of forward data in subflows",
    "Subflow Bwd Packets": "the number of backward packets in subflows",
    "Subflow Bwd Bytes": "the amount of backward data in subflows",
    "Init_Win_bytes_forward": "the initial TCP window size requested by the source",
    "Init_Win_bytes_backward": "the initial TCP window size requested by the destination",
    "act_data_pkt_fwd": "the count of forward packets with at least 1 byte of payload",
    "min_seg_size_forward": "the minimum segment size observed in the forward direction",
    "Active Mean": "the average time the flow was active before going idle",
    "Active Std": "the variation in active time",
    "Active Max": "the maximum time the flow was active before going idle",
    "Active Min": "the minimum time the flow was active before going idle",
    "Idle Mean": "the average time the flow was idle",
    "Idle Std": "the variation in idle time",
    "Idle Max": "the maximum time the flow was idle",
    "Idle Min": "the minimum time the flow was idle"
}

def _build_reason(label: str, top_features: list[dict]) -> str:
    if label == "Benign":
        return "Traffic classified as benign. No anomalous feature patterns detected."
        
    base_desc = THREAT_DESCRIPTIONS.get(
        label,
        f"Suspicious {label} activity detected on the network."
    )
    
    top = top_features[:3]
    
    if not top:
        return base_desc
        
    sentences = [base_desc, "Our trained model flagged this specifically due to the following anomalous patterns in the network traffic:"]
    
    for i, f in enumerate(top):
        fname = f["feature"]
        desc = FEATURE_DESCRIPTIONS.get(fname, f"the '{fname}' metric")
        direction = "driven up" if f["direction"] == "increases risk" else "influenced"
        
        if i == 0:
            sentences.append(f"- Primarily, {desc} was highly unusual, which heavily {direction} the risk score.")
        elif i == 1:
            sentences.append(f"- Additionally, the model noted abnormal behavior in {desc}.")
        else:
            sentences.append(f"- Finally, {desc} also contributed to the malicious classification.")

    return " ".join(sentences)


class ExplainerService:
    def __init__(self) -> None:
        self._explainer: shap.TreeExplainer | None = None
        self._feature_names: list[str] = []
        self._label_encoder = None
        self._loaded: bool = False
        self._load_error: str | None = None
        self._lock = None

    @property
    def loaded(self) -> bool:
        return self._loaded

    @property
    def load_error(self) -> str | None:
        return self._load_error

    def load(self, models_path: Path) -> None:
        """Load SHAP explainer. Non-critical - predictions work without it."""
        self._load_error = None
        try:
            xgb_dir = models_path / "xgboost"
            model = xgb.Booster()
            model.load_model(str(xgb_dir / "model.json"))

            # Try to load SHAP background data (optional)
            bg_path = xgb_dir / "shap_background.pkl"
            if not bg_path.exists():
                self._load_error = f"SHAP background file not found: {bg_path}"
                logger.warning("⚠ %s", self._load_error)
                logger.info("  Explanations will not be available (predictions still work)")
                self._loaded = False
                return

            bg_data = joblib.load(str(bg_path))
            self._feature_names = bg_data["feature_names"]
            self._explainer = shap.TreeExplainer(model, data=bg_data["background"])
            self._label_encoder = joblib.load(str(models_path / "preprocessor" / "label_encoder.pkl"))
            self._loaded = True
            logger.info("✓ SHAP explainer loaded (background=%d rows)", len(bg_data["background"]))
        except Exception as e:
            self._load_error = f"{type(e).__name__}: {e}"
            logger.warning("⚠ Failed to load SHAP explainer: %s", self._load_error)
            logger.info("  Predictions will work without detailed explanations")
            self._loaded = False

    def _explain_sync(
        self,
        prediction_id: str,
        raw_features: dict[str, float],
        label: str,
        scaler,
    ) -> SHAPResult:
        if not self._loaded:
            raise RuntimeError("SHAP explainer not loaded - background data missing")
        
        vec = np.array(
            [raw_features.get(f, 0.0) for f in self._feature_names], dtype=np.float32
        ).reshape(1, -1)
        vec = np.nan_to_num(vec, nan=0.0, posinf=0.0, neginf=0.0)
        vec_scaled = scaler.transform(vec)

        label_idx = list(self._label_encoder.classes_).index(label)
        shap_vals = self._explainer.shap_values(vec_scaled)

        # shap_vals: either list[n_classes x (1, n_features)] or array (1, n_features, n_classes)
        if isinstance(shap_vals, list):
            sv = shap_vals[label_idx][0]
        elif isinstance(shap_vals, np.ndarray):
            if len(shap_vals.shape) == 3:
                # New SHAP versions return (n_samples, n_features, n_classes)
                sv = shap_vals[0, :, label_idx]
            else:
                sv = shap_vals[0]
        else:
            sv = shap_vals[0]

        # Build top-N sorted by absolute value
        pairs = sorted(
            zip(self._feature_names, sv),
            key=lambda x: abs(x[1]),
            reverse=True,
        )[:TOP_N]

        top_features = [
            {
                "feature": name,
                "shap_value": round(float(val), 6),
                "direction": "increases risk" if val > 0 else "decreases risk",
            }
            for name, val in pairs
        ]
        return SHAPResult(
            prediction_id=prediction_id,
            label=label,
            top_features=top_features,
            reason=_build_reason(label, top_features),
        )

    async def explain(
        self,
        prediction_id: str,
        raw_features: dict[str, float],
        label: str,
        scaler,
    ) -> SHAPResult:
        if self._lock is None:
            import asyncio
            self._lock = asyncio.Lock()
            
        async with self._lock:
            return await run_in_threadpool(
                self._explain_sync, prediction_id, raw_features, label, scaler
            )


explainer_service = ExplainerService()
