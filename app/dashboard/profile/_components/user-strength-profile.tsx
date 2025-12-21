"use client";

import { Hexagon } from "lucide-react";
import { useMemo } from "react";
import { DomainIndicator } from "@/app/_shared/components/domain-indicator";
import { StrengthDetailCard } from "@/app/_shared/components/strength-detail-card";
import { CyberBadge, CyberCard } from "@/components/cyber-ui";
import { cn } from "@/lib/cn";
import {
	getDomainColor,
	getDomainMetadata,
} from "@/lib/constants/domain-colors";
import type { DomainType, TeamMemberWithStrengths } from "@/lib/types";

interface UserStrengthProfileProps {
	user: TeamMemberWithStrengths;
	className?: string;
}

export function UserStrengthProfile({
	user,
	className,
}: UserStrengthProfileProps) {
	const strengthCount = user.strengths.length;

	const sortedStrengths = useMemo(() => {
		return [...user.strengths].sort((a, b) => a.rank - b.rank);
	}, [user.strengths]);

	const domainDistribution = useMemo(() => {
		if (strengthCount === 0) return [];

		const counts: Record<DomainType, number> = {
			Doing: 0,
			Feeling: 0,
			Motivating: 0,
			Thinking: 0,
		};

		user.strengths.forEach((s) => {
			counts[s.strength.domain]++;
		});

		return Object.entries(counts)
			.map(([domain, count]) => ({
				domain: domain as DomainType,
				count,
				percentage: (count / strengthCount) * 100,
			}))
			.sort((a, b) => b.count - a.count);
	}, [strengthCount, user.strengths]);

	const primaryDomain = domainDistribution[0] ?? {
		domain: "Doing" as DomainType,
		count: 0,
		percentage: 0,
	};

	if (strengthCount === 0) {
		return (
			<CyberCard variant="default" className={cn("h-full", className)}>
				<div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
					<Hexagon className="w-12 h-12 text-zinc-600" />
					<h3 className="text-xl font-bold text-white">
						Tus fortalezas aparecerán aquí
					</h3>
					<p className="text-zinc-400 max-w-md">
						Cuando completes el test HIGH5, verás tus fortalezas principales y
						cómo se distribuyen por dominio.
					</p>
				</div>
			</CyberCard>
		);
	}

	const getDomainBadgeVariant = (domain: DomainType) => {
		if (domain === "Doing") return "purple";
		if (domain === "Feeling") return "amber";
		if (domain === "Motivating") return "emerald";
		return "indigo";
	};

	return (
		<div className={cn("space-y-6", className)}>
			<CyberCard variant="default" className="relative overflow-hidden">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl"
					style={{
						backgroundColor: getDomainColor(primaryDomain.domain, "primary"),
						opacity: 0.1,
					}}
				/>

				<div className="relative">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
						<div className="space-y-2">
							<h3 className="text-xl font-bold uppercase tracking-wider text-white">
								Fortalezas y Dominios
							</h3>
							<p className="text-sm text-zinc-400">
								Tu perfil se compone de 4 dominios. El principal marca tu estilo
								natural.
							</p>
						</div>

						<div className="flex items-center gap-2">
							<span className="text-sm font-medium text-zinc-400">
								Principal:
							</span>
							<CyberBadge variant={getDomainBadgeVariant(primaryDomain.domain)}>
								{getDomainMetadata(primaryDomain.domain).nameEs}
							</CyberBadge>
						</div>
					</div>

					<div className="space-y-3">
						<h4 className="font-bold text-sm text-zinc-300 uppercase tracking-wider">
							Distribución por Dominio
						</h4>
						<div className="space-y-3">
							{domainDistribution.map(({ domain, count, percentage }) => (
								<div key={domain} className="space-y-1">
									<div className="flex items-center justify-between text-sm">
										<DomainIndicator
											domain={domain}
											variant="dot"
											showName
											size="sm"
										/>
										<span className="font-mono text-zinc-400">
											{count} ({percentage.toFixed(0)}%)
										</span>
									</div>
									<div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
										<div
											className="h-full transition-all duration-500"
											style={{
												width: `${percentage}%`,
												backgroundColor: getDomainColor(domain, "primary"),
												boxShadow: `0 0 10px ${getDomainColor(domain, "primary")}40`,
											}}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</CyberCard>

			<div className="space-y-4">
				<div>
					<h3 className="text-2xl font-bold text-white mb-2">
						Tus Top 5 Fortalezas
					</h3>
					<p className="text-sm text-zinc-400">
						Lo que haces mejor de forma natural, según el test HIGH5.
					</p>
				</div>

				{sortedStrengths.map((userStrength) => (
					<StrengthDetailCard
						key={userStrength.strength.id}
						strength={userStrength.strength}
						rank={userStrength.rank}
					/>
				))}
			</div>

			<CyberCard variant="default">
				<div className="flex gap-4">
					<div
						aria-hidden="true"
						className="w-1 rounded-full"
						style={{
							backgroundColor: getDomainColor(primaryDomain.domain, "primary"),
						}}
					/>
					<div className="min-w-0">
						<h4 className="font-bold text-lg text-white mb-3 flex items-center gap-2">
							<span>{getDomainMetadata(primaryDomain.domain).icon}</span>
							Tu Perfil de Fortalezas
						</h4>
						<p className="text-sm text-zinc-400 leading-relaxed">
							Con un enfoque principal en{" "}
							<strong className="text-white">
								{getDomainMetadata(primaryDomain.domain).nameEs}
							</strong>
							, tu estilo natural de trabajo se centra en{" "}
							<em className="text-zinc-300">
								{getDomainMetadata(primaryDomain.domain).keyQuestion}
							</em>
						</p>
						<p className="text-sm text-zinc-400 leading-relaxed mt-2">
							Tus fortalezas te posicionan como{" "}
							<strong className="text-white">
								{getDomainMetadata(primaryDomain.domain).metaphor}
							</strong>{" "}
							del equipo.
						</p>
					</div>
				</div>
			</CyberCard>
		</div>
	);
}
