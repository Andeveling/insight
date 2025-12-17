/**
 * Generate Module Section
 *
 * Client component that displays strength-based buttons
 * to generate personalized development modules.
 */

"use client";

import { motion } from "motion/react";
import { Sparkles, Info } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { GenerateModuleButton } from "./generate-module-button";
import { VARIANTS, TRANSITIONS, createStagger } from "../_utils/motion-tokens";
import type { DevelopmentStrength } from "../_actions/get-user-strengths";

interface PendingModule {
  id: string;
  titleEs: string;
  percentComplete: number;
}

interface GenerateModuleSectionProps {
  /**
   * User's Top 5 strengths (filtered to only show those WITHOUT personalized modules)
   */
  strengths: DevelopmentStrength[];
  /**
   * Whether user can generate a new module
   */
  canGenerate: boolean;
  /**
   * Message to show when blocked
   */
  blockedMessage?: string;
  /**
   * Pending modules to show in tooltip when blocked
   */
  pendingModules?: PendingModule[];
  /**
   * Total number of Top 5 strengths
   */
  totalStrengths?: number;
  /**
   * Number of strengths available for generation (without modules)
   */
  availableCount?: number;
}

export function GenerateModuleSection({
  strengths,
  canGenerate,
  blockedMessage,
  pendingModules = [],
  totalStrengths = 5,
  availableCount,
}: GenerateModuleSectionProps) {
  const router = useRouter();
  const staggerChildren = createStagger(0.08);
  const generatedCount = totalStrengths - (availableCount ?? strengths.length);

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <Card className="border-dashed border-primary/30 bg-linear-to-br from-primary/5 to-accent/5">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <Sparkles className="h-5 w-5 text-primary" />
          </motion.div>
          Genera módulos personalizados
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Los módulos personalizados se crean con IA basándose en tu
                  perfil profesional y contexto único. Son exclusivos para ti.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {generatedCount > 0 ? (
            <>
              Ya generaste {generatedCount} de {totalStrengths} módulos
              personalizados.
              {availableCount && availableCount > 0 && (
                <> Quedan {availableCount} fortalezas disponibles.</>
              )}
            </>
          ) : (
            "Selecciona una de tus fortalezas Top 5 para crear un módulo único"
          )}
        </p>
      </CardHeader>

      <CardContent>
        <motion.div
          className="flex flex-wrap gap-3"
          variants={VARIANTS.staggerContainer}
          initial="initial"
          animate="animate"
        >
          {strengths.map((strength, index) => (
            <motion.div
              key={strength.key}
              variants={staggerChildren}
              custom={index}
              initial="initial"
              animate="animate"
            >
              <GenerateModuleButton
                strengthKey={strength.key}
                strengthName={strength.nameEs}
                domainKey={strength.domainKey}
                isBlocked={!canGenerate}
                blockedMessage={blockedMessage}
                pendingModules={pendingModules}
                onSuccess={handleSuccess}
              />
            </motion.div>
          ))}
        </motion.div>

        {!canGenerate && blockedMessage && (
          <motion.p
            className="text-sm text-muted-foreground mt-4 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={TRANSITIONS.fadeIn}
          >
            <Info className="h-4 w-4" />
            {blockedMessage}
          </motion.p>
        )}
      </CardContent>
    </Card>
  );
}
