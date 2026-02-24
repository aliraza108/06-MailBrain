import type {
  BatchResult,
  EmailDetail,
  EmailListParams,
  EmailListResponse,
  EscalationReport,
  IntentStats,
  ManualEmailInput,
  OverviewStats,
  PriorityStats,
  ProcessResult,
  SyncResult,
  TrendsData,
  AutomationStats,
  User,
} from "@/lib/types";
import { toast } from "@/components/ui/sonner";

const BASE_URL = "https://06-mailbrain-api.vercel.app";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("mailbrain_token");
}

function buildQuery(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return "";
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "" || value === "ALL") return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("mailbrain_token");
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({} as { detail?: string; message?: string }));
    throw new Error(err.detail || err.message || "API Error");
  }

  if (res.status === 204) {
    return {} as T;
  }

  return (await res.json()) as T;
}

export const api = {
  auth: {
    googleLoginUrl: () => `${BASE_URL}/auth/google`,
    me: () => request<User>("/auth/me"),
    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("mailbrain_token");
        window.location.href = "/login";
      }
    },
  },
  emails: {
    list: (params?: EmailListParams) =>
      request<EmailListResponse>(`/emails/${buildQuery(params as Record<string, string | number | boolean | undefined>)}`),
    get: (id: string) => request<EmailDetail>(`/emails/${id}`),
    process: (data: ManualEmailInput) =>
      request<ProcessResult>("/emails/process", { method: "POST", body: JSON.stringify(data) }),
    sync: (max?: number) =>
      request<SyncResult>(`/emails/sync${buildQuery({ max_results: max ?? 20 })}`, { method: "POST" }),
    batch: (emails: ManualEmailInput[]) =>
      request<BatchResult>("/emails/batch", { method: "POST", body: JSON.stringify({ emails }) }),
    approveReply: (id: string) => request(`/emails/${id}/approve`, { method: "POST" }),
    sendReply: (id: string, body: string) =>
      request(`/emails/${id}/reply`, { method: "POST", body: JSON.stringify({ body }) }),
  },
  analytics: {
    overview: (days?: number) =>
      request<OverviewStats>(`/analytics/overview${buildQuery({ days: days ?? 7 })}`),
    intent: (days?: number) => request<IntentStats>(`/analytics/intent${buildQuery({ days: days ?? 30 })}`),
    priority: (days?: number) => request<PriorityStats>(`/analytics/priority${buildQuery({ days: days ?? 7 })}`),
    trends: (days?: number) => request<TrendsData>(`/analytics/trends${buildQuery({ days: days ?? 14 })}`),
    automation: () => request<AutomationStats>("/analytics/automation"),
    escalations: (days?: number) =>
      request<EscalationReport>(`/analytics/escalations${buildQuery({ days: days ?? 7 })}`),
  },
};
