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
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="text-sm font-semibold text-foreground mb-4">Department Routing</div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data || []} layout="vertical">
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
            <YAxis dataKey="department" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} width={120} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                color: "hsl(var(--foreground))",
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 6, 6]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepartmentChart;

