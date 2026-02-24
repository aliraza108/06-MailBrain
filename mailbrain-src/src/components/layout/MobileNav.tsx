import { NavLink } from "react-router-dom";
import { LayoutDashboard, Inbox, MailPlus, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Inbox", to: "/inbox", icon: Inbox },
  { label: "Process", to: "/process", icon: MailPlus },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Settings", to: "/settings", icon: Settings },
];

const MobileNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-secondary z-40">
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

