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
			<div className="relative mb-6">
				<CyberBadge variant="emerald" className="mb-3">
					<Sparkles className="w-3 h-3 mr-1" />
					ADN del Usuario
				</CyberBadge>
				<h2 className="text-2xl font-bold text-white mb-2">{dna.title}</h2>
				<p className="text-zinc-400">{dna.summary}</p>
			</div>

			{/* Dimensions */}
			<div className="relative grid gap-4 md:grid-cols-2 mb-6">
				{dna.dimensions.map((dim, i) => (
					<div
						key={i}
						className="space-y-2 p-4 border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors"
						style={{
							clipPath:
								"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
						}}
					>
						<div className="flex items-center gap-2 font-bold text-xs text-zinc-400 uppercase tracking-wider">
							{getDimensionIcon(dim.name)}
							{dim.name}
						</div>
						<div className="flex flex-wrap gap-1 mb-2">
							{dim.strengths.map((s) => (
								<CyberBadge key={s} variant="zinc">
									{s}
								</CyberBadge>
							))}
						</div>
						<p className="text-sm text-zinc-400 leading-relaxed">
							{dim.description}
						</p>
					</div>
				))}
			</div>

			{/* Synergies */}
			{dna.synergies.length > 0 && (
				<div className="relative space-y-3 mb-6">
					<h3 className="font-bold text-lg text-white flex items-center gap-2">
						<Zap className="w-4 h-4 text-emerald-400" />
						Sinergias Clave
					</h3>
					<div className="grid gap-3">
						{dna.synergies.map((syn, i) => (
							<div
								key={i}
								className="flex flex-col sm:flex-row gap-3 p-3 border-l-2 border-emerald-500/50 bg-zinc-900/30"
							>
								<div className="min-w-[140px] font-bold text-sm text-emerald-400">
									{syn.effect}
								</div>
								<div className="text-sm text-zinc-400">{syn.description}</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Ideal Role */}
			{dna.idealRole.length > 0 && (
				<div className="relative space-y-3 mb-6">
					<h3 className="font-bold text-lg text-white flex items-center gap-2">
						<Target className="w-4 h-4 text-purple-400" />
						Rol Ideal
					</h3>
					<ul className="list-none space-y-2">
						{dna.idealRole.map((role, i) => (
							<li
								key={i}
								className="flex items-start gap-2 text-sm text-zinc-400"
							>
								<span className="text-purple-400 mt-1">▸</span>
								{role}
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Purpose */}
			<div
				className="relative mt-6 p-6 text-center border border-emerald-500/30 bg-emerald-500/5"
				style={{
					clipPath:
						"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
				}}
			>
				<p className="italic text-lg font-medium text-emerald-100">
					&quot;{dna.purpose}&quot;
				</p>
			</div>
		</CyberCard>
	);
}
