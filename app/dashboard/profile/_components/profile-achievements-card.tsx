"use client";

import { Award, Star, Trophy } from "lucide-react";
import Link from "next/link";
import { CyberBadge, CyberButton, CyberCard } from "@/components/cyber-ui";
import { cn } from "@/lib/cn";
import type { ProfileAchievementsSummary } from "@/lib/types/profile-achievements-summary.types";

interface ProfileAchievementsCardProps {
	summary: ProfileAchievementsSummary | null;
	className?: string;
}

function isLikelyEmojiOrShortIcon(icon: string): boolean {
	if (!icon) return false;
	const trimmed = icon.trim();
	if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
		return false;
	if (trimmed.startsWith("/")) return false;
	return trimmed.length <= 6;
}

export function ProfileAchievementsCard({
	summary,
	className,
}: ProfileAchievementsCardProps) {
	const unlockedCount = summary?.unlockedCount ?? 0;
	const totalCount = summary?.totalCount ?? 0;
	const recent = summary?.recent ?? [];

	return (
		<CyberCard variant="default" className={cn("h-full", className)}>
			<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-6">
				<div className="space-y-1">
					<h3 className="text-xl font-bold uppercase tracking-wider text-white flex items-center gap-2">
						<Trophy className="h-5 w-5 text-amber-400" />
						Recompensas
					</h3>
					<p className="text-sm text-zinc-400">
						Insignias desbloqueadas y progreso general.
					</p>
				</div>
				<CyberBadge variant="amber">
					{unlockedCount} / {totalCount}
				</CyberBadge>
			</div>

			<div className="space-y-4">
				{recent.length > 0 ? (
					<ul className="space-y-3">
						{recent.map((a) => (
							<li
								key={a.badgeId}
								className={cn(
									"flex gap-3 p-3 border border-zinc-800 bg-zinc-900/50",
									"hover:border-amber-500/30 transition-colors",
								)}
								style={{
									clipPath:
										"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
								}}
							>
								<div
									className={cn(
										"h-10 w-10 shrink-0 rounded-full border border-amber-500/30",
										"bg-amber-500/10 grid place-items-center text-amber-400",
									)}
								>
									{isLikelyEmojiOrShortIcon(a.icon) ? (
										a.icon
									) : (
										<Award className="w-5 h-5" />
									)}
								</div>

								<div className="min-w-0 flex-1">
									<div className="flex flex-wrap items-center justify-between gap-2">
										<p className="font-bold text-zinc-200 truncate">
											{a.nameEs}
										</p>
										<CyberBadge variant="zinc">{a.tier}</CyberBadge>
									</div>
									<p className="text-xs text-zinc-500 line-clamp-2 mt-1">
										{a.descriptionEs}
									</p>
								</div>
							</li>
						))}
					</ul>
				) : (
					<div
						className="p-4 border border-zinc-800 bg-zinc-900/50"
						style={{
							clipPath:
								"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
						}}
					>
						<div className="flex items-center gap-2 mb-2">
							<Star className="w-5 h-5 text-zinc-500" />
							<p className="font-bold text-zinc-300">
								Tu primera insignia está cerca
							</p>
						</div>
						<p className="text-sm text-zinc-500">
							Completa evaluaciones, comparte feedback o avanza en tus rutas de
							desarrollo.
						</p>
					</div>
				)}

				<div className="flex justify-end pt-2">
					<Link href="/dashboard/development/badges">
						<CyberButton variant="secondary" size="sm">
							Ver Todo
						</CyberButton>
					</Link>
				</div>
			</div>
		</CyberCard>
	);
}
