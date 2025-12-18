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
		<div className="container mx-auto p-6">
			<header className="mb-8">
				<h1 className="text-3xl font-bold mb-2">Tu Progreso</h1>
				<p className="text-muted-foreground">
					Visualiza tu avance, nivel y logros en tu camino de desarrollo.
				</p>
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
	return (
		<Card>
			<CardContent className="pt-6">
				<Skeleton className="h-6 w-24 mb-4" />
				<Skeleton className="h-24 w-full mb-4" />
				<div className="space-y-3">
					{[1, 2, 3].map((i) => (
						<div key={i} className="flex gap-3">
							<Skeleton className="h-8 w-8" />
							<div className="flex-1">
								<Skeleton className="h-4 w-3/4 mb-2" />
								<Skeleton className="h-3 w-full" />
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

/**
 * Dashboard Skeleton
 */
function DashboardSkeleton() {
	return (
		<div className="space-y-6">
			{/* Hero Skeleton */}
			<div className="rounded-xl border p-6">
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
					<div className="flex items-center gap-4">
						<Skeleton className="h-16 w-16 rounded-full" />
						<div>
							<Skeleton className="h-7 w-32 mb-2" />
							<Skeleton className="h-5 w-24" />
						</div>
					</div>
					<div className="flex-1 max-w-md w-full">
						<Skeleton className="h-4 w-full mb-2" />
						<Skeleton className="h-3 w-3/4" />
					</div>
				</div>
			</div>

			{/* Stats Grid Skeleton */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{[1, 2, 3, 4].map((i) => (
					<Card key={i}>
						<CardContent className="pt-6">
							<div className="flex items-center gap-3">
								<Skeleton className="h-10 w-10 rounded-lg" />
								<div>
									<Skeleton className="h-4 w-16 mb-1" />
									<Skeleton className="h-6 w-12" />
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Cards Row Skeleton */}
			<div className="grid md:grid-cols-2 gap-6">
				<Card>
					<CardContent className="pt-6">
						<Skeleton className="h-6 w-32 mb-4" />
						<Skeleton className="h-10 w-20 mb-4" />
						<Skeleton className="h-4 w-full" />
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<Skeleton className="h-6 w-40 mb-4" />
						<div className="space-y-3">
							{[1, 2, 3].map((i) => (
								<div key={i} className="flex items-center gap-3">
									<Skeleton className="h-8 w-8 rounded-full" />
									<div className="flex-1">
										<Skeleton className="h-4 w-24 mb-1" />
										<Skeleton className="h-3 w-16" />
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Action Buttons Skeleton */}
			<div className="flex gap-4">
				<Skeleton className="h-10 w-40" />
				<Skeleton className="h-10 w-32" />
			</div>
		</div>
	);
}
