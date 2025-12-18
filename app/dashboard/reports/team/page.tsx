import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardContainer from "../../_components/dashboard-container";
import { getTeamReportData } from "../_actions";
import { TeamReportWithReadiness } from "./team-report-with-readiness";

/**
 * Team Report Page
 *
 * Follows Next.js 16 Cache Components pattern:
 * - Static shell (container) is prerendered
 * - Dynamic content (team data, readiness) loads with Suspense
 *
 * @feature 009-contextual-reports
 */
export default function TeamReportPage() {
	return (
		<DashboardContainer
			title="Reporte del Equipo"
			description="Análisis impulsado por IA de la dinámica de tu equipo"
		>
			<Suspense fallback={<TeamReportSkeleton />}>
				<TeamReportContent />
			</Suspense>
		</DashboardContainer>
	);
}

/**
 * Loading skeleton for team report
 */
function TeamReportSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-8 w-64" />
			<Skeleton className="h-48 w-full" />
			<Skeleton className="h-32 w-full" />
		</div>
	);
}

/**
 * Dynamic content component that fetches team data
 */
async function TeamReportContent() {
	const data = await getTeamReportData();

	if (!data) {
		redirect("/login");
	}

	if (!data.teamMember) {
		return (
			<Alert>
				<AlertTitle>Equipo no encontrado</AlertTitle>
				<AlertDescription>
					No eres miembro de ningún equipo. Contacta a tu administrador para que
					te agregue a un equipo.
				</AlertDescription>
			</Alert>
		);
	}

	// Determine if user is team leader
	const isLeader = data.teamMember.role === "LEADER";

	return (
		<TeamReportWithReadiness
			team={data.team}
			membersWithStrengthsCount={data.membersWithStrengthsCount}
			existingReport={data.existingReport}
			isLeader={isLeader}
		/>
	);
}
