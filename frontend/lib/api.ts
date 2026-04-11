export interface Alert {
  id: string;
  prediction_id: string;
  created_at: string;
  source_ip: string;
  destination_ip: string;
  protocol: string;
  label: string;
  attack_type: string;
  is_attack?: boolean;
  confidence: number;
}

export interface AlertsResponse {
  alerts: Alert[];
  total: number;
  total_predictions?: number;
  page: number;
  page_size: number;
}

export interface ShapFeature {
  feature: string;
  shap_value: number;
  direction: "increases risk" | "decreases risk";
}

export interface ShapResult {
  prediction_id: string;
  label: string;
  reason: string;
  top_features: ShapFeature[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

export const fetchHistory = async (page = 1, pageSize = 50): Promise<AlertsResponse> => {
  const rs = await fetch(`${API_URL}/alerts?page=${page}&page_size=${pageSize}`, {
    headers: { "X-API-Key": API_KEY }
  });
  if (!rs.ok) throw new Error("Failed to fetch alerts history");
  return rs.json();
};

export const fetchExplanation = async (id: string): Promise<ShapResult> => {
  const rs = await fetch(`${API_URL}/explain/${id}`, {
    headers: { "X-API-Key": API_KEY }
  });
  if (!rs.ok) throw new Error("Failed to fetch SHAP explanation");
  return rs.json();
};
