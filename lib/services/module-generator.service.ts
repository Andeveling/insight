/**
 * Module Generator Service
 *
 * AI-powered generation of personalized development modules
 * based on user's professional profile and selected strength.
 */

import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { prisma } from "@/lib/prisma.db";

// Initialize OpenAI client
const openai = createOpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Model used for module generation
 */
const MODULE_GENERATION_MODEL = "gpt-4o-mini";

/**
 * Zod schema for generated module content validation
 */
const GeneratedModuleSchema = z.object({
	titleEs: z.string().min(5).max(150),
	descriptionEs: z.string().min(10).max(400),
	content: z.string().min(200).max(8000),
	estimatedMinutes: z.number().int().min(15).max(180),
	challenges: z
		.array(
			z.object({
				titleEs: z.string().min(5).max(150),
				descriptionEs: z.string().min(10).max(600),
				type: z.enum(["reflection", "action", "collaboration"]),
			}),
		)
		.min(2)
		.max(5),
});

export type GeneratedModuleContent = z.infer<typeof GeneratedModuleSchema>;

/**
 * Team context for realistic collaborative challenges
 */
interface TeamContext {
	hasTeam: boolean;
	teamSize: number;
	teamName?: string | null;
	roles: string[];
	memberCount: number;
}

/**
 * Context for module generation
 */
interface GenerationContext {
	userId: string;
	strengthKey: string;
	professionalProfile: {
		roleStatus: string;
		currentRole?: string | null;
		industryContext?: string | null;
		careerGoals?: string[] | null;
	};
	teamContext: TeamContext;
	existingModuleTitles: string[];
}

/**
 * Generate a personalized module using AI
 */
export async function generatePersonalizedModuleContent(
	context: GenerationContext,
): Promise<GeneratedModuleContent> {
	// Fetch strength details from database
	const strength = await prisma.strength.findFirst({
		where: { name: context.strengthKey },
		include: { domain: true },
	});

	if (!strength) {
		throw new Error(`Fortaleza no encontrada: ${context.strengthKey}`);
	}

	const goalsText = context.professionalProfile.careerGoals?.length
		? context.professionalProfile.careerGoals.join(", ")
		: "desarrollo profesional general";

	const roleContext = context.professionalProfile.currentRole
		? `Su rol actual es: ${context.professionalProfile.currentRole}.`
		: "";

	const industryContext = context.professionalProfile.industryContext
		? `Trabaja en el sector: ${context.professionalProfile.industryContext}.`
		: "";

	const satisfactionContext = getSatisfactionContext(
		context.professionalProfile.roleStatus,
	);

	const existingModulesWarning =
		context.existingModuleTitles.length > 0
			? `IMPORTANTE: Ya existen los siguientes módulos, NO repitas estos temas: ${context.existingModuleTitles.join(", ")}.`
			: "";

	// Build team context for realistic collaborative challenges
	const teamContextText = buildTeamContextText(context.teamContext);

	const systemPrompt = `Eres un coach de desarrollo profesional especializado en fortalezas.
Tu tarea es crear un módulo de aprendizaje personalizado para desarrollar la fortaleza "${strength.nameEs}" (${strength.briefDefinition}).

El módulo debe:
1. Ser práctico y aplicable al contexto profesional del usuario
2. Incluir ejercicios reflexivos y acciones concretas
3. Estar escrito en español, con tono motivador pero profesional
4. Tener contenido en formato Markdown con secciones claras
5. Incluir 2-5 desafíos prácticos variados
6. Duración estimada entre 30-120 minutos (usa estimatedMinutes entre 30 y 120)

${teamContextText}

${existingModulesWarning}`;

	const userPrompt = `Crea un módulo de desarrollo personalizado con las siguientes características:

**Fortaleza a desarrollar**: ${strength.nameEs}
**Descripción de la fortaleza**: ${strength.briefDefinition}

**Perfil del usuario**:
- Estado de satisfacción laboral: ${satisfactionContext}
${roleContext}
${industryContext}
- Metas profesionales: ${goalsText}
${context.teamContext.hasTeam ? `- Equipo: ${context.teamContext.teamName || "Sin nombre"} (${context.teamContext.memberCount} miembros)` : "- Sin equipo asignado"}

Genera un módulo único y personalizado que ayude a potenciar esta fortaleza en el contexto específico del usuario.`;

	const { object: generatedModule } = await generateObject({
		model: openai(MODULE_GENERATION_MODEL),
		schema: GeneratedModuleSchema,
		system: systemPrompt,
		prompt: userPrompt,
		temperature: 0.7,
	});

	return generatedModule;
}

