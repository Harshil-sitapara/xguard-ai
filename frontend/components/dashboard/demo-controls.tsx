"use client";

import { useState } from "react";
import { Play, ShieldAlert, Waves } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoScenario, simulateDemoTraffic } from "@/lib/api";

const DEMO_PRESETS: Array<{
  label: string;
  scenario: DemoScenario;
  count: number;
  intervalMs: number;
  icon: typeof Play;
}> = [
  { label: "Benign Demo", scenario: "benign", count: 8, intervalMs: 450, icon: Play },
  { label: "Attack Demo", scenario: "attack", count: 8, intervalMs: 550, icon: ShieldAlert },
  { label: "Mixed Demo", scenario: "mixed", count: 12, intervalMs: 500, icon: Waves },
];

export function DemoControls() {
  const [running, setRunning] = useState<DemoScenario | null>(null);
  const [status, setStatus] = useState(
    "Start a demo stream to show live packets, alerts, and explanations."
  );

  const runPreset = async (scenario: DemoScenario, count: number, intervalMs: number) => {
    setRunning(scenario);
    try {
      const result = await simulateDemoTraffic(scenario, count, intervalMs);
      setStatus(
        `Streaming ${result.count} ${result.scenario} events live into the dashboard.`
      );
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Could not start demo traffic."
      );
    } finally {
      setRunning(null);
    }
  };

  return (
    <Card className="border-cyan-900/60 bg-cyan-950/20 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-cyan-200">
          Demo Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {DEMO_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isActive = running === preset.scenario;
            return (
              <Button
                key={preset.label}
                variant={preset.scenario === "attack" ? "destructive" : "outline"}
                size="sm"
                disabled={running !== null}
                onClick={() => runPreset(preset.scenario, preset.count, preset.intervalMs)}
                className="border-cyan-800/60 bg-neutral-950/40 text-neutral-100 hover:bg-cyan-950/30"
              >
                <Icon className="size-3.5" />
                {isActive ? "Starting..." : preset.label}
              </Button>
            );
          })}
        </div>
        <p className="text-xs text-cyan-100/80">{status}</p>
      </CardContent>
    </Card>
  );
}
