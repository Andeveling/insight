import { Flame, Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";
import type { ProfileAchievementsSummary } from "@/lib/types/profile-achievements-summary.types";
import type { ProfileGamificationProgress } from "@/lib/types/profile-gamification-progress.types";

interface ProfileGamifiedHeaderProps {
	user: {
		name: string;
		email: string;
		image?: string | null;
	};
	progress: ProfileGamificationProgress | null;
	achievements: ProfileAchievementsSummary | null;
}

function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	const first = parts[0]?.[0] ?? "?";
	const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
	return `${first}${last}`.toUpperCase();
}

export function ProfileGamifiedHeader({
	user,
	progress,
	achievements,
}: ProfileGamifiedHeaderProps) {
	const initials = getInitials(user.name);
	const level = progress?.currentLevel ?? 0;
	const streak = progress?.currentStreak ?? 0;
	const progressValue = progress?.levelProgress ?? 0;
	const unlockedCount = achievements?.unlockedCount ?? 0;

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-blue-500/30 bg-linear-to-r from-slate-900/90 to-slate-800/90 p-4 backdrop-blur-sm">
			{/* Avatar y Nivel */}
			<div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
				<Avatar className="h-14 w-14 border-2 border-blue-400/50">
					<AvatarImage src={user.image || undefined} alt={user.name} />
					<AvatarFallback className="bg-linear-to-br from-blue-400 to-blue-600 text-white">
						{initials}
					</AvatarFallback>
				</Avatar>
				<div className="flex items-center gap-3 rounded-full border border-blue-400/30 bg-linear-to-r from-blue-900/80 to-blue-800/80 px-4 py-2">
					<span className="text-sm font-bold text-white">Lvl {level}</span>
					<div className="relative h-8 w-8">
						<svg className="h-8 w-8 -rotate-90 transform">
							<circle
								cx="16"
								cy="16"
								r="14"
								stroke="currentColor"
								strokeWidth="3"
								fill="transparent"
								className="text-blue-900"
							/>
							<circle
								cx="16"
								cy="16"
								r="14"
								stroke="currentColor"
								strokeWidth="3"
								fill="transparent"
								strokeDasharray={87.96}
								strokeDashoffset={87.96 - (87.96 * progressValue) / 100}
								className="text-cyan-400"
								strokeLinecap="round"
							/>
						</svg>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-end">
				{/* Racha */}
				<div className="flex items-center gap-2 rounded-full border border-orange-500/40 bg-linear-to-r from-orange-900/60 to-red-900/60 px-5 py-2 shadow-lg shadow-orange-500/20">
					<span className="text-2xl font-bold text-white">{streak}</span>
					<Flame className="h-6 w-6 fill-orange-500 text-orange-500" />
				</div>

				{/* Moneda / Recompensas */}
				<div className="flex items-center gap-2 rounded-full border border-cyan-400/40 bg-linear-to-r from-cyan-900/60 to-teal-900/60 px-5 py-2 shadow-lg shadow-cyan-400/20">
					<span className="text-2xl font-bold text-white">{unlockedCount}</span>
					<Trophy className="h-6 w-6 fill-cyan-400 text-cyan-400" />
				</div>
			</div>
		</div>
	);
}
