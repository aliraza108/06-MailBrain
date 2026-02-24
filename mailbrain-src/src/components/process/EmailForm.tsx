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
      className="space-y-4 bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400">From (Email)</label>
          <Input
            className="mt-1 bg-[#11111a] border-[#2a2a3a]"
            placeholder="customer@example.com"
            {...register("sender", { required: true })}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400">Sender Name</label>
          <Input
            className="mt-1 bg-[#11111a] border-[#2a2a3a]"
            placeholder="Optional"
            {...register("sender_name")}
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-400">Subject</label>
        <Input className="mt-1 bg-[#11111a] border-[#2a2a3a]" {...register("subject", { required: true })} />
      </div>
      <div>
        <label className="text-xs text-gray-400">Email Body</label>
        <Textarea
          className="mt-1 min-h-[160px] bg-[#11111a] border-[#2a2a3a]"
          {...register("body", { required: true })}
        />
      </div>
      <div>
        <label className="text-xs text-gray-400">Thread Context</label>
        <Textarea
          className="mt-1 min-h-[100px] bg-[#11111a] border-[#2a2a3a]"
          placeholder="Paste previous thread context (optional)"
          {...register("thread_context")}
        />
      </div>
      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500" disabled={loading}>
        {loading ? "Analyzing..." : "Analyze with AI"}
      </Button>
    </form>
  );
};

export default EmailForm;
