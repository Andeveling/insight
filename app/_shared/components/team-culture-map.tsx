"use client";

import { cn } from "@/lib/cn";
import { getDomainColor, getDomainMetadata } from "@/lib/constants/domain-colors";
import type {
  TeamAnalytics,
  DomainType,
} from "@/app/_shared/types/strength.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TeamCultureMapProps {
  analytics: TeamAnalytics;
  className?: string;
}

export function TeamCultureMap({ analytics, className }: TeamCultureMapProps) {
  const [selectedDomain, setSelectedDomain] = useState<DomainType | null>(null);

  // Calculate the center point based on domain distribution
  const centerPoint = useMemo(() => {
    const distribution = analytics.domainDistribution;
    const doing = distribution.find((d) => d.domain === "Doing")?.percentage ?? 0;
    const feeling =
      distribution.find((d) => d.domain === "Feeling")?.percentage ?? 0;
    const motivating =
      distribution.find((d) => d.domain === "Motivating")?.percentage ?? 0;
    const thinking =
      distribution.find((d) => d.domain === "Thinking")?.percentage ?? 0;

    // Map to coordinates (0-100 range for each axis)
    // X-axis: Thinking (left) to Doing (right)
    // Y-axis: Feeling (top) to Motivating (bottom)
    const x = ((doing - thinking) / 2 + 50); // -50 to 50, normalized to 0-100
    const y = ((motivating - feeling) / 2 + 50); // -50 to 50, normalized to 0-100

    return { x, y };
  }, [analytics.domainDistribution]);

  const quadrants: Array<{
    domain: DomainType;
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  }> = [
    { domain: "Thinking", position: "top-left" },
    { domain: "Doing", position: "top-right" },
    { domain: "Feeling", position: "bottom-left" },
    { domain: "Motivating", position: "bottom-right" },
  ];

  const getDomainData = (domain: DomainType) => {
    return (
      analytics.domainDistribution.find((d) => d.domain === domain) ?? {
        domain,
        count: 0,
        percentage: 0,
        members: [],
      }
    );
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-2xl">Cultura de Fortalezas del Equipo</CardTitle>
        <p className="text-sm text-muted-foreground">
          Mapa del estilo de trabajo natural de tu equipo
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Quadrant Map */}
          <div className="relative aspect-square w-full max-w-2xl mx-auto">
            {/* Grid */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1">
              {quadrants.map(({ domain, position }) => {
                const data = getDomainData(domain);
                const metadata = getDomainMetadata(domain);
                const isSelected = selectedDomain === domain;

                return (
                  <TooltipProvider key={domain}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() =>
                            setSelectedDomain(isSelected ? null : domain)
                          }
                          className={cn(
                            "relative overflow-hidden rounded-lg transition-all duration-300 cursor-pointer",
                            "hover:scale-[1.02] hover:shadow-lg",
                            isSelected && "ring-4 ring-offset-2 scale-[1.02]"
                          )}
                          style={{
                            backgroundColor: getDomainColor(domain, "light"),
                            borderColor: getDomainColor(domain),
                            borderWidth: "2px",
                            ringColor: getDomainColor(domain),
                          }}
                        >
                          {/* Gradient overlay based on percentage */}
                          <div
                            className="absolute inset-0 transition-opacity duration-300"
                            style={{
                              background: `linear-gradient(135deg, ${getDomainColor(domain, "light")} 0%, ${getDomainColor(domain)} 100%)`,
                              opacity: data.percentage / 100,
                            }}
                          />

                          {/* Content */}
                          <div className="relative p-6 h-full flex flex-col items-center justify-center text-center space-y-2">
                            <span className="text-4xl">{metadata.icon}</span>
                            <h3
                              className="font-bold text-lg"
                              style={{ color: getDomainColor(domain, "dark") }}
                            >
                              {metadata.nameEs}
                            </h3>
                            <p className="text-sm font-semibold">
                              {data.percentage.toFixed(0)}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {data.count} miembros
                            </p>
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="space-y-1">
                          <p className="font-semibold">{metadata.nameEs}</p>
                          <p className="text-xs italic">{metadata.metaphor}</p>
                          <p className="text-sm">{metadata.keyQuestion}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>

            {/* Center Point Indicator */}
            <div
              className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-primary border-4 border-white shadow-lg z-10 transition-all duration-500"
              style={{
                left: `${centerPoint.x}%`,
                top: `${centerPoint.y}%`,
              }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full h-full" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">Centro de gravedad del equipo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Axis Labels */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-muted-foreground">
              Alto Enfoque en Acción
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-muted-foreground">
              Alto Enfoque en Personas
            </div>
            <div className="absolute top-1/2 -left-20 -translate-y-1/2 -rotate-90 text-xs font-semibold text-muted-foreground whitespace-nowrap">
              Alto Enfoque en Pensamiento
            </div>
            <div className="absolute top-1/2 -right-20 -translate-y-1/2 rotate-90 text-xs font-semibold text-muted-foreground whitespace-nowrap">
              Alto Enfoque en Ejecución
            </div>
          </div>

          {/* Selected Domain Details */}
          {selectedDomain && (
            <Card
              className="border-2"
              style={{
                borderColor: getDomainColor(selectedDomain),
                backgroundColor: getDomainColor(selectedDomain, "bg"),
              }}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    <span>{getDomainMetadata(selectedDomain).icon}</span>
                    {getDomainMetadata(selectedDomain).nameEs}
                  </h4>
                  <p className="text-sm italic text-muted-foreground">
                    {getDomainMetadata(selectedDomain).metaphor}
                  </p>
                  <p className="text-sm font-semibold">
                    {getDomainMetadata(selectedDomain).keyQuestion}
                  </p>
                  <div className="pt-2">
                    <p className="text-sm">
                      <strong>
                        {getDomainData(selectedDomain).percentage.toFixed(0)}%
                      </strong>{" "}
                      del equipo ({getDomainData(selectedDomain).count} miembros)
                      tiene fortalezas en este dominio.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Balance Indicator */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center text-xl flex-shrink-0",
                  analytics.balance.isBalanced
                    ? "bg-green-100 dark:bg-green-900/20"
                    : "bg-yellow-100 dark:bg-yellow-900/20"
                )}
              >
                {analytics.balance.isBalanced ? "✓" : "⚖️"}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">
                  {analytics.balance.isBalanced
                    ? "Equipo Balanceado"
                    : "Oportunidad de Balance"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {analytics.balance.isBalanced
                    ? "Tu equipo tiene una distribución equilibrada de fortalezas entre los cuatro dominios."
                    : `Tu equipo tiene mayor concentración en ${getDomainMetadata(analytics.balance.mostCommon).nameEs} y menor en ${getDomainMetadata(analytics.balance.leastCommon).nameEs}. Considera cómo esto afecta tu dinámica de trabajo.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
