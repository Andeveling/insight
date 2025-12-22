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
	Activity,
	Cpu,
	Box,
	ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatDate, getDaysUntilRegenerate } from "@/lib/utils";
import { generateIndividualReport } from "../../_actions";
import { Loader } from "../../_components/loader";
import { ReadinessDashboard } from "../../_components/readiness-dashboard";
import {
	ActionPlanCard,
	InsightCard,
	RedFlagCard,
	ReportSection,
	StrengthDynamicsCard,
} from "../../_components/report-cards";
import type { IndividualReport } from "../../_schemas/individual-report.schema";
import type { IndividualReadiness } from "../../_schemas/readiness.schema";

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

	const clipPath16 =
		"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
	const clipPath8 =
		"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";
	const clipHex = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

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
			<div className="py-12">
				<div
					className="p-px bg-border/40 max-w-lg mx-auto"
					style={{ clipPath: clipPath16 }}
				>
					<div
						className="bg-background/95 backdrop-blur-md p-8 text-center space-y-6"
						style={{ clipPath: clipPath16 }}
					>
						<div
							className="mx-auto size-16 flex items-center justify-center opacity-20"
							style={{
								clipPath: clipHex,
								backgroundColor: "var(--color-primary)",
							}}
						>
							<ShieldAlertIcon className="size-8 text-primary-foreground" />
						</div>
						<div className="space-y-2">
							<h3 className="text-xl font-black uppercase tracking-[0.2em] text-foreground">
								EVALUATION_REQUIRED
							</h3>
							<p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 leading-relaxed">
								NECESITAS_IDENTIFICAR_TUS_FORTALEZAS_ANTES_DE_GENERAR_UN_REPORTE_ANALÍTICO.
							</p>
						</div>
						<Button
							asChild
							className="w-full"
							size="lg"
							style={{ clipPath: clipPath8 }}
						>
							<Link
								href="/dashboard/assessment"
								className="flex items-center gap-2"
							>
								COMPLETAR_EVALUACIÓN
								<ChevronRight className="size-4" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	// Show readiness dashboard if no report exists yet
	if (!report) {
		return (
			<div className="space-y-8 py-4">
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
					<div className="p-px bg-red-500/30" style={{ clipPath: clipPath8 }}>
						<div
							className="bg-red-500/5 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500"
							style={{ clipPath: clipPath8 }}
						>
							ERROR_CORE: {error.toUpperCase()}
						</div>
					</div>
				)}

				{/* Loading state */}
				{isPending && (
					<div
						className="p-px bg-primary/30 animate-pulse"
						style={{ clipPath: clipPath8 }}
					>
						<div
							className="bg-background/95 p-6 flex items-center gap-6"
							style={{ clipPath: clipPath8 }}
						>
							<div
								className="size-10 border border-primary/40 animate-spin-slow flex items-center justify-center"
								style={{ clipPath: clipHex }}
							>
								<Loader size={20} />
							</div>
							<div className="space-y-1">
								<p className="text-xs font-black uppercase tracking-[0.2em] text-primary">
									GENERANDO_REPORTE_ANALÍTICO...
								</p>
								<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
									ESTIMATED_TIME: 30-60_SECONDS // [ESTRÉS_DE_MODELO: LOW]
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Not ready message */}
				{!readiness.isReady && (
					<div className="p-px bg-amber-500/20" style={{ clipPath: clipPath8 }}>
						<div
							className="bg-amber-500/5 p-6 relative overflow-hidden"
							style={{ clipPath: clipPath8 }}
						>
							<div className="absolute -right-4 -bottom-4 opacity-5 rotate-12">
								<LightbulbIcon className="size-24" />
							</div>
							<div className="relative z-10 flex items-start gap-4">
								<div
									className="p-2 bg-amber-500/20 text-amber-500"
									style={{ clipPath: clipHex }}
								>
									<Box className="size-4" />
								</div>
								<div className="space-y-1">
									<h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500">
										OPTIMIZATION_TIP
									</h4>
									<p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 leading-relaxed">
										LOS_REPORTES_GENERADOS_SIN_SUFICIENTE_CONTEXTO_DE_DESARROLLO_TIENDEN_A_SER_GENÉRICOS.
										COMPLETA_MÁS_ACTIVIDADES_PARA_OBTENER_INSIGHTS_PERSONALIZADOS.
									</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}

	// Show existing report with optional regeneration
	return (
		<div className="space-y-8 py-4">
			{/* Report metadata and regeneration Header */}
			<div className="p-px bg-border/40" style={{ clipPath: clipPath16 }}>
				<div
					className="bg-background/95 backdrop-blur-md p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
					style={{ clipPath: clipPath16 }}
				>
					<div className="flex flex-wrap items-center gap-6">
						<div className="space-y-1">
							<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">
								REPORT_VERSION
							</p>
							<div className="flex items-center gap-2">
								<SparklesIcon className="size-3 text-primary" />
								<span className="text-xs font-black uppercase tracking-widest">
									v{existingReport?.version ?? 1}.0_STABLE
								</span>
							</div>
						</div>
						<div className="w-px h-8 bg-border/40 hidden md:block" />
						<div className="space-y-1">
							<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">
								TIMESTAMP_GENERATED
							</p>
							<div className="flex items-center gap-2 text-muted-foreground">
								<EyeIcon className="size-3" />
								<span className="text-xs font-black uppercase tracking-widest">
									{existingReport?.createdAt
										? formatDate(existingReport.createdAt).toUpperCase()
										: "RECUPERACIÓN_RECIENTE"}
								</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-4">
						{canRegenerate ? (
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleGenerate(true)}
								disabled={isPending}
								className="border-primary/20 hover:bg-primary/5 group/btn"
								style={{ clipPath: clipPath8 }}
							>
								{isPending ? (
									<>
										<Loader size={14} className="mr-2" />
										SYNCING...
									</>
								) : (
									<>
										<RefreshCwIcon className="mr-2 size-3 group-hover/btn:rotate-180 transition-transform duration-500" />
										<span className="text-[10px] font-black tracking-widest">
											REGENERAR_REPORTE
										</span>
									</>
								)}
							</Button>
						) : (
							<div className="px-3 py-1 bg-muted/20 border border-border/20 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
								NEXT_SYNC: {daysUntilRegenerate}_DAYS
							</div>
						)}
					</div>
				</div>
			</div>

			{regenerateMessage && (
				<div className="p-px bg-amber-500/20" style={{ clipPath: clipPath8 }}>
					<div
						className="bg-amber-500/5 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-amber-500"
						style={{ clipPath: clipPath8 }}
					>
						ALERT: {regenerateMessage.toUpperCase()}
					</div>
				</div>
			)}

			<div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
				{/* Executive Summary */}
				<div className="p-px bg-primary/20" style={{ clipPath: clipPath16 }}>
					<div
						className="bg-linear-to-br from-primary/10 via-background/95 to-background/95 backdrop-blur-md p-8 relative overflow-hidden"
						style={{ clipPath: clipPath16 }}
					>
						<div className="absolute inset-0 bg-grid-tech/5 pointer-events-none" />
						<div className="absolute top-0 right-0 p-8 flex items-start gap-4 opacity-5">
							<Cpu className="size-32" />
						</div>

						<div className="relative z-10 space-y-8">
							<div className="space-y-2">
								<div className="flex items-center gap-3">
									<div className="size-2 bg-primary animate-pulse" />
									<p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
										EXECUTIVE_SUMMARY_STREAM
									</p>
								</div>
								<h2 className="text-3xl font-black uppercase tracking-tight text-foreground leading-tight max-w-3xl">
									{report.summary.headline}
								</h2>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
								<div className="lg:col-span-8 space-y-6">
									<p className="text-sm text-foreground/80 leading-relaxed max-w-2xl whitespace-pre-line font-medium italic">
										{report.summary.overview}
									</p>
									<div
										className="p-px bg-primary/30"
										style={{ clipPath: clipPath8 }}
									>
										<div
											className="bg-background/40 p-6 space-y-2"
											style={{ clipPath: clipPath8 }}
										>
											<p className="text-[9px] font-black uppercase tracking-widest text-primary">
												VALOR_ÚNICO_DETECTADO
											</p>
											<p className="text-sm font-bold text-foreground leading-relaxed">
												{report.summary.uniqueValue}
											</p>
										</div>
									</div>
								</div>

								<div className="lg:col-span-4 justify-end flex flex-col space-y-8 border-l border-border/10 pl-8">
									<div className="space-y-1">
										<p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
											DOMINANTE_DOMAIN
										</p>
										<p className="text-xl font-black uppercase tracking-widest text-primary">
											{report.summary.dominantDomain}
										</p>
									</div>
									<div className="space-y-1">
										<p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
											COGNITIVE_BIAS
										</p>
										<p className="text-base font-bold uppercase tracking-widest text-foreground">
											STABLE_FLOW
										</p>
									</div>
									<div className="pt-4 mt-auto">
										<div className="h-1 w-full bg-border/20">
											<div className="h-full bg-primary w-4/5 animate-pulse" />
										</div>
										<p className="text-[8px] font-black uppercase tracking-widest mt-2 text-muted-foreground">
											NEURAL_STRENGTH_COHESION: 84%
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
					{/* Strengths Dynamics */}
					<div className="lg:col-span-12 xl:col-span-6">
						<ReportSection
							title="STRENGTHS_DYNAMICS_MATRIX"
							description="Mapeo de sinergias y tensiones entre tus 5 núcleos principales_"
							icon={<SparklesIcon className="size-4" />}
						>
							<StrengthDynamicsCard
								synergies={report.strengthsDynamics.synergies}
								tensions={report.strengthsDynamics.tensions}
								uniqueBlend={report.strengthsDynamics.uniqueBlend}
							/>
						</ReportSection>
					</div>

					{/* Career Implications */}
					<div className="lg:col-span-12 xl:col-span-6">
						<ReportSection
							title="CAREER_PATHWAY_PROJECTION"
							description="Caminos de máximo impacto basados en arquitectura de talentos_"
							icon={<BriefcaseIcon className="size-4" />}
						>
							<div className="grid gap-6 grid-cols-1 md:grid-cols-2">
								{report.careerImplications.map((career, i) => (
									<div
										key={i}
										className="group/career p-px bg-border/20 hover:bg-primary/20 transition-all duration-300"
										style={{ clipPath: clipPath8 }}
									>
										<div
											className="bg-background/95 p-6 space-y-4 h-full flex flex-col"
											style={{ clipPath: clipPath8 }}
										>
											<div className="flex items-start justify-between">
												<h4 className="text-sm font-black uppercase tracking-widest text-foreground group-hover/career:text-primary transition-colors">
													{career.strengthName}
												</h4>
												<Activity className="size-3 text-muted-foreground/30 animate-pulse" />
											</div>
											<div className="space-y-4">
												<div>
													<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-2">
														IDEAL_ROLES_MATRIX
													</p>
													<div className="flex flex-wrap gap-1.5">
														{career.idealRoles.map((role) => (
															<Badge
																key={role}
																variant="secondary"
																className="bg-muted/30 border-transparent text-[8px] font-bold uppercase tracking-widest rounded-none"
															>
																{role}
															</Badge>
														))}
													</div>
												</div>
												<div className="pt-2 border-t border-border/10">
													<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">
														TARGET_INDUSTRIES
													</p>
													<ul className="text-[10px] font-bold uppercase tracking-widest text-foreground/70 space-y-1">
														{career.industries.slice(0, 2).map((industry) => (
															<li
																key={industry}
																className="flex items-center gap-2"
															>
																<ChevronRight className="size-2 text-primary" />
																{industry}
															</li>
														))}
													</ul>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</ReportSection>
					</div>

					{/* Best Partnerships */}
					<div className="lg:col-span-12 xl:col-span-6">
						<ReportSection
							title="ALLEGIANCE_STRATEGY"
							description="Búsqueda de nodos complementarios para sincronización óptima_"
							icon={<UsersIcon className="size-4" />}
						>
							<div className="grid gap-6 grid-cols-1 md:grid-cols-2">
								{report.bestPartnerships.map((partnership, i) => (
									<div
										key={i}
										className="p-px bg-border/20 hover:bg-emerald-500/20 transition-all"
										style={{ clipPath: clipPath8 }}
									>
										<div
											className="bg-background/95 p-6 space-y-4 h-full"
											style={{ clipPath: clipPath8 }}
										>
											<div className="flex items-center justify-between">
												<h4 className="text-xs font-black uppercase tracking-widest text-emerald-500">
													{partnership.complementaryStrength}
												</h4>
												<div className="px-1.5 py-0.5 border border-emerald-500/20 text-[7px] font-bold uppercase tracking-[0.2em] text-emerald-500/60">
													SYNC_LOCKED
												</div>
											</div>
											<p className="text-[11px] font-medium text-muted-foreground leading-relaxed italic">
												{partnership.whyItWorks}
											</p>
											<div className="pt-2 border-t border-border/10">
												<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-2">
													COLLAB_PROTOCOLS
												</p>
												<ul className="space-y-2">
													{partnership.collaborationTips
														.slice(0, 2)
														.map((tip, j) => (
															<li
																key={j}
																className="text-[10px] uppercase font-bold tracking-widest text-foreground/80 flex gap-2"
															>
																<span className="text-emerald-500">[+]</span>
																{tip}
															</li>
														))}
												</ul>
											</div>
										</div>
									</div>
								))}
							</div>
						</ReportSection>
					</div>

					{/* Insights */}
					<div className="lg:col-span-12 xl:col-span-6">
						<ReportSection
							title="CRITICAL_INSIGHTS_LOG"
							description="Oportunidades de optimización y crecimiento detectadas_"
							icon={<LightbulbIcon className="size-4" />}
						>
							<div className="grid gap-6 grid-cols-1 md:grid-cols-2">
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
					</div>

					{/* Red Flags */}
					<div className="lg:col-span-12 xl:col-span-6">
						<ReportSection
							title="SYSTEM_RISK_FACTORS"
							description="Señales de advertencia y vulnerabilidades potenciales_"
							icon={<ShieldAlertIcon className="size-4" />}
						>
							<div className="grid gap-6 grid-cols-1 md:grid-cols-2">
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
					</div>

					{/* Action Plan */}
					<div className="lg:col-span-12 xl:col-span-6">
						<ReportSection
							title="OPTIMIZATION_ROADMAP"
							description="Hoja de ruta secuencial de conciencia a impacto real_"
							icon={<RocketIcon className="size-4" />}
						>
							<ActionPlanCard
								immediate={report.actionPlan.immediate}
								shortTerm={report.actionPlan.shortTerm}
								longTerm={report.actionPlan.longTerm}
							/>
						</ReportSection>
					</div>
				</div>

				{/* Footer Scan Line */}
				<div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
					<div
						className="w-full h-1 bg-primary animate-scan"
						style={{ top: "-10%" }}
					/>
				</div>
			</div>
		</div>
	);
}
