import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/sonner";

const actions = [
  "process",
  "generate-reply",
  "generate",
  "generate-job",
  "generate-proposal",
  "generate-follow-up",
  "generate-and-send",
  "job-apply-send",
  "proposal-send",
  "send",
  "generate-subjects",
  "improve-draft",
] as const;

type ActionType = (typeof actions)[number];

const Process = () => {
  const [action, setAction] = useState<ActionType>("process");
  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [to, setTo] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [instruction, setInstruction] = useState("");
  const [count, setCount] = useState(5);
  const [resultText, setResultText] = useState("");

  const [jobTo, setJobTo] = useState("");
  const [jobSubject, setJobSubject] = useState("");
  const [jobContext, setJobContext] = useState("");
  const [jobDraft, setJobDraft] = useState("");

  const [proposalTo, setProposalTo] = useState("");
  const [proposalSubject, setProposalSubject] = useState("");
  const [proposalContext, setProposalContext] = useState("");
  const [proposalDraft, setProposalDraft] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      switch (action) {
        case "process":
          return api.emails.process({ sender, subject, body });
        case "generate-reply":
          return api.emails.generateReply({ subject, body, conversation_id: conversationId || undefined });
        case "generate":
          return api.emails.generate({ to, subject, body });
        case "generate-job":
          return api.emails.generateJob({ to, subject, body });
        case "generate-proposal":
          return api.emails.generateProposal({ to, subject, body });
        case "generate-follow-up":
          return api.emails.generateFollowUp({ to, subject, body });
        case "generate-and-send":
          return api.emails.generateAndSend({ to, subject, body });
        case "job-apply-send":
          return api.emails.jobApplySend({ to, subject, body });
        case "proposal-send":
          return api.emails.proposalSend({ to, subject, body });
        case "send":
          return api.emails.send({ to, subject, body });
        case "generate-subjects":
          return api.emails.generateSubjects({ context: body, count });
        case "improve-draft":
          return api.emails.improveDraft({ draft: body, instruction: instruction || undefined });
        default:
          return {};
      }
    },
    onSuccess: (response) => {
      setResultText(JSON.stringify(response, null, 2));
      toast.success(`Action success: ${action}`);
    },
    onError: (error: Error) => {
      setResultText(error.message);
      toast.error(`Action failed: ${error.message}`);
    },
  });

  const jobGenerateMutation = useMutation({
    mutationFn: () => api.emails.generateJob({ to: jobTo, subject: jobSubject, body: jobContext }),
    onSuccess: (response) => {
      const draft = response.body || response.draft || response.reply || "";
      setJobDraft(draft);
      toast.success("Job email draft generated");
    },
    onError: (error: Error) => toast.error(`Job generate failed: ${error.message}`),
  });

  const jobSendMutation = useMutation({
    mutationFn: () => api.emails.jobApplySend({ to: jobTo, subject: jobSubject, body: jobDraft || jobContext }),
    onSuccess: () => toast.success("Job application email sent"),
    onError: (error: Error) => toast.error(`Job send failed: ${error.message}`),
  });

  const proposalGenerateMutation = useMutation({
    mutationFn: () => api.emails.generateProposal({ to: proposalTo, subject: proposalSubject, body: proposalContext }),
    onSuccess: (response) => {
      const draft = response.body || response.draft || response.reply || "";
      setProposalDraft(draft);
      toast.success("Proposal draft generated");
    },
    onError: (error: Error) => toast.error(`Proposal generate failed: ${error.message}`),
  });

  const proposalSendMutation = useMutation({
    mutationFn: () => api.emails.proposalSend({ to: proposalTo, subject: proposalSubject, body: proposalDraft || proposalContext }),
    onSuccess: () => toast.success("Proposal email sent"),
    onError: (error: Error) => toast.error(`Proposal send failed: ${error.message}`),
  });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-4 space-y-4">
        <h2 className="text-sm font-semibold">AI Generation and Sending Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-1">
            <label className="text-xs text-muted-foreground">Action</label>
            <select
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={action}
              onChange={(e) => setAction(e.target.value as ActionType)}
            >
              {actions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">To / Sender</label>
            <Input value={action === "process" ? sender : to} onChange={(e) => (action === "process" ? setSender(e.target.value) : setTo(e.target.value))} placeholder={action === "process" ? "customer@example.com" : "recipient@example.com"} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Subject</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Conversation ID (optional)</label>
            <Input value={conversationId} onChange={(e) => setConversationId(e.target.value)} placeholder="thread / conversation id" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Subject Count (for generate-subjects)</label>
            <Input type="number" min={1} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Body / Context / Draft</label>
          <Textarea className="min-h-[160px]" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Paste email body or context" />
        </div>

        <div>
          <label className="text-xs text-muted-foreground">Improve instruction (optional)</label>
          <Input value={instruction} onChange={(e) => setInstruction(e.target.value)} placeholder="e.g. make it shorter and more formal" />
        </div>

        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          {mutation.isPending ? "Running..." : "Run Action"}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h3 className="text-sm font-semibold">Job Applier</h3>
          <Input value={jobTo} onChange={(e) => setJobTo(e.target.value)} placeholder="Recipient email" />
          <Input value={jobSubject} onChange={(e) => setJobSubject(e.target.value)} placeholder="Job email subject" />
          <Textarea className="min-h-[140px]" value={jobContext} onChange={(e) => setJobContext(e.target.value)} placeholder="Job context, role details, achievements" />
          <Textarea className="min-h-[140px]" value={jobDraft} onChange={(e) => setJobDraft(e.target.value)} placeholder="Generated job draft" />
          <div className="flex gap-2">
            <Button onClick={() => jobGenerateMutation.mutate()} disabled={jobGenerateMutation.isPending}>Generate</Button>
            <Button variant="outline" onClick={() => jobSendMutation.mutate()} disabled={jobSendMutation.isPending}>Generate + Send</Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h3 className="text-sm font-semibold">Proposal Sender</h3>
          <Input value={proposalTo} onChange={(e) => setProposalTo(e.target.value)} placeholder="Recipient email" />
          <Input value={proposalSubject} onChange={(e) => setProposalSubject(e.target.value)} placeholder="Proposal email subject" />
          <Textarea className="min-h-[140px]" value={proposalContext} onChange={(e) => setProposalContext(e.target.value)} placeholder="Proposal context, scope, timeline, price" />
          <Textarea className="min-h-[140px]" value={proposalDraft} onChange={(e) => setProposalDraft(e.target.value)} placeholder="Generated proposal draft" />
          <div className="flex gap-2">
            <Button onClick={() => proposalGenerateMutation.mutate()} disabled={proposalGenerateMutation.isPending}>Generate</Button>
            <Button variant="outline" onClick={() => proposalSendMutation.mutate()} disabled={proposalSendMutation.isPending}>Generate + Send</Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold mb-3">Result</h3>
        <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-[420px] bg-background rounded-lg border border-border p-3">
          {resultText || "Run an action to see output."}
        </pre>
      </div>
    </div>
  );
};

export default Process;
