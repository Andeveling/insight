"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Clock, Trophy, ChevronRight, Play, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { startModule } from "../_actions";
import type { ModuleCard as ModuleCardType } from "../_schemas";

interface ModuleCardProps {
  module: ModuleCardType;
  priority?: boolean;
  onStarted?: (moduleId: string) => void;
}

/**
 * Module Card Component
 *
 * Displays a development module with level badge, progress indicator,
 * and action button to start or continue the module.
 */
export function ModuleCard({
  module,
  priority = false,
  onStarted,
}: ModuleCardProps) {
  const [isPending, startTransition] = useTransition();
  const [started, setStarted] = useState(
    module.progress.status !== "not_started"
  );

  const handleStart = () => {
    startTransition(async () => {
      try {
        await startModule({ moduleId: module.id });
        setStarted(true);
        onStarted?.(module.id);
      } catch (error) {
        console.error("Error starting module:", error);
      }
    });
  };

  const isCompleted = module.progress.status === "completed";
  const isInProgress = module.progress.status === "in_progress" || started;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card
        className={cn(
          "group relative overflow-hidden transition-shadow hover:shadow-md",
          priority && "ring-2 ring-primary/20",
          isCompleted && "opacity-80"
        )}
      >
        {/* Priority Indicator */}
        {priority && (
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl-lg font-medium">
            Recomendado
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
              {module.titleEs}
            </h3>
            <LevelBadge level={module.level} />
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {module.descriptionEs}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {module.estimatedMinutes} min
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5" />
              {module.xpReward} XP
            </span>
          </div>

          {/* Progress (if started) */}
          {(isInProgress || isCompleted) && (
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {module.progress.completedChallenges}/
                  {module.progress.totalChallenges} desafíos
                </span>
                <span className="font-medium">
                  {module.progress.percentComplete}%
                </span>
              </div>
              <Progress
                value={module.progress.percentComplete}
                className="h-1.5"
                aria-label={`Progreso del módulo ${module.titleEs}: ${module.progress.percentComplete}% completado`}
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0">
          {isCompleted ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Completado
            </div>
          ) : isInProgress ? (
            <Link
              href={`/dashboard/development/${module.id}`}
              className="w-full"
            >
              <Button variant="outline" className="w-full group/btn">
                Continuar
                <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          ) : (
            <Button
              onClick={handleStart}
              disabled={isPending}
              className="w-full group/btn"
            >
              {isPending ? (
                "Iniciando..."
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1.5" />
                  Comenzar
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

/**
 * Level Badge Sub-component
 */
function LevelBadge({
  level,
}: {
  level: "beginner" | "intermediate" | "advanced";
}) {
  const levelConfig = {
    beginner: {
      label: "Principiante",
      variant: "secondary" as const,
      className:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    },
    intermediate: {
      label: "Intermedio",
      variant: "secondary" as const,
      className:
        "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    },
    advanced: {
      label: "Avanzado",
      variant: "secondary" as const,
      className:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    },
  };

  const config = levelConfig[level];

  return (
    <Badge
      variant={config.variant}
      className={cn("shrink-0", config.className)}
    >
      {config.label}
    </Badge>
  );
}
