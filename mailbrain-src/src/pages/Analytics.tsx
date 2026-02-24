import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAutomationStats, useEscalations, useIntentStats, useOverviewStats, usePriorityStats, useTrendStats } from "@/hooks/useAnalytics";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const dayRanges = [7, 14, 30];

const Analytics = () => {
  const [days, setDays] = useState(14);
  const overview = useOverviewStats(days);
  const intent = useIntentStats(days);
  const priority = usePriorityStats(days);
  const trends = useTrendStats(days);
  const automation = useAutomationStats();
  const escalations = useEscalations(days);

  const automationPie = useMemo(
    () => (automation.data?.actions || []).map((item) => ({ name: item.action, value: item.count })),
    [automation.data?.actions]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Analytics Overview</h2>
        <div className="flex gap-2">
          {dayRanges.map((range) => (
            <Button key={range} size="sm" variant={range === days ? "default" : "outline"} onClick={() => setDays(range)}>
              {range}d
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4"><div className="text-xs text-muted-foreground">Total</div><div className="text-xl font-semibold">{overview.data?.total_emails ?? 0}</div></div>
        <div className="rounded-xl border border-border bg-card p-4"><div className="text-xs text-muted-foreground">Critical</div><div className="text-xl font-semibold">{overview.data?.critical_emails ?? 0}</div></div>
        <div className="rounded-xl border border-border bg-card p-4"><div className="text-xs text-muted-foreground">Auto Reply</div><div className="text-xl font-semibold">{overview.data?.auto_replied ?? 0}</div></div>
        <div className="rounded-xl border border-border bg-card p-4"><div className="text-xs text-muted-foreground">Escalations</div><div className="text-xl font-semibold">{overview.data?.escalated ?? 0}</div></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Email Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends.data?.points || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Intent Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intent.data?.intents || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="intent" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Priority Mix</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priority.data?.priorities || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="priority" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Automation Actions</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={automationPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold mb-3">Escalated Emails ({escalations.data?.count ?? 0})</h3>
        <div className="space-y-2">
          {(escalations.data?.emails || []).slice(0, 6).map((email) => (
            <div key={email.id} className="rounded-lg border border-border px-3 py-2">
              <div className="text-sm font-medium">{email.subject}</div>
              <div className="text-xs text-muted-foreground">{email.sender}</div>
            </div>
          ))}
          {!escalations.data?.emails?.length && <div className="text-xs text-muted-foreground">No escalations in selected range.</div>}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
