/**
 * Gap Analysis Component
 *
 * Displays strength gaps and recommendations for team improvement.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_components/gap-analysis
 */

"use client";

import { useState } from "react";
import {
	AlertTriangle,
	ChevronDown,
	ChevronUp,
	Info,
	Lightbulb,
	Target,
	UserPlus,
} from "lucide-react";

import { cn } from "@/lib/cn";
import type { StrengthGap, SubTeamMember } from "@/lib/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface GapAnalysisProps {
	gaps: StrengthGap[];
	recommendations: string[];
	suggestedMembers?: SuggestedMemberForGap[];
	onAddMember?: (memberId: string) => void;
	className?: string;
	defaultOpen?: boolean;
	compact?: boolean;
}

/**
 * Suggested member that can fill a gap
 */
export interface SuggestedMemberForGap {
	member: SubTeamMember;
	fillsGaps: string[]; // Strength names this member can fill
	scoreDelta: number; // Estimated score improvement
}

/**
 * Priority configuration for display
 */
const PRIORITY_CONFIG = {
	critical: {
		label: "Crítico",
		color: "text-red-600 dark:text-red-400",
		bgColor: "bg-red-500/10 border-red-500/20",
		badgeColor: "bg-red-500/20 text-red-700 dark:text-red-300",
		icon: AlertTriangle,
	},
	recommended: {
		label: "Recomendado",
		color: "text-amber-600 dark:text-amber-400",
		bgColor: "bg-amber-500/10 border-amber-500/20",
		badgeColor: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
		icon: Target,
	},
	optional: {
		label: "Opcional",
		color: "text-blue-600 dark:text-blue-400",
		bgColor: "bg-blue-500/10 border-blue-500/20",
		badgeColor: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
		icon: Info,
	},
};

/**
 * Gap Analysis Component
 *
 * Displays:
 * - List of missing strengths with priorities
 * - Reason and impact for each gap
 * - Recommendations for improvement
 * - Suggested members to add (optional)
 */
