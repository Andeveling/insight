"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Compass, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VARIANTS, TRANSITIONS } from "../_utils/motion-tokens";

/**
 * StrengthsRequiredMessage Component
 *
 * Displays a friendly message when user hasn't completed
 * their strength assessment. Uses Gaming Fluent Design
 * with motion/react animations.
 */
export function StrengthsRequiredMessage() {
  return (
    <motion.div
      className="flex items-center justify-center min-h-[400px] p-6"
      variants={VARIANTS.fadeInUp}
      initial="initial"
      animate="animate"
    >
      <Card className="max-w-md w-full overflow-hidden">
        <CardContent className="p-8 text-center space-y-6">
          {/* Animated Icon */}
          <motion.div
            className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
            variants={VARIANTS.scaleIn}
            initial="initial"
            animate="animate"
            transition={TRANSITIONS.bounce}
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Compass className="w-10 h-10 text-primary" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.div
            className="space-y-2"
            variants={VARIANTS.fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold">Descubre tus Fortalezas</h2>
            <p className="text-muted-foreground">
              Antes de acceder a los módulos de desarrollo, necesitas completar
              tu evaluación de fortalezas para personalizar tu experiencia.
            </p>
          </motion.div>

          {/* Benefits List */}
          <motion.div
            className="text-left space-y-3 bg-muted/50 rounded-lg p-4"
            variants={VARIANTS.fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Módulos personalizados para tu Top 5
            </p>
            <p className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Contenido exclusivo para tus fortalezas
            </p>
            <p className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Desbloquea módulos generados con IA
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            variants={VARIANTS.buttonPress}
            whileHover="whileHover"
            whileTap="whileTap"
          >
            <Button asChild size="lg" className="w-full group">
              <Link href="/dashboard/assessment">
                Comenzar Evaluación
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>

          {/* Time estimate */}
          <p className="text-xs text-muted-foreground">
            La evaluación toma aproximadamente 15-20 minutos
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
