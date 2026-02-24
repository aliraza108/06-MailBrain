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
    <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6">
      <div className="text-sm font-semibold text-white mb-4">{title}</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data || []}>
            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "#11111a",
                border: "1px solid #2a2a3a",
                borderRadius: 8,
                color: "#e5e7eb",
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
