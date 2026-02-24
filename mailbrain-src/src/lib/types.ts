export type EmailPriority = "CRITICAL" | "HIGH" | "NORMAL" | "LOW";

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

export interface EmailItem {
  id: string;
  sender: string;
  subject: string;
  summary: string;
  intent: string;
  priority: EmailPriority;
  priority_score: number;
  sentiment: string;
  language: string;
  action_taken: string;
  assigned_department: string;
  confidence_score: number;
  reply_sent: boolean;
  escalated: boolean;
  received_at: string;
  processed_at: string;
  status: string;
}

export interface EmailDetail extends EmailItem {
  body: string;
  generated_reply: string;
  ai_metadata: Record<string, unknown> | null;
  reply_sent_at?: string;
  thread_context?: string;
}

export interface EmailListResponse {
  total: number;
  page: number;
  page_size: number;
  emails: EmailItem[];
}

export interface EmailListParams {
  page?: number;
  page_size?: number;
  priority?: EmailPriority | "ALL";
  intent?: string;
  status?: string;
  search?: string;
}

export interface OverviewStats {
  period_days: number;
  total_emails: number;
  critical_emails: number;
  auto_replied: number;
  escalated: number;
  automation_rate: number;
  avg_confidence: number;
}

export interface ManualEmailInput {
  sender: string;
  sender_name?: string;
  subject: string;
  body: string;
  thread_context?: string;
}

export interface ProcessResult {
  email: EmailDetail;
}

export interface SyncResult {
  synced?: number;
  new_emails?: number;
  total?: number;
}

export interface BatchResult {
  processed: number;
  results: EmailDetail[];
  errors?: string[];
}

export interface IntentCount {
  intent: string;
  count: number;
}

export interface IntentStats {
  period_days: number;
  intents: IntentCount[];
}

export interface PriorityCount {
  priority: EmailPriority;
  count: number;
}

export interface PriorityStats {
  period_days: number;
  priorities: PriorityCount[];
}

export interface TrendPoint {
  date: string;
  total: number;
  auto_replied: number;
  escalated: number;
}

export interface TrendsData {
  period_days: number;
  points: TrendPoint[];
}

export interface AutomationStats {
  actions: { action: string; count: number }[];
  departments?: { department: string; count: number }[];
  confidence?: { range: string; count: number }[];
}

export interface EscalationReport {
  count: number;
  emails: EmailItem[];
}
