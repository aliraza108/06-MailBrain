import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const Login = () => {
  return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-2xl font-semibold text-white">MailBrain</div>
          <div className="text-sm text-gray-400">Your inbox, on autopilot.</div>
        </div>
        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
          onClick={() => {
            window.location.href = api.auth.googleLoginUrl();
          }}
        >
          Continue with Google
        </Button>
        <div className="text-xs text-gray-500 text-center">
          Secure login powered by Google OAuth.
        </div>
      </div>
    </div>
  );
};

export default Login;
