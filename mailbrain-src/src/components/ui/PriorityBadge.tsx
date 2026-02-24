import { cn } from "@/lib/utils";
import type { EmailPriority } from "@/lib/types";

interface PriorityBadgeProps {
  priority: EmailPriority;
}

const priorityClasses: Record<EmailPriority, string> = {
  CRITICAL: "bg-red-500/20 text-red-400 border border-red-500/30",
  HIGH: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  NORMAL: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  LOW: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
};

const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        priorityClasses[priority]
      )}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;
