import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useEmailDetail, useEmails, useGenerateReply, useSendEmail } from "@/hooks/useEmails";
import { useOverviewStats } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";

const Dashboard = () => {
  const {
    selectedEmailId,
    setSelectedEmailId,
    intentFilter,
    priorityFilter,
  } = useDashboardState();

  const emailsQuery = useEmails({
    page: 1,
    page_size: 20,
    intent: intentFilter,
    priority: priorityFilter,
  });

  const selectedEmailQuery = useEmailDetail(selectedEmailId, Boolean(selectedEmailId));
  const overview = useOverviewStats(7);
  const profileQuery = useQuery({ queryKey: ["profile"], queryFn: api.profile.get });

  const [genSubject, setGenSubject] = useState("");
  const [genBody, setGenBody] = useState("");
  const [draft, setDraft] = useState("");

  const generateReply = useGenerateReply();
  const sendEmail = useSendEmail();

  const processSelected = useMutation({
    mutationFn: () => {
      const email = selectedEmailQuery.data;
      if (!email?.id || !email.subject || !email.body) {
        throw new Error("Select an email with subject and body first");
      }
      return api.emails.process({
        sender: email.sender,
        sender_name: email.sender_name,
        subject: email.subject,
        body: email.body,
        thread_context: email.thread_context,
      });
    },
    onSuccess: (result) => {
      const processed = result.email;
      if (processed?.generated_reply) {
        setDraft(processed.generated_reply);
      }
      toast.success("Selected email processed with AI");
    },
    onError: (error: Error) => {
      toast.error(`Process failed: ${error.message}`);
    },
  });

  const cards = useMemo(
    () => [
      { label: "Total", value: overview.data?.total_emails ?? 0 },
      { label: "Critical", value: overview.data?.critical_emails ?? 0 },
      { label: "Auto Replied", value: overview.data?.auto_replied ?? 0 },
      { label: "Escalated", value: overview.data?.escalated ?? 0 },
    ],
    [overview.data]
  );

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="text-xs text-muted-foreground">{card.label}</div>
            <div className="text-2xl font-semibold">{card.value}</div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Inbox List</h2>
            <Badge variant="outline">{emailsQuery.data?.emails?.length ?? 0}</Badge>
          </div>
          <div className="space-y-2 max-h-[460px] overflow-auto pr-1">
            {(emailsQuery.data?.emails || []).map((email) => (
              <button
                key={email.id}
                onClick={() => setSelectedEmailId(email.id)}
                className={`w-full rounded-lg border p-3 text-left transition ${selectedEmailId === email.id ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"}`}
              >
                <div className="text-xs text-muted-foreground truncate">{email.sender}</div>
                <div className="font-medium text-sm truncate">{email.subject}</div>
                <div className="text-xs text-muted-foreground truncate">{email.intent || "unknown"}</div>
              </button>
            ))}
            {!emailsQuery.data?.emails?.length && (
              <div className="text-xs text-muted-foreground">No emails yet. Run sync to fetch from backend.</div>
            )}
          </div>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold">Email Detail + Reply Box</h2>
              <Button size="sm" variant="outline" onClick={() => processSelected.mutate()} disabled={processSelected.isPending || !selectedEmailId}>
                Analyze With AI
              </Button>
            </div>
            {selectedEmailQuery.data ? (
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground">Subject</div>
                  <div className="text-sm font-medium">{selectedEmailQuery.data.subject}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Body</div>
                  <div className="text-sm whitespace-pre-wrap max-h-40 overflow-auto">{selectedEmailQuery.data.body || "No body"}</div>
                </div>
                <Textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="AI generated draft appears here"
                  className="min-h-[140px]"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={async () => {
                      if (!selectedEmailId) return;
                      try {
                        await api.emails.reply(selectedEmailId, draft);
                        toast.success("Reply sent");
                      } catch (error) {
                        const message = error instanceof Error ? error.message : "Reply failed";
                        toast.error(message);
                      }
                    }}
                    disabled={!selectedEmailId || !draft.trim()}
                  >
                    Send Reply
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      if (!selectedEmailId) return;
                      try {
                        await api.emails.approve(selectedEmailId);
                        toast.success("Approved and sent");
                      } catch (error) {
                        const message = error instanceof Error ? error.message : "Approval failed";
                        toast.error(message);
                      }
                    }}
                    disabled={!selectedEmailId}
                  >
                    Approve + Send
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Select an email to review details.</div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <h2 className="text-sm font-semibold">AI Generation Tools</h2>
              <Input placeholder="Subject" value={genSubject} onChange={(event) => setGenSubject(event.target.value)} />
              <Textarea placeholder="Body context" value={genBody} onChange={(event) => setGenBody(event.target.value)} />
              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    try {
                      const response = await generateReply.mutateAsync({ subject: genSubject, body: genBody });
                      const nextDraft = response.reply || response.body || response.draft || "";
                      setDraft(nextDraft);
                      toast.success("Draft generated");
                    } catch (error) {
                      const message = error instanceof Error ? error.message : "Generate failed";
                      toast.error(message);
                    }
                  }}
                  disabled={generateReply.isPending}
                >
                  Generate Reply
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    try {
                      await sendEmail.mutateAsync({ to: selectedEmailQuery.data?.sender || "", subject: genSubject, body: draft || genBody });
                      toast.success("Email sent");
                    } catch (error) {
                      const message = error instanceof Error ? error.message : "Send failed";
                      toast.error(message);
                    }
                  }}
                  disabled={sendEmail.isPending}
                >
                  Send Email
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <h2 className="text-sm font-semibold">Profile Prompt Settings</h2>
              <div className="text-xs text-muted-foreground">Name: {profileQuery.data?.full_name || "-"}</div>
              <div className="text-xs text-muted-foreground">Role: {profileQuery.data?.role_title || "-"}</div>
              <div className="text-xs text-muted-foreground">Tone: {profileQuery.data?.writing_tone || "-"}</div>
              <div className="text-xs text-muted-foreground">Language: {profileQuery.data?.default_language || "-"}</div>
              <Button size="sm" variant="outline" onClick={() => (window.location.href = "/settings")}>
                Edit Profile & Prompt
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
