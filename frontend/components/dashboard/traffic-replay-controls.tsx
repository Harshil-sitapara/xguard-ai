"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Play, Square, Zap, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  fetchReplayStatus,
  startTrafficReplay,
  stopTrafficReplay,
  TrafficReplayStatus,
  getApiBaseUrl,
} from "@/lib/api";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const POLL_MS = 2000;

function buildFallbackStatus(
  message: string,
  rate: string,
  limit: string,
  attackOnly: boolean
): TrafficReplayStatus {
  return {
    running: false,
    enabled: false,
    available: false,
    rate: Number(rate) || 0,
    limit: Number(limit) || 0,
    attack_only: attackOnly,
    started_at: null,
    finished_at: null,
    last_error: message,
    message,
    environment: "development",
  };
}

export function TrafficReplayControls() {
  const [open, setOpen] = useState(false);
  const [rate, setRate] = useState("10");
  const [limit, setLimit] = useState("500");
  const [attackOnly, setAttackOnly] = useState(false);
  const [status, setStatus] = useState<TrafficReplayStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    const loadStatus = async () => {
      try {
        const next = await fetchReplayStatus();
        if (active) {
          setStatus(next);
        }
      } catch (error) {
        if (active) {
          const message =
            error instanceof Error ? error.message : "Could not fetch replay status.";
          setStatus((prev) => prev ?? buildFallbackStatus(message, rate, limit, attackOnly));
          console.error("Replay status error:", error);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadStatus();
    const timer = window.setInterval(loadStatus, POLL_MS);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const handleStart = async () => {
    setSubmitting(true);
    try {
      const next = await startTrafficReplay({
        rate: Number(rate) || 0,
        limit: Number(limit) || 0,
        attack_only: attackOnly,
      });
      setStatus(next);
      void trackEvent("replay_start_success", {
        attack_only: attackOnly,
        limit: Number(limit) || 0,
        rate: Number(rate) || 0,
        replay_mode: next.message?.toLowerCase().includes("held-out")
          ? "held_out"
          : "packaged",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not start traffic replay.";
      setStatus((prev) => ({
        ...(prev ?? buildFallbackStatus(message, rate, limit, attackOnly)),
        last_error: message,
        message,
      }));
      void trackEvent("replay_error", { action: "start" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStop = async () => {
    setSubmitting(true);
    try {
      const next = await stopTrafficReplay();
      setStatus(next);
      void trackEvent("replay_stop_success");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not stop traffic replay.";
      setStatus((prev) => ({
        ...(prev ?? buildFallbackStatus(message, rate, limit, attackOnly)),
        last_error: message,
        message,
      }));
      void trackEvent("replay_error", { action: "stop" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = async () => {
    if (!confirm("Are you sure you want to clear all historical alerts and dashboard data? This cannot be undone.")) return;
    setSubmitting(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || "dev_public_key_for_frontend";
      const response = await fetch(`${getApiBaseUrl()}/alerts`, {
        method: "DELETE",
        headers: { "X-API-Key": apiKey },
      });
      if (!response.ok) {
        throw new Error("Failed to clear dashboard");
      }
      window.location.reload();
    } catch (error) {
      console.error("Clear dashboard error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const running = status?.running ?? false;
  const canControl = Boolean(status?.enabled && status?.available);
  const isHeldOutReplay = status?.message?.toLowerCase().includes("held-out") ?? false;
  const toneClass = status?.last_error
    ? "border-rose-400 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/10 text-rose-900 dark:text-rose-200"
    : running
      ? "border-emerald-400 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200"
      : canControl
        ? "border-cyan-400 dark:border-cyan-900/60 bg-cyan-50 dark:bg-cyan-950/20 text-cyan-900 dark:text-cyan-200"
        : "border-border bg-muted text-foreground";

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card size="sm" className={cn("backdrop-blur-sm", toneClass)}>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 space-y-1">
            <CardTitle className="flex items-center gap-2 text-sm text-inherit">
              <Zap className="size-4" />
              Traffic Replay
            </CardTitle>
            <CardDescription className="max-w-2xl text-[0.72rem] text-inherit/75">
              {running
                ? isHeldOutReplay
                  ? "Replaying the held-out evaluation split through Kafka."
                  : "Replaying bundled traffic through the live Kafka pipeline."
                : "Replay packaged traffic through the live backend pipeline."}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.2em] whitespace-nowrap",
                status?.last_error
                  ? "border-rose-300 dark:border-rose-800/70 text-rose-700 dark:text-rose-300"
                  : running
                    ? "border-emerald-300 dark:border-emerald-800/70 text-emerald-700 dark:text-emerald-300"
                    : canControl
                      ? "border-cyan-300 dark:border-cyan-800/70 text-cyan-700 dark:text-cyan-300"
                      : "border-gray-300 dark:border-neutral-700 text-gray-600 dark:text-neutral-400"
              )}
            >
              {status?.last_error ? "Issue" : running ? "Running" : canControl ? "Ready" : "Unavailable"}
            </span>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-current/20 bg-card hover:bg-muted text-foreground"
              >
                Controls
                <ChevronDown
                  className={cn("size-3.5 transition-transform", open && "rotate-180")}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-3 border-t border-current/10 pt-3">
            <div className="grid gap-2 md:grid-cols-2">
              <label className="space-y-1 text-[0.68rem] uppercase tracking-[0.2em] text-inherit/70">
                Rate
                <input
                  type="number"
                  min="0"
                  max="500"
                  step="1"
                  value={rate}
                  onChange={(event) => setRate(event.target.value)}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm tracking-normal text-foreground outline-none transition focus:border-cyan-500"
                />
              </label>

              <label className="space-y-1 text-[0.68rem] uppercase tracking-[0.2em] text-inherit/70">
                Rows (0 = full split)
                <input
                  type="number"
                  min="0"
                  max="20000"
                  step="50"
                  value={limit}
                  onChange={(event) => setLimit(event.target.value)}
                  className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm tracking-normal text-foreground outline-none transition focus:border-cyan-500"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                onClick={handleStart}
                disabled={loading || submitting || running || !canControl}
                className="bg-cyan-500 text-slate-50 hover:bg-cyan-400 dark:text-slate-950"
              >
                <Play className="size-3.5" />
                {running ? "Running..." : "Start"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleStop}
                disabled={loading || submitting || !running}
                className="border-current/20 bg-card text-foreground hover:bg-muted"
              >
                <Square className="size-3.5" />
                Stop
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleClear}
                disabled={loading || submitting}
                className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/50 ml-auto"
              >
                <Trash2 className="size-3.5 mr-1" />
                Clear Dashboard
              </Button>
            </div>

            <p
              className={cn(
                "text-xs",
                status?.last_error ? "text-rose-600 dark:text-rose-300" : "text-inherit/75"
              )}
            >
              {status?.message ?? "Replay status unavailable. Start the backend to enable replay."}
            </p>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
