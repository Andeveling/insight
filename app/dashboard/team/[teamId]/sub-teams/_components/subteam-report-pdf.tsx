/**
 * SubTeam Report PDF Document
 *
 * PDF document component for generating downloadable sub-team reports.
 * Uses @react-pdf/renderer for PDF generation.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_components/subteam-report-pdf
 */

import {
	Document,
	Font,
	Page,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";

import type { SubTeamDetail, StrengthGap } from "@/lib/types";

// ============================================================
// Font Registration (Optional - using system fonts as fallback)
// ============================================================

Font.register({
	family: "Inter",
	fonts: [
		{
			src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
			fontWeight: 400,
		},
		{
			src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2",
			fontWeight: 600,
		},
		{
			src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2",
			fontWeight: 700,
		},
	],
});

// ============================================================
// Color Palette (matches domain-colors.ts)
// ============================================================

const COLORS = {
	primary: "#6366f1", // Indigo
	secondary: "#64748b", // Slate
	success: "#10b981", // Emerald
	warning: "#f59e0b", // Amber
	error: "#ef4444", // Red
	muted: "#94a3b8", // Slate-400
	background: "#f8fafc", // Slate-50
	white: "#ffffff",
	black: "#0f172a", // Slate-900
	border: "#e2e8f0", // Slate-200

	// Domain colors
	doing: "#ec4899", // Pink-500
	feeling: "#eab308", // Yellow-500
	motivating: "#22c55e", // Green-500
	thinking: "#3b82f6", // Blue-500

	// Score colors
	excellent: "#10b981",
	good: "#3b82f6",
	fair: "#f59e0b",
	poor: "#ef4444",
};

// ============================================================
// PDF Styles
// ============================================================

const styles = StyleSheet.create({
	page: {
		fontFamily: "Inter",
		fontSize: 10,
		paddingTop: 40,
		paddingBottom: 60,
		paddingHorizontal: 40,
		backgroundColor: COLORS.white,
		color: COLORS.black,
	},
	header: {
		marginBottom: 24,
		paddingBottom: 16,
		borderBottom: `2px solid ${COLORS.primary}`,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: 700,
		color: COLORS.primary,
		marginBottom: 4,
	},
	headerSubtitle: {
		fontSize: 12,
		color: COLORS.secondary,
	},
	headerMeta: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 12,
		paddingTop: 8,
		borderTop: `1px solid ${COLORS.border}`,
	},
	metaItem: {
		fontSize: 9,
		color: COLORS.muted,
	},
	section: {
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: 600,
		color: COLORS.black,
		marginBottom: 12,
		paddingBottom: 4,
		borderBottom: `1px solid ${COLORS.border}`,
	},
	card: {
		backgroundColor: COLORS.background,
		borderRadius: 6,
		padding: 12,
		marginBottom: 8,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 4,
	},
	label: {
		fontSize: 9,
		color: COLORS.muted,
		width: 100,
	},
	value: {
		fontSize: 10,
		fontWeight: 600,
		color: COLORS.black,
	},
	// Score display
	scoreContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 16,
		backgroundColor: COLORS.background,
		borderRadius: 8,
		marginBottom: 12,
	},
	scoreCircle: {
		width: 70,
		height: 70,
		borderRadius: 35,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
	},
	scoreValue: {
		fontSize: 28,
		fontWeight: 700,
		color: COLORS.white,
	},
	scoreLabel: {
		fontSize: 16,
		fontWeight: 600,
		color: COLORS.black,
	},
	scoreDescription: {
		fontSize: 10,
		color: COLORS.secondary,
		marginTop: 2,
	},
	// Factor breakdown
	factorRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 6,
		borderBottom: `1px solid ${COLORS.border}`,
	},
	factorName: {
		flex: 1,
		fontSize: 10,
		color: COLORS.black,
	},
	factorScore: {
		width: 50,
		fontSize: 10,
		fontWeight: 600,
		textAlign: "right",
		marginRight: 8,
	},
	factorBar: {
		width: 100,
		height: 8,
		backgroundColor: COLORS.border,
		borderRadius: 4,
		overflow: "hidden",
	},
	factorBarFill: {
		height: 8,
		borderRadius: 4,
	},
	// Members grid
	membersGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	memberCard: {
		width: "48%",
		backgroundColor: COLORS.background,
		borderRadius: 6,
		padding: 10,
		marginBottom: 8,
	},
	memberName: {
		fontSize: 11,
		fontWeight: 600,
		color: COLORS.black,
		marginBottom: 4,
	},
	memberEmail: {
		fontSize: 8,
		color: COLORS.muted,
		marginBottom: 6,
	},
	strengthsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 4,
	},
	strengthBadge: {
		paddingVertical: 2,
		paddingHorizontal: 6,
		borderRadius: 4,
		fontSize: 7,
		fontWeight: 600,
	},
	// Gaps section
	gapCard: {
		backgroundColor: COLORS.background,
		borderRadius: 6,
		padding: 10,
		marginBottom: 8,
		borderLeft: `3px solid ${COLORS.warning}`,
	},
	gapCritical: {
		borderLeftColor: COLORS.error,
	},
	gapOptional: {
		borderLeftColor: COLORS.muted,
	},
	gapTitle: {
		fontSize: 11,
		fontWeight: 600,
		color: COLORS.black,
		marginBottom: 2,
	},
	gapDomain: {
		fontSize: 8,
		color: COLORS.muted,
		marginBottom: 4,
	},
	gapReason: {
		fontSize: 9,
		color: COLORS.secondary,
	},
	// Recommendations
	recommendationItem: {
		flexDirection: "row",
		marginBottom: 6,
		paddingLeft: 8,
	},
	recommendationBullet: {
		width: 16,
		fontSize: 10,
		color: COLORS.primary,
		fontWeight: 600,
	},
	recommendationText: {
		flex: 1,
		fontSize: 10,
		color: COLORS.secondary,
		lineHeight: 1.4,
	},
	// Footer
	footer: {
		position: "absolute",
		bottom: 30,
		left: 40,
		right: 40,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingTop: 12,
		borderTop: `1px solid ${COLORS.border}`,
	},
	footerText: {
		fontSize: 8,
		color: COLORS.muted,
	},
	pageNumber: {
		fontSize: 8,
		color: COLORS.muted,
	},
});

