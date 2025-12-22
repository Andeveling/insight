/** biome-ignore-all lint/suspicious/noArrayIndexKey: explanation */
"use client";

import {
	AlertTriangleIcon,
	BrainIcon,
	LightbulbIcon,
	RefreshCwIcon,
	RocketIcon,
	ShieldAlertIcon,
	SparklesIcon,
	TargetIcon,
	UsersIcon,
	ZapIcon,
	Activity,
	Cpu,
	Box,
	ChevronRight,
} from "lucide-react";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, getDaysUntilRegenerate } from "@/lib/utils";
import { generateTeamReport } from "../_actions";
import { Loader } from "../_components/loader";
import {
	ActionPlanCard,
	DomainCoverageChart,
	InsightCard,
	RedFlagCard,
	ReportSection,
	TeamMemberCard,
} from "../_components/report-cards";
import type { TeamReport } from "../_schemas/team-report.schema";
import { cn } from "@/lib/cn";

// Constants for clip-paths
const clipPath16 =
	"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
const clipPath12 =
	"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)";
const clipPath8 =
	"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";
const clipHex = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

interface TeamReportViewProps {
	team: {
		id: string;
		name: string;
		description: string | null;
		members: Array<{
			id: string;
			name: string;
			role: string | null;
			career: string | null;
			hasStrengths: boolean;
			strengths: Array<{
				rank: number;
				name: string;
				domain: string;
			}>;
		}>;
	};
	membersWithStrengthsCount: number;
	existingReport: {
		id: string;
		version: number;
		createdAt: Date;
		modelUsed: string | null;
		content: TeamReport | null;
		metadata: Record<string, unknown> | null;
	} | null;
}

