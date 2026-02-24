import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { getStoredToken, setStoredToken } from "@/lib/api";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromQuery = params.get("token");

    if (tokenFromQuery) {
      setStoredToken(tokenFromQuery, true);
      window.history.replaceState({}, "", location.pathname);
      setReady(true);
      return;
    }

    const token = getStoredToken();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setReady(true);
  }, [location.pathname, location.search, navigate]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
