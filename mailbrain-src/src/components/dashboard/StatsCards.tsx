import { Mail, AlertTriangle, Zap, TrendingUp } from "lucide-react";
import type { OverviewStats } from "@/lib/types";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

interface StatsCardsProps {
  stats?: OverviewStats;
  loading?: boolean;
}

const StatsCards = ({ stats, loading }: StatsCardsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <SkeletonLoader key={idx} className="h-28 w-full" />
        ))}
      </div>
    );
  }

  const automationRate = stats?.automation_rate ?? 0;
  const automationPercent = automationRate <= 1 ? automationRate * 100 : automationRate;

  const cards = [
    {
      label: "Total Emails",
      value: stats?.total_emails ?? 0,
      icon: Mail,
      color: "text-blue-400",
      bg: "from-blue-500/20 to-blue-500/5",
    },
    {
      label: "Critical",
      value: stats?.critical_emails ?? 0,
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "from-red-500/20 to-red-500/5",
    },
    {
      label: "Auto-Replied",
      value: stats?.auto_replied ?? 0,
      icon: Zap,
      color: "text-green-400",
      bg: "from-green-500/20 to-green-500/5",
    },
    {
      label: "Automation Rate",
      value: `${Math.round(automationPercent)}%`,
      icon: TrendingUp,
      color: "text-primary",
      bg: "from-primary/20 to-primary/5",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-card border border-border rounded-xl p-6 shadow-sm"
          >
            <div className={`rounded-lg bg-gradient-to-br ${card.bg} p-3 w-fit`}>
              <Icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div className="mt-4 text-2xl font-semibold text-foreground">{card.value}</div>
            <div className="text-xs text-muted-foreground">{card.label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;

