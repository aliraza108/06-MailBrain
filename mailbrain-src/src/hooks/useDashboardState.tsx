import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface DashboardStateValue {
  selectedEmailId?: string;
  setSelectedEmailId: (id?: string) => void;
  syncEnabled: boolean;
  setSyncEnabled: (value: boolean) => void;
  syncIntervalMs: number;
  setSyncIntervalMs: (ms: number) => void;
  intentFilter: string;
  setIntentFilter: (value: string) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
}

const DashboardStateContext = createContext<DashboardStateValue | null>(null);
const SYNC_SETTINGS_KEY = "mailbrain_sync_settings";
const DEFAULT_SYNC_ENABLED = true;
const DEFAULT_SYNC_INTERVAL_MS = 60_000;

function loadSyncSettings(): { enabled: boolean; intervalMs: number } {
  if (typeof window === "undefined") {
    return { enabled: DEFAULT_SYNC_ENABLED, intervalMs: DEFAULT_SYNC_INTERVAL_MS };
  }

  try {
    const raw = localStorage.getItem(SYNC_SETTINGS_KEY);
    if (!raw) return { enabled: DEFAULT_SYNC_ENABLED, intervalMs: DEFAULT_SYNC_INTERVAL_MS };
    const parsed = JSON.parse(raw) as { enabled?: unknown; intervalMs?: unknown };

    const enabled = typeof parsed.enabled === "boolean" ? parsed.enabled : DEFAULT_SYNC_ENABLED;
    const intervalMs = typeof parsed.intervalMs === "number" && parsed.intervalMs >= 5000
      ? parsed.intervalMs
      : DEFAULT_SYNC_INTERVAL_MS;

    return { enabled, intervalMs };
  } catch {
    return { enabled: DEFAULT_SYNC_ENABLED, intervalMs: DEFAULT_SYNC_INTERVAL_MS };
  }
}

export function DashboardStateProvider({ children }: { children: React.ReactNode }) {
  const initialSync = loadSyncSettings();
  const [selectedEmailId, setSelectedEmailId] = useState<string | undefined>(undefined);
  const [syncEnabled, setSyncEnabled] = useState(initialSync.enabled);
  const [syncIntervalMs, setSyncIntervalMs] = useState(initialSync.intervalMs);
  const [intentFilter, setIntentFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(SYNC_SETTINGS_KEY, JSON.stringify({ enabled: syncEnabled, intervalMs: syncIntervalMs }));
  }, [syncEnabled, syncIntervalMs]);

  const value = useMemo(
    () => ({
      selectedEmailId,
      setSelectedEmailId,
      syncEnabled,
      setSyncEnabled,
      syncIntervalMs,
      setSyncIntervalMs,
      intentFilter,
      setIntentFilter,
      priorityFilter,
      setPriorityFilter,
    }),
    [selectedEmailId, syncEnabled, syncIntervalMs, intentFilter, priorityFilter]
  );

  return <DashboardStateContext.Provider value={value}>{children}</DashboardStateContext.Provider>;
}

export function useDashboardState() {
  const context = useContext(DashboardStateContext);
  if (!context) {
    throw new Error("useDashboardState must be used within DashboardStateProvider");
  }
  return context;
}
