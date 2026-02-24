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
    <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6">
      <div className="text-sm font-semibold text-white mb-4">Automation Breakdown</div>
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
                background: "#11111a",
                border: "1px solid #2a2a3a",
                borderRadius: 8,
                color: "#e5e7eb",
              }}
            />
            <Legend formatter={(value) => String(value).replace(/_/g, " ")} wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AutomationPie;
