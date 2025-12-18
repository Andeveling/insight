"use server";

/**
 * Get Cultures Action
 *
 * Fetches cultures from the database with their focus relationships
 */

import { connection } from "next/server";
import { prisma } from "@/lib/prisma.db";
import type { CultureType } from "@/lib/utils/culture-calculator";

export interface CultureWithFocuses {
	id: string;
	name: string;
	nameEs: string;
	subtitle: string;
	description: string;
	attributes: string;
	icon: string | null;
	color: string;
	focusEnergy: {
		name: string;
		nameEs: string;
	};
	focusOrientation: {
		name: string;
		nameEs: string;
	};
}

/**
 * Get all cultures from database with their focuses
 */
export async function getAllCultures(): Promise<CultureWithFocuses[]> {
	await connection();

	const cultures = await prisma.culture.findMany({
		include: {
			focusEnergy: {
				select: {
					name: true,
					nameEs: true,
				},
			},
			focusOrientation: {
				select: {
					name: true,
					nameEs: true,
				},
			},
		},
		orderBy: {
			name: "asc",
		},
	});

	return cultures;
}

/**
 * Get a specific culture by name
 */
export async function getCultureByName(
	name: CultureType,
): Promise<CultureWithFocuses | null> {
	await connection();

	const culture = await prisma.culture.findUnique({
		where: { name },
		include: {
			focusEnergy: {
				select: {
					name: true,
					nameEs: true,
				},
			},
			focusOrientation: {
				select: {
					name: true,
					nameEs: true,
				},
			},
		},
	});

	return culture;
}

/**
 * Transform database culture to component format
 */
function transformCultureForDisplay(culture: CultureWithFocuses) {
	const attributes = culture.attributes ? JSON.parse(culture.attributes) : [];

	return {
		name: culture.name as CultureType,
		nameEs: culture.nameEs,
		subtitle: culture.subtitle,
		description: culture.description,
		focusLabel: `${culture.focusEnergy.nameEs} + ${culture.focusOrientation.nameEs}`,
		attributes,
		icon: culture.icon || "📊",
		color: culture.color,
	};
}

/**
 * Get all cultures formatted for display
 */
export async function getAllCulturesForDisplay() {
	const cultures = await getAllCultures();
	return cultures.map(transformCultureForDisplay);
}
