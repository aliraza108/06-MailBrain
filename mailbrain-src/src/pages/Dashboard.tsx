import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatsCards from "@/components/dashboard/StatsCards";
import TrendChart from "@/components/dashboard/TrendChart";
import IntentDonut from "@/components/dashboard/IntentDonut";
import EscalationPanel from "@/components/dashboard/EscalationPanel";
import PriorityChart from "@/components/analytics/PriorityChart";
import { toast } from "@/components/ui/sonner";
import {
  useEscalations,
  useIntentStats,
  useOverviewStats,
  usePriorityStats,
  useTrendStats,
} from "@/hooks/useAnalytics";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("mailbrain_token", token);
      window.history.replaceState({}, "", "/dashboard");
    }
  }, []);

  const overview = useOverviewStats(7);
  const trends = useTrendStats(14);
  const intent = useIntentStats(30);
  const priority = usePriorityStats(7);
  const escalations = useEscalations(7);

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
    if (priority.error) toast.error(`Failed to load priority: ${(priority.error as Error).message}`);
  }, [priority.error]);
  useEffect(() => {
    if (escalations.error) toast.error(`Failed to load escalations: ${(escalations.error as Error).message}`);
  }, [escalations.error]);

  return (
    <div className="space-y-6">
      <StatsCards stats={overview.data} loading={overview.isLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChart data={trends.data?.points} loading={trends.isLoading} />
        </div>
        <IntentDonut data={intent.data?.intents} loading={intent.isLoading} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PriorityChart data={priority.data?.priorities} loading={priority.isLoading} />
        <div className="lg:col-span-2">
          <EscalationPanel
            report={escalations.data}
            loading={escalations.isLoading}
            onView={(id) => navigate(`/inbox?email=${id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


