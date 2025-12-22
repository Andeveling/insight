import { z } from "zod";

/**
 * Schema for getting maturity levels for a user
 */
export const getMaturityLevelsSchema = z.object({
	userId: z.string().uuid("ID de usuario inválido"),
	strengthIds: z.array(z.string().uuid("ID de fortaleza inválido")).optional(), // Si no se proporciona, devuelve todas las fortalezas del usuario
});

export type GetMaturityLevelsInput = z.infer<typeof getMaturityLevelsSchema>;

/**
 * Result type for maturity level with progress calculation
 */
export interface StrengthMaturityProgress {
	id: string;
	strengthId: string;
	strengthName: string;
	strengthNameEs: string;
	currentLevel: string; // MaturityLevel enum as string
	xpCurrent: number;
	xpTotal: number;
	xpForNextLevel: number | null; // null if max level
	progressPercent: number;
	isMaxLevel: boolean;
	levelReachedAt: Date | null;
}

export interface GetMaturityLevelsResult {
	success: boolean;
	maturityLevels: StrengthMaturityProgress[];
	error?: string;
}
