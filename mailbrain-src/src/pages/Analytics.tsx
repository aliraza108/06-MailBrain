import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import TrendChart from "@/components/dashboard/TrendChart";
import IntentDonut from "@/components/dashboard/IntentDonut";
import PriorityChart from "@/components/analytics/PriorityChart";
import AutomationPie from "@/components/analytics/AutomationPie";
import DepartmentChart from "@/components/analytics/DepartmentChart";
import ConfidenceChart from "@/components/analytics/ConfidenceChart";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import {
  useAutomationStats,
  useIntentStats,
  useOverviewStats,
  usePriorityStats,
  useTrendStats,
} from "@/hooks/useAnalytics";

const ranges = [7, 14, 30];

const Analytics = () => {
  const [range, setRange] = useState(30);

  const overview = useOverviewStats(range);
  const trends = useTrendStats(range);
  const intent = useIntentStats(range);
  const priority = usePriorityStats(range);
  const automation = useAutomationStats();

  useEffect(() => {
    if (overview.error) toast.error(`Failed to load overview: ${(overview.error as Error).message}`);
  }, [overview.error]);
  useEffect(() => {
    if (trends.error) toast.error(`Failed to load trends: ${(trends.error as Error).message}`);
  }, [trends.error]);
  useEffect(() => {
    if (intent.error) toast.error(`Failed to load intents: ${(intent.error as Error).message}`);
  }, [intent.error]);
  useEffect(() => {
    if (priority.error) toast.error(`Failed to load priorities: ${(priority.error as Error).message}`);
  }, [priority.error]);
  useEffect(() => {
    if (automation.error) toast.error(`Failed to load automation: ${(automation.error as Error).message}`);
  }, [automation.error]);

  const overviewCards = useMemo(() => {
    const stats = overview.data;
    const automationRate = stats?.automation_rate ?? 0;
    const automationPercent = automationRate <= 1 ? automationRate * 100 : automationRate;
    const avgConfidence = stats?.avg_confidence ?? 0;
    const avgConfidencePercent = avgConfidence <= 1 ? avgConfidence * 100 : avgConfidence;
    return [
      { label: "Total Emails", value: stats?.total_emails ?? 0 },
      { label: "Critical", value: stats?.critical_emails ?? 0 },
      { label: "Auto-Replied", value: stats?.auto_replied ?? 0 },
      { label: "Escalated", value: stats?.escalated ?? 0 },
      { label: "Automation Rate", value: `${Math.round(automationPercent)}%` },
      { label: "Avg Confidence", value: `${Math.round(avgConfidencePercent)}%` },
    ];
  }, [overview.data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">Overview</div>
        <div className="flex gap-2">
          {ranges.map((value) => (
            <Button
              key={value}
              size="sm"
              variant="secondary"
              className={value === range ? "bg-indigo-600 text-white" : "bg-[#1a1a24] border border-[#2a2a3a]"}
              onClick={() => setRange(value)}
            >
              {value}d
            </Button>
          ))}
        </div>
      </div>

      {overview.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonLoader key={idx} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {overviewCards.map((card) => (
            <div key={card.label} className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-5">
              <div className="text-xs text-gray-400">{card.label}</div>
              <div className="text-2xl font-semibold text-white">{card.value}</div>
            </div>
          ))}
        </div>
      )}

      <TrendChart data={trends.data?.points} loading={trends.isLoading} title={`Email Volume - Last ${range} Days`} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <IntentDonut data={intent.data?.intents} loading={intent.isLoading} title="Intent Distribution" />
          <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-2">Intent Breakdown</div>
            <div className="space-y-2 text-sm text-gray-300">
              {(intent.data?.intents || []).map((item) => (
                <div key={item.intent} className="flex items-center justify-between">
                  <span>{item.intent.replace(/_/g, " ")}</span>
                  <span className="text-gray-400">{item.count}</span>
                </div>
              ))}
              {!intent.data?.intents?.length && <div className="text-xs text-gray-500">No data.</div>}
            </div>
          </div>
        </div>
        <PriorityChart data={priority.data?.priorities} loading={priority.isLoading} title="Priority Heatmap" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AutomationPie data={automation.data} loading={automation.isLoading} />
        <DepartmentChart data={automation.data?.departments} loading={automation.isLoading} />
      </div>

      <ConfidenceChart data={automation.data?.confidence} loading={automation.isLoading} />
    </div>
  );
};

export default Analytics;
