import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import type { PriorityCount } from "@/lib/types";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

interface PriorityChartProps {
  data?: PriorityCount[];
  loading?: boolean;
  title?: string;
}

const colors: Record<string, string> = {
  CRITICAL: "#ef4444",
  HIGH: "#f97316",
  NORMAL: "#3b82f6",
  LOW: "#6b7280",
};

const PriorityChart = ({ data, loading, title = "Priority Breakdown" }: PriorityChartProps) => {
  if (loading) {
    return <SkeletonLoader className="h-60 w-full" />;
  }

  return (
    <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6">
      <div className="text-sm font-semibold text-white mb-4">{title}</div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data || []} layout="vertical">
            <XAxis type="number" stroke="#6b7280" fontSize={12} tickLine={false} />
            <YAxis dataKey="priority" type="category" stroke="#6b7280" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "#11111a",
                border: "1px solid #2a2a3a",
                borderRadius: 8,
                color: "#e5e7eb",
              }}
            />
            <Bar
              dataKey="count"
              radius={[6, 6, 6, 6]}
              fill="#6366f1"
              label={{ fill: "#e5e7eb", fontSize: 12 }}
            >
              {(data || []).map((entry) => (
                <Cell key={entry.priority} fill={colors[entry.priority] || "#6366f1"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriorityChart;
