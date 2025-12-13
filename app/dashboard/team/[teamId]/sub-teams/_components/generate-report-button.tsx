/**
 * Generate Report Button
 *
 * Client component for generating and downloading sub-team PDF reports.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_components/generate-report-button
 */

"use client";

import { Download, FileText, Loader2 } from "lucide-react";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";

import { generateSubTeamReport } from "../_actions/generate-report";

import { Button } from "@/components/ui/button";

// ============================================================
// Types
// ============================================================

interface GenerateReportButtonProps {
  subTeamId: string;
  subTeamName: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

// ============================================================
// Component
// ============================================================

export function GenerateReportButton({
  subTeamId,
  subTeamName,
  variant = "outline",
  size = "default",
}: GenerateReportButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>("");

  /**
   * Handle report generation
   */
  const handleGenerateReport = useCallback(() => {
    startTransition(async () => {
      // Clean up previous download URL
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
        setDownloadUrl(null);
      }

      toast.info("Generando reporte...", {
        description: `Preparando el reporte de ${subTeamName}`,
        id: "generate-report",
      });

      const result = await generateSubTeamReport(subTeamId);

      if (!result.success) {
        toast.error("Error al generar reporte", {
          description: result.error,
          id: "generate-report",
        });
        return;
      }

      if (result.data) {
        // Convert base64 to blob
        const byteCharacters = atob(result.data.buffer);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: result.data.contentType });

        // Create download URL
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setDownloadFilename(result.data.filename);

        // Auto-download
        const link = document.createElement("a");
        link.href = url;
        link.download = result.data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Reporte generado", {
          description: "El archivo PDF se ha descargado automáticamente.",
          id: "generate-report",
          action: {
            label: "Descargar de nuevo",
            onClick: () => {
              const retryLink = document.createElement("a");
              retryLink.href = url;
              retryLink.download = result.data!.filename;
              retryLink.click();
            },
          },
        });
      }
    });
  }, [subTeamId, subTeamName, downloadUrl]);

  /**
   * Handle manual re-download
   */
  const handleDownload = useCallback(() => {
    if (downloadUrl && downloadFilename) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = downloadFilename;
      link.click();
    }
  }, [downloadUrl, downloadFilename]);

  // Show download button if URL is available
  if (downloadUrl) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant={variant}
          size={size}
          onClick={handleDownload}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Descargar Reporte
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGenerateReport}
          disabled={isPending}
          title="Generar nuevo reporte"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleGenerateReport}
      disabled={isPending}
      className="gap-2"
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generando...
        </>
      ) : (
        <>
          <FileText className="h-4 w-4" />
          Generar Reporte
        </>
      )}
    </Button>
  );
}

export default GenerateReportButton;
