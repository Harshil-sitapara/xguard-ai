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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-6 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Packets</CardTitle>
          <Network className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-500" />
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold">{total}</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Live stream ingestion</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-6 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Benign Traffic</CardTitle>
          <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold">{benign}</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Safe connections</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-6 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-rose-500">Attacks Detected</CardTitle>
          <ShieldAlert className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-500" />
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold text-rose-500">{attacks}</div>
          <p className="text-[10px] sm:text-xs text-rose-500/70 truncate">Requires review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-6 pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Avg Confidence</CardTitle>
          <Crosshair className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-500" />
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          <div className="text-xl sm:text-2xl font-bold">{avgConfidence}%</div>
          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">XGBoost certainty</p>
        </CardContent>
      </Card>
    </div>
  );
}
