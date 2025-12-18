import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardContainer from "../../_components/dashboard-container";
import { IndividualReportContent } from "./individual-report-content";

/**
 * Individual Report Page
 *
 * Displays the individual report with readiness gate.
 * Uses Next.js 16 Cache Components pattern (PPR).
 *
 * @feature 009-contextual-reports
 */
export default function IndividualReportPage() {
	return (
		<DashboardContainer
			title="Reporte de Fortalezas Personales"
			description="Análisis impulsado por IA basado en tu desarrollo"
		>
			<Suspense fallback={<IndividualReportSkeleton />}>
				<IndividualReportContent />
			</Suspense>
		</DashboardContainer>
	);
}

function IndividualReportSkeleton() {
	return (
		<div className="container mx-auto space-y-6 py-4">
			{/* Readiness card skeleton */}
			<div className="rounded-xl border p-6">
				<div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-col items-center gap-4 sm:flex-row">
						<Skeleton className="size-40 rounded-full" />
						<div className="space-y-2 text-center sm:text-left">
							<Skeleton className="h-6 w-48" />
							<Skeleton className="h-4 w-32" />
						</div>
					</div>
					<div className="space-y-3">
						<Skeleton className="h-12 w-full sm:w-32" />
					</div>
				</div>
				<div className="mt-6 space-y-3">
					<Skeleton className="h-16 w-full" />
					<Skeleton className="h-16 w-full" />
					<Skeleton className="h-16 w-full" />
					<Skeleton className="h-16 w-full" />
				</div>
			</div>
		</div>
	);
}
