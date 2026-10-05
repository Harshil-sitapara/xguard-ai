import { Alert } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { useState, useRef, useEffect, UIEvent } from "react";
import { ArrowUp } from "lucide-react";

export function LiveFeed({ alerts, onSelectAlert }: { alerts: Alert[], onSelectAlert: (id: string) => void }) {
  const [isPaused, setIsPaused] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "attacks">("all");
  const [displayedAlerts, setDisplayedAlerts] = useState<Alert[]>(alerts);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPaused) {
      const filtered = alerts.filter(alert => {
        if (filterMode === "attacks") {
          return alert.is_attack ?? (alert.attack_type && alert.attack_type !== "Benign");
        }
        return true;
      });
      setDisplayedAlerts(filtered);
    }
  }, [alerts, isPaused, filterMode]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop > 50 && !isPaused) {
      setIsPaused(true);
    } else if (scrollTop <= 50 && isPaused) {
      setIsPaused(false);
    }
  };

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
      setIsPaused(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <div className="flex items-center rounded-md border border-border bg-card p-1 shadow-sm">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${filterMode === "all" ? "bg-indigo-500/10 text-indigo-400" : "text-muted-foreground hover:text-foreground"}`}
          >
            All Traffic
          </button>
          <button
            onClick={() => setFilterMode("attacks")}
            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${filterMode === "attacks" ? "bg-rose-500/10 text-rose-400" : "text-muted-foreground hover:text-foreground"}`}
          >
            Attacks
          </button>
        </div>
      </div>
      <div className="rounded-md border border-border bg-card relative overflow-hidden">
        {/* Mobile View: Clean Card Stream */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="sm:hidden h-[400px] overflow-y-auto p-2.5 space-y-2.5"
        >
          {displayedAlerts.slice(0, 100).map((alert) => {
            const isAttack = alert.is_attack ?? (alert.attack_type && alert.attack_type !== "Benign");
            return (
              <div
                key={alert.id}
                onClick={() => onSelectAlert(alert.prediction_id)}
                className="rounded-lg border border-border/70 bg-card/60 p-3 shadow-sm hover:bg-muted/50 transition cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {format(new Date(alert.created_at), "HH:mm:ss.SSS")}
                  </span>
                  {isAttack ? (
                    <Badge variant="destructive" className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border-0 text-[10px] px-2 py-0.5">
                      {alert.attack_type}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-0 text-[10px] px-2 py-0.5">
                      Benign
                    </Badge>
                  )}
                </div>

                <div className="font-mono text-xs text-foreground/90 truncate mb-2">
                  {alert.source_ip} <span className="text-muted-foreground">→</span> {alert.destination_ip}
                </div>

                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-border/40">
                  <span className="font-mono text-[11px] text-muted-foreground">
                    Conf: <span className="text-foreground font-semibold">{(alert.confidence * 100).toFixed(1)}%</span>
                  </span>
                  <span className="text-xs font-medium text-cyan-500 dark:text-cyan-400 hover:underline">
                    Explain SHAP →
                  </span>
                </div>
              </div>
            );
          })}
          {displayedAlerts.length === 0 && (
            <div className="h-40 flex items-center justify-center text-center text-xs text-muted-foreground">
              Waiting for network traffic...
            </div>
          )}
        </div>

        {/* Desktop View: Full Data Table */}
        <div className="hidden sm:block">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Timestamp</TableHead>
                  <TableHead>Connection (Src → Dst)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Confidence</TableHead>
                  <TableHead className="text-right w-[90px]">XAI</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>
          
          <div 
            onScroll={handleScroll}
            className="h-[400px] overflow-y-auto overflow-x-auto relative isolate"
          >
            <Table>
              <TableBody>
                {displayedAlerts.slice(0, 100).map((alert) => (
                  <TableRow 
                    key={alert.id} 
                    className="border-b transition-colors hover:bg-muted cursor-pointer"
                    onClick={() => onSelectAlert(alert.prediction_id)}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground w-[140px]">
                      {format(new Date(alert.created_at), "HH:mm:ss.SSS")}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {alert.source_ip} <span className="text-muted-foreground">→</span> {alert.destination_ip}
                    </TableCell>
                    <TableCell>
                      {(alert.is_attack ?? (alert.attack_type && alert.attack_type !== "Benign")) ? (
                        <Badge variant="destructive" className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border-0">
                          {alert.attack_type}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-0">
                          Benign
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-foreground/70">
                      {(alert.confidence * 100).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right w-[90px]">
                      <span className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline underline-offset-2 font-medium">
                        Explain
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {displayedAlerts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Waiting for network traffic...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {isPaused && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <button 
              onClick={scrollToTop}
              className="flex items-center gap-1.5 sm:gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Resume Live Feed
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
