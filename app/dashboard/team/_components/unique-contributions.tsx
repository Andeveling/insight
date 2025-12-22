"use client";

import {
	Sparkles,
	Users,
	HeartHandshake,
	Lightbulb,
	Box,
	Cpu,
	Activity,
} from "lucide-react";
import { StrengthBadge } from "@/app/_shared/components/strength-badge";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { cn } from "@/lib/cn";
import { getDomainColor } from "@/lib/constants/domain-colors";
import type { TeamAnalytics } from "@/lib/types";

interface UniqueContributionsProps {
	analytics: TeamAnalytics;
	className?: string;
}

export function UniqueContributions({
	analytics,
	className,
}: UniqueContributionsProps) {
	const clipPath16 =
		"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
	const clipPath8 =
		"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";
	const clipHex = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

	const emptyState = (
		<div className={cn("relative group", className)}>
			<div className="p-px bg-border/40" style={{ clipPath: clipPath16 }}>
				<div
					className="bg-background/95 backdrop-blur-md p-8 text-center space-y-4"
					style={{ clipPath: clipPath16 }}
				>
					<div
						className="mx-auto w-12 h-12 flex items-center justify-center opacity-20"
						style={{
							clipPath: clipHex,
							backgroundColor: "var(--color-primary)",
						}}
					>
						<Box className="size-6 text-primary-foreground" />
					</div>
					<div className="space-y-2">
						<h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">
							HIGH_COHESION_DETECTED
						</h3>
						<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 max-w-sm mx-auto">
							TU_EQUIPO_TIENE_UNA_ALTA_SUPERPOSICIÓN_DE_FORTALEZAS.
							COHESIÓN_ÓPTIMA_DETECTADA {"//"}
							CONSIDERA_DIVERSIFICAR_NODOS_PARA_PERSPECTIVAS_ADICIONALES.
						</p>
					</div>
				</div>
			</div>
		</div>
	);

	if (analytics.uniqueStrengths.length === 0) {
		return emptyState;
	}

	return (
		<div className={cn("relative group", className)}>
			{/* Layered Border Container */}
			<div
				className="p-px bg-border/40 group-hover:bg-primary/20 transition-all duration-500"
				style={{ clipPath: clipPath16 }}
			>
				<div
					className="bg-background/95 backdrop-blur-md overflow-hidden relative"
					style={{ clipPath: clipPath16 }}
				>
					{/* Technical Header */}
					<div className="p-6 border-b border-border/40 bg-muted/5">
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<Sparkles className="size-4 text-primary animate-pulse" />
									<h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">
										UNIQUE_NODES_DETECTION
									</h3>
								</div>
								<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
									CELEBRACIÓN_DE_TALENTOS_EXCLUSIVOS_Y_COMPETENCIAS_DIFERENCIALES
								</p>
							</div>
							<div className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest">
								ELITE_NODES: {analytics.uniqueStrengths.length}
							</div>
						</div>
					</div>

					<div className="p-6 space-y-8 relative bg-grid-tech/5">
						{analytics.uniqueStrengths.map((item) => {
							const domainColor = getDomainColor(item.strength.domain);

							return (
								<div
									key={`${item.memberId}-${item.strength.id}`}
									className="relative group/node p-px bg-border/20 hover:bg-primary/20 transition-all duration-300"
									style={{ clipPath: clipPath8 }}
								>
									<div
										className="bg-background/40 relative p-6 space-y-6"
										style={{ clipPath: clipPath8 }}
									>
										{/* Sidebar domain color */}
										<div
											className="absolute left-0 top-0 bottom-0 w-1 opacity-40 group-hover/node:opacity-100 transition-opacity"
											style={{ backgroundColor: domainColor }}
										/>

										{/* Header row */}
										<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
											<div className="flex items-center gap-4">
												<div className="relative shrink-0 w-14 h-14 flex items-center justify-center">
													<div
														className="absolute inset-0 opacity-10 blur-xl animate-pulse"
														style={{ backgroundColor: domainColor }}
													/>
													<div
														className="size-full flex items-center justify-center relative z-10 text-foreground"
														style={{
															clipPath: clipHex,
															backgroundColor: "rgba(255,255,255,0.03)",
															border: "1px solid rgba(255,255,255,0.05)",
														}}
													>
														<Users className="size-6 text-muted-foreground/60 group-hover/node:text-primary transition-colors" />
													</div>
												</div>
												<div className="space-y-1">
													<p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
														NODE_EXCLUSIVITY_TAG
													</p>
													<h4 className="text-xl font-black uppercase tracking-widest text-foreground">
														{item.memberName}
													</h4>
												</div>
											</div>

											<div className="flex items-center gap-3">
												<StrengthBadge
													name={item.strength.name}
													nameEs={item.strength.nameEs}
													domain={item.strength.domain}
													showTooltip={false}
													className="scale-110"
												/>
												<div className="px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary text-[8px] font-black uppercase tracking-[0.2em] animate-pulse">
													UNIQUE_TALENT
												</div>
											</div>
										</div>

										{/* Content Analysis */}
										<div className="space-y-6">
											<div
												className="relative p-4 bg-muted/20 border-l border-border/10"
												style={{ clipPath: clipPath8 }}
											>
												<div className="flex items-center gap-2 mb-2">
													<Activity className="size-3 text-muted-foreground/40" />
													<p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
														NODE_CAPABILITY_DECRYPTION
													</p>
												</div>
												<div className="text-[12px] leading-relaxed text-muted-foreground pl-2">
													<MarkdownRenderer
														content={item.strength.briefDefinition}
														variant="compact"
													/>
												</div>
											</div>

											{/* Optimization Advisory */}
											<div
												className="p-4 bg-primary/5 border border-primary/10 relative overflow-hidden"
												style={{ clipPath: clipPath8 }}
											>
												<div className="absolute top-0 right-0 p-2 opacity-5">
													<Lightbulb className="size-16" />
												</div>
												<div className="flex items-start gap-4 relative z-10">
													<div className="pt-1">
														<div
															className="p-2 bg-primary/20 text-primary"
															style={{ clipPath: clipHex }}
														>
															<Cpu className="size-4" />
														</div>
													</div>
													<div className="space-y-2">
														<h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">
															OPTIMIZATION_ADVISORY {"//"} COMO_APROVECHAR
														</h5>
														<p className="text-[11px] leading-relaxed text-foreground/80">
															<span className="font-bold text-primary">
																{item.memberName.toUpperCase()}
															</span>{" "}
															APORTA UNA PERSPECTIVA ÚNICA AL EQUIPO. CONSIDERA
															ASIGNARLE TAREAS DE{" "}
															<span className="text-primary font-bold">
																ALTO_VALOR
															</span>{" "}
															QUE REQUIERAN ESTA FORTALEZA ESPECÍFICA PARA
															MAXIMIZAR EL RENDIMIENTO DEL NODO.
														</p>
													</div>
												</div>
											</div>

											{/* Best Partners Matrix */}
											{item.strength.bestPartners &&
												item.strength.bestPartners.length > 0 && (
													<div className="space-y-3">
														<div className="flex items-center gap-2 px-2">
															<HeartHandshake className="size-3 text-emerald-500" />
															<h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground">
																SYNERGY_MATRIX {"//"} MEJORES_COMPAÑEROS
															</h5>
														</div>
														<ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
															{item.strength.bestPartners
																.slice(0, 2)
																.map((partner, i) => (
																	<li
																		key={i}
																		className="text-[10px] p-3 bg-background/20 border border-border/10 hover:border-emerald-500/30 transition-all group/partner"
																		style={{ clipPath: clipPath8 }}
																	>
																		<div className="flex gap-2">
																			<span className="text-emerald-500 font-bold shrink-0">
																				[SYNC]
																			</span>
																			<MarkdownRenderer
																				content={partner}
																				variant="compact"
																			/>
																		</div>
																	</li>
																))}
														</ul>
													</div>
												)}
										</div>
									</div>
								</div>
							);
						})}
					</div>

					{/* Decorative Scan Line */}
					<div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
						<div
							className="w-full h-1 bg-primary animate-scan"
							style={{ top: "-10%" }}
						/>
					</div>
				</div>
			</div>

			{/* Corner Decorative Elements */}
			<div className="absolute -top-2 -right-2 w-12 h-12 border-t-2 border-r-2 border-primary/20 pointer-events-none" />
			<div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-2 border-l-2 border-primary/20 pointer-events-none" />
		</div>
	);
}
