import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const Login = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <div className="text-2xl font-semibold text-foreground">MailMind</div>
          <div className="text-sm text-muted-foreground">AI-powered email workflow dashboard</div>
        </div>
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => (window.location.href = api.auth.googleLoginUrl())}>
          Continue with Google
        </Button>
        <p className="text-xs text-muted-foreground text-center">JWT token is returned by backend and used for protected dashboard APIs.</p>
      </div>
    </div>
  );
};

export default Login;