export function GapAnalysis({
	gaps,
	recommendations,
	suggestedMembers = [],
	onAddMember,
	className,
	defaultOpen = false,
	compact = false,
}: GapAnalysisProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	// Group gaps by priority
	const criticalGaps = gaps.filter((g) => g.priority === "critical");
	const recommendedGaps = gaps.filter((g) => g.priority === "recommended");
	const optionalGaps = gaps.filter((g) => g.priority === "optional");

	// Summary counts
	const totalGaps = gaps.length;
	const hasGaps = totalGaps > 0;

	if (compact) {
		return (
			<CompactGapSummary
				criticalCount={criticalGaps.length}
				recommendedCount={recommendedGaps.length}
				optionalCount={optionalGaps.length}
				className={className}
			/>
		);
	}

	return (
		<Card className={cn("overflow-hidden", className)}>
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CollapsibleTrigger asChild>
					<CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<CardTitle className="text-base">Análisis de Brechas</CardTitle>
								{hasGaps && (
									<Badge variant="secondary" className="font-normal">
										{totalGaps} {totalGaps === 1 ? "brecha" : "brechas"}
									</Badge>
								)}
							</div>
							<div className="flex items-center gap-2">
								{/* Priority summary badges */}
								{criticalGaps.length > 0 && (
									<Badge
										className={cn(
											"text-xs",
											PRIORITY_CONFIG.critical.badgeColor,
										)}
									>
										{criticalGaps.length} crítico
										{criticalGaps.length > 1 ? "s" : ""}
									</Badge>
								)}
								<Button variant="ghost" size="sm" className="h-6 w-6 p-0">
									{isOpen ? (
										<ChevronUp className="h-4 w-4" />
									) : (
										<ChevronDown className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>
						{!isOpen && hasGaps && (
							<CardDescription className="mt-1">
								{criticalGaps.length > 0
									? `${criticalGaps.length} fortaleza${
											criticalGaps.length > 1 ? "s" : ""
										} crítica${criticalGaps.length > 1 ? "s" : ""} faltante${
											criticalGaps.length > 1 ? "s" : ""
										}`
									: "Sin brechas críticas"}
							</CardDescription>
						)}
					</CardHeader>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<CardContent className="space-y-6">
						{/* No gaps message */}
						{!hasGaps && (
							<div className="text-center py-4">
								<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-3">
									<Target className="h-6 w-6 text-green-600" />
								</div>
								<p className="text-sm text-muted-foreground">
									¡Excelente! El equipo cubre todas las fortalezas ideales para
									este tipo de proyecto.
								</p>
							</div>
						)}

						{/* Gap Sections by Priority */}
						{criticalGaps.length > 0 && (
							<GapSection
								title="Brechas Críticas"
								gaps={criticalGaps}
								priority="critical"
							/>
						)}

						{recommendedGaps.length > 0 && (
							<GapSection
								title="Brechas Recomendadas"
								gaps={recommendedGaps}
								priority="recommended"
							/>
						)}

						{optionalGaps.length > 0 && (
							<GapSection
								title="Brechas Opcionales"
								gaps={optionalGaps}
								priority="optional"
							/>
						)}

						{/* Recommendations */}
						{recommendations.length > 0 && (
							<div className="border-t pt-4">
								<div className="flex items-center gap-2 mb-3">
									<Lightbulb className="h-4 w-4 text-amber-500" />
									<h4 className="text-sm font-medium">Recomendaciones</h4>
								</div>
								<ul className="space-y-2">
									{recommendations.map((rec, index) => (
										<li
											key={index}
											className="text-sm text-muted-foreground flex items-start gap-2"
										>
											<span className="text-primary mt-0.5">•</span>
											<span>{rec}</span>
										</li>
									))}
								</ul>
							</div>
						)}

						{/* Suggested Members */}
						{suggestedMembers.length > 0 && onAddMember && (
							<div className="border-t pt-4">
								<div className="flex items-center gap-2 mb-3">
									<UserPlus className="h-4 w-4 text-green-500" />
									<h4 className="text-sm font-medium">Miembros Sugeridos</h4>
								</div>
								<div className="space-y-2">
									{suggestedMembers.slice(0, 3).map((suggestion) => (
										<SuggestedMemberCard
											key={suggestion.member.id}
											suggestion={suggestion}
											onAdd={() => onAddMember(suggestion.member.id)}
										/>
									))}
								</div>
							</div>
						)}
					</CardContent>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
}

/**
 * Section for gaps of a specific priority
 */
interface GapSectionProps {
	title: string;
	gaps: StrengthGap[];
	priority: "critical" | "recommended" | "optional";
}

function GapSection({ title, gaps, priority }: GapSectionProps) {
	const config = PRIORITY_CONFIG[priority];
	const Icon = config.icon;

	return (
		<div>
			<div className="flex items-center gap-2 mb-3">
				<Icon className={cn("h-4 w-4", config.color)} />
				<h4 className="text-sm font-medium">{title}</h4>
			</div>
			<div className="space-y-2">
				{gaps.map((gap, index) => (
					<GapItem key={index} gap={gap} priority={priority} />
				))}
			</div>
		</div>
	);
}

/**
 * Individual gap item
 */
interface GapItemProps {
	gap: StrengthGap;
	priority: "critical" | "recommended" | "optional";
}

function GapItem({ gap, priority }: GapItemProps) {
	const config = PRIORITY_CONFIG[priority];

	return (
		<div className={cn("p-3 rounded-lg border", config.bgColor)}>
			<div className="flex items-start justify-between gap-2">
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-1">
						<span className={cn("font-medium text-sm", config.color)}>
							{gap.strengthNameEs || gap.strengthName}
						</span>
						{gap.domainNameEs && (
							<Badge variant="outline" className="text-xs">
								{gap.domainNameEs}
							</Badge>
						)}
					</div>
					<p className="text-xs text-muted-foreground">{gap.reason}</p>
				</div>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div
								className={cn(
									"shrink-0 text-xs px-2 py-0.5 rounded",
									config.badgeColor,
								)}
							>
								{config.label}
							</div>
						</TooltipTrigger>
						<TooltipContent side="left" className="max-w-xs">
							<p className="text-xs">{gap.impact}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
}

/**
 * Suggested member card with add action
 */
interface SuggestedMemberCardProps {
	suggestion: SuggestedMemberForGap;
	onAdd: () => void;
}

function SuggestedMemberCard({ suggestion, onAdd }: SuggestedMemberCardProps) {
	const { member, fillsGaps, scoreDelta } = suggestion;

	return (
		<div className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
			<div className="flex items-center gap-3 min-w-0">
				<div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
					<span className="text-xs font-medium">
						{member.name?.charAt(0).toUpperCase() || "?"}
					</span>
				</div>
				<div className="min-w-0">
					<p className="text-sm font-medium truncate">{member.name}</p>
					<p className="text-xs text-muted-foreground truncate">
						Cubre: {fillsGaps.join(", ")}
					</p>
				</div>
			</div>
			<div className="flex items-center gap-2 shrink-0">
				{scoreDelta > 0 && (
					<span className="text-xs text-green-600 font-medium">
						+{scoreDelta} pts
					</span>
				)}
				<Button
					size="sm"
					variant="outline"
					onClick={onAdd}
					className="h-7 text-xs"
				>
					Agregar
				</Button>
			</div>
		</div>
	);
}

/**
 * Compact summary for forms/cards
 */
interface CompactGapSummaryProps {
	criticalCount: number;
	recommendedCount: number;
	optionalCount: number;
	className?: string;
}

function CompactGapSummary({
	criticalCount,
	recommendedCount,
	optionalCount,
	className,
}: CompactGapSummaryProps) {
	const total = criticalCount + recommendedCount + optionalCount;

	if (total === 0) {
		return (
			<div
				className={cn(
					"flex items-center gap-2 text-sm text-green-600",
					className,
				)}
			>
				<Target className="h-4 w-4" />
				<span>Sin brechas</span>
			</div>
		);
	}

	return (
		<div className={cn("flex items-center gap-2", className)}>
			{criticalCount > 0 && (
				<Badge className={PRIORITY_CONFIG.critical.badgeColor}>
					{criticalCount} crítico{criticalCount > 1 ? "s" : ""}
				</Badge>
			)}
			{recommendedCount > 0 && (
				<Badge className={PRIORITY_CONFIG.recommended.badgeColor}>
					{recommendedCount} rec.
				</Badge>
			)}
			{optionalCount > 0 && (
				<Badge className={PRIORITY_CONFIG.optional.badgeColor}>
					{optionalCount} opc.
				</Badge>
			)}
		</div>
	);
}
