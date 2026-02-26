import type {
  AiDraftResponse,
  AutomationStats,
  BatchResult,
  DebugResponse,
  EmailDetail,
  EmailListParams,
  EmailListResponse,
  EscalationReport,
  GenerateReplyPayload,
  GenerateSubjectsPayload,
  HealthResponse,
  ImproveDraftPayload,
  IntentStats,
  JobApplyPayload,
  ManualEmailInput,
  OverviewStats,
  PriorityStats,
  ProcessResult,
  Profile,
  ProposalPayload,
  SendEmailPayload,
  SyncResult,
  TrendsData,
  User,
} from "@/lib/types";

const env = import.meta.env as Record<string, string | undefined>;
const BASE_URL = (env.VITE_API_URL || env.VITE_API_BASE_URL || env.NEXT_PUBLIC_API_URL || "https://07-mailbrain-api.vercel.app").replace(/\/+$/, "");
const TOKEN_KEY = "mailbrain_token";
const PROTECTED_ROUTES = ["/dashboard", "/inbox", "/process", "/analytics", "/settings", "/app"];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string, persist = true): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(TOKEN_KEY, token);
  if (persist) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearStoredToken(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

type SyncOptions = {
  maxResults?: number;
  method?: "GET" | "POST";
  includeCategories?: string[];
  excludeCategories?: string[];
  markAsRead?: boolean;
  preserveImportantUnread?: boolean;
  keepUnread?: boolean;
};

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

function toErrorMessage(value: unknown): string {
  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    const items = value.map((entry) => toErrorMessage(entry)).filter(Boolean);
    return items.join("; ");
  }

  if (value && typeof value === "object") {
    const entry = value as Record<string, unknown>;
    const directMessage = entry.detail ?? entry.message ?? entry.msg;
    if (typeof directMessage === "string") return directMessage;

    const location = Array.isArray(entry.loc) ? entry.loc.join(".") : "";
    const nestedMessage = typeof entry.msg === "string" ? entry.msg : typeof entry.message === "string" ? entry.message : "";
    if (location && nestedMessage) return `${location}: ${nestedMessage}`;

    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  if (value == null) return "";
  return String(value);
}

function extractEmailAddress(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const angleMatch = trimmed.match(/<([^<>@\s]+@[^<>@\s]+\.[^<>@\s]+)>/);
  if (angleMatch?.[1]) return angleMatch[1].trim();

  return trimmed;
}

function shouldTryAlternateSendVariant(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes("422") ||
    message.includes("validation") ||
    message.includes("body") ||
    message.includes("field required")
  );
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    clearStoredToken();
    if (typeof window !== "undefined") {
      if (isProtectedRoute(window.location.pathname)) {
        window.location.href = "/login";
      }
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    const message = toErrorMessage(err);
    throw new Error(message || `API error (${res.status})`);
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
      clearStoredToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    },
  },
  core: {
    root: () => request<HealthResponse>("/"),
    health: () => request<HealthResponse>("/health"),
    debug: () => request<DebugResponse>("/debug"),
  },
  profile: {
    get: () => request<Profile>("/profile"),
    update: (payload: Profile) => request<Profile>("/profile", { method: "PUT", body: JSON.stringify(payload) }),
  },
  emails: {
    list: (params?: EmailListParams) =>
      request<EmailListResponse>(`/emails${buildQuery(params as Record<string, string | number | boolean | undefined>)}`),
    get: (id: string) => request<EmailDetail>(`/emails/${id}`),
    sync: async (options: SyncOptions = {}) => {
      const {
        maxResults = 20,
        method = "POST",
        includeCategories,
        excludeCategories,
        markAsRead = false,
        preserveImportantUnread = true,
        keepUnread = true,
      } = options;
      const queryPayload = {
        max_results: maxResults,
        include_categories: includeCategories?.join(","),
        exclude_categories: excludeCategories?.join(","),
        mark_as_read: markAsRead,
        preserve_important_unread: preserveImportantUnread,
        keep_unread: keepUnread,
      };
      const bodyPayload = {
        max_results: maxResults,
        include_categories: includeCategories,
        exclude_categories: excludeCategories,
        mark_as_read: markAsRead,
        preserve_important_unread: preserveImportantUnread,
        keep_unread: keepUnread,
      };

      if (method === "GET") {
        return request<SyncResult>(`/emails/sync${buildQuery(queryPayload)}`, { method: "GET" });
      }

      try {
        return await request<SyncResult>("/emails/sync", {
          method: "POST",
          body: JSON.stringify(bodyPayload),
        });
      } catch {
        return request<SyncResult>(`/emails/sync${buildQuery(queryPayload)}`, { method: "POST" });
      }
    },
    process: (data: ManualEmailInput) =>
      request<ProcessResult>("/emails/process", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          mark_as_read: data.mark_as_read ?? false,
          keep_unread: data.keep_unread ?? true,
          preserve_important_unread: data.preserve_important_unread ?? true,
        }),
      }),
    batch: (emails: ManualEmailInput[]) =>
      request<BatchResult>("/emails/batch", { method: "POST", body: JSON.stringify({ emails }) }),
    approve: (id: string) => request(`/emails/${id}/approve`, { method: "POST" }),
    reply: async (id: string, body: string) => {
      const trimmedBody = body.trim();
      try {
        return await request(`/emails/${id}/reply`, { method: "POST", body: JSON.stringify({ body: trimmedBody }) });
      } catch (error) {
        if (!shouldTryAlternateSendVariant(error)) throw error;
        return request(`/emails/${id}/reply`, { method: "POST", body: JSON.stringify({ body: trimmedBody, reply_body: trimmedBody }) });
      }
    },
    approveReply: (id: string) => request(`/emails/${id}/approve`, { method: "POST" }),
    sendReply: async (id: string, body: string) => {
      const trimmedBody = body.trim();
      try {
        return await request(`/emails/${id}/reply`, { method: "POST", body: JSON.stringify({ body: trimmedBody }) });
      } catch (error) {
        if (!shouldTryAlternateSendVariant(error)) throw error;
        return request(`/emails/${id}/reply`, { method: "POST", body: JSON.stringify({ body: trimmedBody, reply_body: trimmedBody }) });
      }
    },
    send: async (payload: SendEmailPayload) => {
      const normalizedPayload = { ...payload, to: extractEmailAddress(payload.to) };
      try {
        return await request("/emails/send", { method: "POST", body: JSON.stringify(normalizedPayload) });
      } catch (error) {
        if (!shouldTryAlternateSendVariant(error)) throw error;
        return request("/emails/send", {
          method: "POST",
          body: JSON.stringify({
            ...normalizedPayload,
            text: normalizedPayload.body,
          }),
        });
      }
    },
    generateReply: (payload: GenerateReplyPayload) => request<AiDraftResponse>("/emails/generate-reply", { method: "POST", body: JSON.stringify(payload) }),
    generate: (payload: SendEmailPayload) => request<AiDraftResponse>("/emails/generate", { method: "POST", body: JSON.stringify(payload) }),
    generateJob: (payload: SendEmailPayload | JobApplyPayload) =>
      request<AiDraftResponse>("/emails/generate/job", {
        method: "POST",
        body: JSON.stringify({
          ...payload,
          job_post_body: (payload as JobApplyPayload).job_post_body || payload.body,
        }),
      }),
    generateProposal: (payload: SendEmailPayload | ProposalPayload) =>
      request<AiDraftResponse>("/emails/generate/proposal", {
        method: "POST",
        body: JSON.stringify({
          ...payload,
          proposal_body:
            (payload as ProposalPayload).proposal_body ||
            (payload as ProposalPayload).proposal_post_body ||
            payload.body,
          proposal_post_body:
            (payload as ProposalPayload).proposal_post_body ||
            (payload as ProposalPayload).proposal_body ||
            payload.body,
        }),
      }),
    generateFollowUp: (payload: SendEmailPayload) => request<AiDraftResponse>("/emails/generate/follow-up", { method: "POST", body: JSON.stringify(payload) }),
    generateAndSend: (payload: SendEmailPayload) => request("/emails/generate-and-send", { method: "POST", body: JSON.stringify(payload) }),
    jobApplySend: (payload: SendEmailPayload | JobApplyPayload) =>
      request("/emails/job-apply/send", {
        method: "POST",
        body: JSON.stringify({
          ...payload,
          job_post_body: (payload as JobApplyPayload).job_post_body || payload.body,
        }),
      }),
    proposalSend: (payload: SendEmailPayload | ProposalPayload) =>
      request("/emails/proposal/send", {
        method: "POST",
        body: JSON.stringify({
          ...payload,
          proposal_body:
            (payload as ProposalPayload).proposal_body ||
            (payload as ProposalPayload).proposal_post_body ||
            payload.body,
          proposal_post_body:
            (payload as ProposalPayload).proposal_post_body ||
            (payload as ProposalPayload).proposal_body ||
            payload.body,
        }),
      }),
    generateSubjects: (payload: GenerateSubjectsPayload) => request<AiDraftResponse>("/emails/generate/subjects", { method: "POST", body: JSON.stringify(payload) }),
    improveDraft: (payload: ImproveDraftPayload) => request<AiDraftResponse>("/emails/generate/improve", { method: "POST", body: JSON.stringify(payload) }),
    delete: (id: string) => request(`/emails/${id}`, { method: "DELETE" }),
  },
  analytics: {
    overview: (days = 7) => request<OverviewStats>(`/analytics/overview${buildQuery({ days })}`),
    intent: (days = 30) => request<IntentStats>(`/analytics/intent${buildQuery({ days })}`),
    priority: (days = 7) => request<PriorityStats>(`/analytics/priority${buildQuery({ days })}`),
    trends: (days = 14) => request<TrendsData>(`/analytics/trends${buildQuery({ days })}`),
    automation: () => request<AutomationStats>("/analytics/automation"),
    escalations: (days = 7) => request<EscalationReport>(`/analytics/escalations${buildQuery({ days })}`),
  },
};
