import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  EmailDetail,
  EmailListParams,
  EmailListResponse,
  GenerateReplyPayload,
  ManualEmailInput,
  SendEmailPayload,
  SyncResult,
} from "@/lib/types";

export const SYNC_INTERVALS = [
  { label: "5s", ms: 5000 },
  { label: "1m", ms: 60_000 },
  { label: "5m", ms: 300_000 },
  { label: "1h", ms: 3_600_000 },
  { label: "1d", ms: 86_400_000 },
] as const;

export const DEFAULT_INCLUDE_CATEGORIES = ["primary", "updates"] as const;
export const DEFAULT_EXCLUDE_CATEGORIES = ["promotions", "social"] as const;

export function useEmails(params: EmailListParams) {
  return useQuery<EmailListResponse>({
    queryKey: ["emails", params],
    queryFn: () => api.emails.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useEmailDetail(id?: string, enabled = true) {
  return useQuery<EmailDetail>({
    queryKey: ["emails", "detail", id],
    queryFn: () => api.emails.get(id || ""),
    enabled: Boolean(id) && enabled,
  });
}

export function useSyncEmails() {
  const queryClient = useQueryClient();
  return useMutation<
    SyncResult,
    Error,
    {
      maxResults?: number;
      method?: "GET" | "POST";
      includeCategories?: string[];
      excludeCategories?: string[];
    }
  >({
    mutationFn: ({
      maxResults = 20,
      method = "POST",
      includeCategories = [...DEFAULT_INCLUDE_CATEGORIES],
      excludeCategories = [...DEFAULT_EXCLUDE_CATEGORIES],
    }) =>
      api.emails.sync({
        maxResults,
        method,
        includeCategories,
        excludeCategories,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["emails"] }),
        queryClient.invalidateQueries({ queryKey: ["analytics"] }),
      ]);
    },
  });
}

export function useAutoSync(enabled: boolean, intervalMs: number, maxResults = 20) {
  const sync = useSyncEmails();

  useEffect(() => {
    if (!enabled || intervalMs < 1000) return;
    const timer = setInterval(() => {
      if (!sync.isPending) {
        sync.mutate({ maxResults, method: "POST" });
      }
    }, intervalMs);
    return () => clearInterval(timer);
  }, [enabled, intervalMs, maxResults, sync]);

  return sync;
}

export function useApproveReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (emailId: string) => api.emails.approve(emailId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
  });
}

export function useSendReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: string }) => api.emails.reply(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
  });
}

export function useProcessEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ManualEmailInput) => api.emails.process(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
  });
}

export function useGenerateReply() {
  return useMutation({ mutationFn: (payload: GenerateReplyPayload) => api.emails.generateReply(payload) });
}

export function useSendEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendEmailPayload) => api.emails.send(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] });
    },
  });
}
