/**
 * Generate Report Server Action
 *
 * Server action for generating PDF reports of sub-teams.
 * Uses @react-pdf/renderer to create downloadable PDF documents.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_actions/generate-report
 */

"use server";

import { renderToBuffer } from "@react-pdf/renderer";

import { SubTeamReportDocument } from "../_components/subteam-report-pdf";

import { getSession } from "@/lib/auth";
import { getSubTeamDetail } from "@/lib/services/subteam.service";

// ============================================================
// Types
// ============================================================

interface GenerateReportResult {
  success: boolean;
  data?: {
    buffer: string; // Base64 encoded PDF buffer
    filename: string;
    contentType: string;
  };
  error?: string;
}

// ============================================================
// Server Action
// ============================================================

/**
 * Generate a PDF report for a sub-team
 *
 * @param subTeamId - The ID of the sub-team to generate report for
 * @returns Object containing base64-encoded PDF buffer or error
 */
export async function generateSubTeamReport(
  subTeamId: string
): Promise<GenerateReportResult> {
  try {
    // Validate session
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "No autorizado. Por favor, inicia sesión.",
      };
    }

    // Fetch sub-team data
    const subTeam = await getSubTeamDetail(subTeamId);

    if (!subTeam) {
      return {
        success: false,
        error: "Sub-equipo no encontrado.",
      };
    }

    // Generate PDF document
    const generatedAt = new Date();

    // Render PDF to buffer
    const pdfBuffer = await renderToBuffer(
      SubTeamReportDocument({
        subTeam,
        generatedAt,
      })
    );

    // Convert buffer to base64 for client-side download
    const base64Buffer = Buffer.from(pdfBuffer).toString("base64");

    // Generate filename
    const sanitizedName = subTeam.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const dateStr = generatedAt.toISOString().split("T")[ 0 ];
    const filename = `reporte-${sanitizedName}-${dateStr}.pdf`;

    return {
      success: true,
      data: {
        buffer: base64Buffer,
        filename,
        contentType: "application/pdf",
      },
    };
  } catch (error) {
    console.error("Error generating sub-team report:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al generar el reporte. Por favor, intenta de nuevo.",
    };
  }
}
