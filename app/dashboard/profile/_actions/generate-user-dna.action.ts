"use server";

import { generateObject } from "ai";
import { revalidatePath } from "next/cache";
import { getModel } from "@/lib/ai";
import { prisma } from "@/lib/prisma.db";
import { UserDnaSchema } from "@/lib/types";

export async function generateUserDna(userId: string) {
	// 1. Fetch user data
	const user = await prisma.user.findUnique({
		where: { id: userId },
		include: {
			userStrengths: {
				include: {
					strength: {
						include: {
							domain: true,
						},
					},
				},
				orderBy: {
					rank: "asc",
				},
			},
			profile: true,
		},
	});

	if (!user) throw new Error("User not found");
	if (user.userStrengths.length < 5)
		throw new Error("User needs 5 strengths to generate DNA");

	// 2. Prepare prompt input
	const input = {
		userId: user.id,
		userName: user.name,
		topFiveStrengths: user.userStrengths.map((us) => ({
			name: us.strength.name,
			spanishName: us.strength.nameEs,
			domain: us.strength.domain.name,
			description: us.strength.briefDefinition,
		})),
		userContext: {
			role: user.profile?.career || "Professional",
		},
	};

	// 3. Generate DNA
	const { object } = await generateObject({
		model: getModel("individual"),
		schema: UserDnaSchema,
		prompt: `
      Genera el ADN del Usuario basado en sus fortalezas HIGH5.
      
      Datos del usuario:
      ${JSON.stringify(input, null, 2)}
      
      Genera un perfil inspirador, personalizado y coherente.
    `,
		system: `Eres un experto en psicología organizacional y análisis de fortalezas HIGH5.
    Tu objetivo es generar una descripción única y coherente del "ADN del Usuario".
    
    Estructura requerida:
    1. Título del ADN (Frase corta y memorable, ej: "Estratega Emocional...")
    2. Resumen Ejecutivo (Síntesis coherente de cómo se combinan las fortalezas)
    3. Análisis por Dimensiones (Agrupa fortalezas en Pensamiento, Acción, Conexión, Propósito)
    4. Fortalezas Sinérgicas (Cómo pares de fortalezas crean un efecto multiplicador)
    5. Rol Ideal (Desafíos y contribuciones clave)
    6. Reflexión de Propósito (Frase inspiradora)
    
    Usa un tono inspirador, auténtico y directo. Evita clichés y jerga corporativa vacía.
    Responde en Español.
    `,
	});

	// 4. Save to DB
	const data = {
		title: object.title,
		summary: object.summary,
		dimensions: JSON.stringify(object.dimensions),
		synergies: JSON.stringify(object.synergies),
		idealRole: JSON.stringify(object.idealRole),
		purpose: object.purpose,
	};

	const existingDna = await prisma.userDNA.findUnique({
		where: { userId },
	});

	if (existingDna) {
		await prisma.userDNA.update({
			where: { userId },
			data,
		});
	} else {
		await prisma.userDNA.create({
			data: {
				userId,
				...data,
			},
		});
	}

	revalidatePath("/dashboard/profile");
	return object;
}
