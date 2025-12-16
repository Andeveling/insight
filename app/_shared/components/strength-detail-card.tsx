"use client";

import {
  AlertTriangle,
  Briefcase,
  ChevronDown,
  Lightbulb,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { StrengthWithDomain } from "@/lib/types";
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
      <div className="h-2 w-full" style={{ backgroundColor: domainColor }} />

      <CardHeader className="pb-4 pt-6 bg-muted/30">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            {rank && (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-md ring-2 ring-background"
                style={{
                  backgroundColor: domainColor,
                  color: "white",
                }}
              >
                #{rank}
              </div>
            )}
            <StrengthBadge
              name={strength.name}
              nameEs={strength.nameEs}
              domain={strength.domain}
              showTooltip={false}
              size="sm"
            />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              {strength.nameEs}
            </CardTitle>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              {strength.name}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Brief Definition */}
        <div
          className="relative pl-5 border-l-4 rounded-r-lg bg-muted/20 p-4"
          style={{ borderColor: domainColor }}
        >
          <div className="prose prose-base max-w-none dark:prose-invert prose-p:text-foreground prose-p:leading-relaxed prose-p:my-0 prose-strong:text-foreground prose-strong:font-bold">
            <ReactMarkdown>{strength.briefDefinition}</ReactMarkdown>
          </div>
        </div>

        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="space-y-6"
        >
          <CollapsibleContent className="animate-in slide-in-from-top-2 fade-in duration-300 space-y-6">
            {/* Full Definition */}
            {strength.fullDefinition && (
              <Card
                className="bg-muted/30 border-2"
                style={{ borderColor: domainColor }}
              >
                <CardContent className="pt-6">
                  <div className="prose prose-base max-w-none dark:prose-invert prose-p:text-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-strong:font-bold prose-li:text-foreground prose-ul:my-4 prose-li:my-2">
                    <ReactMarkdown>{strength.fullDefinition}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Grid Layout for Tips & Watchouts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* How to Use */}
              {strength.howToUseMoreEffectively &&
                strength.howToUseMoreEffectively.length > 0 && (
                  <Card className="border-2 border-green-500/30 bg-green-500/5 dark:bg-green-500/10">
                    <CardHeader className="pb-4 bg-green-500/10 dark:bg-green-500/20">
                      <CardTitle className="text-base flex items-center gap-3 text-foreground">
                        <div className="p-2 rounded-lg bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30">
                          <Lightbulb className="h-5 w-5" />
                        </div>
                        Cómo usarla efectivamente
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {strength.howToUseMoreEffectively.map((tip, idx) => (
                          <li key={tip} className="flex gap-4 group">
                            <span
                              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm border-2"
                              style={{
                                backgroundColor: domainColor,
                                color: "white",
                                borderColor: domainColor,
                              }}
                            >
                              {idx + 1}
                            </span>
                            <div className="flex-1 prose prose-sm max-w-none dark:prose-invert prose-p:text-foreground prose-p:m-0 prose-p:leading-relaxed prose-strong:text-foreground prose-strong:font-bold">
                              <ReactMarkdown>{tip}</ReactMarkdown>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

              {/* Watch Outs */}
              {strength.watchOuts && strength.watchOuts.length > 0 && (
                <Card className="border-2 border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10">
                  <CardHeader className="pb-4 bg-amber-500/10 dark:bg-amber-500/20">
                    <CardTitle className="text-base flex items-center gap-3 text-foreground">
                      <div className="p-2 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      Puntos de atención
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {strength.watchOuts.map((watchOut) => (
                        <li key={watchOut} className="flex gap-4 group">
                          <span
                            className="shrink-0 text-2xl"
                            role="img"
                            aria-label="advertencia"
                          >
                            ⚠️
                          </span>
                          <div className="flex-1 prose prose-sm max-w-none dark:prose-invert prose-p:text-foreground prose-p:m-0 prose-p:leading-relaxed prose-strong:text-foreground prose-strong:font-bold">
                            <ReactMarkdown>{watchOut}</ReactMarkdown>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Dynamics & Partners */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dynamics */}
              {strength.strengthsDynamics && (
                <Card className="border-2 bg-card">
                  <CardHeader className="pb-4 bg-muted/30">
                    <CardTitle className="text-base flex items-center gap-2 text-foreground">
                      <div
                        className="p-1.5 rounded-md"
                        style={{
                          backgroundColor: `${domainColor}20`,
                          color: domainColor,
                        }}
                      >
                        <Users className="h-4 w-4" />
                      </div>
                      Dinámicas de Fortalezas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-p:text-foreground prose-p:leading-relaxed prose-p:my-2 prose-strong:text-foreground prose-strong:font-bold prose-ul:my-3 prose-li:text-foreground prose-li:my-1">
                      <ReactMarkdown>
                        {strength.strengthsDynamics}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Partners */}
              {strength.bestPartners && strength.bestPartners.length > 0 && (
                <Card className="border-2 bg-card">
                  <CardHeader className="pb-4 bg-muted/30">
                    <CardTitle className="text-base flex items-center gap-2 text-foreground">
                      <div
                        className="p-1.5 rounded-md"
                        style={{
                          backgroundColor: `${domainColor}20`,
                          color: domainColor,
                        }}
                      >
                        <Users className="h-4 w-4" />
                      </div>
                      Mejores Compañeros
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {strength.bestPartners.map((partner) => (
                        <span
                          key={partner}
                          className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20 transition-all shadow-sm"
                        >
                          <ReactMarkdown>{partner}</ReactMarkdown>
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Career Applications */}
            {strength.careerApplications &&
              strength.careerApplications.length > 0 && (
                <Card className="border-2 bg-card">
                  <CardHeader className="pb-4 bg-muted/30">
                    <CardTitle className="text-base flex items-center gap-2 text-foreground">
                      <div
                        className="p-1.5 rounded-md"
                        style={{
                          backgroundColor: `${domainColor}20`,
                          color: domainColor,
                        }}
                      >
                        <Briefcase className="h-4 w-4" />
                      </div>
                      Aplicaciones Laborales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {strength.careerApplications.map((career) => (
                        <span
                          key={career}
                          className="inline-flex items-center text-sm px-4 py-2 rounded-full border-2 font-medium transition-all hover:shadow-md"
                          style={{
                            borderColor: domainColor,
                            backgroundColor: `${domainColor}15`,
                            color: domainColor,
                          }}
                        >
                          <ReactMarkdown>{career}</ReactMarkdown>
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
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
