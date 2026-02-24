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
    <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6">
      <div className="text-sm font-semibold text-white mb-4">{title}</div>
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
                background: "#11111a",
                border: "1px solid #2a2a3a",
                borderRadius: 8,
                color: "#e5e7eb",
              }}
            />
            <Legend
              formatter={(value) => String(value).replace(/_/g, " ")}
              wrapperStyle={{ fontSize: 12, color: "#cbd5f5" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IntentDonut;
