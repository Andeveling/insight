/** biome-ignore-all lint/suspicious/noArrayIndexKey: explanation */
"use client";

import {
	BookOpenIcon,
	CheckCircle2Icon,
	HeartHandshakeIcon,
	LightbulbIcon,
	MessageCircleIcon,
	RefreshCwIcon,
	SparklesIcon,
	TargetIcon,
	ThumbsDownIcon,
	ThumbsUpIcon,
	UsersIcon,
	XCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
	ClippedContainer,
	HexIcon,
	NodeIdBadge,
	PhaseLabel,
	ProtocolBadge,
	SectionBadge,
	StatusBadge,
	StrengthTag,
	TechGridBackground,
} from "@/components/cyber-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";
import { CLIP_PATHS } from "@/lib/constants/clip-paths";
import { getDaysUntilRegenerate } from "@/lib/utils";
import { generateTeamTips } from "../../_actions/generate-team-tips.action";
import { Loader } from "../../_components/loader";
import type { TeamTipsReport } from "../../_schemas/team-tips.schema";

interface TeamTipsViewProps {
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
	};
	team: {
		id: string;
		name: string;
		description: string | null;
		role: string | null;
	} | null;
	teammates: Array<{
		id: string;
		name: string;
		role: string | null;
		career: string | null;
		strengths: Array<{
			rank: number;
			name: string;
			nameEs: string;
			domain: string;
		}>;
	}>;
	hasStrengths: boolean;
	existingReport: {
		id: string;
		version: number;
		createdAt: Date;
		modelUsed: string | null;
		content: TeamTipsReport | null;
		metadata: Record<string, unknown> | null;
	} | null;
}

