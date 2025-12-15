import { cn } from "@/lib/cn";

interface ShieldBadgeProps {
  color: "purple" | "blue" | "gold" | "platinum" | "diamond" | "mythic";
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ShieldBadge({
  color,
  label,
  size = "md",
  className,
}: ShieldBadgeProps) {
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-28 w-28",
    lg: "h-32 w-32",
  };

  const colors = {
    purple: {
      shield: "from-purple-600 to-purple-800",
      glow: "shadow-purple-500/50",
      stop0: "#9333ea",
      stop100: "#6b21a8",
      gemStop0: "#e9d5ff",
      gemStop50: "#c084fc",
      gemStop100: "#7c3aed",
    },
    blue: {
      shield: "from-cyan-400 to-blue-600",
      glow: "shadow-cyan-400/50",
      stop0: "#22d3ee",
      stop100: "#2563eb",
      gemStop0: "#cffafe",
      gemStop50: "#67e8f9",
      gemStop100: "#0891b2",
    },
    gold: {
      shield: "from-yellow-400 to-yellow-600",
      glow: "shadow-yellow-500/50",
      stop0: "#fbbf24",
      stop100: "#d97706",
      gemStop0: "#fef3c7",
      gemStop50: "#fde047",
      gemStop100: "#f59e0b",
    },
    platinum: {
      shield: "from-cyan-300 to-teal-600",
      glow: "shadow-cyan-400/50",
      stop0: "#67e8f9",
      stop100: "#0d9488",
      gemStop0: "#ccfbf1",
      gemStop50: "#5eead4",
      gemStop100: "#14b8a6",
    },
    diamond: {
      shield: "from-indigo-400 to-blue-700",
      glow: "shadow-indigo-400/50",
      stop0: "#818cf8",
      stop100: "#1e3a8a",
      gemStop0: "#ddd6fe",
      gemStop50: "#a78bfa",
      gemStop100: "#6366f1",
    },
    mythic: {
      shield: "from-rose-400 to-pink-700",
      glow: "shadow-rose-500/50",
      stop0: "#fb7185",
      stop100: "#be123c",
      gemStop0: "#fecdd3",
      gemStop50: "#fb7185",
      gemStop100: "#e11d48",
    },
  };

  const selectedColors = colors[color];

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Resplandor */}
        <div className={cn("absolute -inset-2 rounded-full bg-linear-to-b from-yellow-400/30 to-orange-500/30 blur-xl", selectedColors.glow)} />

        <svg
          viewBox="0 0 100 120"
          className="relative h-full w-full drop-shadow-2xl"
        >
          <defs>
            <linearGradient
              id={`shield-grad-${color}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={selectedColors.stop0} />
              <stop offset="100%" stopColor={selectedColors.stop100} />
            </linearGradient>
            <linearGradient
              id={`shine-${color}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <radialGradient id={`gem-grad-${color}`} cx="50%" cy="50%">
              <stop offset="0%" stopColor={selectedColors.gemStop0} />
              <stop offset="50%" stopColor={selectedColors.gemStop50} />
              <stop offset="100%" stopColor={selectedColors.gemStop100} />
            </radialGradient>
            <radialGradient id="gem-shine" cx="30%" cy="30%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>

          {/* Base del escudo */}
          <path
            d="M50,10 L10,30 L10,60 Q10,90 50,110 Q90,90 90,60 L90,30 Z"
            fill={`url(#shield-grad-${color})`}
            stroke="#fbbf24"
            strokeWidth="3"
          />

          {/* Brillo interno */}
          <path
            d="M50,10 L10,30 L10,60 Q10,90 50,110 Q90,90 90,60 L90,30 Z"
            fill={`url(#shine-${color})`}
            opacity="0.6"
          />

          <circle
            cx="50"
            cy="55"
            r="18"
            fill={`url(#gem-grad-${color})`}
            stroke="#fbbf24"
            strokeWidth="2"
          />
          <circle cx="50" cy="55" r="18" fill="url(#gem-shine)" opacity="0.7" />
          <circle cx="45" cy="50" r="4" fill="rgba(255,255,255,0.9)" />
          <circle cx="53" cy="52" r="2" fill="rgba(255,255,255,0.7)" />

          <circle
            cx="30"
            cy="40"
            r="6"
            fill={`url(#gem-grad-${color})`}
            stroke="#fbbf24"
            strokeWidth="1.5"
          />
          <circle cx="30" cy="40" r="6" fill="url(#gem-shine)" opacity="0.6" />
          <circle cx="28" cy="38" r="1.5" fill="rgba(255,255,255,0.9)" />

          <circle
            cx="70"
            cy="40"
            r="6"
            fill={`url(#gem-grad-${color})`}
            stroke="#fbbf24"
            strokeWidth="1.5"
          />
          <circle cx="70" cy="40" r="6" fill="url(#gem-shine)" opacity="0.6" />
          <circle cx="68" cy="38" r="1.5" fill="rgba(255,255,255,0.9)" />

          <circle
            cx="35"
            cy="70"
            r="5"
            fill={`url(#gem-grad-${color})`}
            stroke="#fbbf24"
            strokeWidth="1.5"
          />
          <circle cx="35" cy="70" r="5" fill="url(#gem-shine)" opacity="0.6" />
          <circle cx="33" cy="68" r="1" fill="rgba(255,255,255,0.9)" />

          <circle
            cx="65"
            cy="70"
            r="5"
            fill={`url(#gem-grad-${color})`}
            stroke="#fbbf24"
            strokeWidth="1.5"
          />
          <circle cx="65" cy="70" r="5" fill="url(#gem-shine)" opacity="0.6" />
          <circle cx="63" cy="68" r="1" fill="rgba(255,255,255,0.9)" />

          {/* Borde dorado */}
          <path
            d="M50,10 L10,30 L10,60 Q10,90 50,110 Q90,90 90,60 L90,30 Z"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2.5"
          />
        </svg>
      </div>

      <p className="text-center text-sm font-bold text-white">{label}</p>
    </div>
  );
}
