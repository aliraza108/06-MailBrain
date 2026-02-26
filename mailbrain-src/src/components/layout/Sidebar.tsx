import { Link, NavLink } from "react-router-dom";
import { BarChart3, Brain, Download, Inbox, LayoutDashboard, MailPlus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getManualInstallHint, triggerInstallPrompt } from "@/lib/pwaInstall";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Inbox", to: "/inbox", icon: Inbox },
  { label: "AI Tools", to: "/process", icon: MailPlus },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Settings", to: "/settings", icon: Settings },
];

const Sidebar = () => {
  const [installHint, setInstallHint] = useState("");

  const handleInstall = async () => {
    const result = await triggerInstallPrompt();
    if (result === "accepted" || result === "dismissed") return;
    setInstallHint(getManualInstallHint());
  };

  return (
    <aside className="hidden md:flex md:flex-col w-64 border-r border-border min-h-screen bg-gradient-to-b from-secondary to-background">
      <Link to="/dashboard" aria-label="Go to dashboard" className="px-6 py-6 flex items-center gap-3 hover:bg-card/40 transition-colors">
        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">MailMind</div>
          <div className="text-xs text-muted-foreground">Email Operations Desk</div>
        </div>
      </Link>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:bg-card"
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-6 py-4 space-y-2">
        <Button variant="outline" className="w-full" onClick={handleInstall}>
          <Download className="mr-2 h-4 w-4" />
          Install App
        </Button>
        {installHint && <p className="text-xs text-muted-foreground">{installHint}</p>}
        <div className="text-xs text-muted-foreground">MailMind AI assistant</div>
      </div>
    </aside>
  );
};

export default Sidebar;
