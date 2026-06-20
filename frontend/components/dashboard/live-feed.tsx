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
      <div className="rounded-md border border-border bg-card relative">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Timestamp</TableHead>
            <TableHead>Connection (Src → Dst)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Confidence</TableHead>
            <TableHead className="text-right">XAI</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
      
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-[400px] overflow-y-auto relative isolate overflow-x-hidden"
      >
        <Table>
          <TableBody>
            {displayedAlerts.slice(0, 100).map((alert) => (
              <TableRow 
                key={alert.id} 
                className="border-b transition-colors hover:bg-muted cursor-pointer"
                onClick={() => onSelectAlert(alert.prediction_id)}
              >
                <TableCell className="font-mono text-xs text-muted-foreground w-[150px]">
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
                <TableCell className="text-right">
                  <span className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
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

      {isPaused && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            <ArrowUp className="w-4 h-4" />
            Resume Live Feed
          </button>
        </div>
      )}
    </div>
    </div>
  );
}
