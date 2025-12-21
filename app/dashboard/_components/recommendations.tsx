import { ArrowRight, Clock, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAIRecommendations } from "@/app/dashboard/development/_actions/get-ai-recommendations";
import { getSession } from "@/lib/auth";
import { CyberBadge } from "./cyber-ui/cyber-badge";
import { CyberButton } from "./cyber-ui/cyber-button";
import { CyberCard } from "./cyber-ui/cyber-card";

export async function Recommendations() {
	const session = await getSession();

	if (!session?.user?.id) {
		redirect("/login");
	}

	const aiRecommendations = await getAIRecommendations();
	const recommendations = aiRecommendations.recommendations;
	if (!recommendations || recommendations.length === 0) {
		return null;
	}

	return (
		<CyberCard variant="default" className="h-full flex flex-col">
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-lg font-bold uppercase tracking-wider text-white flex items-center">
					<Sparkles className="w-4 h-4 mr-2 text-indigo-400" />
					Recomendado
				</h3>
				<CyberBadge variant="indigo">AI Coach</CyberBadge>
			</div>

			<div className="space-y-4 flex-1">
				{recommendations.slice(0, 3).map((rec, index) => (
					<div
						key={rec.moduleId || rec.moduleKey || `rec-${index}`}
						className="group border border-zinc-800 bg-zinc-900/50 p-4 hover:border-indigo-500/50 transition-colors relative overflow-hidden"
						style={{
							clipPath:
								"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
						}}
					>
						<div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
							<ArrowRight className="w-4 h-4 text-indigo-400" />
						</div>

						<h4 className="font-bold text-zinc-200 group-hover:text-white mb-1 pr-6">
							{rec.titleEs}
						</h4>
						<p className="text-xs text-zinc-500 mb-3 line-clamp-2">
							{rec.reason}
						</p>

						<div className="flex items-center justify-between text-xs text-zinc-400">
							<div className="flex items-center space-x-3">
								<span className="flex items-center">
									<Clock className="w-3 h-3 mr-1" />
									{rec.estimatedMinutes}m
								</span>
								<span className="flex items-center text-emerald-400">
									<Zap className="w-3 h-3 mr-1" />
									{rec.xpReward} XP
								</span>
							</div>
							<Link
								href={`/dashboard/development/${rec.moduleId}`}
								className="text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider text-[10px]"
							>
								Iniciar
							</Link>
						</div>
					</div>
				))}
			</div>

			<div className="mt-6 pt-4 border-t border-zinc-800">
				<Link href="/dashboard/development">
					<CyberButton variant="ghost" size="sm" className="w-full">
						Ver todo el plan
					</CyberButton>
				</Link>
			</div>
		</CyberCard>
	);
}
