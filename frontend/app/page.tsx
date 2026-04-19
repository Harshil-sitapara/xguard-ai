"use client";

import { useAlerts } from "@/hooks/use-alerts";
import { StatCards } from "@/components/dashboard/stat-cards";
import { AttackChart } from "@/components/dashboard/attack-chart";
import { LiveFeed } from "@/components/dashboard/live-feed";
import { ShapDialog } from "@/components/dashboard/shap-dialog";
import Image from "next/image";
import { useState } from "react";

export default function Dashboard() {
  const { alerts, totalIngested, totalAttacks, attackDistribution, loading, connected } = useAlerts();
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-950 text-neutral-400">
        <div className="flex flex-col items-center gap-4 text-center">
          <Image
            src="/brand/xguard-mark.svg"
            alt="XGuard-AI logo"
            width={84}
            height={84}
            priority
            className="h-[84px] w-[84px]"
          />
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-cyan-200/70">XGuard-AI</p>
            <p>Initializing dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-8 font-sans text-neutral-100 selection:bg-cyan-400/20">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-[2rem] bg-cyan-400/15 blur-2xl" />
            <Image
              src="/brand/xguard-mark.svg"
              alt="XGuard-AI"
              width={88}
              height={88}
              priority
              className="relative h-[76px] w-[76px] md:h-[88px] md:w-[88px]"
            />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-[0.22em] text-white md:text-4xl">
                <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
                  X
                </span>
                GUARD
              </h1>
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.38em] text-cyan-200">
                AI
              </span>
            </div>
            <p className="max-w-2xl text-sm text-neutral-500 md:text-[0.95rem]">
              Explainable intrusion detection for live network defense and analyst-ready threat intelligence.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-neutral-800 bg-neutral-900/50 px-4 py-2 shadow-sm backdrop-blur-sm">
          <div className="relative flex h-3 w-3">
            {connected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${connected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          </div>
          <span className="text-xs font-medium uppercase tracking-widest text-neutral-300">{connected ? "Kafka Stream Active" : "Disconnected"}</span>
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
