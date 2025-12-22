import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CLIP_PATHS } from "@/lib/constants/clip-paths";
import DashboardContainer from "../../_components/dashboard-container";
import { getTeamTipsData } from "../_actions";
import { TeamTipsView } from "./_components/team-tips-view";

export default async function TeamTipsPage() {
	const data = await getTeamTipsData();

	if (!data) {
		redirect("/login");
	}

	return (
		<DashboardContainer
			title="TEAM_COLLABORATION_PROTOCOLS"
			description="Sincronizando dinámicas interpersonales para máxima eficiencia en misiones críticas_"
			card={
				<div className="flex items-center gap-3">
					<div className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
						<div className="size-1.5 rounded-full bg-primary animate-pulse" />
						COLLABORATION_ENGINE: ACTIVE
					</div>
				</div>
			}
		>
			<Suspense fallback={<TeamTipsSkeleton />}>
				<TeamTipsView
					user={data.user}
					team={data.team}
					teammates={data.teammates}
					hasStrengths={data.hasStrengths}
					existingReport={data.existingReport}
				/>
			</Suspense>
		</DashboardContainer>
	);
}

function TeamTipsSkeleton() {
	return (
		<div className="space-y-8 animate-pulse">
			<div className="p-px bg-border/40" style={{ clipPath: CLIP_PATHS.large }}>
				<div
					className="bg-background/50 h-64"
					style={{ clipPath: CLIP_PATHS.large }}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{[...Array(4)].map((_, i) => (
					<div
						key={i}
						className="p-px bg-border/20"
						style={{ clipPath: CLIP_PATHS.medium }}
					>
						<div
							className="bg-background/30 h-48 flex items-center p-6 gap-4"
							style={{ clipPath: CLIP_PATHS.medium }}
						>
							<div
								className="size-12 bg-muted/20"
								style={{ clipPath: CLIP_PATHS.hex }}
							/>
							<div className="flex-1 space-y-3">
								<div className="h-4 w-1/3 bg-muted/20" />
								<div className="h-3 w-2/3 bg-muted/20" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