export function TeamReportView({
	team,
	membersWithStrengthsCount,
	existingReport,
}: TeamReportViewProps) {
	const [isPending, startTransition] = useTransition();
	const [report] = useState<TeamReport | null>(existingReport?.content ?? null);
	const [error, setError] = useState<string | null>(null);
	const [_regenerateMessage, setRegenerateMessage] = useState<string | null>(
		null,
	);

	// Calcular si se puede regenerar (30 días desde la última generación)
	const daysUntilRegenerate = existingReport
		? getDaysUntilRegenerate(existingReport.createdAt)
		: 0;
	const _canRegenerate = daysUntilRegenerate === 0;

	const handleGenerate = (forceRegenerate: boolean) => {
		setError(null);
		setRegenerateMessage(null);
		startTransition(async () => {
			const result = await generateTeamReport({
				teamId: team.id,
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

	// No members with strengths
	if (membersWithStrengthsCount === 0) {
		return (
			<div className="py-12">
				<div
					className="p-px bg-red-500/30 max-w-lg mx-auto"
					style={{ clipPath: clipPath16 }}
				>
					<div
						className="bg-background/95 backdrop-blur-md p-8 text-center space-y-6"
						style={{ clipPath: clipPath16 }}
					>
						<div
							className="mx-auto size-16 flex items-center justify-center bg-red-500/20 text-red-500"
							style={{ clipPath: clipHex }}
						>
							<ShieldAlertIcon className="size-8" />
						</div>
						<div className="space-y-2">
							<h3 className="text-xl font-black uppercase tracking-[0.2em] text-foreground">
								DATA_VACUUM_DETECTED
							</h3>
							<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-relaxed">
								LOS_MIEMBROS_DEL_EQUIPO_NECESITAN_COMPLETAR_SU_EVALUACIÓN_DE_FORTALEZAS_ANTES_DE_GENERAR_UN_REPORTE_SINTÉTICO.
							</p>
						</div>
						<div className="p-4 bg-muted/20 border border-border/20 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
							{team.members.length} MIEMBROS {"//"} 0 CON_FORTALEZAS_SINCRO
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8 py-4">
			{/* Team Summary HUD */}
			<div className="p-px bg-border/40" style={{ clipPath: clipPath16 }}>
				<div
					className="bg-background/95 backdrop-blur-md p-8 relative overflow-hidden"
					style={{ clipPath: clipPath16 }}
				>
					<div className="absolute inset-0 bg-grid-tech/5 opacity-40 pointer-events-none" />

					<div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
						<div className="flex items-center gap-6">
							<div
								className="size-16 flex items-center justify-center bg-primary/10 text-primary transition-transform hover:scale-110"
								style={{ clipPath: clipHex }}
							>
								<UsersIcon className="size-8" />
							</div>
							<div className="space-y-1">
								<h2 className="text-2xl font-black uppercase tracking-widest text-foreground">
									{team.name}
								</h2>
								<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
									TEAM_NODE_IDENTIFIER: {team.id.toUpperCase().split("-")[0]}
								</p>
								{team.description && (
									<p className="text-[11px] font-medium text-muted-foreground italic max-w-md">
										"{team.description}"
									</p>
								)}
							</div>
						</div>

						<div className="flex flex-wrap gap-4">
							<div
								className="px-6 py-4 bg-muted/10 border border-border/10 text-center space-y-1"
								style={{ clipPath: clipPath8 }}
							>
								<p className="text-2xl font-black font-mono text-foreground">
									{team.members.length}
								</p>
								<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">
									TOTAL_NODES
								</p>
							</div>
							<div
								className="px-6 py-4 bg-primary/5 border border-primary/20 text-center space-y-1"
								style={{ clipPath: clipPath8 }}
							>
								<p className="text-2xl font-black font-mono text-primary">
									{membersWithStrengthsCount}
								</p>
								<p className="text-[8px] font-black uppercase tracking-widest text-primary/60">
									SYNCED_NODES
								</p>
							</div>
						</div>
					</div>

					{membersWithStrengthsCount < team.members.length && (
						<div className="mt-8 flex items-center gap-3 px-4 py-2 bg-amber-500/5 border-l-2 border-amber-500/40 text-[9px] font-black uppercase tracking-widest text-amber-500/80">
							<AlertTriangleIcon className="size-3" />
							PROCESANDO_CON_DATOS_FRAGMENTADOS:{" "}
							{team.members.length - membersWithStrengthsCount}{" "}
							NODOS_SIN_CRÍTICA
						</div>
					)}
				</div>
			</div>

			{/* Generate/Regenerate Section */}
			{!report && (
				<div className="p-px bg-border/40" style={{ clipPath: clipPath16 }}>
					<div
						className="bg-background/95 p-8 space-y-6 relative overflow-hidden"
						style={{ clipPath: clipPath16 }}
					>
						<div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full translate-x-1/2 translate-y-1/2" />

						<div className="relative z-10 space-y-4">
							<div className="space-y-1">
								<h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">
									DATA_SYNTHESIS_INITIATOR
								</h3>
								<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
									SINTETIZAR_NUEVA_MATRIZ_DE_EQUIPO_BASADA_EN_GPT-4O_MODELING
								</p>
							</div>

							<div className="p-4 bg-muted/5 border border-border/10 border-l-2 border-l-primary/40 space-y-3">
								<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 leading-relaxed">
									PRECAUCIÓN: LA_SÍNTESIS_CONSUME_X_RECURSOS_DE_MODELO.
									REGENERACIÓN_DISPONIBLE_CADA_30_DÍAS_SALA_LIMITACIÓN_DE_CACHE.
								</p>
							</div>

							{error && (
								<div className="p-3 bg-red-500/10 border border-red-500/20 text-[9px] font-black uppercase tracking-widest text-red-500">
									ERROR_SÍNTESIS: {error.toUpperCase()}
								</div>
							)}

							{isPending && (
								<div
									className="p-4 bg-primary/5 border border-primary/10 flex items-center gap-6"
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
											SINTETIZANDO_COMPOSICIÓN_NEURAL...
										</p>
										<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-none">
											PROCESS_TIME: 60-90_SECONDS {"//"} CPU_STRAIN: MODERATE
										</p>
									</div>
								</div>
							)}

							<Button
								onClick={() => handleGenerate(false)}
								disabled={isPending}
								size="lg"
								className="gap-3 group/btn relative overflow-hidden h-12"
								style={{ clipPath: clipPath8 }}
							>
								<div className="absolute inset-0 bg-primary/20 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500" />
								<span className="relative z-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
									<SparklesIcon className="size-4" />
									INICIAR_SÍNTESIS_DE_EQUIPO
								</span>
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Report Content */}
			{report && (
				<>
					{/* Executive Summary HUD */}
					<div className="p-px bg-border/40" style={{ clipPath: clipPath16 }}>
						<div
							className="bg-background/95 backdrop-blur-md overflow-hidden relative"
							style={{ clipPath: clipPath16 }}
						>
							<div className="p-8 border-b border-border/40 bg-linear-to-r from-primary/5 to-transparent space-y-4">
								<div className="flex flex-wrap items-center justify-between gap-4">
									<div className="flex items-center gap-4">
										<div
											className="px-3 py-1 bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-[0.2em]"
											style={{ clipPath: clipPath8 }}
										>
											{report.summary.teamArchetype}
										</div>
										<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 font-mono">
											NODES_ANALYZED: {report.summary.memberCount}
										</p>
									</div>
									<div className="px-3 py-1 bg-muted/20 border border-border/40 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
										<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
										PHASE: STABLE_EQUILIBRIUM
									</div>
								</div>
								<h3 className="text-3xl font-black uppercase tracking-[0.05em] text-foreground leading-[1.1]">
									{report.summary.headline}
								</h3>
							</div>

							<div className="p-8 space-y-12">
								<div
									className="relative p-8 bg-muted/10 border border-border/10"
									style={{ clipPath: clipPath12 }}
								>
									<div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
										<BrainIcon className="size-24" />
									</div>
									<p className="relative z-10 text-sm font-medium text-foreground/80 leading-relaxed italic border-l-2 border-primary/20 pl-8">
										{report.summary.overview}
									</p>
								</div>

								<div className="grid gap-8 md:grid-cols-2">
									<div
										className="group/metric p-6 bg-emerald-500/5 border border-emerald-500/20 relative"
										style={{ clipPath: clipPath8 }}
									>
										<div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 transition-all group-hover/metric:w-2" />
										<div className="space-y-3">
											<div className="flex items-center gap-3">
												<div
													className="size-8 bg-emerald-500/10 flex items-center justify-center text-emerald-500"
													style={{ clipPath: clipHex }}
												>
													<ZapIcon className="size-4" />
												</div>
												<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
													TEAM_SUPERPOWER_NODE
												</h4>
											</div>
											<p className="text-xs font-bold uppercase tracking-widest text-foreground/80 leading-relaxed">
												{report.summary.superpower}
											</p>
										</div>
									</div>

									<div
										className="group/metric p-6 bg-amber-500/5 border border-amber-500/20 relative"
										style={{ clipPath: clipPath8 }}
									>
										<div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 transition-all group-hover/metric:w-2" />
										<div className="space-y-3">
											<div className="flex items-center gap-3">
												<div
													className="size-8 bg-amber-500/10 flex items-center justify-center text-amber-500"
													style={{ clipPath: clipHex }}
												>
													<TargetIcon className="size-4" />
												</div>
												<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
													PRIMARY_NODE_DEVIATION
												</h4>
											</div>
											<p className="text-xs font-bold uppercase tracking-widest text-foreground/80 leading-relaxed">
												{report.summary.primaryChallenge}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Culture Map Section */}
					<ReportSection
						title="CULTURAL_NODE_MAPPING"
						description="Localización de la dinámica del equipo en el espectro conductual_"
						icon={<BrainIcon className="size-6 text-primary" />}
						defaultOpen={false}
					>
						<div className="p-px bg-border/40" style={{ clipPath: clipPath16 }}>
							<div
								className="bg-background/95 p-8 relative overflow-hidden"
								style={{ clipPath: clipPath16 }}
							>
								<div className="absolute inset-0 bg-grid-tech/5 opacity-40 pointer-events-none" />

								<div className="relative z-10 flex flex-col lg:flex-row gap-12">
									{/* Culture Identity Card */}
									<div className="lg:w-1/2 space-y-8">
										<div className="flex items-start justify-between">
											<div className="space-y-1">
												<div className="flex items-center gap-3">
													<div className="text-3xl">
														{getCultureEmoji(report.cultureMap.culture)}
													</div>
													<h3 className="text-xl font-black uppercase tracking-widest text-foreground">
														{report.cultureMap.cultureEs}
													</h3>
												</div>
												<p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60">
													DOMINANT_IDENTITY:{" "}
													{report.cultureMap.culture.toUpperCase()}
												</p>
											</div>
										</div>

										<p className="text-xs font-medium text-muted-foreground/80 leading-relaxed italic border-l border-border/20 pl-4">
											{report.cultureMap.description}
										</p>

										<div className="space-y-4">
											<p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
												NODE_IMPLICATIONS_REGISTRY
											</p>
											<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
												{report.cultureMap.implications.map((impl, i) => (
													<div
														key={i}
														className="flex items-start gap-3 p-3 bg-muted/5 border border-border/10 text-[10px] font-bold uppercase tracking-widest text-foreground/70"
														style={{ clipPath: clipPath8 }}
													>
														<span className="text-primary mt-1 opacity-40">
															[ NODE_{i + 1} ]
														</span>
														<span>{impl}</span>
													</div>
												))}
											</div>
										</div>
									</div>

									{/* Axes Metrics HUD */}
									<div className="lg:w-1/2 grid grid-cols-1 gap-6">
										<div
											className="p-6 bg-muted/5 border border-border/10 space-y-6"
											style={{ clipPath: clipPath8 }}
										>
											<div className="space-y-4">
												<div className="flex items-center justify-between text-[10px] font-black tracking-widest uppercase">
													<span className="text-muted-foreground">ACTION</span>
													<span className="text-foreground">REFLEXIÓN</span>
												</div>
												<div className="flex items-center gap-4">
													<span className="text-lg font-black font-mono text-primary">
														{report.cultureMap.energyAxis.action}%
													</span>
													<div
														className="flex-1 h-3 bg-muted/20 relative"
														style={{
															clipPath:
																"polygon(0 0, 100% 0, 100% 100%, 0 100%)",
														}}
													>
														<div
															className="h-full bg-primary relative"
															style={{
																width: `${report.cultureMap.energyAxis.action}%`,
															}}
														>
															<div className="absolute right-0 top-0 bottom-0 w-1 bg-white/40" />
														</div>
													</div>
													<span className="text-lg font-black font-mono text-foreground">
														{report.cultureMap.energyAxis.reflection}%
													</span>
												</div>
											</div>

											<div className="space-y-4">
												<div className="flex items-center justify-between text-[10px] font-black tracking-widest uppercase">
													<span className="text-muted-foreground">
														RESULTADOS
													</span>
													<span className="text-foreground">PERSONAS</span>
												</div>
												<div className="flex items-center gap-4">
													<span className="text-lg font-black font-mono text-primary">
														{report.cultureMap.orientationAxis.results}%
													</span>
													<div className="flex-1 h-3 bg-muted/20 relative">
														<div
															className="h-full bg-primary relative"
															style={{
																width: `${report.cultureMap.orientationAxis.results}%`,
															}}
														>
															<div className="absolute right-0 top-0 bottom-0 w-1 bg-white/40" />
														</div>
													</div>
													<span className="text-lg font-black font-mono text-foreground">
														{report.cultureMap.orientationAxis.people}%
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</ReportSection>

					{/* Domain Coverage */}
					<ReportSection
						title="DOMAIN_COVERAGE_MATRIX"
						description="Distribución de fortalezas en los cuatro dominios conductuales_"
						icon={<TargetIcon className="size-6 text-primary" />}
						defaultOpen={false}
					>
						<DomainCoverageChart domains={report.domainCoverage} />
					</ReportSection>

					{/* Member Summaries */}
					<ReportSection
						title="ACTIVE_EQUIPMENT_NODES"
						description="Perfilado técnico de contribuciones individuales a la dinámica de grupo_"
						icon={<UsersIcon className="size-6 text-primary" />}
						defaultOpen={false}
					>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{report.memberSummaries.map((member) => (
								<TeamMemberCard
									key={member.memberId}
									name={member.memberName}
									role={member.role}
									topStrengths={member.topStrengths}
									primaryDomain={member.primaryDomain}
									uniqueContribution={member.uniqueContribution}
								/>
							))}
						</div>
					</ReportSection>

					{/* Top Synergies Section */}
					<ReportSection
						title="NEURAL_PAIR_SYNERGIES"
						description="Detección de acoplamientos de alto impacto para misiones críticas_"
						icon={<SparklesIcon className="size-6 text-primary" />}
					>
						<div className="grid gap-8 md:grid-cols-2">
							{report.topSynergies.map((synergy, i) => (
								<div
									key={i}
									className="p-px bg-border/40 hover:bg-primary/20 transition-all duration-300"
									style={{ clipPath: clipPath12 }}
								>
									<div
										className="bg-background/95 p-8 space-y-8 h-full flex flex-col relative overflow-hidden"
										style={{ clipPath: clipPath12 }}
									>
										<div className="absolute top-0 right-0 p-4">
											<div
												className={cn(
													"px-3 py-1 border text-[7px] font-black uppercase tracking-[2px]",
													synergy.synergyScore === "exceptional"
														? "bg-primary text-primary-foreground border-primary"
														: "bg-muted text-muted-foreground border-border/20",
												)}
											>
												SCORE: {synergy.synergyScore.toUpperCase()}
											</div>
										</div>

										<div className="space-y-6 flex-1">
											<div className="flex items-center gap-4">
												<div
													className="size-10 bg-primary/10 text-primary flex items-center justify-center shrink-0"
													style={{ clipPath: clipHex }}
												>
													<Box className="size-4" />
												</div>
												<h4 className="text-sm font-black uppercase tracking-widest text-foreground block">
													{synergy.pair[0]}{" "}
													<span className="text-primary opacity-40 mx-1">
														+
													</span>{" "}
													{synergy.pair[1]}
												</h4>
											</div>

											<div className="space-y-2">
												<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">
													COMPLEMENTARY_RESONANCE
												</p>
												<div className="flex flex-wrap gap-2">
													{synergy.complementaryStrengths.map((s) => (
														<Badge
															key={s}
															variant="outline"
															className="text-[8px] font-black uppercase tracking-widest rounded-none border-primary/20 bg-primary/5 text-foreground/80"
														>
															{s}
														</Badge>
													))}
												</div>
											</div>

											<div className="space-y-4 pt-4 border-t border-border/10">
												<div className="space-y-2">
													<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">
														OPERATIONAL_DEPLOYMENT
													</p>
													<ul className="space-y-2">
														{synergy.potentialProjects
															.slice(0, 2)
															.map((p, j) => (
																<li
																	key={j}
																	className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-foreground/70"
																>
																	<ChevronRight className="size-3 text-primary" />
																	{p}
																</li>
															))}
													</ul>
												</div>

												{synergy.watchOut && (
													<div className="p-3 bg-amber-500/5 border border-amber-500/20 text-[9px] font-bold uppercase tracking-widest text-amber-500 flex items-start gap-2">
														<AlertTriangleIcon className="size-3 shrink-0" />
														<span>CRITICAL_WARNING: {synergy.watchOut}</span>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</ReportSection>

					{/* Capability Gaps */}
					{report.capabilityGaps.length > 0 && (
						<ReportSection
							title="CAPABILITY_BREACH_LOGS"
							description="Detección de anomalías en la cobertura de competencias_"
							icon={<AlertTriangleIcon className="size-6 text-amber-500" />}
							defaultOpen={false}
						>
							<div className="grid gap-6 md:grid-cols-2">
								{report.capabilityGaps.map((gap, i) => (
									<div
										key={i}
										className="p-px bg-amber-500/20"
										style={{ clipPath: clipPath12 }}
									>
										<div
											className="bg-background/95 p-8 space-y-8 h-full relative overflow-hidden"
											style={{ clipPath: clipPath12 }}
										>
											<div className="absolute top-0 right-0 p-4">
												<div
													className={cn(
														"px-3 py-1 border text-[7px] font-black uppercase tracking-[2px]",
														gap.impact === "critical"
															? "bg-red-500 text-white border-red-500"
															: "bg-amber-500/10 text-amber-500 border-amber-500/20",
													)}
												>
													IMPACT: {gap.impact.toUpperCase()}
												</div>
											</div>

											<div className="space-y-6">
												<div className="flex items-center gap-4">
													<div
														className="size-10 bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0"
														style={{ clipPath: clipHex }}
													>
														<Activity className="size-4" />
													</div>
													<h4 className="text-sm font-black uppercase tracking-widest text-foreground">
														{gap.area}
													</h4>
												</div>

												<p className="text-[11px] font-medium text-muted-foreground leading-relaxed italic border-l border-amber-500/20 pl-4">
													{gap.currentCoverage}
												</p>

												<div className="space-y-4 pt-4 border-t border-border/10">
													<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">
														RECOVERY_ACTION_PROTOCOLS
													</p>
													<div className="space-y-3">
														{gap.recommendations.map((rec, j) => (
															<div key={j} className="space-y-1">
																<div className="flex items-center gap-2">
																	<div className="px-1.5 py-0.5 bg-muted text-[7px] font-black tracking-widest uppercase">
																		TYPE_{rec.type.toUpperCase()}
																	</div>
																</div>
																<p className="text-[10px] font-bold uppercase tracking-widest text-foreground/80 leading-relaxed pl-2 border-l border-border/10">
																	{rec.description}
																</p>
															</div>
														))}
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</ReportSection>
					)}

					{/* Insights Section */}
					<ReportSection
						title="EQUIPMENT_INSIGHT_DECRYPTION"
						description="Análisis neural de oportunidades de crecimiento para el grupo_"
						icon={<LightbulbIcon className="size-6 text-primary" />}
						defaultOpen={false}
					>
						<div className="grid gap-6 md:grid-cols-2">
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

					{/* Red Flags Section */}
					<ReportSection
						title="RISK_THRESHOLD_STRESS_TEST"
						description="Detección de vulnerabilidades críticas en la arquitectura del equipo_"
						icon={<ShieldAlertIcon className="size-6 text-red-500" />}
						defaultOpen={false}
					>
						<div className="grid gap-6 md:grid-cols-2">
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

					{/* Recommended Rituals Section */}
					<ReportSection
						title="OPERATIONAL_RITUAL_ENCODING"
						description="Protocolos recurrentes para mantener el equilibrio neural del equipo_"
						icon={<SparklesIcon className="size-6 text-primary" />}
						defaultOpen={false}
					>
						<div className="grid gap-8 md:grid-cols-2">
							{report.recommendedRituals.map((ritual, i) => (
								<div
									key={i}
									className="p-px bg-border/40 hover:bg-primary/20 transition-all duration-300"
									style={{ clipPath: clipPath12 }}
								>
									<div
										className="bg-background/95 p-8 space-y-8 h-full flex flex-col relative overflow-hidden"
										style={{ clipPath: clipPath12 }}
									>
										<div className="absolute top-0 right-0 p-4">
											<div className="px-3 py-1 bg-muted/20 border border-border/40 text-[7px] font-black uppercase tracking-[2px] text-muted-foreground/60">
												FREQ: {ritual.frequency.toUpperCase()}
											</div>
										</div>

										<div className="space-y-6 flex-1">
											<div className="flex items-center gap-4">
												<div
													className="size-10 bg-primary/10 text-primary flex items-center justify-center shrink-0"
													style={{ clipPath: clipHex }}
												>
													<Cpu className="size-4" />
												</div>
												<div className="space-y-0.5">
													<h4 className="text-sm font-black uppercase tracking-widest text-foreground">
														{ritual.name}
													</h4>
													<p className="text-[8px] font-bold uppercase tracking-widest text-primary/60">
														PROTOCOL_OBJECTIVE:{" "}
														{ritual.targetDomain.toUpperCase()}
													</p>
												</div>
											</div>

											<p className="text-[11px] font-medium text-muted-foreground/80 leading-relaxed italic border-l border-border/20 pl-4">
												{ritual.purpose}
											</p>

											<div className="space-y-4 pt-4 border-t border-border/10">
												<div className="flex items-center justify-between text-[7px] font-black tracking-widest uppercase text-muted-foreground/40">
													<span>EXECUTION_STEPS</span>
													<span>DURATION: {ritual.duration.toUpperCase()}</span>
												</div>
												<ol className="space-y-3">
													{ritual.steps.map((step, j) => (
														<li
															key={j}
															className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-foreground/70 group/ritual-step"
														>
															<span className="text-primary opacity-40 font-black tabular-nums">
																{String(j + 1).padStart(2, "0")}
															</span>
															<span>{step}</span>
														</li>
													))}
												</ol>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</ReportSection>

					{/* Action Plan Section */}
					<ReportSection
						title="STRATEGIC_DEPLOYMENT_PLAN"
						description="Hoja de ruta trimestral para la optimización de activos del equipo_"
						icon={<RocketIcon className="size-6 text-primary" />}
						defaultOpen={false}
					>
						<ActionPlanCard
							immediate={report.actionPlan.immediate}
							shortTerm={report.actionPlan.shortTerm}
							longTerm={report.actionPlan.longTerm}
						/>
						{report.actionPlan.hiringPriorities &&
							report.actionPlan.hiringPriorities.length > 0 && (
								<div
									className="p-px bg-border/40 mt-6"
									style={{ clipPath: clipPath12 }}
								>
									<div
										className="bg-background/95 p-8 relative overflow-hidden"
										style={{ clipPath: clipPath12 }}
									>
										<div className="absolute inset-0 bg-grid-tech/5 pointer-events-none" />
										<div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
											<div className="space-y-1">
												<h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">
													NODES_ACQUISITION_PRIORITY
												</h4>
												<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">
													PERFILES_Y_FORTALEZAS_A_INCUBAR_DISEÑADOS_PARA_EQUILIBRIO_CORE
												</p>
											</div>
											<div className="flex flex-wrap gap-2 md:justify-end max-w-lg">
												{report.actionPlan.hiringPriorities.map((strength) => (
													<Badge
														key={strength}
														variant="default"
														className="bg-primary/90 text-primary-foreground text-[8px] font-black uppercase tracking-widest rounded-none px-3 py-1 border-transparent"
													>
														{strength}
													</Badge>
												))}
											</div>
										</div>
									</div>
								</div>
							)}
					</ReportSection>
				</>
			)}
		</div>
	);
}

function getCultureEmoji(culture: string): string {
	switch (culture) {
		case "Execution":
			return "🚀";
		case "Influence":
			return "✨";
		case "Strategy":
			return "🧠";
		case "Cohesion":
			return "💚";
		default:
			return "📊";
	}
}
