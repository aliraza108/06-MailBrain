import type { EscalationReport } from "@/lib/types";
import PriorityBadge from "@/components/ui/PriorityBadge";
import { Button } from "@/components/ui/button";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

interface EscalationPanelProps {
  report?: EscalationReport;
  loading?: boolean;
  onView?: (id: string) => void;
}

const EscalationPanel = ({ report, loading, onView }: EscalationPanelProps) => {
  if (loading) {
    return <SkeletonLoader className="h-56 w-full" />;
  }

  const count = report?.count ?? 0;
  const emails = report?.emails ?? [];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-foreground">Escalations</div>
        <span className="text-xs text-muted-foreground">{count} active</span>
      </div>

      {count > 0 ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {count} emails need immediate attention
          </div>
          {emails.map((email) => (
            <div
              key={email.id}
              className="flex items-center justify-between rounded-lg border border-border bg-secondary px-3 py-3"
            >
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">{email.sender}</div>
                <div className="text-sm text-foreground">{email.subject}</div>
                <PriorityBadge priority={email.priority} />
              </div>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => onView?.(email.id)}
              >
                View
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 text-sm text-muted-foreground">No escalations in the last 7 days.</div>
      )}
    </div>
  );
};

export default EscalationPanel;

