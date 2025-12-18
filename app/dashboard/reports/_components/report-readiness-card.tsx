"use client";

/**
 * Report Readiness Card Component
 *
 * Displays a report type card with mini readiness indicator.
 * Shows progress, status badge, and action buttons.
 *
 * @feature 009-contextual-reports
 */

import {
	CheckCircleIcon,
	FileTextIcon,
	RefreshCwIcon,
	SparklesIcon,
	UserIcon,
	UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/cn";

export interface ReportReadinessCardProps {
	/** Type of report */
	type: "individual" | "team";
	/** Title for the card */
	title: string;
	/** Description for the card */
	description: string;
	/** Readiness score 0-100 */
	readinessScore: number;
	/** Whether the user/team is ready */
	isReady: boolean;
	/** Whether a report already exists */
	hasExistingReport: boolean;
	/** Whether the report can be regenerated */
	canRegenerate?: boolean;
	/** Link to the report page */
	href: string;
	/** Optional: Team name (for team reports) */
	teamName?: string;
	/** Optional: Team member count */
	memberCount?: number;
	/** Loading state */
	isLoading?: boolean;
}

/**
 * Report Readiness Card - shows report status with readiness indicator
 */
export function ReportReadinessCard({
	type,
	title,
	description,
	readinessScore,
	isReady,
	hasExistingReport,
	canRegenerate,
	href,
	teamName,
	memberCount,
	isLoading = false,
}: ReportReadinessCardProps) {
	const isIndividual = type === "individual";
	const colorClass = isIndividual ? "text-primary" : "text-blue-500";
	const bgClass = isIndividual ? "bg-primary/10" : "bg-blue-500/10";

	// Determine status label and color
	const getStatusInfo = () => {
		if (isLoading) {
			return {
				label: "Cargando...",
				colorClass: "bg-muted text-muted-foreground",
			};
		}

		if (isReady && hasExistingReport) {
			return {
				label: "Listo para ver",
				colorClass:
					"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
			};
		}

		if (isReady && !hasExistingReport) {
			return {
				label: "¡Listo!",
				colorClass:
					"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
			};
		}

		if (readinessScore >= 50) {
			return {
				label: "Casi listo",
				colorClass:
					"bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
			};
		}

		return {
			label: "En progreso",
			colorClass: "bg-muted text-muted-foreground",
		};
	};

	const statusInfo = getStatusInfo();

	// Features list based on report type
	const features = isIndividual
		? [
				"Implicaciones profesionales y roles ideales",
				"Puntos ciegos y lados oscuros",
				"Cómo tus fortalezas trabajan juntas",
				"Estrategias de desarrollo personalizadas",
			]
		: [
				"Mapa de cultura del equipo",
				"Análisis de cobertura de dominios",
				"Sinergias y brechas de miembros",
				"Patrones de desarrollo del equipo",
			];

	return (
		<Card className={cn("relative overflow-hidden", isLoading && "opacity-60")}>
			{/* Background decoration */}
			<div
				className={cn(
					"absolute right-0 top-0 size-32 -translate-y-8 translate-x-8 rounded-full",
					bgClass,
				)}
			/>

			{/* Ready animation badge */}
			{isReady && !hasExistingReport && (
				<div className="absolute right-4 top-4 animate-pulse">
					<div className="flex items-center gap-1 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">
						<CheckCircleIcon className="size-3" />
						¡Listo!
					</div>
				</div>
			)}

			<CardHeader>
				<div className="flex items-center gap-3">
					<div
						className={cn(
							"flex size-12 items-center justify-center rounded-lg",
							bgClass,
						)}
					>
						{isIndividual ? (
							<UserIcon className={cn("size-6", colorClass)} />
						) : (
							<UsersIcon className={cn("size-6", colorClass)} />
						)}
					</div>
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<CardTitle>{title}</CardTitle>
							<span
								className={cn(
									"rounded-full px-2 py-0.5 text-xs font-medium",
									statusInfo.colorClass,
								)}
							>
								{statusInfo.label}
							</span>
						</div>
						<CardDescription>
							{teamName ? `${teamName} • ` : ""}
							{description}
							{memberCount !== undefined && ` • ${memberCount} miembros`}
						</CardDescription>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Readiness Progress */}
				<div className="space-y-2">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Preparación</span>
						<span
							className={cn(
								"font-medium",
								isReady
									? "text-green-600 dark:text-green-400"
									: "text-muted-foreground",
							)}
						>
							{readinessScore}%
						</span>
					</div>
					<Progress
						value={readinessScore}
						className={cn("h-2", isReady && "[&>div]:bg-green-500")}
					/>
				</div>

				{/* Features list */}
				<ul className="space-y-2 text-sm">
					{features.map((feature) => (
						<li key={feature} className="flex items-center gap-2">
							<SparklesIcon className={cn("size-4", colorClass)} />
							{feature}
						</li>
					))}
				</ul>

				{/* Action buttons */}
				<div className="flex gap-2">
					<Button
						asChild
						variant={isIndividual ? "default" : "outline"}
						className="flex-1"
						disabled={isLoading}
					>
						<Link href={href}>
							<FileTextIcon className="mr-2 size-4" />
							{hasExistingReport ? "Ver Reporte" : "Generar Reporte"}
						</Link>
					</Button>

					{hasExistingReport && canRegenerate && (
						<Button
							asChild
							variant="ghost"
							size="icon"
							className="shrink-0"
							disabled={isLoading}
						>
							<Link href={`${href}?regenerate=true`}>
								<RefreshCwIcon className="size-4" />
								<span className="sr-only">Regenerar</span>
							</Link>
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
