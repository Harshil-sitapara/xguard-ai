"use client";

import { useEffect, useState, useRef } from "react";
import { Alert, fetchHistory } from "@/lib/api";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/api/v1";
const API_KEY = process.env.NEXT_PUBLIC_API_TOKEN || "";

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [totalIngested, setTotalIngested] = useState(0);
  const [totalAttacks, setTotalAttacks] = useState(0);
  const [attackDistribution, setAttackDistribution] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    let mounted = true;

    fetchHistory(1, 100)
      .then((res) => {
        if (mounted) {
          setAlerts(res.alerts);
          setTotalIngested(res.total_predictions || res.total || res.alerts.length);
          setTotalAttacks(res.total);

          const initialDist: Record<string, number> = {};
          res.alerts.forEach(a => {
            const type = (a.is_attack ?? (a.attack_type && a.attack_type !== "Benign")) ? a.attack_type : "Benign";
            initialDist[type] = (initialDist[type] || 0) + 1;
          });
          setAttackDistribution(initialDist);

          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Fetch history error:", err);
        if (mounted) setLoading(false);
      });

    const socket = new WebSocket(`${WS_URL}/alerts/live`);
    ws.current = socket;

    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);

    socket.onmessage = (event) => {
      try {
        const newAlert: Alert = JSON.parse(event.data);
        if (mounted) {
          setAlerts((prev) => [newAlert, ...prev].slice(0, 500));
          setTotalIngested((prev) => prev + 1);

          const isAttack = newAlert.is_attack ?? (newAlert.attack_type && newAlert.attack_type !== "Benign");
          const type = isAttack ? newAlert.attack_type : "Benign";

          setAttackDistribution((prev) => ({
            ...prev,
            [type]: (prev[type] || 0) + 1
          }));

          if (isAttack) {
            setTotalAttacks((prev) => prev + 1);
          }
        }
      } catch (err) {
        console.error("WS Parse error", err);
      }
    };

    return () => {
      mounted = false;
      socket.close();
    };
  }, []);

  return { alerts, totalIngested, totalAttacks, attackDistribution, loading, connected };
};
