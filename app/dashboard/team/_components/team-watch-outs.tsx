"use client";

import { AlertTriangle, ShieldAlert, Activity, Cpu } from "lucide-react";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { cn } from "@/lib/cn";
import { getDomainColor } from "@/lib/constants/domain-colors";
import type { TeamAnalytics } from "@/lib/types";

interface TeamWatchOutsProps {
	analytics: TeamAnalytics;
	className?: string;
}

export function TeamWatchOuts({ analytics, className }: TeamWatchOutsProps) {
	const clipPath16 =
		"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
	const clipPath8 =
		"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";
	const clipHex = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

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
									<AlertTriangle className="size-4 text-amber-500 animate-pulse" />
									<h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">
										RISK_ASSESSMENT_PROTOCOL
									</h3>
								</div>
								<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
									DETECCIÓN_DE_ANOMALÍAS_Y_SOBRECARGA_DE_NODOS_v1.0
								</p>
							</div>
							<div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-widest">
								ANOMALIES: {analytics.overusedStrengths.length}
							</div>
						</div>
					</div>

					<div className="p-6 space-y-6 relative bg-grid-tech/5">
						{analytics.overusedStrengths.map((item) => {
							const riskLevel =
								item.percentage >= 80
									? "high"
									: item.percentage >= 60
										? "medium"
										: "low";

							const riskColors = {
								high: {
									bg: "bg-red-500/5",
									border: "border-red-500/30",
									text: "text-red-500",
									glow: "shadow-[0_0_15px_rgba(239,68,68,0.2)]",
								},
								medium: {
									bg: "bg-amber-500/5",
									border: "border-amber-500/30",
									text: "text-amber-500",
									glow: "shadow-[0_0_15px_rgba(245,158,11,0.2)]",
								},
								low: {
									bg: "bg-blue-500/5",
									border: "border-blue-500/30",
									text: "text-blue-500",
									glow: "shadow-[0_0_15px_rgba(59,130,246,0.2)]",
								},
							};

							const colors = riskColors[riskLevel];
							const domainColor = getDomainColor(item.strength.domain);

							return (
								<div
									key={item.strength.id}
									className={cn(
										"relative overflow-hidden group/item p-px transition-all duration-300",
										colors.border,
										colors.glow,
									)}
									style={{ clipPath: clipPath8 }}
								>
									<div
										className={cn(
											"bg-background/80 relative p-6 space-y-4",
											colors.bg,
										)}
										style={{ clipPath: clipPath8 }}
									>
										{/* Risk Level Badge */}
										<div className="absolute top-0 right-0 p-4">
											<div
												className={cn(
													"px-2 py-0.5 text-[7px] font-black uppercase tracking-widest border border-current",
													colors.text,
												)}
											>
												RISK_{riskLevel.toUpperCase()}
											</div>
										</div>

										{/* Content Header */}
										<div className="flex items-start gap-4">
											<div className="relative shrink-0 w-12 h-12 flex items-center justify-center">
												<div
													className="absolute inset-0 opacity-20 blur-md animate-pulse"
													style={{ backgroundColor: domainColor }}
												/>
												<div
													className="size-full flex items-center justify-center relative z-10 text-primary-foreground"
													style={{
														clipPath: clipHex,
														backgroundColor: domainColor,
													}}
												>
													<ShieldAlert className="size-5" />
												</div>
											</div>
											<div className="space-y-1">
												<h4 className="text-lg font-black uppercase tracking-widest text-foreground">
													{item.strength.nameEs}
												</h4>
												<div className="flex items-center gap-3">
													<p
														className={cn(
															"text-[10px] font-black tracking-widest",
															colors.text,
														)}
													>
														MODO_SOBRECARGA: {item.percentage.toFixed(0)}% DEL
														NODO
													</p>
													<span className="text-muted-foreground/20">|</span>
													<p className="text-[10px] font-black tracking-widest text-muted-foreground/60">
														NODES_AFFECTED: {item.count}/
														{analytics.totalMembers}
													</p>
												</div>
											</div>
										</div>

										{/* Technical Analysis */}
										<div className="space-y-4 pt-4 border-t border-border/10">
											<div
												className="relative p-4 bg-muted/20 border-l-2"
												style={{
													borderColor: domainColor,
													clipPath: clipPath8,
												}}
											>
												<div className="flex items-center gap-2 mb-2">
													<Activity className="size-3 text-muted-foreground/40" />
													<p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
														BASE_DEFINITION_DECRYPTED
													</p>
												</div>
												<div className="text-[11px] leading-relaxed text-muted-foreground">
													<MarkdownRenderer
														content={item.strength.briefDefinition}
														variant="compact"
													/>
												</div>
											</div>

											{item.strength.watchOuts &&
												item.strength.watchOuts.length > 0 && (
													<div className="space-y-3">
														<div className="flex items-center gap-2 px-2">
															<Cpu className="size-3 text-primary" />
															<h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground">
																ANOMALY_LOGS // PUNTOS_DE_ATENCION
															</h5>
														</div>
														<ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
															{item.strength.watchOuts.map((watchOut, idx) => (
																<li
																	key={idx}
																	className="text-[10px] p-3 bg-background/40 border border-border/10 hover:border-primary/20 transition-colors group/log"
																	style={{ clipPath: clipPath8 }}
																>
																	<div className="flex gap-2">
																		<span className="text-primary font-bold">
																			[!]
																		</span>
																		<MarkdownRenderer
																			content={watchOut}
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

									{/* Item Accent Decoration */}
									<div
										className="absolute top-0 right-0 w-16 h-1 bg-current opacity-20"
										style={{ color: domainColor }}
									/>
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
