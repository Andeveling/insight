/** biome-ignore-all lint/suspicious/noArrayIndexKey: explanation */
"use client";

import {
  AlertTriangleIcon,
  BrainIcon,
  LightbulbIcon,
  RefreshCwIcon,
  RocketIcon,
  ShieldAlertIcon,
  SparklesIcon,
  TargetIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";
import { useState, useTransition } from "react";
import { Loader } from "@/components/ai-elements/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, getDaysUntilRegenerate } from "@/lib/utils";
import { generateTeamReport } from "../_actions";
import {
  ActionPlanCard,
  DomainCoverageChart,
  InsightCard,
  RedFlagCard,
  ReportSection,
  TeamMemberCard,
} from "../_components/report-cards";
import type { TeamReport } from "../_schemas/team-report.schema";

interface TeamReportViewProps {
  team: {
    id: string;
    name: string;
    description: string | null;
    members: Array<{
      id: string;
      name: string;
      role: string | null;
      career: string | null;
      hasStrengths: boolean;
      strengths: Array<{
        rank: number;
        name: string;
        domain: string;
      }>;
    }>;
  };
  membersWithStrengthsCount: number;
  existingReport: {
    id: string;
    version: number;
    createdAt: Date;
    modelUsed: string | null;
    content: TeamReport | null;
    metadata: Record<string, unknown> | null;
  } | null;
}

export function TeamReportView({
  team,
  membersWithStrengthsCount,
  existingReport,
}: TeamReportViewProps) {
  const [isPending, startTransition] = useTransition();
  const [report] = useState<TeamReport | null>(existingReport?.content ?? null);
  const [error, setError] = useState<string | null>(null);
  const [regenerateMessage, setRegenerateMessage] = useState<string | null>(
    null
  );

  // Calcular si se puede regenerar (30 días desde la última generación)
  const daysUntilRegenerate = existingReport
    ? getDaysUntilRegenerate(existingReport.createdAt)
    : 0;
  const canRegenerate = daysUntilRegenerate === 0;

  const handleGenerate = (forceRegenerate: boolean) => {
    setError(null);
    setRegenerateMessage(null);
    startTransition(async () => {
      const result = await generateTeamReport({
        teamId: team.id,
        forceRegenerate,
      });

      if (!result.success) {
        setError(result.error ?? "Error al generar el reporte");
        return;
      }

      // Check if regeneration was blocked by policy
      if (result.fromCache && result.regenerateMessage) {
        setRegenerateMessage(result.regenerateMessage);
        return;
      }

      // Refresh page to get new report
      window.location.reload();
    });
  };

  // No members with strengths
  if (membersWithStrengthsCount === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card className="mx-auto max-w-lg text-center">
          <CardHeader>
            <CardTitle>No hay datos del equipo</CardTitle>
            <CardDescription>
              Los miembros del equipo necesitan completar su evaluación de
              fortalezas antes de generar un reporte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {team.members.length} miembros en el equipo, 0 con fortalezas
              asignadas
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-4 py-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          {/* <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
            <Link href="/dashboard/reports">
              <ArrowLeftIcon className="mr-2 size-4" />
              Back to Reports
            </Link>
          </Button> */}
          <h1 className="text-3xl font-bold tracking-tight">
            Reporte de Evaluación del Equipo
          </h1>
          <p className="text-muted-foreground">
            Análisis impulsado por IA para {team.name}
          </p>
        </div>
        {existingReport && (
          <div className="text-right text-sm text-muted-foreground">
            <p>Versión {existingReport.version}</p>
            <p>{formatDate(existingReport.createdAt)}</p>
            {existingReport.modelUsed && (
              <Badge variant="secondary" className="mt-1">
                {existingReport.modelUsed}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Team Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="size-5 text-primary" />
            {team.name}
          </CardTitle>
          {team.description && (
            <CardDescription>{team.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="rounded-lg bg-muted px-4 py-2 text-center">
              <p className="text-2xl font-bold">{team.members.length}</p>
              <p className="text-xs text-muted-foreground">Miembros</p>
            </div>
            <div className="rounded-lg bg-muted px-4 py-2 text-center">
              <p className="text-2xl font-bold">{membersWithStrengthsCount}</p>
              <p className="text-xs text-muted-foreground">Con Fortalezas</p>
            </div>
          </div>
          {membersWithStrengthsCount < team.members.length && (
            <div className="mt-4 flex items-center gap-2 text-sm text-amber-600">
              <AlertTriangleIcon className="size-4" />
              <span>
                {team.members.length - membersWithStrengthsCount} miembros no
                han completado su evaluación
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate/Regenerate Section */}
      {!report && (
        <Card>
          <CardHeader>
            <CardTitle>Genera el Reporte del Equipo</CardTitle>
            <CardDescription>
              Crea un análisis comprehensivo de la composición de tu equipo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              El reporte se genera con GPT-4o de OpenAI. Solo puedes regenerar
              cada 30 días o si cambian las fortalezas del equipo.
            </p>

            {error && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {isPending && (
              <div className="flex items-center gap-3 rounded-lg bg-primary/5 px-4 py-3">
                <Loader size={20} />
                <div>
                  <p className="font-medium text-sm">
                    Analizando composición del equipo...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Esto puede tomar 60-90 segundos
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={() => handleGenerate(false)}
              disabled={isPending}
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader size={16} className="mr-2" />
                  Generando...
                </>
              ) : (
                <>
                  <SparklesIcon className="mr-2 size-4" />
                  Generar Reporte del Equipo
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Report Content */}
      {report && (
        <>
          {/* Regenerate Option */}
          <div className="flex flex-col gap-2 rounded-lg border bg-muted/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">
                ¿Cambió la composición del equipo?
              </p>
              <p className="text-xs text-muted-foreground">
                Solo puedes regenerar cada 30 días o si cambian las fortalezas.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {regenerateMessage && (
                <p className="text-xs text-amber-600">{regenerateMessage}</p>
              )}
              {!canRegenerate && (
                <p className="text-xs text-muted-foreground">
                  Disponible en {daysUntilRegenerate} día
                  {daysUntilRegenerate !== 1 ? "s" : ""}
                </p>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerate(true)}
                disabled={isPending || !canRegenerate}
              >
                {isPending ? (
                  <Loader size={14} />
                ) : (
                  <RefreshCwIcon className="size-4" />
                )}
                <span className="ml-2">Regenerar</span>
              </Button>
            </div>
          </div>

          {/* Executive Summary */}
          <Card className="border-blue-500/20 bg-linear-to-br from-blue-500/5 to-transparent">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-blue-500/30">
                  {report.summary.teamArchetype}
                </Badge>
              </div>
              <CardTitle className="text-xl">
                {report.summary.headline}
              </CardTitle>
              <CardDescription>
                {report.summary.memberCount} miembros analizados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90 whitespace-pre-line">
                {report.summary.overview}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-green-500/10 px-4 py-3">
                  <p className="font-medium text-sm text-green-600 flex items-center gap-2">
                    <ZapIcon className="size-4" />
                    Superpoder del Equipo
                  </p>
                  <p className="text-sm text-foreground/80">
                    {report.summary.superpower}
                  </p>
                </div>
                <div className="rounded-lg bg-amber-500/10 px-4 py-3">
                  <p className="font-medium text-sm text-amber-600 flex items-center gap-2">
                    <TargetIcon className="size-4" />
                    Desafío Principal
                  </p>
                  <p className="text-sm text-foreground/80">
                    {report.summary.primaryChallenge}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Culture Map */}
          <ReportSection
            title="Mapa de Cultura del Equipo"
            description="La posición de tu equipo en el cuadrante cultural"
            icon={<BrainIcon className="size-10" />}
            defaultOpen={false}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Cultura {report.cultureMap.culture}
                      <span className="text-lg">
                        {getCultureEmoji(report.cultureMap.culture)}
                      </span>
                    </CardTitle>
                    <CardDescription>
                      {report.cultureMap.cultureEs}
                    </CardDescription>
                  </div>
                  <div className="text-right text-sm">
                    <p>
                      Energía: {report.cultureMap.energyAxis.action}% Acción /{" "}
                      {report.cultureMap.energyAxis.reflection}% Reflexión
                    </p>
                    <p>
                      Orientación: {report.cultureMap.orientationAxis.results}%
                      Resultados / {report.cultureMap.orientationAxis.people}%
                      Personas
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground/90">
                  {report.cultureMap.description}
                </p>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
                    Implicaciones
                  </p>
                  <ul className="space-y-1">
                    {report.cultureMap.implications.map((impl, i) => (
                      <li
                        key={i}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-primary">•</span>
                        {impl}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </ReportSection>

          {/* Domain Coverage */}
          <ReportSection
            title="Cobertura de Dominios"
            description="Distribución de fortalezas en los cuatro dominios"
            icon={<TargetIcon className="size-10" />}
            defaultOpen={false}
          >
            <DomainCoverageChart domains={report.domainCoverage} />
          </ReportSection>

          {/* Member Summaries */}
          <ReportSection
            title="Miembros del Equipo"
            description="Contribuciones individuales a la dinámica del equipo"
            icon={<UsersIcon className="size-10" />}
            defaultOpen={false}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {report.memberSummaries.map((member) => (
                <TeamMemberCard
                  key={member.memberId}
                  name={member.memberName}
                  role={member.role}
                  topStrengths={member.topStrengths}
                  primaryDomain={member.primaryDomain}
                  uniqueContribution={member.uniqueContribution}
                />
              ))}
            </div>
          </ReportSection>

          {/* Top Synergies */}
          <ReportSection
            title="Sinergias del Equipo"
            description="Mejores asociaciones de colaboración en tu equipo"
            icon={<SparklesIcon className="size-10" />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {report.topSynergies.map((synergy, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {synergy.pair[0]} + {synergy.pair[1]}
                      </CardTitle>
                      <Badge
                        variant={
                          synergy.synergyScore === "exceptional"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {synergy.synergyScore}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {synergy.complementaryStrengths.map((s) => (
                        <Badge key={s} variant="outline">
                          {s}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Ideal para:
                    </p>
                    <ul className="text-sm text-muted-foreground">
                      {synergy.potentialProjects.slice(0, 2).map((p, j) => (
                        <li key={j}>• {p}</li>
                      ))}
                    </ul>
                    {synergy.watchOut && (
                      <p className="text-xs text-amber-600">
                        ⚠️ {synergy.watchOut}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ReportSection>

          {/* Capability Gaps */}
          {report.capabilityGaps.length > 0 && (
            <ReportSection
              title="Brechas de Capacidad"
              description="Áreas donde el equipo podría beneficiarse de fortalezas adicionales"
              icon={<AlertTriangleIcon className="size-10" />}
              defaultOpen={false}
            >
              <div className="grid gap-4 md:grid-cols-2">
                {report.capabilityGaps.map((gap, i) => (
                  <Card key={i} className="border-l-4 border-l-amber-500">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{gap.area}</CardTitle>
                        <Badge
                          className={
                            gap.impact === "critical"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : gap.impact === "high"
                              ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                              : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                          }
                        >
                          Impacto {gap.impact}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {gap.currentCoverage}
                      </p>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase">
                          Recomendaciones
                        </p>
                        <ul className="text-sm space-y-1 mt-1">
                          {gap.recommendations.map((rec, j) => (
                            <li key={j} className="text-muted-foreground">
                              <Badge variant="outline" className="mr-2 text-xs">
                                {rec.type}
                              </Badge>
                              {rec.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ReportSection>
          )}

          {/* Insights */}
          <ReportSection
            title="Insights Clave"
            description="Oportunidades para el crecimiento e impacto del equipo"
            icon={<LightbulbIcon className="size-10" />}
            defaultOpen={false}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {report.insights.map((insight, i) => (
                <InsightCard
                  key={i}
                  title={insight.title}
                  description={insight.description}
                  actionItems={insight.actionItems}
                />
              ))}
            </div>
          </ReportSection>

          {/* Red Flags */}
          <ReportSection
            title="Banderas Rojas y Riesgos"
            description="Señales de advertencia a tener en cuenta como equipo"
            icon={<ShieldAlertIcon className="size-10" />}
            defaultOpen={false}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {report.redFlags.map((redFlag, i) => (
                <RedFlagCard
                  key={i}
                  title={redFlag.title}
                  description={redFlag.description}
                  severity={redFlag.severity}
                  mitigation={redFlag.mitigation}
                />
              ))}
            </div>
          </ReportSection>

          {/* Recommended Rituals */}
          <ReportSection
            title="Rituales de Equipo Recomendados"
            description="Prácticas para mejorar la efectividad del equipo"
            icon={<SparklesIcon className="size-10" />}
            defaultOpen={false}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {report.recommendedRituals.map((ritual, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{ritual.name}</CardTitle>
                      <Badge variant="outline">{ritual.frequency}</Badge>
                    </div>
                    <CardDescription>{ritual.purpose}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Duración: {ritual.duration} · Objetivo:{" "}
                      {ritual.targetDomain}
                    </p>
                    <ol className="text-sm space-y-1">
                      {ritual.steps.map((step, j) => (
                        <li key={j} className="text-muted-foreground">
                          {j + 1}. {step}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ReportSection>

          {/* Action Plan */}
          <ReportSection
            title="Plan de Acción del Equipo"
            description="La hoja de ruta de tu equipo para el próximo trimestre"
            icon={<RocketIcon className="size-10" />}
            defaultOpen={false}
          >
            <ActionPlanCard
              immediate={report.actionPlan.immediate}
              shortTerm={report.actionPlan.shortTerm}
              longTerm={report.actionPlan.longTerm}
            />
            {report.actionPlan.hiringPriorities &&
              report.actionPlan.hiringPriorities.length > 0 && (
                <Card className="mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Prioridades de Contratación
                    </CardTitle>
                    <CardDescription>
                      Fortalezas a priorizar en tus próximas contrataciones
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {report.actionPlan.hiringPriorities.map((strength) => (
                        <Badge key={strength} variant="default">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
          </ReportSection>
        </>
      )}
    </div>
  );
}

function getCultureEmoji(culture: string): string {
  switch (culture) {
    case "Execution":
      return "🚀";
    case "Influence":
      return "✨";
    case "Strategy":
      return "🧠";
    case "Cohesion":
      return "💚";
    default:
      return "📊";
  }
}
