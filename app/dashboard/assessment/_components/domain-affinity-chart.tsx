"use client";

/**
 * DomainAffinityChart Component
 * Horizontal bar chart showing real-time domain scores with color coding per domain
 * User Story 3: View Progress and Domain Affinity
 */

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { DomainScore } from "@/lib/types/assessment.types";

export interface DomainAffinityChartProps {
	/**
	 * Domain scores to display
	 */
	domainScores: Record<string, DomainScore>;
	/**
	 * Show the card wrapper (default: true)
	 */
	showCard?: boolean;
	/**
	 * Compact mode for smaller display
	 */
	compact?: boolean;
	/**
	 * Optional className
	 */
	className?: string;
	/**
	 * Whether to animate bar changes
	 */
	animate?: boolean;
	/**
	 * Show percentage labels
	 */
	showPercentages?: boolean;
}

/**
 * Domain color mapping with gradients
 */
const DOMAIN_STYLES: Record<
	string,
	{ bg: string; gradient: string; text: string; icon: string }
> = {
	doing: {
		bg: "bg-amber-500",
		gradient: "from-amber-400 to-amber-600",
		text: "text-amber-700 dark:text-amber-300",
		icon: "⚡",
	},
	thinking: {
		bg: "bg-blue-500",
		gradient: "from-blue-400 to-blue-600",
		text: "text-blue-700 dark:text-blue-300",
		icon: "💡",
	},
	feeling: {
		bg: "bg-rose-500",
		gradient: "from-rose-400 to-rose-600",
		text: "text-rose-700 dark:text-rose-300",
		icon: "❤️",
	},
	motivating: {
		bg: "bg-emerald-500",
		gradient: "from-emerald-400 to-emerald-600",
		text: "text-emerald-700 dark:text-emerald-300",
		icon: "🚀",
	},
};

/**
 * Domain name translations
 */
const DOMAIN_LABELS: Record<string, string> = {
	doing: "Acción",
	thinking: "Pensamiento",
	feeling: "Sentimiento",
	motivating: "Motivación",
};

/**
 * Get style for a domain, with fallback
 */
function getDomainStyle(domainName: string) {
	const key = domainName.toLowerCase();
	return (
		DOMAIN_STYLES[key] ?? {
			bg: "bg-gray-500",
			gradient: "from-gray-400 to-gray-600",
			text: "text-gray-700 dark:text-gray-300",
			icon: "📊",
		}
	);
}

/**
 * Get translated label for domain
 */
function getDomainLabel(domainName: string): string {
	const key = domainName.toLowerCase();
	return DOMAIN_LABELS[key] ?? domainName;
}

export default function DomainAffinityChart({
	domainScores,
	showCard = true,
	compact = false,
	className,
	animate = true,
	showPercentages = true,
}: DomainAffinityChartProps) {
	// Sort domains by score descending
	const sortedDomains = useMemo(() => {
		return Object.values(domainScores).sort((a, b) => b.score - a.score);
	}, [domainScores]);

	// Find max score for relative bar widths
	const maxScore = useMemo(() => {
		return Math.max(...sortedDomains.map((d) => d.score), 1);
	}, [sortedDomains]);

	// Check if we have any data
	if (sortedDomains.length === 0) {
		return null;
	}

	const content = (
		<div className={cn("space-y-3", compact && "space-y-2")}>
			{sortedDomains.map((domain, index) => {
				const style = getDomainStyle(domain.domainName);
				const relativeWidth = (domain.score / maxScore) * 100;
				const isTop = index === 0 && domain.score > 0;

				return (
					<div
						key={domain.domainId}
						className={cn("space-y-1", compact && "space-y-0.5")}
					>
						{/* Domain label and score */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span className="text-sm" aria-hidden="true">
									{style.icon}
								</span>
								<span
									className={cn(
										"font-medium capitalize",
										compact ? "text-xs" : "text-sm",
										style.text,
									)}
								>
									{getDomainLabel(domain.domainName)}
								</span>
								{isTop && (
									<span className="bg-primary/10 text-primary rounded-full px-1.5 py-0.5 text-[10px] font-medium">
										Principal
									</span>
								)}
							</div>
							{showPercentages && (
								<span
									className={cn(
										"font-semibold",
										compact ? "text-xs" : "text-sm",
									)}
								>
									{Math.round(domain.score)}%
								</span>
							)}
						</div>

						{/* Progress bar */}
						<div
							className={cn(
								"overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800",
								compact ? "h-1.5" : "h-2.5",
							)}
							role="progressbar"
							aria-valuenow={Math.round(domain.score)}
							aria-valuemin={0}
							aria-valuemax={100}
							aria-label={`${getDomainLabel(domain.domainName)}: ${Math.round(
								domain.score,
							)}%`}
						>
							<div
								className={cn(
									"h-full rounded-full bg-linear-to-r",
									style.gradient,
									animate &&
										"animate-bar-grow transition-all duration-500 ease-out",
								)}
								style={{ width: `${relativeWidth}%` }}
							/>
						</div>
					</div>
				);
			})}
		</div>
	);

	if (!showCard) {
		return <div className={className}>{content}</div>;
	}

	return (
		<Card className={cn("overflow-hidden", className)}>
			<CardHeader className={cn("pb-2", compact && "p-3 pb-1")}>
				<CardTitle className={cn(compact ? "text-sm" : "text-base")}>
					Afinidad por dominio
				</CardTitle>
			</CardHeader>
			<CardContent className={cn(compact && "p-3 pt-0")}>{content}</CardContent>
		</Card>
	);
}
