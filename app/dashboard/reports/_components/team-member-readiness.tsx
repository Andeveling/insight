"use client";

/**
 * TeamMemberReadiness Component
 *
 * Displays a single team member's readiness status with avatar, name, and progress.
 * Used in the team readiness breakdown list.
 *
 * @feature 009-contextual-reports
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";

import type { TeamMemberReadiness as TeamMemberReadinessData } from "../_schemas/readiness.schema";

interface TeamMemberReadinessProps {
	member: TeamMemberReadinessData;
	/** Whether to show detailed progress */
	showDetails?: boolean;
}

/**
 * Get initials from a name
 */
function getInitials(name: string): string {
	return name
		.split(" ")
		.map((word) => word[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

/**
 * Get status color based on readiness score
 */
function getStatusColor(score: number): string {
	if (score >= 100) return "text-success";
	if (score >= 75) return "text-chart-2";
	if (score >= 50) return "text-warning";
	return "text-muted-foreground";
}

/**
 * Get progress bar color based on readiness score
 */
function getProgressColor(score: number): string {
	if (score >= 100) return "[&>div]:bg-success";
	if (score >= 75) return "[&>div]:bg-chart-2";
	if (score >= 50) return "[&>div]:bg-warning";
	return "[&>div]:bg-muted";
}

export function TeamMemberReadiness({
	member,
	showDetails = true,
}: TeamMemberReadinessProps) {
	const { userName, userAvatar, individualScore, isReady } = member;

	return (
		<div className="flex items-center gap-4 py-3">
			{/* Avatar */}
			<Avatar className="h-10 w-10 border">
				<AvatarImage src={userAvatar} alt={userName} />
				<AvatarFallback className="bg-muted text-sm">
					{getInitials(userName)}
				</AvatarFallback>
			</Avatar>

			{/* Name and Progress */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between gap-2 mb-1">
					<span className="text-sm font-medium truncate">{userName}</span>
					<span
						className={cn(
							"text-sm font-semibold tabular-nums",
							getStatusColor(individualScore),
						)}
					>
						{individualScore}%
					</span>
				</div>

				{showDetails && (
					<Progress
						value={individualScore}
						className={cn("h-2", getProgressColor(individualScore))}
					/>
				)}
			</div>

			{/* Ready badge */}
			{isReady && (
				<div className="flex-shrink-0">
					<span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-success/20 text-success text-xs">
						✓
					</span>
				</div>
			)}
		</div>
	);
}
