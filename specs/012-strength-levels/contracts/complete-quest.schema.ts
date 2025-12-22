import { z } from 'zod';

/**
 * Schema for completing a quest (any type)
 */
export const completeQuestSchema = z.object({
  questId: z.string().uuid('ID de misión inválido'),
  reflectionNote: z
    .string()
    .max(500, 'La reflexión no puede exceder 500 caracteres')
    .optional(),
  confirmedBy: z
    .string()
    .uuid('ID de confirmador inválido')
    .optional(), // Solo para misiones cooperativas
});

export type CompleteQuestInput = z.infer<typeof completeQuestSchema>;

/**
 * Result type for completing a quest
 */
export interface CompleteQuestResult {
  success: boolean;
  xpAwarded: number;
  leveledUp: boolean;
  newLevel?: string; // MaturityLevel enum as string
  newXpCurrent: number;
  error?: string;
}
