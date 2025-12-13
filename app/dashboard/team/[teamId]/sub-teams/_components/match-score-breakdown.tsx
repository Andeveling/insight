/**
 * Match Score Breakdown Component
 *
 * Displays detailed breakdown of match score factors.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_components/match-score-breakdown
 */

"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

import { cn } from "@/lib/cn";
import type { MatchScoreFactor, StrengthGap } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { getScoreColor, SCORE_THRESHOLDS } from "../_utils/score-helpers";

/**
 * Flexible factor type that works with both calculated results and stored data
 */
interface FactorData {
  score: number;
  weight: number;
  contribution: number;
  details?: Record<string, unknown>;
}

/**
 * Factors structure that works with stored analysis data
 */
interface FactorsInput {
  strengthCoverage: FactorData | MatchScoreFactor;
  domainBalance: FactorData | MatchScoreFactor;
  cultureFit: FactorData | MatchScoreFactor;
  teamSize: FactorData | MatchScoreFactor;
  redundancyPenalty: FactorData | MatchScoreFactor;
}

interface MatchScoreBreakdownProps {
  factors: FactorsInput;
  gaps?: StrengthGap[];
  recommendations?: string[];
  className?: string;
  defaultOpen?: boolean;
}

/**
 * Factor metadata for display
 */
const FACTOR_INFO = {
  strengthCoverage: {
    name: "Cobertura de Fortalezas",
    description:
      "Qué tan bien las fortalezas del equipo cubren las ideales para el proyecto",
    icon: "🎯",
  },
  domainBalance: {
    name: "Balance de Dominios",
    description:
      "Distribución equilibrada entre Pensar, Hacer, Motivar y Sentir",
    icon: "⚖️",
  },
  cultureFit: {
    name: "Ajuste Cultural",
    description:
      "Compatibilidad con la cultura requerida por el tipo de proyecto",
    icon: "🤝",
  },
  teamSize: {
    name: "Tamaño del Equipo",
    description:
      "Penalización/bonus según cercanía al tamaño óptimo (5-7 miembros)",
    icon: "👥",
  },
  redundancyPenalty: {
    name: "Penalización por Redundancia",
    description: "Puntos restados por fortalezas duplicadas en el equipo",
    icon: "🔄",
  },
};

/**
 * Match Score Breakdown
 *
 * Collapsible section showing:
 * - Individual factor scores with weights
 * - Progress bars for each factor
 * - Tooltips with factor explanations
 */
export function MatchScoreBreakdown({
  factors,
  gaps = [],
  recommendations = [],
  className,
  defaultOpen = false,
}: MatchScoreBreakdownProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  type FactorEntry = {
    key: keyof typeof FACTOR_INFO;
    data: FactorData;
    isNegative?: boolean;
  };

  const factorEntries: FactorEntry[] = [
    { key: "strengthCoverage", data: factors.strengthCoverage },
    { key: "domainBalance", data: factors.domainBalance },
    { key: "cultureFit", data: factors.cultureFit },
    { key: "teamSize", data: factors.teamSize },
    {
      key: "redundancyPenalty",
      data: factors.redundancyPenalty,
      isNegative: true,
    },
  ];

  return (
    <Card className={cn("overflow-hidden", className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Desglose del Score</CardTitle>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Factor List */}
            <div className="space-y-3">
              {factorEntries.map(({ key, data, isNegative }) => {
                const info = FACTOR_INFO[key];
                const scoreColor = getScoreColor(data.score);

                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{info.icon}</span>
                        <span className="font-medium">{info.name}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              <p>{info.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn("font-semibold", scoreColor)}>
                          {isNegative ? `-${data.score}` : data.score}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          × {(data.weight * 100).toFixed(0)}%
                        </span>
                        <span className="text-muted-foreground">=</span>
                        <span
                          className={cn(
                            "font-medium",
                            isNegative ? "text-red-500" : scoreColor
                          )}
                        >
                          {isNegative
                            ? `-${data.contribution.toFixed(1)}`
                            : data.contribution.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          getProgressBarColor(data.score, isNegative)
                        )}
                        style={{ width: `${Math.min(data.score, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Gaps Section */}
            {gaps.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">
                  Brechas Identificadas
                </h4>
                <div className="space-y-2">
                  {gaps.slice(0, 3).map((gap, index) => (
                    <div
                      key={index}
                      className={cn(
                        "text-xs p-2 rounded-md",
                        gap.priority === "critical" &&
                          "bg-red-500/10 border border-red-500/20",
                        gap.priority === "recommended" &&
                          "bg-amber-500/10 border border-amber-500/20",
                        gap.priority === "optional" &&
                          "bg-blue-500/10 border border-blue-500/20"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "font-medium",
                            gap.priority === "critical" && "text-red-600",
                            gap.priority === "recommended" && "text-amber-600",
                            gap.priority === "optional" && "text-blue-600"
                          )}
                        >
                          {gap.strengthNameEs || gap.strengthName}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide",
                            gap.priority === "critical" &&
                              "bg-red-500/20 text-red-700",
                            gap.priority === "recommended" &&
                              "bg-amber-500/20 text-amber-700",
                            gap.priority === "optional" &&
                              "bg-blue-500/20 text-blue-700"
                          )}
                        >
                          {gap.priority === "critical"
                            ? "Crítico"
                            : gap.priority === "recommended"
                            ? "Recomendado"
                            : "Opcional"}
                        </span>
                      </div>
                    </div>
                  ))}
                  {gaps.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      Y {gaps.length - 3} brecha(s) más...
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Recomendaciones</h4>
                <ul className="space-y-1">
                  {recommendations.slice(0, 3).map((rec, index) => (
                    <li
                      key={index}
                      className="text-xs text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

/**
 * Get progress bar color based on score
 */
function getProgressBarColor(score: number, isNegative?: boolean): string {
  if (isNegative) return "bg-red-400";
  if (score >= SCORE_THRESHOLDS.EXCELLENT) return "bg-green-500";
  if (score >= SCORE_THRESHOLDS.GOOD) return "bg-blue-500";
  if (score >= SCORE_THRESHOLDS.FAIR) return "bg-amber-500";
  return "bg-red-500";
}
