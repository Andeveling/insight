/**
 * Individual Report Content
 *
 * Server component that fetches readiness and report data,
 * then renders the appropriate view based on readiness status.
 *
 * @feature 009-contextual-reports
 */

import { redirect } from "next/navigation";
import {
	getIndividualReadiness,
	getUserIndividualReportData,
} from "../../_actions";
import { IndividualReportWithReadiness } from "./individual-report-with-readiness";

export async function IndividualReportContent() {
	// Fetch both readiness and report data in parallel
	const [readinessResult, reportData] = await Promise.all([
		getIndividualReadiness(),
		getUserIndividualReportData(),
	]);

	// Handle auth errors
	if (!reportData) {
		redirect("/login");
	}

	if (!readinessResult.success || !readinessResult.data) {
		redirect("/login");
	}

	return (
		<IndividualReportWithReadiness
			readiness={readinessResult.data}
			user={reportData.user}
			hasStrengths={reportData.hasStrengths}
			existingReport={reportData.existingReport}
		/>
	);
}
