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

const DEFAULT_API_URL = "http://localhost:8000/api/v1";
const API_KEY = process.env.NEXT_PUBLIC_API_TOKEN || "";

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const isSecureBrowserContext = () =>
  typeof window !== "undefined" && window.location.protocol === "https:";

const toHttpUrl = (value: string) => {
  if (value.startsWith("wss://")) {
    return `https://${value.slice("wss://".length)}`;
  }

  if (value.startsWith("ws://")) {
    return `http://${value.slice("ws://".length)}`;
  }

  return value;
};

const toWebSocketUrl = (value: string) => {
  if (value.startsWith("https://")) {
    return `wss://${value.slice("https://".length)}`;
  }

  if (value.startsWith("http://")) {
    return `ws://${value.slice("http://".length)}`;
  }

  return value;
};

const upgradeForSecurePage = (
  value: string,
  insecureProtocol: "http" | "ws",
  secureProtocol: "https" | "wss"
) => {
  if (!isSecureBrowserContext() || !value.startsWith(`${insecureProtocol}://`)) {
    return value;
  }

  return `${secureProtocol}://${value.slice(`${insecureProtocol}://`.length)}`;
};

export const getApiBaseUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
  return stripTrailingSlash(
    upgradeForSecurePage(toHttpUrl(configuredUrl), "http", "https")
  );
};

export const getWebSocketBaseUrl = () => {
  const configuredUrl =
    process.env.NEXT_PUBLIC_WS_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    DEFAULT_API_URL;

  return stripTrailingSlash(
    upgradeForSecurePage(toWebSocketUrl(configuredUrl), "ws", "wss")
  );
};

export const fetchHistory = async (page = 1, pageSize = 50): Promise<AlertsResponse> => {
  const rs = await fetch(`${getApiBaseUrl()}/alerts?page=${page}&page_size=${pageSize}`, {
    headers: { "X-API-Key": API_KEY }
  });
  if (!rs.ok) throw new Error("Failed to fetch alerts history");
  return rs.json();
};

export const fetchExplanation = async (id: string): Promise<ShapResult> => {
  const rs = await fetch(`${getApiBaseUrl()}/explain/${id}`, {
    headers: { "X-API-Key": API_KEY }
  });
  if (!rs.ok) throw new Error("Failed to fetch SHAP explanation");
  return rs.json();
};
