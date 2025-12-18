import { SparklesIcon } from "lucide-react";
import { Suspense } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import DashboardContainer from "../_components/dashboard-container";
import { getAllReportsStatus } from "./_actions";
import { ReportReadinessCard } from "./_components";

/**
 * Reports Dashboard Page
 *
 * Unified dashboard showing all available reports with readiness indicators.
 * Uses Cache Components pattern with Suspense for optimal loading.
 *
 * @feature 009-contextual-reports
 */
export default function ReportsPage() {
	return (
		<DashboardContainer
			title="Reportes de IA"
			description="Genera reportes completos impulsados por IA basados en datos de evaluación de fortalezas."
		>
			<Suspense fallback={<ReportsGridSkeleton />}>
				<ReportsContent />
			</Suspense>

			{/* Info Section */}
			<Card className="border-dashed">
				<CardContent className="flex items-center gap-4 py-6">
					<div className="flex size-12 items-center justify-center rounded-full bg-muted">
						<SparklesIcon className="size-6 text-muted-foreground" />
					</div>
					<div className="space-y-1">
						<p className="font-medium">Cómo funciona</p>
						<p className="text-sm text-muted-foreground">
							Los reportes se generan con IA basándose en tu perfil de
							fortalezas y tu progreso de desarrollo. Usamos modelos avanzados
							para análisis comprehensivos. Los reportes contextuales incluyen
							insights personalizados basados en tu actividad real.
						</p>
					</div>
				</CardContent>
			</Card>
		</DashboardContainer>
	);
}

/**
 * Reports content with readiness data
 */
async function ReportsContent() {
	const result = await getAllReportsStatus();

	if (!result.success || !result.data) {
		return (
			<Card className="border-dashed">
				<CardContent className="py-8 text-center">
					<p className="text-muted-foreground">
						{result.error ?? "No se pudo cargar el estado de los reportes."}
					</p>
				</CardContent>
			</Card>
		);
	}

	const { individual, teams } = result.data;

	// If no strengths yet, show message
	if (!individual) {
		return (
			<Card className="border-dashed">
				<CardContent className="py-8 text-center">
					<p className="text-muted-foreground">
						Primero necesitas identificar tus fortalezas para generar reportes.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid gap-6 md:grid-cols-2">
			{/* Individual Report Card */}
			<ReportReadinessCard
				type="individual"
				title="Reporte Individual"
				description="Análisis de fortalezas personales"
				readinessScore={individual.readinessScore}
				isReady={individual.isReady}
				hasExistingReport={individual.hasExistingReport}
				canRegenerate={individual.canRegenerate}
				href="/dashboard/reports/individual"
			/>

			{/* Team Report Cards */}
			{teams.map((team) => (
				<ReportReadinessCard
					key={team.teamId}
					type="team"
					title="Reporte de Equipo"
					description="Análisis de composición del equipo"
					teamName={team.teamName}
					memberCount={team.memberCount}
					readinessScore={team.readinessScore}
					isReady={team.isReady}
					hasExistingReport={team.hasExistingReport}
					canRegenerate={team.canRegenerate}
					href={`/dashboard/reports/team?teamId=${team.teamId}`}
				/>
			))}

			{/* No teams message if user is not a leader of any team */}
			{teams.length === 0 && (
				<Card className="border-dashed">
					<CardContent className="py-8 text-center">
						<p className="text-muted-foreground">
							No eres líder de ningún equipo. Los reportes de equipo están
							disponibles para líderes.
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

/**
 * Loading skeleton for reports grid
 */
function ReportsGridSkeleton() {
	return (
		<div className="grid gap-6 md:grid-cols-2">
			<Card className="relative overflow-hidden">
				<div className="p-6 space-y-4">
					<div className="flex items-center gap-3">
						<Skeleton className="size-12 rounded-lg" />
						<div className="space-y-2">
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-4 w-48" />
						</div>
					</div>
					<div className="space-y-2">
						<Skeleton className="h-2 w-full" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-2/3" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-2/3" />
					</div>
					<Skeleton className="h-10 w-full" />
				</div>
			</Card>
			<Card className="relative overflow-hidden">
				<div className="p-6 space-y-4">
					<div className="flex items-center gap-3">
						<Skeleton className="size-12 rounded-lg" />
						<div className="space-y-2">
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-4 w-48" />
						</div>
					</div>
					<div className="space-y-2">
						<Skeleton className="h-2 w-full" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-2/3" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-2/3" />
					</div>
					<Skeleton className="h-10 w-full" />
				</div>
			</Card>
		</div>
	);
}