export function TeamTipsView({
	user,
	team,
	teammates,
	hasStrengths,
	existingReport,
}: TeamTipsViewProps) {
	const [isPending, startTransition] = useTransition();
	const [report] = useState<TeamTipsReport | null>(
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
		if (!team) return;

		setError(null);
		setRegenerateMessage(null);
		startTransition(async () => {
			const result = await generateTeamTips({
				userId: user.id,
				teamId: team.id,
				forceRegenerate,
			});

			if (!result.success) {
				setError(result.error ?? "Error al generar el reporte");
				return;
			}

			if (result.fromCache && result.regenerateMessage) {
				setRegenerateMessage(result.regenerateMessage);
				return;
			}

			window.location.reload();
		});
	};

	// No team assigned
	if (!team) {
		return (
			<div className="max-w-xl mx-auto py-24">
				<ClippedContainer
					size="large"
					borderColor="warning"
					borderOpacity={30}
					padding="p-12"
					innerClassName="text-center space-y-8"
				>
					<div className="flex justify-center">
						<HexIcon icon={UsersIcon} color="warning" size="xl" animated />
					</div>
					<div className="space-y-3">
						<h3 className="text-2xl font-black uppercase tracking-[0.3em] text-foreground">
							NODE_CONNECTION_REQUIRED
						</h3>
						<div className="h-px w-24 bg-warning/30 mx-auto" />
						<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 leading-relaxed max-w-sm mx-auto">
							PARA_SINCRO_INTERPERSONAL_ES_OBLIGATORIO_CONECTARSE_A_UN_NODO_DE_EQUIPO_ACTIVO.
							ESTABLEZCA_LA_ESTRUCTURA_DE_RED_EN_EL_TERMINAL.
						</p>
					</div>
					<Button
						asChild
						className="h-14 px-10 border border-warning/20 bg-warning/10 text-warning hover:bg-warning/20 transition-all duration-300"
						style={{ clipPath: CLIP_PATHS.medium }}
					>
						<Link href="/dashboard/team" className="text-[10px] font-black uppercase tracking-[0.2em]">
							ESTABLECER_CONEXIÓN_DE_NODO
						</Link>
					</Button>
				</ClippedContainer>
			</div>
		);
	}

	// No strengths assigned
	if (!hasStrengths) {
		return (
			<div className="max-w-xl mx-auto py-24">
				<ClippedContainer
					size="large"
					borderColor="primary"
					borderOpacity={30}
					padding="p-12"
					innerClassName="text-center space-y-8"
				>
					<div className="flex justify-center">
						<HexIcon icon={SparklesIcon} color="primary" size="xl" animated />
					</div>
					<div className="space-y-3">
						<h3 className="text-2xl font-black uppercase tracking-[0.3em] text-foreground">
							CORE_AUTH_PENDING
						</h3>
						<div className="h-px w-24 bg-primary/30 mx-auto" />
						<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 leading-relaxed max-w-sm mx-auto">
							DATOS_DE_TALENTO_NO_ENCONTRADOS_EN_LACORE_DATABASE.
							COMPLETE_LA_EVALUACIÓN_NEURAL_DE_FORTALEZAS_PARA_DBC_SINCRO.
						</p>
					</div>
					<Button
						asChild
						className="h-14 px-10 border border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-300"
						style={{ clipPath: CLIP_PATHS.medium }}
					>
						<Link href="/dashboard/profile" className="text-[10px] font-black uppercase tracking-[0.2em]">
							INICIAR_CALIBRACIÓN_NEURAL
						</Link>
					</Button>
				</ClippedContainer>
			</div>
		);
	}

	// No teammates with strengths
	if (teammates.length === 0) {
		return (
			<div className="max-w-xl mx-auto py-24">
				<ClippedContainer
					size="large"
					borderColor="destructive"
					borderOpacity={30}
					padding="p-12"
					innerClassName="text-center space-y-8"
				>
					<div className="flex justify-center">
						<HexIcon icon={UsersIcon} color="destructive" size="xl" animated />
					</div>
					<div className="space-y-3">
						<h3 className="text-2xl font-black uppercase tracking-[0.3em] text-foreground">
							DATA_VACUUM_DETECTED
						</h3>
						<div className="h-px w-24 bg-destructive/30 mx-auto" />
						<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 leading-relaxed max-w-sm mx-auto">
							SUS_NODOS_ADYACENTES_NO_HAN_SIDO_CALIBRADOS.
							TODOS_LOS_MIEMBROS_DEBEN_CARGAR_SU_PERFIL_DE_TALENTO_PARA_HABILITAR_SINCRO.
						</p>
					</div>
					<Button
						asChild
						variant="outline"
						className="h-14 px-10 border border-destructive/20 text-destructive hover:bg-destructive/10 transition-all duration-300"
						style={{ clipPath: CLIP_PATHS.medium }}
					>
						<Link href="/dashboard/team" className="text-[10px] font-black uppercase tracking-[0.2em]">
							NOTIFICAR_NODOS_DE_EQUIPO
						</Link>
					</Button>
				</ClippedContainer>
			</div>
		);
	}

	return (
		<div className="space-y-8 py-4">
			{/* Generate/Regenerate Section */}
			{!report && (
				<ClippedContainer
					size="large"
					borderColor="primary"
					borderOpacity={30}
					padding="p-0"
					className="relative group overflow-hidden"
				>
					<TechGridBackground opacity={10} hoverOpacity={20} />
					<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

					<div className="p-12 relative space-y-10">
						<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
							<div className="space-y-6">
								<div className="flex items-center gap-6">
									<HexIcon
										icon={HeartHandshakeIcon}
										color="primary"
										size="lg"
										animated
									/>
									<div className="space-y-1">
										<h2 className="text-3xl font-black uppercase tracking-[.3em] text-foreground">
											COLLABORATION_ENGINE
										</h2>
										<div className="flex items-center gap-2">
											<span className="text-[10px] font-bold uppercase tracking-widest text-primary">
												[SYSTEM_INITIATOR_V2.4]
											</span>
											<div className="h-px w-12 bg-primary/30" />
										</div>
									</div>
								</div>
								<p className="text-[11px] font-semibold text-muted-foreground/80 leading-relaxed max-w-2xl border-l border-primary/20 pl-6 uppercase tracking-widest">
									LA_IA_ANALIZARÁ_SUS_NIVELES_DE_RESONANCIA_COLECTIVA_BASADO_EN_CADA_NODO_DE_EQUIPO_ACTIVO.
									GENERANDO_PROTOCOLOS_DE_COLABORACIÓN_Y_RECOMENDACIONES_TÉCNICAS.
								</p>
							</div>

							<Button
								onClick={() => handleGenerate(false)}
								disabled={isPending}
								size="lg"
								className={cn(
									"h-20 px-12 gap-4 relative overflow-hidden group/btn border border-primary/30 bg-primary/10 hover:bg-primary/20",
									!isPending &&
										"shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.2)]",
								)}
								style={{ clipPath: CLIP_PATHS.medium }}
							>
								<div className="absolute inset-0 bg-primary -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-700 opacity-20" />
								<span className="relative z-10 flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-primary">
									{isPending ? (
										<>
											<Loader className="size-6 animate-spin" />
											ANALYZING_TEAM_DYNAMICS...
										</>
									) : (
										<>
											<SparklesIcon className="size-6" />
											INICIAR_SÍNTESIS_DE_EQUIPO
										</>
									)}
								</span>
							</Button>
						</div>

						{error && (
							<ClippedContainer
								size="small"
								noBorder
								padding="p-4"
								backdropBlur={false}
								backgroundColor="destructive"
								backgroundOpacity={10}
								className="border border-destructive/20 text-destructive text-[10px] font-black uppercase tracking-widest"
							>
								[CRITICAL_CORE_ERROR]: {error.toUpperCase()}
							</ClippedContainer>
						)}
					</div>
				</ClippedContainer>
			)}

			{/* Report Content */}
			{report && (
				<div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
					{/* Personal Summary */}
					<section className="space-y-8">
						<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-6 relative">
							<div className="absolute bottom-0 left-0 w-32 h-0.5 bg-primary" />
							<div className="space-y-2">
								<div className="flex items-center gap-3">
									<div className="relative size-10 flex items-center justify-center">
										<div
											className="absolute inset-0 bg-primary/20"
											style={{ clipPath: CLIP_PATHS.hex }}
										/>
										<div
											className="absolute inset-px bg-background/50 flex items-center justify-center text-primary"
											style={{ clipPath: CLIP_PATHS.hex }}
										>
											<UsersIcon className="size-5" />
										</div>
									</div>
									<h2 className="text-xl font-black uppercase tracking-[0.3em] text-foreground">
										USER_NODE_SYNOPSIS
									</h2>
								</div>
								<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
									ANÁLISIS_DE_TU_IMPACTO_EN_LA_MATRIZ_OPERATIVA_DE_EQUIPO
								</p>
							</div>
							<div 
								className="flex items-center gap-2 px-3 py-1 bg-muted/10 border border-border/20 text-[9px] font-black uppercase tracking-widest text-muted-foreground"
								style={{ clipPath: CLIP_PATHS.small }}
							>
								NODE_ID: {user.id.slice(0, 8).toUpperCase()}
							</div>
						</div>

						<div
							className="p-px bg-border/40 relative group"
							style={{ clipPath: CLIP_PATHS.large }}
						>
							<div className="absolute inset-0 bg-grid-tech/5 pointer-events-none" />
							<div
								className="bg-background/95 backdrop-blur-md overflow-hidden"
								style={{ clipPath: CLIP_PATHS.large }}
							>
								<div className="bg-muted/5 border-b border-border/40 p-8">
									<h3 className="text-2xl font-black uppercase tracking-widest text-foreground mb-1">
										{report.personalSummary.headline}
									</h3>
									<p className="text-[10px] font-bold uppercase tracking-widest text-primary">
										TEAM_ALIGNMENT:{" "}
										{report.personalSummary.teamName.toUpperCase()}
									</p>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/20">
									<div className="p-8 space-y-4 group/item hover:bg-primary/5 transition-colors">
										<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
											<div
												className="size-1.5 bg-primary/40 group-hover/item:bg-primary"
												style={{ clipPath: CLIP_PATHS.hex }}
											/>
											RESONANCE_CONTEXT
										</h4>
										<p className="text-xs font-semibold uppercase tracking-widest text-foreground/80 leading-relaxed">
											{report.personalSummary.yourStrengthsInTeamContext}
										</p>
									</div>
									<div className="p-8 space-y-4 group/item hover:bg-primary/5 transition-colors">
										<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
											<div
												className="size-1.5 bg-primary/40 group-hover/item:bg-primary"
												style={{ clipPath: CLIP_PATHS.hex }}
											/>
											NATURAL_NODE_ROLE
										</h4>
										<p className="text-xs font-semibold uppercase tracking-widest text-foreground/80 leading-relaxed">
											{report.personalSummary.naturalRole}
										</p>
									</div>
									<div className="p-8 space-y-4 group/item hover:bg-primary/5 transition-colors">
										<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
											<div
												className="size-1.5 bg-primary/40 group-hover/item:bg-primary"
												style={{ clipPath: CLIP_PATHS.hex }}
											/>
											EVOLUTION_PROTOCOL
										</h4>
										<p className="text-xs font-semibold uppercase tracking-widest text-foreground/80 leading-relaxed">
											{report.personalSummary.growthOpportunity}
										</p>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Member Tips */}
					<section className="space-y-8">
						<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-6 relative">
							<div className="absolute bottom-0 left-0 w-32 h-0.5 bg-blue-500" />
							<div className="space-y-2">
								<div className="flex items-center gap-3">
									<div className="relative size-10 flex items-center justify-center">
										<div
											className="absolute inset-0 bg-blue-500/20"
											style={{ clipPath: CLIP_PATHS.hex }}
										/>
										<div
											className="absolute inset-px bg-background/50 flex items-center justify-center text-blue-500"
											style={{ clipPath: CLIP_PATHS.hex }}
										>
											<MessageCircleIcon className="size-5" />
										</div>
									</div>
									<h2 className="text-xl font-black uppercase tracking-[0.3em] text-foreground">
										TEAMMATE_RESONANCE_DATA
									</h2>
								</div>
								<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
									SINCRO_PERSONALIZADA_CON_NODOS_ADYACENTES
								</p>
							</div>
						</div>

						<div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
							{report.memberTips.map((member) => (
								<MemberTipCard key={member.memberId} member={member} />
							))}
						</div>
					</section>

					{/* Communication Strategies */}
					<section className="space-y-8">
						<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-6 relative">
							<div className="absolute bottom-0 left-0 w-32 h-0.5 bg-[hsl(var(--highlight))]" />
							<div className="space-y-2">
								<div className="flex items-center gap-3">
									<div className="relative size-10 flex items-center justify-center">
										<div
											className="absolute inset-0 bg-[hsl(var(--highlight))]/20"
											style={{ clipPath: CLIP_PATHS.hex }}
										/>
										<div
											className="absolute inset-px bg-background/50 flex items-center justify-center text-[hsl(var(--highlight))]"
											style={{ clipPath: CLIP_PATHS.hex }}
										>
											<LightbulbIcon className="size-5" />
										</div>
									</div>
									<h2 className="text-xl font-black uppercase tracking-[0.3em] text-foreground">
										INTERACTION_STRATEGY_MATRIX
									</h2>
								</div>
								<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
									PROTOCOLOS_DE_COMUNICACIÓN_MULTIMODAL
								</p>
							</div>
						</div>

						<div className="p-px bg-border/40" style={{ clipPath: CLIP_PATHS.large }}>
							<div
								className="bg-background/95 backdrop-blur-md p-8 overflow-hidden relative"
								style={{ clipPath: CLIP_PATHS.large }}
							>
								<div className="absolute inset-0 bg-grid-tech/5 pointer-events-none" />

								<div className="relative z-10 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
									<div className="space-y-6">
										<div className="flex items-center gap-3 border-b border-border/20 pb-3">
											<UsersIcon className="size-4 text-primary" />
											<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
												SYNC_MEETINGS
											</h4>
										</div>
										<ul className="space-y-4">
											{report.communicationStrategies.inMeetings.map(
												(tip, i) => (
													<li key={i} className="flex items-start gap-3 group">
														<div
															className="mt-1.5 size-1.5 shrink-0 bg-primary/40 group-hover:bg-primary transition-colors"
															style={{ clipPath: CLIP_PATHS.hex }}
														/>
														<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
															{tip}
														</span>
													</li>
												),
											)}
										</ul>
									</div>

									<div className="space-y-6">
										<div className="flex items-center gap-3 border-b border-border/20 pb-3">
											<TargetIcon className="size-4 text-primary" />
											<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
												CONFLICT_RESOLUTION
											</h4>
										</div>
										<ul className="space-y-4">
											{report.communicationStrategies.inConflicts.map(
												(tip, i) => (
													<li key={i} className="flex items-start gap-3 group">
														<div
															className="mt-1.5 size-1.5 shrink-0 bg-primary/40 group-hover:bg-primary transition-colors"
															style={{ clipPath: CLIP_PATHS.hex }}
														/>
														<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
															{tip}
														</span>
													</li>
												),
											)}
										</ul>
									</div>

									<div className="space-y-6">
										<div className="flex items-center gap-3 border-b border-border/20 pb-3">
											<SparklesIcon className="size-4 text-primary" />
											<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
												COLLECTIVE_PEAK
											</h4>
										</div>
										<ul className="space-y-4">
											{report.communicationStrategies.inCelebrations.map(
												(tip, i) => (
													<li key={i} className="flex items-start gap-3 group">
														<div
															className="mt-1.5 size-1.5 shrink-0 bg-primary/40 group-hover:bg-primary transition-colors"
															style={{ clipPath: CLIP_PATHS.hex }}
														/>
														<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
															{tip}
														</span>
													</li>
												),
											)}
										</ul>
									</div>

									<div className="space-y-6">
										<div className="flex items-center gap-3 border-b border-border/20 pb-3">
											<MessageCircleIcon className="size-4 text-primary" />
											<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
												DAILY_OPERATIONS
											</h4>
										</div>
										<ul className="space-y-4">
											{report.communicationStrategies.dailyInteractions.map(
												(tip, i) => (
													<li key={i} className="flex items-start gap-3 group">
														<div
															className="mt-1.5 size-1.5 shrink-0 bg-primary/40 group-hover:bg-primary transition-colors"
															style={{ clipPath: CLIP_PATHS.hex }}
														/>
														<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
															{tip}
														</span>
													</li>
												),
											)}
										</ul>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Team Considerations */}
					<section className="space-y-8">
						<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-6 relative">
							<div className="absolute bottom-0 left-0 w-32 h-0.5 bg-[hsl(var(--insight))]" />
							<div className="space-y-2">
								<div className="flex items-center gap-3">
									<div className="relative size-10 flex items-center justify-center">
										<div
											className="absolute inset-0 bg-[hsl(var(--insight))]/20"
											style={{ clipPath: CLIP_PATHS.hex }}
										/>
										<div
											className="absolute inset-px bg-background/50 flex items-center justify-center text-[hsl(var(--insight))]"
											style={{ clipPath: CLIP_PATHS.hex }}
										>
											<TargetIcon className="size-5" />
										</div>
									</div>
									<h2 className="text-xl font-black uppercase tracking-[0.3em] text-foreground">
										SYSTEM_OPERATIONAL_LOGS
									</h2>
								</div>
								<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
									DIRECTIVAS_DE_EQUIPO_Y_CALIBRACIÓN_COLECTIVA
								</p>
							</div>
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							{report.teamConsiderations.map((consideration, i) => (
								<div
									key={i}
									className="p-px bg-border/20 hover:bg-[hsl(var(--insight))]/20 transition-all duration-300 group/cons"
									style={{ clipPath: CLIP_PATHS.medium }}
								>
									<div
										className="bg-background/95 p-8 flex flex-col h-full space-y-6 relative overflow-hidden"
										style={{ clipPath: CLIP_PATHS.medium }}
									>
										<div className="absolute top-0 right-0 p-4">
											<div 
												className="px-2 py-0.5 border border-purple-500/30 bg-insight/5 text-insight text-[8px] font-black uppercase tracking-widest"
												style={{ clipPath: CLIP_PATHS.small }}
											>
												PROTOCOL_ID: {i + 1}
											</div>
										</div>
										<div className="space-y-2">
											<h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground group-hover/cons:text-[hsl(var(--insight))] transition-colors">
												{consideration.title.toUpperCase()}
											</h3>
											<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
												{consideration.description}
											</p>
										</div>

										<div className="space-y-4 pt-4 border-t border-border/10">
											<div className="space-y-1">
												<span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">
													CUÁNDO_APLICAR
												</span>
												<p className="text-[10px] font-bold uppercase tracking-widest text-foreground/80 leading-relaxed border-l border-purple-500/30 pl-3">
													{consideration.whenToApply}
												</p>
											</div>
											<div className="space-y-3">
												<span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">
													ACCIONES_CLAVE
												</span>
												<ul className="grid grid-cols-1 gap-2">
													{consideration.actionItems.map((item, j) => (
														<li
															key={j}
															className="flex items-center gap-3 group/item"
														>
															<div
																className="size-1 bg-[hsl(var(--insight))]/40 group-hover/item:bg-[hsl(var(--insight))] transition-colors"
																style={{ clipPath: CLIP_PATHS.hex }}
															/>
															<span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground group-hover/item:text-foreground transition-colors">
																{item}
															</span>
														</li>
													))}
												</ul>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</section>

					{/* Book Recommendations */}
					<section className="space-y-8">
						<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-6 relative">
							<div className="absolute bottom-0 left-0 w-32 h-0.5 bg-accent" />
							<div className="space-y-2">
								<div className="flex items-center gap-3">
									<div className="relative size-10 flex items-center justify-center">
										<div
											className="absolute inset-0 bg-accent/20"
											style={{ clipPath: CLIP_PATHS.hex }}
										/>
										<div
											className="absolute inset-px bg-background/50 flex items-center justify-center text-accent"
											style={{ clipPath: CLIP_PATHS.hex }}
										>
											<BookOpenIcon className="size-5" />
										</div>
									</div>
									<h2 className="text-xl font-black uppercase tracking-[0.3em] text-foreground">
										NEURAL_ENRICHMENT_LIBRARY
									</h2>
								</div>
								<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
									RECURSOS_DE_APRENDIZAJE_PARA_OPTIMIZACIÓN_TÉCNICA
								</p>
							</div>
						</div>

						{/* Personal Books */}
						<div className="space-y-6">
							<div className="flex items-center gap-3">
								<div
									className="size-8 flex items-center justify-center bg-accent/10 text-accent text-[10px] font-black text-lg"
									style={{ clipPath: CLIP_PATHS.hex }}
								>
									01
								</div>
								<h3 className="text-lg underline underline-offset-8 font-black uppercase tracking-[0.2em] text-foreground">
									INDIVIDUAL_EVOLUTION_LIST
								</h3>
							</div>
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								{report.personalBooks.map((book, i) => (
									<BookCard key={i} book={book} variant="personal" />
								))}
							</div>
						</div>

						<div className="h-px bg-border/20" />

						{/* Team Books */}
						<div className="space-y-6">
							<div className="flex items-center gap-3">
								<div
									className="size-8  flex items-center justify-center bg-accent/10 text-accent text-[10px] font-black text-lg"
									style={{ clipPath: CLIP_PATHS.hex }}
								>
									02
								</div>
								<h3 className="text-lg  underline underline-offset-8 font-black uppercase tracking-[0.2em] text-foreground">
									COLECTIVE_NODE_RESOURCES
								</h3>
							</div>
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								{report.teamBooks.map((book, i) => (
									<BookCard key={i} book={book} variant="team" />
								))}
							</div>
						</div>
					</section>

					{/* Action Plan */}
					<section className="space-y-8">
						<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-6 relative">
							<div className="absolute bottom-0 left-0 w-32 h-0.5 bg-[hsl(var(--success))]" />
							<div className="space-y-2">
								<div className="flex items-center gap-3">
									<div className="relative size-10 flex items-center justify-center">
										<div
											className="absolute inset-0 bg-[hsl(var(--success))]/20"
											style={{ clipPath: CLIP_PATHS.hex }}
										/>
										<div
											className="absolute inset-px bg-background/50 flex items-center justify-center text-[hsl(var(--success))]"
											style={{ clipPath: CLIP_PATHS.hex }}
										>
											<CheckCircle2Icon className="size-5" />
										</div>
									</div>
									<h2 className="text-xl font-black uppercase tracking-[0.3em] text-foreground">
										EXECUTION_ROADMAP
									</h2>
								</div>
								<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
									FASE_DE_IMPLEMENTACIÓN_Y_DESLIEGUE_ESTRATÉGICO
								</p>
							</div>
						</div>

						<div className="p-px bg-border/40" style={{ clipPath: CLIP_PATHS.large }}>
							<div
								className="bg-background/95 backdrop-blur-md p-0 overflow-hidden"
								style={{ clipPath: CLIP_PATHS.large }}
							>
								<div className="grid grid-cols-1 md:grid-cols-3">
									<div className="p-8 space-y-8 border-b md:border-b-0 md:border-r border-border/20 group/plan hover:bg-[hsl(var(--success))]/5 transition-colors">
										<div className="space-y-1">
											<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[hsl(var(--success))]">
												PHASE_01: IMMEDIATE
											</h4>
											<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
												FIRST_7_DAYS
											</p>
										</div>
										<ul className="space-y-4">
											{report.actionPlan.thisWeek.map((action, i) => (
												<li key={i} className="flex gap-4 group/item">
													<div
														className="mt-1 size-4 shrink-0 flex items-center justify-center bg-background border border-emerald-500/30 text-[8px] font-black text-[hsl(var(--success))] group-hover/item:bg-[hsl(var(--success))] group-hover/item:text-white transition-colors"
														style={{ clipPath: CLIP_PATHS.hex }}
													>
														{i + 1}
													</div>
													<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 group-hover/item:text-foreground transition-colors leading-relaxed">
														{action}
													</span>
												</li>
											))}
										</ul>
									</div>

									<div className="p-8 space-y-8 border-b md:border-b-0 md:border-r border-border/20 group/plan hover:bg-[hsl(var(--success))]/5 transition-colors">
										<div className="space-y-1">
											<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[hsl(var(--success))]">
												PHASE_02: CONSOLIDATION
											</h4>
											<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
												MONTH_01
											</p>
										</div>
										<ul className="space-y-4">
											{report.actionPlan.thisMonth.map((action, i) => (
												<li key={i} className="flex gap-4 group/item">
													<div
														className="mt-1 size-4 shrink-0 flex items-center justify-center bg-background border border-emerald-500/30 text-[8px] font-black text-[hsl(var(--success))] group-hover/item:bg-[hsl(var(--success))] group-hover/item:text-white transition-colors"
														style={{ clipPath: CLIP_PATHS.hex }}
													>
														{i + 1}
													</div>
													<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 group-hover/item:text-foreground transition-colors leading-relaxed">
														{action}
													</span>
												</li>
											))}
										</ul>
									</div>

									<div className="p-8 space-y-8 group/plan hover:bg-[hsl(var(--success))]/5 transition-colors">
										<div className="space-y-1">
											<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[hsl(var(--success))]">
												PHASE_03: SUSTAINABILITY
											</h4>
											<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
												CONTINUOUS_PROTOCOL
											</p>
										</div>
										<ul className="space-y-4">
											{report.actionPlan.ongoing.map((action, i) => (
												<li key={i} className="flex gap-4 group/item">
													<div
														className="mt-1 size-4 shrink-0 flex items-center justify-center bg-background border border-emerald-500/30 text-[8px] font-black text-[hsl(var(--success))] group-hover/item:bg-[hsl(var(--success))] group-hover/item:text-white transition-colors"
														style={{ clipPath: CLIP_PATHS.hex }}
													>
														{i + 1}
													</div>
													<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 group-hover/item:text-foreground transition-colors leading-relaxed">
														{action}
													</span>
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Regenerate Section */}
					<div className="flex justify-center pt-8">
						<div className="w-full max-w-2xl">
							<div
								className="p-px bg-border/20"
								style={{ clipPath: CLIP_PATHS.large }}
							>
								<div
									className="bg-background/95 backdrop-blur-md p-10 flex flex-col items-center gap-8 text-center"
									style={{ clipPath: CLIP_PATHS.large }}
								>
									<div className="space-y-2">
										<h3 className="text-xl font-black uppercase tracking-[0.2em] text-foreground">
											¿NODE_NETWORK_CHANGES?
										</h3>
										<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-relaxed">
											{!canRegenerate
												? `PODRÁS_ACTUALIZAR_ESTE_REPORTE_EN ${daysUntilRegenerate} DÍA${
														daysUntilRegenerate !== 1 ? "S" : ""
													}.`
												: "SI_HAN_CAMBIADO_LOS_MIEMBROS_O_SUS_FORTALEZAS, GENERA_UN_NUEVO_ANÁLISIS_DE_RESONANCIA."}
										</p>
									</div>

									<Button
										variant="outline"
										onClick={() => handleGenerate(true)}
										disabled={isPending || !canRegenerate}
										className="h-14 px-10 border border-border/40 hover:bg-primary/10 hover:text-primary gap-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300"
										style={{ clipPath: CLIP_PATHS.medium }}
									>
										{isPending ? (
											<>
												<Loader className="size-5 animate-spin" />
												RECALIBRATING...
											</>
										) : (
											<>
												<RefreshCwIcon className="size-5" />
												REGENERAR_SINCRO_DE_RED
											</>
										)}
									</Button>

									{error && (
										<div className="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--destructive))]">
											SYSTEM_ERROR: {error}
										</div>
									)}
									{regenerateMessage && (
										<div className="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--warning))] bg-[hsl(var(--warning))]/5 px-4 py-2 border border-[hsl(var(--warning))]/20">
											{regenerateMessage.toUpperCase()}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

// ============================================================
// Sub-components
// ============================================================

interface MemberTipCardProps {
	member: TeamTipsReport["memberTips"][number];
}

function MemberTipCard({ member }: MemberTipCardProps) {
	const compatibilityConfig = {
		high: {
			color: "text-[hsl(var(--success))]",
			bg: "bg-[hsl(var(--success)/5%)]",
			border: "border-[hsl(var(--success)/20%)]",
			label: "HIGH_RESONANCE",
		},
		medium: {
			color: "text-[hsl(var(--warning))]",
			bg: "bg-[hsl(var(--warning)/5%)]",
			border: "border-[hsl(var(--warning)/20%)]",
			label: "MID_ALIGNMENT",
		},
		low: {
			color: "text-[hsl(var(--destructive))]",
			bg: "bg-[hsl(var(--destructive)/5%)]",
			border: "border-[hsl(var(--destructive)/20%)]",
			label: "INTERFERENCE_DETECTED",
		},
	};

	const config = compatibilityConfig[member.relationshipDynamics.compatibility];

	return (
		<div
			className="p-px bg-border/20 group/member transition-all duration-300 hover:bg-border/40"
			style={{ clipPath: CLIP_PATHS.medium }}
		>
			<div
				className="bg-background/95 flex flex-col h-full relative"
				style={{ clipPath: CLIP_PATHS.medium }}
			>
				{/* Header */}
				<div className="border-b border-border/20 bg-muted/5 p-6 space-y-4">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div className="flex items-center gap-4">
							<div className="relative size-12 flex items-center justify-center">
								<div
									className="absolute inset-0 bg-primary/20 group-hover/member:bg-primary/40 transition-colors"
									style={{ clipPath: CLIP_PATHS.hex }}
								/>
								<div
									className="absolute inset-px bg-background/50 flex items-center justify-center text-primary text-lg font-black"
									style={{ clipPath: CLIP_PATHS.hex }}
								>
									{member.memberName.charAt(0).toUpperCase()}
								</div>
							</div>
							<div className="space-y-1">
								<h3 className="text-sm font-black uppercase tracking-widest text-foreground">
									{member.memberName}
								</h3>
								{member.memberRole && (
									<p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
										{member.memberRole}
									</p>
								)}
							</div>
						</div>

						<div
							className={cn(
								"px-3 py-1 border text-[8px] font-black uppercase tracking-widest flex items-center gap-2",
								config.border,
								config.bg,
								config.color,
							)}
							style={{ clipPath: CLIP_PATHS.small }}
						>
							<div
								className={cn(
									"size-1.5 animate-pulse shadow-[0_0_8px_currentColor]",
									config.color.replace("text-", "bg-"),
								)}
								style={{ clipPath: CLIP_PATHS.hex }}
							/>
							{config.label}
						</div>
					</div>

					<div className="flex flex-wrap gap-1.5 pt-2">
						{member.theirTopStrengths.map((strength) => (
							<div
								key={strength}
								className="px-2 py-0.5 bg-muted/20 border border-border/10 text-[7px] font-black uppercase tracking-widest text-muted-foreground/80"
								style={{ clipPath: CLIP_PATHS.small }}
							>
								{strength}
							</div>
						))}
					</div>
				</div>

				<div className="p-6 space-y-8 flex-1">
					{/* Dynamics Matrix */}
					<div className="grid gap-6 sm:grid-cols-2">
						<div className="space-y-4">
							<h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[hsl(var(--success))] flex items-center gap-2">
								<ThumbsUpIcon className="size-3" />
								SYNERGY_POINTS
							</h4>
							<ul className="space-y-3">
								{member.relationshipDynamics.synergies.map((s, i) => (
									<li key={i} className="flex items-start gap-2 group/item">
										<div
											className="mt-1 size-1 bg-[hsl(var(--success))]/40 group-hover/item:bg-[hsl(var(--success))] transition-colors"
											style={{ clipPath: CLIP_PATHS.hex }}
										/>
										<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover/item:text-foreground transition-colors leading-relaxed">
											{s}
										</span>
									</li>
								))}
							</ul>
						</div>

						<div className="space-y-4">
							<h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[hsl(var(--destructive))] flex items-center gap-2">
								<ThumbsDownIcon className="size-3" />
								FRICTION_ZONES
							</h4>
							<ul className="space-y-3">
								{member.relationshipDynamics.potentialFrictions.map((f, i) => (
									<li key={i} className="flex items-start gap-2 group/item">
										<div
											className="mt-1 size-1 bg-[hsl(var(--destructive))]/40 group-hover/item:bg-[hsl(var(--destructive))] transition-colors"
											style={{ clipPath: CLIP_PATHS.hex }}
										/>
										<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover/item:text-foreground transition-colors leading-relaxed">
											{f}
										</span>
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Implementation Protocol */}
					<div
						className="p-4 bg-muted/10 border border-border/20 relative"
						style={{ clipPath: CLIP_PATHS.small }}
					>
						<div className="space-y-6">
							<div className="space-y-2">
								<h5 className="text-[8px] font-black uppercase tracking-widest text-primary/60">
									PRIMARY_COMMUNICATION_APPROACH
								</h5>
								<p className="text-[11px] font-black uppercase tracking-widest text-foreground leading-relaxed italic">
									&quot;{member.communicationStyle.preferredApproach}&quot;
								</p>
							</div>

							<div className="grid gap-6 sm:grid-cols-2">
								<div className="space-y-3">
									<h6 className="text-[8px] font-black uppercase tracking-widest text-[hsl(var(--success))]">
										OPTIMIZE
									</h6>
									<ul className="space-y-2">
										{member.communicationStyle.doList.map((item, i) => (
											<li
												key={i}
												className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground border-l border-emerald-500/30 pl-3"
											>
												{item}
											</li>
										))}
									</ul>
								</div>
								<div className="space-y-3">
									<h6 className="text-[8px] font-black uppercase tracking-widest text-[hsl(var(--destructive))]">
										RESTRICT
									</h6>
									<ul className="space-y-2">
										{member.communicationStyle.dontList.map((item, i) => (
											<li
												key={i}
												className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground border-l border-[hsl(var(--destructive))]/30 pl-3"
											>
												{item}
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-3">
						<h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
							COLLECTIVE_MISSION_TYPES
						</h4>
						<div className="flex flex-wrap gap-2">
							{member.projectTypes.map((type, i) => (
								<div
									key={i}
									className="px-3 py-1 bg-primary/10 border border-primary/20 text-[8px] font-black uppercase tracking-widest text-primary"
									style={{ clipPath: CLIP_PATHS.small }}
								>
									{type}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

interface BookCardProps {
	book:
		| TeamTipsReport["personalBooks"][number]
		| TeamTipsReport["teamBooks"][number];
	variant: "personal" | "team";
}

function BookCard({ book, variant }: BookCardProps) {
	return (
		<div
			className="p-px bg-border/20 group/book hover:bg-accent/20 transition-all duration-300 h-full"
			style={{ clipPath: CLIP_PATHS.small }}
		>
			<div
				className="bg-background/95 p-6 h-full flex flex-col space-y-6 relative overflow-hidden"
				style={{ clipPath: CLIP_PATHS.small }}
			>
				<div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none group-hover/book:opacity-20 transition-opacity">
					<BookOpenIcon className="size-12" />
				</div>

				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<div
							className="size-1.5 bg-accent"
							style={{ clipPath: CLIP_PATHS.hex }}
						/>
						<span className="text-[8px] font-black uppercase tracking-widest text-accent">
							{variant === "personal" ? "SELF_OPTIMIZATION" : "TEAM_SINCRO"}
						</span>
					</div>
					<h4 className="text-xs font-black uppercase tracking-widest text-foreground group-hover/book:text-accent transition-colors">
						{book.title}
					</h4>
					<p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 italic">
						{book.author}
					</p>
				</div>

				<div className="space-y-4 flex-1">
					<div className="space-y-1">
						<span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
							OBJECTIVE_CONTEXT
						</span>
						<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-relaxed">
							{book.whyRecommended}
						</p>
					</div>

					<div className="space-y-2 border-t border-border/10 pt-4">
						<span className="text-[7px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
							CORE_INSIGHTS
						</span>
						<ul className="space-y-1.5">
							{book.keyTakeaways.map((item, i) => (
								<li key={i} className="flex items-center gap-2">
									<div
										className="size-1 bg-accent/40"
										style={{ clipPath: CLIP_PATHS.hex }}
									/>
									<span className="text-[9px] font-bold uppercase tracking-widest text-foreground/70">
										{item}
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
