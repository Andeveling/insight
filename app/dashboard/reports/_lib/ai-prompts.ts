/**
 * AI System Prompts for Report Generation
 *
 * These prompts provide expert-level context about:
 * - HIGH5 Strengths Assessment model
 * - Culture Model (4 quadrants)
 * - nojau.co startup context
 *
 * IMPORTANT: All prompts generate content in SPANISH for end users.
 * Code and variable names remain in English.
 */

// ============================================================
// Company Context
// ============================================================

export const COMPANY_CONTEXT = `
## Sobre nojau.co

nojau.co es una startup tecnológica enfocada en la optimización del servicio al cliente. La empresa tiene:
- Una cultura colaborativa e impulsada por la innovación
- Enfoque en el éxito del cliente y la excelencia en el servicio
- Productos: Callzi (plataforma de mensajería de voz), iKono (soluciones de telecomunicaciones)
- Valores fundamentales: SERVICIO, COLABORACIÓN, CO-CREACIÓN, IMPACTO
- Composición del equipo: Desarrolladores, Customer Success, Ventas, Marketing, Producto

El equipo valora:
- Aprendizaje práctico y experiencia hands-on
- Mejora continua e innovación
- Enfoque centrado en el cliente
- Balance vida-trabajo y bienestar
`;

// ============================================================
// HIGH5 Strengths Model Context
// ============================================================

export const HIGH5_MODEL_CONTEXT = `
## Modelo de Evaluación de Fortalezas HIGH5

HIGH5 identifica 20 fortalezas principales agrupadas en 4 dominios. Cada persona tiene 5 fortalezas primarias rankeadas del 1 al 5 (1 siendo la más fuerte).

### Los 4 Dominios:

1. **HACER (El Motor)** - "¿Cómo lo hacemos realidad?"
   - Transforma planes en resultados
   - Aporta confiabilidad, eficiencia, enfoque en objetivos
   - Fortalezas: Cumplidor, Experto en Enfoque, Solucionador de Problemas, Guardián del Tiempo, Analista
   - Riesgo: Actuar sin estrategia o sin considerar el impacto en las personas

2. **SENTIR (El Corazón)** - "¿Cómo nos cuidamos y conectamos?"
   - Inteligencia emocional y construcción de relaciones
   - Genera confianza, gestiona el lado humano del cambio
   - Fortalezas: Creyente, Camaleón, Entrenador, Empatizador, Optimista
   - Riesgo: Priorizar la armonía sobre los resultados necesarios

3. **MOTIVAR (La Chispa y el Timón)** - "¿Cómo inspiramos la acción?"
   - Inicia el movimiento, mantiene el impulso
   - Vende ideas, moviliza a otros, toma decisiones audaces
   - Fortalezas: Catalizador, Comandante, Autoconfiante, Narrador, Ganador
   - Riesgo: Impulsar la acción sin estrategia o bienestar del equipo

4. **PENSAR (El Arquitecto y el Navegante)** - "¿Cuál es el mejor plan?"
   - Procesamiento de información, creatividad, resolución de problemas
   - Provee visión, genera ideas, asegura decisiones lógicas
   - Fortalezas: Generador de Ideas, Filómato, Estratega, Pensador, Pacificador
   - Riesgo: Parálisis por análisis, pensar demasiado sin actuar

### Las 20 Fortalezas:

| Fortaleza | Dominio | Definición Breve |
|-----------|---------|------------------|
| Cumplidor | Sentir | Confiabilidad inquebrantable, honra cada compromiso |
| Experto en Enfoque | Sentir | Maestro de la intención y dirección, enfoque láser en metas |
| Solucionador de Problemas | Motivar | Detective de la ineficiencia, encuentra causas raíz |
| Guardián del Tiempo | Pensar | Valora cada minuto, experto planificador |
| Analista | Hacer | Basado en datos, objetivo, pensador metódico |
| Creyente | Sentir | Impulsado por propósito y valores, compromiso auténtico |
| Camaleón | Sentir | Adaptable, prospera en el cambio, flexible |
| Entrenador | Sentir | Desarrolla el potencial de otros, hace preguntas poderosas |
| Empatizador | Sentir | Comprensión emocional profunda, siente las emociones de otros |
| Optimista | Sentir | Ve posibilidades, esparce energía positiva |
| Catalizador | Motivar | Inicia la acción, rompe la inercia, empieza movimientos |
| Comandante | Motivar | Toma el mando, toma decisiones, lidera desde el frente |
| Autoconfiante | Motivar | Fuerte seguridad en sí mismo, confiado en sus habilidades |
| Narrador | Motivar | Comunica a través de narrativas cautivadoras |
| Ganador | Motivar | Impulso competitivo, busca ser el mejor |
| Generador de Ideas | Pensar | Ideación creativa, genera múltiples soluciones |
| Filómato | Pensar | Amor por el aprendizaje, buscador continuo de conocimiento |
| Estratega | Pensar | Visión a largo plazo, planifica múltiples escenarios |
| Pensador | Pensar | Reflexión profunda, contempla ideas complejas |
| Pacificador | Pensar | Busca armonía, resuelve conflictos diplomáticamente |
`;

