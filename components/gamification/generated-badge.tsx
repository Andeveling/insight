"use client";

import type { LucideIcon } from "lucide-react";
import {
	Award,
	BookOpen,
	Flame,
	Heart,
	Lightbulb,
	Lock,
	MessageSquare,
	Rocket,
	Shield,
	Sparkles,
	Star,
	Swords,
	Target,
	Trophy,
	Users,
	Zap,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { DOMAIN_COLORS } from "@/lib/constants/domain-colors";

interface GeneratedBadgeProps {
	badgeKey: string;
	tier: "bronze" | "silver" | "gold" | "platinum";
	iconUrl?: string;
	isUnlocked?: boolean;
	className?: string;
	size?: "sm" | "md" | "lg" | "xl";
}

// Map badge keys to domains/colors and icons
const getBadgeConfig = (key: string, iconUrl?: string) => {
	// Default config
	let domain: keyof typeof DOMAIN_COLORS = "Motivating";
	let Icon: LucideIcon = Award;
	let isEmoji = false;

	// Check if iconUrl is an emoji (simple check: short string, no slash/dot)
	if (iconUrl && !iconUrl.includes("/") && !iconUrl.includes(".")) {
		isEmoji = true;
	}

	// Determine domain and icon based on key patterns
	if (key.includes("xp-") || key.includes("level-")) {
		domain = "Motivating"; // Growth/Leadership
		Icon = Trophy;
		if (key.includes("level")) Icon = Star;
	} else if (
		key.includes("module") ||
		key.includes("report") ||
		key.includes("insight")
	) {
		domain = "Thinking"; // Learning/Analysis
		Icon = BookOpen;
		if (key.includes("report")) Icon = Lightbulb;
	} else if (key.includes("challenge") || key.includes("streak")) {
		domain = "Doing"; // Action/Execution
		Icon = Target;
		if (key.includes("streak")) Icon = Flame;
		if (key.includes("challenge")) Icon = Swords;
	} else if (
		key.includes("collab") ||
		key.includes("feedback") ||
		key.includes("listener")
	) {
		domain = "Feeling"; // Social/Connection
		Icon = Users;
		if (key.includes("feedback")) Icon = MessageSquare;
		if (key.includes("listener")) Icon = Heart;
	}

	return { domain, Icon, isEmoji };
};

const tierColors = {
	bronze: {
		main: "#d97706", // amber-600
		light: "#fbbf24", // amber-400
		dark: "#92400e", // amber-800
		shadow: "rgba(217, 119, 6, 0.4)",
	},
	silver: {
		main: "#94a3b8", // slate-400
		light: "#cbd5e1", // slate-300
		dark: "#475569", // slate-600
		shadow: "rgba(148, 163, 184, 0.4)",
	},
	gold: {
		main: "#eab308", // yellow-500
		light: "#fde047", // yellow-300
		dark: "#a16207", // yellow-700
		shadow: "rgba(234, 179, 8, 0.4)",
	},
	platinum: {
		main: "#06b6d4", // cyan-500
		light: "#67e8f9", // cyan-300
		dark: "#0e7490", // cyan-700
		shadow: "rgba(6, 182, 212, 0.4)",
	},
};

export function GeneratedBadge({
	badgeKey,
	tier,
	iconUrl,
	isUnlocked = true,
	className,
	size = "md",
}: GeneratedBadgeProps) {
	const { domain, Icon, isEmoji } = getBadgeConfig(badgeKey, iconUrl);
	const domainColor = DOMAIN_COLORS[domain];
	const tierColor = tierColors[tier];

	const sizeClasses = {
		sm: "w-12 h-12",
		md: "w-20 h-20",
		lg: "w-32 h-32",
		xl: "w-48 h-48",
	};

	const iconSizes = {
		sm: 20,
		md: 32,
		lg: 48,
		xl: 64,
	};

	const emojiSizes = {
		sm: "text-lg",
		md: "text-3xl",
		lg: "text-5xl",
		xl: "text-7xl",
	};

	return (
		<div
			className={cn(
				"relative flex items-center justify-center select-none transition-all duration-300",
				sizeClasses[size],
				!isUnlocked && "grayscale opacity-70",
				className,
			)}
		>
			{/* Glow Effect (only if unlocked) */}
			{isUnlocked && (
				<div
					className="absolute inset-0 rounded-full blur-xl opacity-50 animate-pulse"
					style={{ backgroundColor: domainColor.primary }}
				/>
			)}

			<svg
				viewBox="0 0 100 100"
				className="w-full h-full drop-shadow-lg relative z-10"
			>
				<defs>
					{/* Tier Gradient (Frame) */}
					<linearGradient
						id={`grad-tier-${tier}`}
						x1="0%"
						y1="0%"
						x2="100%"
						y2="100%"
					>
						<stop offset="0%" stopColor={tierColor.light} />
						<stop offset="50%" stopColor={tierColor.main} />
						<stop offset="100%" stopColor={tierColor.dark} />
					</linearGradient>

					{/* Domain Gradient (Background) */}
					<radialGradient
						id={`grad-domain-${domain}`}
						cx="50%"
						cy="50%"
						r="50%"
					>
						<stop offset="0%" stopColor={domainColor.light} stopOpacity="0.9" />
						<stop
							offset="70%"
							stopColor={domainColor.primary}
							stopOpacity="0.8"
						/>
						<stop offset="100%" stopColor={domainColor.dark} stopOpacity="1" />
					</radialGradient>

					{/* Shine Effect */}
					<linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="white" stopOpacity="0.4" />
						<stop offset="50%" stopColor="white" stopOpacity="0.1" />
						<stop offset="100%" stopColor="white" stopOpacity="0" />
					</linearGradient>
				</defs>

				{/* Outer Frame (Hexagon-ish or Shield-ish based on tier?) Let's do a complex circle/shield hybrid */}
				<path
					d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z"
					fill={`url(#grad-domain-${domain})`}
					stroke={`url(#grad-tier-${tier})`}
					strokeWidth="4"
					className="drop-shadow-md"
				/>

				{/* Inner Detail Ring */}
				<circle
					cx="50"
					cy="50"
					r="32"
					fill="none"
					stroke={`url(#grad-tier-${tier})`}
					strokeWidth="2"
					strokeDasharray="4 2"
					opacity="0.6"
				/>

				{/* Shine Overlay */}
				<path
					d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z"
					fill="url(#shine)"
					style={{ mixBlendMode: "overlay" }}
				/>
			</svg>

			{/* Icon Container */}
			<div className="absolute inset-0 flex items-center justify-center z-20">
				{isEmoji ? (
					<span className={cn("drop-shadow-md", emojiSizes[size])}>
						{iconUrl}
					</span>
				) : (
					<Icon
						size={iconSizes[size]}
						className="text-white drop-shadow-md"
						strokeWidth={2}
					/>
				)}
			</div>

			{/* Lock Overlay for Locked State */}
			{!isUnlocked && (
				<div className="absolute inset-0 flex items-center justify-center z-30 bg-black/40 rounded-full backdrop-blur-[1px]">
					<Lock className="text-white/80 w-1/3 h-1/3" />
				</div>
			)}
		</div>
	);
}
