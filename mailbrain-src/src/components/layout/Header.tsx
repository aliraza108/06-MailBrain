import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

const titleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/inbox": "Inbox",
  "/process": "Process Email",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const queryClient = useQueryClient();

  const pageTitle = useMemo(() => {
    if (location.pathname.startsWith("/inbox/")) return "Email Detail";
    return titleMap[location.pathname] || "KAIRO";
  }, [location.pathname]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await api.emails.sync(20);
      const count = result?.synced ?? result?.new_emails ?? result?.total ?? 0;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["emails"] }),
        queryClient.invalidateQueries({ queryKey: ["analytics"] }),
      ]);
      toast.success(`Synced ${count} new emails`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sync";
      toast.error(`Failed to sync: ${message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <header className="flex items-center justify-between border-b border-border bg-secondary px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
        <p className="text-xs text-muted-foreground">Your inbox, on autopilot.</p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleSync}
          disabled={syncing}
        >
          {syncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
          Sync Gmail
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.picture} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() || "KR"}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate("/settings")}>Profile</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                toast.success("Logged out");
                logout();
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;


