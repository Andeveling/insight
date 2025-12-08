"use client";

import { cn } from "@/lib/cn";
import { getDomainColor } from "@/lib/constants/domain-colors";
import type { StrengthWithDomain } from "@/app/_shared/types/strength.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StrengthBadge } from "./strength-badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronDown, Lightbulb, AlertTriangle, Users, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StrengthDetailCardProps {
  strength: StrengthWithDomain;
  rank?: number;
  className?: string;
}

export function StrengthDetailCard({
  strength,
  rank,
  className,
}: StrengthDetailCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card
      className={cn("border-2 transition-all", className)}
      style={{
        borderColor: getDomainColor(strength.domain, "border"),
        backgroundColor: getDomainColor(strength.domain, "bg"),
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {rank && (
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                  style={{ backgroundColor: getDomainColor(strength.domain) }}
                >
                  #{rank}
                </div>
              )}
              <StrengthBadge
                name={strength.name}
                nameEs={strength.nameEs}
                domain={strength.domain}
                showTooltip={false}
                size="lg"
              />
            </div>
            <CardTitle className="text-xl">{strength.nameEs}</CardTitle>
            <p className="text-sm text-muted-foreground">{strength.name}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Brief Definition */}
        <div>
          <p className="text-sm leading-relaxed">{strength.briefDefinition}</p>
        </div>

        {/* Expandable Full Details */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full"
              style={{
                borderColor: getDomainColor(strength.domain, "border"),
              }}
            >
              <span>
                {isOpen ? "Ocultar" : "Ver"} Definición Completa
              </span>
              <ChevronDown
                className={cn(
                  "ml-2 h-4 w-4 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4 mt-4">
            {/* Full Definition */}
            {strength.fullDefinition && (
              <div className="p-4 bg-background rounded-lg border">
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {strength.fullDefinition}
                </p>
              </div>
            )}

            {/* How to Use More Effectively */}
            {strength.howToUseMoreEffectively &&
              strength.howToUseMoreEffectively.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Cómo Usarla Más Efectivamente:
                  </h4>
                  <ul className="space-y-2">
                    {strength.howToUseMoreEffectively.map((tip, idx) => (
                      <li
                        key={idx}
                        className="flex gap-2 text-sm bg-background p-3 rounded-lg"
                      >
                        <span className="text-muted-foreground font-bold">
                          {idx + 1}.
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Watch Outs */}
            {strength.watchOuts && strength.watchOuts.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Puntos de Atención:
                </h4>
                <ul className="space-y-2">
                  {strength.watchOuts.map((watchOut, idx) => (
                    <li
                      key={idx}
                      className="flex gap-2 text-sm bg-background p-3 rounded-lg border-l-4"
                      style={{
                        borderColor: getDomainColor(strength.domain),
                      }}
                    >
                      <span className="text-muted-foreground">⚠️</span>
                      <span>{watchOut}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strengths Dynamics */}
            {strength.strengthsDynamics && (
              <div className="p-4 bg-background rounded-lg border">
                <h4 className="font-semibold text-sm mb-2">
                  Dinámicas de Fortalezas:
                </h4>
                <p className="text-sm leading-relaxed">
                  {strength.strengthsDynamics}
                </p>
              </div>
            )}

            {/* Best Partners */}
            {strength.bestPartners && strength.bestPartners.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Mejores Compañeros:
                </h4>
                <ul className="space-y-1">
                  {strength.bestPartners.map((partner, idx) => (
                    <li key={idx} className="flex gap-2 text-sm">
                      <span className="text-muted-foreground">🤝</span>
                      <span>{partner}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Career Applications */}
            {strength.careerApplications &&
              strength.careerApplications.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Aplicaciones Laborales:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {strength.careerApplications.map((career, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded-full border"
                        style={{
                          borderColor: getDomainColor(strength.domain, "border"),
                          backgroundColor: "transparent",
                          color: getDomainColor(strength.domain, "dark"),
                        }}
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
