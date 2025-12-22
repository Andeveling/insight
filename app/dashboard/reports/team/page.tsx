import { redirect } from "next/navigation";
import { Suspense } from "react";
import DashboardContainer from "../../_components/dashboard-container";
import { getTeamReportData } from "../_actions";
import { TeamReportWithReadiness } from "./team-report-with-readiness";

/**
 * Team Report Page
 */
export default function TeamReportPage() {
	return (
		<DashboardContainer
			title="TEAM_ANALYTICS_REPORT"
			description="Sincronizando la matriz de talentos del equipo para optimización neural de alto rendimiento_"
			card={
				<div className="flex items-center gap-3">
					<div className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
						<div className="size-1.5 rounded-full bg-primary animate-pulse" />
						REPORT_SYSTEM: ONLINE
					</div>
				</div>
			}
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
	const clipPath16 =
		"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
	const clipHex = "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)";

	return (
		<div className="space-y-8 animate-pulse">
			<div className="p-px bg-border/40" style={{ clipPath: clipPath16 }}>
				<div
					className="bg-background/50 backdrop-blur-sm p-8 space-y-8"
					style={{ clipPath: clipPath16 }}
				>
					<div className="flex flex-col gap-8 md:flex-row md:items-center justify-between">
						<div className="flex flex-col items-center gap-6 md:flex-row">
							<div
								className="size-24 bg-muted/20"
								style={{ clipPath: clipHex }}
							/>
							<div className="space-y-3 text-center md:text-left">
								<div className="h-6 w-64 bg-muted/20" />
								<div className="h-4 w-40 bg-muted/20" />
							</div>
						</div>
						<div className="flex gap-4">
							<div
								className="h-12 w-24 bg-muted/20"
								style={{
									clipPath:
										"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
								}}
							/>
							<div
								className="h-12 w-24 bg-muted/20"
								style={{
									clipPath:
										"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
								}}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{[...Array(2)].map((_, i) => (
					<div
						key={i}
						className="h-64 bg-muted/5 border border-border/20"
						style={{
							clipPath:
								"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
						}}
					/>
				))}
			</div>
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
			<div
				className="p-px bg-red-500/30"
				style={{
					clipPath:
						"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
				}}
			>
				<div
					className="bg-red-500/5 px-6 py-4 space-y-2"
					style={{
						clipPath:
							"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
					}}
				>
					<h3 className="text-xs font-black uppercase tracking-widest text-red-500">
						EQUIPO_NO_ENCONTRADO
					</h3>
					<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-relaxed">
						NO_ERES_MIEMBRO_DE_NINGÚN_EQUIPO.
						CONTACTA_A_TU_ADMINISTRADOR_PARA_QUE_TE_AGREGUE_A_UN_EQUIPO.
					</p>
				</div>
			</div>
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
