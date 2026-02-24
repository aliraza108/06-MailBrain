import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import type { IntentCount } from "@/lib/types";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

interface IntentDonutProps {
  data?: IntentCount[];
  loading?: boolean;
  title?: string;
}

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f97316",
  "#ef4444",
  "#3b82f6",
  "#6b7280",
  "#14b8a6",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
];

const IntentDonut = ({ data, loading, title = "Intent Distribution" }: IntentDonutProps) => {
  if (loading) {
    return <SkeletonLoader className="h-72 w-full" />;
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="text-sm font-semibold text-foreground mb-4">{title}</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data || []}
              dataKey="count"
              nameKey="intent"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
            >
              {(data || []).map((entry, index) => (
                <Cell key={`cell-${entry.intent}`} fill={COLORS[index % COLORS.length]} />
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

export default IntentDonut;

