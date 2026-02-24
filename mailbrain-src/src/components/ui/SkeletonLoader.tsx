import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
}

const SkeletonLoader = ({ className }: SkeletonLoaderProps) => {
  return <div className={cn("animate-pulse bg-gray-700/50 rounded", className)} />;
};

export default SkeletonLoader;
