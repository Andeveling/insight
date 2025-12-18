/** biome-ignore-all lint/suspicious/noArrayIndexKey: explanation */
"use client";

/**
 * Individual Report with Readiness Gate
 *
 * Client component that shows readiness dashboard first,
 * then allows report generation when ready.
 * If report already exists, shows report directly.
 *
 * @feature 009-contextual-reports
 */

import {
	BriefcaseIcon,
	EyeIcon,
	LightbulbIcon,
	RefreshCwIcon,
	RocketIcon,
	ShieldAlertIcon,
	SparklesIcon,
	UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Loader } from "../_components/loader";
import { ReadinessDashboard } from "../_components/readiness-dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { formatDate, getDaysUntilRegenerate } from "@/lib/utils";
import { generateIndividualReport } from "../_actions";
import {
	ActionPlanCard,
	InsightCard,
	RedFlagCard,
	ReportSection,
	StrengthDynamicsCard,
} from "../_components/report-cards";
import type { IndividualReadiness } from "../_schemas/readiness.schema";
import type { IndividualReport } from "../_schemas/individual-report.schema";

interface IndividualReportWithReadinessProps {
	readiness: IndividualReadiness;
	user: {
		id: string;
		name: string;
		email: string;
		profile: {
			career: string | null;
			age: number | null;
			description: string | null;
		} | null;
		strengths: Array<{
			rank: number;
			name: string;
			nameEs: string;
			domain: string;
		}>;
		team: {
			name: string;
			role: string | null;
		} | null;
	};
	hasStrengths: boolean;
	existingReport: {
		id: string;
		version: number;
		createdAt: Date;
		modelUsed: string | null;
		content: IndividualReport | null;
		metadata: Record<string, unknown> | null;
	} | null;
}

