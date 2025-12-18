"use client";

import { motion } from "motion/react";
import {
	CheckCircle2,
	Circle,
	MessageSquare,
	Lightbulb,
	Users,
	Trophy,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";

interface Challenge {
	id: string;
	key: string;
	titleEs: string;
	descriptionEs: string;
	type: "reflection" | "action" | "collaboration";
	xpReward: number;
	isCompleted: boolean;
	completedAt: Date | null;
}

interface ChallengeListProps {
	challenges: Challenge[];
	onComplete?: (challengeId: string) => void;
	isLoading?: boolean;
	className?: string;
}

/**
 * Challenge List Component
 *
 * Displays a list of challenges within a module with completion status
 * and type indicators.
 */
export function ChallengeList({
	challenges,
	onComplete,
	isLoading = false,
	className,
}: ChallengeListProps) {
	const completedCount = challenges.filter((c) => c.isCompleted).length;
	const totalXp = challenges.reduce((sum, c) => sum + c.xpReward, 0);
	const earnedXp = challenges
		.filter((c) => c.isCompleted)
		.reduce((sum, c) => sum + c.xpReward, 0);

	return (
		<div className={cn("space-y-4", className)}>
			{/* Summary Header */}
			<div className="flex items-center justify-between text-sm">
				<span className="text-muted-foreground">
					{completedCount} de {challenges.length} desafíos completados
				</span>
				<span className="flex items-center gap-1 font-medium">
					<Trophy className="h-4 w-4 text-amber-500" />
					{earnedXp} / {totalXp} XP
				</span>
			</div>

			{/* Challenge Items */}
			<div className="space-y-3">
				{challenges.map((challenge, index) => (
					<ChallengeItem
						key={challenge.id}
						challenge={challenge}
						index={index}
						onComplete={onComplete}
						isLoading={isLoading}
					/>
				))}
			</div>
		</div>
	);
}

/**
 * Individual Challenge Item
 */
function ChallengeItem({
	challenge,
	index,
	onComplete,
	isLoading,
}: {
	challenge: Challenge;
	index: number;
	onComplete?: (challengeId: string) => void;
	isLoading?: boolean;
}) {
	const typeConfig = {
		reflection: {
			icon: MessageSquare,
			label: "Reflexión",
			color: "text-blue-500",
			bgColor: "bg-blue-100 dark:bg-blue-900/30",
		},
		action: {
			icon: Lightbulb,
			label: "Acción",
			color: "text-amber-500",
			bgColor: "bg-amber-100 dark:bg-amber-900/30",
		},
		collaboration: {
			icon: Users,
			label: "Colaboración",
			color: "text-green-500",
			bgColor: "bg-green-100 dark:bg-green-900/30",
		},
	};

	const config = typeConfig[challenge.type];
	const TypeIcon = config.icon;

	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: index * 0.05 }}
			className={cn(
				"group flex items-start gap-3 rounded-lg border p-4 transition-all",
				challenge.isCompleted
					? "bg-muted/50 border-muted"
					: "hover:border-primary/50 hover:shadow-sm cursor-pointer",
			)}
			onClick={() => {
				if (!challenge.isCompleted && !isLoading && onComplete) {
					onComplete(challenge.id);
				}
			}}
		>
			{/* Completion Checkbox */}
			<div className="shrink-0 pt-0.5">
				{challenge.isCompleted ? (
					<CheckCircle2 className="h-5 w-5 text-green-500" />
				) : (
					<Circle
						className={cn(
							"h-5 w-5 text-muted-foreground/50",
							"group-hover:text-primary transition-colors",
						)}
					/>
				)}
			</div>

			{/* Content */}
			<div className="flex-1 min-w-0 space-y-2">
				<div className="flex items-start justify-between gap-2">
					<h4
						className={cn(
							"font-medium text-sm",
							challenge.isCompleted && "line-through text-muted-foreground",
						)}
					>
						{challenge.titleEs}
					</h4>
					<Badge variant="outline" className={cn("shrink-0", config.bgColor)}>
						<TypeIcon className={cn("h-3 w-3 mr-1", config.color)} />
						{config.label}
					</Badge>
				</div>

				<p
					className={cn(
						"text-sm text-muted-foreground",
						challenge.isCompleted && "line-through",
					)}
				>
					{challenge.descriptionEs}
				</p>

				{/* XP Reward */}
				<div className="flex items-center gap-2 text-xs">
					<span
						className={cn(
							"flex items-center gap-1",
							challenge.isCompleted
								? "text-green-600 dark:text-green-400"
								: "text-muted-foreground",
						)}
					>
						<Trophy className="h-3 w-3" />
						{challenge.isCompleted ? "+" : ""}
						{challenge.xpReward} XP
					</span>
					{challenge.completedAt && (
						<span className="text-muted-foreground">
							• Completado el{" "}
							{new Date(challenge.completedAt).toLocaleDateString("es-ES", {
								day: "numeric",
								month: "short",
							})}
						</span>
					)}
				</div>
			</div>
		</motion.div>
	);
}
