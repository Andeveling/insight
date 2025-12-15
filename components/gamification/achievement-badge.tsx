import { cn } from "@/lib/cn";

interface AchievementBadgeProps {
  type: "bronze" | "silver" | "gold";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AchievementBadge({
  type,
  size = "md",
  className = "",
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-20 w-20",
    lg: "h-24 w-24",
  };

  const colors = {
    bronze: "from-orange-700 to-orange-900",
    silver: "from-slate-300 to-slate-500",
    gold: "from-yellow-400 to-yellow-600",
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-lg">
        <defs>
          <linearGradient id={`grad-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              className={`${colors[type].split(" ")[0].replace("from-", "")}`}
              stopColor="currentColor"
            />
            <stop
              offset="100%"
              className={`${colors[type].split(" ")[1].replace("to-", "")}`}
              stopColor="currentColor"
            />
          </linearGradient>
        </defs>
        <polygon
          points="50,5 61.8,27.6 86.6,31.7 68.3,49.4 72.5,74.1 50,62 27.5,74.1 31.7,49.4 13.4,31.7 38.2,27.6"
          fill={`url(#grad-${type})`}
          className={`fill-gradient-to-b ${colors[type]}`}
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="2"
        />
        <polygon
          points="50,5 61.8,27.6 86.6,31.7 68.3,49.4 72.5,74.1 50,62 27.5,74.1 31.7,49.4 13.4,31.7 38.2,27.6"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
