import { format } from "date-fns";
import type { EmailItem } from "@/lib/types";
import PriorityBadge from "@/components/ui/PriorityBadge";
import IntentTag from "@/components/ui/IntentTag";
import ConfidenceBar from "@/components/ui/ConfidenceBar";
import { cn } from "@/lib/utils";

interface EmailRowProps {
  email: EmailItem;
  onClick: (id: string) => void;
}

const EmailRow = ({ email, onClick }: EmailRowProps) => {
  return (
    <button
      onClick={() => onClick(email.id)}
      className={cn(
        "w-full text-left border border-border bg-secondary rounded-xl p-4 hover:bg-muted transition-colors",
        email.escalated ? "ring-1 ring-red-500/30" : ""
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={email.priority} />
            <span className="text-sm text-foreground font-medium">{email.sender}</span>
            <span className="text-xs text-muted-foreground">{email.subject}</span>
          </div>
          <div className="text-xs text-muted-foreground truncate">{email.summary}</div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <IntentTag intent={email.intent} />
          <ConfidenceBar score={email.confidence_score} />
          <span className="text-xs text-muted-foreground">{email.action_taken}</span>
          <span className="text-xs text-muted-foreground">{email.reply_sent ? "Reply Sent" : "Pending"}</span>
          <span className="text-xs text-muted-foreground">
            {email.received_at ? format(new Date(email.received_at), "MMM d, h:mm a") : "--"}
          </span>
        </div>
      </div>
    </button>
  );
};

export default EmailRow;