/**
 * Create personalized module in database
 */
export async function createPersonalizedModule(
	userId: string,
	strengthKey: string,
	content: GeneratedModuleContent,
): Promise<{ moduleId: string }> {
	// Generate unique key
	const moduleKey = `personalized-${strengthKey}-${userId.slice(0, 8)}-${Date.now()}`;

	// Create module with challenges in transaction
	const createdModule = await prisma.$transaction(async (tx) => {
		// Count existing challenges to calculate XP
		const challengeCount = content.challenges.length;
		const baseXp = 100;
		const challengeXp = challengeCount * 25;
		const totalXp = baseXp + challengeXp;

		// Create the module
		const newModule = await tx.developmentModule.create({
			data: {
				key: moduleKey,
				titleEs: content.titleEs,
				descriptionEs: content.descriptionEs,
				content: content.content,
				estimatedMinutes: content.estimatedMinutes,
				xpReward: totalXp,
				level: "intermediate", // Personalized modules are intermediate level
				strengthKey: strengthKey,
				moduleType: "personalized",
				userId: userId,
				generatedBy: MODULE_GENERATION_MODEL,
				isActive: true,
				order: 999, // Personalized modules appear at end
			},
		});

		// Create challenges
		for (let i = 0; i < content.challenges.length; i++) {
			const challenge = content.challenges[i];
			await tx.challenge.create({
				data: {
					moduleId: newModule.id,
					titleEs: challenge.titleEs,
					descriptionEs: challenge.descriptionEs,
					type: challenge.type,
					xpReward: 25,
					order: i,
				},
			});
		}

		return newModule;
	});

	return { moduleId: createdModule.id };
}

/**
 * Check if user can generate a new module for a specific strength
 *
 * Changed from per-user to per-strength validation:
 * - Users can have one pending module per strength
 * - This allows generating modules for different strengths simultaneously
 */
export async function canUserGenerateModule(
	userId: string,
	strengthKey?: string,
): Promise<{
	canGenerate: boolean;
	reason?: "pending_modules" | "daily_limit" | "no_profile";
	pendingModules?: Array<{
		id: string;
		titleEs: string;
		strengthKey?: string | null;
		percentComplete: number;
	}>;
	message?: string;
}> {
	// Check if user has professional profile
	const profile = await prisma.userProfessionalProfile.findUnique({
		where: { userId },
	});

	if (!profile || (!profile.completedAt && !profile.skippedAt)) {
		return {
			canGenerate: false,
			reason: "no_profile",
			message:
				"Completa tu perfil profesional para generar módulos personalizados",
		};
	}

	// Build where clause - filter by strengthKey if provided
	const strengthFilter = strengthKey ? { strengthKey } : {};

	// Check for pending personalized modules (not completed)
	const pendingModules = await prisma.developmentModule.findMany({
		where: {
			userId,
			moduleType: "personalized",
			isArchived: false,
			...strengthFilter,
			userProgress: {
				some: {
					userId,
					status: {
						in: ["not_started", "in_progress"],
					},
				},
			},
		},
		include: {
			userProgress: {
				where: { userId },
				select: {
					status: true,
					completedChallenges: true,
					totalChallenges: true,
				},
			},
		},
	});

	// Also check modules without any progress record (never started)
	const modulesWithoutProgress = await prisma.developmentModule.findMany({
		where: {
			userId,
			moduleType: "personalized",
			isArchived: false,
			...strengthFilter,
			userProgress: {
				none: { userId },
			},
		},
	});

	const allPendingModules = [
		...pendingModules.map((m) => ({
			id: m.id,
			titleEs: m.titleEs,
			strengthKey: m.strengthKey,
			percentComplete: m.userProgress[0]
				? (m.userProgress[0].completedChallenges /
						m.userProgress[0].totalChallenges) *
					100
				: 0,
		})),
		...modulesWithoutProgress.map((m) => ({
			id: m.id,
			titleEs: m.titleEs,
			strengthKey: m.strengthKey,
			percentComplete: 0,
		})),
	];

	if (allPendingModules.length > 0) {
		const strengthMessage = strengthKey
			? `Ya tienes un módulo pendiente para esta fortaleza. Complétalo antes de generar otro.`
			: `Completa los módulos pendientes antes de generar uno nuevo`;

		return {
			canGenerate: false,
			reason: "pending_modules",
			pendingModules: allPendingModules,
			message: strengthMessage,
		};
	}

	return { canGenerate: true };
}

