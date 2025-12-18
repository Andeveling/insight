"use client";

/**
 * ResultsSummary Component
 * Displays top 5 strengths overview with confidence scores
 */

import { Star, TrendingUp, Trophy } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";
import type {
	AssessmentResults,
	RankedStrength,
} from "@/lib/types/assessment.types";

export interface ResultsSummaryProps {
	results: AssessmentResults;
	onStrengthClick?: (strength: RankedStrength) => void;
}

const RANK_COLORS = [
	"bg-amber-500", // 1st - Gold
	"bg-gray-400", // 2nd - Silver
	"bg-amber-700", // 3rd - Bronze
	"bg-primary", // 4th
	"bg-primary/70", // 5th
];

const CONFIDENCE_LABELS = {
	high: {
		label: "Alta confianza",
		color: "text-green-600 dark:text-green-400",
	},
	medium: {
		label: "Confianza media",
		color: "text-amber-600 dark:text-amber-400",
	},
	low: { label: "Baja confianza", color: "text-red-600 dark:text-red-400" },
};

function getConfidenceLevel(score: number): "high" | "medium" | "low" {
	if (score >= 80) return "high";
	if (score >= 60) return "medium";
	return "low";
}

export default function ResultsSummary({
	results,
	onStrengthClick,
}: ResultsSummaryProps) {
	const topStrengths = results.rankedStrengths.slice(0, 5);
	const overallConfidence = results.overallConfidence;
	const overallConfidenceLevel = getConfidenceLevel(overallConfidence);

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="space-y-4 text-center">
				<div className="bg-primary/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full">
					<Trophy className="text-primary h-10 w-10" />
				</div>
				<h1 className="text-3xl font-bold">Tus 5 fortalezas principales</h1>
				<p className="text-muted-foreground text-lg">
					Descubre las habilidades únicas que definen tu potencial
				</p>
			</div>

			{/* Overall confidence */}
			<Card className="border-primary/20 bg-primary/5">
				<CardContent className="py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<TrendingUp className="text-primary h-5 w-5" />
							<span className="font-medium">Confianza general</span>
						</div>
						<div className="flex items-center gap-2">
							<span
								className={cn(
									"text-sm font-medium",
									CONFIDENCE_LABELS[overallConfidenceLevel].color,
								)}
							>
								{CONFIDENCE_LABELS[overallConfidenceLevel].label}
							</span>
							<span className="font-bold">
								{Math.round(overallConfidence)}%
							</span>
						</div>
					</div>
					<Progress value={overallConfidence} className="mt-3 h-2" />
				</CardContent>
			</Card>

			{/* Top 5 strengths */}
			<div className="space-y-4">
				{topStrengths.map((strength, index) => {
					const confidenceLevel = getConfidenceLevel(strength.confidenceScore);
					const isClickable = !!onStrengthClick;

					return (
						<Card
							key={strength.strengthId}
							className={cn(
								"transition-all duration-200",
								isClickable &&
									"cursor-pointer hover:shadow-md hover:border-primary/50",
							)}
							onClick={() => onStrengthClick?.(strength)}
						>
							<CardContent className="py-4">
								<div className="flex items-start gap-4">
									{/* Rank badge */}
									<div
										className={cn(
											"flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white",
											RANK_COLORS[index],
										)}
									>
										{index === 0 ? (
											<Star className="h-6 w-6" />
										) : (
											<span className="text-lg font-bold">{strength.rank}</span>
										)}
									</div>

									{/* Strength info */}
									<div className="flex-1 space-y-2">
										<div className="flex items-start justify-between gap-2">
											<div>
												<h3 className="text-lg font-semibold">
													{strength.strengthName}
												</h3>
												<p className="text-muted-foreground text-sm">
													Dominio: {strength.domainName}
												</p>
											</div>
											<div className="text-right">
												<p
													className={cn(
														"text-sm font-medium",
														CONFIDENCE_LABELS[confidenceLevel].color,
													)}
												>
													{Math.round(strength.confidenceScore)}%
												</p>
												<p className="text-muted-foreground text-xs">
													confianza
												</p>
											</div>
										</div>

										{/* Confidence bar */}
										<div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
											<div
												className={cn(
													"h-full rounded-full transition-all duration-500",
													confidenceLevel === "high"
														? "bg-green-500"
														: confidenceLevel === "medium"
															? "bg-amber-500"
															: "bg-red-500",
												)}
												style={{ width: `${strength.confidenceScore}%` }}
											/>
										</div>

										{/* Description preview */}
										{strength.description && (
											<p className="text-muted-foreground line-clamp-2 text-sm">
												{strength.description}
											</p>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Recommendations section */}
			{results.recommendations && results.recommendations.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Recomendaciones</CardTitle>
						<CardDescription>
							Formas de aprovechar y desarrollar tus fortalezas
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							{results.recommendations.map((recommendation, index) => (
								<li key={index} className="flex items-start gap-2">
									<span className="text-primary mt-1">•</span>
									<span className="text-muted-foreground text-sm">
										{recommendation}
									</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
