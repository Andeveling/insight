/**
 * Challenges Seed Data
 *
 * Contains challenges organized by module.
 * Each challenge has a type (reflection, action, collaboration) and XP reward.
 */

export interface ChallengeData {
	moduleKey: string;
	titleEs: string;
	descriptionEs: string;
	type: "reflection" | "action" | "collaboration";
	xpReward: number;
	order: number;
}

export const challengesData: ChallengeData[] = [
	// ============================================================================
	// DOING FOUNDATIONS (doing-foundations)
	// ============================================================================
	{
		moduleKey: "doing-foundations",
		titleEs: "Reflexión: Tu Relación con la Acción",
		descriptionEs:
			"Escribe 3 ejemplos recientes donde transformaste una idea en acción concreta. ¿Qué te motivó a actuar?",
		type: "reflection",
		xpReward: 25,
		order: 1,
	},
	{
		moduleKey: "doing-foundations",
		titleEs: "Acción: Inventario de Proyectos",
		descriptionEs:
			"Haz una lista de todos tus proyectos activos. Clasifícalos por estado: iniciado, en progreso, bloqueado, casi terminado.",
		type: "action",
		xpReward: 30,
		order: 2,
	},
	{
		moduleKey: "doing-foundations",
		titleEs: "Colaboración: Entrevista a un Ejecutor",
		descriptionEs:
			"Encuentra a alguien conocido por su capacidad de ejecución. Pregúntale cuál es su secreto para terminar lo que empieza.",
		type: "collaboration",
		xpReward: 50,
		order: 3,
	},

	// ============================================================================
	// DELIVERER MASTERY (deliverer-mastery)
	// ============================================================================
	{
		moduleKey: "deliverer-mastery",
		titleEs: "Reflexión: El Peso de la Promesa",
		descriptionEs:
			"Recuerda una promesa que no pudiste cumplir. ¿Cómo te sentiste? ¿Qué aprendiste sobre tus límites?",
		type: "reflection",
		xpReward: 25,
		order: 1,
	},
	{
		moduleKey: "deliverer-mastery",
		titleEs: "Acción: El Registro de Compromisos",
		descriptionEs:
			"Durante una semana, documenta CADA promesa que hagas (grande o pequeña). Al final, evalúa tu tasa de cumplimiento.",
		type: "action",
		xpReward: 40,
		order: 2,
	},
	{
		moduleKey: "deliverer-mastery",
		titleEs: "Acción: Los Tres Filtros",
		descriptionEs:
			"Antes de tu próximo compromiso importante, aplica los tres filtros: recursos, plazo, claridad. Documenta el proceso.",
		type: "action",
		xpReward: 35,
		order: 3,
	},
	{
		moduleKey: "deliverer-mastery",
		titleEs: "Colaboración: Accountability Partner",
		descriptionEs:
			"Encuentra un compañero de responsabilidad. Compartan sus compromisos de la semana y háganse seguimiento mutuo.",
		type: "collaboration",
		xpReward: 50,
		order: 4,
	},

	// ============================================================================
	// FOCUS EXPERT MASTERY (focus-expert-mastery)
	// ============================================================================
	{
		moduleKey: "focus-expert-mastery",
		titleEs: "Reflexión: Tus Ladrones de Tiempo",
		descriptionEs:
			"Identifica tus 5 principales distracciones. ¿Cuánto tiempo te roban semanalmente? ¿Qué las dispara?",
		type: "reflection",
		xpReward: 25,
		order: 1,
	},
	{
		moduleKey: "focus-expert-mastery",
		titleEs: "Acción: Sesión de Deep Work",
		descriptionEs:
			"Programa y ejecuta una sesión de 2 horas de trabajo profundo. Elimina todas las distracciones. Documenta qué lograste.",
		type: "action",
		xpReward: 50,
		order: 2,
	},
	{
		moduleKey: "focus-expert-mastery",
		titleEs: "Acción: Time Blocking Semanal",
		descriptionEs:
			"Diseña tu semana ideal usando time blocking. Asigna bloques específicos para tus tareas más importantes.",
		type: "action",
		xpReward: 40,
		order: 3,
	},
	{
		moduleKey: "focus-expert-mastery",
		titleEs: "Colaboración: Pacto de No Interrupción",
		descriptionEs:
			"Acuerda con un colega o familia horarios de 'no molestar' mutuos. Respétenlos por una semana y evalúen.",
		type: "collaboration",
		xpReward: 45,
		order: 4,
	},

	// ============================================================================
	// DOING ADVANCED INTEGRATION (doing-advanced-integration)
	// ============================================================================
	{
		moduleKey: "doing-advanced-integration",
		titleEs: "Reflexión: Tu Patrón de Ejecución",
		descriptionEs:
			"Analiza tus últimos 3 proyectos exitosos. ¿Qué combinación de fortalezas del dominio Hacer utilizaste?",
		type: "reflection",
		xpReward: 30,
		order: 1,
	},
	{
		moduleKey: "doing-advanced-integration",
		titleEs: "Acción: Plan de 30 Días",
		descriptionEs:
			"Crea tu plan de desarrollo de 30 días siguiendo las 4 semanas descritas en el módulo. Define metas específicas para cada semana.",
		type: "action",
		xpReward: 60,
		order: 2,
	},
	{
		moduleKey: "doing-advanced-integration",
		titleEs: "Colaboración: Mentoría de Ejecución",
		descriptionEs:
			"Ofrece mentoría a alguien que lucha con la ejecución. Enséñale una técnica del dominio Hacer.",
		type: "collaboration",
		xpReward: 75,
		order: 3,
	},

	// ============================================================================
	// FEELING FOUNDATIONS (feeling-foundations)
	// ============================================================================
	{
		moduleKey: "feeling-foundations",
		titleEs: "Reflexión: Tu Mapa de Relaciones",
		descriptionEs:
			"Dibuja un mapa de tus relaciones profesionales más importantes. ¿Cuáles nutres activamente? ¿Cuáles has descuidado?",
		type: "reflection",
		xpReward: 25,
		order: 1,
	},
	{
		moduleKey: "feeling-foundations",
		titleEs: "Acción: Check-in Emocional",
		descriptionEs:
			"Practica el check-in emocional contigo mismo 3 veces al día durante una semana. ¿Qué patrones descubres?",
		type: "action",
		xpReward: 35,
		order: 2,
	},
	{
		moduleKey: "feeling-foundations",
		titleEs: "Colaboración: Conversación Profunda",
		descriptionEs:
			"Ten una conversación de 30 minutos con un colega donde solo hagas preguntas y escuches. No ofrezcas consejos.",
		type: "collaboration",
		xpReward: 50,
		order: 3,
	},

	// ============================================================================
	// EMPATHIZER MASTERY (empathizer-mastery)
	// ============================================================================
	{
		moduleKey: "empathizer-mastery",
		titleEs: "Reflexión: Tu Diario Empático",
		descriptionEs:
			"Durante una semana, registra cada momento de conexión empática: qué emoción percibiste, cómo te afectó, qué aprendiste.",
		type: "reflection",
		xpReward: 40,
		order: 1,
	},
	{
		moduleKey: "empathizer-mastery",
		titleEs: "Acción: Escucha de Tres Niveles",
		descriptionEs:
			"En tu próxima conversación importante, practica la escucha de tres niveles: contenido, emoción, necesidad. Documenta.",
		type: "action",
		xpReward: 35,
		order: 2,
	},
	{
		moduleKey: "empathizer-mastery",
		titleEs: "Acción: Límites Compasivos",
		descriptionEs:
			"Identifica una situación donde necesites establecer un límite emocional. Practica la 'desconexión compasiva'.",
		type: "action",
		xpReward: 40,
		order: 3,
	},
	{
		moduleKey: "empathizer-mastery",
		titleEs: "Colaboración: Buddy de Apoyo Mutuo",
		descriptionEs:
			"Encuentra alguien con quien puedas compartir cargas emocionales de forma recíproca. Establezcan reglas claras de apoyo.",
		type: "collaboration",
		xpReward: 55,
		order: 4,
	},

	// ============================================================================
	// COACH MASTERY (coach-mastery)
	// ============================================================================
	{
		moduleKey: "coach-mastery",
		titleEs: "Reflexión: Tu Estilo de Ayuda",
		descriptionEs:
			"¿Tiendes a dar consejos, compartir experiencia o hacer preguntas? Analiza tus últimas 3 interacciones de 'ayuda'.",
		type: "reflection",
		xpReward: 25,
		order: 1,
	},
	{
		moduleKey: "coach-mastery",
		titleEs: "Acción: Conversación GROW",
		descriptionEs:
			"Facilita una conversación de coaching usando el modelo GROW completo. Resiste la tentación de dar consejos.",
		type: "action",
		xpReward: 50,
		order: 2,
	},
	{
		moduleKey: "coach-mastery",
		titleEs: "Acción: Feedback SBI",
		descriptionEs:
			"Da feedback a alguien usando el modelo SBI (Situación, Comportamiento, Impacto). Pide permiso primero.",
		type: "action",
		xpReward: 45,
		order: 3,
	},
	{
		moduleKey: "coach-mastery",
		titleEs: "Colaboración: Sesión de Coaching Cruzado",
		descriptionEs:
			"Intercambia sesiones de coaching con un colega. Tú lo coacheas en algo, él/ella te coachea en algo diferente.",
		type: "collaboration",
		xpReward: 60,
		order: 4,
	},

	// ============================================================================
	// FEELING ADVANCED INTEGRATION (feeling-advanced-integration)
	// ============================================================================
	{
		moduleKey: "feeling-advanced-integration",
		titleEs: "Reflexión: Tu Equilibrio Emocional",
		descriptionEs:
			"Evalúa: ¿Priorizas la armonía sobre los resultados? ¿Evitas conversaciones difíciles? ¿Asumes problemas ajenos?",
		type: "reflection",
		xpReward: 30,
		order: 1,
	},
	{
		moduleKey: "feeling-advanced-integration",
		titleEs: "Acción: Conversación Difícil con Empatía",
		descriptionEs:
			"Ten una conversación difícil que has estado posponiendo. Usa técnicas de empatía activa durante todo el proceso.",
		type: "action",
		xpReward: 60,
		order: 2,
	},
	{
		moduleKey: "feeling-advanced-integration",
		titleEs: "Colaboración: Evaluación de Seguridad Psicológica",
		descriptionEs:
			"Facilita una conversación con tu equipo sobre seguridad psicológica. ¿Se sienten seguros para hablar, fallar, ser auténticos?",
		type: "collaboration",
		xpReward: 75,
		order: 3,
	},

	// ============================================================================
	// MOTIVATING FOUNDATIONS (motivating-foundations)
	// ============================================================================
	{
		moduleKey: "motivating-foundations",
		titleEs: "Reflexión: Tu Fuente de Energía",
		descriptionEs:
			"¿Qué te energiza a actuar? ¿Competencia, propósito, reconocimiento, impacto? Analiza tus motivaciones más profundas.",
		type: "reflection",
		xpReward: 25,
		order: 1,
	},
	{
		moduleKey: "motivating-foundations",
		titleEs: "Acción: Iniciativa Sin Permiso",
		descriptionEs:
			"Identifica algo que debería cambiar en tu entorno. Actúa sin pedir permiso (dentro de lo razonable). Documenta la reacción.",
		type: "action",
		xpReward: 40,
		order: 2,
	},
	{
		moduleKey: "motivating-foundations",
		titleEs: "Colaboración: Movilizador de Una Causa",
		descriptionEs:
			"Elige una causa pequeña en tu equipo. Inspira a al menos 2 personas a unirse. ¿Cómo lo lograste?",
		type: "collaboration",
		xpReward: 55,
		order: 3,
	},

	// ============================================================================
	// CATALYST MASTERY (catalyst-mastery)
	// ============================================================================
	{
		moduleKey: "catalyst-mastery",
		titleEs: "Reflexión: Tus Cambios Iniciados",
		descriptionEs:
			"Lista 3 cambios que has iniciado en los últimos 6 meses. ¿Cuántos llegaron a completarse? ¿Por qué sí o por qué no?",
		type: "reflection",
		xpReward: 25,
		order: 1,
	},
	{
		moduleKey: "catalyst-mastery",
		titleEs: "Acción: El Primer Paso Visible",
		descriptionEs:
			"Identifica un cambio necesario. Ejecuta el primer paso visible esta semana. No esperes el plan perfecto.",
		type: "action",
		xpReward: 45,
		order: 2,
	},
	{
		moduleKey: "catalyst-mastery",
		titleEs: "Acción: Crear Urgencia Constructiva",
		descriptionEs:
			"Para una iniciativa que quieres impulsar, desarrolla el argumento de urgencia: ¿por qué ahora, no después?",
		type: "action",
		xpReward: 40,
		order: 3,
	},
	{
		moduleKey: "catalyst-mastery",
		titleEs: "Colaboración: Coalición de Cambio",
		descriptionEs:
			"Identifica 3 aliados potenciales para un cambio que quieres impulsar. Reúnete con cada uno y explora su interés.",
		type: "collaboration",
		xpReward: 60,
		order: 4,
	},

	// ============================================================================
	// COMMANDER MASTERY (commander-mastery)
	// ============================================================================
	{
		moduleKey: "commander-mastery",
		titleEs: "Reflexión: Tus Decisiones Postergadas",
		descriptionEs:
			"Haz una lista de decisiones que has estado posponiendo. Para cada una, ¿qué te detiene?",
		type: "reflection",
		xpReward: 25,
		order: 1,
	},
	{
		moduleKey: "commander-mastery",
		titleEs: "Acción: Decisión con el Método 40-70",
		descriptionEs:
			"Toma una decisión importante usando el método 40-70. Documenta cuánta información tenías y cómo decidiste.",
		type: "action",
		xpReward: 50,
		order: 2,
	},
	{
		moduleKey: "commander-mastery",
		titleEs: "Acción: Comunicación BLUF",
		descriptionEs:
			"Comunica una decisión a tu equipo usando el formato BLUF. Evalúa si fue más claro que tu estilo habitual.",
		type: "action",
		xpReward: 40,
		order: 3,
	},
	{
		moduleKey: "commander-mastery",
		titleEs: "Colaboración: Decisión Conjunta Difícil",
		descriptionEs:
			"Junto con un colega, tomen una decisión difícil que han estado evitando. Usen las preguntas de clarificación.",
		type: "collaboration",
		xpReward: 55,
		order: 4,
	},

	// ============================================================================
	// MOTIVATING ADVANCED INTEGRATION (motivating-advanced-integration)
	// ============================================================================
	{
		moduleKey: "motivating-advanced-integration",
		titleEs: "Reflexión: Dependencia vs. Autonomía",
		descriptionEs:
			"¿Tu equipo depende de tu energía para funcionar, o pueden motivarse solos? ¿En qué fase estás de la transición?",
		type: "reflection",
		xpReward: 30,
		order: 1,
	},
	{
		moduleKey: "motivating-advanced-integration",
		titleEs: "Acción: Influencia Sin Autoridad",
		descriptionEs:
			"Identifica a alguien sobre quien no tienes autoridad formal pero necesitas influenciar. Diseña y ejecuta tu estrategia.",
		type: "action",
		xpReward: 60,
		order: 2,
	},
	{
		moduleKey: "motivating-advanced-integration",
		titleEs: "Colaboración: Iniciativa Conjunta",
		descriptionEs:
			"Propón y ejecuta una iniciativa conjunta con alguien de otro equipo. Practica la influencia basada en intereses compartidos.",
		type: "collaboration",
		xpReward: 75,
		order: 3,
	},

	// ============================================================================
	// THINKING FOUNDATIONS (thinking-foundations)
	// ============================================================================
	{
		moduleKey: "thinking-foundations",
		titleEs: "Reflexión: Tu Proceso de Pensamiento",
		descriptionEs:
			"¿Cómo procesas ideas complejas? ¿Escribiendo, hablando, dibujando, caminando? Identifica tu patrón.",
		type: "reflection",
		xpReward: 25,
		order: 1,
	},
	{
		moduleKey: "thinking-foundations",
		titleEs: "Acción: Cambio de Perspectiva",
		descriptionEs:
			"Elige una creencia que sostienes firmemente. Busca activamente 3 argumentos en contra. ¿Cambia algo?",
		type: "action",
		xpReward: 35,
		order: 2,
	},
	{
		moduleKey: "thinking-foundations",
		titleEs: "Colaboración: Debate Estructurado",
		descriptionEs:
			"Organiza un debate con un colega donde cada uno defienda una posición opuesta a la suya. ¿Qué aprendieron?",
		type: "collaboration",
		xpReward: 50,
		order: 3,
	},

	// ============================================================================
	// STRATEGIST MASTERY (strategist-mastery)
	// ============================================================================
	{
		moduleKey: "strategist-mastery",
		titleEs: "Reflexión: Pensamiento de Segundo Orden",
		descriptionEs:
			"Para una decisión reciente, aplica pensamiento de segundo orden: ¿y luego qué? ¿y después de eso qué?",
		type: "reflection",
		xpReward: 30,
		order: 1,
	},
	{
		moduleKey: "strategist-mastery",
		titleEs: "Acción: Análisis Estratégico Personal",
		descriptionEs:
			"Aplica el framework de pensamiento estratégico a tu desarrollo profesional. Define dónde estás, dónde quieres estar, y 3 caminos posibles.",
		type: "action",
		xpReward: 55,
		order: 2,
	},
	{
		moduleKey: "strategist-mastery",
		titleEs: "Acción: Escenarios Alternativos",
		descriptionEs:
			"Para un proyecto actual, desarrolla 3 escenarios: optimista, pesimista, realista. ¿Cómo cambia tu plan?",
		type: "action",
		xpReward: 45,
		order: 3,
	},
	{
		moduleKey: "strategist-mastery",
		titleEs: "Colaboración: Sesión Estratégica",
		descriptionEs:
			"Facilita una sesión de pensamiento estratégico con tu equipo usando el framework completo del módulo.",
		type: "collaboration",
		xpReward: 65,
		order: 4,
	},

	// ============================================================================
	// BRAINSTORMER MASTERY (brainstormer-mastery)
	// ============================================================================
	{
		moduleKey: "brainstormer-mastery",
		titleEs: "Reflexión: Tu Flujo de Ideas",
		descriptionEs:
			"¿Cuántas ideas generas vs. cuántas implementas? ¿Dónde se pierden las buenas ideas en tu proceso?",
		type: "reflection",
		xpReward: 25,
		order: 1,
	},
	{
		moduleKey: "brainstormer-mastery",
		titleEs: "Acción: Sesión SCAMPER",
		descriptionEs:
			"Elige un problema actual y usa la técnica SCAMPER para generar al menos 15 ideas. Filtra con las 3 preguntas.",
		type: "action",
		xpReward: 50,
		order: 2,
	},
	{
		moduleKey: "brainstormer-mastery",
		titleEs: "Acción: Prototipo Rápido",
		descriptionEs:
			"Toma tu mejor idea del ejercicio anterior y crea un prototipo (puede ser un boceto, una página, un demo) en 1 hora.",
		type: "action",
		xpReward: 45,
		order: 3,
	},
	{
		moduleKey: "brainstormer-mastery",
		titleEs: "Colaboración: Sesión de los Seis Sombreros",
		descriptionEs:
			"Facilita una sesión de los seis sombreros con tu equipo para evaluar una propuesta importante.",
		type: "collaboration",
		xpReward: 60,
		order: 4,
	},

	// ============================================================================
	// THINKING ADVANCED INTEGRATION (thinking-advanced-integration)
	// ============================================================================
	{
		moduleKey: "thinking-advanced-integration",
		titleEs: "Reflexión: Tu Parálisis por Análisis",
		descriptionEs:
			"¿Cuándo sabes que has analizado suficiente? ¿Qué señales te indican que es momento de actuar?",
		type: "reflection",
		xpReward: 30,
		order: 1,
	},
	{
		moduleKey: "thinking-advanced-integration",
		titleEs: "Acción: Espacio de Reflexión Semanal",
		descriptionEs:
			"Implementa una práctica semanal de 'tiempo blanco' para reflexión estratégica. Mantén por 4 semanas.",
		type: "action",
		xpReward: 55,
		order: 2,
	},
	{
		moduleKey: "thinking-advanced-integration",
		titleEs: "Colaboración: Facilitador de Pensamiento",
		descriptionEs:
			"Facilita una sesión de pensamiento colectivo donde solo haces preguntas, nunca das respuestas.",
		type: "collaboration",
		xpReward: 70,
		order: 3,
	},

	// ============================================================================
	// CROSS-DOMAIN INTEGRATION (cross-domain-integration)
	// ============================================================================
	{
		moduleKey: "cross-domain-integration",
		titleEs: "Reflexión: Tu Diagnóstico de Dominios",
		descriptionEs:
			"Para cada dominio (Pensar, Motivar, Sentir, Hacer), evalúa del 1-5: ¿cuánto lo usas vs. cuánto deberías?",
		type: "reflection",
		xpReward: 35,
		order: 1,
	},
	{
		moduleKey: "cross-domain-integration",
		titleEs: "Acción: Pareja Complementaria",
		descriptionEs:
			"Identifica a alguien con fortalezas en tu dominio más débil. Trabaja en un proyecto pequeño juntos conscientemente.",
		type: "action",
		xpReward: 50,
		order: 2,
	},
	{
		moduleKey: "cross-domain-integration",
		titleEs: "Colaboración: Ciclo de Impacto en Equipo",
		descriptionEs:
			"Con tu equipo, mapea quién lidera cada fase del ciclo (Pensar → Motivar → Hacer → Sentir). ¿Hay vacíos?",
		type: "collaboration",
		xpReward: 65,
		order: 3,
	},

	// ============================================================================
	// TEAM STRENGTH DYNAMICS (team-strength-dynamics)
	// ============================================================================
	{
		moduleKey: "team-strength-dynamics",
		titleEs: "Reflexión: Patrones de Tu Equipo",
		descriptionEs:
			"¿Dónde hay abundancia de fortalezas en tu equipo? ¿Dónde hay vacíos? ¿Cómo impacta esto el rendimiento?",
		type: "reflection",
		xpReward: 30,
		order: 1,
	},
	{
		moduleKey: "team-strength-dynamics",
		titleEs: "Acción: Mapa de Fortalezas del Equipo",
		descriptionEs:
			"Recopila las top 5 fortalezas de cada miembro de tu equipo. Crea un mapa visual por dominio.",
		type: "action",
		xpReward: 60,
		order: 2,
	},
	{
		moduleKey: "team-strength-dynamics",
		titleEs: "Colaboración: Conversación de Fortalezas",
		descriptionEs:
			"Facilita una conversación con tu equipo: ¿cuáles son nuestras fortalezas colectivas? ¿Dónde somos vulnerables?",
		type: "collaboration",
		xpReward: 70,
		order: 3,
	},

	// ============================================================================
	// PERSONAL DEVELOPMENT PLAN (personal-development-plan)
	// ============================================================================
	{
		moduleKey: "personal-development-plan",
		titleEs: "Reflexión: Tu Uso Actual de Fortalezas",
		descriptionEs:
			"Durante una semana, registra cuándo usas cada una de tus top 5 fortalezas. ¿Cuánto tiempo del día las aprovechas?",
		type: "reflection",
		xpReward: 35,
		order: 1,
	},
	{
		moduleKey: "personal-development-plan",
		titleEs: "Acción: Plan de 90 Días",
		descriptionEs:
			"Crea tu plan de desarrollo personal de 90 días siguiendo el framework del módulo. Define metas claras para cada mes.",
		type: "action",
		xpReward: 70,
		order: 2,
	},
	{
		moduleKey: "personal-development-plan",
		titleEs: "Acción: Tu Compromiso",
		descriptionEs:
			"Completa las 4 frases de compromiso del módulo. Compártelas con alguien que pueda darte seguimiento.",
		type: "action",
		xpReward: 45,
		order: 3,
	},
	{
		moduleKey: "personal-development-plan",
		titleEs: "Colaboración: Mentor de Fortalezas",
		descriptionEs:
			"Encuentra a alguien con tu fortaleza principal pero más desarrollada. Pídele mentoría específica por 30 días.",
		type: "collaboration",
		xpReward: 75,
		order: 4,
	},

	// ============================================================================
	// COLLABORATIVE EXCELLENCE (collaborative-excellence)
	// ============================================================================
	{
		moduleKey: "collaborative-excellence",
		titleEs: "Reflexión: Tu Red de Fortalezas",
		descriptionEs:
			"Crea tu mapa de colaboradores: ¿quién complementa tu Pensar, Motivar, Sentir, Hacer?",
		type: "reflection",
		xpReward: 30,
		order: 1,
	},
	{
		moduleKey: "collaborative-excellence",
		titleEs: "Acción: Proyecto Colaborativo Pequeño",
		descriptionEs:
			"Elige un compañero con fortalezas diferentes. Diseña y ejecuta un proyecto de 1-2 semanas con roles basados en fortalezas.",
		type: "action",
		xpReward: 65,
		order: 2,
	},
	{
		moduleKey: "collaborative-excellence",
		titleEs: "Colaboración: Desafío de Emparejamiento",
		descriptionEs:
			"Con tu pareja del ejercicio anterior, diseñen un desafío donde cada uno aporte algo único y el resultado requiera ambos.",
		type: "collaboration",
		xpReward: 80,
		order: 3,
	},

	// ============================================================================
	// PROBLEM SOLVER MASTERY (problem-solver-mastery)
	// ============================================================================
	{
		moduleKey: "problem-solver-mastery",
		titleEs: "Reflexión: Anatomía de un Problema Resuelto",
		descriptionEs:
			"Recuerda un problema complejo que resolviste exitosamente. ¿Cuál fue tu proceso mental? ¿Qué hiciste diferente?",
		type: "reflection",
		xpReward: 25,
		order: 1,
	},
	{
		moduleKey: "problem-solver-mastery",
		titleEs: "Acción: Framework en Acción",
		descriptionEs:
			"Elige un problema actual pequeño. Aplica el framework completo (definir, generar, evaluar, implementar). Documenta cada paso.",
		type: "action",
		xpReward: 40,
		order: 2,
	},
	{
		moduleKey: "problem-solver-mastery",
		titleEs: "Colaboración: Sesión de Problemas",
		descriptionEs:
			"Organiza una sesión con un compañero donde cada uno trae un problema. Ayúdense mutuamente a generar alternativas.",
		type: "collaboration",
		xpReward: 50,
		order: 3,
	},

	// ============================================================================
	// TIME KEEPER MASTERY (time-keeper-mastery)
	// ============================================================================
	{
		moduleKey: "time-keeper-mastery",
		titleEs: "Reflexión: Tu Relación con el Tiempo",
		descriptionEs:
			"¿Cuándo sientes que el tiempo vuela? ¿Cuándo se arrastra? ¿Qué revela esto sobre tus prioridades?",
		type: "reflection",
		xpReward: 25,
		order: 1,
	},
	{
		moduleKey: "time-keeper-mastery",
		titleEs: "Acción: Auditoría de Tiempo",
		descriptionEs:
			"Durante 3 días, registra cómo usas tu tiempo en bloques de 30 minutos. Identifica ladrones de tiempo y actividades de alto valor.",
		type: "action",
		xpReward: 45,
		order: 2,
	},
	{
		moduleKey: "time-keeper-mastery",
		titleEs: "Acción: Implementar Bloques de Tiempo",
		descriptionEs:
			"Diseña tu semana ideal con bloques de tiempo para trabajo profundo, administrativo y buffer. Pruébala por una semana.",
		type: "action",
		xpReward: 40,
		order: 3,
	},

	// ============================================================================
	// ANALYST MASTERY (analyst-mastery)
	// ============================================================================
	{
		moduleKey: "analyst-mastery",
		titleEs: "Reflexión: Tu Proceso Analítico",
		descriptionEs:
			"Piensa en una decisión importante reciente. ¿Qué datos usaste? ¿Cuáles faltaron? ¿Qué harías diferente?",
		type: "reflection",
		xpReward: 25,
		order: 1,
	},
	{
		moduleKey: "analyst-mastery",
		titleEs: "Acción: Análisis de Primeros Principios",
		descriptionEs:
			"Toma un proceso o creencia que das por sentado. Desarma hasta sus elementos básicos. ¿Sigue teniendo sentido?",
		type: "action",
		xpReward: 40,
		order: 2,
	},
	{
		moduleKey: "analyst-mastery",
		titleEs: "Colaboración: Presentar Hallazgos",
		descriptionEs:
			"Prepara un mini-análisis sobre algo relevante para tu equipo. Preséntalo de forma clara y recibe feedback sobre tu comunicación.",
		type: "collaboration",
		xpReward: 50,
		order: 3,
	},

	// ============================================================================
	// BELIEVER MASTERY (believer-mastery)
	// ============================================================================
	{
		moduleKey: "believer-mastery",
		titleEs: "Reflexión: Tus Valores Fundamentales",
		descriptionEs:
			"Identifica tus 3-5 valores más importantes. ¿Cómo los vives día a día? ¿Dónde hay fricción?",
		type: "reflection",
		xpReward: 30,
		order: 1,
	},
	{
		moduleKey: "believer-mastery",
		titleEs: "Acción: Registro de Alineación",
		descriptionEs:
			"Durante una semana, registra momentos donde viviste tus valores y momentos donde fue difícil. Busca patrones.",
		type: "action",
		xpReward: 40,
		order: 2,
	},
	{
		moduleKey: "believer-mastery",
		titleEs: "Colaboración: Conversación de Valores",
		descriptionEs:
			"Ten una conversación con un compañero sobre valores. ¿Cuáles comparten? ¿Cuáles difieren? ¿Cómo pueden respetarse?",
		type: "collaboration",
		xpReward: 45,
		order: 3,
	},

	// ============================================================================
	// CHAMELEON MASTERY (chameleon-mastery)
	// ============================================================================
	{
		moduleKey: "chameleon-mastery",
		titleEs: "Reflexión: Tus Máscaras",
		descriptionEs:
			"Identifica 3 contextos diferentes (trabajo, familia, amigos). ¿Qué ajustas en cada uno? ¿Qué permanece constante?",
		type: "reflection",
		xpReward: 25,
		order: 1,
	},
	{
		moduleKey: "chameleon-mastery",
		titleEs: "Acción: Observador de Contextos",
		descriptionEs:
			"En tu próxima reunión, observa conscientemente el estilo de comunicación del grupo. ¿Cómo podrías adaptarte mejor?",
		type: "action",
		xpReward: 35,
		order: 2,
	},
	{
		moduleKey: "chameleon-mastery",
		titleEs: "Colaboración: Ser Puente",
		descriptionEs:
			"Identifica dos personas o grupos que no se comunican bien. Facilita una conversación donde traduzcas entre sus estilos.",
		type: "collaboration",
		xpReward: 55,
		order: 3,
	},

	// ============================================================================
	// OPTIMIST MASTERY (optimist-mastery)
	// ============================================================================
	{
		moduleKey: "optimist-mastery",
		titleEs: "Reflexión: Optimismo vs Realidad",
		descriptionEs:
			"Elige un desafío actual. Escribe 3 cosas negativas reales sobre él. Luego 3 oportunidades escondidas. ¿Qué balance ves?",
		type: "reflection",
		xpReward: 30,
		order: 1,
	},
	{
		moduleKey: "optimist-mastery",
		titleEs: "Acción: Reencuadre Diario",
		descriptionEs:
			"Durante una semana, al final de cada día identifica algo negativo y busca el aprendizaje o la oportunidad. Documéntalo.",
		type: "action",
		xpReward: 40,
		order: 2,
	},
	{
		moduleKey: "optimist-mastery",
		titleEs: "Colaboración: Elevar al Equipo",
		descriptionEs:
			"En tu próxima reunión de equipo, trae conscientemente energía positiva. Observa el impacto en la dinámica del grupo.",
		type: "collaboration",
		xpReward: 45,
		order: 3,
	},

	// ============================================================================
	// SELF-BELIEVER MASTERY (self-believer-mastery)
	// ============================================================================
	{
		moduleKey: "self-believer-mastery",
		titleEs: "Reflexión: Inventario de Logros",
		descriptionEs:
			"Escribe 5 logros recientes que demuestran tu capacidad. ¿Los celebraste o pasaste rápido al siguiente?",
		type: "reflection",
		xpReward: 25,
		order: 1,
	},
	{
		moduleKey: "self-believer-mastery",
		titleEs: "Acción: Actuar Antes de Estar Listo",
		descriptionEs:
			"Identifica algo que has postergado por no sentirte preparado. Da un pequeño paso esta semana sin esperar a la perfección.",
		type: "action",
		xpReward: 40,
		order: 2,
	},
	{
		moduleKey: "self-believer-mastery",
		titleEs: "Colaboración: Pedir Ayuda",
		descriptionEs:
			"Pide ayuda específica a alguien en un área donde no eres fuerte. Observa cómo esto no disminuye tu confianza, la complementa.",
		type: "collaboration",
		xpReward: 50,
		order: 3,
	},

	// ============================================================================
	// STORYTELLER MASTERY (storyteller-mastery)
	// ============================================================================
	{
		moduleKey: "storyteller-mastery",
		titleEs: "Reflexión: Tu Historia de Origen",
		descriptionEs:
			"¿Cuál es la historia que te define profesionalmente? Escríbela como narrativa con héroe, desafío y transformación.",
		type: "reflection",
		xpReward: 30,
		order: 1,
	},
	{
		moduleKey: "storyteller-mastery",
		titleEs: "Acción: Proyecto como Historia",
		descriptionEs:
			"Toma un proyecto reciente y cuéntalo como historia. ¿Quién era el héroe? ¿Cuál fue el desafío? ¿Qué se transformó?",
		type: "action",
		xpReward: 40,
		order: 2,
	},
	{
		moduleKey: "storyteller-mastery",
		titleEs: "Colaboración: Narrativa de Equipo",
		descriptionEs:
			"Facilita una sesión donde tu equipo cuente su historia colectiva. ¿De dónde vienen? ¿Hacia dónde van?",
		type: "collaboration",
		xpReward: 55,
		order: 3,
	},

	// ============================================================================
	// WINNER MASTERY (winner-mastery)
	// ============================================================================
	{
		moduleKey: "winner-mastery",
		titleEs: "Reflexión: El Costo de Ganar",
		descriptionEs:
			"Piensa en una victoria importante. ¿Qué ganaste? ¿Qué costó? ¿Valió la pena? ¿Lo harías igual?",
		type: "reflection",
		xpReward: 25,
		order: 1,
	},
	{
		moduleKey: "winner-mastery",
		titleEs: "Acción: Competir Contigo Mismo",
		descriptionEs:
			"Establece un récord personal en algo profesional. Mídelo. Rompe tu propio récord en 2 semanas.",
		type: "action",
		xpReward: 45,
		order: 2,
	},
	{
		moduleKey: "winner-mastery",
		titleEs: "Colaboración: Ganar-Ganar",
		descriptionEs:
			"Identifica una situación competitiva con un colega. Propón una forma de competir que eleve a ambos, no solo a uno.",
		type: "collaboration",
		xpReward: 50,
		order: 3,
	},

	// ============================================================================
	// PHILOMATH MASTERY (philomath-mastery)
	// ============================================================================
	{
		moduleKey: "philomath-mastery",
		titleEs: "Reflexión: Aprendizaje Aplicado",
		descriptionEs:
			"¿Qué has aprendido en los últimos 3 meses? ¿Cuánto has aplicado? ¿Qué te impide aplicar más?",
		type: "reflection",
		xpReward: 25,
		order: 1,
	},
	{
		moduleKey: "philomath-mastery",
		titleEs: "Acción: Enseñar para Aprender",
		descriptionEs:
			"Elige algo que hayas aprendido recientemente. Enséñalo a alguien (puede ser informal). Observa qué consolida la enseñanza.",
		type: "action",
		xpReward: 40,
		order: 2,
	},
	{
		moduleKey: "philomath-mastery",
		titleEs: "Colaboración: Círculo de Aprendizaje",
		descriptionEs:
			"Organiza un pequeño grupo donde cada persona comparte algo que está aprendiendo. Rotación semanal.",
		type: "collaboration",
		xpReward: 55,
		order: 3,
	},

	// ============================================================================
	// THINKER MASTERY (thinker-mastery)
	// ============================================================================
	{
		moduleKey: "thinker-mastery",
		titleEs: "Reflexión: Mapa de Pensamiento",
		descriptionEs:
			"¿Sobre qué temas piensas más frecuentemente? Haz un mapa mental de tus patrones de pensamiento.",
		type: "reflection",
		xpReward: 25,
		order: 1,
	},
	{
		moduleKey: "thinker-mastery",
		titleEs: "Acción: De Pensamiento a Conclusión",
		descriptionEs:
			"Elige un problema que llevas tiempo pensando. Escribe tus conclusiones actuales con deadline de 30 minutos.",
		type: "action",
		xpReward: 40,
		order: 2,
	},
	{
		moduleKey: "thinker-mastery",
		titleEs: "Colaboración: Compartir Ideas Imperfectas",
		descriptionEs:
			"Comparte una idea en desarrollo con alguien de confianza. Pide feedback sin necesidad de que esté perfecta.",
		type: "collaboration",
		xpReward: 45,
		order: 3,
	},

	// ============================================================================
	// PEACE KEEPER MASTERY (peace-keeper-mastery)
	// ============================================================================
	{
		moduleKey: "peace-keeper-mastery",
		titleEs: "Reflexión: Tu Rol en Conflictos",
		descriptionEs:
			"¿Cuál es tu patrón cuando hay conflicto? ¿Medias, evitas, absorbes? ¿Qué necesitas para ti mismo?",
		type: "reflection",
		xpReward: 25,
		order: 1,
	},
	{
		moduleKey: "peace-keeper-mastery",
		titleEs: "Acción: Conflicto Preventivo",
		descriptionEs:
			"Identifica una tensión menor antes de que escale. Abórdala proactivamente. Documenta el resultado.",
		type: "action",
		xpReward: 45,
		order: 2,
	},
	{
		moduleKey: "peace-keeper-mastery",
		titleEs: "Colaboración: Facilitar Diálogo",
		descriptionEs:
			"Si detectas tensión entre dos personas, ofrécete como facilitador neutral. Crea espacio para que ambos se expresen.",
		type: "collaboration",
		xpReward: 55,
		order: 3,
	},
];
