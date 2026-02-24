import { useState } from "react";
import EmailForm from "@/components/process/EmailForm";
import AnalysisResult from "@/components/process/AnalysisResult";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import { api } from "@/lib/api";
import type { EmailDetail, ManualEmailInput, ProcessResult } from "@/lib/types";
import { toast } from "@/components/ui/sonner";

const Process = () => {
  const [result, setResult] = useState<EmailDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const handleProcess = async (data: ManualEmailInput) => {
    setLoading(true);
    try {
      const response = await api.emails.process(data);
      const normalized = (response as ProcessResult).email ?? (response as EmailDetail);
      if (!normalized) {
        throw new Error("Unexpected response");
      }
      setResult(normalized);
      toast.success(`Email analyzed: ${normalized.intent} detected`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to process email";
      toast.error(`Failed to process: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <EmailForm onSubmit={handleProcess} loading={loading} />
      {loading && (
        <div className="space-y-3">
          <SkeletonLoader className="h-8 w-48" />
          <SkeletonLoader className="h-64 w-full" />
        </div>
      )}
      {result && !loading && <AnalysisResult email={result} />}
    </div>
  );
};

export default Process;