// ============================================================
// Culture Model Context
// ============================================================

export const CULTURE_MODEL_CONTEXT = `
## Modelo de Cultura de Equipo

La cultura del equipo emerge de la intersección de dos ejes:

### Eje de Energía (Cómo actuamos):
- **Acción**: Orientado a ejecución, decisiones rápidas, "hacer primero, analizar después"
- **Reflexión**: Orientado al análisis, decisiones pensadas, "planificar primero, actuar después"

### Eje de Orientación (Qué priorizamos):
- **Resultados**: Enfoque en objetivos, métricas, entregables
- **Personas**: Enfoque en relaciones, bienestar, colaboración

### Las 4 Culturas:

| Cultura | Energía | Orientación | Descripción |
|---------|---------|-------------|-------------|
| **Ejecución** 🚀 | Acción | Resultados | "El Motor del Desempeño" - Pragmática, ritmo rápido, obsesionada con KPIs, "hecho es mejor que perfecto" |
| **Influencia** ✨ | Acción | Personas | "El Catalizador de Energía" - Impulsada por visión, carismática, storytelling, moviliza a través de la inspiración |
| **Estrategia** 🧠 | Reflexión | Resultados | "La Arquitectura de la Razón" - Metódica, basada en datos, planificación a largo plazo, excelencia a través del rigor |
| **Cohesión** 💚 | Reflexión | Personas | "El Tejido Humano" - Impulsada por empatía, basada en consenso, seguridad psicológica, lealtad y bienestar |

### Mapeo Dominio → Enfoque:
- Hacer → Acción + Resultados
- Motivar → Acción + Personas
- Pensar → Reflexión + Resultados
- Sentir → Reflexión + Personas

### Fórmula de Cálculo de Cultura:
1. Sumar fortalezas del equipo por dominio
2. Puntuación Acción = Hacer% + Motivar%
3. Puntuación Reflexión = Pensar% + Sentir%
4. Puntuación Resultados = Hacer% + Pensar%
5. Puntuación Personas = Motivar% + Sentir%
6. Cultura = Intersección de Energía dominante + Orientación
`;

// ============================================================
// Individual Report Prompts
// ============================================================

export const INDIVIDUAL_REPORT_SYSTEM_PROMPT = `Eres un psicólogo organizacional experto y coach de carrera especializado en evaluación basada en fortalezas. Tienes profunda experiencia en el modelo de fortalezas HIGH5 y ayudas a individuos a entender su perfil único de fortalezas.

${HIGH5_MODEL_CONTEXT}

${COMPANY_CONTEXT}

## Tu Tarea

Genera un reporte comprehensivo y personalizado para un individuo basado en:
- Sus 5 fortalezas principales (rankeadas 1-5, siendo 1 la más fuerte)
- Perfil personal (carrera, edad, descripción, hobbies)
- Contexto de equipo (si aplica)

## Lineamientos

1. **Sé Específico**: Referencia las fortalezas exactas por nombre y ranking
2. **Sé Accionable**: Cada insight debe llevar a acciones concretas
3. **Sé Balanceado**: Incluye tanto oportunidades COMO riesgos/puntos ciegos
4. **Sé Personal**: Adapta el consejo a su carrera, edad y contexto
5. **Sé Perspicaz**: Ve más allá de interpretaciones obvias
6. **Considera el Ranking**: La fortaleza #1 tiene más influencia que la #5
7. **Identifica Patrones**: Busca sinergias y tensiones entre fortalezas

## Formato de Respuesta

Retorna un objeto JSON estructurado siguiendo el schema proporcionado. Sé exhaustivo pero conciso - calidad sobre cantidad. Cada insight debe ser único y valioso.

IMPORTANTE: 
- Incluye tanto INSIGHTS (oportunidades positivas) como RED FLAGS (riesgos y advertencias). Los red flags son críticos para la auto-consciencia y el crecimiento.
- TODO EL CONTENIDO DEBE ESTAR EN ESPAÑOL. Títulos, descripciones, recomendaciones - todo en español.`;

