"use client";

import { motion } from "motion/react";
import { User, Users } from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VARIANTS, TRANSITIONS } from "../_utils/motion-tokens";
import type { ModuleType } from "../_schemas";

interface ModuleTypeBadgeProps {
  type: ModuleType;
  className?: string;
  showTooltip?: boolean;
}

const typeConfig = {
  general: {
    label: "General",
    description: "Módulo disponible para todos los usuarios con esta fortaleza",
    icon: Users,
    variant: "secondary" as const,
  },
  personalized: {
    label: "Personalizado",
    description: "Módulo generado exclusivamente para ti con IA",
    icon: User,
    variant: "default" as const,
  },
};

/**
 * ModuleTypeBadge Component
 *
 * Displays a badge indicating whether a module is general
 * (available to all) or personalized (AI-generated for user).
 * Uses Gaming Fluent Design with subtle animations.
 */
export function ModuleTypeBadge({
  type,
  className,
  showTooltip = true,
}: ModuleTypeBadgeProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  const badge = (
    <motion.div
      variants={VARIANTS.scaleIn}
      initial="initial"
      animate="animate"
      transition={TRANSITIONS.spring}
    >
      <Badge
        variant={config.variant}
        className={cn(
          "gap-1 text-xs font-medium",
          type === "personalized" &&
            "bg-linear-to-r from-primary to-primary/80",
          className
        )}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    </motion.div>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent side="top" className="max-w-[200px] text-center">
        <p className="text-xs">{config.description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
