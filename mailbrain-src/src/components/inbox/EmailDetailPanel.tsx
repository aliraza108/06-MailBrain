import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useEmailDetail } from "@/hooks/useEmails";
import PriorityBadge from "@/components/ui/PriorityBadge";
import IntentTag from "@/components/ui/IntentTag";
import ConfidenceBar from "@/components/ui/ConfidenceBar";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/sonner";

interface EmailDetailPanelProps {
  emailId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmailDetailPanel = ({ emailId, open, onOpenChange }: EmailDetailPanelProps) => {
  const { data, isLoading, error } = useEmailDetail(emailId, open);
  const [editing, setEditing] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (data?.generated_reply) {
      setReplyBody(data.generated_reply);
    }
  }, [data?.generated_reply]);

  useEffect(() => {
    if (!open) {
      setEditing(false);
    }
  }, [open]);

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : "Failed to load email";
      toast.error(`Failed to load email: ${message}`);
    }
  }, [error]);

  const handleApprove = async () => {
    if (!emailId) return;
    setSending(true);
    try {
      await api.emails.approveReply(emailId);
      toast.success("Reply sent successfully");
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send reply";
      toast.error(`Failed to send reply: ${message}`);
    } finally {
      setSending(false);
    }
  };

  const handleSendEdited = async () => {
    if (!emailId) return;
    setSending(true);
    try {
      await api.emails.sendReply(emailId, replyBody);
      toast.success("Reply sent successfully");
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send reply";
      toast.error(`Failed to send reply: ${message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl bg-[#0f0f13] border-l border-[#2a2a3a] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-white">Email Detail</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-6">
          {isLoading || !data ? (
            <div className="space-y-4">
              <SkeletonLoader className="h-6 w-40" />
              <SkeletonLoader className="h-24 w-full" />
              <SkeletonLoader className="h-48 w-full" />
            </div>
          ) : (
            <>
              <div className="space-y-2 text-sm text-gray-300">
                <div>
                  <span className="text-gray-500">FROM:</span> {data.sender}
                </div>
                <div>
                  <span className="text-gray-500">SUBJECT:</span> {data.subject}
                </div>
                <div>
                  <span className="text-gray-500">DATE:</span> {new Date(data.received_at).toLocaleString()}
                </div>
              </div>

              <div className="rounded-xl border border-[#2a2a3a] bg-[#1a1a24] p-4 space-y-3">
                <div className="text-xs uppercase tracking-wide text-gray-400">AI Analysis</div>
                <div className="flex flex-wrap items-center gap-2">
                  <IntentTag intent={data.intent} />
                  <PriorityBadge priority={data.priority} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-300">
                  <div>Sentiment: {data.sentiment}</div>
                  <div>Language: {data.language}</div>
                  <div>Escalation Risk: {data.escalated ? "YES" : "NO"}</div>
                  <div>Department: {data.assigned_department}</div>
                </div>
                <ConfidenceBar score={data.confidence_score} />
                <div className="text-xs text-gray-400">Summary: {data.summary}</div>
                <div className="text-xs text-gray-400">Action: {data.action_taken}</div>
              </div>

              <Separator className="bg-[#2a2a3a]" />

              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wide text-gray-400">Email Body</div>
                <div className="text-sm text-gray-200 whitespace-pre-line">{data.body}</div>
              </div>

              <Separator className="bg-[#2a2a3a]" />

              <div className="space-y-3">
                <div className="text-xs uppercase tracking-wide text-gray-400">AI-Generated Reply</div>
                {editing ? (
                  <Textarea
                    className="min-h-[140px] bg-[#11111a] border-[#2a2a3a] text-gray-200"
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                  />
                ) : (
                  <div className="text-sm text-gray-200 whitespace-pre-line">{replyBody}</div>
                )}

                {data.reply_sent ? (
                  <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-xs text-green-300">
                    Reply was sent on {data.reply_sent_at || data.processed_at}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      className="bg-[#1a1a24] border border-[#2a2a3a]"
                      onClick={() => setEditing((prev) => !prev)}
                    >
                      {editing ? "Cancel Edit" : "Edit Reply"}
                    </Button>
                    {editing ? (
                      <Button
                        className="bg-indigo-600 hover:bg-indigo-500"
                        onClick={handleSendEdited}
                        disabled={sending}
                      >
                        Approve & Send
                      </Button>
                    ) : (
                      <Button
                        className="bg-indigo-600 hover:bg-indigo-500"
                        onClick={handleApprove}
                        disabled={sending}
                      >
                        Approve & Send
                      </Button>
                    )}
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>
                      Discard
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EmailDetailPanel;
