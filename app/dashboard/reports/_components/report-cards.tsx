/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";

import {
  AlertTriangleIcon,
  ChevronDownIcon,
  LightbulbIcon,
  RocketIcon,
  ShieldAlertIcon,
  SparklesIcon,
  TargetIcon,
  UsersIcon,
  CheckCircle2Icon,
  CalendarIcon,
  ClockIcon,
  FlagIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

// ============================================================
// Report Section Components
// ============================================================

export interface ReportSectionProps extends ComponentProps<"section"> {
  title: string;
  description?: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
}

export function ReportSection({
  title,
  description,
  icon,
  defaultOpen = true,
  children,
  className,
  ...props
}: ReportSectionProps) {
  return (
    <Collapsible defaultOpen={defaultOpen} asChild>
      <section
        className={cn(
          "group/section rounded-2xl border border-transparent transition-all duration-500 ease-in-out",
          "data-[state=open]:border-primary/10 data-[state=open]:bg-muted/30 data-[state=open]:p-3 data-[state=open]:shadow-sm",
          className
        )}
        {...props}
      >
        <CollapsibleTrigger className="group/trigger flex w-full items-center justify-between outline-none">
          <Card
            className={cn(
              "w-full border transition-all duration-300 p-0 h-full",
              "hover:border-primary/50 hover:shadow-md",
              "group-data-[state=open]/section:border-primary/20 group-data-[state=open]/section:shadow-sm"
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6">
              <div className="flex items-center gap-4">
                {icon && (
                  <div
                    className={cn(
                      "flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20 transition-colors duration-300",
                      "group-data-[state=open]/section:bg-primary group-data-[state=open]/section:text-primary-foreground group-data-[state=open]/section:ring-primary"
                    )}
                  >
                    {icon}
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <CardTitle className="text-xl font-bold tracking-tight text-foreground transition-colors group-data-[state=open]/section:text-primary">
                    {title}
                  </CardTitle>
                  {description && (
                    <CardDescription className="mt-1 text-base font-medium text-muted-foreground">
                      {description}
                    </CardDescription>
                  )}
                </div>
              </div>
              <div
                className={cn(
                  "rounded-full border bg-background p-2 shadow-sm transition-all duration-300 text-muted-foreground",
                  "group-data-[state=open]/trigger:rotate-180 group-data-[state=open]/trigger:border-primary group-data-[state=open]/trigger:bg-primary group-data-[state=open]/trigger:text-primary-foreground"
                )}
              >
                <ChevronDownIcon className="size-5" />
              </div>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-6 px-1 pb-2 animate-in slide-in-from-top-4 fade-in duration-500">
          {children}
        </CollapsibleContent>
      </section>
    </Collapsible>
  );
}

// ============================================================
// Insight Card Component
// ============================================================

export interface InsightCardProps {
  title: string;
  description: string;
  actionItems?: string[];
  variant?: "insight" | "opportunity";
}

export function InsightCard({
  title,
  description,
  actionItems,
  variant = "insight",
}: InsightCardProps) {
  const isInsight = variant === "insight";

  return (
    <Card
      className={cn(
        "overflow-hidden border-l-4 transition-all hover:shadow-md",
        isInsight
          ? "border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/10"
          : "border-l-purple-500 bg-purple-50/30 dark:bg-purple-950/10"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
              isInsight
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
            )}
          >
            {isInsight ? (
              <LightbulbIcon className="size-4" />
            ) : (
              <SparklesIcon className="size-4" />
            )}
          </div>
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold leading-tight">
              {title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        {actionItems && actionItems.length > 0 && (
          <div className="rounded-lg bg-background/50 p-3 ring-1 ring-border/50">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <RocketIcon className="size-3" />
              Acciones Recomendadas
            </p>
            <ul className="space-y-2">
              {actionItems.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-foreground/80"
                >
                  <CheckCircle2Icon className="mt-0.5 size-3.5 shrink-0 text-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================
// Red Flag Card Component
// ============================================================

export interface RedFlagCardProps {
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  mitigation?: string[];
}

const severityConfig = {
  low: {
    color: "border-l-yellow-500",
    bg: "bg-yellow-50/50 dark:bg-yellow-950/10",
    badge:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    icon: "text-yellow-600 dark:text-yellow-500",
    label: "Bajo",
  },
  medium: {
    color: "border-l-orange-500",
    bg: "bg-orange-50/50 dark:bg-orange-950/10",
    badge:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    icon: "text-orange-600 dark:text-orange-500",
    label: "Medio",
  },
  high: {
    color: "border-l-red-500",
    bg: "bg-red-50/50 dark:bg-red-950/10",
    badge:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    icon: "text-red-600 dark:text-red-500",
    label: "Alto",
  },
} as const;

export function RedFlagCard({
  title,
  description,
  severity,
  mitigation,
}: RedFlagCardProps) {
  const config = severityConfig[severity];

  return (
    <Card
      className={cn(
        "border-l-4 transition-all hover:shadow-md",
        config.color,
        config.bg
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "mt-0.5 rounded-full bg-background p-1.5 shadow-sm ring-1 ring-border/10",
                config.icon
              )}
            >
              {severity === "high" ? (
                <ShieldAlertIcon className="size-5" />
              ) : (
                <AlertTriangleIcon className="size-5" />
              )}
            </div>
            <CardTitle className="text-base font-semibold leading-tight">
              {title}
            </CardTitle>
          </div>
          <Badge
            variant="outline"
            className={cn("shrink-0 font-medium", config.badge)}
          >
            Riesgo {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-sm leading-relaxed text-foreground/80">
          {description}
        </CardDescription>
        {mitigation && mitigation.length > 0 && (
          <div className="rounded-lg bg-background/60 p-3 ring-1 ring-border/50">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <TargetIcon className="size-3" />
              Estrategia de Mitigación
            </p>
            <ul className="space-y-2">
              {mitigation.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <div className="mt-1.5 size-1.5 rounded-full bg-primary/50" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================
// Strength Dynamics Card
// ============================================================

export interface StrengthDynamicsProps {
  synergies: Array<{
    strengths: string[];
    effect: string;
  }>;
  tensions?: Array<{
    strengths: string[];
    conflict: string;
    resolution: string;
  }>;
  uniqueBlend: string;
}

export function StrengthDynamicsCard({
  synergies,
  tensions,
  uniqueBlend,
}: StrengthDynamicsProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 pb-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <SparklesIcon className="size-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Dinámica de Fortalezas</CardTitle>
            <CardDescription className="mt-1 text-base font-medium text-foreground/80">
              {uniqueBlend}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="-mt-4 space-y-4 bg-background px-6 pt-6">
        {/* Synergies */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <div className="flex size-6 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <SparklesIcon className="size-3.5" />
            </div>
            <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Sinergias Clave
            </h4>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {synergies.map((synergy, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {synergy.strengths.map((s) => (
                      <Badge
                        key={s}
                        variant="secondary"
                        className="bg-background/80 shadow-sm backdrop-blur-sm"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {synergy.effect}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tensions */}
        {tensions && tensions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                <AlertTriangleIcon className="size-3.5" />
              </div>
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Tensiones a Gestionar
              </h4>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {tensions.map((tension, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-xl border border-orange-200 bg-orange-50/30 p-4 dark:border-orange-900/30 dark:bg-orange-950/10"
                >
                  <div className="relative space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {tension.strengths.map((s) => (
                        <Badge
                          key={s}
                          variant="outline"
                          className="border-orange-200 bg-orange-100/50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                      {tension.conflict}
                    </p>
                    <div className="rounded-lg bg-background/60 p-2.5 text-sm text-muted-foreground shadow-sm ring-1 ring-orange-100 dark:ring-orange-900/20">
                      <span className="font-semibold text-orange-700 dark:text-orange-400">
                        Resolución:{" "}
                      </span>
                      {tension.resolution}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================
// Action Plan Card
// ============================================================

export interface ActionPlanProps {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
}

export function ActionPlanCard({
  immediate,
  shortTerm,
  longTerm,
}: ActionPlanProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-linear-to-r from-primary/5 to-transparent pb-8">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
            <RocketIcon className="size-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Plan de Acción</CardTitle>
            <CardDescription>
              Tu hoja de ruta personalizada: de la conciencia a la acción
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="-mt-4 grid gap-6 bg-background px-6 pt-6 md:grid-cols-3">
        {/* This Week */}
        <div className="group relative space-y-4 rounded-xl border bg-card p-4 transition-all hover:shadow-md">
          <div className="absolute top-0 right-0 size-16 -translate-y-1/2 translate-x-1/2 rounded-full bg-green-500/5 blur-2xl transition-all group-hover:bg-green-500/10" />
          <div className="flex items-center gap-2 border-b border-green-100 pb-2 dark:border-green-900/30">
            <ClockIcon className="size-4 text-green-600 dark:text-green-400" />
            <h4 className="font-bold text-sm text-green-700 dark:text-green-400">
              Esta Semana
            </h4>
          </div>
          <ul className="space-y-3">
            {immediate.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-muted-foreground"
              >
                <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-green-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* This Month */}
        <div className="group relative space-y-4 rounded-xl border bg-card p-4 transition-all hover:shadow-md">
          <div className="absolute top-0 right-0 size-16 -translate-y-1/2 translate-x-1/2 rounded-full bg-blue-500/5 blur-2xl transition-all group-hover:bg-blue-500/10" />
          <div className="flex items-center gap-2 border-b border-blue-100 pb-2 dark:border-blue-900/30">
            <CalendarIcon className="size-4 text-blue-600 dark:text-blue-400" />
            <h4 className="font-bold text-sm text-blue-700 dark:text-blue-400">
              Este Mes
            </h4>
          </div>
          <ul className="space-y-3">
            {shortTerm.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-muted-foreground"
              >
                <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* This Year */}
        <div className="group relative space-y-4 rounded-xl border bg-card p-4 transition-all hover:shadow-md">
          <div className="absolute top-0 right-0 size-16 -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-500/5 blur-2xl transition-all group-hover:bg-purple-500/10" />
          <div className="flex items-center gap-2 border-b border-purple-100 pb-2 dark:border-purple-900/30">
            <FlagIcon className="size-4 text-purple-600 dark:text-purple-400" />
            <h4 className="font-bold text-sm text-purple-700 dark:text-purple-400">
              Este Año
            </h4>
          </div>
          <ul className="space-y-3">
            {longTerm.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-muted-foreground"
              >
                <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-purple-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// Team Member Card
// ============================================================

export interface TeamMemberCardProps {
  name: string;
  role?: string;
  topStrengths: string[];
  primaryDomain: string;
  uniqueContribution: string;
}

export function TeamMemberCard({
  name,
  role,
  topStrengths,
  primaryDomain,
  uniqueContribution,
}: TeamMemberCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="group overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-4 pb-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/80 text-lg font-bold text-primary-foreground shadow-md ring-2 ring-background transition-transform group-hover:scale-105">
          {initials}
        </div>
        <div className="space-y-1">
          <CardTitle className="text-base font-bold">{name}</CardTitle>
          {role && (
            <CardDescription className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {role}
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">
            Top Fortalezas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {topStrengths.slice(0, 3).map((s, i) => (
              <Badge
                key={s}
                variant={i === 0 ? "default" : "secondary"}
                className={cn(
                  "transition-colors",
                  i === 0 && "bg-primary/90 hover:bg-primary"
                )}
              >
                {s}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
          <UsersIcon className="size-3.5 text-primary" />
          <span className="font-medium">Dominio:</span>
          <span>{primaryDomain}</span>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">
            Contribución Única
          </p>
          <p className="text-sm leading-relaxed text-foreground/90">
            {uniqueContribution}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// Domain Coverage Chart (Simple Visual)
// ============================================================

export interface DomainCoverageChartProps {
  domains: Array<{
    domain: string;
    percentage: number;
    status: "underrepresented" | "balanced" | "dominant";
  }>;
}

const domainColors = {
  Doing: "bg-red-500 shadow-red-500/20",
  Feeling: "bg-green-500 shadow-green-500/20",
  Motivating: "bg-yellow-500 shadow-yellow-500/20",
  Thinking: "bg-blue-500 shadow-blue-500/20",
} as const;

const statusTranslations = {
  underrepresented: "Subrepresentado",
  balanced: "Equilibrado",
  dominant: "Dominante",
} as const;

const statusColors = {
  underrepresented: "text-muted-foreground",
  balanced: "text-green-600 dark:text-green-400",
  dominant: "text-primary font-semibold",
} as const;

export function DomainCoverageChart({ domains }: DomainCoverageChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cobertura de Dominios</CardTitle>
        <CardDescription>
          Distribución de fortalezas en los cuatro dominios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {domains.map((d) => (
          <div key={d.domain} className="space-y-2">
            <div className="flex items-end justify-between text-sm">
              <div className="flex flex-col">
                <span className="font-bold text-foreground">{d.domain}</span>
                <span className={cn("text-xs", statusColors[d.status])}>
                  {statusTranslations[d.status]}
                </span>
              </div>
              <span className="font-mono font-medium text-muted-foreground">
                {d.percentage.toFixed(0)}%
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-secondary/50 p-0.5">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500 ease-out shadow-sm",
                  domainColors[d.domain as keyof typeof domainColors] ||
                    "bg-primary"
                )}
                style={{ width: `${Math.min(d.percentage, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
