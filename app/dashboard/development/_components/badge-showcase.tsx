"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Award, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { BadgeTier } from "@/lib/types";

interface BadgeData {
  id: string;
  key: string;
  nameEs: string;
  descriptionEs: string;
  iconUrl: string;
  tier: BadgeTier;
  xpReward: number;
  isUnlocked: boolean;
  unlockedAt: Date | null;
  progress: number;
  criteria: string | null;
}

interface BadgeShowcaseProps {
  badges: BadgeData[];
  unlockedCount: number;
  totalBadges: number;
  byTier: {
    bronze: { total: number; unlocked: number };
    silver: { total: number; unlocked: number };
    gold: { total: number; unlocked: number };
    platinum: { total: number; unlocked: number };
  };
}

const tierConfig = {
  bronze: {
    label: "Bronce",
    color: "text-amber-700 dark:text-amber-500",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    borderColor: "border-amber-300 dark:border-amber-700",
  },
  silver: {
    label: "Plata",
    color: "text-slate-500 dark:text-slate-400",
    bgColor: "bg-slate-100 dark:bg-slate-800/50",
    borderColor: "border-slate-300 dark:border-slate-600",
  },
  gold: {
    label: "Oro",
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    borderColor: "border-yellow-400 dark:border-yellow-600",
  },
  platinum: {
    label: "Platino",
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    borderColor: "border-cyan-400 dark:border-cyan-600",
  },
};

/**
 * Badge Showcase Component
 *
 * Displays a grid of badges organized by tier.
 * Shows locked/unlocked state with progress for locked badges.
 */
export function BadgeShowcase({
  badges,
  unlockedCount,
  totalBadges,
  byTier,
}: BadgeShowcaseProps) {
  const [selectedTier, setSelectedTier] = useState<"all" | BadgeTier>("all");

  const filteredBadges =
    selectedTier === "all"
      ? badges
      : badges.filter((b) => b.tier === selectedTier);

  const tiers: Array<"all" | BadgeTier> = [
    "all",
    "bronze",
    "silver",
    "gold",
    "platinum",
  ];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 text-sm"
      >
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <span className="font-medium">
            {unlockedCount} / {totalBadges}
          </span>
          <span className="text-muted-foreground">insignias desbloqueadas</span>
        </div>
      </motion.div>

      {/* Tier Tabs */}
      <Tabs
        value={selectedTier}
        onValueChange={(v) => setSelectedTier(v as "all" | BadgeTier)}
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todas ({totalBadges})</TabsTrigger>
          {(Object.keys(tierConfig) as BadgeTier[]).map((tier) => (
            <TabsTrigger key={tier} value={tier}>
              {tierConfig[tier].label} ({byTier[tier].unlocked}/
              {byTier[tier].total})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedTier} className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBadges.map((badge, index) => (
              <BadgeCard key={badge.id} badge={badge} index={index} />
            ))}
          </div>

          {filteredBadges.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No hay insignias en esta categoría
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Individual Badge Card
 */
function BadgeCard({ badge, index }: { badge: BadgeData; index: number }) {
  const tier = tierConfig[badge.tier];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={cn(
                "relative overflow-hidden transition-all hover:shadow-md",
                badge.isUnlocked ? tier.borderColor : "border-muted opacity-75"
              )}
            >
              <CardContent className="pt-6 pb-4 text-center">
                {/* Badge Icon */}
                <div
                  className={cn(
                    "relative mx-auto mb-3 h-16 w-16 rounded-full flex items-center justify-center",
                    badge.isUnlocked ? tier.bgColor : "bg-muted"
                  )}
                >
                  {badge.iconUrl ? (
                    <span className="text-3xl">{badge.iconUrl}</span>
                  ) : (
                    <Award
                      className={cn(
                        "h-8 w-8",
                        badge.isUnlocked ? tier.color : "text-muted-foreground"
                      )}
                    />
                  )}

                  {/* Lock Overlay */}
                  {!badge.isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-full">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}

                  {/* Unlocked Check */}
                  {badge.isUnlocked && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Badge Name */}
                <h3
                  className={cn(
                    "font-medium text-sm mb-1",
                    !badge.isUnlocked && "text-muted-foreground"
                  )}
                >
                  {badge.nameEs}
                </h3>

                {/* Tier Badge */}
                <Badge
                  variant="outline"
                  className={cn("text-xs", badge.isUnlocked && tier.bgColor)}
                >
                  {tier.label}
                </Badge>

                {/* Progress for locked badges */}
                {!badge.isUnlocked && badge.progress > 0 && (
                  <div className="mt-3 space-y-1">
                    <Progress
                      value={badge.progress}
                      className="h-1.5"
                      aria-label={`Progreso hacia ${badge.nameEs}: ${Math.round(badge.progress)}%`}
                    />
                    <p className="text-xs text-muted-foreground">
                      {Math.round(badge.progress)}%
                    </p>
                  </div>
                )}

                {/* XP Reward */}
                <p
                  className={cn(
                    "text-xs mt-2",
                    badge.isUnlocked
                      ? "text-green-600 dark:text-green-400"
                      : "text-muted-foreground"
                  )}
                >
                  +{badge.xpReward} XP
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="font-medium">{badge.nameEs}</p>
          <p className="text-sm text-muted-foreground">{badge.descriptionEs}</p>
          {badge.isUnlocked && badge.unlockedAt && (
            <p className="text-xs text-muted-foreground mt-1">
              Desbloqueado el{" "}
              {new Date(badge.unlockedAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
