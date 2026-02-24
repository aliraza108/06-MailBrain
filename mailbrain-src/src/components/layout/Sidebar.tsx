import { NavLink } from "react-router-dom";
import { Brain, LayoutDashboard, Inbox, MailPlus, BarChart3, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Inbox", to: "/inbox", icon: Inbox },
  { label: "Process Email", to: "/process", icon: MailPlus },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Settings", to: "/settings", icon: Settings },
];

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-[#11111a] border-r border-[#2a2a3a] min-h-screen">
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-indigo-600/20 flex items-center justify-center">
          <Brain className="h-5 w-5 text-indigo-300" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white">MailBrain</div>
          <div className="text-xs text-gray-400">Email Ops Manager</div>
        </div>
        <Avatar className="h-8 w-8 border border-[#2a2a3a]">
          <AvatarImage src={user?.picture} alt={user?.name || "User"} />
          <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() || "MB"}</AvatarFallback>
        </Avatar>
      </div>

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
                    ? "bg-indigo-600/20 text-indigo-200 border border-indigo-500/30"
                    : "text-gray-300 hover:bg-[#1a1a24]"
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-6 py-4 text-xs text-gray-500">
        Powered by MailBrain AI
      </div>
    </aside>
  );
};

export default Sidebar;
