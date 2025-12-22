import { Suspense } from "react";
import DashboardContainer from "../../_components/dashboard-container";
import { IndividualReportContent } from "./_components/individual-report-content";
import { LayoutGrid } from "lucide-react";

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
			title="STRENGTHS_ANALYTICS_REPORT"
			description="Desencriptando tu huella de talento única mediante análisis neural impulsado por IA_"
			card={
				<div className="flex items-center gap-3">
					<div className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
						<div className="size-1.5 rounded-full bg-primary animate-pulse" />
						REPORT_SYSTEM: ONLINE
					</div>
				</div>
			}
		>
			<Suspense fallback={<IndividualReportSkeleton />}>
				<IndividualReportContent />
			</Suspense>
		</DashboardContainer>
	);
}

function IndividualReportSkeleton() {
	const clipPath16 =
		"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";

	return (
		<div className="space-y-8 animate-pulse">
			{/* Readiness card skeleton */}
			<div className="p-px bg-border/40" style={{ clipPath: clipPath16 }}>
				<div
					className="bg-background/50 backdrop-blur-sm p-8 space-y-8"
					style={{ clipPath: clipPath16 }}
				>
					<div className="flex flex-col gap-8 md:flex-row md:items-center justify-between">
						<div className="flex flex-col items-center gap-6 md:flex-row">
							<div
								className="size-32 bg-muted/20"
								style={{
									clipPath:
										"polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
								}}
							/>
							<div className="space-y-3 text-center md:text-left">
								<div className="h-6 w-64 bg-muted/20" />
								<div className="h-4 w-40 bg-muted/20" />
							</div>
						</div>
						<div
							className="h-10 w-48 bg-muted/20"
							style={{
								clipPath:
									"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
							}}
						/>
					</div>

					<div className="space-y-4">
						{[...Array(4)].map((_, i) => (
							<div
								key={i}
								className="h-20 w-full bg-muted/10 border-l-2 border-primary/20"
							/>
						))}
					</div>
				</div>
			</div>

			{/* Grid skeleton */}
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
