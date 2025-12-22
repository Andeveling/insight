import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroSection } from "./_components/hero-section";
import { Recommendations } from "./_components/recommendations";
import { StrengthsCard } from "./_components/strengths-card";
import { TeamSummary } from "./_components/team-summary";

export default function DashboardPage() {
	return (
		<div className="container mx-auto py-6 space-y-8">
			<Suspense fallback={<HeroSkeleton />}>
				<HeroSection />
			</Suspense>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Suspense fallback={<CardSkeleton />}>
					<StrengthsCard />
				</Suspense>

				<Suspense fallback={<CardSkeleton />}>
					<Recommendations />
				</Suspense>

				<Suspense fallback={<CardSkeleton />}>
					<TeamSummary />
				</Suspense>
			</div>
		</div>
	);
}

function HeroSkeleton() {
	return (
		<div className="grid gap-6 md:grid-cols-3">
			<div className="md:col-span-2 p-6 border border-zinc-800 bg-zinc-950/50 rounded-lg">
				<Skeleton className="h-8 w-48 mb-4" />
				<Skeleton className="h-4 w-32 mb-6" />
				<Skeleton className="h-2 w-full" />
			</div>
			<div className="p-6 border border-zinc-800 bg-zinc-950/50 rounded-lg">
				<Skeleton className="h-6 w-32 mb-4" />
				<Skeleton className="h-20 w-full" />
			</div>
		</div>
	);
}

function CardSkeleton() {
	return (
		<div className="p-6 border border-zinc-800 bg-zinc-950/50 rounded-lg h-[300px]">
			<Skeleton className="h-6 w-32 mb-4" />
			<div className="space-y-3">
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-12 w-full" />
			</div>
		</div>
	);
}
