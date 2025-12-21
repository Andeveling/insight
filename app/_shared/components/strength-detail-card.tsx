"use client";

import {
	AlertTriangle,
	Briefcase,
	ChevronDown,
	Lightbulb,
	Sparkles,
	Users,
} from "lucide-react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { cn } from "@/lib/cn";
import { getDomainColor } from "@/lib/constants/domain-colors";
import type { StrengthWithDomain } from "@/lib/types";
import { StrengthBadge } from "./strength-badge";

interface StrengthDetailCardProps {
	strength: StrengthWithDomain;
	rank?: number;
	className?: string;
}

export function StrengthDetailCard({
	strength,
	rank,
	className,
}: StrengthDetailCardProps) {
	const [isOpen, setIsOpen] = useState(true);
	const domainColor = getDomainColor(strength.domain);
	const domainBorder = getDomainColor(strength.domain, "border");

	const clipPath16 = "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
	const clipPath8 = "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={cn("group relative", className)}
		>
			{/* Cyberpunk Outer Frame */}
			<div 
				className="p-px transition-all duration-500 bg-border group-hover:bg-primary/50"
				style={{ clipPath: clipPath16 }}
			>
				<div 
					className="bg-background/95 backdrop-blur-md overflow-hidden relative"
					style={{ clipPath: clipPath16 }}
				>
					{/* Decorative Scanline/Glow */}
					<div 
						className="absolute top-0 left-0 w-full h-1 opacity-50"
						style={{ backgroundColor: domainColor }}
					/>
					<div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />

					{/* Header Section */}
					<div className="p-6 sm:p-8 space-y-6 relative z-10">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div className="flex items-center gap-4">
								{rank && (
									<div
										className="flex h-12 w-12 items-center justify-center text-lg font-black bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-transform group-hover:scale-110"
										style={{
											clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
										}}
									>
										{rank}
									</div>
								)}
								<div className="space-y-1">
									<StrengthBadge
										name={strength.name}
										nameEs={strength.nameEs}
										domain={strength.domain}
										showTooltip={false}
										size="sm"
									/>
									<p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
										Data Artifact // S-ID: {strength.id.slice(0, 8)}
									</p>
								</div>
							</div>

							<div className="flex gap-2">
								<div className="px-2 py-1 bg-muted border border-border text-[9px] font-black uppercase tracking-tighter text-muted-foreground">
									Domain: <span style={{ color: domainColor }}>{strength.domain}</span>
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<h2 className="text-4xl font-black tracking-tighter text-foreground uppercase sm:text-5xl bg-linear-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
								{strength.nameEs}
							</h2>
							<p className="text-sm font-bold text-primary uppercase tracking-[0.2em] opacity-80">
								{strength.name}
							</p>
						</div>

						{/* Brief Definition */}
						<div
							className="relative p-6 bg-muted/30 border-l-2"
							style={{ borderColor: domainColor, clipPath: clipPath8 }}
						>
							<div className="absolute top-2 right-4 text-[8px] font-black text-muted-foreground/30 uppercase tracking-widest">
								System Decryption
							</div>
							<MarkdownRenderer
								content={strength.briefDefinition}
								variant="compact"
								className="prose-p:my-0 text-foreground/90 font-medium leading-relaxed"
							/>
						</div>

						<div className="pt-4">
							<Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-8">
								<CollapsibleContent className="animate-in slide-in-from-top-4 fade-in duration-500 space-y-10">
									{/* Full Analysis */}
									{strength.fullDefinition && (
										<div className="space-y-4">
											<h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
												<span className="h-1 w-6 bg-primary/30" />
												Análisis Bio-Psicológico
											</h3>
											<div 
												className="p-6 bg-muted/20 border border-border/50 relative overflow-hidden"
												style={{ clipPath: clipPath16 }}
											>
												<MarkdownRenderer
													content={strength.fullDefinition}
													variant="default"
													className="text-foreground/80 leading-loose"
												/>
											</div>
										</div>
									)}

									{/* Dual Column: Strategies & Vulnerabilities */}
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
										{/* Strategies */}
										{strength.howToUseMoreEffectively && strength.howToUseMoreEffectively.length > 0 && (
											<div className="space-y-4">
												<h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-chart-2 flex items-center gap-2">
													<Lightbulb className="h-3 w-3" />
													Protocolos de Optimización
												</h3>
												<div className="space-y-4">
													{strength.howToUseMoreEffectively.map((tip, idx) => (
														<div 
															key={idx} 
															className="flex gap-4 p-4 bg-chart-2/5 border-[0.5px] border-chart-2/20 hover:bg-chart-2/10 transition-colors"
															style={{ clipPath: clipPath8 }}
														>
															<span className="text-xl opacity-50 font-black text-chart-2">0{idx + 1}</span>
															<MarkdownRenderer
																content={tip}
																variant="compact"
																className="prose-p:m-0 text-sm text-foreground/80"
															/>
														</div>
													))}
												</div>
											</div>
										)}

										{/* Vulnerabilities */}
										{strength.watchOuts && strength.watchOuts.length > 0 && (
											<div className="space-y-4">
												<h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-destructive flex items-center gap-2">
													<AlertTriangle className="h-3 w-3" />
													Alertas de Sobrecarga
												</h3>
												<div className="space-y-4">
													{strength.watchOuts.map((watchOut, idx) => (
														<div 
															key={idx} 
															className="flex gap-4 p-4 bg-destructive/5 border-[0.5px] border-destructive/20 hover:bg-destructive/10 transition-colors"
															style={{ clipPath: clipPath8 }}
														>
															<span className="text-xl opacity-50 font-black text-destructive">!!</span>
															<MarkdownRenderer
																content={watchOut}
																variant="compact"
																className="prose-p:m-0 text-sm text-foreground/80"
															/>
														</div>
													))}
												</div>
											</div>
										)}
									</div>

									{/* Synergy Sections */}
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
										{/* Dynamics */}
										{strength.strengthsDynamics && (
											<div className="space-y-4">
												<h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-chart-5 flex items-center gap-2">
													<Users className="h-3 w-3" />
													Dinámicas de Fusión
												</h3>
												<div 
													className="p-6 bg-muted/10 border border-border/30"
													style={{ clipPath: clipPath8 }}
												>
													<MarkdownRenderer
														content={strength.strengthsDynamics}
														variant="compact"
														className="text-sm text-foreground/70"
													/>
												</div>
											</div>
										)}

										{/* Partners */}
										{strength.bestPartners && strength.bestPartners.length > 0 && (
											<div className="space-y-4">
												<h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
													<Sparkles className="h-3 w-3" />
													Aliados Tácticos
												</h3>
												<div className="flex flex-wrap gap-2">
													{strength.bestPartners.map((partner) => (
														<div
															key={partner}
															className="px-4 py-2 bg-primary/10 border border-primary/20 text-xs font-bold text-primary hover:bg-primary/20 transition-all cursor-default"
															style={{ clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)" }}
														>
															<ReactMarkdown>{partner}</ReactMarkdown>
														</div>
													))}
												</div>
											</div>
										)}
									</div>

									{/* Career Applications */}
									{strength.careerApplications && strength.careerApplications.length > 0 && (
										<div className="space-y-4">
											<h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
												<Briefcase className="h-3 w-3" />
												Sectors de Infiltración
											</h3>
											<div className="flex flex-wrap gap-3">
												{strength.careerApplications.map((career) => (
													<span
														key={career}
														className="px-6 py-2 bg-muted border border-border text-[10px] font-black uppercase tracking-widest text-foreground/70 hover:text-foreground hover:border-primary/50 transition-all"
														style={{ clipPath: clipPath8 }}
													>
														<ReactMarkdown>{career}</ReactMarkdown>
													</span>
												))}
											</div>
										</div>
									)}
								</CollapsibleContent>

								<CollapsibleTrigger asChild>
									<button className="w-full py-4 bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all group/trigger overflow-hidden relative">
										<div className="absolute inset-0 bg-primary/5 translate-y-full group-hover/trigger:translate-y-0 transition-transform duration-300" />
										<div className="relative z-10 flex items-center justify-center gap-3">
											<span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground group-hover/trigger:text-primary transition-colors">
												{isOpen ? "Cerrar Archivo" : "Acceder al Perfil Completo"}
											</span>
											<ChevronDown
												className={cn(
													"h-4 w-4 text-muted-foreground transition-all duration-300",
													isOpen && "rotate-180 text-primary",
													"group-hover/trigger:translate-y-0.5"
												)}
											/>
										</div>
									</button>
								</CollapsibleTrigger>
							</Collapsible>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
