"use client";

import { useMemo, useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";
import {
	getDomainColor,
	getDomainMetadata,
} from "@/lib/constants/domain-colors";
import type { DomainType, TeamAnalytics } from "@/lib/types";
import { CulturesGrid } from "./cultures-grid";
import { Crosshair, Activity, LayoutGrid, Cpu, Box } from "lucide-react";

interface TeamCultureMapProps {
	analytics: TeamAnalytics;
	cultures?: Array<{
		name: string;
		nameEs: string;
		subtitle: string;
		description: string;
		focusLabel: string;
		attributes: string[];
		icon: string;
	}>;
	className?: string;
}

export function TeamCultureMap({
	analytics,
	cultures,
	className,
}: TeamCultureMapProps) {
	const [selectedDomain, setSelectedDomain] = useState<DomainType | null>(null);

	// Constants for clip-paths
	const clipPath16 =
		"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
	const clipPath12 =
		"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)";
	const clipPath8 =
		"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";
	const clipHex = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

	// Calculate the center point based on domain distribution
	const centerPoint = useMemo(() => {
		const distribution = analytics.domainDistribution;
		const doing =
			distribution.find((d) => d.domain === "Doing")?.percentage ?? 0;
		const feeling =
			distribution.find((d) => d.domain === "Feeling")?.percentage ?? 0;
		const motivating =
			distribution.find((d) => d.domain === "Motivating")?.percentage ?? 0;
		const thinking =
			distribution.find((d) => d.domain === "Thinking")?.percentage ?? 0;

		const peopleScore = motivating + feeling;
		const taskScore = doing + thinking;
		const actionScore = doing + motivating;
		const thinkingScore = thinking + feeling;

		const x = (peopleScore - taskScore) / 2 + 50;
		const y = (actionScore - thinkingScore) / 2 + 50;

		return { x, y: 100 - y };
	}, [analytics.domainDistribution]);

	const quadrants: Array<{
		domain: DomainType;
		position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
	}> = [
		{ domain: "Doing", position: "top-left" },
		{ domain: "Motivating", position: "top-right" },
		{ domain: "Thinking", position: "bottom-left" },
		{ domain: "Feeling", position: "bottom-right" },
	];

	const getDomainData = (domain: DomainType) => {
		return (
			analytics.domainDistribution.find((d) => d.domain === domain) ?? {
				domain,
				count: 0,
				percentage: 0,
				members: [],
			}
		);
	};

	return (
		<div className={cn("relative group", className)}>
			{/* Main Layered Border Container */}
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
									<LayoutGrid className="size-4 text-primary animate-pulse" />
									<h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">
										TEAM_CULTURE_MAP_v2.1
									</h3>
								</div>
								<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
									SISTEMA_DE_COORDENADAS_CONDUCTUALES // [KERNEL: STABLE]
								</p>
							</div>
							<div className="flex items-center gap-3">
								<div className="px-3 py-1 bg-muted/20 border border-border/40 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
									<div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--color-primary)]" />
									GRAVITY_SCAN: ACTIVE
								</div>
							</div>
						</div>
					</div>

					<div className="p-8 pt-12">
						<div className="space-y-20">
							{/* Quadrant Map */}
							<div className="relative aspect-square w-full max-w-2xl mx-auto p-12 bg-grid-tech/10">
								{/* Grid HUD Details */}
								<div className="absolute inset-0 border border-border/20 pointer-events-none" />
								<div className="absolute top-1/2 left-0 right-0 h-px bg-border/40 pointer-events-none" />
								<div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/40 pointer-events-none" />

								{/* Quadrant Areas */}
								<div className="absolute inset-12 grid grid-cols-2 grid-rows-2 gap-4">
									{quadrants.map(({ domain }) => {
										const data = getDomainData(domain);
										const metadata = getDomainMetadata(domain);
										const isSelected = selectedDomain === domain;
										const domainColor = getDomainColor(domain);

										return (
											<button
												key={domain}
												onClick={() =>
													setSelectedDomain(isSelected ? null : domain)
												}
												className={cn(
													"relative overflow-hidden group/quadrant transition-all duration-300",
													isSelected ? "z-20 scale-[1.05]" : "z-0",
												)}
												style={{ clipPath: clipPath12 }}
											>
												{/* Background Layered Effect */}
												<div className="absolute inset-0 p-px bg-border/20 group-hover/quadrant:bg-primary/20 transition-all">
													<div
														className="absolute inset-0 opacity-10 contrast-150 transition-opacity group-hover/quadrant:opacity-30"
														style={{
															background: `linear-gradient(135deg, transparent, ${domainColor})`,
														}}
													/>
												</div>

												{/* Content */}
												<div className="relative h-full flex flex-col items-center justify-center p-4 text-center space-y-3">
													<div className="relative">
														<span className="text-5xl opacity-40 group-hover/quadrant:opacity-100 transition-opacity duration-500">
															{metadata.icon}
														</span>
														{isSelected && (
															<div
																className="absolute inset-0 blur-xl opacity-40 animate-pulse"
																style={{ backgroundColor: domainColor }}
															/>
														)}
													</div>

													<div className="space-y-1">
														<h4
															className="text-[10px] font-black uppercase tracking-[0.2em]"
															style={{ color: domainColor }}
														>
															{metadata.nameEs}
														</h4>
														<div className="flex items-baseline justify-center gap-1">
															<span className="text-3xl font-black text-foreground">
																{data.percentage.toFixed(0)}
															</span>
															<span className="text-[10px] font-bold text-muted-foreground">
																%
															</span>
														</div>
														<p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/40">
															NODE_COUNT: {data.count}
														</p>
													</div>
												</div>

												{/* Decorative Corners */}
												<div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-border/20 group-hover/quadrant:border-primary/40 transition-colors" />
												<div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-border/20 group-hover/quadrant:border-primary/40 transition-colors" />
											</button>
										);
									})}
								</div>

								{/* Gravity Core (Center Point) */}
								<div
									className="absolute w-12 h-12 -ml-6 -mt-6 z-30 transition-all duration-700 ease-in-out group/core"
									style={{
										left: `${centerPoint.x}%`,
										top: `${centerPoint.y}%`,
									}}
								>
									{/* Core Pulse Effects */}
									<div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse" />
									<div
										className="absolute inset-0 border border-primary/40 animate-[spin_4s_linear_infinite]"
										style={{ clipPath: clipHex }}
									/>
									<div
										className="absolute inset-2 border border-primary/60 animate-[spin_3s_linear_infinite_reverse]"
										style={{ clipPath: clipHex }}
									/>

									<TooltipProvider>
										<Tooltip delayDuration={0}>
											<TooltipTrigger asChild>
												<div
													className="absolute inset-3 bg-primary flex items-center justify-center group-hover/core:scale-110 transition-transform shadow-[0_0_15px_var(--color-primary)]"
													style={{ clipPath: clipHex }}
												>
													<Crosshair className="size-3 text-primary-foreground" />
												</div>
											</TooltipTrigger>
											<TooltipContent className="p-0 bg-transparent border-0 shadow-none">
												<div
													className="p-px bg-primary/40"
													style={{ clipPath: clipPath8 }}
												>
													<div
														className="bg-background/95 backdrop-blur-md p-3"
														style={{ clipPath: clipPath8 }}
													>
														<p className="text-[9px] font-black uppercase tracking-widest text-primary">
															GRAVITY_CORE_LOCKED
														</p>
														<p className="text-[8px] text-muted-foreground uppercase tracking-widest mt-1">
															COORD: X{centerPoint.x.toFixed(1)} / Y
															{centerPoint.y.toFixed(1)}
														</p>
													</div>
												</div>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>

								{/* Axis Technical Labels */}
								<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black tracking-[0.4em] uppercase text-primary/80 flex items-center gap-4">
									<div className="w-12 h-px bg-primary/20" />
									ALTO_ENFOQUE_ACCION
									<div className="w-12 h-px bg-primary/20" />
								</div>
								<div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black tracking-[0.4em] uppercase text-muted-foreground/40 flex items-center gap-4">
									<div className="w-12 h-px border-t border-dashed border-border/20" />
									ALTO_ENFOQUE_REFLEXION
									<div className="w-12 h-px border-t border-dashed border-border/20" />
								</div>

								<div className="absolute top-1/2 -left-48 -translate-y-1/2 -rotate-90 text-[9px] font-black tracking-[0.4em] uppercase text-muted-foreground/40 whitespace-nowrap">
									ENFOQUE_RESULTADOS_SISTEMA
								</div>
								<div className="absolute top-1/2 -right-44 -translate-y-1/2 rotate-90 text-[9px] font-black tracking-[0.4em] uppercase text-muted-foreground/40 whitespace-nowrap">
									ENFOQUE_COLABORACION_NODOS
								</div>
							</div>

							{/* Selected Domain Data Stream */}
							{selectedDomain && (
								<div className="animate-in fade-in slide-in-from-top-4 duration-500">
									<div
										className="p-px bg-border/20"
										style={{ clipPath: clipPath12 }}
									>
										<div
											className="bg-muted/10 p-6 flex flex-col md:flex-row items-center gap-8"
											style={{ clipPath: clipPath12 }}
										>
											<div className="relative shrink-0 w-24 h-24 flex items-center justify-center">
												<div
													className="absolute inset-0 opacity-20 blur-xl animate-pulse"
													style={{
														backgroundColor: getDomainColor(selectedDomain),
													}}
												/>
												<div
													className="size-full border border-border/20 animate-spin-slow opacity-30"
													style={{ clipPath: clipHex }}
												/>
												<span className="text-6xl relative z-10">
													{getDomainMetadata(selectedDomain).icon}
												</span>
											</div>

											<div className="flex-1 space-y-4">
												<div className="flex items-center gap-3">
													<Box className="size-4 text-primary" />
													<h4
														className="text-xl font-black uppercase tracking-[0.2em]"
														style={{ color: getDomainColor(selectedDomain) }}
													>
														{getDomainMetadata(selectedDomain).nameEs} //
														[DATA_STREAM]
													</h4>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<div className="space-y-1">
														<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
															METAFORA_SISTEMA
														</p>
														<p className="text-sm italic text-foreground/80">
															{getDomainMetadata(selectedDomain).metaphor}
														</p>
													</div>
													<div className="space-y-1">
														<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
															KEY_PROTOCOL_QUERY
														</p>
														<p className="text-sm font-bold text-primary">
															{getDomainMetadata(selectedDomain).keyQuestion}
														</p>
													</div>
												</div>
												<div className="pt-2 border-t border-border/10">
													<div className="inline-flex items-center gap-2 px-3 py-1 bg-background/40 border border-border/20 text-[10px] font-black tracking-widest uppercase">
														<Cpu className="size-3" />
														COBERTURA_NODO:{" "}
														{getDomainData(selectedDomain).percentage.toFixed(
															0,
														)}
														% DEL EQUIPO
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}

							{/* Cultures Grid Integration */}
							{cultures && cultures.length > 0 && (
								<div className="border-t border-border/20 pt-12">
									<div className="flex items-center gap-3 mb-8">
										<Activity className="size-4 text-primary" />
										<h4 className="text-xs font-black uppercase tracking-[0.3em]">
											ARCHETYPES_DISTRIBUTION // [CULTURES]
										</h4>
									</div>
									<CulturesGrid cultures={cultures} />
								</div>
							)}
						</div>
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

			{/* Corner Decorative Element */}
			<div className="absolute -top-2 -right-2 w-12 h-12 border-t-2 border-r-2 border-primary/20 pointer-events-none" />
			<div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-2 border-l-2 border-primary/20 pointer-events-none" />
		</div>
	);
}
