import { Award } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "@/lib/auth";
import { getBadges } from "../_actions/get-badges";
import { BadgeShowcase } from "../_components/badge-showcase";

/**
 * Badges Gallery Page
 *
 * Shows all badges organized by tier with unlock status and progress.
 * Uses Cache Components pattern with Suspense.
 */
export default function BadgesPage() {
	return (
		<div className="container mx-auto p-6">
			<header className="mb-8">
				<div className="flex items-center gap-3 mb-2">
					<Award className="h-8 w-8 text-primary" />
					<h1 className="text-3xl font-bold">Insignias</h1>
				</div>
				<p className="text-muted-foreground">
					Colecciona insignias completando logros y alcanzando metas.
				</p>
			</header>

			<Suspense fallback={<BadgesSkeleton />}>
				<BadgesContent />
			</Suspense>
		</div>
	);
}

/**
 * Badges Content - Server Component
 */
async function BadgesContent() {
	const session = await getSession();

	if (!session?.user?.id) {
		redirect("/login");
	}

	const badgeData = await getBadges();

	return (
		<BadgeShowcase
			badges={badgeData.badges}
			unlockedCount={badgeData.unlockedCount}
			totalBadges={badgeData.totalBadges}
			byTier={badgeData.byTier}
		/>
	);
}

/**
 * Badges Skeleton
 */
function BadgesSkeleton() {
	return (
		<div className="space-y-6">
			{/* Summary Skeleton */}
			<Skeleton className="h-6 w-48" />

			{/* Tabs Skeleton */}
			<Skeleton className="h-10 w-full" />

			{/* Badge Grid Skeleton */}
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
				{Array.from({ length: 8 }).map((_, i) => (
					<Card key={i}>
						<CardContent className="pt-6 pb-4 text-center">
							<Skeleton className="h-16 w-16 rounded-full mx-auto mb-3" />
							<Skeleton className="h-4 w-24 mx-auto mb-2" />
							<Skeleton className="h-5 w-16 mx-auto" />
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
