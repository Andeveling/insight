/**
 * SubTeam Card
 *
 * Card component displaying sub-team summary in the list view.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_components/subteam-card
 */

import Link from "next/link";

import { getScoreColor } from "../_utils/score-helpers";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { SubTeamListItem } from "@/lib/types";

interface SubTeamCardProps {
  subTeam: SubTeamListItem;
  teamId: string;
}

export function SubTeamCard({ subTeam, teamId }: SubTeamCardProps) {
  const scoreColor = getScoreColor(subTeam.matchScore);

  return (
    <Link href={`/dashboard/team/${teamId}/sub-teams/${subTeam.id}`}>
      <Card className="h-full transition-colors hover:bg-muted/50 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 flex-1 min-w-0">
              <CardTitle className="text-base font-medium truncate">
                {subTeam.name}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{subTeam.projectType?.icon}</span>
                <span className="truncate">
                  {subTeam.projectType?.nameEs || subTeam.projectType?.name}
                </span>
              </div>
            </div>

            {/* Match Score Badge */}
            <Badge variant="secondary" className={cn("shrink-0", scoreColor)}>
              {subTeam.matchScore !== null
                ? `${Math.round(subTeam.matchScore)}%`
                : "N/A"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          {/* Member count indicator */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {Array.from({ length: Math.min(subTeam.memberCount, 4) }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground"
                  >
                    {i + 1}
                  </div>
                )
              )}
              {subTeam.memberCount > 4 && (
                <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground">
                  +{subTeam.memberCount - 4}
                </div>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {subTeam.memberCount}{" "}
              {subTeam.memberCount === 1 ? "miembro" : "miembros"}
            </span>
          </div>
        </CardContent>

        <CardFooter className="pt-3 border-t">
          <div className="flex items-center justify-between w-full text-sm">
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                subTeam.status === "active"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {subTeam.status === "active" ? "Activo" : "Archivado"}
            </span>
            <span className="text-muted-foreground">
              {new Date(subTeam.createdAt).toLocaleDateString("es-ES", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
