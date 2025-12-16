/**
 * Professional Profile Form
 *
 * Client component for collecting user's professional context
 * used to personalize AI-generated development modules.
 */

"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Briefcase, Target, Sparkles, ChevronRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { saveProfessionalProfile } from "../_actions/save-professional-profile";
import {
  type RoleStatus,
  type CareerGoal,
} from "../_schemas/professional-profile.schema";
import { VARIANTS, TRANSITIONS, createStagger } from "../_utils/motion-tokens";

/**
 * Role status options
 */
const ROLE_STATUS_OPTIONS: {
  value: RoleStatus;
  label: string;
  emoji: string;
}[] = [
  { value: "satisfied", label: "Satisfecho/a", emoji: "😊" },
  {
    value: "partially_satisfied",
    label: "Parcialmente satisfecho/a",
    emoji: "🤔",
  },
  { value: "unsatisfied", label: "Insatisfecho/a", emoji: "😕" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
];

/**
 * Career goal options
 */
const CAREER_GOAL_OPTIONS: { value: CareerGoal; label: string }[] = [
  { value: "improve_current_role", label: "Mejorar en mi rol actual" },
  {
    value: "explore_new_responsibilities",
    label: "Explorar nuevas responsabilidades",
  },
  { value: "change_area", label: "Cambiar de área" },
  { value: "lead_team", label: "Liderar un equipo" },
  { value: "other", label: "Otro" },
];

interface FormData {
  roleStatus: RoleStatus;
  currentRole: string;
  industryContext: string;
  careerGoals: CareerGoal[];
}

interface ProfessionalProfileFormProps {
  /**
   * Callback when form is submitted successfully
   */
  onSuccess?: () => void;
  /**
   * Initial form values (for editing)
   */
  defaultValues?: Partial<FormData>;
  /**
   * Whether to show skip option
   */
  showSkip?: boolean;
}

export function ProfessionalProfileForm({
  onSuccess,
  defaultValues,
  showSkip = false,
}: ProfessionalProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState<FormData>({
    roleStatus: defaultValues?.roleStatus ?? "neutral",
    currentRole: defaultValues?.currentRole ?? "",
    industryContext: defaultValues?.industryContext ?? "",
    careerGoals: defaultValues?.careerGoals ?? [],
  });

  const staggerChildren = createStagger(0.1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await saveProfessionalProfile({
        roleStatus: formData.roleStatus,
        currentRole: formData.currentRole || undefined,
        industryContext: formData.industryContext || undefined,
        careerGoals:
          formData.careerGoals.length > 0 ? formData.careerGoals : undefined,
      });
      if (result.success) {
        onSuccess?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    setIsSubmitting(true);
    try {
      const result = await saveProfessionalProfile({
        roleStatus: "neutral",
        skip: true,
      });
      if (result.success) {
        onSuccess?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleGoal = (goal: CareerGoal) => {
    setFormData((prev) => {
      const current = prev.careerGoals;
      if (current.includes(goal)) {
        return { ...prev, careerGoals: current.filter((g) => g !== goal) };
      }
      if (current.length < 5) {
        return { ...prev, careerGoals: [...current, goal] };
      }
      return prev;
    });
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <Card className="w-full max-w-lg mx-auto overflow-hidden">
      <CardHeader className="bg-linear-to-r from-primary/10 to-accent/10 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={TRANSITIONS.fadeIn}
        >
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            Personaliza tu desarrollo
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Cuéntanos sobre ti para crear módulos únicos para tu contexto.
          </p>
        </motion.div>
        {/* Progress indicator */}
        <div className="flex gap-1 mt-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <motion.div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i < step ? "bg-primary" : "bg-muted"
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: i < step ? 1 : 0.3 }}
              transition={TRANSITIONS.spring}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={VARIANTS.fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                <Label className="flex items-center gap-2 text-base font-medium">
                  <Briefcase className="h-4 w-4" />
                  ¿Cómo te sientes en tu rol actual?
                </Label>
                <RadioGroup
                  value={formData.roleStatus}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      roleStatus: value as RoleStatus,
                    }))
                  }
                  className="grid grid-cols-2 gap-3"
                >
                  {ROLE_STATUS_OPTIONS.map((option, idx) => (
                    <motion.div
                      key={option.value}
                      variants={staggerChildren}
                      custom={idx}
                      initial="initial"
                      animate="animate"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                        />
                        <Label
                          htmlFor={option.value}
                          className="font-normal cursor-pointer"
                        >
                          {option.emoji} {option.label}
                        </Label>
                      </div>
                    </motion.div>
                  ))}
                </RadioGroup>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={VARIANTS.fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="currentRole">Tu rol actual (opcional)</Label>
                  <Input
                    id="currentRole"
                    placeholder="Ej: Desarrollador Senior, Gerente de Proyectos"
                    value={formData.currentRole}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        currentRole: e.target.value,
                      }))
                    }
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ayuda a contextualizar los ejercicios
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industryContext">
                    Industria o sector (opcional)
                  </Label>
                  <Input
                    id="industryContext"
                    placeholder="Ej: Tecnología, Salud, Educación"
                    value={formData.industryContext}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        industryContext: e.target.value,
                      }))
                    }
                    maxLength={100}
                  />
                  <p className="text-xs text-muted-foreground">
                    Para ejemplos relevantes a tu campo
                  </p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={VARIANTS.fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-4"
              >
                <div>
                  <Label className="flex items-center gap-2 text-base font-medium">
                    <Target className="h-4 w-4" />
                    ¿Cuáles son tus metas profesionales?
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Selecciona hasta 5 opciones
                  </p>
                </div>
                <div className="space-y-2">
                  {CAREER_GOAL_OPTIONS.map((option, idx) => (
                    <motion.div
                      key={option.value}
                      variants={staggerChildren}
                      custom={idx}
                      initial="initial"
                      animate="animate"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={formData.careerGoals.includes(option.value)}
                          onCheckedChange={() => toggleGoal(option.value)}
                        />
                        <Label
                          htmlFor={option.value}
                          className="font-normal cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={isSubmitting}
              >
                Atrás
              </Button>
            ) : showSkip ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkip}
                disabled={isSubmitting}
              >
                Omitir
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    Guardando...
                  </motion.span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Guardar perfil
                  </span>
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
