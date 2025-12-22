/** biome-ignore-all lint/suspicious/noArrayIndexKey: false positive */
"use client";

import {
	AlertTriangleIcon,
	CalendarIcon,
	CheckCircle2Icon,
	ChevronDownIcon,
	ClockIcon,
	FlagIcon,
	LightbulbIcon,
	RocketIcon,
	ShieldAlertIcon,
	SparklesIcon,
	TargetIcon,
	UsersIcon,
	ChevronRight,
	Activity,
	Cpu,
	Box,
	LayoutGrid,
	Zap,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/cn";

// Constants for clip-paths
const clipPath16 =
	"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
const clipPath12 =
	"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)";
const clipPath8 =
	"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";
const clipHex = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

// ============================================================
// Report Section Components
// ============================================================

export interface ReportSectionProps extends ComponentProps<"div"> {
	title: string;
	description?: string;
	icon?: ReactNode;
	defaultOpen?: boolean;
}

export function ReportSection({
	title,
	description,
	icon,
	defaultOpen = true,
	children,
	className,
	...props
}: ReportSectionProps) {
	return (
		<Collapsible defaultOpen={defaultOpen} asChild>
			<div className={cn("group/section relative", className)} {...props}>
				<CollapsibleTrigger className="group/trigger w-full text-left outline-none">
					<div
						className={cn(
							"p-px transition-all duration-500",
							"bg-border/40 group-hover/trigger:bg-primary/20",
							"group-data-[state=open]/section:bg-primary/5 group-data-[state=open]/section:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.1)]"
						)}
						style={{ clipPath: clipPath12 }}
					>
						<div
							className={cn(
								"bg-background/95 backdrop-blur-md p-6 relative flex items-center justify-between transition-colors duration-500",
								"group-data-[state=open]/section:bg-primary/5"
							)}
							style={{ clipPath: clipPath12 }}
						>
							{/* Left border highlight when open */}
							<div className="absolute left-0 top-6 bottom-6 w-0.5 bg-primary opacity-0 group-data-[state=open]/section:opacity-50 transition-opacity" />
							<div className="flex items-center gap-5">
								{icon && (
									<div className="relative shrink-0 size-14 flex items-center justify-center">
										<div
											className="absolute inset-0 bg-primary/20 transition-all duration-500 group-data-[state=open]/section:bg-primary/40"
											style={{ clipPath: clipHex }}
										/>
										<div
											className="absolute inset-[1px] bg-background group-data-[state=open]/section:bg-primary/5 transition-all duration-500"
											style={{ clipPath: clipHex }}
										/>
										<div className="relative z-10 transition-transform group-hover/trigger:scale-110 text-primary">
											{icon}
										</div>
									</div>
								)}
								<div className="space-y-1">
									<h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground group-data-[state=open]/section:text-primary transition-colors">
										{title.replace(/\s+/g, "_").toUpperCase()}
									</h3>
									{description && (
										<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
											{description}
										</p>
									)}
								</div>
							</div>
							<div className="relative size-8 flex items-center justify-center">
								<div
									className={cn(
										"absolute inset-0 transition-all duration-500",
										"bg-border/40 group-data-[state=open]/section:bg-primary/50"
									)}
									style={{ clipPath: clipHex }}
								/>
								<div
									className={cn(
										"absolute inset-[1px] bg-background transition-all duration-500",
										"group-data-[state=open]/section:bg-primary/10"
									)}
									style={{ clipPath: clipHex }}
								/>
								<div className={cn(
									"relative z-10 transition-transform duration-500",
									"group-data-[state=open]/section:rotate-180 group-data-[state=open]/section:text-primary"
								)}>
									<ChevronDownIcon className="size-4" />
								</div>
							</div>

							{/* Technical details background */}
							<div className="absolute top-0 right-12 bottom-0 w-32 bg-grid-tech/5 opacity-40 pointer-events-none" />
						</div>
					</div>
				</CollapsibleTrigger>

				<CollapsibleContent className="mt-4 animate-in slide-in-from-top-4 fade-in duration-500">
					<div className="p-1 space-y-6">{children}</div>
				</CollapsibleContent>
			</div>
		</Collapsible>
	);
}

// ============================================================
// Insight Card Component
// ============================================================

export interface InsightCardProps {
	title: string;
	description: string;
	actionItems?: string[];
	variant?: "insight" | "opportunity";
}

export function InsightCard({
	title,
	description,
	actionItems,
	variant = "insight",
}: InsightCardProps) {
	const isInsight = variant === "insight";
	const accentColor = isInsight
		? "var(--color-primary)"
		: "var(--color-purple-500)";

	return (
		<div
			className="p-px bg-border/20 hover:bg-primary/20 transition-all duration-300"
			style={{ clipPath: clipPath8 }}
		>
			<div
				className="bg-background/95 p-6 h-full flex flex-col relative overflow-hidden"
				style={{ clipPath: clipPath8 }}
			>
				{/* Technical detail accent */}
				<div
					className="absolute top-0 right-0 w-16 h-1 opacity-40"
					style={{ backgroundColor: accentColor }}
				/>

				<div className="space-y-6 flex-1">
					<div className="flex items-start gap-4">
						<div className="relative shrink-0 size-10 flex items-center justify-center">
							<div
								className="absolute inset-0 opacity-10"
								style={{ backgroundColor: accentColor, clipPath: clipHex }}
							/>
							<div className="relative z-10" style={{ color: accentColor }}>
								{isInsight ? (
									<LightbulbIcon className="size-5" />
								) : (
									<SparklesIcon className="size-5" />
								)}
							</div>
						</div>
						<div className="space-y-1">
							<h4 className="text-xs font-black uppercase tracking-widest text-foreground leading-tight">
								{title}
							</h4>
							<div className="flex items-center gap-2">
								<div className="size-1 rounded-full bg-primary/40 animate-pulse" />
								<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">
									ANALYTIC_NODE_DETECTED
								</p>
							</div>
						</div>
					</div>

					<p className="text-[11px] leading-relaxed text-muted-foreground/80 font-medium italic border-l border-border/20 pl-4">
						{description}
					</p>

					{actionItems && actionItems.length > 0 && (
						<div className="space-y-4 pt-4 border-t border-border/10">
							<div className="flex items-center gap-2">
								<Zap className="size-3 text-primary" />
								<h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground">
									EXECUTION_PROTOCOLS
								</h5>
							</div>
							<ul className="space-y-3">
								{actionItems.map((item, i) => (
									<li
										key={i}
										className="flex items-start gap-3 text-[10px] font-bold uppercase tracking-widest text-foreground/70 group/item"
									>
										<div className="relative size-4 shrink-0 flex items-center justify-center">
											<div
												className="absolute inset-0 bg-primary/20"
												style={{ clipPath: clipHex }}
											/>
											<div
												className="absolute inset-[1px] bg-background/95 flex items-center justify-center text-primary"
												style={{ clipPath: clipHex }}
											>
												<Zap className="size-2" />
											</div>
										</div>
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

// ============================================================
// Red Flag Card Component
// ============================================================

export interface RedFlagCardProps {
	title: string;
	description: string;
	severity: "low" | "medium" | "high";
	mitigation?: string[];
}

const severityConfig = {
	low: {
		color: "text-amber-500",
		bg: "bg-amber-500/5",
		border: "border-amber-500/30",
		label: "LEVEL_LOW",
	},
	medium: {
		color: "text-orange-500",
		bg: "bg-orange-50/5",
		border: "border-orange-500/30",
		label: "LEVEL_MEDIUM",
	},
	high: {
		color: "text-red-500",
		bg: "bg-red-50/5",
		border: "border-red-500/30",
		label: "LEVEL_CRITICAL",
	},
} as const;

export function RedFlagCard({
	title,
	description,
	severity,
	mitigation,
}: RedFlagCardProps) {
	const config = severityConfig[severity];

	return (
		<div
			className={cn("p-px transition-all duration-300", config.border)}
			style={{ clipPath: clipPath8 }}
		>
			<div
				className={cn(
					"bg-background/95 p-6 h-full flex flex-col relative overflow-hidden",
					config.bg,
				)}
				style={{ clipPath: clipPath8 }}
			>
				<div className="absolute top-0 right-0 p-3">
					<div
						className={cn(
							"px-2 py-0.5 border border-current text-[7px] font-black uppercase tracking-widest",
							config.color,
						)}
					>
						{config.label}
					</div>
				</div>

				<div className="space-y-6">
					<div className="flex items-start gap-4">
						<div className="relative shrink-0 size-10 flex items-center justify-center">
							<div
								className="absolute inset-0 opacity-40"
								style={{
									backgroundColor: config.color.includes("amber")
										? "#f59e0b"
										: config.color.includes("orange")
											? "#f97316"
											: "#ef4444",
									clipPath: clipHex,
								}}
							/>
							<div
								className="absolute inset-[1.5px] bg-background/95"
								style={{ clipPath: clipHex }}
							/>
							<div className={cn("relative z-10", config.color)}>
								{severity === "high" ? (
									<ShieldAlertIcon className="size-5" />
								) : (
									<AlertTriangleIcon className="size-5" />
								)}
							</div>
						</div>
						<div className="space-y-1">
							<h4 className="text-xs font-black uppercase tracking-widest text-foreground leading-tight max-w-[80%]">
								{title}
							</h4>
							<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">
								RISK_ANOMALY_LOG
							</p>
						</div>
					</div>

					<p className="text-[11px] leading-relaxed text-muted-foreground/80 font-medium border-l border-border/20 pl-4">
						{description}
					</p>

					{mitigation && mitigation.length > 0 && (
						<div className="space-y-4 pt-4 border-t border-border/10">
							<div className="flex items-center gap-2">
								<TargetIcon className="size-3 text-amber-500" />
								<h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground">
									MITIGATION_STRATEGY_PROTOCOL
								</h5>
							</div>
							<ul className="space-y-2">
								{mitigation.map((item, i) => (
									<li
										key={i}
										className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground/70"
									>
										<span className="text-amber-500">[!]</span>
										{item}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

// ============================================================
// Strength Dynamics Card
// ============================================================

export interface StrengthDynamicsProps {
	synergies: Array<{
		strengths: string[];
		effect: string;
	}>;
	tensions?: Array<{
		strengths: string[];
		conflict: string;
		resolution: string;
	}>;
	uniqueBlend: string;
}

export function StrengthDynamicsCard({
	synergies,
	tensions,
	uniqueBlend,
}: StrengthDynamicsProps) {
	return (
		<div className="p-px bg-border/40" style={{ clipPath: clipPath12 }}>
			<div
				className="bg-background/95 backdrop-blur-md overflow-hidden relative"
				style={{ clipPath: clipPath12 }}
			>
				<div className="p-8 border-b border-border/40 bg-muted/5 space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Activity className="size-4 text-primary animate-pulse" />
							<h4 className="text-xs font-black uppercase tracking-[0.4em] text-foreground">
								NEURAL_STRENGTH_COHESION
							</h4>
						</div>
						<div className="px-2 py-0.5 border border-primary/20 text-[7px] font-black uppercase tracking-widest text-primary/60">
							STATUS: OPTIMIZED
						</div>
					</div>
					<div
						className="relative p-6 bg-primary/5 border border-primary/10 overflow-hidden"
						style={{ clipPath: clipPath8 }}
					>
						<div className="absolute inset-0 bg-grid-tech/5 opacity-40" />
						<p className="relative z-10 text-sm font-bold uppercase tracking-widest text-foreground leading-relaxed italic text-center">
							"{uniqueBlend}"
						</p>
					</div>
				</div>

				<div className="p-8 space-y-12">
					{/* Synergies */}
					<div className="space-y-6">
						<div className="flex items-center gap-3">
							<SparklesIcon className="size-4 text-emerald-500" />
							<h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">
								CORE_SYNERGIES_STREAMS
							</h5>
						</div>
						<div className="grid gap-4">
							{synergies.map((synergy, i) => (
								<div
									key={i}
									className="group/synergy relative p-6 bg-muted/10 border border-border/10 hover:border-emerald-500/20 transition-all"
									style={{ clipPath: clipPath8 }}
								>
									<div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/40 group-hover/synergy:w-1.5 transition-all" />
									<div className="space-y-4">
										<div className="flex flex-wrap gap-2">
											{synergy.strengths.map((s) => (
												<Badge
													key={s}
													variant="secondary"
													className="bg-background/80 text-[8px] font-black uppercase tracking-widest rounded-none border-transparent"
												>
													{s}
												</Badge>
											))}
										</div>
										<p className="text-xs font-medium text-muted-foreground/80 leading-relaxed italic">
											{synergy.effect}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Tensions */}
					{tensions && tensions.length > 0 && (
						<div className="space-y-6 border-t border-border/10 pt-12">
							<div className="flex items-center gap-3">
								<AlertTriangleIcon className="size-4 text-orange-500" />
								<h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">
									NUCLEAR_TENSION_ADAPTATION
								</h5>
							</div>
							<div className="grid gap-4">
								{tensions.map((tension, i) => (
									<div
										key={i}
										className="group/tension relative p-6 bg-orange-500/5 border border-orange-500/10 hover:border-orange-500/30 transition-all"
										style={{ clipPath: clipPath8 }}
									>
										<div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500/40 group-hover/tension:w-1.5 transition-all" />
										<div className="space-y-4">
											<div className="flex flex-wrap gap-2">
												{tension.strengths.map((s) => (
													<Badge
														key={s}
														variant="outline"
														className="border-orange-500/20 bg-orange-500/5 text-orange-500 text-[8px] font-black uppercase tracking-widest rounded-none"
													>
														{s}
													</Badge>
												))}
											</div>
											<div className="space-y-3">
												<p className="text-[11px] font-black uppercase tracking-widest text-orange-500/80 leading-relaxed">
													CONFLICT: {tension.conflict}
												</p>
												<div className="p-3 bg-background/40 border border-orange-500/10 text-[10px] uppercase font-bold tracking-widest text-muted-foreground leading-relaxed">
													<span className="text-orange-500">
														ADAPTATION_PROTOCOL:
													</span>{" "}
													{tension.resolution}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

// ============================================================
// Action Plan Card
// ============================================================

export interface ActionPlanProps {
	immediate: string[];
	shortTerm: string[];
	longTerm: string[];
}

export function ActionPlanCard({
	immediate,
	shortTerm,
	longTerm,
}: ActionPlanProps) {
	const sections = [
		{
			label: "IMMEDIATE_ACTION",
			sub: "ESTA_SEMANA",
			items: immediate,
			icon: <ClockIcon className="size-4" />,
			color: "text-primary",
		},
		{
			label: "SHORT_TERM_STRATEGY",
			sub: "ESTE_MES",
			items: shortTerm,
			icon: <CalendarIcon className="size-4" />,
			color: "text-blue-500",
		},
		{
			label: "NUCLEAR_GOALS",
			sub: "ESTE_AÑO",
			items: longTerm,
			icon: <FlagIcon className="size-4" />,
			color: "text-purple-500",
		},
	];

	return (
		<div className="p-px bg-border/40" style={{ clipPath: clipPath12 }}>
			<div
				className="bg-background/95 p-8 relative overflow-hidden"
				style={{ clipPath: clipPath12 }}
			>
				<div className="absolute inset-0 bg-grid-tech/5 pointer-events-none" />

				<div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
					{sections.map((section, idx) => (
						<div key={idx} className="space-y-6 flex flex-col h-full">
							<div className="flex items-center gap-3">
								<div className="relative size-8 flex items-center justify-center">
									<div 
										className={cn("absolute inset-0 bg-muted/20", section.color.replace("text-", "bg-"), "opacity-40")}
										style={{ clipPath: clipHex }}
									/>
									<div 
										className={cn("absolute inset-[1px] bg-background/50 flex items-center justify-center", section.color)}
										style={{ clipPath: clipHex }}
									>
										{section.icon}
									</div>
								</div>
								<div className="space-y-0.5">
									<h4
										className={cn(
											"text-[10px] font-black uppercase tracking-[0.2em]",
											section.color,
										)}
									>
										{section.label}
									</h4>
									<p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">
										{section.sub}
									</p>
								</div>
							</div>

							<div
								className="flex-1 p-6 bg-muted/5 border border-border/10 relative group/action hover:border-primary/20 transition-all h-full"
								style={{ clipPath: clipPath8 }}
							>
								<div className="absolute top-0 right-0 w-8 h-8 opacity-5 pointer-events-none">
									<LayoutGrid className="size-full" />
								</div>
								<ul className="space-y-4">
									{section.items.map((item, i) => (
										<li
											key={i}
											className="flex gap-3 text-[10px] font-bold uppercase tracking-widest text-foreground/70 group/item"
										>
											<div
												className={cn(
													"mt-1 size-1.5 shrink-0 transition-all group-hover/item:scale-125",
													section.color.replace("text-", "bg-"),
												)}
												style={{ clipPath: clipHex }}
											/>
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// ============================================================
// Team Member Card
// ============================================================

export interface TeamMemberCardProps {
	name: string;
	role?: string;
	topStrengths: string[];
	primaryDomain: string;
	uniqueContribution: string;
}

export function TeamMemberCard({
	name,
	role,
	topStrengths,
	primaryDomain,
	uniqueContribution,
}: TeamMemberCardProps) {
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<div
			className="p-px bg-border/20 hover:bg-primary/20 transition-all duration-300 group/member"
			style={{ clipPath: clipPath8 }}
		>
			<div
				className="bg-background/95 p-6 space-y-6 h-full flex flex-col"
				style={{ clipPath: clipPath8 }}
			>
				<div className="flex items-center gap-4">
					<div className="relative size-14 flex items-center justify-center">
						<div 
							className="absolute inset-0 bg-primary/20 group-hover/member:bg-primary/40 transition-colors"
							style={{ clipPath: clipHex }}
						/>
						<div 
							className="absolute inset-[1.5px] bg-primary/5 text-primary text-lg font-black tracking-tighter flex items-center justify-center"
							style={{ clipPath: clipHex }}
						>
							{initials}
						</div>
					</div>
					<div className="space-y-1">
						<h3 className="text-sm font-black uppercase tracking-widest text-foreground">
							{name}
						</h3>
						{role && (
							<Badge
								variant="outline"
								className="px-2 py-0 border-primary/20 bg-primary/5 text-[8px] font-black uppercase tracking-widest text-primary rounded-none"
							>
								{role}
							</Badge>
						)}
					</div>
				</div>

				<div className="space-y-4 flex-1">
					<div className="space-y-2">
						<p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
							TOP_STRENGTHS_NODES
						</p>
						<div className="flex flex-wrap gap-1.5">
							{topStrengths.slice(0, 3).map((s, i) => (
								<Badge
									key={s}
									variant={i === 0 ? "default" : "secondary"}
									className={cn(
										"text-[8px] font-black uppercase tracking-widest rounded-none border-transparent",
										i === 0
											? "bg-primary text-primary-foreground"
											: "bg-muted/40 text-muted-foreground",
									)}
								>
									{s}
								</Badge>
							))}
						</div>
					</div>

					<div className="p-3 bg-muted/20 border-l-2 border-primary/40 text-[9px] font-black uppercase tracking-widest flex items-center gap-3">
						<UsersIcon className="size-3 text-primary" />
						<span className="text-muted-foreground">DOMAIN:</span>
						<span className="text-foreground">{primaryDomain}</span>
					</div>

					<div className="space-y-2">
						<p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
							UNIQUE_CONTRIBUTION_LOG
						</p>
						<p className="text-xs font-medium text-foreground/80 leading-relaxed italic border-l border-border/10 pl-3">
							{uniqueContribution}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

// ============================================================
// Domain Coverage Chart (Simple Visual)
// ============================================================

export interface DomainCoverageChartProps {
	domains: Array<{
		domain: string;
		percentage: number;
		status: "underrepresented" | "balanced" | "dominant";
	}>;
}

const domainColors = {
	Doing: "bg-red-500",
	Feeling: "bg-green-500",
	Motivating: "bg-yellow-500",
	Thinking: "bg-blue-500",
} as const;

export function DomainCoverageChart({ domains }: DomainCoverageChartProps) {
	return (
		<div className="p-px bg-border/40" style={{ clipPath: clipPath12 }}>
			<div
				className="bg-background/95 p-8 space-y-8"
				style={{ clipPath: clipPath12 }}
			>
				<div className="space-y-1">
					<h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">
						DOMAIN_COVERAGE_MATRIX
					</h3>
					<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
						DISTRIBUCIÓN_CONDUCTUAL_DE_NODOS
					</p>
				</div>

				<div className="space-y-8">
					{domains.map((d) => (
						<div key={d.domain} className="space-y-3">
							<div className="flex items-end justify-between">
								<div className="space-y-1">
									<span className="text-xs font-black uppercase tracking-widest text-foreground">
										{d.domain}
									</span>
									<div className="flex items-center gap-2">
										<div
											className={cn(
												"size-1 rounded-full animate-pulse",
												d.status === "dominant"
													? "bg-primary"
													: "bg-muted-foreground/40",
											)}
										/>
										<span
											className={cn(
												"text-[8px] font-black uppercase tracking-widest",
												d.status === "dominant"
													? "text-primary"
													: "text-muted-foreground/60",
											)}
										>
											{d.status === "underrepresented"
												? "UNDERREPRESENTED"
												: d.status === "balanced"
													? "BALANCED_STATE"
													: "DOMINANT_FLOW"}
										</span>
									</div>
								</div>
								<span className="text-lg font-black text-foreground font-mono">
									{d.percentage.toFixed(0)}%
								</span>
							</div>
							<div
								className="h-2 w-full bg-muted/20 relative"
								style={{ clipPath: clipPath8 }}
							>
								<div
									className={cn(
										"h-full transition-all duration-1000 ease-out",
										domainColors[d.domain as keyof typeof domainColors] ||
											"bg-primary",
									)}
									style={{
										width: `${Math.min(d.percentage, 100)}%`,
										clipPath: clipPath8,
									}}
								/>
								<div className="absolute inset-0 bg-grid-tech/10 pointer-events-none" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
