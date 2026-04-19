"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Play, Square, Zap } from "lucide-react";

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
} from "@/lib/api";
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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not start traffic replay.";
      setStatus((prev) => ({
        ...(prev ?? buildFallbackStatus(message, rate, limit, attackOnly)),
        last_error: message,
        message,
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleStop = async () => {
    setSubmitting(true);
    try {
      const next = await stopTrafficReplay();
      setStatus(next);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not stop traffic replay.";
      setStatus((prev) => ({
        ...(prev ?? buildFallbackStatus(message, rate, limit, attackOnly)),
        last_error: message,
        message,
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const running = status?.running ?? false;
  const canControl = Boolean(status?.enabled && status?.available);
  const isHeldOutReplay = status?.message?.toLowerCase().includes("held-out") ?? false;
  const toneClass = status?.last_error
    ? "border-rose-900/60 bg-rose-950/10 text-rose-200"
    : running
      ? "border-emerald-900/60 bg-emerald-950/20 text-emerald-200"
      : canControl
        ? "border-cyan-900/60 bg-cyan-950/20 text-cyan-200"
        : "border-neutral-800 bg-neutral-950/30 text-neutral-300";

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
                  ? "border-rose-800/70 text-rose-300"
                  : running
                    ? "border-emerald-800/70 text-emerald-300"
                    : canControl
                      ? "border-cyan-800/70 text-cyan-300"
                      : "border-neutral-700 text-neutral-400"
              )}
            >
              {status?.last_error ? "Issue" : running ? "Running" : canControl ? "Ready" : "Unavailable"}
            </span>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-current/20 bg-black/10 text-inherit hover:bg-black/20"
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
                  className="w-full rounded-md border border-current/15 bg-black/20 px-3 py-2 text-sm tracking-normal text-neutral-100 outline-none transition focus:border-cyan-500"
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
                  className="w-full rounded-md border border-current/15 bg-black/20 px-3 py-2 text-sm tracking-normal text-neutral-100 outline-none transition focus:border-cyan-500"
                />
              </label>

              {/* Keeping the attack-only control disabled in the UI for now.
                  The replay API and backend support remain in place. */}
              {/* <label className="flex min-h-10 items-center gap-3 rounded-md border border-current/15 bg-black/10 px-3 py-2 text-sm text-neutral-100">
                <input
                  type="checkbox"
                  checked={attackOnly}
                  onChange={(event) => setAttackOnly(event.target.checked)}
                  className="size-4 rounded border-current/30 bg-black/20 text-cyan-400"
                />
                Attack rows only
              </label> */}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                onClick={handleStart}
                disabled={loading || submitting || running || !canControl}
                className="bg-cyan-500 text-slate-950 hover:bg-cyan-400"
              >
                <Play className="size-3.5" />
                {running ? "Running..." : "Start"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleStop}
                disabled={loading || submitting || !running}
                className="border-current/20 bg-black/10 text-neutral-100 hover:bg-black/20"
              >
                <Square className="size-3.5" />
                Stop
              </Button>
            </div>

            <p
              className={cn(
                "text-xs",
                status?.last_error ? "text-rose-300" : "text-inherit/75"
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
