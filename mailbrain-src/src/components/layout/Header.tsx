import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";

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

  const pageTitle = useMemo(() => {
    if (location.pathname.startsWith("/inbox/")) return "Email Detail";
    return titleMap[location.pathname] || "MailBrain";
  }, [location.pathname]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await api.emails.sync(20);
      const count = result?.synced ?? result?.new_emails ?? result?.total ?? 0;
      toast.success(`Synced ${count} new emails`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sync";
      toast.error(`Failed to sync: ${message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <header className="flex items-center justify-between border-b border-[#2a2a3a] bg-[#11111a] px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-white">{pageTitle}</h1>
        <p className="text-xs text-gray-500">Your inbox, on autopilot.</p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          className="bg-indigo-600 hover:bg-indigo-500 text-white"
          onClick={handleSync}
          disabled={syncing}
        >
          {syncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
          Sync Gmail
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full border border-[#2a2a3a] bg-[#1a1a24] px-2 py-1">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.picture} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() || "MB"}</AvatarFallback>
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
