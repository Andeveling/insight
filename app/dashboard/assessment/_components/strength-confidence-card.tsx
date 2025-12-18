"use client";

/**
 * StrengthConfidenceCard Component
 * Individual strength display with confidence score and expandable details
 */

import { ChevronDown, Lightbulb, Star, Target } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/cn";
import type { RankedStrength } from "@/lib/types/assessment.types";

export interface StrengthConfidenceCardProps {
	strength: RankedStrength;
	showRank?: boolean;
	defaultExpanded?: boolean;
}

const RANK_STYLES: Record<number, string> = {
	1: "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-amber-200",
	2: "bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-gray-200",
	3: "bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-amber-300",
	4: "bg-gradient-to-br from-primary/80 to-primary text-primary-foreground",
	5: "bg-gradient-to-br from-primary/60 to-primary/80 text-primary-foreground",
};

const DOMAIN_STYLES: Record<
	string,
	{ bg: string; text: string; border: string }
> = {
	doing: {
		bg: "bg-amber-50 dark:bg-amber-950",
		text: "text-amber-700 dark:text-amber-300",
		border: "border-amber-200 dark:border-amber-800",
	},
	thinking: {
		bg: "bg-blue-50 dark:bg-blue-950",
		text: "text-blue-700 dark:text-blue-300",
		border: "border-blue-200 dark:border-blue-800",
	},
	feeling: {
		bg: "bg-rose-50 dark:bg-rose-950",
		text: "text-rose-700 dark:text-rose-300",
		border: "border-rose-200 dark:border-rose-800",
	},
	motivating: {
		bg: "bg-emerald-50 dark:bg-emerald-950",
		text: "text-emerald-700 dark:text-emerald-300",
		border: "border-emerald-200 dark:border-emerald-800",
	},
	default: {
		bg: "bg-gray-50 dark:bg-gray-900",
		text: "text-gray-700 dark:text-gray-300",
		border: "border-gray-200 dark:border-gray-800",
	},
};

function getConfidenceColor(score: number): string {
	if (score >= 80) return "bg-green-500";
	if (score >= 60) return "bg-amber-500";
	return "bg-red-500";
}

function getConfidenceLabel(score: number): string {
	if (score >= 80) return "Alta confianza";
	if (score >= 60) return "Confianza media";
	return "Necesita confirmación";
}

export default function StrengthConfidenceCard({
	strength,
	showRank = true,
	defaultExpanded = false,
}: StrengthConfidenceCardProps) {
	const [isOpen, setIsOpen] = useState(defaultExpanded);

	const domainKey = strength.domainName.toLowerCase();
	const domainStyle = DOMAIN_STYLES[domainKey] ?? DOMAIN_STYLES.default;
	const rankStyle = RANK_STYLES[strength.rank] ?? RANK_STYLES[5];

	const hasDetails =
		!!strength.description ||
		(strength.developmentTips && strength.developmentTips.length > 0);

	return (
		<Card className={cn("overflow-hidden transition-all", domainStyle.border)}>
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<div className={cn("p-4", domainStyle.bg)}>
					<div className="flex items-start gap-4">
						{/* Rank badge */}
						{showRank && (
							<div
								className={cn(
									"flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-lg",
									rankStyle,
								)}
							>
								{strength.rank === 1 ? (
									<Star className="h-6 w-6" />
								) : (
									<span className="text-lg font-bold">#{strength.rank}</span>
								)}
							</div>
						)}

						{/* Main content */}
						<div className="flex-1 space-y-3">
							{/* Header */}
							<div className="flex items-start justify-between gap-2">
								<div>
									<h3 className="text-lg font-bold">{strength.strengthName}</h3>
									<span
										className={cn(
											"inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize",
											domainStyle.text,
											"bg-white/50 dark:bg-black/20",
										)}
									>
										{strength.domainName}
									</span>
								</div>

								{/* Expand button */}
								{hasDetails && (
									<CollapsibleTrigger asChild>
										<Button variant="ghost" size="sm" className="shrink-0">
											<ChevronDown
												className={cn(
													"h-4 w-4 transition-transform duration-200",
													isOpen && "rotate-180",
												)}
											/>
										</Button>
									</CollapsibleTrigger>
								)}
							</div>

							{/* Confidence score */}
							<div className="space-y-1.5">
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">
										{getConfidenceLabel(strength.confidenceScore)}
									</span>
									<span className="font-semibold">
										{Math.round(strength.confidenceScore)}%
									</span>
								</div>
								<div className="h-2 overflow-hidden rounded-full bg-white/50 dark:bg-black/20">
									<div
										className={cn(
											"h-full rounded-full transition-all duration-500",
											getConfidenceColor(strength.confidenceScore),
										)}
										style={{ width: `${strength.confidenceScore}%` }}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Expandable content */}
				<CollapsibleContent>
					<CardContent className="space-y-6 pt-4">
						{/* Description */}
						{strength.description && (
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Lightbulb className="text-muted-foreground h-4 w-4" />
									<h4 className="text-sm font-semibold">
										Acerca de esta fortaleza
									</h4>
								</div>
								<p className="text-muted-foreground text-sm leading-relaxed">
									{strength.description}
								</p>
							</div>
						)}

						{/* Development tips */}
						{strength.developmentTips &&
							strength.developmentTips.length > 0 && (
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Target className="text-muted-foreground h-4 w-4" />
										<h4 className="text-sm font-semibold">
											Consejos de desarrollo
										</h4>
									</div>
									<ul className="space-y-2">
										{strength.developmentTips.map((tip, index) => (
											<li
												key={index}
												className="text-muted-foreground flex items-start gap-2 text-sm"
											>
												<span className="text-primary mt-1 shrink-0">•</span>
												<span>{tip}</span>
											</li>
										))}
									</ul>
								</div>
							)}

						{/* Low confidence warning */}
						{strength.confidenceScore < 60 && (
							<div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950">
								<p className="text-sm text-amber-800 dark:text-amber-200">
									<strong>Nota:</strong> Esta fortaleza tiene un puntaje de
									confianza bajo. Considera volver a realizar la evaluación o
									explorar esta área más para confirmar si es realmente una de
									tus fortalezas principales.
								</p>
							</div>
						)}
					</CardContent>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
}
