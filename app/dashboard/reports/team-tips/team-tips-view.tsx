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
        <Card className="mx-auto max-w-lg text-center">
          <CardHeader>
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
        <Card className="mx-auto max-w-lg text-center">
          <CardHeader>
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
        <Card className="mx-auto max-w-lg text-center">
          <CardHeader>
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
    <div className="container mx-auto space-y-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
            <Link href="/dashboard/reports">
              <ArrowLeftIcon className="mr-2 size-4" />
              Volver a Reportes
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Consejos de Equipo
          </h1>
          <p className="text-muted-foreground">
            Cómo relacionarte con tu equipo - {team.name}
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

      {/* User Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon className="size-5 text-primary" />
            Tus Top 5 Fortalezas
          </CardTitle>
          {team.role && <CardDescription>Rol: {team.role}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {user.strengths.map((s) => (
              <Badge
                key={s.name}
                variant={s.rank === 1 ? "default" : "secondary"}
                className="px-3 py-1"
              >
                #{s.rank} {s.nameEs}
                <span className="ml-1 text-xs opacity-70">· {s.domain}</span>
              </Badge>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {teammates.length} compañeros con perfil completo en {team.name}
          </p>
        </CardContent>
      </Card>

      {/* Generate/Regenerate Section */}
      {!report && (
        <Card>
          <CardHeader>
            <CardTitle>Genera tu Reporte de Consejos</CardTitle>
            <CardDescription>
              La IA analizará tus fortalezas y las de cada miembro de tu equipo
              para generar consejos personalizados de comunicación,
              colaboración, y recomendaciones de libros.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
                {error}
              </div>
            )}
            <Button
              onClick={() => handleGenerate(false)}
              disabled={isPending}
              className="w-full gap-2"
            >
              {isPending ? (
                <>
                  <Loader className="size-4" />
                  Generando consejos...
                </>
              ) : (
                <>
                  <HeartHandshakeIcon className="size-4" />
                  Generar Consejos de Equipo
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Report Content */}
      {report && (
        <>
          {/* Personal Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="size-5 text-primary" />
                Tu Rol en {report.personalSummary.teamName}
              </CardTitle>
              <CardDescription>
                {report.personalSummary.headline}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Tus Fortalezas en Contexto</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {report.personalSummary.yourStrengthsInTeamContext}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Tu Rol Natural</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {report.personalSummary.naturalRole}
                </p>
              </div>
              <div>
                <h4 className="font-medium">Oportunidad de Crecimiento</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {report.personalSummary.growthOpportunity}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Member Tips */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <MessageCircleIcon className="size-6" />
              Consejos por Compañero
            </h2>
            {report.memberTips.map((member, idx) => (
              <MemberTipCard
                key={member.memberId}
                member={member}
                index={idx}
              />
            ))}
          </div>

          {/* Communication Strategies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LightbulbIcon className="size-5 text-yellow-500" />
                Estrategias de Comunicación
              </CardTitle>
              <CardDescription>
                Cómo comunicarte efectivamente en diferentes situaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium">En Reuniones</h4>
                <ul className="space-y-1">
                  {report.communicationStrategies.inMeetings.map((tip, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-medium">En Conflictos</h4>
                <ul className="space-y-1">
                  {report.communicationStrategies.inConflicts.map((tip, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-medium">En Celebraciones</h4>
                <ul className="space-y-1">
                  {report.communicationStrategies.inCelebrations.map(
                    (tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        • {tip}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-medium">Día a Día</h4>
                <ul className="space-y-1">
                  {report.communicationStrategies.dailyInteractions.map(
                    (tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        • {tip}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Team Considerations */}
          <div className="space-y-4">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <TargetIcon className="size-6" />
              Consideraciones del Equipo
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {report.teamConsiderations.map((consideration, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {consideration.title}
                    </CardTitle>
                    <CardDescription>
                      {consideration.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">
                        Cuándo aplicar:
                      </span>
                      <p className="text-sm">{consideration.whenToApply}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">
                        Acciones:
                      </span>
                      <ul className="mt-1">
                        {consideration.actionItems.map((item, j) => (
                          <li key={j} className="text-sm text-muted-foreground">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Book Recommendations */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <BookOpenIcon className="size-6" />
              Recomendaciones de Libros
            </h2>

            {/* Personal Books */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">
                📚 Libros Personales para Ti
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {report.personalBooks.map((book, i) => (
                  <BookCard key={i} book={book} variant="personal" />
                ))}
              </div>
            </div>

            <Separator />

            {/* Team Books */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">
                📖 Libros para Todo el Equipo
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Estos libros son ideales para leer en grupo y discutir juntos
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {report.teamBooks.map((book, i) => (
                  <BookCard key={i} book={book} variant="team" />
                ))}
              </div>
            </div>
          </div>

          {/* Action Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2Icon className="size-5 text-green-500" />
                Plan de Acción
              </CardTitle>
              <CardDescription>
                Pasos concretos para mejorar tu relación con el equipo
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
              <div>
                <h4 className="mb-2 font-medium text-primary">Esta Semana</h4>
                <ul className="space-y-2">
                  {report.actionPlan.thisWeek.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-primary">→</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-medium text-primary">Este Mes</h4>
                <ul className="space-y-2">
                  {report.actionPlan.thisMonth.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-primary">→</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-medium text-primary">Continuamente</h4>
                <ul className="space-y-2">
                  {report.actionPlan.ongoing.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 text-primary">→</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Regenerate Section */}
          <Card>
            <CardHeader>
              <CardTitle>Regenerar Reporte</CardTitle>
              <CardDescription>
                Puedes regenerar este reporte si tus fortalezas o las de tu
                equipo han cambiado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              {!canRegenerate && (
                <p className="text-sm text-muted-foreground">
                  Podrás regenerar en {daysUntilRegenerate} día
                  {daysUntilRegenerate !== 1 ? "s" : ""}.
                </p>
              )}
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
                    Regenerar Consejos
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </>
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

function MemberTipCard({ member, index }: MemberTipCardProps) {
  const compatibilityColors = {
    high: "bg-green-500/10 text-green-600 dark:text-green-400",
    medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    low: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  const compatibilityLabels = {
    high: "Alta Compatibilidad",
    medium: "Compatibilidad Media",
    low: "Requiere Atención",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {index + 1}
              </span>
              {member.memberName}
            </CardTitle>
            {member.memberRole && (
              <CardDescription>{member.memberRole}</CardDescription>
            )}
          </div>
          <Badge
            variant="secondary"
            className={cn(
              "ml-2",
              compatibilityColors[member.relationshipDynamics.compatibility]
            )}
          >
            {compatibilityLabels[member.relationshipDynamics.compatibility]}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-1 pt-2">
          {member.theirTopStrengths.map((strength) => (
            <Badge key={strength} variant="outline" className="text-xs">
              {strength}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Synergies & Frictions */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-2 flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
              <ThumbsUpIcon className="size-4" />
              Sinergias
            </h4>
            <ul className="space-y-1">
              {member.relationshipDynamics.synergies.map((s, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  • {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 flex items-center gap-1 text-sm font-medium text-yellow-600 dark:text-yellow-400">
              <ThumbsDownIcon className="size-4" />
              Posibles Fricciones
            </h4>
            <ul className="space-y-1">
              {member.relationshipDynamics.potentialFrictions.map((f, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  • {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator />

        {/* Communication Style */}
        <div>
          <h4 className="mb-2 font-medium">Estilo de Comunicación</h4>
          <p className="mb-3 text-sm text-muted-foreground">
            {member.communicationStyle.preferredApproach}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-green-500/5 p-3">
              <h5 className="mb-2 flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                <CheckCircle2Icon className="size-4" />
                Qué Hacer
              </h5>
              <ul className="space-y-1">
                {member.communicationStyle.doList.map((item, i) => (
                  <li key={i} className="text-sm">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-red-500/5 p-3">
              <h5 className="mb-2 flex items-center gap-1 text-sm font-medium text-red-600 dark:text-red-400">
                <XCircleIcon className="size-4" />
                Qué Evitar
              </h5>
              <ul className="space-y-1">
                {member.communicationStyle.dontList.map((item, i) => (
                  <li key={i} className="text-sm">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator />

        {/* Collaboration Tips & Project Types */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-medium">Tips de Colaboración</h4>
            <ul className="space-y-1">
              {member.collaborationTips.map((tip, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  • {tip}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium">Buenos Proyectos Juntos</h4>
            <ul className="space-y-1">
              {member.projectTypes.map((type, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  • {type}
                </li>
              ))}
            </ul>
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
    <Card className={cn(variant === "team" && "border-primary/20")}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{book.title}</CardTitle>
        <CardDescription>{book.author}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{book.whyRecommended}</p>
        <div>
          <span className="text-xs font-medium text-muted-foreground">
            Aprendizajes clave:
          </span>
          <ul className="mt-1">
            {book.keyTakeaways.map((takeaway, i) => (
              <li key={i} className="text-xs text-muted-foreground">
                • {takeaway}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded bg-muted/50 p-2">
          <span className="text-xs font-medium">Aplicación al equipo:</span>
          <p className="text-xs text-muted-foreground">
            {book.applicationToTeam}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
