import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterBar, { InboxFilters } from "@/components/inbox/FilterBar";
import EmailList from "@/components/inbox/EmailList";
import EmailDetailPanel from "@/components/inbox/EmailDetailPanel";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useEmails } from "@/hooks/useEmails";
import type { EmailListParams } from "@/lib/types";

const PAGE_SIZE = 20;

const Inbox = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<InboxFilters>({
    priority: "ALL",
    intent: "ALL",
    status: "ALL",
    search: "",
  });
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [panelOpen, setPanelOpen] = useState(false);

  const queryParams: EmailListParams = useMemo(
    () => ({
      page,
      page_size: PAGE_SIZE,
      priority: filters.priority as EmailListParams["priority"],
      intent: filters.intent,
      status: filters.status,
    }),
    [page, filters.priority, filters.intent, filters.status]
  );

  const emailsQuery = useEmails(queryParams);

  useEffect(() => {
    if (emailsQuery.error) {
      toast.error(`Failed to load emails: ${(emailsQuery.error as Error).message}`);
    }
  }, [emailsQuery.error]);

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setSelectedId(emailFromQuery);
      setPanelOpen(true);
    }
  }, [searchParams]);

  const emails = emailsQuery.data?.emails || [];
  const filtered = useMemo(() => {
    if (!filters.search) return emails;
    const term = filters.search.toLowerCase();
    return emails.filter(
      (email) =>
        email.subject.toLowerCase().includes(term) || email.sender.toLowerCase().includes(term)
    );
  }, [emails, filters.search]);

  const total = emailsQuery.data?.total ?? 0;
  const showing = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="space-y-6">
      <FilterBar filters={filters} onChange={(next) => {
        setFilters(next);
        setPage(1);
      }} />

      <EmailList
        emails={filtered}
        loading={emailsQuery.isLoading}
        onSelect={(id) => {
          setSelectedId(id);
          setPanelOpen(true);
        }}
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-xs text-gray-400">
          Showing {showing} of {total}
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="bg-[#1a1a24] border border-[#2a2a3a]"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            className="bg-[#1a1a24] border border-[#2a2a3a]"
            onClick={() => setPage((p) => p + 1)}
            disabled={showing >= total}
          >
            Next
          </Button>
        </div>
      </div>

      <EmailDetailPanel
        emailId={selectedId}
        open={panelOpen}
        onOpenChange={(open) => {
          setPanelOpen(open);
          if (!open) setSelectedId(undefined);
        }}
      />
    </div>
  );
};

export default Inbox;
