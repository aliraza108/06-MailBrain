import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

const Settings = () => {
  const { user, isLoading, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6 space-y-4">
        <div className="text-sm font-semibold text-white">Account</div>
        {isLoading ? (
          <SkeletonLoader className="h-16 w-full" />
        ) : (
          <div className="text-sm text-gray-300 space-y-1">
            <div>Name: {user?.name || "--"}</div>
            <div>Email: {user?.email || "--"}</div>
          </div>
        )}
      </div>

      <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6 space-y-4">
        <div className="text-sm font-semibold text-white">Gmail Connection</div>
        <div className="text-sm text-gray-300">Connected account: {user?.email || "--"}</div>
        <Button className="bg-indigo-600 hover:bg-indigo-500" onClick={() => (window.location.href = api.auth.googleLoginUrl())}>
          Reconnect Gmail
        </Button>
      </div>

      <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6 space-y-2">
        <div className="text-sm font-semibold text-white">Automation Threshold</div>
        <div className="text-xs text-gray-400">
          MailBrain automatically sends replies when confidence exceeds 85%. Emails below this threshold are routed for review.
        </div>
      </div>

      <div className="bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-6 space-y-4">
        <div className="text-sm font-semibold text-white">Danger Zone</div>
        <Button
          variant="outline"
          className="border-red-500/30 text-red-400 hover:bg-red-500/20"
          onClick={() => logout()}
        >
          Disconnect Gmail & Logout
        </Button>
      </div>
    </div>
  );
};

export default Settings;
