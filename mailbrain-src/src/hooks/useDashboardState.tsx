import { createContext, useContext, useMemo, useState } from "react";

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

export function DashboardStateProvider({ children }: { children: React.ReactNode }) {
  const [selectedEmailId, setSelectedEmailId] = useState<string | undefined>(undefined);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [syncIntervalMs, setSyncIntervalMs] = useState(60_000);
  const [intentFilter, setIntentFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

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
