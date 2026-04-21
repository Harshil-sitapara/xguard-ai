"use client";

import { useAlerts } from "@/hooks/use-alerts";
import { StatCards } from "@/components/dashboard/stat-cards";
import { AttackChart } from "@/components/dashboard/attack-chart";
import { LiveFeed } from "@/components/dashboard/live-feed";
import { ShapDialog } from "@/components/dashboard/shap-dialog";
import { TrafficReplayControls } from "@/components/dashboard/traffic-replay-controls";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { useState } from "react";

export default function DashboardPage() {
  const { alerts, totalIngested, totalAttacks, attackDistribution, loading, connected } = useAlerts();
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 transition-colors duration-300">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
            <Image
              src="/brand/small.png"
              alt="XGuard-AI logo"
              width={120}
              height={120}
              priority
              className="relative h-[120px] w-[120px] drop-shadow-lg"
            />
          </div>
          <div className="space-y-3">
            <p className="text-lg font-semibold text-cyan-600 dark:text-cyan-100">XGuard AI</p>
            <div className="flex items-center gap-2 justify-center">
              <div className="h-2 w-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="h-2 w-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="h-2 w-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">Initializing threat detection system...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 p-8 font-sans text-neutral-900 dark:text-neutral-100 selection:bg-cyan-400/20 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/brand/log_with_name.png"
            alt="XGuard-AI"
            width={280}
            height={70}
            priority
            className="h-auto w-auto max-w-sm"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-4 py-2 shadow-sm backdrop-blur-sm transition-colors duration-300">
            <div className="relative flex h-3 w-3">
              {connected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${connected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </div>
            <span className="text-xs font-medium uppercase tracking-widest text-neutral-600 dark:text-neutral-300 transition-colors duration-300">{connected ? "Kafka Stream Active" : "Disconnected"}</span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="mb-6">
        <TrafficReplayControls />
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
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Live Network Packets</h2>
            <span className="text-xs text-neutral-500 dark:text-neutral-500">Click any row for SHAP analysis</span>
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
