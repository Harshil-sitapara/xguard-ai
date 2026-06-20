import { Alert } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#10b981", "#f43f5e", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4"];

export function AttackChart({ alerts, attackDistribution = {} }: { alerts: Alert[], attackDistribution?: Record<string, number> }) {
  let data = Object.keys(attackDistribution).map((key, i) => ({
    name: key,
    value: attackDistribution[key],
    color: key === "Benign" ? "#10b981" : COLORS[(i + 1) % COLORS.length]
  }));

  if (data.length === 0 && alerts.length > 0) {
    const counts: Record<string, number> = {};
    alerts.forEach(a => {
      let type = (a.is_attack ?? (a.attack_type && a.attack_type !== "Benign")) ? a.attack_type : "Benign";
      counts[type] = (counts[type] || 0) + 1;
    });
    data = Object.keys(counts).map((key, i) => ({
      name: key,
      value: counts[key],
      color: key === "Benign" ? "#10b981" : COLORS[(i + 1) % COLORS.length]
    }));
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Traffic Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px] w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            Waiting for data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={data.length > 1 ? 2 : 0}
                dataKey="value"
                stroke="rgba(0,0,0,0)"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px", color: "var(--foreground)" }}
                itemStyle={{ color: "var(--foreground)" }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: 'var(--muted-foreground)' }}/>
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
