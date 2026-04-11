import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/lib/api";
import { Activity, ShieldAlert, Crosshair, Network } from "lucide-react";

export function StatCards({ alerts, totalIngested = 0, totalAttacks = 0 }: { alerts: Alert[], totalIngested?: number, totalAttacks?: number }) {
  const total = totalIngested || alerts.length;
  const attacks = totalAttacks || alerts.filter(a => (a.is_attack ?? (a.attack_type && a.attack_type !== "Benign"))).length;
  const benign = total - attacks;
  const avgConfidence = alerts.length > 0 
    ? (alerts.reduce((acc, curr) => acc + curr.confidence, 0) / alerts.length * 100).toFixed(1) 
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-neutral-900/50 border-neutral-800 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-400">Total Packets Evaluated</CardTitle>
          <Network className="h-4 w-4 text-cyan-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-100">{total}</div>
          <p className="text-xs text-neutral-500">Live stream ingestion</p>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900/50 border-neutral-800 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-400">Benign Traffic</CardTitle>
          <Activity className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-100">{benign}</div>
          <p className="text-xs text-neutral-500">Safe connections</p>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900/50 border-rose-900/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-rose-500">Attacks Detected</CardTitle>
          <ShieldAlert className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-500">{attacks}</div>
          <p className="text-xs text-rose-500/70">Requires analyst review</p>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900/50 border-neutral-800 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-400">Avg Model Confidence</CardTitle>
          <Crosshair className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral-100">{avgConfidence}%</div>
          <p className="text-xs text-neutral-500">XGBoost prediction certainty</p>
        </CardContent>
      </Card>
    </div>
  );
}
