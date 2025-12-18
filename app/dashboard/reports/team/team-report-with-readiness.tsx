"use client";

/**
 * Team Report Content with Readiness Gate
 *
 * Client component that checks team readiness before showing report generation.
 * If team is not ready, shows the TeamReadinessDashboard.
 * If team is ready and report exists, shows the report.
 * If team is ready and no report exists, shows dashboard with generate option.
 *
 * @feature 009-contextual-reports
 */

import { useEffect, useState, useTransition } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import { generateTeamReport, getTeamReadiness } from "../_actions";
import { TeamReadinessDashboard } from "../_components/team-readiness-dashboard";
import type { TeamReadiness } from "../_schemas/readiness.schema";
import type { TeamReport } from "../_schemas/team-report.schema";
import { TeamReportView } from "./team-report-view";

interface TeamReportWithReadinessProps {
	team: {
		id: string;
		name: string;
		description: string | null;
		members: Array<{
			id: string;
			name: string;
			role: string | null;
			career: string | null;
			hasStrengths: boolean;
			strengths: Array<{
				rank: number;
				name: string;
				domain: string;
			}>;
		}>;
	};
	membersWithStrengthsCount: number;
	existingReport: {
		id: string;
		version: number;
		createdAt: Date;
		modelUsed: string | null;
		content: TeamReport | null;
		metadata: Record<string, unknown> | null;
	} | null;
	isLeader: boolean;
}

export function TeamReportWithReadiness({
	team,
	membersWithStrengthsCount,
	existingReport,
	isLeader,
}: TeamReportWithReadinessProps) {
	const [readiness, setReadiness] = useState<TeamReadiness | null>(null);
	// Initialize loading state based on whether we need to load (only for leaders)
	const [isLoadingReadiness, setIsLoadingReadiness] = useState(isLeader);
	const [readinessError, setReadinessError] = useState<string | null>(null);
	const [isGenerating, startTransition] = useTransition();
	// Initialize showReadiness based on leader status
	const [showReadiness, setShowReadiness] = useState(isLeader);

	// Load team readiness on mount (for leaders only)
	useEffect(() => {
		// Early return for non-leaders - no state changes needed since we initialize correctly
		if (!isLeader) {
			return;
		}

		async function loadReadiness() {
			setIsLoadingReadiness(true);
			const result = await getTeamReadiness(team.id);

			if (result.success && result.data) {
				setReadiness(result.data);
				// If report exists and team is ready, skip readiness dashboard
				if (existingReport && result.data.isReady) {
					setShowReadiness(false);
				}
			} else {
				setReadinessError(result.error ?? "Error al verificar preparación");
			}
			setIsLoadingReadiness(false);
		}

		loadReadiness();
	}, [team.id, isLeader, existingReport]);

	// Handle report generation
	const handleGenerateReport = () => {
		startTransition(async () => {
			const result = await generateTeamReport({
				teamId: team.id,
				forceRegenerate: false,
			});

			if (result.success) {
				// Reload the page to show the new report
				window.location.reload();
			}
		});
	};

	// Loading state
	if (isLoadingReadiness) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-64 w-full" />
			</div>
		);
	}

	// Error state
	if (readinessError) {
		return (
			<Alert variant="destructive">
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{readinessError}</AlertDescription>
			</Alert>
		);
	}

	// Non-leader view: show existing report or message
	if (!isLeader) {
		if (existingReport?.content) {
			return (
				<TeamReportView
					team={team}
					membersWithStrengthsCount={membersWithStrengthsCount}
					existingReport={existingReport}
				/>
			);
		}

		return (
			<Alert>
				<AlertTitle>Reporte no disponible</AlertTitle>
				<AlertDescription>
					El líder del equipo debe generar el reporte primero.
				</AlertDescription>
			</Alert>
		);
	}

	// Leader view with readiness check
	// If report exists, show it
	if (existingReport?.content && !showReadiness) {
		return (
			<TeamReportView
				team={team}
				membersWithStrengthsCount={membersWithStrengthsCount}
				existingReport={existingReport}
			/>
		);
	}

	// If no report or not ready, show readiness dashboard
	if (readiness) {
		return (
			<TeamReadinessDashboard
				readiness={readiness}
				onGenerateReport={readiness.isReady ? handleGenerateReport : undefined}
				isGenerating={isGenerating}
			/>
		);
	}

	// Fallback to original view if readiness check failed
	return (
		<TeamReportView
			team={team}
			membersWithStrengthsCount={membersWithStrengthsCount}
			existingReport={existingReport}
		/>
	);
}
