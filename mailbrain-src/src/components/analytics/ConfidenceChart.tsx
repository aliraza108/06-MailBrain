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
    <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6">
      <div className="text-sm font-semibold text-white mb-4">Confidence Score Distribution</div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data || []}>
            <XAxis dataKey="range" stroke="#6b7280" fontSize={12} tickLine={false} />
            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "#11111a",
                border: "1px solid #2a2a3a",
                borderRadius: 8,
                color: "#e5e7eb",
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
