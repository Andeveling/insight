import type { AssessmentQuestionSeed } from "./assessment-questions.data";

/**
 * Phase 4: Heroic Calibration (Maturity Check)
 *
 * These questions are presented AFTER the Top 5 strengths are identified.
 * Each question presents a scenario where the user must choose between a
 * "Raw" (Reactive) response and a "Mature" (Proactive) response.
 *
 * Format: SCENARIO type
 * Options: [Raw Response, Mature Response]
 *
 * Note: In the actual implementation, we will select only the 5 questions
 * corresponding to the user's Top 5 strengths.
 */

export const phase4Questions: AssessmentQuestionSeed[] = [
	// DOING DOMAIN
	{
		phase: 4,
		order: 1,
		text: "Tu equipo necesita tomar una decisión importante pero los datos no son concluyentes. Cuando aplicas tu capacidad analítica, ¿qué enfoque refleja mejor tu estilo natural?",
		type: "SCENARIO",
		options: [
			"Profundizo en el análisis hasta tener la certeza que necesito para sentirme seguro",
			"Sintetizo lo disponible, reconozco las limitaciones y propongo avanzar con lo que tenemos",
		],
		domain: "Doing",
		strength: "Analyst",
		weight: 1.0,
		maturityPolarity: "NEUTRAL", // Polarity is determined by the selected option index (0=RAW, 1=MATURE)
	},
	{
		phase: 4,
		order: 2,
		text: "En medio de una crisis, el equipo necesita dirección inmediata. Cuando tomas el mando, ¿cuál es tu primera reacción natural?",
		type: "SCENARIO",
		options: [
			"Tomo decisiones rápidas y las comunico con claridad para que todos sepan qué hacer",
			"Establezco estructura inmediata y distribuyo el liderazgo según las fortalezas del equipo",
		],
		domain: "Doing",
		strength: "Commander",
		weight: 1.0,
	},
	{
		phase: 4,
		order: 3,
		text: "Tienes múltiples proyectos activos y el tiempo es limitado. ¿Cómo organizas tu energía de ejecución de forma más natural?",
		type: "SCENARIO",
		options: [
			"Me concentro en completar todo lo que puedo, la satisfacción viene de tachar tareas",
			"Priorizo según impacto y avanzo en lo que realmente mueve la aguja",
		],
		domain: "Doing",
		strength: "Deliverer",
		weight: 1.0,
	},

	// THINKING DOMAIN
	{
		phase: 4,
		order: 4,
		text: "Detectas fallas en el plan actual del proyecto. ¿Cómo expresas tu visión estratégica de forma más espontánea?",
		type: "SCENARIO",
		options: [
			"Señalo directamente los puntos débiles porque es importante que el equipo los vea",
			"Mapeo escenarios alternativos y presento opciones para navegar la complejidad",
		],
		domain: "Thinking",
		strength: "Strategist",
		weight: 1.0,
	},
	{
		phase: 4,
		order: 5,
		text: "Encuentras un área fascinante que quieres dominar. ¿Cómo se manifiesta tu impulso de aprendizaje de forma más genuina?",
		type: "SCENARIO",
		options: [
			"Exploro múltiples temas relacionados, conectando ideas entre diferentes campos",
			"Me sumerjo en un tema específico hasta comprenderlo profundamente antes de avanzar",
		],
		domain: "Thinking",
		strength: "Philomath",
		weight: 1.0,
	},

	// FEELING DOMAIN
	{
		phase: 4,
		order: 6,
		text: "Un colega atraviesa un momento difícil y comparte su situación contigo. ¿Cómo responde tu empatía de forma más instintiva?",
		type: "SCENARIO",
		options: [
			"Me conecto profundamente con lo que siente, viviendo su experiencia junto a él",
			"Comprendo su perspectiva mientras mantengo claridad sobre mi propio estado emocional",
		],
		domain: "Feeling",
		strength: "Empathizer",
		weight: 1.0,
	},
	{
		phase: 4,
		order: 7,
		text: "Surge tensión entre dos miembros del equipo durante una reunión. ¿Cuál es tu reacción natural para restaurar la armonía?",
		type: "SCENARIO",
		options: [
			"Redirijo la conversación hacia áreas de acuerdo para reducir la incomodidad",
			"Creo espacio para que cada parte se exprese y facilito la búsqueda de puntos en común",
		],
		domain: "Feeling",
		strength: "Peace Keeper",
		weight: 1.0,
	},

	// MOTIVATING DOMAIN
	{
		phase: 4,
		order: 8,
		text: "El equipo enfrenta un revés significativo y la energía está baja. ¿Cómo aplicas tu optimismo de forma más auténtica?",
		type: "SCENARIO",
		options: [
			"Mantengo el ánimo alto enfocándome en lo positivo y evitando hundirme en lo negativo",
			"Valido la dificultad del momento y reencuadro la situación hacia lo que podemos aprender",
		],
		domain: "Motivating",
		strength: "Optimist",
		weight: 1.0,
	},
	{
		phase: 4,
		order: 9,
		text: "Identificas talento sin desarrollar en alguien de tu equipo. ¿Cómo te surge naturalmente apoyar su crecimiento?",
		type: "SCENARIO",
		options: [
			"Me involucro activamente en su desarrollo, guiándolo para que evite errores innecesarios",
			"Diseño oportunidades para que experimente y aprenda de sus propias decisiones",
		],
		domain: "Motivating",
		strength: "Coach",
		weight: 1.0,
	},
	{
		phase: 4,
		order: 10,
		text: "Enfrentas un desafío que otros consideran imposible. ¿Cómo se manifiesta tu confianza en ti mismo de forma más auténtica?",
		type: "SCENARIO",
		options: [
			"Me apoyo en mi historial de éxitos previos para mantener mi confianza alta",
			"Evalúo objetivamente mis capacidades y busco recursos externos cuando es necesario",
		],
		domain: "Motivating",
		strength: "Self-Believer",
		weight: 1.0,
	},
	{
		phase: 4,
		order: 11,
		text: "El equipo está estancado en su zona de confort. ¿Cómo actúa tu impulso de catalizar el cambio?",
		type: "SCENARIO",
		options: [
			"Propongo nuevas iniciativas con entusiasmo para inspirar movimiento inmediato",
			"Identifico los momentos de apertura y presento el cambio cuando el equipo está receptivo",
		],
		domain: "Motivating",
		strength: "Catalyst",
		weight: 1.0,
	},
	{
		phase: 4,
		order: 12,
		text: "Estás en un contexto competitivo donde se miden resultados. ¿Cuál es tu impulso natural como competidor?",
		type: "SCENARIO",
		options: [
			"Me enfoco en superar a los demás, el ranking es mi motivador principal",
			"Uso la competencia como referencia para impulsar mi mejor desempeño personal",
		],
		domain: "Motivating",
		strength: "Winner",
		weight: 1.0,
	},
	{
		phase: 4,
		order: 13,
		text: "Necesitas comunicar información compleja a tu equipo. ¿Cómo estructuras tu mensaje de forma más instintiva?",
		type: "SCENARIO",
		options: [
			"Creo una narrativa envolvente que captura la atención y hace memorable el mensaje",
			"Construyo la historia conectando datos clave con el contexto emocional de la audiencia",
		],
		domain: "Motivating",
		strength: "Storyteller",
		weight: 1.0,
	},

	// DOING DOMAIN - Completando las faltantes
	{
		phase: 4,
		order: 14,
		text: "Tienes múltiples deadlines aproximándose. ¿Cómo gestionas tu tiempo de forma más natural?",
		type: "SCENARIO",
		options: [
			"Estructuro mi agenda con precisión y sigo el plan al pie de la letra",
			"Organizo el tiempo estratégicamente pero ajusto según surjan prioridades",
		],
		domain: "Doing",
		strength: "Time Keeper",
		weight: 1.0,
	},
	{
		phase: 4,
		order: 15,
		text: "Surge un obstáculo técnico inesperado en tu proyecto. ¿Cómo aplicas tu capacidad de resolver problemas?",
		type: "SCENARIO",
		options: [
			"Me sumerjo de inmediato en encontrar soluciones prácticas para destrabar la situación",
			"Diagnostico la raíz del problema antes de implementar la solución más sostenible",
		],
		domain: "Doing",
		strength: "Problem Solver",
		weight: 1.0,
	},
	{
		phase: 4,
		order: 16,
		text: "Tienes un objetivo importante que requiere concentración sostenida. ¿Cómo canalizas tu enfoque de forma más genuina?",
		type: "SCENARIO",
		options: [
			"Elimino todas las distracciones y me concentro exclusivamente en esa meta",
			"Mantengo el enfoque principal mientras monitoreo el contexto para ajustar si es necesario",
		],
		domain: "Doing",
		strength: "Focus Expert",
		weight: 1.0,
	},
	{
		phase: 4,
		order: 17,
		text: "Te enfrentas a una decisión que desafía tus valores personales. ¿Cómo responde tu brújula interna de forma más espontánea?",
		type: "SCENARIO",
		options: [
			"Defiendo mis principios firmemente, incluso si genera fricción con otros",
			"Mantengo mis valores mientras busco la forma de integrar diferentes perspectivas",
		],
		domain: "Doing",
		strength: "Believer",
		weight: 1.0,
	},

	// FEELING DOMAIN - Completando la faltante
	{
		phase: 4,
		order: 18,
		text: "Entras a un nuevo grupo con dinámicas ya establecidas. ¿Cómo se manifiesta tu adaptabilidad social de manera más instintiva?",
		type: "SCENARIO",
		options: [
			"Observo y ajusto mi estilo para encajar rápidamente con el grupo",
			"Me adapto al contexto mientras mantengo claridad sobre mi identidad personal",
		],
		domain: "Feeling",
		strength: "Chameleon",
		weight: 1.0,
	},

	// THINKING DOMAIN - Completando las faltantes
	{
		phase: 4,
		order: 19,
		text: "Tu equipo te pide opinión sobre una decisión compleja. ¿Cómo procesa tu mente reflexiva de forma más natural?",
		type: "SCENARIO",
		options: [
			"Me tomo tiempo para contemplar todas las dimensiones antes de compartir mi perspectiva",
			"Reflexiono sobre los elementos clave y articulo mi pensamiento de manera estructurada",
		],
		domain: "Thinking",
		strength: "Thinker",
		weight: 1.0,
	},
	{
		phase: 4,
		order: 20,
		text: "El equipo necesita ideas innovadoras para resolver un desafío. ¿Cómo fluye tu creatividad de forma más auténtica?",
		type: "SCENARIO",
		options: [
			"Genero múltiples ideas rápidamente sin filtrar, la cantidad impulsa la innovación",
			"Exploro posibilidades creativas mientras evalúo cuáles tienen mayor viabilidad",
		],
		domain: "Thinking",
		strength: "Brainstormer",
		weight: 1.0,
	},
];
