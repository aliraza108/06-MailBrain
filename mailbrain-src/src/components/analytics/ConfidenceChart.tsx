import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

interface ConfidenceChartProps {
  data?: { range: string; count: number }[];
  loading?: boolean;
}

const ConfidenceChart = ({ data, loading }: ConfidenceChartProps) => {
  if (loading) {
    return <SkeletonLoader className="h-60 w-full" />;
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="text-sm font-semibold text-foreground mb-4">Confidence Score Distribution</div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data || []}>
            <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                color: "hsl(var(--foreground))",
              }}
            />
            <Bar dataKey="count" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ConfidenceChart;

