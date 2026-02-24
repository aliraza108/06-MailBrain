import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { EmailListParams, EmailListResponse, EmailDetail } from "@/lib/types";

export function useEmails(params: EmailListParams) {
  return useQuery<EmailListResponse>({
    queryKey: ["emails", params],
    queryFn: () => api.emails.list(params),
    keepPreviousData: true,
  });
}

export function useEmailDetail(id?: string, enabled = true) {
  return useQuery<EmailDetail>({
    queryKey: ["emails", "detail", id],
    queryFn: () => api.emails.get(id || ""),
    enabled: Boolean(id) && enabled,
  });
}
