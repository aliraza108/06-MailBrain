import { useState } from "react";
import type { EmailDetail } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import PriorityBadge from "@/components/ui/PriorityBadge";
import IntentTag from "@/components/ui/IntentTag";
import ConfidenceBar from "@/components/ui/ConfidenceBar";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/sonner";

interface AnalysisResultProps {
  email: EmailDetail;
}

const AnalysisResult = ({ email }: AnalysisResultProps) => {
  const [editing, setEditing] = useState(false);
  const [replyBody, setReplyBody] = useState(email.generated_reply);
  const [sending, setSending] = useState(false);

  const handleApprove = async () => {
    if (!email.id) {
      toast.error("Email is not ready to send");
      return;
    }
    setSending(true);
    try {
      await api.emails.approveReply(email.id);
      toast.success("Reply sent successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send reply";
      toast.error(`Failed to send reply: ${message}`);
    } finally {
      setSending(false);
    }
  };

  const handleSendEdited = async () => {
    if (!email.id) {
      toast.error("Email is not ready to send");
      return;
    }
    setSending(true);
    try {
      await api.emails.sendReply(email.id, replyBody);
      toast.success("Reply sent successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send reply";
      toast.error(`Failed to send reply: ${message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="text-sm font-semibold text-foreground">AI Analysis Result</div>
      <div className="flex flex-wrap gap-2">
        <IntentTag intent={email.intent} />
        <PriorityBadge priority={email.priority} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
        <div>Sentiment: {email.sentiment}</div>
        <div>Language: {email.language}</div>
        <div>Escalation Risk: {email.escalated ? "YES" : "NO"}</div>
        <div>Department: {email.assigned_department}</div>
      </div>
      <ConfidenceBar score={email.confidence_score} />
      <div className="text-xs text-muted-foreground">Summary: {email.summary}</div>
      <div className="text-xs text-muted-foreground">Action: {email.action_taken}</div>

      <div className="border-t border-border pt-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Email Body</div>
        <div className="text-sm text-foreground whitespace-pre-line">{email.body}</div>
      </div>

      <div className="border-t border-border pt-4 space-y-3">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">AI-Generated Reply</div>
        {editing ? (
          <Textarea
            className="min-h-[140px] bg-secondary border-border text-foreground"
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
          />
        ) : (
          <div className="text-sm text-foreground whitespace-pre-line">{replyBody}</div>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            className="bg-secondary border border-border"
            onClick={() => setEditing((prev) => !prev)}
          >
            {editing ? "Cancel Edit" : "Edit Reply"}
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={editing ? handleSendEdited : handleApprove} disabled={sending}>
            Approve & Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;

