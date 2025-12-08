/** biome-ignore-all lint/suspicious/noArrayIndexKey: explanation */
"use client";

import {
  ArrowLeftIcon,
  BriefcaseIcon,
  EyeIcon,
  LightbulbIcon,
  RefreshCwIcon,
  RocketIcon,
  ShieldAlertIcon,
  SparklesIcon,
  TargetIcon,
  UsersIcon,
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
import { generateIndividualReport } from "../_actions";
import {
  ActionPlanCard,
  InsightCard,
  RedFlagCard,
  ReportSection,
  StrengthDynamicsCard,
} from "../_components/report-cards";
import type { IndividualReport } from "../_schemas/individual-report.schema";

interface IndividualReportViewProps {
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
    team: {
      name: string;
      role: string | null;
    } | null;
  };
  hasStrengths: boolean;
  existingReport: {
    id: string;
    version: number;
    createdAt: Date;
    modelUsed: string | null;
    content: IndividualReport | null;
    metadata: Record<string, unknown> | null;
  } | null;
}

export function IndividualReportView({
  user,
  hasStrengths,
  existingReport,
}: IndividualReportViewProps) {
  const [isPending, startTransition] = useTransition();
  const [report] = useState<IndividualReport | null>(
    existingReport?.content ?? null
  );
  const [error, setError] = useState<string | null>(null);
  const [regenerateMessage, setRegenerateMessage] = useState<string | null>(
    null
  );

  const handleGenerate = (forceRegenerate: boolean) => {
    setError(null);
    setRegenerateMessage(null);
    startTransition(async () => {
      const result = await generateIndividualReport({
        userId: user.id,
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

  // No strengths assigned
  if (!hasStrengths) {
    return (
      <div className="container mx-auto py-8">
        <Card className="mx-auto max-w-lg text-center">
          <CardHeader>
            <CardTitle>No Strengths Assigned</CardTitle>
            <CardDescription>
              You need to complete the strengths assessment before generating a
              report.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/profile">Complete Assessment</Link>
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
              Back to Reports
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Personal Strength Report
          </h1>
          <p className="text-muted-foreground">
            AI-powered analysis for {user.name}
          </p>
        </div>
        {existingReport && (
          <div className="text-right text-sm text-muted-foreground">
            <p>Versión {existingReport.version}</p>
            <p>{new Date(existingReport.createdAt).toLocaleDateString()}</p>
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
            Your Top 5 Strengths
          </CardTitle>
          {user.profile?.career && (
            <CardDescription>{user.profile.career}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {user.strengths.map((s) => (
              <Badge
                key={s.name}
                variant={s.rank === 1 ? "default" : "secondary"}
                className="px-3 py-1"
              >
                #{s.rank} {s.name} ({s.nameEs})
                <span className="ml-1 text-xs opacity-70">· {s.domain}</span>
              </Badge>
            ))}
          </div>
          {user.team && (
            <p className="mt-4 text-sm text-muted-foreground">
              Team: {user.team.name}
              {user.team.role && ` · ${user.team.role}`}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Generate/Regenerate Section */}
      {!report && (
        <Card>
          <CardHeader>
            <CardTitle>Genera tu Reporte</CardTitle>
            <CardDescription>
              Crea un análisis comprehensivo de tus fortalezas con IA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              El reporte será generado usando GPT-4o de OpenAI.
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
                  <p className="font-medium text-sm">Generando tu reporte...</p>
                  <p className="text-xs text-muted-foreground">
                    Esto puede tomar 30-60 segundos
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
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="mr-2 size-4" />
                  Generate Report
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
          <div className="flex flex-col gap-3 rounded-lg border bg-muted/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">
                ¿Quieres nuevas perspectivas?
              </p>
              <p className="text-xs text-muted-foreground">
                Solo puedes regenerar cada 30 días o si cambian tus fortalezas.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {regenerateMessage && (
                <p className="text-xs text-amber-600">{regenerateMessage}</p>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleGenerate(true)}
                disabled={isPending}
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
          <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-xl">
                {report.summary.headline}
              </CardTitle>
              <CardDescription>
                Dominant Domain: {report.summary.dominantDomain}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90 whitespace-pre-line">
                {report.summary.overview}
              </p>
              <div className="rounded-lg bg-primary/10 px-4 py-3">
                <p className="font-medium text-sm text-primary">
                  Your Unique Value
                </p>
                <p className="text-sm text-foreground/80">
                  {report.summary.uniqueValue}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Strengths Dynamics */}
          <ReportSection
            title="Strengths Dynamics"
            description="How your top 5 strengths work together"
            icon={<SparklesIcon className="size-5" />}
          >
            <StrengthDynamicsCard
              synergies={report.strengthsDynamics.synergies}
              tensions={report.strengthsDynamics.tensions}
              uniqueBlend={report.strengthsDynamics.uniqueBlend}
            />
          </ReportSection>

          {/* Career Implications */}
          <ReportSection
            title="Career Implications"
            description="Paths where your strengths create maximum impact"
            icon={<BriefcaseIcon className="size-5" />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {report.careerImplications.map((career, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {career.strengthName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        Ideal Roles
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {career.idealRoles.map((role) => (
                          <Badge key={role} variant="secondary">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        Industries
                      </p>
                      <p className="text-sm">{career.industries.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        Growth Areas
                      </p>
                      <ul className="text-sm text-muted-foreground">
                        {career.growthAreas.map((area, j) => (
                          <li key={j}>• {area}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ReportSection>

          {/* Blind Spots */}
          <ReportSection
            title="Blind Spots"
            description="Dark sides to address to avoid turning strengths into weaknesses"
            icon={<EyeIcon className="size-5" />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {report.blindSpots.map((blindSpot, i) => (
                <Card key={i} className="border-l-4 border-l-orange-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {blindSpot.strengthName}
                    </CardTitle>
                    <CardDescription>{blindSpot.darkSide}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        Triggers
                      </p>
                      <ul className="text-sm text-muted-foreground">
                        {blindSpot.triggers.map((trigger, j) => (
                          <li key={j}>• {trigger}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        Balancing Strategies
                      </p>
                      <ul className="text-sm text-muted-foreground">
                        {blindSpot.balancingStrategies.map((strategy, j) => (
                          <li key={j}>• {strategy}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ReportSection>

          {/* Best Partnerships */}
          <ReportSection
            title="Best Partnership Strengths"
            description="Ideal strengths to look for in complementary partnerships"
            icon={<UsersIcon className="size-5" />}
          >
            <div className="grid gap-4 md:grid-cols-3">
              {report.bestPartnerships.map((partnership, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Badge variant="default" className="w-fit">
                      {partnership.complementaryStrength}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {partnership.whyItWorks}
                    </p>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase">
                        Collaboration Tips
                      </p>
                      <ul className="text-sm text-muted-foreground">
                        {partnership.collaborationTips
                          .slice(0, 2)
                          .map((tip, j) => (
                            <li key={j}>• {tip}</li>
                          ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ReportSection>

          {/* Insights */}
          <ReportSection
            title="Key Insights"
            description="Opportunities for growth and impact"
            icon={<LightbulbIcon className="size-5" />}
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
            title="Red Flags & Risks"
            description="Warning signs to watch for"
            icon={<ShieldAlertIcon className="size-5" />}
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

          {/* Action Plan */}
          <ReportSection
            title="Action Plan"
            description="Your roadmap from awareness to action"
            icon={<RocketIcon className="size-5" />}
          >
            <ActionPlanCard
              immediate={report.actionPlan.immediate}
              shortTerm={report.actionPlan.shortTerm}
              longTerm={report.actionPlan.longTerm}
            />
          </ReportSection>

          {/* Development Strategies */}
          <ReportSection
            title="Development Strategies"
            description="How to develop your strengths further"
            icon={<TargetIcon className="size-5" />}
            defaultOpen={false}
          >
            <div className="space-y-4">
              {report.developmentStrategies.map((strategy, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {strategy.strengthName}
                      </CardTitle>
                      <Badge
                        variant={
                          strategy.currentLevel === "mastery"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {strategy.currentLevel}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
                        Next 30 Days
                      </p>
                      <ul className="text-sm space-y-1">
                        {strategy.shortTermActions.map((action, j) => (
                          <li key={j} className="text-muted-foreground">
                            • {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
                        6-12 Months
                      </p>
                      <ul className="text-sm space-y-1">
                        {strategy.longTermGoals.map((goal, j) => (
                          <li key={j} className="text-muted-foreground">
                            • {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
                        Resources
                      </p>
                      <ul className="text-sm space-y-1">
                        {strategy.resources.map((resource, j) => (
                          <li key={j} className="text-muted-foreground">
                            • {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ReportSection>
        </>
      )}
    </div>
  );
}
