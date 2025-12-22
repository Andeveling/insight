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
import { getDaysUntilRegenerate } from "@/lib/utils";
import { generateTeamTips } from "../_actions/generate-team-tips.action";
import { Loader } from "../_components/loader";
import type { TeamTipsReport } from "../_schemas/team-tips.schema";

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

	const clipPath16 = "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
	const clipPath12 = "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)";
	const clipPath8 = "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";
	const clipHex = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

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
			<div className="max-w-lg mx-auto py-12">
				<div 
					className="p-px bg-amber-500/30"
					style={{ clipPath: clipPath16 }}
				>
					<div 
						className="bg-background/95 backdrop-blur-md p-10 text-center space-y-6"
						style={{ clipPath: clipPath16 }}
					>
						<div className="relative mx-auto size-16 flex items-center justify-center">
							<div className="absolute inset-0 bg-amber-500/20" style={{ clipPath: clipHex }} />
							<div className="absolute inset-[1px] bg-background/50 flex items-center justify-center text-amber-500" style={{ clipPath: clipHex }}>
								<UsersIcon className="size-8" />
							</div>
						</div>
						<div className="space-y-2">
							<h3 className="text-xl font-black uppercase tracking-[0.2em] text-foreground">
								NODE_CONNECTION_REQUIRED
							</h3>
							<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-relaxed">
								NECESITAS_CONECTARTE_A_UN_NODO_DE_EQUIPO_PARA_SINCRO_INTERPERSONAL. ESTABLECE_ESTRUCTURA_DE_RED_PRIMERO.
							</p>
						</div>
						<Button asChild className="rounded-none border-amber-500/20 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20">
							<Link href="/dashboard/team">SITUARSE_EN_EQUIPO</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	// No strengths assigned
	if (!hasStrengths) {
		return (
			<div className="max-w-lg mx-auto py-12">
				<div 
					className="p-px bg-primary/30"
					style={{ clipPath: clipPath16 }}
				>
					<div 
						className="bg-background/95 backdrop-blur-md p-10 text-center space-y-6"
						style={{ clipPath: clipPath16 }}
					>
						<div className="relative mx-auto size-16 flex items-center justify-center">
							<div className="absolute inset-0 bg-primary/20" style={{ clipPath: clipHex }} />
							<div className="absolute inset-[1px] bg-background/50 flex items-center justify-center text-primary" style={{ clipPath: clipHex }}>
								<SparklesIcon className="size-8" />
							</div>
						</div>
						<div className="space-y-2">
							<h3 className="text-xl font-black uppercase tracking-[0.2em] text-foreground">
								CORE_AUTHENTICATION_PENDING
							</h3>
							<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-relaxed">
								DATOS_DE_TALENTO_NO_ENCONTRADOS. COMPLETA_LA_EVALUACIÓN_NEURAL_DE_FORTALEZAS_PARA_DESBLOQUEAR_SINCRO.
							</p>
						</div>
						<Button asChild className="rounded-none border-primary/20 bg-primary/10 text-primary hover:bg-primary/20">
							<Link href="/dashboard/profile">INICIAR_EVALUACIÓN</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	// No teammates with strengths
	if (teammates.length === 0) {
		return (
			<div className="max-w-lg mx-auto py-12">
				<div 
					className="p-px bg-red-500/30"
					style={{ clipPath: clipPath16 }}
				>
					<div 
						className="bg-background/95 backdrop-blur-md p-10 text-center space-y-6"
						style={{ clipPath: clipPath16 }}
					>
						<div className="relative mx-auto size-16 flex items-center justify-center">
							<div className="absolute inset-0 bg-red-500/20" style={{ clipPath: clipHex }} />
							<div className="absolute inset-[1px] bg-background/50 flex items-center justify-center text-red-500" style={{ clipPath: clipHex }}>
								<UsersIcon className="size-8" />
							</div>
						</div>
						<div className="space-y-2">
							<h3 className="text-xl font-black uppercase tracking-[0.2em] text-foreground">
								DATA_VACUUM_DETECTED
							</h3>
							<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-relaxed">
								TUS_NODOS_ADYACENTES_NO_HAN_SIDO_CALIBRADOS. TODOS_LOS_MIEMBROS_DEBEN_CARGAR_SU_PERFIL_DE_TALENTO.
							</p>
						</div>
						<Button asChild variant="outline" className="rounded-none border-red-500/20 text-red-500 hover:bg-red-500/10">
							<Link href="/dashboard/team">NOTIFICAR_NODOS</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8 py-4">
			{/* Generate/Regenerate Section */}
			{!report && (
				<div 
					className="p-px bg-primary/30 relative group overflow-hidden"
					style={{ clipPath: clipPath16 }}
				>
					<div className="absolute inset-0 bg-grid-tech/10 group-hover:bg-grid-tech/20 transition-colors" />
					<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
					
					<div 
						className="bg-background/95 backdrop-blur-md p-10 relative space-y-8"
						style={{ clipPath: clipPath16 }}
					>
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
							<div className="space-y-4">
								<div className="flex items-center gap-4">
									<div className="relative size-12 flex items-center justify-center">
										<div className="absolute inset-0 bg-primary/20 animate-pulse" style={{ clipPath: clipHex }} />
										<div className="absolute inset-[1px] bg-background/50 flex items-center justify-center text-primary" style={{ clipPath: clipHex }}>
											<HeartHandshakeIcon className="size-6" />
										</div>
									</div>
									<div className="space-y-1">
										<h2 className="text-2xl font-black uppercase tracking-[.2em] text-foreground">
											COLLABORATION_ENGINE_INITIATOR
										</h2>
										<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
											SISTEMA_DE_SÍNTESIS_DE_RELACIONES_INTERPERSONALES // v2.4
										</p>
									</div>
								</div>
								<p className="text-sm font-medium text-muted-foreground/80 leading-relaxed max-w-2xl border-l-2 border-primary/20 pl-6">
									LA_IA_ANALIZARÁ_TUS_FORTALEZAS_Y_LAS_DE_CADA_MIEMBRO_DE_TU_EQUIPO_PARA_GENERAR_CONSEJOS_PERSONALIZADOS_DE_COMUNICACIÓN,
									COLABORACIÓN, Y_RECOMENDACIONES_NEURALES.
								</p>
							</div>

							<Button
								onClick={() => handleGenerate(false)}
								disabled={isPending}
								size="lg"
								className={cn(
									"h-16 px-10 gap-3 relative overflow-hidden group/btn",
									!isPending && "shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)]"
								)}
								style={{ clipPath: clipPath12 }}
							>
								<div className="absolute inset-0 bg-primary translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500" />
								<span className="relative z-10 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em]">
									{isPending ? (
										<>
											<Loader className="size-5 animate-spin" />
											ANALYZING_TEAM_DYNAMICS...
										</>
									) : (
										<>
											<SparklesIcon className="size-5" />
											INICIAR_SÍNTESIS_DE_EQUIPO
										</>
									)}
								</span>
							</Button>
						</div>

						{error && (
							<div 
								className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest"
								style={{ clipPath: clipPath8 }}
							>
								CORE_SYSTEM_ERROR: {error.toUpperCase()}
							</div>
						)}
					</div>
				</div>
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
										<div className="absolute inset-0 bg-primary/20" style={{ clipPath: clipHex }} />
										<div className="absolute inset-[1px] bg-background/50 flex items-center justify-center text-primary" style={{ clipPath: clipHex }}>
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
							<div className="flex items-center gap-2 px-3 py-1 bg-muted/10 border border-border/20 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
								NODE_ID: {user.id.slice(0, 8).toUpperCase()}
							</div>
						</div>

						<div 
							className="p-px bg-border/40 relative group"
							style={{ clipPath: clipPath16 }}
						>
							<div className="absolute inset-0 bg-grid-tech/5 pointer-events-none" />
							<div 
								className="bg-background/95 backdrop-blur-md overflow-hidden"
								style={{ clipPath: clipPath16 }}
							>
								<div className="bg-muted/5 border-b border-border/40 p-8">
									<h3 className="text-2xl font-black uppercase tracking-[0.1em] text-foreground mb-1">
										{report.personalSummary.headline}
									</h3>
									<p className="text-[10px] font-bold uppercase tracking-widest text-primary">
										TEAM_ALIGNMENT: {report.personalSummary.teamName.toUpperCase()}
									</p>
								</div>
								
								<div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/20">
									<div className="p-8 space-y-4 group/item hover:bg-primary/5 transition-colors">
										<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
											<div className="size-1.5 bg-primary/40 group-hover/item:bg-primary" style={{ clipPath: clipHex }} />
											RESONANCE_CONTEXT
										</h4>
										<p className="text-xs font-semibold uppercase tracking-widest text-foreground/80 leading-relaxed">
											{report.personalSummary.yourStrengthsInTeamContext}
										</p>
									</div>
									<div className="p-8 space-y-4 group/item hover:bg-primary/5 transition-colors">
										<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
											<div className="size-1.5 bg-primary/40 group-hover/item:bg-primary" style={{ clipPath: clipHex }} />
											NATURAL_NODE_ROLE
										</h4>
										<p className="text-xs font-semibold uppercase tracking-widest text-foreground/80 leading-relaxed">
											{report.personalSummary.naturalRole}
										</p>
									</div>
									<div className="p-8 space-y-4 group/item hover:bg-primary/5 transition-colors">
										<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
											<div className="size-1.5 bg-primary/40 group-hover/item:bg-primary" style={{ clipPath: clipHex }} />
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
										<div className="absolute inset-0 bg-blue-500/20" style={{ clipPath: clipHex }} />
										<div className="absolute inset-[1px] bg-background/50 flex items-center justify-center text-blue-500" style={{ clipPath: clipHex }}>
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
							<div className="absolute bottom-0 left-0 w-32 h-0.5 bg-yellow-500" />
							<div className="space-y-2">
								<div className="flex items-center gap-3">
									<div className="relative size-10 flex items-center justify-center">
										<div className="absolute inset-0 bg-yellow-500/20" style={{ clipPath: clipHex }} />
										<div className="absolute inset-[1px] bg-background/50 flex items-center justify-center text-yellow-500" style={{ clipPath: clipHex }}>
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

						<div 
							className="p-px bg-border/40"
							style={{ clipPath: clipPath16 }}
						>
							<div 
								className="bg-background/95 backdrop-blur-md p-8 overflow-hidden relative"
								style={{ clipPath: clipPath16 }}
							>
								<div className="absolute inset-0 bg-grid-tech/5 pointer-events-none" />
								
								<div className="relative z-10 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
									<div className="space-y-6">
										<div className="flex items-center gap-3 border-b border-border/20 pb-3">
											<UsersIcon className="size-4 text-primary" />
											<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">SYNC_MEETINGS</h4>
										</div>
										<ul className="space-y-4">
											{report.communicationStrategies.inMeetings.map((tip, i) => (
												<li
													key={i}
													className="flex items-start gap-3 group"
												>
													<div className="mt-1.5 size-1.5 shrink-0 bg-primary/40 group-hover:bg-primary transition-colors" style={{ clipPath: clipHex }} />
													<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
														{tip}
													</span>
												</li>
											))}
										</ul>
									</div>

									<div className="space-y-6">
										<div className="flex items-center gap-3 border-b border-border/20 pb-3">
											<TargetIcon className="size-4 text-primary" />
											<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">CONFLICT_RESOLUTION</h4>
										</div>
										<ul className="space-y-4">
											{report.communicationStrategies.inConflicts.map((tip, i) => (
												<li
													key={i}
													className="flex items-start gap-3 group"
												>
													<div className="mt-1.5 size-1.5 shrink-0 bg-primary/40 group-hover:bg-primary transition-colors" style={{ clipPath: clipHex }} />
													<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
														{tip}
													</span>
												</li>
											))}
										</ul>
									</div>

									<div className="space-y-6">
										<div className="flex items-center gap-3 border-b border-border/20 pb-3">
											<SparklesIcon className="size-4 text-primary" />
											<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">COLLECTIVE_PEAK</h4>
										</div>
										<ul className="space-y-4">
											{report.communicationStrategies.inCelebrations.map((tip, i) => (
												<li
													key={i}
													className="flex items-start gap-3 group"
												>
													<div className="mt-1.5 size-1.5 shrink-0 bg-primary/40 group-hover:bg-primary transition-colors" style={{ clipPath: clipHex }} />
													<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
														{tip}
													</span>
												</li>
											))}
										</ul>
									</div>

									<div className="space-y-6">
										<div className="flex items-center gap-3 border-b border-border/20 pb-3">
											<MessageCircleIcon className="size-4 text-primary" />
											<h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">DAILY_OPERATIONS</h4>
										</div>
										<ul className="space-y-4">
											{report.communicationStrategies.dailyInteractions.map((tip, i) => (
												<li
													key={i}
													className="flex items-start gap-3 group"
												>
													<div className="mt-1.5 size-1.5 shrink-0 bg-primary/40 group-hover:bg-primary transition-colors" style={{ clipPath: clipHex }} />
													<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
														{tip}
													</span>
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						</div>
					</section>

					{/* Team Considerations */}
					<section className="space-y-6">
						<div className="flex items-center gap-3">
							<div className="flex size-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
								<TargetIcon className="size-5" />
							</div>
							<h2 className="text-2xl font-bold tracking-tight">
								Consideraciones del Equipo
							</h2>
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							{report.teamConsiderations.map((consideration, i) => (
								<Card
									key={i}
									className="flex flex-col transition-all hover:shadow-md"
								>
									<CardHeader className="bg-muted/30 pb-4">
										<CardTitle className="text-lg">
											{consideration.title}
										</CardTitle>
										<CardDescription className="line-clamp-2">
											{consideration.description}
										</CardDescription>
									</CardHeader>
									<CardContent className="flex flex-1 flex-col gap-4 pt-6">
										<div>
											<span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
												Cuándo aplicar
											</span>
											<p className="text-sm text-foreground">
												{consideration.whenToApply}
											</p>
										</div>
										<div className="mt-auto">
											<span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
												Acciones Clave
											</span>
											<ul className="space-y-1">
												{consideration.actionItems.map((item, j) => (
													<li
														key={j}
														className="flex items-start gap-2 text-sm text-muted-foreground"
													>
														<span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
														{item}
													</li>
												))}
											</ul>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</section>

					{/* Book Recommendations */}
					<section className="space-y-4">
						<div className="flex items-center gap-3">
							<div className="flex size-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
								<BookOpenIcon className="size-5" />
							</div>
							<h2 className="text-2xl font-bold tracking-tight">
								Biblioteca Recomendada
							</h2>
						</div>

						{/* Personal Books */}
						<div className="space-y-4">
							<h3 className="flex items-center gap-2 text-lg font-semibold">
								<span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
									1
								</span>
								Lecturas para tu Crecimiento
							</h3>
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								{report.personalBooks.map((book, i) => (
									<BookCard key={i} book={book} variant="personal" />
								))}
							</div>
						</div>

						<Separator />

						{/* Team Books */}
						<div className="space-y-4">
							<h3 className="flex items-center gap-2 text-lg font-semibold">
								<span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
									2
								</span>
								Lecturas para Compartir
							</h3>
							<p className="text-muted-foreground">
								Libros ideales para leer en conjunto y generar discusiones de
								equipo
							</p>
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{report.teamBooks.map((book, i) => (
									<BookCard key={i} book={book} variant="team" />
								))}
							</div>
						</div>
					</section>

					{/* Action Plan */}
					<section className="space-y-6">
						<div className="flex items-center gap-3">
							<div className="flex size-10 items-center justify-center rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
								<CheckCircle2Icon className="size-5" />
							</div>
							<h2 className="text-2xl font-bold tracking-tight">
								Plan de Acción
							</h2>
						</div>

						<Card className="bg-linear-to-br from-background to-muted/30">
							<CardContent className="grid gap-8 p-6 md:grid-cols-3">
								<div className="space-y-4">
									<div className="flex items-center gap-2 border-b border-primary/20 pb-2">
										<span className="font-bold text-primary">Esta Semana</span>
									</div>
									<ul className="space-y-3">
										{report.actionPlan.thisWeek.map((action, i) => (
											<li key={i} className="flex gap-3 text-sm">
												<div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
													<span className="text-xs font-bold text-primary">
														{i + 1}
													</span>
												</div>
												<span className="text-muted-foreground">{action}</span>
											</li>
										))}
									</ul>
								</div>

								<div className="space-y-4">
									<div className="flex items-center gap-2 border-b border-primary/20 pb-2">
										<span className="font-bold text-primary">Este Mes</span>
									</div>
									<ul className="space-y-3">
										{report.actionPlan.thisMonth.map((action, i) => (
											<li key={i} className="flex gap-3 text-sm">
												<div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
													<span className="text-xs font-bold text-primary">
														{i + 1}
													</span>
												</div>
												<span className="text-muted-foreground">{action}</span>
											</li>
										))}
									</ul>
								</div>

								<div className="space-y-4">
									<div className="flex items-center gap-2 border-b border-primary/20 pb-2">
										<span className="font-bold text-primary">
											Hábito Continuo
										</span>
									</div>
									<ul className="space-y-3">
										{report.actionPlan.ongoing.map((action, i) => (
											<li key={i} className="flex gap-3 text-sm">
												<div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
													<span className="text-xs font-bold text-primary">
														{i + 1}
													</span>
												</div>
												<span className="text-muted-foreground">{action}</span>
											</li>
										))}
									</ul>
								</div>
							</CardContent>
						</Card>
					</section>

					{/* Regenerate Section */}
					<div className="flex justify-center py-8">
						<div className="w-full max-w-2xl space-y-4 text-center">
							{error && (
								<div className="rounded-lg bg-destructive/10 p-4 text-destructive">
									{error}
								</div>
							)}
							{regenerateMessage && (
								<div className="rounded-lg bg-yellow-500/10 p-4 text-yellow-600 dark:text-yellow-400">
									{regenerateMessage}
								</div>
							)}

							<div className="flex flex-col items-center gap-4 rounded-2xl border bg-muted/30 p-6">
								<div className="space-y-1">
									<h3 className="font-semibold">¿Cambios en el equipo?</h3>
									<p className="text-sm text-muted-foreground">
										{!canRegenerate
											? `Podrás actualizar este reporte en ${daysUntilRegenerate} día${
													daysUntilRegenerate !== 1 ? "s" : ""
												}.`
											: "Si han cambiado los miembros o sus fortalezas, genera un nuevo análisis."}
									</p>
								</div>

								<Button
									variant="outline"
									onClick={() => handleGenerate(true)}
									disabled={isPending || !canRegenerate}
									className="gap-2"
								>
									{isPending ? (
										<>
											<Loader className="size-4" />
											Regenerando...
										</>
									) : (
										<>
											<RefreshCwIcon className="size-4" />
											Regenerar Análisis
										</>
									)}
								</Button>
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
	index: number;
}

function MemberTipCard({ member }: Omit<MemberTipCardProps, "index">) {
	const compatibilityColors = {
		high: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900",
		medium:
			"bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900",
		low: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900",
	};

	const compatibilityLabels = {
		high: "Alta Sinergia",
		medium: "Compatibilidad Media",
		low: "Atención Requerida",
	};

	return (
		<Card className="overflow-hidden transition-all hover:shadow-md">
			<CardHeader className="border-b bg-muted/30 pb-4">
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div className="flex items-center gap-4">
						<div className="flex size-12 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
							<span className="text-lg font-bold text-primary">
								{member.memberName.charAt(0)}
							</span>
						</div>
						<div>
							<CardTitle className="text-lg">{member.memberName}</CardTitle>
							{member.memberRole && (
								<CardDescription>{member.memberRole}</CardDescription>
							)}
						</div>
					</div>

					<Badge
						variant="outline"
						className={cn(
							"w-fit px-3 py-1 text-sm font-medium",
							compatibilityColors[member.relationshipDynamics.compatibility],
						)}
					>
						{compatibilityLabels[member.relationshipDynamics.compatibility]}
					</Badge>
				</div>

				<div className="mt-4 flex flex-wrap gap-2">
					{member.theirTopStrengths.map((strength) => (
						<Badge
							key={strength}
							variant="secondary"
							className="bg-background/80 text-xs font-normal"
						>
							{strength}
						</Badge>
					))}
				</div>
			</CardHeader>

			<CardContent className="space-y-6 p-6">
				{/* Dynamics */}
				<div className="grid gap-6 md:grid-cols-2">
					<div>
						<h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
							<ThumbsUpIcon className="size-4 text-green-600" />
							Puntos de Conexión
						</h4>
						<ul className="space-y-2">
							{member.relationshipDynamics.synergies.map((s, i) => (
								<li
									key={i}
									className="flex items-start gap-2 text-sm text-muted-foreground"
								>
									<span className="mt-1.5 size-1 shrink-0 rounded-full bg-green-500/50" />
									{s}
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
							<ThumbsDownIcon className="size-4 text-red-600" />
							Posibles Roces
						</h4>
						<ul className="space-y-2">
							{member.relationshipDynamics.potentialFrictions.map((f, i) => (
								<li
									key={i}
									className="flex items-start gap-2 text-sm text-muted-foreground"
								>
									<span className="mt-1.5 size-1 shrink-0 rounded-full bg-red-500/50" />
									{f}
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Communication & Tips - Full Width */}
				<div className="space-y-4 rounded-xl bg-muted/30 p-4">
					<div>
						<h4 className="mb-2 text-sm font-semibold">
							Estilo de Comunicación
						</h4>
						<p className="text-sm italic text-muted-foreground">
							&quot;{member.communicationStyle.preferredApproach}&quot;
						</p>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<h5 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
								<CheckCircle2Icon className="size-3.5" />
								Hacer
							</h5>
							<ul className="space-y-1">
								{member.communicationStyle.doList.map((item, i) => (
									<li key={i} className="text-xs text-muted-foreground">
										• {item}
									</li>
								))}
							</ul>
						</div>
						<div className="space-y-2">
							<h5 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
								<XCircleIcon className="size-3.5" />
								Evitar
							</h5>
							<ul className="space-y-1">
								{member.communicationStyle.dontList.map((item, i) => (
									<li key={i} className="text-xs text-muted-foreground">
										• {item}
									</li>
								))}
							</ul>
						</div>
					</div>

					<Separator className="bg-border/50" />

					<div>
						<h4 className="mb-2 text-sm font-semibold">
							Mejores Proyectos Juntos
						</h4>
						<div className="flex flex-wrap gap-1.5">
							{member.projectTypes.map((type, i) => (
								<Badge
									key={i}
									variant="outline"
									className="bg-background text-xs"
								>
									{type}
								</Badge>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

interface BookCardProps {
	book: TeamTipsReport["personalBooks"][number];
	variant: "personal" | "team";
}

function BookCard({ book, variant }: BookCardProps) {
	return (
		<Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-md">
			<div className="h-2 w-full bg-linear-to-r from-primary/40 to-primary/10" />
			<CardHeader>
				<CardTitle className="line-clamp-2 text-lg leading-tight">
					{book.title}
				</CardTitle>
				<CardDescription className="font-medium text-foreground/80">
					{book.author}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col gap-4">
				<p className="text-sm text-muted-foreground">{book.whyRecommended}</p>

				<div className="mt-auto space-y-3 rounded-lg bg-muted/30 p-3">
					<div>
						<span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
							Aprendizajes Clave
						</span>
						<ul className="space-y-1">
							{book.keyTakeaways.slice(0, 2).map((takeaway, i) => (
								<li key={i} className="text-xs text-muted-foreground">
									• {takeaway}
								</li>
							))}
						</ul>
					</div>

					{variant === "team" && (
						<div>
							<span className="mb-1 block text-xs font-bold uppercase tracking-wider text-primary/80">
								Aplicación al Equipo
							</span>
							<p className="text-xs text-muted-foreground">
								{book.applicationToTeam}
							</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
