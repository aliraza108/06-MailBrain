import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import {
  DEFAULT_EXCLUDE_CATEGORIES,
  DEFAULT_INCLUDE_CATEGORIES,
  useAutoSync,
} from "@/hooks/useEmails";
import { useDashboardState } from "@/hooks/useDashboardState";
import { toast } from "@/components/ui/sonner";

const titleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/inbox": "Inbox",
  "/process": "AI Composer",
  "/analytics": "Analytics",
  "/settings": "Profile Settings",
};

type SyncUnit = "sec" | "hour" | "day";

const UNIT_TO_MS: Record<SyncUnit, number> = {
  sec: 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { syncEnabled, setSyncEnabled, syncIntervalMs, setSyncIntervalMs } = useDashboardState();
  const [syncUnit, setSyncUnit] = useState<SyncUnit>("sec");
  const [syncValue, setSyncValue] = useState<number>(Math.max(5, Math.floor(syncIntervalMs / 1000)));

  const pageTitle = useMemo(() => titleMap[location.pathname] || "MailMind", [location.pathname]);
  const syncMutation = useAutoSync(syncEnabled, syncIntervalMs, 20);

  useEffect(() => {
    const next = Math.round(syncIntervalMs / UNIT_TO_MS[syncUnit]);
    setSyncValue(syncUnit === "sec" ? Math.max(5, next) : Math.max(1, next));
  }, [syncIntervalMs, syncUnit]);

  const handleManualSync = async () => {
    try {
      const result = await syncMutation.mutateAsync({
        maxResults: 20,
        method: "POST",
        includeCategories: [...DEFAULT_INCLUDE_CATEGORIES],
        excludeCategories: [...DEFAULT_EXCLUDE_CATEGORIES],
      });
      const count = result.synced ?? result.new_emails ?? result.total ?? result.added ?? 0;
      toast.success(`Sync complete: ${count} email(s) updated`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sync";
      toast.error(`Sync failed: ${message}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur px-4 md:px-6 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
          <p className="text-xs text-muted-foreground">
            Sync pulls only Primary/Updates, excludes Promotions/Social, and keeps important emails unread.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
            <span className="text-xs text-muted-foreground">Auto Sync</span>
            <Switch checked={syncEnabled} onCheckedChange={setSyncEnabled} />
            <input
              type="number"
              min={syncUnit === "sec" ? 5 : 1}
              step={1}
              value={syncValue}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (!Number.isFinite(value)) return;
                const clamped = syncUnit === "sec" ? Math.max(5, value) : Math.max(1, value);
                setSyncValue(clamped);
                setSyncIntervalMs(clamped * UNIT_TO_MS[syncUnit]);
              }}
              className="w-20 rounded border border-border bg-background px-2 py-1 text-xs text-foreground outline-none"
            />
            <select
              value={syncUnit}
              onChange={(event) => {
                const nextUnit = event.target.value as SyncUnit;
                setSyncUnit(nextUnit);
              }}
              className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground outline-none"
            >
              <option value="sec">sec</option>
              <option value="hour">hour</option>
              <option value="day">day</option>
            </select>
          </div>

          <Button onClick={handleManualSync} disabled={syncMutation.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {syncMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Sync Emails
          </Button>
          <Button variant="outline" onClick={() => navigate("/settings")}>Profile</Button>
          <Button variant="ghost" onClick={logout}>Logout</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
