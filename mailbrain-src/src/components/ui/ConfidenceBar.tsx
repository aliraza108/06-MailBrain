import { cn } from "@/lib/utils";

interface ConfidenceBarProps {
  score: number;
}

const normalizeScore = (score: number) => {
  if (score <= 1) return Math.round(score * 100);
  return Math.round(score);
};

const ConfidenceBar = ({ score }: ConfidenceBarProps) => {
  const percent = Math.min(100, Math.max(0, normalizeScore(score)));
  const color =
    percent >= 80 ? "text-green-400" : percent >= 60 ? "text-yellow-400" : "text-red-400";
  const barColor =
    percent >= 80 ? "bg-green-500/60" : percent >= 60 ? "bg-yellow-500/60" : "bg-red-500/60";

  return (
    <div className="flex flex-col gap-1 min-w-[80px]">
      <span className={cn("text-xs font-semibold", color)}>{percent}%</span>
      <div className="h-1 w-full rounded-full bg-[#2a2a3a]">
        <div className={cn("h-1 rounded-full", barColor)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
};

export default ConfidenceBar;
