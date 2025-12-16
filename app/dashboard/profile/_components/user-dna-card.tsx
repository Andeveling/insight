/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";

import { Brain, Heart, Sparkles, Target, Zap } from "lucide-react";
import type { UserDnaData } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/cn";

interface UserDnaCardProps {
  dna: UserDnaData;
  className?: string;
}

export function UserDnaCard({ dna, className }: UserDnaCardProps) {
  const getDimensionIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("pensamiento") || lower.includes("thinking"))
      return <Brain className="w-4 h-4" />;
    if (lower.includes("acción") || lower.includes("doing"))
      return <Zap className="w-4 h-4" />;
    if (lower.includes("conexión") || lower.includes("feeling"))
      return <Heart className="w-4 h-4" />;
    if (lower.includes("propósito") || lower.includes("motivating"))
      return <Target className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  return (
    <Card
      className={cn(
        "relative w-full overflow-hidden border",
        "bg-gamified-surface text-gamified-surface-foreground",
        className
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0",
          "bg-linear-to-br from-gamified-gradient-from/10 to-gamified-gradient-to/10"
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full",
          "bg-gamified-glow blur-3xl"
        )}
      />

      <CardHeader>
        <div className="relative flex items-center gap-2 mb-2">
          <Badge
            variant="outline"
            className={cn(
              "bg-gamified-hero/70 text-gamified-hero-foreground",
              "border-gamified-border"
            )}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            ADN del Usuario
          </Badge>
        </div>
        <CardTitle className="relative text-2xl font-bold bg-clip-text  bg-linear-to-r from-gamified-gradient-from to-gamified-gradient-to">
          {dna.title}
        </CardTitle>
        <CardDescription className="relative text-base mt-2 text-muted-foreground">
          {dna.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-6">
        {/* Dimensions */}
        <div className="grid gap-4 md:grid-cols-2">
          {dna.dimensions.map((dim, i) => (
            <div
              key={i}
              className={cn(
                "space-y-2 p-4 rounded-lg border",
                "bg-card/70 shadow-sm hover:shadow-md transition-shadow"
              )}
            >
              <div className="flex items-center gap-2 font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                {getDimensionIcon(dim.name)}
                {dim.name}
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {dim.strengths.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {s}
                  </Badge>
                ))}
              </div>
              <p className="text-sm leading-relaxed">{dim.description}</p>
            </div>
          ))}
        </div>

        {/* Synergies */}
        {dna.synergies.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Sinergias Clave
            </h3>
            <div className="grid gap-3">
              {dna.synergies.map((syn, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row gap-3 p-3 rounded-md bg-muted/30 border-x-8 border-y border-primary/50"
                >
                  <div className="min-w-[140px] font-medium text-sm text-primary">
                    {syn.effect}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {syn.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ideal Role */}
        {dna.idealRole.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Rol Ideal
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {dna.idealRole.map((role, i) => (
                <li key={i}>{role}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Purpose */}
        <div
          className={cn(
            "mt-6 p-6 rounded-lg border text-center",
            "bg-gamified-hero/60 border-gamified-border"
          )}
        >
          <p className="italic text-lg font-medium">
            &quot;{dna.purpose}&quot;
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
