/**
 * Module Schemas
 *
 * Zod validation schemas for development module operations.
 */

import { z } from "zod";

/**
 * Module level enum schema
 */
export const ModuleLevelSchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
]);

/**
 * Module type enum schema (general vs personalized)
 */
export const ModuleTypeSchema = z.enum([ "general", "personalized" ]);

/**
 * Schema for module data from database
 */
export const ModuleDataSchema = z.object({
  id: z.string(),
  key: z.string(),
  titleEs: z.string(),
  descriptionEs: z.string(),
  content: z.string(),
  strengthKey: z.string().nullable(),
  domainKey: z.string().nullable(),
  estimatedMinutes: z.number(),
  xpReward: z.number(),
  level: ModuleLevelSchema,
  order: z.number(),
  isActive: z.boolean(),
  // New fields
  moduleType: ModuleTypeSchema,
  userId: z.string().nullable(),
  isArchived: z.boolean(),
  generatedBy: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Schema for starting a module
 */
export const StartModuleInputSchema = z.object({
  moduleId: z.string().min(1, "El ID del módulo es requerido"),
});

/**
 * Schema for get module detail request
 */
export const GetModuleDetailInputSchema = z.object({
  moduleId: z.string().min(1, "El ID del módulo es requerido"),
});

/**
 * Schema for module list filters
 */
export const ModuleFiltersSchema = z.object({
  level: ModuleLevelSchema.optional(),
  domainKey: z.string().optional(),
  strengthKey: z.string().optional(),
  search: z.string().optional(),
  showCompleted: z.boolean().optional().default(false),
  moduleType: ModuleTypeSchema.or(z.literal("all")).optional(),
});

/**
 * Schema for module card display data
 */
export const ModuleCardSchema = z.object({
  id: z.string(),
  key: z.string(),
  titleEs: z.string(),
  descriptionEs: z.string(),
  level: ModuleLevelSchema,
  estimatedMinutes: z.number(),
  xpReward: z.number(),
  strengthKey: z.string(),
  moduleType: ModuleTypeSchema,
  progress: z.object({
    status: z.enum([ "not_started", "in_progress", "completed" ]),
    percentComplete: z.number(),
    completedChallenges: z.number(),
    totalChallenges: z.number(),
  }),
});

/**
 * Schema for generate module input
 */
export const GenerateModuleInputSchema = z.object({
  strengthKey: z.string().min(1, "Fortaleza requerida"),
});

/**
 * Schema for module detail with challenges
 */
export const ModuleDetailSchema = z.object({
  module: ModuleDataSchema,
  challenges: z.array(
    z.object({
      id: z.string(),
      titleEs: z.string(),
      descriptionEs: z.string(),
      type: z.enum([ "reflection", "action", "collaboration" ]),
      xpReward: z.number(),
      isCompleted: z.boolean(),
      completedAt: z.date().nullable(),
    })
  ),
  progress: z.object({
    status: z.enum([ "not_started", "in_progress", "completed" ]),
    percentComplete: z.number(),
    startedAt: z.date().nullable(),
    completedAt: z.date().nullable(),
  }),
});

export type ModuleLevel = z.infer<typeof ModuleLevelSchema>;
export type ModuleType = z.infer<typeof ModuleTypeSchema>;
export type ModuleData = z.infer<typeof ModuleDataSchema>;
export type StartModuleInput = z.infer<typeof StartModuleInputSchema>;
export type GetModuleDetailInput = z.infer<typeof GetModuleDetailInputSchema>;
export type ModuleFilters = z.infer<typeof ModuleFiltersSchema>;
export type ModuleCard = z.infer<typeof ModuleCardSchema>;
export type ModuleDetail = z.infer<typeof ModuleDetailSchema>;
export type GenerateModuleInput = z.infer<typeof GenerateModuleInputSchema>;
