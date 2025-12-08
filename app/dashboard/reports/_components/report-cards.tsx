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
      <section className={cn("space-y-4", className)} {...props}>
        <CollapsibleTrigger className="group flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div className="text-left">
              <h3 className="font-semibold text-lg">{title}</h3>
              {description && (
                <p className="text-muted-foreground text-sm">{description}</p>
              )}
            </div>
          </div>
          <ChevronDownIcon className="size-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4">
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
  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {variant === "insight" ? (
            <LightbulbIcon className="size-4 text-primary" />
          ) : (
            <SparklesIcon className="size-4 text-primary" />
          )}
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <CardDescription className="text-foreground/80">
          {description}
        </CardDescription>
        {actionItems && actionItems.length > 0 && (
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Actions
            </p>
            <ul className="space-y-1">
              {actionItems.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <RocketIcon className="mt-0.5 size-3 shrink-0" />
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

const severityColors = {
  low: "border-l-yellow-500",
  medium: "border-l-orange-500",
  high: "border-l-destructive",
} as const;

const severityBadgeVariants = {
  low: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  medium: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
} as const;

export function RedFlagCard({
  title,
  description,
  severity,
  mitigation,
}: RedFlagCardProps) {
  return (
    <Card className={cn("border-l-4", severityColors[severity])}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {severity === "high" ? (
              <ShieldAlertIcon className="size-4 text-destructive" />
            ) : (
              <AlertTriangleIcon className="size-4 text-orange-500" />
            )}
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <Badge className={cn("border", severityBadgeVariants[severity])}>
            {severity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <CardDescription className="text-foreground/80">
          {description}
        </CardDescription>
        {mitigation && mitigation.length > 0 && (
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              Mitigation
            </p>
            <ul className="space-y-1">
              {mitigation.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <TargetIcon className="mt-0.5 size-3 shrink-0" />
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SparklesIcon className="size-5 text-primary" />
          Strengths Dynamics
        </CardTitle>
        <CardDescription>{uniqueBlend}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Synergies */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-primary">Synergies ✨</h4>
          <div className="space-y-2">
            {synergies.map((synergy, i) => (
              <div
                key={i}
                className="rounded-lg border bg-primary/5 p-3 space-y-2"
              >
                <div className="flex flex-wrap gap-1">
                  {synergy.strengths.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {synergy.effect}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tensions */}
        {tensions && tensions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-orange-500">
              Tensions to Manage ⚡
            </h4>
            <div className="space-y-2">
              {tensions.map((tension, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3 space-y-2"
                >
                  <div className="flex flex-wrap gap-1">
                    {tension.strengths.map((s) => (
                      <Badge
                        key={s}
                        className="bg-orange-500/10 text-orange-600 border-orange-500/20"
                      >
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tension.conflict}
                  </p>
                  <p className="text-sm text-foreground/80">
                    <strong>Resolution:</strong> {tension.resolution}
                  </p>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RocketIcon className="size-5 text-primary" />
          Action Plan
        </CardTitle>
        <CardDescription>
          Your personalized roadmap from awareness to action
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {/* This Week */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500" />
              <h4 className="font-medium text-sm">This Week</h4>
            </div>
            <ul className="space-y-2">
              {immediate.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-green-500">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* This Month */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-blue-500" />
              <h4 className="font-medium text-sm">This Month</h4>
            </div>
            <ul className="space-y-2">
              {shortTerm.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-blue-500">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* This Year */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-purple-500" />
              <h4 className="font-medium text-sm">This Year</h4>
            </div>
            <ul className="space-y-2">
              {longTerm.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-purple-500">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
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
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <CardTitle className="text-base">{name}</CardTitle>
            {role && (
              <CardDescription className="text-xs">{role}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1">
          {topStrengths.slice(0, 3).map((s, i) => (
            <Badge key={s} variant={i === 0 ? "default" : "secondary"}>
              {s}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <UsersIcon className="size-3" />
          <span>Primary Domain: {primaryDomain}</span>
        </div>
        <p className="text-sm text-muted-foreground">{uniqueContribution}</p>
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
  Doing: "bg-red-500",
  Feeling: "bg-green-500",
  Motivating: "bg-yellow-500",
  Thinking: "bg-blue-500",
} as const;

export function DomainCoverageChart({ domains }: DomainCoverageChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Domain Coverage</CardTitle>
        <CardDescription>
          Distribution of strengths across the four domains
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {domains.map((d) => (
          <div key={d.domain} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{d.domain}</span>
              <span className="text-muted-foreground">
                {d.percentage.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={cn(
                  "h-full transition-all",
                  domainColors[d.domain as keyof typeof domainColors] ||
                    "bg-primary"
                )}
                style={{ width: `${Math.min(d.percentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground capitalize">
              Status: {d.status}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
