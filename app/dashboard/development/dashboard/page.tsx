import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "@/lib/auth";
import {
	getAIRecommendations,
	getNextAction,
} from "../_actions/get-ai-recommendations";
import { getUserProgress } from "../_actions/get-user-progress";
import { AIRecommendations } from "../_components/ai-recommendations";
import { ProgressDashboard } from "../_components/progress-dashboard";

/**
 * Development Dashboard Page
 *
 * Shows user's gamification progress, XP, level, and achievements.
 * Uses Cache Components pattern with Suspense.
 */
export default function DashboardPage() {
	return (
		<div className="container mx-auto p-4 lg:p-6 space-y-8">
			<header className="relative mb-8">
				<div
					className="absolute -left-4 top-0 bottom-0 w-1 bg-primary/50"
					style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 8px)" }}
				/>
				<div className="space-y-1">
					<h1 className="text-3xl font-black uppercase tracking-tighter text-foreground mb-2 flex items-center gap-3">
						Tu Progreso
						<span className="text-[10px] py-1 px-2 rounded-sm bg-primary/20 text-primary font-black tracking-widest border border-primary/30">
							DEV_STATS_V2.0
						</span>
					</h1>
					<p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
						Visualiza tu avance, nivel y logros en tu camino de desarrollo.
					</p>
				</div>
			</header>

			<div className="grid lg:grid-cols-3 gap-6">
				{/* Main Progress Dashboard */}
				<div className="lg:col-span-2">
					<Suspense fallback={<DashboardSkeleton />}>
						<DashboardContent />
					</Suspense>
				</div>

				{/* AI Recommendations Sidebar */}
				<div className="lg:col-span-1">
					<Suspense fallback={<AIRecommendationsSkeleton />}>
						<AIRecommendationsContent />
					</Suspense>
				</div>
			</div>
		</div>
	);
}

/**
 * Dashboard Content - Server Component
 */
async function DashboardContent() {
	const session = await getSession();

	if (!session?.user?.id) {
		redirect("/login");
	}

	const progress = await getUserProgress();

	return <ProgressDashboard progress={progress} />;
}

/**
 * AI Recommendations Content - Server Component
 */
async function AIRecommendationsContent() {
	const session = await getSession();

	if (!session?.user?.id) {
		return null;
	}

	const [recommendationsData, nextAction] = await Promise.all([
		getAIRecommendations(),
		getNextAction(),
	]);

	return (
		<AIRecommendations
			recommendations={recommendationsData.recommendations}
			cachedAt={recommendationsData.cachedAt}
			isCached={recommendationsData.isCached}
			nextAction={nextAction}
		/>
	);
}

/**
 * AI Recommendations Skeleton
 */
function AIRecommendationsSkeleton() {
	const clipPath16 =
		"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";

	return (
		<div
			className="relative overflow-hidden p-px bg-border/50"
			style={{ clipPath: clipPath16 }}
		>
			<div
				className="bg-background/95 backdrop-blur-sm p-6"
				style={{ clipPath: clipPath16 }}
			>
				<div className="flex items-center gap-3 mb-6">
					<Skeleton className="h-6 w-6 rounded-sm" />
					<Skeleton className="h-6 w-32" />
				</div>
				<Skeleton className="h-24 w-full mb-6 rounded-none bg-muted/50" />
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="flex gap-4 p-3 border border-border/50 bg-muted/20"
						>
							<Skeleton className="h-8 w-8 rounded-sm" />
							<div className="flex-1 space-y-2">
								<Skeleton className="h-3 w-3/4 rounded-sm" />
								<Skeleton className="h-2 w-full rounded-sm" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

/**
 * Dashboard Skeleton
 */
function DashboardSkeleton() {
	const clipPath16 =
		"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
	const clipPath12 =
		"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)";
	const clipPath8 =
		"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";

	return (
		<div className="space-y-6">
			{/* Hero Skeleton */}
			<div className="p-px bg-border/40" style={{ clipPath: clipPath16 }}>
				<div className="bg-background/80 p-8" style={{ clipPath: clipPath16 }}>
					<div className="flex flex-col md:flex-row items-baseline md:items-center justify-between gap-8">
						<div className="flex items-center gap-6">
							<Skeleton
								className="h-20 w-20 bg-muted/20"
								style={{
									clipPath:
										"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
								}}
							/>
							<div className="space-y-2">
								<Skeleton className="h-8 w-40 bg-muted/20" />
								<Skeleton className="h-4 w-24 bg-muted/20" />
							</div>
						</div>
						<div className="flex-1 max-w-md w-full space-y-3">
							<Skeleton className="h-4 w-full bg-muted/20" />
							<Skeleton className="h-2 w-3/4 bg-muted/20" />
						</div>
					</div>
				</div>
			</div>

			{/* Stats Grid Skeleton */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{[1, 2, 3, 4].map((i) => (
					<div
						key={i}
						className="p-px bg-border/40"
						style={{ clipPath: clipPath12 }}
					>
						<div
							className="bg-background/80 p-6"
							style={{ clipPath: clipPath12 }}
						>
							<div className="flex items-center gap-4">
								<Skeleton
									className="h-10 w-10 bg-muted/10 shrink-0"
									style={{
										clipPath:
											"polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
									}}
								/>
								<div className="space-y-2 flex-1">
									<Skeleton className="h-3 w-12 bg-muted/20" />
									<Skeleton className="h-5 w-16 bg-muted/20" />
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Cards Row Skeleton */}
			<div className="grid md:grid-cols-2 gap-6">
				{[1, 2].map((i) => (
					<div
						key={i}
						className="p-px bg-border/40"
						style={{ clipPath: clipPath16 }}
					>
						<div
							className="bg-background/80 p-6"
							style={{ clipPath: clipPath16 }}
						>
							<div className="flex items-center gap-3 mb-6">
								<Skeleton
									className="h-10 w-10 bg-muted/10"
									style={{
										clipPath:
											"polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
									}}
								/>
								<Skeleton className="h-5 w-32 bg-muted/20" />
							</div>
							<div className="space-y-4">
								<Skeleton className="h-12 w-3/4 bg-muted/20" />
								<div className="space-y-3">
									{[1, 2, 3].map((j) => (
										<Skeleton
											key={j}
											className="h-12 w-full bg-muted/10"
											style={{ clipPath: clipPath8 }}
										/>
									))}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Action Buttons Skeleton */}
			<div className="flex gap-4">
				<Skeleton
					className="h-12 w-48 bg-muted/20"
					style={{
						clipPath:
							"polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
					}}
				/>
				<Skeleton
					className="h-12 w-40 bg-muted/20"
					style={{
						clipPath:
							"polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
					}}
				/>
			</div>
		</div>
	);
}
