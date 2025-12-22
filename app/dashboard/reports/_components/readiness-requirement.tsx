"use client";

import {
	ArrowRightIcon,
	CheckCircle2Icon,
	CircleIcon,
	Activity,
	Box,
	Zap,
	Target,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Requirement } from "../_schemas/readiness.schema";

interface ReadinessRequirementProps {
	requirement: Requirement;
	className?: string;
}

/**
 * Icon mapping for requirement types with technical style
 */
const requirementIcons: Record<string, React.ReactNode> = {
	strengths: <Target className="size-4" />,
	modules: <Box className="size-4" />,
	challenges: <Activity className="size-4" />,
	xp: <Zap className="size-4" />,
};

export function ReadinessRequirement({
	requirement,
	className,
}: ReadinessRequirementProps) {
	const { label, current, target, met, actionUrl, icon } = requirement;

	// Calculate progress percentage (0-100)
	const progressPercent = Math.min((current / target) * 100, 100);

	// Get icon or fallback
	const IconComponent =
		icon && requirementIcons[icon] ? (
			requirementIcons[icon]
		) : (
			<CircleIcon className="size-4" />
		);

	const clipPath8 =
		"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";
	const clipHex = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

	const content = (
		<div
			className={cn(
				"group relative p-px transition-all duration-300",
				met ? "bg-emerald-500/30" : "bg-border/40 hover:bg-primary/30",
				className,
			)}
			style={{ clipPath: clipPath8 }}
		>
			<div
				className={cn(
					"bg-background/95 p-4 flex items-center gap-4 relative overflow-hidden",
					met && "bg-emerald-500/5",
				)}
				style={{ clipPath: clipPath8 }}
			>
				{/* Status icon with HEX background */}
				<div className="relative size-10 shrink-0 flex items-center justify-center">
					<div
						className={cn(
							"absolute inset-0 transition-all duration-500",
							met ? "bg-emerald-500" : "bg-border/40 group-hover:bg-primary/50",
						)}
						style={{ clipPath: clipHex }}
					/>
					<div
						className={cn(
							"absolute inset-[1px] bg-background/95 flex items-center justify-center transition-all duration-500",
							met
								? "text-emerald-500"
								: "text-muted-foreground group-hover:text-primary",
						)}
						style={{ clipPath: clipHex }}
					>
						{met ? <CheckCircle2Icon className="size-5" /> : IconComponent}
					</div>
				</div>

				{/* Content area */}
				<div className="flex-1 space-y-3">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<span
								className={cn(
									"text-[10px] font-black uppercase tracking-widest",
									met ? "text-emerald-500" : "text-foreground/80",
								)}
							>
								{label}
							</span>
							<p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/40">
								NODE_ADAPTATION_INDEX
							</p>
						</div>
						<div className="flex flex-col items-end">
							<span
								className={cn(
									"text-xs font-black tracking-widest tabular-nums",
									met ? "text-emerald-500" : "text-muted-foreground",
								)}
							>
								{current} <span className="opacity-40">/</span> {target}
							</span>
						</div>
					</div>

					{/* Custom Technical Progress Bar */}
					{!met && (
						<div
							className="h-1.5 w-full bg-muted/20 relative overflow-hidden"
							style={{
								clipPath:
									"polygon(0 0, 100% 0, 100% 100%, 1.5px 100%, 0 calc(100% - 1.5px))",
							}}
						>
							<div
								className="h-full bg-primary transition-all duration-1000 ease-out relative"
								style={{ width: `${progressPercent}%` }}
							>
								<div
									className="absolute inset-0 bg-white/20 animate-shimmer"
									style={{ backgroundSize: "200% 100%" }}
								/>
							</div>
						</div>
					)}
				</div>

				{/* Action arrow */}
				{actionUrl && !met && (
					<div className="pt-1">
						<ArrowRightIcon className="size-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
					</div>
				)}

				{/* Background detail */}
				<div className="absolute -right-2 -bottom-2 opacity-5 pointer-events-none">
					<Activity className="size-12" />
				</div>
			</div>
		</div>
	);

	// Wrap in link if action available and not met
	if (actionUrl && !met) {
		return (
			<Link href={actionUrl} className="block group">
				{content}
			</Link>
		);
	}

	return content;
}
