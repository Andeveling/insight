/**
 * Module Generator Service
 *
 * AI-powered generation of personalized development modules
 * based on user's professional profile and selected strength.
 */

import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
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
  titleEs: z.string().min(5).max(100),
  descriptionEs: z.string().min(20).max(300),
  content: z.string().min(500).max(5000),
  estimatedMinutes: z.number().min(10).max(60),
  challenges: z.array(
    z.object({
      titleEs: z.string().min(5).max(100),
      descriptionEs: z.string().min(20).max(500),
      type: z.enum([ "reflection", "action", "collaboration" ]),
    })
  ).min(2).max(5),
});

export type GeneratedModuleContent = z.infer<typeof GeneratedModuleSchema>;

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
  existingModuleTitles: string[];
}

/**
 * Generate a personalized module using AI
 */
export async function generatePersonalizedModuleContent(
  context: GenerationContext
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
    context.professionalProfile.roleStatus
  );

  const existingModulesWarning =
    context.existingModuleTitles.length > 0
      ? `IMPORTANTE: Ya existen los siguientes módulos, NO repitas estos temas: ${context.existingModuleTitles.join(", ")}.`
      : "";

  const systemPrompt = `Eres un coach de desarrollo profesional especializado en fortalezas.
Tu tarea es crear un módulo de aprendizaje personalizado para desarrollar la fortaleza "${strength.nameEs}" (${strength.briefDefinition}).

El módulo debe:
1. Ser práctico y aplicable al contexto profesional del usuario
2. Incluir ejercicios reflexivos y acciones concretas
3. Estar escrito en español, con tono motivador pero profesional
4. Tener contenido en formato Markdown con secciones claras
5. Incluir 2-5 desafíos prácticos variados

${existingModulesWarning}`;

  const userPrompt = `Crea un módulo de desarrollo personalizado con las siguientes características:

**Fortaleza a desarrollar**: ${strength.nameEs}
**Descripción de la fortaleza**: ${strength.briefDefinition}

**Perfil del usuario**:
- Estado de satisfacción laboral: ${satisfactionContext}
${roleContext}
${industryContext}
- Metas profesionales: ${goalsText}

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
  content: GeneratedModuleContent
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
      const challenge = content.challenges[ i ];
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
 * Check if user can generate a new module
 */
export async function canUserGenerateModule(
  userId: string
): Promise<{
  canGenerate: boolean;
  reason?: "pending_modules" | "daily_limit" | "no_profile";
  pendingModules?: Array<{
    id: string;
    titleEs: string;
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
      message: "Completa tu perfil profesional para generar módulos personalizados",
    };
  }

  // Check for pending personalized modules (not completed)
  const pendingModules = await prisma.developmentModule.findMany({
    where: {
      userId,
      moduleType: "personalized",
      isArchived: false,
      userProgress: {
        some: {
          userId,
          status: {
            in: [ "not_started", "in_progress" ],
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
      userProgress: {
        none: { userId },
      },
    },
  });

  const allPendingModules = [
    ...pendingModules.map((m) => ({
      id: m.id,
      titleEs: m.titleEs,
      percentComplete: m.userProgress[ 0 ]
        ? (m.userProgress[ 0 ].completedChallenges / m.userProgress[ 0 ].totalChallenges) * 100
        : 0,
    })),
    ...modulesWithoutProgress.map((m) => ({
      id: m.id,
      titleEs: m.titleEs,
      percentComplete: 0,
    })),
  ];

  if (allPendingModules.length > 0) {
    return {
      canGenerate: false,
      reason: "pending_modules",
      pendingModules: allPendingModules,
      message: `Completa los módulos pendientes antes de generar uno nuevo`,
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
  strengthKey: string
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
