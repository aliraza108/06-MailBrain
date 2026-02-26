import { NavLink } from "react-router-dom";
import { BarChart3, Download, Inbox, LayoutDashboard, MailPlus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getManualInstallHint, triggerInstallPrompt } from "@/lib/pwaInstall";
import { useState } from "react";

const navItems = [
  { label: "Home", to: "/dashboard", icon: LayoutDashboard },
  { label: "Inbox", to: "/inbox", icon: Inbox },
  { label: "AI", to: "/process", icon: MailPlus },
  { label: "Stats", to: "/analytics", icon: BarChart3 },
  { label: "Profile", to: "/settings", icon: Settings },
];

const MobileNav = () => {
  const [installHint, setInstallHint] = useState("");

  const handleInstall = async () => {
    const result = await triggerInstallPrompt();
    if (result === "accepted" || result === "dismissed") return;
    setInstallHint(getManualInstallHint());
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur z-40">
      <div className="px-3 pt-2">
        <Button size="sm" variant="outline" className="w-full" onClick={handleInstall}>
          <Download className="mr-2 h-4 w-4" />
          Install App
        </Button>
        {installHint && <p className="mt-1 text-[10px] text-muted-foreground text-center">{installHint}</p>}
      </div>
      <div className="grid grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 py-2 text-[10px]",
                  isActive ? "text-primary" : "text-muted-foreground"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
