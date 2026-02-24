import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import type { TrendPoint } from "@/lib/types";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

interface TrendChartProps {
  data?: TrendPoint[];
  loading?: boolean;
  title?: string;
}

const TrendChart = ({ data, loading, title = "Email Volume - Last 14 Days" }: TrendChartProps) => {
  if (loading) {
    return <SkeletonLoader className="h-72 w-full" />;
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="text-sm font-semibold text-foreground mb-4">{title}</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data || []}>
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                color: "hsl(var(--foreground))",
              }}
            />
            <Area type="monotone" dataKey="total" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
            <Area
              type="monotone"
              dataKey="auto_replied"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.12}
            />
            <Area type="monotone" dataKey="escalated" stroke="#ef4444" fill="#ef4444" fillOpacity={0.12} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;

