/**
 * Maturity Level Card Component (RSC)
 *
 * Displays a strength with its maturity level, XP progress, and level badge.
 * Uses CyberPunk styling with clip-paths and layered borders.
 */

import { cn } from "@/lib/cn";
import { LEVEL_METADATA } from "@/lib/constants/strength-levels.constants";
import type { MaturityLevel } from "@/lib/types/strength-levels.types";
import type { StrengthMaturityProgress } from "@/specs/012-strength-levels/contracts/get-maturity-levels.schema";
import { LevelBadge } from "./level-badge";
import { XpProgressBar } from "./xp-progress-bar";

interface MaturityLevelCardProps {
	maturityLevel: StrengthMaturityProgress;
	className?: string;
}

const CARD_CLIP_PATH =
	"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";

export function MaturityLevelCard({
	maturityLevel,
	className,
}: MaturityLevelCardProps) {
	const {
		strengthName,
		strengthNameEs,
		currentLevel,
		xpCurrent,
		progressPercent,
		isMaxLevel,
	} = maturityLevel;

	const levelMetadata = LEVEL_METADATA[currentLevel as MaturityLevel];
	const displayName = strengthNameEs || strengthName;

	return (
		<div
			className={cn("group relative", className)}
			data-testid="maturity-level-card"
		>
			{/* Outer Border Layer */}
			<div
				className="p-px transition-colors duration-300"
				style={{
					clipPath: CARD_CLIP_PATH,
					backgroundColor: `${levelMetadata.color}30`,
				}}
			>
				{/* Inner Content Layer */}
				<div
					className="relative bg-background/90 backdrop-blur-md p-4 transition-all duration-300 group-hover:bg-background/95"
					style={{ clipPath: CARD_CLIP_PATH }}
				>
					{/* Background Grid */}
					<div className="absolute inset-0 bg-grid-tech opacity-5" />

					{/* Content */}
					<div className="relative z-10">
						{/* Header: Strength Name + Level Badge */}
						<div className="flex items-start justify-between gap-3 mb-4">
							<div className="flex-1 min-w-0">
								{/* Strength Name */}
								<h3 className="text-sm font-bold uppercase tracking-widest text-foreground truncate">
									{displayName}
								</h3>

								{/* Level Label */}
								<p
									className="text-xs font-medium mt-0.5 uppercase tracking-wider"
									style={{ color: levelMetadata.color }}
								>
									{levelMetadata.name}
								</p>
							</div>

							{/* Level Badge */}
							<LevelBadge
								level={currentLevel as MaturityLevel}
								size="sm"
								showLabel={false}
							/>
						</div>

						{/* XP Progress Bar */}
						<XpProgressBar
							currentXp={xpCurrent}
							currentLevel={currentLevel as MaturityLevel}
							progressPercent={progressPercent}
							isMaxLevel={isMaxLevel}
							size="sm"
						/>

						{/* Max Level Indicator */}
						{isMaxLevel && (
							<div
								className="mt-3 py-1 px-2 text-center text-[10px] font-bold uppercase tracking-widest border"
								style={{
									color: levelMetadata.color,
									borderColor: `${levelMetadata.color}40`,
									clipPath:
										"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
								}}
							>
								✦ MAESTRÍA ALCANZADA ✦
							</div>
						)}
					</div>

					{/* Corner Accent */}
					<div
						className="absolute top-0 left-0 w-6 h-6"
						style={{
							background: `linear-gradient(135deg, ${levelMetadata.color}40 50%, transparent 50%)`,
						}}
					/>

					{/* Bottom Right Corner */}
					<div
						className="absolute bottom-0 right-0 w-4 h-4"
						style={{
							background: `linear-gradient(-45deg, ${levelMetadata.color}20 50%, transparent 50%)`,
						}}
					/>
				</div>
			</div>
		</div>
	);
}
