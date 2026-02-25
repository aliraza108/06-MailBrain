import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useApproveReply, useDeleteEmail, useEmailDetail, useEmails, useSendReply } from "@/hooks/useEmails";
import { toast } from "@/components/ui/sonner";

const PAGE_SIZE = 10;

function getEmailDate(email: { received_at?: string; processed_at?: string }) {
  const raw = email.received_at || email.processed_at;
  if (!raw) return null;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

const Inbox = () => {
  const {
    selectedEmailId,
    setSelectedEmailId,
    intentFilter,
    setIntentFilter,
    priorityFilter,
    setPriorityFilter,
  } = useDashboardState();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [replyBody, setReplyBody] = useState("");

  const emailsQuery = useEmails({
    page,
    page_size: PAGE_SIZE,
    intent: intentFilter,
    priority: priorityFilter,
  });
  const detailQuery = useEmailDetail(selectedEmailId, Boolean(selectedEmailId));
  const approveMutation = useApproveReply();
  const sendReplyMutation = useSendReply();
  const deleteEmailMutation = useDeleteEmail();

  useEffect(() => {
    if (detailQuery.data?.generated_reply) {
      setReplyBody(detailQuery.data.generated_reply);
    }
  }, [detailQuery.data?.generated_reply]);

  const filteredEmails = useMemo(() => {
    const list = emailsQuery.data?.emails || [];
    if (!search.trim()) return list;
    const term = search.toLowerCase();
    return list.filter(
      (email) =>
        email.subject?.toLowerCase().includes(term) ||
        email.sender?.toLowerCase().includes(term) ||
        email.intent?.toLowerCase().includes(term)
    );
  }, [emailsQuery.data?.emails, search]);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-4 flex flex-col md:flex-row gap-3">
        <Input placeholder="Search subject/sender/intent" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="rounded-md border border-border bg-background px-3 py-2 text-sm" value={intentFilter} onChange={(e) => setIntentFilter(e.target.value)}>
          <option value="ALL">All intents</option>
          <option value="JOB">Job</option>
          <option value="PROPOSAL">Proposal</option>
          <option value="SUPPORT">Support</option>
          <option value="FOLLOW_UP">Follow up</option>
        </select>
        <select className="rounded-md border border-border bg-background px-3 py-2 text-sm" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="ALL">All priority</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="NORMAL">Normal</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold mb-3">Inbox</h2>
          <div className="space-y-2 max-h-[620px] overflow-auto pr-1">
            {filteredEmails.map((email) => (
              <button
                key={email.id}
                onClick={() => setSelectedEmailId(email.id)}
                className={`w-full rounded-lg border p-3 text-left ${selectedEmailId === email.id ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"}`}
              >
                <div className="text-xs text-muted-foreground truncate">{email.sender}</div>
                <div className="text-sm font-medium truncate">{email.subject}</div>
                <div className="text-xs text-muted-foreground">
                  {getEmailDate(email)?.toLocaleString() || "No date"}
                </div>
                <div className="text-xs text-muted-foreground">{email.intent || "Unknown"}</div>
              </button>
            ))}
            {!filteredEmails.length && <div className="text-xs text-muted-foreground">No emails matched.</div>}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
            <span className="text-xs text-muted-foreground">Page {page}</span>
            <Button size="sm" variant="outline" onClick={() => setPage((p) => p + 1)} disabled={(emailsQuery.data?.emails?.length || 0) < PAGE_SIZE}>Next</Button>
          </div>
        </div>

        <div className="xl:col-span-2 rounded-xl border border-border bg-card p-4 space-y-3">
          <h2 className="text-sm font-semibold">Email Detail + Reply</h2>
          {detailQuery.data ? (
            <>
              <div className="text-xs text-muted-foreground">From: {detailQuery.data.sender}</div>
              <div className="text-xs text-muted-foreground">
                Date: {getEmailDate(detailQuery.data)?.toLocaleString() || "No date"}
              </div>
              <div className="text-base font-semibold">{detailQuery.data.subject}</div>
              <div className="max-h-52 overflow-auto whitespace-pre-wrap text-sm border border-border rounded-lg p-3 bg-background">
                {detailQuery.data.body || "No body found"}
              </div>
              <Textarea value={replyBody} onChange={(e) => setReplyBody(e.target.value)} className="min-h-[180px]" />
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={async () => {
                    if (!detailQuery.data?.id) return;
                    try {
                      await sendReplyMutation.mutateAsync({ id: detailQuery.data.id, body: replyBody });
                      toast.success("Reply sent successfully");
                    } catch (error) {
                      const message = error instanceof Error ? error.message : "Reply send failed";
                      toast.error(message);
                    }
                  }}
                  disabled={sendReplyMutation.isPending || !replyBody.trim()}
                >
                  Send Reply
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    if (!detailQuery.data?.id) return;
                    try {
                      await approveMutation.mutateAsync(detailQuery.data.id);
                      toast.success("Approved and sent");
                    } catch (error) {
                      const message = error instanceof Error ? error.message : "Approval failed";
                      toast.error(message);
                    }
                  }}
                  disabled={approveMutation.isPending}
                >
                  Approve + Send
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    if (!detailQuery.data?.id) return;
                    const confirmed = window.confirm("Delete this email permanently?");
                    if (!confirmed) return;
                    try {
                      await deleteEmailMutation.mutateAsync(detailQuery.data.id);
                      setSelectedEmailId("");
                      setReplyBody("");
                      toast.success("Email deleted");
                    } catch (error) {
                      const message = error instanceof Error ? error.message : "Delete failed";
                      toast.error(message);
                    }
                  }}
                  disabled={deleteEmailMutation.isPending}
                >
                  Delete Email
                </Button>
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">Select an email from the list.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
