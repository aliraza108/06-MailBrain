import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { api } from "@/lib/api";
import type { Profile } from "@/lib/types";

const defaultProfile: Profile = {
  full_name: "",
  role_title: "",
  company_name: "",
  writing_tone: "",
  signature: "",
  custom_system_prompt: "",
  default_language: "en",
};

const Settings = () => {
  const profileQuery = useQuery({ queryKey: ["profile"], queryFn: api.profile.get });
  const healthQuery = useQuery({ queryKey: ["health"], queryFn: api.core.health });
  const debugQuery = useQuery({ queryKey: ["debug"], queryFn: api.core.debug });

  const { register, handleSubmit, reset } = useForm<Profile>({ defaultValues: defaultProfile });

  useEffect(() => {
    if (profileQuery.data) {
      reset({ ...defaultProfile, ...profileQuery.data });
    }
  }, [profileQuery.data, reset]);

  const updateMutation = useMutation({
    mutationFn: (payload: Profile) => api.profile.update(payload),
    onSuccess: (result) => {
      reset(result);
      toast.success("Profile updated");
    },
    onError: (error: Error) => {
      toast.error(`Update failed: ${error.message}`);
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
        <h2 className="text-sm font-semibold">Backend Status</h2>
        <div className="text-xs text-muted-foreground">Health: {healthQuery.isLoading ? "loading" : JSON.stringify(healthQuery.data)}</div>
        <div className="text-xs text-muted-foreground">Debug: {debugQuery.isLoading ? "loading" : "available"}</div>
      </div>

      <form className="rounded-xl border border-border bg-card p-4 space-y-3" onSubmit={handleSubmit((values) => updateMutation.mutate(values))}>
        <h2 className="text-sm font-semibold">Profile + Prompt Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input placeholder="Full name" {...register("full_name")} />
          <Input placeholder="Role title" {...register("role_title")} />
          <Input placeholder="Company name" {...register("company_name")} />
          <Input placeholder="Writing tone" {...register("writing_tone")} />
          <Input placeholder="Signature" {...register("signature")} />
          <Input placeholder="Default language" {...register("default_language")} />
        </div>
        <Textarea className="min-h-[180px]" placeholder="Custom system prompt" {...register("custom_system_prompt")} />
        <Button type="submit" disabled={updateMutation.isPending}>{updateMutation.isPending ? "Saving..." : "Save Profile"}</Button>
      </form>

      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
        <h2 className="text-sm font-semibold">Security</h2>
        <p className="text-xs text-muted-foreground">
          Token is attached as `Authorization: Bearer` for protected API calls. Email fetching is backend-driven and does not scrape external inboxes directly from the frontend.
        </p>
        <Button variant="outline" onClick={() => api.auth.logout()}>Logout</Button>
      </div>
    </div>
  );
};

export default Settings;
