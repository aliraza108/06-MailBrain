import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-semibold">404</h1>
        <p className="text-sm text-muted-foreground">Page not found</p>
        <a href="/" className="text-primary hover:text-primary/80 underline">
          Return to KAIRO
        </a>
      </div>
    </div>
  );
};

export default NotFound;


