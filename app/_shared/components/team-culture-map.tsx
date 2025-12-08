"use client";

import { useMemo, useState } from "react";
import type {
  DomainType,
  TeamAnalytics,
} from "@/app/_shared/types/strength.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";
import {
  getDomainColor,
  getDomainMetadata,
} from "@/lib/constants/domain-colors";
import {
  analyzeTeamCulture,
  getCultureDomain,
  getCultureMetadata,
} from "@/lib/utils/culture-calculator";
import { CulturesGrid } from "./cultures-grid";

interface TeamCultureMapProps {
  analytics: TeamAnalytics;
  cultures?: Array<{
    name: string;
    nameEs: string;
    subtitle: string;
    description: string;
    focusLabel: string;
    attributes: string[];
    icon: string;
  }>;
  className?: string;
}

const CULTURE_NAMES_ES: Record<string, string> = {
  Execution: "Ejecución",
  Influence: "Influencia",
  Strategy: "Estrategia",
  Cohesion: "Cohesión",
};

export function TeamCultureMap({
  analytics,
  cultures,
  className,
}: TeamCultureMapProps) {
  const [selectedDomain, setSelectedDomain] = useState<DomainType | null>(null);

  // Calculate team culture
  const cultureAnalysis = useMemo(
    () => analyzeTeamCulture(analytics),
    [analytics]
  );

  // Calculate the center point based on domain distribution
  const centerPoint = useMemo(() => {
    const distribution = analytics.domainDistribution;
    const doing =
      distribution.find((d) => d.domain === "Doing")?.percentage ?? 0;
    const feeling =
      distribution.find((d) => d.domain === "Feeling")?.percentage ?? 0;
    const motivating =
      distribution.find((d) => d.domain === "Motivating")?.percentage ?? 0;
    const thinking =
      distribution.find((d) => d.domain === "Thinking")?.percentage ?? 0;

    // Map to coordinates (0-100 range for each axis)
    // X-axis: Task/Results (left) to People (right)
    // Y-axis: Thinking/Reflection (bottom) to Action (top)

    const peopleScore = motivating + feeling;
    const taskScore = doing + thinking;
    const actionScore = doing + motivating;
    const thinkingScore = thinking + feeling;

    const x = (peopleScore - taskScore) / 2 + 50;
    const y = (actionScore - thinkingScore) / 2 + 50;

    // Invert Y for CSS top positioning (100% is bottom, 0% is top)
    return { x, y: 100 - y };
  }, [analytics.domainDistribution]);

  const quadrants: Array<{
    domain: DomainType;
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  }> = [
    { domain: "Doing", position: "top-left" },
    { domain: "Motivating", position: "top-right" },
    { domain: "Thinking", position: "bottom-left" },
    { domain: "Feeling", position: "bottom-right" },
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
        <CardTitle className="text-2xl">
          Cultura de Fortalezas del Equipo
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Mapa del estilo de trabajo natural de tu equipo
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-12">
          {/* Dominant Culture Card */}
          {/* <Card
            className="border-2 overflow-hidden"
            style={{
              borderColor: getDomainColor(
                getCultureDomain(cultureAnalysis.dominantCulture) as DomainType
              ),
              backgroundColor: getDomainColor(
                getCultureDomain(cultureAnalysis.dominantCulture) as DomainType,
                "bg"
              ),
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div
                  className="text-7xl p-4 rounded-2xl shrink-0"
                  style={{
                    backgroundColor: getDomainColor(
                      getCultureDomain(
                        cultureAnalysis.dominantCulture
                      ) as DomainType,
                      "light"
                    ),
                  }}
                >
                  {getCultureMetadata(cultureAnalysis.dominantCulture).icon}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3
                      className="text-3xl font-bold"
                      style={{
                        color: getDomainColor(
                          getCultureDomain(
                            cultureAnalysis.dominantCulture
                          ) as DomainType,
                          "dark"
                        ),
                      }}
                    >
                      Cultura de {cultureAnalysis.cultureNameEs}
                    </h3>
                    <Badge variant="outline" className="text-xs font-semibold">
                      Dominante
                    </Badge>
                  </div>
                  <p className="text-lg font-medium text-muted-foreground">
                    {
                      getCultureMetadata(cultureAnalysis.dominantCulture)
                        .subtitle
                    }
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Ejes:</span>
                      <Badge variant="secondary">
                        {cultureAnalysis.dominantEnergy === "Action"
                          ? "⚡ Acción"
                          : "🔍 Reflexión"}
                      </Badge>
                      <span>+</span>
                      <Badge variant="secondary">
                        {cultureAnalysis.dominantOrientation === "Results"
                          ? "🎯 Resultados"
                          : "👥 Personas"}
                      </Badge>
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Confianza:</span>
                      <span className="text-muted-foreground">
                        {(cultureAnalysis.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  {cultureAnalysis.secondaryCulture && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Nota:</strong> Tu equipo también muestra rasgos de
                      la cultura de{" "}
                      <span className="font-semibold">
                        {CULTURE_NAMES_ES[cultureAnalysis.secondaryCulture]}
                      </span>
                      , lo que indica un equilibrio cultural.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Quadrant Map */}
          <div className="relative aspect-square w-full max-w-2xl mx-auto p-8">
            {/* Grid */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-6">
              {quadrants.map(({ domain }) => {
                const data = getDomainData(domain);
                const metadata = getDomainMetadata(domain);
                const isSelected = selectedDomain === domain;

                return (
                  <TooltipProvider key={domain}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          tabIndex={0}
                          onClick={() =>
                            setSelectedDomain(isSelected ? null : domain)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setSelectedDomain(isSelected ? null : domain);
                            }
                          }}
                          className={cn(
                            "relative overflow-hidden rounded-3xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md w-full h-full",
                            "hover:scale-[1.02]",
                            isSelected && "ring-4 ring-offset-2 scale-[1.02]"
                          )}
                          style={{
                            backgroundColor: getDomainColor(domain, "light"),
                          }}
                        >
                          {/* Gradient overlay based on percentage */}
                          <div
                            className="absolute inset-0 transition-opacity duration-300"
                            style={{
                              background: `linear-gradient(135deg, ${getDomainColor(
                                domain,
                                "light"
                              )} 0%, ${getDomainColor(domain)} 100%)`,
                              opacity: 0.8,
                            }}
                          />

                          {/* Content */}
                          <div className="relative p-6 h-full flex flex-col items-center justify-center text-center space-y-4">
                            <span className="text-6xl drop-shadow-sm">
                              {metadata.icon}
                            </span>
                            <h3
                              className="font-bold text-2xl"
                              style={{ color: getDomainColor(domain, "dark") }}
                            >
                              {metadata.nameEs}
                            </h3>
                            <div className="flex flex-col items-center">
                              <span className="text-4xl font-bold text-white drop-shadow-md">
                                {data.percentage.toFixed(0)}%
                              </span>
                              <span className="text-sm font-medium text-white/90 uppercase tracking-wider">
                                {data.count} miembros
                              </span>
                            </div>
                          </div>
                        </Button>
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
              className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full bg-primary border-4 border-white shadow-lg z-10 transition-all duration-500"
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
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-lg font-bold text-muted-foreground tracking-widest uppercase">
              Alto Enfoque en Acción
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-lg font-bold text-muted-foreground tracking-widest uppercase">
              Alto Enfoque en Reflexión
            </div>
            <div className="absolute top-1/2 -left-48 -translate-y-1/2 -rotate-90 text-lg font-bold text-muted-foreground whitespace-nowrap tracking-widest uppercase">
              Alto Enfoque en Resultados
            </div>
            <div className="absolute top-1/2 -right-44 -translate-y-1/2 rotate-90 text-lg font-bold text-muted-foreground whitespace-nowrap tracking-widest uppercase">
              Alto Enfoque en Personas
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
                      del equipo ({getDomainData(selectedDomain).count}{" "}
                      miembros) tiene fortalezas en este dominio.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cultures Grid - Only show if cultures data is provided */}
          {cultures && cultures.length > 0 && (
            <CulturesGrid cultures={cultures} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
