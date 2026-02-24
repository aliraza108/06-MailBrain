import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

interface DepartmentChartProps {
  data?: { department: string; count: number }[];
  loading?: boolean;
}

const DepartmentChart = ({ data, loading }: DepartmentChartProps) => {
  if (loading) {
    return <SkeletonLoader className="h-60 w-full" />;
  }

  return (
    <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6">
      <div className="text-sm font-semibold text-white mb-4">Department Routing</div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data || []} layout="vertical">
            <XAxis type="number" stroke="#6b7280" fontSize={12} tickLine={false} />
            <YAxis dataKey="department" type="category" stroke="#6b7280" fontSize={12} tickLine={false} width={120} />
            <Tooltip
              contentStyle={{
                background: "#11111a",
                border: "1px solid #2a2a3a",
                borderRadius: 8,
                color: "#e5e7eb",
              }}
            />
            <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 6, 6]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepartmentChart;
