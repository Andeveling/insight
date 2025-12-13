/**
 * SubTeam Detail
 *
 * Component displaying full sub-team information.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_components/subteam-detail
 */

import Image from "next/image";
import Link from "next/link";

import { MatchScoreBreakdown } from "./match-score-breakdown";
import { getDomainColor, getScoreInfo } from "../_utils/score-helpers";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link
              href={`/dashboard/team/${teamId}/sub-teams/${subTeam.id}/edit`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Editar
            </Link>
          </Button>
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Archivar
          </Button>
        </div>
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
