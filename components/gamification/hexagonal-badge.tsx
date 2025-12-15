interface HexagonalBadgeProps {
  type: "bronze" | "silver" | "gold";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function HexagonalBadge({
  type,
  size = "md",
  className = "",
}: HexagonalBadgeProps) {
  const sizeClasses = {
    sm: "h-16 w-20",
    md: "h-20 w-24",
    lg: "h-24 w-28",
  };

  const colors = {
    bronze: {
      outer: ["#d97706", "#92400e"],
      inner: ["#fbbf24", "#d97706"],
      gem: ["#fcd34d", "#f59e0b"],
      border: "#d97706",
    },
    silver: {
      outer: ["#94a3b8", "#475569"],
      inner: ["#e2e8f0", "#94a3b8"],
      gem: ["#f1f5f9", "#cbd5e1"],
      border: "#94a3b8",
    },
    gold: {
      outer: ["#fbbf24", "#d97706"],
      inner: ["#fde047", "#fbbf24"],
      gem: ["#fef08a", "#fde047"],
      border: "#fbbf24",
    },
  };

  const selectedColors = colors[type];

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-lg">
        <defs>
          {/* Gradiente para el hexágono exterior */}
          <linearGradient
            id={`hex-outer-${type}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={selectedColors.outer[0]} />
            <stop offset="100%" stopColor={selectedColors.outer[1]} />
          </linearGradient>

          {/* Gradiente para el hexágono interior */}
          <linearGradient
            id={`hex-inner-${type}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={selectedColors.inner[0]} />
            <stop offset="100%" stopColor={selectedColors.inner[1]} />
          </linearGradient>

          {/* Gradiente radial para la gema central */}
          <radialGradient id={`hex-gem-${type}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor={selectedColors.gem[0]} />
            <stop offset="70%" stopColor={selectedColors.gem[1]} />
            <stop offset="100%" stopColor={selectedColors.outer[1]} />
          </radialGradient>

          {/* Brillo para la gema */}
          <radialGradient id="hex-gem-shine" cx="35%" cy="35%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* Hexágono exterior */}
        <path
          d="M 50 5 L 85 27.5 L 85 72.5 L 50 95 L 15 72.5 L 15 27.5 Z"
          fill={`url(#hex-outer-${type})`}
          stroke={selectedColors.border}
          strokeWidth="2"
        />

        {/* Efecto de bisel - sombra interior */}
        <path
          d="M 50 5 L 85 27.5 L 85 72.5 L 50 95 L 15 72.5 L 15 27.5 Z"
          fill="none"
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="3"
          strokeLinejoin="round"
          style={{ filter: "blur(2px)" }}
        />

        {/* Hexágono interior más pequeño */}
        <path
          d="M 50 15 L 75 30 L 75 70 L 50 85 L 25 70 L 25 30 Z"
          fill={`url(#hex-inner-${type})`}
          stroke={selectedColors.border}
          strokeWidth="1.5"
        />

        {/* Efecto de brillo superior */}
        <path
          d="M 50 15 L 75 30 L 75 50 L 50 35 L 25 50 L 25 30 Z"
          fill="rgba(255,255,255,0.3)"
        />

        {/* Gema central circular */}
        <circle
          cx="50"
          cy="50"
          r="15"
          fill={`url(#hex-gem-${type})`}
          stroke={selectedColors.border}
          strokeWidth="2"
        />

        {/* Brillo en la gema */}
        <circle cx="50" cy="50" r="15" fill="url(#hex-gem-shine)" />

        {/* Brillos decorativos */}
        <circle cx="45" cy="45" r="3" fill="rgba(255,255,255,0.8)" />
        <circle cx="52" cy="48" r="1.5" fill="rgba(255,255,255,0.6)" />
      </svg>
    </div>
  );
}
