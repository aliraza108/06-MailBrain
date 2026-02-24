import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0f13] text-white">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-semibold">404</h1>
        <p className="text-sm text-gray-400">Page not found</p>
        <a href="/" className="text-indigo-300 hover:text-indigo-200 underline">
          Return to MailBrain
        </a>
      </div>
    </div>
  );
};

export default NotFound;
