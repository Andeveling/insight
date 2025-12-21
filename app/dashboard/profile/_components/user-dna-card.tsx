"use client";

import { Brain, Heart, Sparkles, Target, Zap } from "lucide-react";
import { CyberBadge, CyberCard } from "@/components/cyber-ui";
import { cn } from "@/lib/cn";
import type { UserDnaData } from "@/lib/types";

interface UserDnaCardProps {
	dna: UserDnaData;
	className?: string;
}

export function UserDnaCard({ dna, className }: UserDnaCardProps) {
	const getDimensionIcon = (name: string) => {
		const lower = name.toLowerCase();
		if (lower.includes("pensamiento") || lower.includes("thinking"))
			return <Brain className="w-4 h-4 text-blue-400" />;
		if (lower.includes("acción") || lower.includes("doing"))
			return <Zap className="w-4 h-4 text-pink-400" />;
		if (lower.includes("conexión") || lower.includes("feeling"))
			return <Heart className="w-4 h-4 text-yellow-400" />;
		if (lower.includes("propósito") || lower.includes("motivating"))
			return <Target className="w-4 h-4 text-green-400" />;
		return <Sparkles className="w-4 h-4 text-purple-400" />;
	};

	return (
		<CyberCard
			variant="glow"
			className={cn("relative overflow-hidden", className)}
		>
			{/* Background glow effect */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl"
			/>

			{/* Header */}
			<div className="relative mb-4">
				<CyberBadge variant="emerald" className="mb-2">
					<Sparkles className="w-3 h-3 mr-1" />
					ADN del Usuario
				</CyberBadge>
				<h2 className="text-xl font-bold text-white mb-1">{dna.title}</h2>
				<p className="text-sm text-zinc-400">{dna.summary}</p>
			</div>

			{/* Dimensions - Grid compacto */}
			<div className="relative grid gap-3 md:grid-cols-2 mb-4">
				{dna.dimensions.map((dim, i) => (
					<div
						key={i}
						className="space-y-2 p-3 border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors"
						style={{
							clipPath:
								"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
						}}
					>
						<div className="flex items-center gap-2 font-bold text-xs text-zinc-400 uppercase tracking-wider">
							{getDimensionIcon(dim.name)}
							{dim.name}
						</div>
						<div className="flex flex-wrap gap-1">
							{dim.strengths.map((s) => (
								<CyberBadge key={s} variant="zinc" className="text-xs">
									{s}
								</CyberBadge>
							))}
						</div>
						<p className="text-xs text-zinc-400 leading-snug">
							{dim.description}
						</p>
					</div>
				))}
			</div>

			{/* Bottom section: Synergies y Role en grid */}
			<div className="grid gap-4 lg:grid-cols-2">
				{/* Synergies */}
				{dna.synergies.length > 0 && (
					<div className="relative space-y-2">
						<h3 className="font-bold text-sm text-white flex items-center gap-2">
							<Zap className="w-3 h-3 text-emerald-400" />
							Sinergias Clave
						</h3>
						<div className="space-y-2">
							{dna.synergies.map((syn, i) => (
								<div
									key={i}
									className="p-2 border-l-2 border-emerald-500/50 bg-zinc-900/30"
								>
									<div className="font-bold text-xs text-emerald-400 mb-1">
										{syn.effect}
									</div>
									<div className="text-xs text-zinc-400 leading-snug">
										{syn.description}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Ideal Role */}
				{dna.idealRole.length > 0 && (
					<div className="relative space-y-2">
						<h3 className="font-bold text-sm text-white flex items-center gap-2">
							<Target className="w-3 h-3 text-purple-400" />
							Rol Ideal
						</h3>
						<ul className="list-none space-y-1">
							{dna.idealRole.map((role, i) => (
								<li
									key={i}
									className="flex items-start gap-2 text-xs text-zinc-400"
								>
									<span className="text-purple-400 mt-0.5">▸</span>
									{role}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>

			{/* Purpose */}
			<div
				className="relative mt-4 p-4 text-center border border-emerald-500/30 bg-emerald-500/5"
				style={{
					clipPath:
						"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
				}}
			>
				<p className="italic text-sm font-medium text-emerald-100">
					&quot;{dna.purpose}&quot;
				</p>
			</div>
		</CyberCard>
	);
}
