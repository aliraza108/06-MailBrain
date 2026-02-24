import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useAutoSync, SYNC_INTERVALS } from "@/hooks/useEmails";
import { useDashboardState } from "@/hooks/useDashboardState";
import { toast } from "@/components/ui/sonner";

const titleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/inbox": "Inbox",
  "/process": "AI Composer",
  "/analytics": "Analytics",
  "/settings": "Profile Settings",
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { syncEnabled, setSyncEnabled, syncIntervalMs, setSyncIntervalMs } = useDashboardState();

  const pageTitle = useMemo(() => titleMap[location.pathname] || "MailMind", [location.pathname]);
  const syncMutation = useAutoSync(syncEnabled, syncIntervalMs, 20);

  const handleManualSync = async () => {
    try {
      const result = await syncMutation.mutateAsync({ maxResults: 20, method: "POST" });
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
          <p className="text-xs text-muted-foreground">No scraping. Sync runs only through your secured backend API.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
            <span className="text-xs text-muted-foreground">Auto Sync</span>
            <Switch checked={syncEnabled} onCheckedChange={setSyncEnabled} />
            <select
              value={syncIntervalMs}
              onChange={(event) => setSyncIntervalMs(Number(event.target.value))}
              className="bg-transparent text-xs text-foreground outline-none"
            >
              {SYNC_INTERVALS.map((interval) => (
                <option key={interval.ms} value={interval.ms}>
                  {interval.label}
                </option>
              ))}
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
