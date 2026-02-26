import type { EmailDetail, EmailItem } from "@/lib/types";

type EmailLike = Partial<EmailItem & EmailDetail>;

const IMPORTANT_KEYWORDS = [
  "job",
  "application",
  "interview",
  "recruiter",
  "hiring",
  "offer letter",
  "assessment",
];

const NEWSLETTER_KEYWORDS = [
  "newsletter",
  "digest",
  "unsubscribe",
  "promotion",
  "promo",
  "sale",
  "deals",
  "weekly update",
  "monthly update",
];

const AUTOMATED_SENDER_PATTERNS = [
  "noreply",
  "no-reply",
  "do-not-reply",
  "donotreply",
  "mailer-daemon",
  "notifications@",
];

function toLower(value?: string): string {
  return value?.toLowerCase() || "";
}

function hasAny(value: string, patterns: string[]): boolean {
  return patterns.some((pattern) => value.includes(pattern));
}

export function isImportantConversation(email?: EmailLike): boolean {
  const text = [email?.subject, email?.body, email?.intent, email?.summary].map(toLower).join(" ");
  return hasAny(text, IMPORTANT_KEYWORDS);
}

export function shouldBlockAutoReply(email?: EmailLike): boolean {
  if (!email) return false;
  if (isImportantConversation(email)) return false;

  const sender = toLower(email.sender);
  const text = [email.subject, email.body, email.summary].map(toLower).join(" ");
  return hasAny(sender, AUTOMATED_SENDER_PATTERNS) || hasAny(text, NEWSLETTER_KEYWORDS);
}
