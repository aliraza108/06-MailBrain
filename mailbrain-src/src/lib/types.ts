export type EmailPriority = "CRITICAL" | "HIGH" | "NORMAL" | "LOW" | string;

export interface User {
  id?: string;
  email?: string;
  name?: string;
  picture?: string;
}

export interface Profile {
  full_name: string;
  role_title: string;
  company_name: string;
  writing_tone: string;
  signature: string;
  custom_system_prompt: string;
  default_language: string;
}

export interface HealthResponse {
  status?: string;
  message?: string;
  [key: string]: unknown;
}

export interface DebugResponse {
  [key: string]: unknown;
}

export interface EmailItem {
  id: string;
  sender: string;
  sender_name?: string;
  subject: string;
  summary?: string;
  intent?: string;
  priority?: EmailPriority;
  priority_score?: number;
  sentiment?: string;
  language?: string;
  action_taken?: string;
  assigned_department?: string;
  confidence_score?: number;
  reply_sent?: boolean;
  escalated?: boolean;
  received_at?: string;
  processed_at?: string;
  status?: string;
}

export interface EmailDetail extends EmailItem {
  body?: string;
  generated_reply?: string;
  ai_metadata?: Record<string, unknown> | null;
  thread_context?: string;
  conversation_id?: string;
  reply_sent_at?: string;
}

export interface EmailListResponse {
  total?: number;
  page?: number;
  page_size?: number;
  emails: EmailItem[];
}

export interface EmailListParams {
  page?: number;
  page_size?: number;
  priority?: EmailPriority | "ALL";
  intent?: string;
}

export interface ManualEmailInput {
  sender: string;
  sender_name?: string;
  subject: string;
  body: string;
  thread_context?: string;
  mark_as_read?: boolean;
  keep_unread?: boolean;
  preserve_important_unread?: boolean;
}

export interface ProcessResult {
  email?: EmailDetail;
  [key: string]: unknown;
}

export interface SyncResult {
  synced?: number;
  new_emails?: number;
  total?: number;
  added?: number;
  [key: string]: unknown;
}

export interface BatchResult {
  processed?: number;
  results?: EmailDetail[];
  errors?: string[];
}

export interface GenerateReplyPayload {
  subject: string;
  body: string;
  conversation_id?: string;
  tone?: string;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
}

export interface ImproveDraftPayload {
  draft: string;
  instruction?: string;
}

export interface GenerateSubjectsPayload {
  context: string;
  count?: number;
}

export interface AiDraftResponse {
  subject?: string;
  body?: string;
  draft?: string;
  reply?: string;
  subjects?: string[];
  [key: string]: unknown;
}

export interface OverviewStats {
  period_days?: number;
  total_emails?: number;
  critical_emails?: number;
  auto_replied?: number;
  escalated?: number;
  automation_rate?: number;
  avg_confidence?: number;
}

export interface IntentCount {
  intent: string;
  count: number;
}

export interface IntentStats {
  period_days?: number;
  intents: IntentCount[];
}

export interface PriorityCount {
  priority: string;
  count: number;
}

export interface PriorityStats {
  period_days?: number;
  priorities: PriorityCount[];
}

export interface TrendPoint {
  date: string;
  total: number;
  auto_replied?: number;
  escalated?: number;
}

export interface TrendsData {
  period_days?: number;
  points: TrendPoint[];
}

export interface AutomationStats {
  actions?: { action: string; count: number }[];
  departments?: { department: string; count: number }[];
  confidence?: { range: string; count: number }[];
}

export interface EscalationReport {
  count?: number;
  emails?: EmailItem[];
}