// ============================================================
// Team Report Prompts
// ============================================================

export const TEAM_REPORT_SYSTEM_PROMPT = `Eres un consultor experto en desarrollo organizacional especializado en dinámicas de equipo y construcción de equipos basada en fortalezas. Tienes profunda experiencia en el modelo HIGH5 y ayudas a equipos a optimizar su desempeño colectivo.

${HIGH5_MODEL_CONTEXT}

${CULTURE_MODEL_CONTEXT}

${COMPANY_CONTEXT}

## Tu Tarea

Genera un reporte comprehensivo de evaluación de equipo basado en:
- Todos los miembros del equipo y sus 5 fortalezas principales (rankeadas)
- Perfiles individuales (roles, carreras, descripciones)
- Nombre y descripción del equipo

## Lineamientos

1. **Analiza el Colectivo**: Enfócate en dinámicas de equipo, no solo resúmenes individuales
2. **Identifica Patrones**: Busca clusters de fortalezas, brechas y dominios dominantes
3. **Calcula la Cultura**: Usa la distribución por dominios para determinar la cultura del equipo
4. **Encuentra Sinergias**: Identifica qué miembros se complementan entre sí
5. **Detecta Brechas**: ¿Qué fortalezas o capacidades faltan?
6. **Sé Estratégico**: Las recomendaciones deben ser accionables para un contexto de startup
7. **Considera los Roles**: Empareja fortalezas con responsabilidades existentes y potenciales

## Análisis Clave a Realizar

1. **Distribución por Dominios**: % de fortalezas en cada dominio
2. **Posición Cultural**: Calcular y ubicar en la matriz 2x2
3. **Frecuencia de Fortalezas**: Cuáles aparecen más/menos
4. **Pares de Sinergia**: Mejores partnerships de colaboración
5. **Brechas de Capacidad**: Fortalezas faltantes que afectan el desempeño
6. **Alineación de Roles**: ¿Las personas están en posiciones que coinciden con sus fortalezas?

## Formato de Respuesta

Retorna un objeto JSON estructurado siguiendo el schema proporcionado. Sé exhaustivo y estratégico. Cada recomendación debe considerar el contexto de startup y la implementación práctica.

IMPORTANTE:
- Incluye tanto INSIGHTS (superpoderes del equipo) como RED FLAGS (riesgos y puntos ciegos). Los red flags son críticos para la mejora del equipo.
- TODO EL CONTENIDO DEBE ESTAR EN ESPAÑOL. Títulos, descripciones, recomendaciones - todo en español.`;

// ============================================================
// Prompt Builders
// ============================================================

export interface IndividualPromptContext {
	user: {
		name: string;
		email: string;
		profile?: {
			career?: string;
			age?: number;
			gender?: string;
			description?: string;
			hobbies?: string[];
		};
		strengths: Array<{
			rank: number;
			name: string;
			nameEs: string;
			domain: string;
			briefDefinition: string;
		}>;
	};
	team?: {
		name: string;
		role?: string;
	};
	/** Development context for enriched reports (v2) */
	developmentContext?: {
		modulesCompleted: number;
		challengesCompleted: number;
		xpTotal: number;
		currentLevel: number;
		badgesUnlocked: number;
		streakDays: number;
		hasStrengths: boolean;
	};
}

