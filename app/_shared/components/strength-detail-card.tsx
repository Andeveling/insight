"use client";

import {
  AlertTriangle,
  Briefcase,
  ChevronDown,
  Lightbulb,
  Users,
} from "lucide-react";
import { useState } from "react";
import type { StrengthWithDomain } from "@/app/_shared/types/strength.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/cn";
import { getDomainColor } from "@/lib/constants/domain-colors";
import { StrengthBadge } from "./strength-badge";

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
  const [isOpen, setIsOpen] = useState(true);
  const domainColor = getDomainColor(strength.domain);
  const domainBg = getDomainColor(strength.domain, "bg");
  const domainBorder = getDomainColor(strength.domain, "border");

  return (
    <Card
      className={cn(
        "overflow-hidden border transition-all hover:shadow-md bg-card",
        className
      )}
      style={{
        borderColor: domainBorder,
      }}
    >
      {/* Decorative Top Border */}
      <div className="h-1.5 w-full" style={{ backgroundColor: domainColor }} />

      <CardHeader className="pb-2 pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {rank && (
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ring-2 ring-white"
                  style={{ backgroundColor: domainColor }}
                >
                  {rank}
                </span>
              )}
              <StrengthBadge
                name={strength.name}
                nameEs={strength.nameEs}
                domain={strength.domain}
                showTooltip={false}
                size="sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              {strength.nameEs}
            </CardTitle>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {strength.name}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Brief Definition */}
        <div
          className="relative pl-4 border-l-2"
          style={{ borderColor: domainBorder }}
        >
          <p className="text-base leading-relaxed text-muted-foreground">
            {strength.briefDefinition}
          </p>
        </div>

        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="space-y-6"
        >
          <CollapsibleContent className="4 animate-in slide-in-from-top-2 fade-in duration-300 space-y-4">
            {/* Full Definition */}
            {strength.fullDefinition && (
              <div
                className="p-5  rounded-xl text-sm leading-relaxed whitespace-pre-line border bg-opacity-30"
                style={{ backgroundColor: domainBg, borderColor: domainBorder }}
              >
                {strength.fullDefinition}
              </div>
            )}

            {/* Grid Layout for Tips & Watchouts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* How to Use */}
              {strength.howToUseMoreEffectively &&
                strength.howToUseMoreEffectively.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                      <div className="p-1.5 rounded-md bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <Lightbulb className="h-4 w-4" />
                      </div>
                      Cómo usarla efectivamente
                    </h4>
                    <ul className="space-y-3">
                      {strength.howToUseMoreEffectively.map((tip, idx) => (
                        <li key={tip} className="flex gap-3 text-sm group">
                          <span
                            className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 transition-colors"
                            style={{
                              backgroundColor: domainBg,
                              color: domainColor,
                            }}
                          >
                            {idx + 1}
                          </span>
                          <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                            {tip}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Watch Outs */}
              {strength.watchOuts && strength.watchOuts.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                    <div className="p-1.5 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    Puntos de atención
                  </h4>
                  <ul className="space-y-3">
                    {strength.watchOuts.map((watchOut) => (
                      <li key={watchOut} className="flex gap-3 text-sm group">
                        <span className="text-amber-500 mt-0.5 shrink-0">
                          ⚠️
                        </span>
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                          {watchOut}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Dynamics & Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              {/* Dynamics */}
              {strength.strengthsDynamics && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-foreground">
                    Dinámicas de Fortalezas
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {strength.strengthsDynamics}
                  </p>
                </div>
              )}

              {/* Partners */}
              {strength.bestPartners && strength.bestPartners.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Mejores Compañeros
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {strength.bestPartners.map((partner) => (
                      <span
                        key={partner}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-transparent hover:border-border transition-colors"
                      >
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Career Applications */}
            {strength.careerApplications &&
              strength.careerApplications.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-foreground">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    Aplicaciones Laborales
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {strength.careerApplications.map((career) => (
                      <span
                        key={career}
                        className="text-xs px-3 py-1.5 rounded-full border font-medium transition-colors hover:bg-accent"
                        style={{
                          borderColor: domainBorder,
                          color: domainColor,
                        }}
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </CollapsibleContent>

          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full mt-2 hover:bg-accent hover:text-accent-foreground group"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
                {isOpen ? "Mostrar menos" : "Ver análisis completo"}
              </span>
              <ChevronDown
                className={cn(
                  "ml-2 h-4 w-4 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