/**
 * Get existing personalized module titles for a user's strength
 * to avoid duplicate content
 */
export async function getExistingModuleTitles(
	userId: string,
	strengthKey: string,
): Promise<string[]> {
	const modules = await prisma.developmentModule.findMany({
		where: {
			userId,
			strengthKey,
			moduleType: "personalized",
			isArchived: false,
		},
		select: { titleEs: true },
	});

	return modules.map((m) => m.titleEs);
}

/**
 * Get user-friendly satisfaction context text
 */
function getSatisfactionContext(roleStatus: string): string {
	switch (roleStatus) {
		case "satisfied":
			return "Está satisfecho con su rol actual y busca potenciar sus fortalezas";
		case "partially_satisfied":
			return "Está parcialmente satisfecho y busca mejorar aspectos de su rol";
		case "unsatisfied":
			return "Busca un cambio significativo en su carrera profesional";
		default:
			return "Está explorando opciones de desarrollo profesional";
	}
}

/**
 * Build team context text for AI prompt
 * Ensures collaborative challenges are realistic for the user's team size
 */
function buildTeamContextText(teamContext: TeamContext): string {
	if (!teamContext.hasTeam) {
		return `IMPORTANTE SOBRE DESAFÍOS DE COLABORACIÓN:
El usuario NO pertenece a ningún equipo. Para desafíos de tipo "collaboration":
- Enfócate en colaboración con stakeholders externos, mentores, o comunidades profesionales
- Evita desafíos que requieran compañeros de equipo o departamentos internos
- Sugiere networking externo, comunidades online, o colaboración con clientes/proveedores`;
	}

	const rolesList = teamContext.roles.filter(Boolean);
	const uniqueRoles = [...new Set(rolesList)];

	return `IMPORTANTE SOBRE DESAFÍOS DE COLABORACIÓN:
El usuario pertenece a un equipo de ${teamContext.memberCount} personas${teamContext.teamName ? ` llamado "${teamContext.teamName}"` : ""}.
${uniqueRoles.length > 0 ? `Roles en el equipo: ${uniqueRoles.join(", ")}` : "No hay roles definidos en el equipo."}

Para desafíos de tipo "collaboration":
- Sé realista: si el equipo tiene ${teamContext.memberCount} personas, NO pidas colaborar con "3 personas de diferentes departamentos"
- Enfócate en colaboración dentro del equipo existente
- Si necesitas colaboración externa, sugiere máximo 1-2 personas fuera del equipo
- Adapta los números a la realidad del equipo (ej: "colabora con 1-2 compañeros" no "conecta con 5 colegas")`;
}

/**
 * Get team context for a user
 * Returns information about team size, roles, and composition
 */
export async function getUserTeamContext(userId: string): Promise<TeamContext> {
	const teamMember = await prisma.teamMember.findFirst({
		where: { userId },
		include: {
			team: {
				include: {
					members: {
						select: {
							role: true,
							userId: true,
						},
					},
				},
			},
		},
	});

	if (!teamMember?.team) {
		return {
			hasTeam: false,
			teamSize: 0,
			teamName: null,
			roles: [],
			memberCount: 0,
		};
	}

	const team = teamMember.team;
	const roles = team.members
		.map((m) => m.role)
		.filter((role): role is string => role !== null);

	return {
		hasTeam: true,
		teamSize: team.members.length,
		teamName: team.name,
		roles,
		memberCount: team.members.length,
	};
}
