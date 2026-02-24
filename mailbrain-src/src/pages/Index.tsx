import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

const Index = () => {
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("mailbrain_token");
    setTarget(token ? "/dashboard" : "/login");
  }, []);

  if (!target) {
    return (
      <div className="min-h-screen bg-[#0f0f13] p-8">
        <SkeletonLoader className="h-8 w-48" />
      </div>
    );
  }

  return <Navigate to={target} replace />;
};

export default Index;
