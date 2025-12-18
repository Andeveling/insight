"use client";

/**
 * Readiness Requirement Component
 *
 * Displays a single requirement with progress indicator and action link.
 *
 * @feature 009-contextual-reports
 */

import { ArrowRightIcon, CheckCircle2Icon, CircleIcon } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";

import type { Requirement } from "../_schemas/readiness.schema";

interface ReadinessRequirementProps {
	requirement: Requirement;
	className?: string;
}

/**
 * Icon mapping for requirement types
 */
const requirementIcons: Record<string, React.ReactNode> = {
	strengths: (
		<svg
			className="size-5"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
				fill="currentColor"
			/>
		</svg>
	),
	modules: (
		<svg
			className="size-5"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<rect
				x="3"
				y="3"
				width="18"
				height="18"
				rx="2"
				stroke="currentColor"
				strokeWidth="2"
			/>
			<path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
			<path d="M9 21V9" stroke="currentColor" strokeWidth="2" />
		</svg>
	),
	challenges: (
		<svg
			className="size-5"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M12 2L2 7L12 12L22 7L12 2Z"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinejoin="round"
			/>
			<path
				d="M2 17L12 22L22 17"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinejoin="round"
			/>
			<path
				d="M2 12L12 17L22 12"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinejoin="round"
			/>
		</svg>
	),
	xp: (
		<svg
			className="size-5"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
			<path
				d="M12 6V12L16 14"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	),
};

export function ReadinessRequirement({
	requirement,
	className,
}: ReadinessRequirementProps) {
	const { label, current, target, met, actionUrl, icon } = requirement;

	// Calculate progress percentage (0-100)
	const progressPercent = Math.min((current / target) * 100, 100);

	// Get icon or fallback to circle
	const IconComponent =
		icon && requirementIcons[icon] ? (
			requirementIcons[icon]
		) : (
			<CircleIcon className="size-5" />
		);

	const content = (
		<div
			className={cn(
				"group flex items-center gap-4 rounded-xl border p-4 transition-all duration-200",
				met
					? "border-success/30 bg-success/5"
					: "border-border bg-card hover:border-primary/30 hover:bg-muted/50",
				actionUrl && !met && "cursor-pointer",
				className,
			)}
		>
			{/* Status icon */}
			<div
				className={cn(
					"flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors",
					met ? "bg-success/20 text-success" : "bg-muted text-muted-foreground",
				)}
			>
				{met ? <CheckCircle2Icon className="size-5" /> : IconComponent}
			</div>

			{/* Content */}
			<div className="flex-1 space-y-2">
				<div className="flex items-center justify-between">
					<span
						className={cn(
							"font-medium",
							met ? "text-success" : "text-foreground",
						)}
					>
						{label}
					</span>
					<span
						className={cn(
							"text-sm tabular-nums",
							met ? "text-success" : "text-muted-foreground",
						)}
					>
						{current} / {target}
					</span>
				</div>

				{/* Progress bar (only show if not met) */}
				{!met && <Progress value={progressPercent} className="h-2" />}
			</div>

			{/* Action arrow (only for unmet requirements with action) */}
			{actionUrl && !met && (
				<ArrowRightIcon className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
			)}
		</div>
	);

	// Wrap in link if action available and not met
	if (actionUrl && !met) {
		return (
			<Link href={actionUrl} className="block">
				{content}
			</Link>
		);
	}

	return content;
}
