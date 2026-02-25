import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/sonner";

function toSendReadyGoogleDriveLink(link: string): string {
  const trimmed = link.trim();
  if (!trimmed) return "";

  const fileIdMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (!fileIdMatch?.[1]) return trimmed;

  const fileId = fileIdMatch[1];
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

function extractDraft(response: unknown): string {
  if (!response || typeof response !== "object") return "";
  const payload = response as Record<string, unknown>;
  const values = [payload.body, payload.draft, payload.reply, payload.subjects];
  for (const value of values) {
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value.join("\n");
  }
  return JSON.stringify(response, null, 2);
}

const Process = () => {
  const [resultText, setResultText] = useState("");

  const [jobTo, setJobTo] = useState("");
  const [jobSubject, setJobSubject] = useState("Application for the role");
  const [jobApplicationText, setJobApplicationText] = useState("");
  const [resumeDriveLink, setResumeDriveLink] = useState("");
  const [jobDraft, setJobDraft] = useState("");

  const [proposalTo, setProposalTo] = useState("");
  const [proposalSubject, setProposalSubject] = useState("Proposal for your post");
  const [proposalPostText, setProposalPostText] = useState("");
  const [proposalDraft, setProposalDraft] = useState("");

  const [bestTo, setBestTo] = useState("");
  const [bestSubject, setBestSubject] = useState("");
  const [bestContext, setBestContext] = useState("");
  const [bestDraft, setBestDraft] = useState("");
  const [bestCount, setBestCount] = useState(5);

  const sendReadyResumeLink = useMemo(() => toSendReadyGoogleDriveLink(resumeDriveLink), [resumeDriveLink]);

  const buildJobBody = () => {
    const resumeLine = sendReadyResumeLink ? `Resume Attachment (Drive): ${sendReadyResumeLink}` : "";
    return [jobApplicationText.trim(), resumeLine].filter(Boolean).join("\n\n");
  };

  const jobGenerateMutation = useMutation({
    mutationFn: async () => {
      if (!jobTo.trim() || !jobSubject.trim() || !jobApplicationText.trim() || !resumeDriveLink.trim()) {
        throw new Error("Enter recipient, subject, job application text, and resume Google Drive link");
      }
      return api.emails.generateJob({ to: jobTo.trim(), subject: jobSubject.trim(), body: buildJobBody() });
    },
    onSuccess: (response) => {
      const draft = extractDraft(response);
      setJobDraft(draft);
      setResultText(JSON.stringify(response, null, 2));
      toast.success("Job application draft generated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const jobSendMutation = useMutation({
    mutationFn: async () => {
      if (!jobTo.trim() || !jobSubject.trim() || !resumeDriveLink.trim()) {
        throw new Error("Recipient, subject and resume Google Drive link are required");
      }
      const body = jobDraft.trim() || buildJobBody();
      return api.emails.jobApplySend({ to: jobTo.trim(), subject: jobSubject.trim(), body });
    },
    onSuccess: (response) => {
      setResultText(JSON.stringify(response, null, 2));
      toast.success("Job application email sent");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const proposalGenerateMutation = useMutation({
    mutationFn: async () => {
      if (!proposalTo.trim() || !proposalSubject.trim() || !proposalPostText.trim()) {
        throw new Error("Enter recipient, subject, and post text for proposal");
      }
      return api.emails.generateProposal({
        to: proposalTo.trim(),
        subject: proposalSubject.trim(),
        body: proposalPostText.trim(),
      });
    },
    onSuccess: (response) => {
      const draft = extractDraft(response);
      setProposalDraft(draft);
      setResultText(JSON.stringify(response, null, 2));
      toast.success("Proposal draft generated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const proposalSendMutation = useMutation({
    mutationFn: async () => {
      if (!proposalTo.trim() || !proposalSubject.trim()) {
        throw new Error("Recipient and subject are required");
      }
      return api.emails.proposalSend({
        to: proposalTo.trim(),
        subject: proposalSubject.trim(),
        body: proposalDraft.trim() || proposalPostText.trim(),
      });
    },
    onSuccess: (response) => {
      setResultText(JSON.stringify(response, null, 2));
      toast.success("Proposal email sent");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const followUpMutation = useMutation({
    mutationFn: () => api.emails.generateFollowUp({ to: bestTo.trim(), subject: bestSubject.trim(), body: bestContext.trim() }),
    onSuccess: (response) => {
      const draft = extractDraft(response);
      setBestDraft(draft);
      setResultText(JSON.stringify(response, null, 2));
      toast.success("Follow-up generated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const subjectIdeasMutation = useMutation({
    mutationFn: () => api.emails.generateSubjects({ context: bestContext.trim(), count: bestCount }),
    onSuccess: (response) => {
      const draft = extractDraft(response);
      setBestDraft(draft);
      setResultText(JSON.stringify(response, null, 2));
      toast.success("Subject ideas generated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const improveDraftMutation = useMutation({
    mutationFn: () => api.emails.improveDraft({ draft: bestDraft.trim() || bestContext.trim() }),
    onSuccess: (response) => {
      const draft = extractDraft(response);
      setBestDraft(draft);
      setResultText(JSON.stringify(response, null, 2));
      toast.success("Draft improved");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="job-applier" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="job-applier">Job Applier</TabsTrigger>
          <TabsTrigger value="proposal-sender">Proposal Sender</TabsTrigger>
          <TabsTrigger value="best-ones">Best Ones</TabsTrigger>
        </TabsList>

        <TabsContent value="job-applier" className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h2 className="text-sm font-semibold">Job Applier</h2>
          <Input value={jobTo} onChange={(e) => setJobTo(e.target.value)} placeholder="Recipient email" />
          <Input value={jobSubject} onChange={(e) => setJobSubject(e.target.value)} placeholder="Job email subject" />
          <Textarea value={jobApplicationText} onChange={(e) => setJobApplicationText(e.target.value)} placeholder="Job application text" className="min-h-[140px]" />
          <Input value={resumeDriveLink} onChange={(e) => setResumeDriveLink(e.target.value)} placeholder="Resume Google Drive link" />
          <div className="text-xs text-muted-foreground">Send-ready resume link: {sendReadyResumeLink || "-"}</div>
          <Textarea value={jobDraft} onChange={(e) => setJobDraft(e.target.value)} placeholder="Generated draft" className="min-h-[140px]" />
          <div className="flex gap-2">
            <Button onClick={() => jobGenerateMutation.mutate()} disabled={jobGenerateMutation.isPending}>Generate</Button>
            <Button variant="outline" onClick={() => jobSendMutation.mutate()} disabled={jobSendMutation.isPending}>Generate + Send</Button>
          </div>
        </TabsContent>

        <TabsContent value="proposal-sender" className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h2 className="text-sm font-semibold">Proposal Sender</h2>
          <Input value={proposalTo} onChange={(e) => setProposalTo(e.target.value)} placeholder="Recipient email" />
          <Input value={proposalSubject} onChange={(e) => setProposalSubject(e.target.value)} placeholder="Proposal subject" />
          <Textarea value={proposalPostText} onChange={(e) => setProposalPostText(e.target.value)} placeholder="Post text for proposal" className="min-h-[160px]" />
          <Textarea value={proposalDraft} onChange={(e) => setProposalDraft(e.target.value)} placeholder="Generated proposal draft" className="min-h-[140px]" />
          <div className="flex gap-2">
            <Button onClick={() => proposalGenerateMutation.mutate()} disabled={proposalGenerateMutation.isPending}>Generate</Button>
            <Button variant="outline" onClick={() => proposalSendMutation.mutate()} disabled={proposalSendMutation.isPending}>Generate + Send</Button>
          </div>
        </TabsContent>

        <TabsContent value="best-ones" className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h2 className="text-sm font-semibold">Best Ones</h2>
          <Input value={bestTo} onChange={(e) => setBestTo(e.target.value)} placeholder="Recipient email (optional for follow-up)" />
          <Input value={bestSubject} onChange={(e) => setBestSubject(e.target.value)} placeholder="Subject" />
          <Textarea value={bestContext} onChange={(e) => setBestContext(e.target.value)} placeholder="Context / existing draft" className="min-h-[140px]" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Subject count</span>
            <Input type="number" min={1} max={20} value={bestCount} onChange={(e) => setBestCount(Number(e.target.value))} className="w-24" />
          </div>
          <Textarea value={bestDraft} onChange={(e) => setBestDraft(e.target.value)} placeholder="Output draft" className="min-h-[140px]" />
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => followUpMutation.mutate()} disabled={followUpMutation.isPending}>Generate Follow-up</Button>
            <Button variant="outline" onClick={() => subjectIdeasMutation.mutate()} disabled={subjectIdeasMutation.isPending}>Subject Ideas</Button>
            <Button variant="secondary" onClick={() => improveDraftMutation.mutate()} disabled={improveDraftMutation.isPending}>Improve Draft</Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold mb-3">API Result</h3>
        <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-[420px] bg-background rounded-lg border border-border p-3">
          {resultText || "Run an action to see output."}
        </pre>
      </div>
    </div>
  );
};

export default Process;
