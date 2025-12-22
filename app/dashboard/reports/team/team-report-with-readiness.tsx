"use client";

import { useEffect, useState, useTransition } from "react";
import { generateTeamReport, getTeamReadiness } from "../_actions";
import { TeamReadinessDashboard } from "../_components/team-readiness-dashboard";
import type { TeamReadiness } from "../_schemas/readiness.schema";
import type { TeamReport } from "../_schemas/team-report.schema";
import { TeamReportView } from "./team-report-view";
import { ShieldAlertIcon, Loader, LockIcon } from "lucide-react";

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
	const [isLoadingReadiness, setIsLoadingReadiness] = useState(isLeader);
	const [readinessError, setReadinessError] = useState<string | null>(null);
	const [isGenerating, startTransition] = useTransition();
	const [showReadiness, setShowReadiness] = useState(isLeader);

	const clipPath16 = "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
	const clipPath8 = "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";
	const clipHex = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

	// Load team readiness on mount (for leaders only)
	useEffect(() => {
		if (!isLeader) return;

		async function loadReadiness() {
			setIsLoadingReadiness(true);
			const result = await getTeamReadiness(team.id);

			if (result.success && result.data) {
				setReadiness(result.data);
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
				window.location.reload();
			}
		});
	};

	// Loading state
	if (isLoadingReadiness) {
		return (
			<div className="space-y-8 animate-pulse">
				<div className="p-px bg-border/40" style={{ clipPath: clipPath16 }}>
					<div className="bg-background/95 p-8 flex items-center gap-6" style={{ clipPath: clipPath16 }}>
						<div className="size-12 bg-muted/20" style={{ clipPath: clipHex }} />
						<div className="space-y-2">
							<div className="h-4 w-48 bg-muted/20" />
							<div className="h-3 w-32 bg-muted/20" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (readinessError) {
		return (
			<div className="p-px bg-red-500/30" style={{ clipPath: clipPath8 }}>
				<div className="bg-red-500/5 px-6 py-4 space-y-2" style={{ clipPath: clipPath8 }}>
					<div className="flex items-center gap-3">
						<ShieldAlertIcon className="size-4 text-red-500" />
						<h3 className="text-xs font-black uppercase tracking-widest text-red-500">CORE_SYSTEM_FAILURE</h3>
					</div>
					<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
						{readinessError.toUpperCase()}
					</p>
				</div>
			</div>
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
			<div className="p-px bg-amber-500/20 max-w-lg mx-auto" style={{ clipPath: clipPath16 }}>
				<div className="bg-background/95 backdrop-blur-md p-10 text-center space-y-6" style={{ clipPath: clipPath16 }}>
					<div className="mx-auto size-16 flex items-center justify-center bg-amber-500/10 text-amber-500" style={{ clipPath: clipHex }}>
						<LockIcon className="size-8" />
					</div>
					<div className="space-y-2">
						<h3 className="text-xl font-black uppercase tracking-[0.2em] text-foreground">
							PENDING_AUTHORIZATION
						</h3>
						<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-relaxed">
							EL_LÍDER_DEL_EQUIPO_DEBE_SINTETIZAR_EL_REPORTE_ANALÍTICO_PRIMERO. CONTACTA_A_TU_SUPERVISOR_DE_NODO_PARA_SINCRO.
						</p>
					</div>
				</div>
			</div>
		);
	}

	// Leader view with readiness check
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

	// Fallback
	return (
		<TeamReportView
			team={team}
			membersWithStrengthsCount={membersWithStrengthsCount}
			existingReport={existingReport}
		/>
	);
}
