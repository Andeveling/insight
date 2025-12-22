"use client";

import { Activity, Shield, Target, Zap } from "lucide-react";
import { useMemo } from "react";
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
import type {
	DomainType,
	StrengthWithDomain,
	TeamMemberWithStrengths,
} from "@/lib/types";
import { groupStrengthsByDomain } from "@/lib/utils/strength-helpers";

interface TeamStrengthsGridProps {
	teamMembers: TeamMemberWithStrengths[];
	allStrengths?: StrengthWithDomain[];
	className?: string;
}

export function TeamStrengthsGrid({
	teamMembers,
	allStrengths,
	className,
}: TeamStrengthsGridProps) {
	// Constants for clip-paths
	const clipPath16 =
		"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
	const clipPath8 =
		"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";
	const clipHex = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

	// Get all unique strengths from team members, grouped by domain
	const strengthsByDomain = useMemo(() => {
		if (allStrengths) {
			return groupStrengthsByDomain(allStrengths);
		}

		const strengths = teamMembers.flatMap((member) =>
			member.strengths.map((s) => s.strength),
		);

		// Remove duplicates
		const uniqueStrengths = Array.from(
			new Map(strengths.map((s) => [s.id, s])).values(),
		);

		return groupStrengthsByDomain(uniqueStrengths);
	}, [teamMembers, allStrengths]);

	// Get ordered list of all strengths for columns
	const orderedStrengths = useMemo(() => {
		const domains: DomainType[] = [
			"Doing",
			"Feeling",
			"Motivating",
			"Thinking",
		];
		return domains.flatMap((domain) => strengthsByDomain[domain]);
	}, [strengthsByDomain]);

	// Check if a member has a specific strength
	const hasMemberStrength = (memberId: string, strengthId: string): boolean => {
		const member = teamMembers.find((m) => m.id === memberId);
		return member?.strengths.some((s) => s.strength.id === strengthId) ?? false;
	};

	// Get member's rank for a strength (1-5)
	const getMemberStrengthRank = (
		memberId: string,
		strengthId: string,
	): number | null => {
		const member = teamMembers.find((m) => m.id === memberId);
		const userStrength = member?.strengths.find(
			(s) => s.strength.id === strengthId,
		);
		return userStrength?.rank ?? null;
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
									<div className="w-2 h-2 bg-primary animate-pulse shadow-[0_0_8px_var(--color-primary)]" />
									<h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">
										TEAM_STRENGTH_MATRIX_v3.2
									</h3>
								</div>
								<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
									VISUALIZACIÓN_DE_SINERGIAS_Y_PROTOCOLOS_DE_EQUIPO
								</p>
							</div>
							<div className="flex items-center gap-3">
								<div className="px-3 py-1 bg-muted/20 border border-border/40 text-[9px] font-black uppercase tracking-widest">
									SYNC: ONLINE
								</div>
								<div className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest">
									NODES: {teamMembers.length}
								</div>
							</div>
						</div>
					</div>

					<div className="p-0 overflow-x-auto bg-grid-tech/5">
						<div className="min-w-max">
							{/* Header Row - Domain Groups */}
							<div className="flex border-b border-border/40 bg-muted/20">
								<div className="sticky left-0 z-30 w-56 bg-muted/90 backdrop-blur-md border-r border-border/40 p-4">
									<p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
										IDENTIFICADOR_NODO
									</p>
								</div>
								{(
									["Doing", "Feeling", "Motivating", "Thinking"] as DomainType[]
								).map((domain) => {
									const count = strengthsByDomain[domain].length;
									if (count === 0) return null;
									const metadata = getDomainMetadata(domain);

									return (
										<div
											key={domain}
											className="flex items-center justify-center px-4 py-2 border-l border-border/20 relative group/domain"
											style={{
												width: `${count * 48}px`,
											}}
										>
											<div
												className="absolute inset-x-0 top-0 h-1 transition-all group-hover/domain:h-full opacity-20"
												style={{ backgroundColor: getDomainColor(domain) }}
											/>
											<span
												className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em]"
												style={{ color: getDomainColor(domain) }}
											>
												{metadata.nameEs}
											</span>
										</div>
									);
								})}
							</div>

							{/* Strength Names Row */}
							<div className="flex border-b border-border/40 bg-background/50 sticky top-0 z-20">
								<div className="sticky left-0 z-30 w-56 bg-background/90 backdrop-blur-md border-r border-border/40 shadow-[8px_0_20px_-10px_rgba(0,0,0,0.3)]" />
								{orderedStrengths.map((strength) => (
									<TooltipProvider key={strength.id}>
										<Tooltip delayDuration={0}>
											<TooltipTrigger asChild>
												<div
													className="flex items-end justify-center border-l border-border/10 cursor-help transition-all hover:bg-muted/30 py-4 group/strength"
													style={{
														width: "48px",
														height: "200px",
													}}
												>
													<div
														className="text-[9px] font-black uppercase tracking-[0.2em] transition-colors group-hover/strength:text-primary text-secondary-foreground"
														style={{
															color: getDomainColor(strength.domain, "light"),
															writingMode: "vertical-rl",
															transform: "rotate(180deg)",
														}}
													>
														{strength.nameEs}
													</div>
												</div>
											</TooltipTrigger>
											<TooltipContent className="p-0 bg-transparent border-0 shadow-none">
												<div
													className="p-px bg-primary/40"
													style={{ clipPath: clipPath8 }}
												>
													<div
														className="bg-background/95 backdrop-blur-md p-4 max-w-xs"
														style={{ clipPath: clipPath8 }}
													>
														<p className="font-black text-[10px] uppercase tracking-widest text-primary mb-1">
															{strength.nameEs} {"// [INFO]"}
														</p>
														<p className="text-[11px] leading-relaxed text-secondary-foreground">
															{strength.briefDefinition}
														</p>
														<div
															className="mt-3 h-1 w-full opacity-30"
															style={{
																backgroundColor: getDomainColor(
																	strength.domain,
																),
															}}
														/>
													</div>
												</div>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								))}
							</div>

							{/* Member Rows */}
							{teamMembers.map((member, idx) => (
								<div
									key={member.id}
									className={cn(
										"flex transition-all duration-300 group/row",
										idx % 2 === 0 ? "bg-background/40" : "bg-muted/5",
										"hover:bg-primary/5",
									)}
								>
									{/* Member Name */}
									<div className="sticky left-0 z-20 w-56 bg-inherit backdrop-blur-md border-r border-border/40 p-4 flex items-center gap-3 shadow-[8px_0_20px_-10px_rgba(0,0,0,0.3)]">
										<div className="relative">
											<div className="absolute inset-0 bg-primary/20 blur-md rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity" />
											<div
												className="h-8 w-8 bg-muted/40 flex items-center justify-center relative z-10"
												style={{ clipPath: clipHex }}
											>
												<span className="text-[10px] font-black text-muted-foreground group-hover/row:text-primary">
													{member.name.charAt(0).toUpperCase()}
												</span>
											</div>
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-black text-[10px] uppercase tracking-widest text-foreground truncate group-hover/row:text-primary transition-colors">
												{member.name}
											</p>
											<p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/50 truncate">
												UID: {member.id.substring(0, 8).toUpperCase()}
											</p>
										</div>
									</div>

									{/* Strength Cells */}
									{orderedStrengths.map((strength) => {
										const hasStrength = hasMemberStrength(
											member.id,
											strength.id,
										);
										const rank = getMemberStrengthRank(member.id, strength.id);

										return (
											<div
												key={strength.id}
												className="flex items-center justify-center border-l border-border/10 transition-colors group-hover/row:border-border/30"
												style={{ width: "48px", height: "64px" }}
											>
												{hasStrength && (
													<TooltipProvider>
														<Tooltip delayDuration={0}>
															<TooltipTrigger asChild>
																<div className="relative group/hex pointer-events-auto">
																	{/* Reflection Glow */}
																	<div
																		className="absolute inset-0 blur-md opacity-40 scale-150 transition-all group-hover/hex:opacity-100 animate-pulse"
																		style={{
																			backgroundColor: getDomainColor(
																				strength.domain,
																			),
																		}}
																	/>
																	<div
																		className="h-5 w-5 cursor-pointer relative z-10 flex items-center justify-center transition-all hover:scale-125"
																		style={{
																			clipPath: clipHex,
																			backgroundColor: getDomainColor(
																				strength.domain,
																			),
																		}}
																	>
																		<span className="text-[8px] font-black text-white/40 group-hover/hex:text-white transition-colors">
																			{rank}
																		</span>
																	</div>
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
																		<p className="text-[9px] font-black uppercase tracking-widest text-secondary-foreground">
																			{strength.nameEs}
																		</p>
																		<p className="text-[8px] text-muted-foreground uppercase tracking-widest mt-1">
																			RANK: #{rank} {"// NODE:  "}
																			{member.name.toUpperCase()}
																		</p>
																	</div>
																</div>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												)}
											</div>
										);
									})}
								</div>
							))}
						</div>
					</div>

					{/* Legend / System Status Footer */}
					<div className="p-6 border-t border-border/40 bg-muted/20 relative">
						<div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
							<Shield className="w-24 h-24" />
						</div>

						<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
							<div className="space-y-4">
								<p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
									DOMINIOS_DE_PROTOCOLOS:
								</p>
								<div className="flex flex-wrap gap-6">
									{(
										[
											"Doing",
											"Feeling",
											"Motivating",
											"Thinking",
										] as DomainType[]
									).map((domain) => {
										const metadata = getDomainMetadata(domain);
										return (
											<div
												key={domain}
												className="flex items-center gap-3 group/legend"
											>
												<div
													className="h-4 w-4 transition-transform group-hover/legend:scale-110"
													style={{
														backgroundColor: getDomainColor(domain),
														clipPath: clipHex,
													}}
												/>
												<div className="space-y-0.5">
													<p className="text-[9px] font-black uppercase tracking-widest text-foreground">
														{metadata.nameEs}
													</p>
													<p className="text-[7px] font-bold uppercase tracking-widest text-muted-foreground/60">
														{domain.toUpperCase()}
													</p>
												</div>
											</div>
										);
									})}
								</div>
							</div>

							<div className="flex flex-wrap gap-4">
								<div
									className="flex items-center gap-2 p-3 bg-background/40 border border-border/20"
									style={{ clipPath: clipPath8 }}
								>
									<Zap className="w-3 h-3 text-primary animate-pulse" />
									<div className="space-y-0.5">
										<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
											ENERGY_CORE
										</p>
										<p className="text-[10px] font-bold uppercase tracking-widest text-primary">
											STABLE
										</p>
									</div>
								</div>
								<div
									className="flex items-center gap-2 p-3 bg-background/40 border border-border/20"
									style={{ clipPath: clipPath8 }}
								>
									<Target className="w-3 h-3 text-emerald-500" />
									<div className="space-y-0.5">
										<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
											MISSION_SYNC
										</p>
										<p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
											OPTIMIZED
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Decorative Scan Line */}
					<div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
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
