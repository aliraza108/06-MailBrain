import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import type { AutomationStats } from "@/lib/types";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

interface AutomationPieProps {
  data?: AutomationStats;
  loading?: boolean;
}

const COLORS = ["#6366f1", "#22c55e", "#f97316", "#ef4444", "#3b82f6", "#8b5cf6"];

const AutomationPie = ({ data, loading }: AutomationPieProps) => {
  if (loading) {
    return <SkeletonLoader className="h-60 w-full" />;
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="text-sm font-semibold text-foreground mb-4">Automation Breakdown</div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data?.actions || []}
              dataKey="count"
              nameKey="action"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
            >
              {(data?.actions || []).map((entry, index) => (
                <Cell key={entry.action} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                color: "hsl(var(--foreground))",
              }}
            />
            <Legend
              formatter={(value) => String(value).replace(/_/g, " ")}
              wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AutomationPie;

