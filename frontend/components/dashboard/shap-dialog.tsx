import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics";
import { ShapResult, fetchExplanation } from "@/lib/api";
import { useEffect, useRef, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { ShieldAlert, Activity } from "lucide-react";

export function ShapDialog({ predictionId, open, onOpenChange }: { predictionId: string | null, open: boolean, onOpenChange: (open: boolean) => void }) {
  const [data, setData] = useState<ShapResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loggedOpenKeyRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;

    if (open && predictionId) {
      const openKey = `shap:${predictionId}`;
      if (loggedOpenKeyRef.current !== openKey) {
        loggedOpenKeyRef.current = openKey;
        void trackEvent("shap_open");
      }

      setLoading(true);
      setError(null);
      fetchExplanation(predictionId)
        .then((res) => {
          if (!active) {
            return;
          }

          setData(res);
          void trackEvent("shap_load_success", {
            top_feature_count: res.top_features.length,
          });
        })
        .catch((err) => {
          if (!active) {
            return;
          }

          setError(err.message);
          void trackEvent("shap_load_error");
        })
        .finally(() => {
          if (active) {
            setLoading(false);
          }
        });
    } else {
      loggedOpenKeyRef.current = null;
      setData(null);
      setError(null);
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [open, predictionId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            SHAP Explainability Analysis
            {data && data.label !== "Benign" ? <ShieldAlert className="text-rose-500 w-5 h-5 shrink-0"/> : <Activity className="text-emerald-500 w-5 h-5 shrink-0"/>}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Feature attributions driving the model's decision for prediction ID: <span className="font-mono text-[11px] sm:text-xs break-all">{predictionId}</span>
          </DialogDescription>
        </DialogHeader>

        {loading && <div className="h-[250px] sm:h-[300px] flex items-center justify-center text-muted-foreground text-sm">Generating SHAP values...</div>}
        {error && <div className="h-[250px] sm:h-[300px] flex items-center justify-center text-rose-500 text-sm">{error}</div>}
        
        {data && !loading && !error && (
          <div className="space-y-4">
            <div className={`p-3 sm:p-4 rounded-lg border ${data.label === "Benign" ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50" : "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50"}`}>
              <h4 className="font-semibold mb-1 text-xs sm:text-sm">XGBoost Reason:</h4>
              <p className="text-xs sm:text-sm leading-relaxed">{data.reason}</p>
            </div>
            
            <div className="h-[240px] sm:h-[260px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={data.top_features.map(f => ({ ...f, abs_value: Math.abs(f.shap_value) }))} 
                  layout="vertical" 
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <XAxis type="number" hide />
                  <YAxis dataKey="feature" type="category" width={115} tick={{fill: "currentColor", fontSize: 10}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: "rgba(255,255,255,0.05)"}}
                    contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px", color: "var(--foreground)" }}
                    itemStyle={{ fontSize: 11, color: "var(--foreground)" }}
                    formatter={(value: any, name: any, props: any) => [props.payload.shap_value.toFixed(6), 'SHAP Value']}
                  />
                  <Bar dataKey="abs_value" radius={[0, 4, 4, 0]}>
                    {data.top_features.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.shap_value > 0 ? (data.label === "Benign" ? "#10b981" : "#f43f5e") : "#3b82f6"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap text-[11px] sm:text-xs gap-3 justify-end text-muted-foreground pt-2 border-t border-border">
                <span className="flex items-center gap-1.5"><div className={`w-2.5 h-2.5 rounded-full ${data.label === "Benign" ? "bg-emerald-500" : "bg-rose-500"}`}></div> Supports Label</span>
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Opposes Label</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
