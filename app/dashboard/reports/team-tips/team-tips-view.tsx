/** biome-ignore-all lint/suspicious/noArrayIndexKey: explanation */
"use client";

import {
  ArrowLeftIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  HeartHandshakeIcon,
  LightbulbIcon,
  MessageCircleIcon,
  RefreshCwIcon,
  SparklesIcon,
  TargetIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";
import Link from "next/link";
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/cn";
import { formatDate, getDaysUntilRegenerate } from "@/lib/utils";
import { generateTeamTips } from "../_actions/generate-team-tips.action";
import type { TeamTipsReport } from "../_schemas/team-tips.schema";

interface TeamTipsViewProps {
  user: {
    id: string;
    name: string;
    email: string;
    profile: {
      career: string | null;
      age: number | null;
      description: string | null;
    } | null;
    strengths: Array<{
      rank: number;
      name: string;
      nameEs: string;
      domain: string;
    }>;
  };
  team: {
    id: string;
    name: string;
    description: string | null;
    role: string | null;
  } | null;
  teammates: Array<{
    id: string;
    name: string;
    role: string | null;
    career: string | null;
    strengths: Array<{
      rank: number;
      name: string;
      nameEs: string;
      domain: string;
    }>;
  }>;
  hasStrengths: boolean;
  existingReport: {
    id: string;
    version: number;
    createdAt: Date;
    modelUsed: string | null;
    content: TeamTipsReport | null;
    metadata: Record<string, unknown> | null;
  } | null;
}

export function TeamTipsView({
  user,
  team,
  teammates,
  hasStrengths,
  existingReport,
}: TeamTipsViewProps) {
  const [isPending, startTransition] = useTransition();
  const [report] = useState<TeamTipsReport | null>(
    existingReport?.content ?? null
  );
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
    if (!team) return;

    setError(null);
    setRegenerateMessage(null);
    startTransition(async () => {
      const result = await generateTeamTips({
        userId: user.id,
        teamId: team.id,
        forceRegenerate,
      });

      if (!result.success) {
        setError(result.error ?? "Error al generar el reporte");
        return;
      }

      if (result.fromCache && result.regenerateMessage) {
        setRegenerateMessage(result.regenerateMessage);
        return;
      }

      window.location.reload();
    });
  };

  // No team assigned
  if (!team) {
    return (
      <div className="container mx-auto py-8">
        <Card className="mx-auto max-w-lg border-dashed text-center shadow-none">
          <CardHeader>
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <UsersIcon className="size-6 text-muted-foreground" />
            </div>
            <CardTitle>Sin Equipo Asignado</CardTitle>
            <CardDescription>
              Necesitas pertenecer a un equipo para generar este reporte de
              consejos de relacionamiento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/team">Ver Mi Equipo</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No strengths assigned
  if (!hasStrengths) {
    return (
      <div className="container mx-auto py-8">
        <Card className="mx-auto max-w-lg border-dashed text-center shadow-none">
          <CardHeader>
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <SparklesIcon className="size-6 text-muted-foreground" />
            </div>
            <CardTitle>Sin Fortalezas Asignadas</CardTitle>
            <CardDescription>
              Necesitas completar tu evaluación de fortalezas antes de generar
              este reporte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/profile">Completar Evaluación</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No teammates with strengths
  if (teammates.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card className="mx-auto max-w-lg border-dashed text-center shadow-none">
          <CardHeader>
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <UsersIcon className="size-6 text-muted-foreground" />
            </div>
            <CardTitle>Equipo Sin Perfiles</CardTitle>
            <CardDescription>
              Tus compañeros de equipo aún no tienen fortalezas asignadas. Este
              reporte necesita conocer sus perfiles para generar consejos
              personalizados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/dashboard/team">Ver Mi Equipo</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-4 py-4">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary/10 via-primary/5 to-background p-8 md:p-12">
        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="-ml-2 mb-2 text-muted-foreground hover:text-foreground"
            >
              <Link href="/dashboard/reports">
                <ArrowLeftIcon className="mr-2 size-4" />
                Volver a Reportes
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Consejos de Equipo
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Guía personalizada para potenciar tu relación con{" "}
              <span className="font-semibold text-foreground">{team.name}</span>
            </p>
          </div>
          {existingReport && (
            <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground">
              <Badge
                variant="outline"
                className="bg-background/50 backdrop-blur-sm"
              >
                Versión {existingReport.version}
              </Badge>
              <span className="text-xs">
                Generado el {formatDate(existingReport.createdAt)}
              </span>
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 size-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 size-64 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      {/* User Profile Summary */}
      <Card className="border-none bg-muted/30 shadow-none">
        <CardContent className="flex flex-col items-center justify-between gap-4 p-6 md:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
              <SparklesIcon className="size-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Tus Fortalezas Activas</h3>
              <p className="text-sm text-muted-foreground">
                Base para el análisis de compatibilidad
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 md:justify-end">
            {user.strengths.slice(0, 5).map((s) => (
              <Badge
                key={s.name}
                variant="secondary"
                className="bg-background px-3 py-1 shadow-sm"
              >
                #{s.rank} {s.nameEs}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate/Regenerate Section */}
      {!report && (
        <Card className="overflow-hidden border-primary/20 shadow-lg">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-50" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <HeartHandshakeIcon className="size-6 text-primary" />
              Genera tu Reporte de Consejos
            </CardTitle>
            <CardDescription className="text-base">
              La IA analizará tus fortalezas y las de cada miembro de tu equipo
              para generar consejos personalizados de comunicación,
              colaboración, y recomendaciones de libros.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
                {error}
              </div>
            )}
            <Button
              onClick={() => handleGenerate(false)}
              disabled={isPending}
              size="lg"
              className="w-full gap-2 text-base md:w-auto"
            >
              {isPending ? (
                <>
                  <Loader className="size-5" />
                  Analizando dinámicas de equipo...
                </>
              ) : (
                <>
                  <SparklesIcon className="size-5" />
                  Generar Consejos Personalizados
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Report Content */}
      {report && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Personal Summary */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UsersIcon className="size-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                Tu Rol en el Equipo
              </h2>
            </div>

            <Card className="overflow-hidden border-l-4 border-l-primary">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-xl">
                  {report.personalSummary.headline}
                </CardTitle>
                <CardDescription>
                  Análisis de tu impacto en {report.personalSummary.teamName}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 p-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Fortalezas en Contexto
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {report.personalSummary.yourStrengthsInTeamContext}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Rol Natural</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {report.personalSummary.naturalRole}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">
                    Oportunidad de Crecimiento
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {report.personalSummary.growthOpportunity}
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Member Tips */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <MessageCircleIcon className="size-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                Consejos por Compañero
              </h2>
            </div>

            <div className="grid gap-6">
              {report.memberTips.map((member) => (
                <MemberTipCard key={member.memberId} member={member} />
              ))}
            </div>
          </section>

          {/* Communication Strategies */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                <LightbulbIcon className="size-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                Estrategias de Comunicación
              </h2>
            </div>

            <Card>
              <CardContent className="grid gap-8 p-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <UsersIcon className="size-4 text-muted-foreground" />
                    <h4 className="font-semibold">En Reuniones</h4>
                  </div>
                  <ul className="space-y-2">
                    {report.communicationStrategies.inMeetings.map((tip, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/50" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <TargetIcon className="size-4 text-muted-foreground" />
                    <h4 className="font-semibold">En Conflictos</h4>
                  </div>
                  <ul className="space-y-2">
                    {report.communicationStrategies.inConflicts.map(
                      (tip, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/50" />
                          {tip}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <SparklesIcon className="size-4 text-muted-foreground" />
                    <h4 className="font-semibold">En Celebraciones</h4>
                  </div>
                  <ul className="space-y-2">
                    {report.communicationStrategies.inCelebrations.map(
                      (tip, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/50" />
                          {tip}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <MessageCircleIcon className="size-4 text-muted-foreground" />
                    <h4 className="font-semibold">Día a Día</h4>
                  </div>
                  <ul className="space-y-2">
                    {report.communicationStrategies.dailyInteractions.map(
                      (tip, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/50" />
                          {tip}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Team Considerations */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <TargetIcon className="size-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                Consideraciones del Equipo
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {report.teamConsiderations.map((consideration, i) => (
                <Card
                  key={i}
                  className="flex flex-col transition-all hover:shadow-md"
                >
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-lg">
                      {consideration.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {consideration.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-4 pt-6">
                    <div>
                      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Cuándo aplicar
                      </span>
                      <p className="text-sm text-foreground">
                        {consideration.whenToApply}
                      </p>
                    </div>
                    <div className="mt-auto">
                      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Acciones Clave
                      </span>
                      <ul className="space-y-1">
                        {consideration.actionItems.map((item, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Book Recommendations */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <BookOpenIcon className="size-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                Biblioteca Recomendada
              </h2>
            </div>

            {/* Personal Books */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                  1
                </span>
                Lecturas para tu Crecimiento
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {report.personalBooks.map((book, i) => (
                  <BookCard key={i} book={book} variant="personal" />
                ))}
              </div>
            </div>

            <Separator />

            {/* Team Books */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                  2
                </span>
                Lecturas para Compartir
              </h3>
              <p className="text-sm text-muted-foreground">
                Libros ideales para leer en conjunto y generar discusiones de
                equipo
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {report.teamBooks.map((book, i) => (
                  <BookCard key={i} book={book} variant="team" />
                ))}
              </div>
            </div>
          </section>

          {/* Action Plan */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                <CheckCircle2Icon className="size-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                Plan de Acción
              </h2>
            </div>

            <Card className="bg-linear-to-br from-background to-muted/30">
              <CardContent className="grid gap-8 p-6 md:grid-cols-3">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-primary/20 pb-2">
                    <span className="font-bold text-primary">Esta Semana</span>
                  </div>
                  <ul className="space-y-3">
                    {report.actionPlan.thisWeek.map((action, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
                          <span className="text-xs font-bold text-primary">
                            {i + 1}
                          </span>
                        </div>
                        <span className="text-muted-foreground">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-primary/20 pb-2">
                    <span className="font-bold text-primary">Este Mes</span>
                  </div>
                  <ul className="space-y-3">
                    {report.actionPlan.thisMonth.map((action, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
                          <span className="text-xs font-bold text-primary">
                            {i + 1}
                          </span>
                        </div>
                        <span className="text-muted-foreground">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-primary/20 pb-2">
                    <span className="font-bold text-primary">
                      Hábito Continuo
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {report.actionPlan.ongoing.map((action, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
                          <span className="text-xs font-bold text-primary">
                            {i + 1}
                          </span>
                        </div>
                        <span className="text-muted-foreground">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Regenerate Section */}
          <div className="flex justify-center py-8">
            <div className="w-full max-w-2xl space-y-4 text-center">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
                  {error}
                </div>
              )}
              {regenerateMessage && (
                <div className="rounded-lg bg-yellow-500/10 p-4 text-yellow-600 dark:text-yellow-400">
                  {regenerateMessage}
                </div>
              )}

              <div className="flex flex-col items-center gap-4 rounded-2xl border bg-muted/30 p-6">
                <div className="space-y-1">
                  <h3 className="font-semibold">¿Cambios en el equipo?</h3>
                  <p className="text-sm text-muted-foreground">
                    {!canRegenerate
                      ? `Podrás actualizar este reporte en ${daysUntilRegenerate} día${
                          daysUntilRegenerate !== 1 ? "s" : ""
                        }.`
                      : "Si han cambiado los miembros o sus fortalezas, genera un nuevo análisis."}
                  </p>
                </div>

                <Button
                  variant="outline"
                  onClick={() => handleGenerate(true)}
                  disabled={isPending || !canRegenerate}
                  className="gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader className="size-4" />
                      Regenerando...
                    </>
                  ) : (
                    <>
                      <RefreshCwIcon className="size-4" />
                      Regenerar Análisis
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

interface MemberTipCardProps {
  member: TeamTipsReport["memberTips"][number];
  index: number;
}

function MemberTipCard({ member }: Omit<MemberTipCardProps, "index">) {
  const compatibilityColors = {
    high: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900",
    medium:
      "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900",
    low: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900",
  };

  const compatibilityLabels = {
    high: "Alta Sinergia",
    medium: "Compatibilidad Media",
    low: "Atención Requerida",
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-background shadow-sm ring-1 ring-border">
              <span className="text-lg font-bold text-primary">
                {member.memberName.charAt(0)}
              </span>
            </div>
            <div>
              <CardTitle className="text-lg">{member.memberName}</CardTitle>
              {member.memberRole && (
                <CardDescription>{member.memberRole}</CardDescription>
              )}
            </div>
          </div>

          <Badge
            variant="outline"
            className={cn(
              "w-fit px-3 py-1 text-sm font-medium",
              compatibilityColors[member.relationshipDynamics.compatibility]
            )}
          >
            {compatibilityLabels[member.relationshipDynamics.compatibility]}
          </Badge>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {member.theirTopStrengths.map((strength) => (
            <Badge
              key={strength}
              variant="secondary"
              className="bg-background/80 text-xs font-normal"
            >
              {strength}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        {/* Left Column: Dynamics */}
        <div className="space-y-6">
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <ThumbsUpIcon className="size-4 text-green-600" />
              Puntos de Conexión
            </h4>
            <ul className="space-y-2">
              {member.relationshipDynamics.synergies.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-green-500/50" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <ThumbsDownIcon className="size-4 text-red-600" />
              Posibles Roces
            </h4>
            <ul className="space-y-2">
              {member.relationshipDynamics.potentialFrictions.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-red-500/50" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Communication & Tips */}
        <div className="space-y-6 rounded-xl bg-muted/30 p-4">
          <div>
            <h4 className="mb-2 text-sm font-semibold">
              Estilo de Comunicación
            </h4>
            <p className="text-sm italic text-muted-foreground">
              &quot;{member.communicationStyle.preferredApproach}&quot;
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h5 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
                <CheckCircle2Icon className="size-3.5" />
                Hacer
              </h5>
              <ul className="space-y-1">
                {member.communicationStyle.doList.map((item, i) => (
                  <li key={i} className="text-xs text-muted-foreground">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                <XCircleIcon className="size-3.5" />
                Evitar
              </h5>
              <ul className="space-y-1">
                {member.communicationStyle.dontList.map((item, i) => (
                  <li key={i} className="text-xs text-muted-foreground">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div>
            <h4 className="mb-2 text-sm font-semibold">
              Mejores Proyectos Juntos
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {member.projectTypes.map((type, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="bg-background text-xs"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BookCardProps {
  book: TeamTipsReport["personalBooks"][number];
  variant: "personal" | "team";
}

function BookCard({ book, variant }: BookCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-md">
      <div className="h-2 w-full bg-linear-to-r from-primary/40 to-primary/10" />
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-lg leading-tight">
          {book.title}
        </CardTitle>
        <CardDescription className="font-medium text-foreground/80">
          {book.author}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-sm text-muted-foreground">{book.whyRecommended}</p>

        <div className="mt-auto space-y-3 rounded-lg bg-muted/30 p-3">
          <div>
            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Aprendizajes Clave
            </span>
            <ul className="space-y-1">
              {book.keyTakeaways.slice(0, 2).map((takeaway, i) => (
                <li key={i} className="text-xs text-muted-foreground">
                  • {takeaway}
                </li>
              ))}
            </ul>
          </div>

          {variant === "team" && (
            <div>
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-primary/80">
                Aplicación al Equipo
              </span>
              <p className="text-xs text-muted-foreground">
                {book.applicationToTeam}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