export function IndividualReportWithReadiness({
	readiness,
	user,
	hasStrengths,
	existingReport,
}: IndividualReportWithReadinessProps) {
	const [isPending, startTransition] = useTransition();
	const [report] = useState<IndividualReport | null>(
		existingReport?.content ?? null,
	);
	const [error, setError] = useState<string | null>(null);
	const [regenerateMessage, setRegenerateMessage] = useState<string | null>(
		null,
	);

	// Calculate regeneration eligibility (30 days from last generation)
	const daysUntilRegenerate = existingReport
		? getDaysUntilRegenerate(existingReport.createdAt)
		: 0;
	const canRegenerate = daysUntilRegenerate === 0;

	const handleGenerate = (forceRegenerate = false) => {
		setError(null);
		setRegenerateMessage(null);
		startTransition(async () => {
			const result = await generateIndividualReport({
				userId: user.id,
				forceRegenerate,
			});

			if (!result.success) {
				setError(result.error ?? "Error al generar el reporte");
				return;
			}

			// Check if regeneration was blocked by policy
			if (result.fromCache && result.regenerateMessage) {
				setRegenerateMessage(result.regenerateMessage);
				return;
			}

			// Refresh page to get new report
			window.location.reload();
		});
	};

	// No strengths assigned - redirect to assessment
	if (!hasStrengths) {
		return (
			<div className="container mx-auto py-8">
				<Card className="mx-auto max-w-lg text-center">
					<CardHeader>
						<CardTitle>Primero completa tu evaluación</CardTitle>
						<CardDescription>
							Necesitas identificar tus fortalezas antes de generar un reporte.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild>
							<Link href="/dashboard/assessment">Completar Evaluación</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Show readiness dashboard if no report exists yet
	if (!report) {
		return (
			<div className="container mx-auto space-y-6 py-4">
				{/* Readiness Dashboard */}
				<ReadinessDashboard
					readiness={readiness}
					onGenerateReport={
						readiness.isReady ? () => handleGenerate(false) : undefined
					}
					isGenerating={isPending}
				/>

				{/* Error message */}
				{error && (
					<div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
						{error}
					</div>
				)}

				{/* Loading state */}
				{isPending && (
					<Card>
						<CardContent className="flex items-center gap-3 py-4">
							<Loader size={20} />
							<div>
								<p className="font-medium text-sm">Generando tu reporte...</p>
								<p className="text-xs text-muted-foreground">
									Esto puede tomar 30-60 segundos
								</p>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Not ready message */}
				{!readiness.isReady && (
					<Card className="border-warning/30 bg-warning/5">
						<CardContent className="py-4">
							<p className="text-sm text-warning-foreground">
								<strong>💡 Tip:</strong> Los reportes generados sin suficiente
								contexto de desarrollo tienden a ser genéricos. Completa más
								actividades para obtener insights personalizados basados en tu
								progreso real.
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		);
	}

	// Show existing report with optional regeneration
	return (
		<div className="container mx-auto space-y-4 py-4">
			{/* Report metadata and regeneration */}
			<Card className="border-primary/20">
				<CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<div className="flex items-center gap-1.5">
							<SparklesIcon className="size-4" />
							<span>Versión {existingReport?.version ?? 1}</span>
						</div>
						<div className="flex items-center gap-1.5">
							<EyeIcon className="size-4" />
							<span>
								Generado{" "}
								{existingReport?.createdAt
									? formatDate(existingReport.createdAt)
									: "recientemente"}
							</span>
						</div>
					</div>

					<div className="flex items-center gap-2">
						{canRegenerate ? (
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleGenerate(true)}
								disabled={isPending}
							>
								{isPending ? (
									<>
										<Loader size={14} className="mr-2" />
										Regenerando...
									</>
								) : (
									<>
										<RefreshCwIcon className="mr-2 size-4" />
										Regenerar Reporte
									</>
								)}
							</Button>
						) : (
							<p className="text-xs text-muted-foreground">
								Siguiente regeneración en {daysUntilRegenerate} días
							</p>
						)}
					</div>
				</CardContent>
			</Card>

			{regenerateMessage && (
				<div className="rounded-lg bg-warning/10 px-4 py-3 text-sm text-warning-foreground">
					{regenerateMessage}
				</div>
			)}

			{/* Report Content */}
			<>
				{/* Executive Summary */}
				<Card className="border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
					<CardHeader>
						<CardTitle className="text-xl">{report.summary.headline}</CardTitle>
						<CardDescription>
							Dominio Dominante: {report.summary.dominantDomain}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-foreground/90 whitespace-pre-line">
							{report.summary.overview}
						</p>
						<div className="rounded-lg bg-primary/10 px-4 py-3">
							<p className="font-medium text-sm text-primary">Tu Valor Único</p>
							<p className="text-sm text-foreground/80">
								{report.summary.uniqueValue}
							</p>
						</div>
					</CardContent>
				</Card>

				<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
					{/* Strengths Dynamics */}
					<ReportSection
						title="Dinámica de Fortalezas"
						description="Cómo tus 5 fortalezas principales trabajan juntas"
						icon={<SparklesIcon className="size-5" />}
					>
						<StrengthDynamicsCard
							synergies={report.strengthsDynamics.synergies}
							tensions={report.strengthsDynamics.tensions}
							uniqueBlend={report.strengthsDynamics.uniqueBlend}
						/>
					</ReportSection>

					{/* Career Implications */}
					<ReportSection
						title="Implicaciones Profesionales"
						description="Caminos donde tus fortalezas crean el máximo impacto"
						icon={<BriefcaseIcon className="size-5" />}
					>
						<div className="grid gap-4 md:grid-cols-2">
							{report.careerImplications.map((career, i) => (
								<Card key={i}>
									<CardHeader className="pb-2">
										<CardTitle className="text-base">
											{career.strengthName}
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<div>
											<p className="text-xs font-medium text-muted-foreground uppercase">
												Roles Ideales
											</p>
											<div className="mt-1 flex flex-wrap gap-1">
												{career.idealRoles.map((role) => (
													<Badge key={role} variant="secondary">
														{role}
													</Badge>
												))}
											</div>
										</div>
										<div>
											<p className="text-xs font-medium text-muted-foreground uppercase">
												Industrias
											</p>
											<ul className="mt-1 text-sm text-muted-foreground">
												{career.industries.slice(0, 2).map((industry) => (
													<li key={industry}>• {industry}</li>
												))}
											</ul>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</ReportSection>

					{/* Best Partnerships */}
					<ReportSection
						title="Alianzas Ideales"
						description="Fortalezas complementarias a buscar en colaboradores"
						icon={<UsersIcon className="size-5" />}
					>
						<div className="grid gap-4 md:grid-cols-2">
							{report.bestPartnerships.map((partnership, i) => (
								<Card key={i}>
									<CardHeader className="pb-2">
										<CardTitle className="text-base">
											{partnership.complementaryStrength}
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-2">
										<p className="text-sm text-muted-foreground">
											{partnership.whyItWorks}
										</p>
										<div>
											<p className="text-xs font-medium text-muted-foreground uppercase">
												Tips de Colaboración
											</p>
											<ul className="text-sm text-muted-foreground">
												{partnership.collaborationTips
													.slice(0, 2)
													.map((tip, j) => (
														<li key={j}>• {tip}</li>
													))}
											</ul>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</ReportSection>

					{/* Insights */}
					<ReportSection
						title="Insights Clave"
						description="Oportunidades para crecimiento e impacto"
						icon={<LightbulbIcon className="size-5" />}
					>
						<div className="grid gap-4 md:grid-cols-2">
							{report.insights.map((insight, i) => (
								<InsightCard
									key={i}
									title={insight.title}
									description={insight.description}
									actionItems={insight.actionItems}
								/>
							))}
						</div>
					</ReportSection>

					{/* Red Flags */}
					<ReportSection
						title="Banderas Rojas y Riesgos"
						description="Señales de advertencia a tener en cuenta"
						icon={<ShieldAlertIcon className="size-5" />}
					>
						<div className="grid gap-4 md:grid-cols-2">
							{report.redFlags.map((redFlag, i) => (
								<RedFlagCard
									key={i}
									title={redFlag.title}
									description={redFlag.description}
									severity={redFlag.severity}
									mitigation={redFlag.mitigation}
								/>
							))}
						</div>
					</ReportSection>

					{/* Action Plan */}
					<ReportSection
						title="Plan de Acción"
						description="Tu hoja de ruta de la conciencia a la acción"
						icon={<RocketIcon className="size-5" />}
					>
						<ActionPlanCard
							immediate={report.actionPlan.immediate}
							shortTerm={report.actionPlan.shortTerm}
							longTerm={report.actionPlan.longTerm}
						/>
					</ReportSection>
				</div>
			</>
		</div>
	);
}
