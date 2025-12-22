import { ArrowRight, Flame, Trophy } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getNextAction } from "@/app/dashboard/development/_actions/get-ai-recommendations";
import { getUserProgress } from "@/app/dashboard/development/_actions/get-user-progress";
import { getSession } from "@/lib/auth";
import { CyberBadge } from "./cyber-ui/cyber-badge";
import { CyberButton } from "./cyber-ui/cyber-button";
import { CyberCard } from "./cyber-ui/cyber-card";

export async function HeroSection() {
	const session = await getSession();

	if (!session?.user?.id) {
		redirect("/login");
	}

	const [progress, nextAction] = await Promise.all([
		getUserProgress(),
		getNextAction(),
	]);

	const userName = session.user.name ?? "Usuario";
	const progressPercent =
		progress.xpForNextLevel > progress.xpForCurrentLevel
			? ((progress.xpTotal - progress.xpForCurrentLevel) /
					(progress.xpForNextLevel - progress.xpForCurrentLevel)) *
				100
			: 100;

	return (
		<div className="grid gap-6 md:grid-cols-3 mb-8">
			{/* Main Hero Card - Level & XP */}
			<CyberCard
				variant="glow"
				className="md:col-span-2 relative overflow-hidden"
			>
				{/* Background Pattern - Blueprint Tech */}
				<div className="absolute inset-0 bg-blueprint-tech opacity-5 pointer-events-none" />

				<div className="flex flex-col h-full justify-between relative z-10">
					<div className="flex justify-between items-start mb-6">
						<div className="bg-blend-multiply">
							<h2 className="text-2xl font-bold text-white mb-1">
								Hola, <span className="text-emerald-400">{userName}</span>
							</h2>
							<p className="text-zinc-400 text-sm">
								Nivel {progress.level}: {progress.levelName}
							</p>
						</div>
						<CyberBadge variant="emerald">
							<Trophy className="w-3 h-3 mr-1" />
							Nivel {progress.level}
						</CyberBadge>
					</div>

					<div className="space-y-2">
						<div className="flex justify-between text-xs uppercase tracking-wider font-bold">
							<span className="text-emerald-400">XP: {progress.xpTotal}</span>
							<span className="text-zinc-500">
								Siguiente: {progress.xpForNextLevel}
							</span>
						</div>
						<div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
							<div
								className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-500 ease-out"
								style={{ width: `${progressPercent}%` }}
							/>
						</div>
						<p className="text-xs text-zinc-500 text-right mt-1">
							{Math.round(progress.progressToNextLevel)} XP para subir de nivel
						</p>
					</div>
				</div>
			</CyberCard>

			{/* Next Action Card */}
			<CyberCard
				variant="default"
				className="flex flex-col justify-between relative overflow-hidden"
			>
				{/* Background Pattern - Dots Tech */}
				<div className="absolute inset-0 bg-dots-tech opacity-5 pointer-events-none" />

				<div className="relative z-10">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
							Siguiente Misión
						</h3>
						{progress.currentStreak > 0 && (
							<CyberBadge variant="amber">
								<Flame className="w-3 h-3 mr-1" />
								{progress.currentStreak} días
							</CyberBadge>
						)}
					</div>
					<p className="text-lg font-bold text-white mb-2">
						{nextAction.title}
					</p>
					<p className="text-sm text-zinc-400 line-clamp-2 mb-4">
						{nextAction.description}
					</p>
				</div>
				<Link href={nextAction.actionUrl} className="w-full relative z-10">
					<CyberButton variant="primary" className="w-full">
						{nextAction.actionLabel} <ArrowRight className="w-4 h-4 ml-2" />
					</CyberButton>
				</Link>
			</CyberCard>
		</div>
	);
}
