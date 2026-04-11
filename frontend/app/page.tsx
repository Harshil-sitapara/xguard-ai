"use client";

import { useAlerts } from "@/hooks/use-alerts";
import { StatCards } from "@/components/dashboard/stat-cards";
import { AttackChart } from "@/components/dashboard/attack-chart";
import { LiveFeed } from "@/components/dashboard/live-feed";
import { ShapDialog } from "@/components/dashboard/shap-dialog";
import { useState } from "react";
import { Shield } from "lucide-react";

export default function Dashboard() {
  const { alerts, totalIngested, totalAttacks, attackDistribution, loading, connected } = useAlerts();
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-950 text-neutral-400">
        Initializing XGuard-AI Dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8 font-sans selection:bg-rose-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-neutral-100 to-neutral-500 bg-clip-text text-transparent flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-500" />
            XGuard-AI
          </h1>
          <p className="text-neutral-500 text-sm mt-1">Real-time XGBoost Threat Detection & SHAP Explainer</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm shadow-sm">
          <div className="relative flex h-3 w-3">
            {connected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${connected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          </div>
          <span className="text-xs font-medium text-neutral-300 uppercase tracking-widest">{connected ? "Kafka Stream Active" : "Disconnected"}</span>
        </div>
      </div>

      {/* Top Metrics */}
      <StatCards alerts={alerts} totalIngested={totalIngested} totalAttacks={totalAttacks} />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Col: Charts */}
        <div className="lg:col-span-1 space-y-6">
          <AttackChart alerts={alerts} attackDistribution={attackDistribution} />
        </div>

        {/* Right Col: Live Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Live Network Packets</h2>
            <span className="text-xs text-neutral-500">Click any row for SHAP analysis</span>
          </div>
          <LiveFeed alerts={alerts} onSelectAlert={setSelectedAlertId} />
        </div>
      </div>

      {/* SHAP Modal */}
      <ShapDialog 
        predictionId={selectedAlertId} 
        open={selectedAlertId !== null} 
        onOpenChange={(isOpen) => !isOpen && setSelectedAlertId(null)} 
      />
    </main>
  );
}
