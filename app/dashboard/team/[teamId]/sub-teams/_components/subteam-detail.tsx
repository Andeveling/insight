/**
 * SubTeam Detail
 *
 * Component displaying full sub-team information.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_components/subteam-detail
 */

import Image from "next/image";

import { MatchScoreBreakdown } from "./match-score-breakdown";
import { SubTeamActions } from "./subteam-actions";
import { getDomainColor, getScoreInfo } from "../_utils/score-helpers";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { SubTeamDetail as SubTeamDetailType } from "@/lib/types";

interface SubTeamDetailProps {
  subTeam: SubTeamDetailType;
  teamId: string;
}

export function SubTeamDetail({ subTeam, teamId }: SubTeamDetailProps) {
  const scoreInfo = getScoreInfo(subTeam.matchScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              {subTeam.name}
            </h1>
            <Badge
              variant="secondary"
              className={cn("text-sm", scoreInfo.color)}
            >
              {subTeam.matchScore !== null
                ? `${Math.round(subTeam.matchScore)}%`
                : "N/A"}
            </Badge>
          </div>
          {subTeam.description && (
            <p className="text-muted-foreground">{subTeam.description}</p>
          )}
        </div>

        {/* Actions - Client Component */}
        <SubTeamActions
          subTeamId={subTeam.id}
          subTeamName={subTeam.name}
          teamId={teamId}
          status={subTeam.status}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Project Type Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tipo de Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {subTeam.projectTypeProfile?.icon}
              </span>
              <div>
                <p className="font-medium">
                  {subTeam.projectTypeProfile?.nameEs ||
                    subTeam.projectTypeProfile?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {subTeam.projectTypeProfile?.descriptionEs ||
                    subTeam.projectTypeProfile?.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match Score Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Match Score</CardTitle>
            <CardDescription>Compatibilidad del equipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold",
                  scoreInfo.color
                )}
              >
                {subTeam.matchScore !== null
                  ? Math.round(subTeam.matchScore)
                  : "?"}
              </div>
              <div>
                <p className="font-medium">{scoreInfo.label}</p>
                <p className="text-sm text-muted-foreground">
                  {subTeam.membersDetails?.length || 0} miembros
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Estado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estado</span>
              <Badge
                variant="secondary"
                className={cn(
                  subTeam.status === "active"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {subTeam.status === "active" ? "Activo" : "Archivado"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Creado</span>
              <span className="text-sm">
                {new Date(subTeam.createdAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            {subTeam.creator && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Por</span>
                <span className="text-sm">{subTeam.creator.name}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Match Score Breakdown */}
      {subTeam.analysis && (
        <MatchScoreBreakdown
          factors={subTeam.analysis.factors}
          gaps={subTeam.analysis.gaps}
          recommendations={subTeam.analysis.recommendations}
          defaultOpen={true}
        />
      )}

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Miembros del Sub-Equipo</CardTitle>
          <CardDescription>
            {subTeam.membersDetails?.length || 0} miembros con sus fortalezas
            principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subTeam.membersDetails?.map((member) => (
              <div
                key={member.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card"
              >
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name || "Avatar"}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">
                      {member.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {member.name || "Usuario"}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {member.strengths?.slice(0, 3).map((strength) => (
                      <Badge
                        key={strength.id}
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          getDomainColor(strength.domain?.name || "")
                        )}
                      >
                        {strength.nameEs || strength.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
