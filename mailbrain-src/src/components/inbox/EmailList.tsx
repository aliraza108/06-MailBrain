import type { EmailItem } from "@/lib/types";
import EmailRow from "@/components/inbox/EmailRow";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

interface EmailListProps {
  emails: EmailItem[];
  loading?: boolean;
  onSelect: (id: string) => void;
}

const EmailList = ({ emails, loading, onSelect }: EmailListProps) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonLoader key={idx} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!emails.length) {
    return <div className="text-sm text-gray-400">No emails match your filters.</div>;
  }

  return (
    <div className="space-y-3">
      {emails.map((email) => (
        <EmailRow key={email.id} email={email} onClick={onSelect} />
      ))}
    </div>
  );
};

export default EmailList;