// ============================================================
// Helper Functions
// ============================================================

function getScoreColor(score: number | null): string {
	if (score === null) return COLORS.muted;
	if (score >= 85) return COLORS.excellent;
	if (score >= 70) return COLORS.good;
	if (score >= 50) return COLORS.fair;
	return COLORS.poor;
}

function getScoreLabel(score: number | null): string {
	if (score === null) return "N/A";
	if (score >= 85) return "Excelente";
	if (score >= 70) return "Bueno";
	if (score >= 50) return "Regular";
	return "Bajo";
}

function getDomainColorPdf(domainName: string): string {
	const domain = domainName.toLowerCase();
	if (domain.includes("doing") || domain.includes("acción"))
		return COLORS.doing;
	if (domain.includes("feeling") || domain.includes("sentimiento"))
		return COLORS.feeling;
	if (domain.includes("motivating") || domain.includes("motivación"))
		return COLORS.motivating;
	if (domain.includes("thinking") || domain.includes("pensamiento"))
		return COLORS.thinking;
	return COLORS.primary;
}

function getGapPriorityStyle(
	priority: StrengthGap["priority"],
): Record<string, string> {
	switch (priority) {
		case "critical":
			return { borderLeftColor: COLORS.error };
		case "optional":
			return { borderLeftColor: COLORS.muted };
		default:
			return { borderLeftColor: COLORS.warning };
	}
}

function getGapPriorityLabel(priority: StrengthGap["priority"]): string {
	switch (priority) {
		case "critical":
			return "🔴 Crítico";
		case "optional":
			return "⚪ Opcional";
		default:
			return "🟡 Recomendado";
	}
}

function formatFactorName(key: string): string {
	const names: Record<string, string> = {
		strengthCoverage: "Cobertura de Fortalezas",
		domainBalance: "Balance de Dominios",
		cultureFit: "Ajuste Cultural",
		teamSize: "Tamaño del Equipo",
		redundancyPenalty: "Penalización por Redundancia",
	};
	return names[key] || key;
}

// ============================================================
// PDF Document Component
// ============================================================

interface SubTeamReportDocumentProps {
	subTeam: SubTeamDetail;
	generatedAt?: Date;
}

