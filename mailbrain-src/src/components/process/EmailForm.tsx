import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ManualEmailInput } from "@/lib/types";

interface EmailFormProps {
  onSubmit: (data: ManualEmailInput) => void;
  loading?: boolean;
}

const EmailForm = ({ onSubmit, loading }: EmailFormProps) => {
  const { register, handleSubmit } = useForm<ManualEmailInput>();

  return (
    <form
      className="space-y-4 bg-card border border-border rounded-xl p-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground">From (Email)</label>
          <Input
            className="mt-1 bg-secondary border-border"
            placeholder="customer@example.com"
            {...register("sender", { required: true })}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Sender Name</label>
          <Input
            className="mt-1 bg-secondary border-border"
            placeholder="Optional"
            {...register("sender_name")}
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Subject</label>
        <Input className="mt-1 bg-secondary border-border" {...register("subject", { required: true })} />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Email Body</label>
        <Textarea
          className="mt-1 min-h-[160px] bg-secondary border-border"
          {...register("body", { required: true })}
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground">Thread Context</label>
        <Textarea
          className="mt-1 min-h-[100px] bg-secondary border-border"
          placeholder="Paste previous thread context (optional)"
          {...register("thread_context")}
        />
      </div>
      <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
        {loading ? "Analyzing..." : "Analyze with AI"}
      </Button>
    </form>
  );
};

export default EmailForm;

