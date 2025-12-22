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
			description="SINCRONIZANDO_DINÁMICAS_INTERPERSONALES_PARA_MÁXIMA_EFICIENCIA_EN_MISIONES_CRÍTICAS_"
			card={
				<div className="flex items-center gap-3">
					<div
						className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
						style={{ clipPath: CLIP_PATHS.small }}
					>
						<div
							className="size-1.5 bg-primary animate-pulse shadow-[0_0_8px_currentColor]"
							style={{ clipPath: CLIP_PATHS.hex }}
						/>
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
		<div className="space-y-12 animate-pulse py-4">
			{/* Main Hero Skeleton */}
			<div
				className="p-px bg-primary/20"
				style={{ clipPath: CLIP_PATHS.large }}
			>
				<div
					className="bg-background/50 h-64 relative overflow-hidden"
					style={{ clipPath: CLIP_PATHS.large }}
				>
					<div className="absolute inset-0 bg-grid-tech/5" />
					<div className="h-full flex flex-col justify-center p-10 space-y-4">
						<div
							className="h-8 w-1/2 bg-primary/20"
							style={{ clipPath: CLIP_PATHS.small }}
						/>
						<div
							className="h-4 w-3/4 bg-muted/20"
							style={{ clipPath: CLIP_PATHS.small }}
						/>
						<div className="pt-4 flex gap-4">
							<div
								className="h-12 w-48 bg-primary/30"
								style={{ clipPath: CLIP_PATHS.medium }}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Content Sections Skeleton */}
			<div className="space-y-16">
				{/* Personal Summary Skeleton */}
				<div className="space-y-8">
					<div
						className="h-10 w-64 bg-muted/20 border-b border-border/40"
						style={{ clipPath: CLIP_PATHS.small }}
					/>
					<div
						className="p-px bg-border/20"
						style={{ clipPath: CLIP_PATHS.large }}
					>
						<div
							className="bg-background/30 h-48"
							style={{ clipPath: CLIP_PATHS.large }}
						/>
					</div>
				</div>

				{/* Cards Grid Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{[...Array(4)].map((_, i) => (
						<div
							key={i}
							className="p-px bg-border/10"
							style={{ clipPath: CLIP_PATHS.medium }}
						>
							<div
								className="bg-background/20 h-56 flex items-start p-8 gap-6"
								style={{ clipPath: CLIP_PATHS.medium }}
							>
								<div
									className="size-12 bg-muted/20 shrink-0"
									style={{ clipPath: CLIP_PATHS.hex }}
								/>
								<div className="flex-1 space-y-4">
									<div className="h-4 w-1/3 bg-muted/20" />
									<div className="space-y-2">
										<div className="h-3 w-full bg-muted/10" />
										<div className="h-3 w-5/6 bg-muted/10" />
									</div>
									<div className="pt-4 flex gap-2">
										<div
											className="h-6 w-16 bg-muted/20"
											style={{ clipPath: CLIP_PATHS.small }}
										/>
										<div
											className="h-6 w-16 bg-muted/20"
											style={{ clipPath: CLIP_PATHS.small }}
										/>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
