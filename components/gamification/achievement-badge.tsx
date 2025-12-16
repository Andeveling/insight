import { cn } from "@/lib/cn";

interface AchievementBadgeProps {
  type: "bronze" | "silver" | "gold" | "platinum" | "diamond" | "mythic";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AchievementBadge({
  type,
  size = "md",
  className,
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-20 w-20",
    lg: "h-24 w-24",
  };

  const colors = {
    bronze: { from: "#d97706", to: "#92400e" },
    silver: { from: "#e2e8f0", to: "#475569" },
    gold: { from: "#fbbf24", to: "#d97706" },
    platinum: { from: "#22d3ee", to: "#0891b2" },
    diamond: { from: "#818cf8", to: "#4338ca" },
    mythic: { from: "#f472b6", to: "#be185d" },
  };

  const selectedColor = colors[type];

  return (
    <div className={cn(sizeClasses[size], className)}>
      <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-lg">
        <defs>
          <linearGradient id={`grad-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={selectedColor.from} />
            <stop offset="100%" stopColor={selectedColor.to} />
          </linearGradient>
        </defs>
        <polygon
          points="50,5 61.8,27.6 86.6,31.7 68.3,49.4 72.5,74.1 50,62 27.5,74.1 31.7,49.4 13.4,31.7 38.2,27.6"
          fill={`url(#grad-${type})`}
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