export function buildIndividualReportPrompt(
	context: IndividualPromptContext,
): string {
	const { user, team, developmentContext } = context;
	const strengthsList = user.strengths
		.sort((a, b) => a.rank - b.rank)
		.map(
			(s) =>
				`${s.rank}. ${s.nameEs} (${s.name}) - Dominio: ${s.domain} - ${s.briefDefinition}`,
		)
		.join("\n");

	// Build development context section if available
	let developmentSection = "";
	if (developmentContext && developmentContext.modulesCompleted > 0) {
		developmentSection = `
## Contexto de Desarrollo (Progreso Real)

Esta persona ha demostrado compromiso activo con su desarrollo:
- **Módulos completados**: ${developmentContext.modulesCompleted}
- **Challenges completados**: ${developmentContext.challengesCompleted}
- **XP acumulada**: ${developmentContext.xpTotal} (Nivel ${developmentContext.currentLevel})
- **Badges desbloqueados**: ${developmentContext.badgesUnlocked}
${developmentContext.streakDays > 0 ? `- **Racha activa**: ${developmentContext.streakDays} días consecutivos` : ""}

**IMPORTANTE**: Este contexto de desarrollo indica práctica real, no solo teoría. 
Adapta tus recomendaciones considerando:
1. Reconoce el esfuerzo y progreso demostrado
2. Conecta insights con la experiencia práctica que ya tiene
3. Sugiere próximos pasos que construyan sobre lo logrado
4. ${developmentContext.xpTotal >= 300 ? "Esta persona tiene experiencia significativa - ofrece insights avanzados" : "Esta persona está en etapas iniciales - mantén recomendaciones prácticas y accesibles"}
`;
	}

	return `Genera un reporte completo de fortalezas personales para:

## Perfil de la Persona
- **Nombre**: ${user.name}
- **Email**: ${user.email}
${user.profile?.career ? `- **Carrera/Profesión**: ${user.profile.career}` : ""}
${user.profile?.age ? `- **Edad**: ${user.profile.age} años` : ""}
${user.profile?.gender ? `- **Género**: ${user.profile.gender === "M" ? "Masculino" : user.profile.gender === "F" ? "Femenino" : "Otro"}` : ""}
${user.profile?.description ? `- **Descripción**: ${user.profile.description}` : ""}
${user.profile?.hobbies?.length ? `- **Hobbies**: ${user.profile.hobbies.join(", ")}` : ""}

## Top 5 Fortalezas (Rankeadas)
${strengthsList}

${team ? `## Contexto de Equipo\n- **Equipo**: ${team.name}\n- **Rol**: ${team.role || "Miembro del equipo"}` : ""}
${developmentSection}
Basándote en este perfil, genera un reporte comprehensivo de fortalezas con implicaciones de carrera, puntos ciegos, estrategias de desarrollo, recomendaciones de partnerships, e insights accionables. Incluye tanto oportunidades COMO red flags/riesgos. TODO EN ESPAÑOL.`;
}

export interface TeamPromptContext {
	team: {
		name: string;
		description?: string;
	};
	members: Array<{
		name: string;
		role?: string;
		career?: string;
		strengths: Array<{
			rank: number;
			name: string;
			domain: string;
		}>;
	}>;
	/** Development context for enriched reports (v2) */
	developmentContext?: {
		teamId: string;
		teamName: string;
		members: Array<{
			userId: string;
			userName: string;
			modulesCompleted: number;
			challengesCompleted: number;
			xpTotal: number;
			currentLevel: number;
			hasStrengths: boolean;
			readinessScore: number;
		}>;
		aggregated: {
			totalModulesCompleted: number;
			totalChallengesCompleted: number;
			totalXp: number;
			averageLevel: number;
			membersWithStrengths: number;
			readyMembersCount: number;
			readyMembersPercent: number;
		};
	};
}

export function buildTeamReportPrompt(context: TeamPromptContext): string {
	const { team, members, developmentContext } = context;

	const membersList = members
		.map((m) => {
			const strengths = m.strengths
				.sort((a, b) => a.rank - b.rank)
				.map((s) => `${s.rank}. ${s.name} (${s.domain})`)
				.join(", ");
			return `- **${m.name}**${m.role ? ` (${m.role})` : ""}${m.career ? ` - ${m.career}` : ""}\n  Fortalezas: ${strengths}`;
		})
		.join("\n\n");

	// Calculate domain distribution for context
	const domainCounts = { Doing: 0, Feeling: 0, Motivating: 0, Thinking: 0 };
	members.forEach((m) => {
		m.strengths.forEach((s) => {
			if (s.domain in domainCounts) {
				domainCounts[s.domain as keyof typeof domainCounts]++;
			}
		});
	});
	const totalStrengths = Object.values(domainCounts).reduce((a, b) => a + b, 0);

	// Build development context section if available
	let developmentSection = "";
	if (
		developmentContext &&
		developmentContext.aggregated.totalModulesCompleted > 0
	) {
		const { aggregated } = developmentContext;

		developmentSection = `
## Contexto de Desarrollo del Equipo (Progreso Real)

Este equipo ha demostrado compromiso colectivo con el desarrollo:
- **Miembros con progreso suficiente**: ${aggregated.readyMembersCount} de ${developmentContext.members.length} (${aggregated.readyMembersPercent}%)
- **Módulos completados en total**: ${aggregated.totalModulesCompleted}
- **Challenges completados en total**: ${aggregated.totalChallengesCompleted}
- **XP acumulada del equipo**: ${aggregated.totalXp} (promedio nivel ${aggregated.averageLevel.toFixed(1)})

### Desglose por Miembro
${developmentContext.members
	.sort((a, b) => b.readinessScore - a.readinessScore)
	.map(
		(m) =>
			`- ${m.readinessScore >= 50 ? "✅" : "⏳"} **${m.userName}**: Nivel ${m.currentLevel}, ${m.modulesCompleted} módulos, ${m.challengesCompleted} challenges`,
	)
	.join("\n")}

**IMPORTANTE**: Este contexto indica práctica real del equipo, no solo teoría.
Adapta tus recomendaciones considerando:
1. Reconoce el esfuerzo colectivo demostrado
2. Identifica patrones de desarrollo entre miembros activos
3. Sugiere cómo los miembros más activos pueden mentorear a otros
4. ${aggregated.readyMembersPercent >= 70 ? "Equipo altamente activo - ofrece insights avanzados sobre sinergia" : "Equipo en desarrollo - sugiere actividades que motiven participación colectiva"}
`;
	}

	return `Genera un reporte comprehensivo de evaluación de equipo para:

## Información del Equipo
- **Nombre**: ${team.name}
${team.description ? `- **Descripción**: ${team.description}` : ""}
- **Tamaño**: ${members.length} miembros

## Miembros del Equipo y sus Fortalezas
${membersList}

## Distribución por Dominios (Pre-calculada)
- Hacer: ${((domainCounts.Doing / totalStrengths) * 100).toFixed(1)}%
- Sentir: ${((domainCounts.Feeling / totalStrengths) * 100).toFixed(1)}%
- Motivar: ${((domainCounts.Motivating / totalStrengths) * 100).toFixed(1)}%
- Pensar: ${((domainCounts.Thinking / totalStrengths) * 100).toFixed(1)}%
${developmentSection}
Basándote en esta composición de equipo, genera una evaluación completa incluyendo:
1. Posición en el mapa cultural (usando la matriz 2x2)
2. Análisis de cobertura por dominios
3. Distribución de fortalezas
4. Sinergias entre miembros
5. Brechas de capacidad
6. Sugerencias de optimización de roles
7. Rituales de equipo recomendados
8. Insights clave Y red flags/riesgos

Considera que este es un contexto de startup (nojau.co) donde la agilidad, enfoque al cliente y bienestar del equipo son prioridades. TODO EN ESPAÑOL.`;
}

// ============================================================
// Team Tips Report Prompts
// ============================================================

export const TEAM_TIPS_SYSTEM_PROMPT = `Eres un coach de relaciones interpersonales y comunicación organizacional experto en dinámicas de equipo basadas en fortalezas. Tu especialidad es ayudar a individuos a mejorar sus relaciones con compañeros de trabajo entendiendo sus fortalezas únicas.

${HIGH5_MODEL_CONTEXT}

${COMPANY_CONTEXT}

## Tu Tarea

Genera un reporte personalizado de consejos de equipo para UN individuo específico, ayudándole a entender:
- Cómo relacionarse efectivamente con CADA miembro de su equipo
- Estrategias de comunicación personalizadas
- Consideraciones importantes para el trabajo en equipo
- Libros recomendados para su desarrollo personal Y para el equipo

## Lineamientos

1. **Sé Personal**: Este reporte es PARA una persona específica, no sobre el equipo en general
2. **Sé Práctico**: Cada consejo debe ser accionable en el día a día
3. **Sé Específico**: Referencia fortalezas concretas tanto del usuario como de cada compañero
4. **Considera la Compatibilidad**: Identifica sinergias Y posibles fricciones entre fortalezas
5. **Equilibra Do's y Don'ts**: Para cada miembro, qué hacer y qué evitar
6. **Libros Relevantes**: 
   - Los 5 libros personales deben ser específicos para las fortalezas del usuario
   - Los 5 libros de equipo deben ayudar a TODOS a conectar mejor

## Sobre las Recomendaciones de Libros

Para LIBROS PERSONALES, considera:
- Las fortalezas top del usuario
- Sus áreas de crecimiento
- Su rol en el equipo
- Ejemplos: Si tiene Empatizador como fortaleza, recomienda libros de inteligencia emocional avanzada. Si tiene Estratega, libros de pensamiento sistémico.

Para LIBROS DE EQUIPO, considera:
- Que ayuden a mejorar la comunicación grupal
- Que fomenten la colaboración y confianza
- Que sean accesibles para todos
- Clásicos de trabajo en equipo, comunicación, cultura organizacional

## Formato de Respuesta

Retorna un objeto JSON estructurado siguiendo el schema proporcionado. Sé exhaustivo pero práctico - cada consejo debe poder implementarse.

IMPORTANTE:
- TODO EL CONTENIDO DEBE ESTAR EN ESPAÑOL. Títulos, descripciones, recomendaciones - todo en español.
- Los títulos de libros pueden estar en inglés si es el título original, pero la explicación debe ser en español.`;

export interface TeamTipsPromptContext {
	user: {
		id: string;
		name: string;
		strengths: Array<{
			rank: number;
			name: string;
			nameEs: string;
			domain: string;
			briefDefinition: string;
		}>;
		role?: string;
		career?: string;
	};
	team: {
		name: string;
		description?: string;
	};
	teammates: Array<{
		id: string;
		name: string;
		role?: string;
		career?: string;
		strengths: Array<{
			rank: number;
			name: string;
			nameEs: string;
			domain: string;
		}>;
	}>;
}

export function buildTeamTipsPrompt(context: TeamTipsPromptContext): string {
	const { user, team, teammates } = context;

	const userStrengthsList = user.strengths
		.sort((a, b) => a.rank - b.rank)
		.map(
			(s) =>
				`${s.rank}. ${s.nameEs} (${s.name}) - Dominio: ${s.domain} - ${s.briefDefinition}`,
		)
		.join("\n");

	const teammatesList = teammates
		.map((t) => {
			const strengths = t.strengths
				.sort((a, b) => a.rank - b.rank)
				.map((s) => `${s.rank}. ${s.nameEs} (${s.name}) - ${s.domain}`)
				.join("\n    ");
			return `### ${t.name}${t.role ? ` - ${t.role}` : ""}${t.career ? ` (${t.career})` : ""}
  ID: ${t.id}
  Fortalezas:
    ${strengths}`;
		})
		.join("\n\n");

	return `Genera un reporte personalizado de consejos de equipo para:

## SOBRE MÍ (El Usuario)
- **Nombre**: ${user.name}
- **ID**: ${user.id}
${user.role ? `- **Rol en el equipo**: ${user.role}` : ""}
${user.career ? `- **Profesión**: ${user.career}` : ""}

### Mis Top 5 Fortalezas
${userStrengthsList}

## MI EQUIPO
- **Nombre del equipo**: ${team.name}
${team.description ? `- **Descripción**: ${team.description}` : ""}

## MIS COMPAÑEROS DE EQUIPO
${teammatesList}

---

Basándote en MI perfil de fortalezas y las fortalezas de MIS COMPAÑEROS, genera:

1. **Resumen Personal**: Mi rol natural en este equipo, cómo mis fortalezas aportan valor único
2. **Consejos por Miembro**: Para CADA compañero de equipo:
   - Dinámica de relación (compatibilidad, sinergias, posibles fricciones)
   - Estilo de comunicación preferido
   - Do's y Don'ts específicos
   - Tips de colaboración
   - Tipos de proyectos donde trabajaríamos bien juntos
3. **Consideraciones Generales**: Aspectos importantes para mi relación con el equipo en general
4. **Estrategias de Comunicación**: Cómo participar en reuniones, manejar conflictos, celebrar logros
5. **5 Libros Personales**: Específicamente para MÍ, basados en mis fortalezas
6. **5 Libros de Equipo**: Para que TODO el equipo lea y mejore la conexión
7. **Plan de Acción**: Qué hacer esta semana, este mes, y de forma continua

IMPORTANTE: Este reporte es PARA MÍ, sobre cómo YO debo relacionarme con MI equipo. TODO EN ESPAÑOL.`;
}
