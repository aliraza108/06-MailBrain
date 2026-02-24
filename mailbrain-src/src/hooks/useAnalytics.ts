import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  AutomationStats,
  EscalationReport,
  IntentStats,
  OverviewStats,
  PriorityStats,
  TrendsData,
} from "@/lib/types";

export function useOverviewStats(days = 7) {
  return useQuery<OverviewStats>({
    queryKey: ["analytics", "overview", days],
    queryFn: () => api.analytics.overview(days),
  });
}

export function useIntentStats(days = 30) {
  return useQuery<IntentStats>({
    queryKey: ["analytics", "intent", days],
    queryFn: () => api.analytics.intent(days),
  });
}

export function usePriorityStats(days = 7) {
  return useQuery<PriorityStats>({
    queryKey: ["analytics", "priority", days],
    queryFn: () => api.analytics.priority(days),
  });
}

export function useTrendStats(days = 14) {
  return useQuery<TrendsData>({
    queryKey: ["analytics", "trends", days],
    queryFn: () => api.analytics.trends(days),
  });
}

export function useAutomationStats() {
  return useQuery<AutomationStats>({
    queryKey: ["analytics", "automation"],
    queryFn: () => api.analytics.automation(),
  });
}

export function useEscalations(days = 7) {
  return useQuery<EscalationReport>({
    queryKey: ["analytics", "escalations", days],
    queryFn: () => api.analytics.escalations(days),
  });
}
