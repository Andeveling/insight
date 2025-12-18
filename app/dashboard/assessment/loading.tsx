/**
 * Assessment Loading State
 * Skeleton screen for assessment pages
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export default function AssessmentLoading() {
	return (
		<div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
			{/* Progress skeleton */}
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-4 w-16" />
				</div>
				<Skeleton className="h-2 w-full" />
			</div>

			{/* Question card skeleton */}
			<Card className="shadow-lg">
				<CardHeader className="pb-4">
					<div className="flex items-center gap-4">
						<Spinner className="h-5 w-5" />
						<Skeleton className="h-6 w-full max-w-md" />
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* Scale buttons skeleton */}
					<div className="flex flex-wrap justify-center gap-2">
						{[1, 2, 3, 4, 5].map((i) => (
							<Skeleton key={i} className="h-12 w-12 rounded-full" />
						))}
					</div>

					{/* Scale labels skeleton */}
					<div className="flex justify-between">
						<Skeleton className="h-3 w-24" />
						<Skeleton className="h-3 w-24" />
					</div>

					{/* Submit button skeleton */}
					<div className="flex justify-center pt-4">
						<Skeleton className="h-10 w-32" />
					</div>
				</CardContent>
			</Card>

			{/* Loading message */}
			<p className="text-center text-sm text-muted-foreground">
				Loading your assessment...
			</p>
		</div>
	);
}
