/** biome-ignore-all lint/suspicious/noArrayIndexKey: explanation */
"use client";

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
import { Loader } from "../_components/loader";
import {
	ActionPlanCard,
	InsightCard,
	RedFlagCard,
	ReportSection,
	StrengthDynamicsCard,
} from "../_components/report-cards";
import type { IndividualReport } from "../_schemas/individual-report.schema";

interface IndividualReportViewProps {
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

export function IndividualReportView({
	user,
	hasStrengths,
	existingReport,
}: IndividualReportViewProps) {
	const [isPending, startTransition] = useTransition();
	const [report] = useState<IndividualReport | null>(
		existingReport?.content ?? null,
	);
	const [error, setError] = useState<string | null>(null);
	const [regenerateMessage, setRegenerateMessage] = useState<string | null>(
		null,
	);

	// Calcular si se puede regenerar (30 días desde la última generación)
	const daysUntilRegenerate = existingReport
		? getDaysUntilRegenerate(existingReport.createdAt)
		: 0;
	const canRegenerate = daysUntilRegenerate === 0;

	const handleGenerate = (forceRegenerate: boolean) => {
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

	// No strengths assigned
	if (!hasStrengths) {
		return (
			<div className="container mx-auto py-8">
				<Card className="mx-auto max-w-lg text-center">
					<CardContent>
						<Button asChild>
							<Link href="/dashboard/profile">Completar Evaluación</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto space-y-4 py-4">
			{/* Generate/Regenerate Section */}
			{!report && (
				<Card>
					<CardHeader>
						<CardTitle>Genera tu Reporte</CardTitle>
						<CardDescription>
							Crea un análisis comprehensivo de tus fortalezas con IA
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-sm text-muted-foreground">
							El reporte será generado usando GPT-4o de OpenAI.
						</p>

						{error && (
							<div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
								{error}
							</div>
						)}

						{isPending && (
							<div className="flex items-center gap-3 rounded-lg bg-primary/5 px-4 py-3">
								<Loader size={20} />
								<div>
									<p className="font-medium text-sm">Generando tu reporte...</p>
									<p className="text-xs text-muted-foreground">
										Esto puede tomar 30-60 segundos
									</p>
								</div>
							</div>
						)}

						<Button
							onClick={() => handleGenerate(false)}
							disabled={isPending}
							size="lg"
						>
							{isPending ? (
								<>
									<Loader size={16} className="mr-2" />
									Generando...
								</>
							) : (
								<>
									<SparklesIcon className="mr-2 size-4" />
									Generar Reporte
								</>
							)}
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Report Content */}
			{report && (
				<>
					{/* Executive Summary */}
					<Card className="border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
						<CardHeader>
							<CardTitle className="text-xl">
								{report.summary.headline}
							</CardTitle>
							<CardDescription>
								Dominio Dominante: {report.summary.dominantDomain}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-foreground/90 whitespace-pre-line">
								{report.summary.overview}
							</p>
							<div className="rounded-lg bg-primary/10 px-4 py-3">
								<p className="font-medium text-sm text-primary">
									Tu Valor Único
								</p>
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
												<p className="text-sm">
													{career.industries.join(", ")}
												</p>
											</div>
											<div>
												<p className="text-xs font-medium text-muted-foreground uppercase">
													Áreas de Crecimiento
												</p>
												<ul className="text-sm text-muted-foreground">
													{career.growthAreas.map((area, j) => (
														<li key={j}>• {area}</li>
													))}
												</ul>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</ReportSection>

						{/* Blind Spots */}
						<ReportSection
							title="Puntos Ciegos"
							description="Lados oscuros a abordar para evitar convertir fortalezas en debilidades"
							icon={<EyeIcon className="size-5" />}
						>
							<div className="grid gap-4 md:grid-cols-2">
								{report.blindSpots.map((blindSpot, i) => (
									<Card key={i} className="border-l-4 border-l-orange-500">
										<CardHeader className="pb-2">
											<CardTitle className="text-base">
												{blindSpot.strengthName}
											</CardTitle>
											<CardDescription>{blindSpot.darkSide}</CardDescription>
										</CardHeader>
										<CardContent className="space-y-3">
											<div>
												<p className="text-xs font-medium text-muted-foreground uppercase">
													Desencadenantes
												</p>
												<ul className="text-sm text-muted-foreground">
													{blindSpot.triggers.map((trigger, j) => (
														<li key={j}>• {trigger}</li>
													))}
												</ul>
											</div>
											<div>
												<p className="text-xs font-medium text-muted-foreground uppercase">
													Estrategias de Equilibrio
												</p>
												<ul className="text-sm text-muted-foreground">
													{blindSpot.balancingStrategies.map((strategy, j) => (
														<li key={j}>• {strategy}</li>
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
							title="Mejores Fortalezas para Asociarse"
							description="Fortalezas ideales para buscar en asociaciones complementarias"
							icon={<UsersIcon className="size-5" />}
						>
							<div className="grid gap-4 md:grid-cols-3">
								{report.bestPartnerships.map((partnership, i) => (
									<Card key={i}>
										<CardHeader className="pb-2">
											<Badge variant="default" className="w-fit">
												{partnership.complementaryStrength}
											</Badge>
										</CardHeader>
										<CardContent className="space-y-2">
											<p className="text-sm text-muted-foreground">
												{partnership.whyItWorks}
											</p>
											<div>
												<p className="text-xs font-medium text-muted-foreground uppercase">
													Consejos de Colaboración
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
			)}
		</div>
	);
}
