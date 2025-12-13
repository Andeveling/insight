/**
 * SubTeam Actions
 *
 * Client component with action buttons for sub-team operations.
 * Separated from SubTeamDetail to allow server component rendering.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_components/subteam-actions
 */

"use client";

import { Archive, Edit2, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  archiveSubTeamAction,
  restoreSubTeamAction,
} from "../_actions/archive-subteam";
import { deleteSubTeamAction } from "../_actions/delete-subteam";
import { GenerateReportButton } from "./generate-report-button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

// ============================================================
// Types
// ============================================================

interface SubTeamActionsProps {
  subTeamId: string;
  subTeamName: string;
  teamId: string;
  status?: "active" | "archived";
}

// ============================================================
// Component
// ============================================================

export function SubTeamActions({
  subTeamId,
  subTeamName,
  teamId,
  status = "active",
}: SubTeamActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isArchived = status === "archived";

  /**
   * Handle archive action
   */
  const handleArchive = useCallback(() => {
    startTransition(async () => {
      const result = await archiveSubTeamAction(subTeamId);

      if (result.success) {
        toast.success("Sub-equipo archivado", {
          description: `"${subTeamName}" ha sido archivado exitosamente.`,
        });
        router.refresh();
      } else {
        toast.error("Error al archivar", {
          description: result.error,
        });
      }
    });
  }, [subTeamId, subTeamName, router]);

  /**
   * Handle restore action
   */
  const handleRestore = useCallback(() => {
    startTransition(async () => {
      const result = await restoreSubTeamAction(subTeamId);

      if (result.success) {
        toast.success("Sub-equipo restaurado", {
          description: `"${subTeamName}" ha sido restaurado exitosamente.`,
        });
        router.refresh();
      } else {
        toast.error("Error al restaurar", {
          description: result.error,
        });
      }
    });
  }, [subTeamId, subTeamName, router]);

  /**
   * Handle delete action
   */
  const handleDelete = useCallback(() => {
    startTransition(async () => {
      const result = await deleteSubTeamAction(subTeamId);

      if (result.success) {
        toast.success("Sub-equipo eliminado", {
          description: `"${subTeamName}" ha sido eliminado exitosamente.`,
        });
        setDeleteDialogOpen(false);
        router.push(`/dashboard/team/${teamId}/sub-teams`);
      } else {
        toast.error("Error al eliminar", {
          description: result.error,
        });
      }
    });
  }, [subTeamId, subTeamName, teamId, router]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Generate Report - Only for active sub-teams */}
      {!isArchived && (
        <GenerateReportButton subTeamId={subTeamId} subTeamName={subTeamName} />
      )}

      {/* Edit - Only for active sub-teams */}
      {!isArchived && (
        <Button variant="outline" asChild>
          <Link href={`/dashboard/team/${teamId}/sub-teams/${subTeamId}/edit`}>
            <Edit2 className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </Button>
      )}

      {/* Archive or Restore */}
      {isArchived ? (
        <Button variant="outline" onClick={handleRestore} disabled={isPending}>
          {isPending ? (
            <Spinner className="mr-2 h-4 w-4" />
          ) : (
            <RotateCcw className="mr-2 h-4 w-4" />
          )}
          Restaurar
        </Button>
      ) : (
        <Button variant="outline" onClick={handleArchive} disabled={isPending}>
          {isPending ? (
            <Spinner className="mr-2 h-4 w-4" />
          ) : (
            <Archive className="mr-2 h-4 w-4" />
          )}
          Archivar
        </Button>
      )}

      {/* Delete with confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
            disabled={isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar sub-equipo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el sub-equipo &quot;{subTeamName}&quot;
              permanentemente. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending && <Spinner className="mr-2 h-4 w-4" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SubTeamActions;
