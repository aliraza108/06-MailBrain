import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const Login = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-2xl font-semibold text-foreground">KAIRO</div>
          <div className="text-sm text-muted-foreground">Your inbox, on autopilot.</div>
        </div>
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => {
            window.location.href = api.auth.googleLoginUrl();
          }}
        >
          Continue with Google
        </Button>
        <div className="text-xs text-muted-foreground text-center">
          Secure login powered by Google OAuth.
        </div>
      </div>
    </div>
  );
};

export default Login;