export function SubTeamReportDocument({
	subTeam,
	generatedAt = new Date(),
}: SubTeamReportDocumentProps) {
	const scoreColor = getScoreColor(subTeam.matchScore);
	const scoreLabel = getScoreLabel(subTeam.matchScore);

	return (
		<Document
			title={`Reporte - ${subTeam.name}`}
			author="Insight Platform"
			subject="Análisis de Sub-Equipo"
		>
			<Page size="A4" style={styles.page}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.headerTitle}>{subTeam.name}</Text>
					<Text style={styles.headerSubtitle}>
						{subTeam.description || "Reporte de Análisis de Sub-Equipo"}
					</Text>
					<View style={styles.headerMeta}>
						<Text style={styles.metaItem}>
							Equipo: {subTeam.parentTeam?.name}
						</Text>
						<Text style={styles.metaItem}>
							Generado:{" "}
							{generatedAt.toLocaleDateString("es-ES", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</Text>
					</View>
				</View>

				{/* Project Type Info */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Tipo de Proyecto</Text>
					<View style={styles.card}>
						<View style={styles.row}>
							<Text style={styles.label}>Proyecto:</Text>
							<Text style={styles.value}>
								{subTeam.projectTypeProfile?.icon}{" "}
								{subTeam.projectTypeProfile?.nameEs ||
									subTeam.projectTypeProfile?.name}
							</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.label}>Descripción:</Text>
							<Text
								style={{
									...styles.value,
									fontWeight: 400,
									color: COLORS.secondary,
								}}
							>
								{subTeam.projectTypeProfile?.descriptionEs ||
									subTeam.projectTypeProfile?.description ||
									"Sin descripción"}
							</Text>
						</View>
					</View>
				</View>

				{/* Match Score */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Match Score</Text>
					<View style={styles.scoreContainer}>
						<View
							style={{ ...styles.scoreCircle, backgroundColor: scoreColor }}
						>
							<Text style={styles.scoreValue}>
								{subTeam.matchScore !== null
									? Math.round(subTeam.matchScore)
									: "?"}
							</Text>
						</View>
						<View>
							<Text style={styles.scoreLabel}>{scoreLabel}</Text>
							<Text style={styles.scoreDescription}>
								{subTeam.membersDetails?.length || 0} miembros en el sub-equipo
							</Text>
						</View>
					</View>

					{/* Factor Breakdown */}
					{subTeam.analysis?.factors && (
						<View style={styles.card}>
							<Text
								style={{
									fontSize: 10,
									fontWeight: 600,
									marginBottom: 8,
									color: COLORS.black,
								}}
							>
								Desglose de Factores
							</Text>
							{Object.entries(subTeam.analysis.factors).map(([key, factor]) => (
								<View key={key} style={styles.factorRow}>
									<Text style={styles.factorName}>{formatFactorName(key)}</Text>
									<Text style={styles.factorScore}>
										{Math.round(factor.score)}%
									</Text>
									<View style={styles.factorBar}>
										<View
											style={{
												...styles.factorBarFill,
												width: `${factor.score}%`,
												backgroundColor: getScoreColor(factor.score),
											}}
										/>
									</View>
								</View>
							))}
						</View>
					)}
				</View>

				{/* Members */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>
						Miembros ({subTeam.membersDetails?.length || 0})
					</Text>
					<View style={styles.membersGrid}>
						{subTeam.membersDetails?.map((member) => (
							<View key={member.id} style={styles.memberCard}>
								<Text style={styles.memberName}>
									{member.name || "Usuario"}
								</Text>
								<Text style={styles.memberEmail}>{member.email}</Text>
								<View style={styles.strengthsContainer}>
									{member.strengths?.slice(0, 5).map((strength) => (
										<Text
											key={strength.id}
											style={{
												...styles.strengthBadge,
												backgroundColor: getDomainColorPdf(
													strength.domain?.name || "",
												),
												color: COLORS.white,
											}}
										>
											{strength.nameEs || strength.name}
										</Text>
									))}
								</View>
							</View>
						))}
					</View>
				</View>

				{/* Gaps (if any) */}
				{subTeam.analysis?.gaps && subTeam.analysis.gaps.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>
							Brechas Identificadas ({subTeam.analysis.gaps.length})
						</Text>
						{subTeam.analysis.gaps.map((gap, index) => (
							<View
								key={index}
								style={{
									...styles.gapCard,
									...getGapPriorityStyle(gap.priority),
								}}
							>
								<View style={styles.row}>
									<Text style={styles.gapTitle}>
										{gap.strengthNameEs || gap.strengthName}
									</Text>
									<Text
										style={{
											fontSize: 8,
											marginLeft: 8,
											color: COLORS.muted,
										}}
									>
										{getGapPriorityLabel(gap.priority)}
									</Text>
								</View>
								<Text style={styles.gapDomain}>
									Dominio: {gap.domainNameEs || gap.domainName}
								</Text>
								<Text style={styles.gapReason}>{gap.reason}</Text>
							</View>
						))}
					</View>
				)}

				{/* Recommendations */}
				{subTeam.analysis?.recommendations &&
					subTeam.analysis.recommendations.length > 0 && (
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Recomendaciones</Text>
							<View style={styles.card}>
								{subTeam.analysis.recommendations.map((rec, index) => (
									<View key={index} style={styles.recommendationItem}>
										<Text style={styles.recommendationBullet}>•</Text>
										<Text style={styles.recommendationText}>{rec}</Text>
									</View>
								))}
							</View>
						</View>
					)}

				{/* Footer */}
				<View style={styles.footer} fixed>
					<Text style={styles.footerText}>
						Generado por {subTeam.creator?.name || "Insight"} •{" "}
						{generatedAt.toLocaleDateString("es-ES")}
					</Text>
					<Text
						style={styles.pageNumber}
						render={({ pageNumber, totalPages }) =>
							`Página ${pageNumber} de ${totalPages}`
						}
					/>
				</View>
			</Page>
		</Document>
	);
}

export default SubTeamReportDocument;
