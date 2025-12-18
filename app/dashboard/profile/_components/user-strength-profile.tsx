"use client";

import { useMemo } from "react";
import { DomainIndicator } from "@/app/_shared/components/domain-indicator";
import { StrengthDetailCard } from "@/app/_shared/components/strength-detail-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

	// Sort strengths by rank
	const sortedStrengths = useMemo(() => {
		return [...user.strengths].sort((a, b) => a.rank - b.rank);
	}, [user.strengths]);

	// Calculate domain distribution
	const domainDistribution = useMemo(() => {
		if (strengthCount === 0) {
			return [];
		}

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
		domain: "Doing" as const,
		count: 0,
		percentage: 0,
	};

	if (strengthCount === 0) {
		return (
			<Card className={cn("border bg-gamified-surface", className)}>
				<CardHeader>
					<CardTitle className="text-xl">
						Tus fortalezas aparecerán aquí
					</CardTitle>
				</CardHeader>
				<CardContent className="text-sm text-muted-foreground">
					Cuando completes el test HIGH5, verás tus fortalezas principales y
					cómo se distribuyen por dominio.
				</CardContent>
			</Card>
		);
	}

	return (
		<div className={cn("space-y-6", className)}>
			<Card className="relative overflow-hidden border bg-gamified-surface">
				<div
					aria-hidden="true"
					className={cn(
						"pointer-events-none absolute inset-0",
						"bg-linear-to-br from-gamified-gradient-from/10 to-gamified-gradient-to/10",
					)}
				/>
				<CardHeader className="relative">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
						<div className="space-y-2">
							<CardTitle className="text-2xl">Fortalezas y dominios</CardTitle>
							<p className="text-sm text-muted-foreground">
								Tu perfil se compone de 4 dominios. El principal marca tu estilo
								natural de aporte al equipo.
							</p>
						</div>

						<div className="flex flex-wrap items-center gap-2">
							<span className="text-sm font-medium">Dominio principal:</span>
							<DomainIndicator
								domain={primaryDomain.domain}
								showIcon
								showName
							/>
							<span className="text-sm text-muted-foreground">
								({primaryDomain.count} de {user.strengths.length})
							</span>
						</div>
					</div>
				</CardHeader>
				<CardContent className="relative">
					<div className="space-y-3">
						<h4 className="font-semibold text-sm">Distribución por dominio</h4>
						<div className="space-y-2">
							{domainDistribution.map(({ domain, count, percentage }) => (
								<div key={domain} className="space-y-1">
									<div className="flex items-center justify-between text-sm">
										<DomainIndicator
											domain={domain}
											variant="dot"
											showName
											size="sm"
										/>
										<span className="font-medium">
											{count} ({percentage.toFixed(0)}%)
										</span>
									</div>
									<div className="h-2 rounded-full bg-muted overflow-hidden">
										<div
											className="h-full transition-all duration-500"
											style={{
												width: `${percentage}%`,
												backgroundColor: getDomainColor(domain),
											}}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Top 5 Strengths */}
			<div className="space-y-4">
				<div>
					<h3 className="text-2xl font-bold mb-2">Tus Top 5 fortalezas</h3>
					<p className="text-sm text-muted-foreground">
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

			{/* Summary Card */}
			<Card className="overflow-hidden border bg-gamified-surface">
				<CardContent className="p-6">
					<div className="flex gap-4">
						<div
							aria-hidden="true"
							className="w-1 rounded-full"
							style={{ backgroundColor: getDomainColor(primaryDomain.domain) }}
						/>
						<div className="min-w-0">
							<h4 className="font-bold text-lg mb-3 flex items-center gap-2">
								<span>{getDomainMetadata(primaryDomain.domain).icon}</span>
								Tu Perfil de Fortalezas
							</h4>
							<p className="text-sm leading-relaxed">
								Con un enfoque principal en{" "}
								<strong>
									{getDomainMetadata(primaryDomain.domain).nameEs}
								</strong>
								, tu estilo natural de trabajo se centra en{" "}
								<em>{getDomainMetadata(primaryDomain.domain).keyQuestion}</em>
							</p>
							<p className="text-sm leading-relaxed mt-2">
								Tus fortalezas te posicionan como{" "}
								<strong>
									{getDomainMetadata(primaryDomain.domain).metaphor}
								</strong>{" "}
								del equipo.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
