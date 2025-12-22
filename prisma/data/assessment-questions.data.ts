/**
 * Assessment Questions Seed Data
 * 60 questions total: 20 Phase 1 (Domain Discovery), 30 Phase 2 (Strength Refinement), 10 Phase 3 (Ranking Confirmation)
 *
 * Based on research.md guidelines:
 * - Positive framing, behavioral focus, concrete scenarios
 * - Phase 1: Scale questions for domain affinity
 * - Phase 2: Choice questions for strength differentiation
 * - Phase 3: Ranking questions for confirmation
 *
 * Strength-Domain Mapping (from strengths.data.ts):
 * - Doing: Analyst, Believer, Chameleon, Catalyst, Brainstormer
 * - Feeling: Deliverer, Focus Expert, Coach, Empathizer, Commander
 * - Motivating: Problem Solver, Optimist, Self-believer, Philomath, Peace Keeper
 * - Thinking: Time Keeper, Storyteller, Winner, Strategist, Thinker
 */

export interface AssessmentQuestionSeed {
	phase: 1 | 2 | 3 | 4;
	order: number;
	text: string;
	type: "SCALE" | "CHOICE" | "RANKING" | "SCENARIO";
	options?: string[];
	scaleRange?: {
		min: number;
		max: number;
		labels: string[];
	};
	domain: string; // Domain name to be resolved to ID
	strength?: string; // Strength name to be resolved to ID (optional)
	weight: number;
	maturityPolarity?: "NEUTRAL" | "RAW" | "MATURE";
}

// PHASE 1: Domain Discovery (20 questions - 5 per domain)
// Measures pure domain affinity using behavioral patterns and natural reactions
// Based on Positive Psychology, Gallup CliftonStrengths, and High5Test methodology

export const phase1Questions: AssessmentQuestionSeed[] = [
	// DOING Domain (5 questions)
	// Captures: Action orientation, execution drive, tangible results, making things happen
	{
		phase: 1,
		order: 1,
		text: "Cuando tienes un proyecto importante, ¿qué te da más satisfacción?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: [
				"Planear y diseñar",
				"Pensar y explorar",
				"Avanzar y completar",
				"Ejecutar y lograr",
				"Terminar y entregar",
			],
		},
		domain: "Doing",
		weight: 1.3,
	},
	{
		phase: 1,
		order: 2,
		text: "¿Con qué frecuencia sientes la necesidad de ver resultados concretos de tu trabajo?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: [
				"Raramente",
				"Ocasionalmente",
				"A menudo",
				"Frecuentemente",
				"Constantemente",
			],
		},
		domain: "Doing",
		weight: 1.2,
	},
	{
		phase: 1,
		order: 3,
		text: "Cuando hay trabajo por hacer, ¿cuál es tu impulso más natural?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: [
				"Reflexionar primero",
				"Considerar opciones",
				"Empezar a actuar",
				"Ejecutar rápido",
				"Completar ya",
			],
		},
		domain: "Doing",
		weight: 1.2,
	},
	{
		phase: 1,
		order: 4,
		text: "¿Qué tan importante es para ti tener un producto o entregable tangible al final del día?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: [
				"Poco importante",
				"Algo importante",
				"Importante",
				"Muy importante",
				"Esencial",
			],
		},
		domain: "Doing",
		weight: 1.1,
	},
	{
		phase: 1,
		order: 5,
		text: "¿Con qué frecuencia prefieres actuar y ajustar sobre la marcha en lugar de planear extensamente?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: ["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"],
		},
		domain: "Doing",
		weight: 1.0,
	},

	// THINKING Domain (5 questions)
	// Captures: Analytical processing, strategic thinking, learning drive, intellectual curiosity
	{
		phase: 1,
		order: 6,
		text: "Antes de tomar decisiones importantes, ¿cuánto tiempo dedicas a analizar información y opciones?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: ["Muy poco", "Poco", "Moderado", "Considerable", "Extensivo"],
		},
		domain: "Thinking",
		weight: 1.3,
	},
	{
		phase: 1,
		order: 7,
		text: "¿Qué tan natural es para ti ver patrones, conexiones y tendencias en la información?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: [
				"Nada natural",
				"Poco natural",
				"Natural",
				"Muy natural",
				"Completamente natural",
			],
		},
		domain: "Thinking",
		weight: 1.2,
	},
	{
		phase: 1,
		order: 8,
		text: "¿Con qué frecuencia te encuentras pensando en soluciones, estrategias o nuevas formas de entender las cosas?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: [
				"Raramente",
				"Ocasionalmente",
				"Regularmente",
				"Frecuentemente",
				"Constantemente",
			],
		},
		domain: "Thinking",
		weight: 1.2,
	},
	{
		phase: 1,
		order: 9,
		text: "¿Qué tan importante es para ti comprender profundamente el 'por qué' detrás de las cosas?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: [
				"Poco importante",
				"Algo importante",
				"Importante",
				"Muy importante",
				"Fundamental",
			],
		},
		domain: "Thinking",
		weight: 1.1,
	},
	{
		phase: 1,
		order: 10,
		text: "¿Con qué frecuencia necesitas tiempo para procesar y reflexionar sobre experiencias o información nueva?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: [
				"Raramente",
				"Ocasionalmente",
				"A menudo",
				"Frecuentemente",
				"Siempre",
			],
		},
		domain: "Thinking",
		weight: 1.0,
	},

	// FEELING Domain (5 questions)
	// Captures: Relational awareness, emotional intelligence, harmony seeking, people impact
	{
		phase: 1,
		order: 11,
		text: "¿Qué tan naturalmente percibes las emociones y necesidades no expresadas de quienes te rodean?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: [
				"Nada natural",
				"Poco natural",
				"Natural",
				"Muy natural",
				"Extremadamente natural",
			],
		},
		domain: "Feeling",
		weight: 1.3,
	},
	{
		phase: 1,
		order: 12,
		text: "¿Con qué frecuencia consideras el impacto emocional de tus acciones en otros antes de actuar?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: [
				"Raramente",
				"Ocasionalmente",
				"A menudo",
				"Frecuentemente",
				"Siempre",
			],
		},
		domain: "Feeling",
		weight: 1.2,
	},
	{
		phase: 1,
		order: 13,
		text: "¿Qué tan importante es para ti que exista armonía y buen clima en tu entorno de trabajo?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: [
				"Poco importante",
				"Algo importante",
				"Importante",
				"Muy importante",
				"Esencial",
			],
		},
		domain: "Feeling",
		weight: 1.2,
	},
	{
		phase: 1,
		order: 14,
		text: "¿Con qué frecuencia buscas conectar genuinamente con las personas más allá de lo superficial?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: [
				"Raramente",
				"Ocasionalmente",
				"Regularmente",
				"Frecuentemente",
				"Constantemente",
			],
		},
		domain: "Feeling",
		weight: 1.1,
	},
	{
		phase: 1,
		order: 15,
		text: "Cuando hay tensión o conflicto, ¿cuánto te afecta emocionalmente?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: ["Muy poco", "Poco", "Moderadamente", "Bastante", "Mucho"],
		},
		domain: "Feeling",
		weight: 1.0,
	},

	// MOTIVATING Domain (5 questions)
	// Captures: Influence drive, inspiration, change catalyst, energizing others, forward momentum
	{
		phase: 1,
		order: 16,
		text: "¿Qué tan natural es para ti inspirar o energizar a otros hacia una meta o visión?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: [
				"Nada natural",
				"Poco natural",
				"Natural",
				"Muy natural",
				"Completamente natural",
			],
		},
		domain: "Motivating",
		weight: 1.3,
	},
	{
		phase: 1,
		order: 17,
		text: "¿Con qué frecuencia sientes el impulso de iniciar cambios o mejoras en tu entorno?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: [
				"Raramente",
				"Ocasionalmente",
				"Regularmente",
				"Frecuentemente",
				"Constantemente",
			],
		},
		domain: "Motivating",
		weight: 1.2,
	},
	{
		phase: 1,
		order: 18,
		text: "¿Qué tan importante es para ti ver a otros crecer, avanzar o alcanzar su potencial?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: [
				"Poco importante",
				"Algo importante",
				"Importante",
				"Muy importante",
				"Fundamental",
			],
		},
		domain: "Motivating",
		weight: 1.2,
	},
	{
		phase: 1,
		order: 19,
		text: "¿Con qué frecuencia comunicas visiones positivas sobre el futuro o posibilidades de mejora?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: [
				"Raramente",
				"Ocasionalmente",
				"A menudo",
				"Frecuentemente",
				"Constantemente",
			],
		},
		domain: "Motivating",
		weight: 1.1,
	},
	{
		phase: 1,
		order: 20,
		text: "¿Qué tan naturalmente tomas la iniciativa para movilizar a otros hacia la acción?",
		type: "SCALE",
		scaleRange: {
			min: 1,
			max: 5,
			labels: [
				"Nada natural",
				"Poco natural",
				"Natural",
				"Muy natural",
				"Extremadamente natural",
			],
		},
		domain: "Motivating",
		weight: 1.0,
	},
];

// PHASE 2: Strength Refinement (30 questions - scenario-based CHOICE questions)
// Dynamically selected based on Phase 1 domain results
// Focuses on discriminating between specific strengths within dominant domains
// Based on behavioral patterns from Positive Psychology and CliftonStrengths methodology

export const phase2Questions: AssessmentQuestionSeed[] = [
	// === DOING DOMAIN STRENGTHS ===
	// Time Keeper, Problem Solver, Focus Expert, Deliverer, Believer

	{
		phase: 2,
		order: 1,
		text: "Tienes múltiples tareas urgentes y el día se acorta. ¿Cuál es tu instinto más fuerte?",
		type: "CHOICE",
		options: [
			"Organizar cada tarea en bloques de tiempo específicos",
			"Identificar el obstáculo clave y resolverlo primero",
			"Concentrarme completamente en una hasta terminarla",
			"Asegurarme de cumplir lo que prometí sin importar qué",
		],
		domain: "Doing",
		strength: "Time Keeper",
		weight: 1.3,
	},
	{
		phase: 2,
		order: 2,
		text: "Un proceso que siempre funciona ahora está fallando. ¿Qué haces naturalmente?",
		type: "CHOICE",
		options: [
			"Diagnostico rápidamente dónde está el quiebre",
			"Mantengo mi enfoque hasta encontrar la falla",
			"Evalúo si el proceso aún refleja nuestros principios",
			"Cumplo con el entregable mientras busco la causa",
		],
		domain: "Doing",
		strength: "Problem Solver",
		weight: 1.3,
	},
	{
		phase: 2,
		order: 3,
		text: "Trabajas en un proyecto crítico con muchas distracciones alrededor. ¿Qué te describe mejor?",
		type: "CHOICE",
		options: [
			"Bloqueo todo y me sumerjo profundamente en la tarea",
			"Gestiono mi tiempo para minimizar interrupciones",
			"Encuentro formas de avanzar a pesar de las distracciones",
			"No descanso hasta entregar lo que comprometí",
		],
		domain: "Doing",
		strength: "Focus Expert",
		weight: 1.2,
	},
	{
		phase: 2,
		order: 4,
		text: "Te comprometes a entregar algo, pero surgen obstáculos inesperados. ¿Cómo reaccionas?",
		type: "CHOICE",
		options: [
			"Hago lo necesario para cumplir mi palabra",
			"Busco soluciones creativas para cada obstáculo",
			"Ajusto mi plan de tiempo pero mantengo el deadline",
			"Intensifico mi concentración para compensar el retraso",
		],
		domain: "Doing",
		strength: "Deliverer",
		weight: 1.3,
	},
	{
		phase: 2,
		order: 5,
		text: "La decisión más eficiente contradice algo que valoras profundamente. ¿Qué pesa más?",
		type: "CHOICE",
		options: [
			"Busco una alternativa alineada con mis principios",
			"Evalúo si puedo resolver el conflicto prácticamente",
			"Organizo mi plan para cumplir ambos requisitos",
			"Me concentro en encontrar el camino correcto",
		],
		domain: "Doing",
		strength: "Believer",
		weight: 1.2,
	},
	{
		phase: 2,
		order: 6,
		text: "El equipo debate sobre el mejor enfoque sin llegar a consenso. ¿Cuál es tu contribución natural?",
		type: "CHOICE",
		options: [
			"Propongo una estructura de tiempo para decidir",
			"Identifico el problema real que debemos resolver",
			"Mantengo el foco en el objetivo sin desviarnos",
			"Recuerdo los compromisos que ya asumimos",
		],
		domain: "Doing",
		strength: "Time Keeper",
		weight: 1.1,
	},

	// === THINKING DOMAIN STRENGTHS ===
	// Thinker, Analyst, Brainstormer, Strategist, Philomath

	{
		phase: 2,
		order: 7,
		text: "Tu equipo necesita decidir sobre una inversión importante. ¿Cuál es tu primera inclinación?",
		type: "CHOICE",
		options: [
			"Reflexionar sobre las implicaciones de largo plazo",
			"Analizar los datos financieros y proyecciones",
			"Explorar múltiples escenarios creativos",
			"Mapear cómo esto nos posiciona estratégicamente",
		],
		domain: "Thinking",
		strength: "Thinker",
		weight: 1.3,
	},
	{
		phase: 2,
		order: 8,
		text: "Tienes acceso a mucha información sobre un problema. ¿Qué haces instintivamente?",
		type: "CHOICE",
		options: [
			"Busco patrones y tendencias en los datos",
			"Genero hipótesis creativas sobre las causas",
			"Contemplo qué significa esto en el contexto mayor",
			"Investigo más hasta dominar el tema completamente",
		],
		domain: "Thinking",
		strength: "Analyst",
		weight: 1.3,
	},
	{
		phase: 2,
		order: 9,
		text: "El equipo está atascado con la misma idea. ¿Cómo contribuyes naturalmente?",
		type: "CHOICE",
		options: [
			"Propongo 5 alternativas diferentes para considerar",
			"Cuestiono los supuestos base del enfoque actual",
			"Analizo por qué la idea actual no está funcionando",
			"Diseño un camino estratégico diferente",
		],
		domain: "Thinking",
		strength: "Brainstormer",
		weight: 1.2,
	},
	{
		phase: 2,
		order: 10,
		text: "Te piden presentar la visión para los próximos años. ¿Cómo preparas tu propuesta?",
		type: "CHOICE",
		options: [
			"Anticipo tendencias y escenarios futuros",
			"Profundizo en investigación sobre el sector",
			"Considero las implicaciones filosóficas del rumbo",
			"Imagino múltiples futuros posibles",
		],
		domain: "Thinking",
		strength: "Strategist",
		weight: 1.3,
	},
	{
		phase: 2,
		order: 11,
		text: "Descubres un campo de conocimiento fascinante relacionado a tu trabajo. ¿Qué haces?",
		type: "CHOICE",
		options: [
			"Me sumerjo hasta dominarlo profundamente",
			"Lo analizo para extraer insights aplicables",
			"Exploro cómo conecta con otras áreas",
			"Reflexiono sobre cómo cambia mi perspectiva",
		],
		domain: "Thinking",
		strength: "Philomath",
		weight: 1.2,
	},
	{
		phase: 2,
		order: 12,
		text: "Antes de una reunión importante de toma de decisiones, tú:",
		type: "CHOICE",
		options: [
			"Estudias todos los reportes y cifras disponibles",
			"Contemplas las ramificaciones de cada opción",
			"Diseñas 2-3 estrategias claras",
			"Preparas preguntas y ángulos alternativos",
		],
		domain: "Thinking",
		strength: "Analyst",
		weight: 1.1,
	},

	// === FEELING DOMAIN STRENGTHS ===
	// Peace Keeper, Optimist, Chameleon, Empathizer, Coach

	{
		phase: 2,
		order: 13,
		text: "Dos miembros del equipo tienen un desacuerdo visible. ¿Cuál es tu reacción más genuina?",
		type: "CHOICE",
		options: [
			"Busco el terreno común para reconciliarlos",
			"Escucho a cada uno para entender sus sentimientos",
			"Ajusto mi estilo para conectar con ambos",
			"Les ayudo a ver su potencial para resolver esto",
		],
		domain: "Feeling",
		strength: "Peace Keeper",
		weight: 1.3,
	},
	{
		phase: 2,
		order: 14,
		text: "El equipo acaba de fallar en un objetivo importante. ¿Cómo respondes?",
		type: "CHOICE",
		options: [
			"Resalto lo que aprendimos y las oportunidades",
			"Ayudo a procesar las emociones sin juzgar",
			"Trabajo para que no se pierda la cohesión",
			"Me adapto al ánimo del grupo antes de intervenir",
		],
		domain: "Feeling",
		strength: "Optimist",
		weight: 1.2,
	},
	{
		phase: 2,
		order: 15,
		text: "Entras a un equipo con cultura y dinámicas muy diferentes a las tuyas. ¿Qué haces naturalmente?",
		type: "CHOICE",
		options: [
			"Observo y ajusto mi estilo para encajar",
			"Busco entender emocionalmente a cada miembro",
			"Identifico cómo puedo contribuir a su crecimiento",
			"Mantengo el ambiente positivo mientras me adapto",
		],
		domain: "Feeling",
		strength: "Chameleon",
		weight: 1.2,
	},
	{
		phase: 2,
		order: 16,
		text: "Un colega comparte algo personal que lo está afectando. ¿Cuál es tu instinto?",
		type: "CHOICE",
		options: [
			"Conectar profundamente con lo que está sintiendo",
			"Reencuadrar la situación hacia el aprendizaje",
			"Adaptar mi respuesta a lo que necesita en ese momento",
			"Crear un espacio seguro sin conflicto",
		],
		domain: "Feeling",
		strength: "Empathizer",
		weight: 1.3,
	},
	{
		phase: 2,
		order: 17,
		text: "Notas que alguien tiene potencial sin desarrollar. ¿Qué te surge hacer?",
		type: "CHOICE",
		options: [
			"Diseñar experiencias para que crezca",
			"Entender primero qué lo está frenando",
			"Mostrarle las posibilidades que tiene",
			"Adaptar mi mentoría a su estilo personal",
		],
		domain: "Feeling",
		strength: "Coach",
		weight: 1.2,
	},
	{
		phase: 2,
		order: 18,
		text: "Hay tensión palpable en una reunión de equipo. ¿Qué haces instintivamente?",
		type: "CHOICE",
		options: [
			"Suavizo el ambiente para reducir la tensión",
			"Leo las emociones de cada persona presente",
			"Me ajusto al tono para no incrementar el conflicto",
			"Mantengo la energía constructiva",
		],
		domain: "Feeling",
		strength: "Peace Keeper",
		weight: 1.1,
	},

	// === MOTIVATING DOMAIN STRENGTHS ===
	// Self-Believer, Catalyst, Winner, Commander, Storyteller

	{
		phase: 2,
		order: 19,
		text: "Te ofrecen liderar algo fuera de tu experiencia directa. ¿Cuál es tu primera reacción?",
		type: "CHOICE",
		options: [
			"Confío en que puedo aprenderlo y lograrlo",
			"Lo veo como oportunidad de catalizar cambio",
			"Acepto el desafío de ganar en terreno nuevo",
			"Tomo el mando y figuro la ruta sobre la marcha",
		],
		domain: "Motivating",
		strength: "Self-Believer",
		weight: 1.3,
	},
	{
		phase: 2,
		order: 20,
		text: "El equipo está cómodo con el status quo. ¿Qué te impulsa a hacer?",
		type: "CHOICE",
		options: [
			"Iniciar conversaciones sobre nuevas posibilidades",
			"Narrar una visión que los inspire a moverse",
			"Tomar la iniciativa y empezar el cambio yo mismo",
			"Competir contra nuestra propia versión actual",
		],
		domain: "Motivating",
		strength: "Catalyst",
		weight: 1.2,
	},
	{
		phase: 2,
		order: 21,
		text: "Tu equipo está en un proyecto competitivo contra otros equipos. ¿Qué te energiza más?",
		type: "CHOICE",
		options: [
			"La oportunidad de ganar y ser los mejores",
			"Liderar al equipo hacia la victoria",
			"Impulsar la transformación necesaria para ganar",
			"Saber que puedo lograr el resultado",
		],
		domain: "Motivating",
		strength: "Winner",
		weight: 1.2,
	},
	{
		phase: 2,
		order: 22,
		text: "El equipo necesita dirección inmediata en una situación ambigua. ¿Qué haces naturalmente?",
		type: "CHOICE",
		options: [
			"Tomo la decisión y dirijo al equipo",
			"Comunico una visión que genere claridad",
			"Confío en mi criterio y actúo",
			"Movilizo la energía del equipo hacia la acción",
		],
		domain: "Motivating",
		strength: "Commander",
		weight: 1.3,
	},
	{
		phase: 2,
		order: 23,
		text: "Necesitas convencer a stakeholders sobre un cambio importante. ¿Cuál es tu enfoque natural?",
		type: "CHOICE",
		options: [
			"Construyo una narrativa convincente",
			"Proyecto confianza en la propuesta",
			"Lidero la conversación con autoridad",
			"Muestro cómo nos hará competitivos",
		],
		domain: "Motivating",
		strength: "Storyteller",
		weight: 1.2,
	},
	{
		phase: 2,
		order: 24,
		text: "El equipo está desmoralizado tras un error importante. ¿Cómo intervienes?",
		type: "CHOICE",
		options: [
			"Cuento cómo otros superaron situaciones similares",
			"Tomo el liderazgo para reorientar al equipo",
			"Les recuerdo de lo que somos capaces",
			"Impulso un nuevo comienzo con energía",
		],
		domain: "Motivating",
		strength: "Storyteller",
		weight: 1.1,
	},

	// === CROSS-DOMAIN QUESTIONS (Para mayor discriminación) ===

	{
		phase: 2,
		order: 25,
		text: "Un proyecto exitoso está siendo celebrado. ¿En qué te enfocas?",
		type: "CHOICE",
		options: [
			"El aprendizaje profundo que obtuvimos (Philomath)",
			"Cómo cumplimos nuestro compromiso (Deliverer)",
			"El crecimiento del equipo (Coach)",
			"Cómo ganar el próximo desafío (Winner)",
		],
		domain: "Doing",
		strength: "Deliverer",
		weight: 1.1,
	},
	{
		phase: 2,
		order: 26,
		text: "Te asignan trabajar con alguien que tiene un estilo completamente opuesto al tuyo. ¿Qué haces?",
		type: "CHOICE",
		options: [
			"Ajusto mi comunicación a su estilo (Chameleon)",
			"Analizo cómo complementarnos estratégicamente (Strategist)",
			"Busco mantener la armonía en la colaboración (Peace Keeper)",
			"Propongo un sistema claro de trabajo (Time Keeper)",
		],
		domain: "Feeling",
		strength: "Chameleon",
		weight: 1.2,
	},
	{
		phase: 2,
		order: 27,
		text: "Recibes un problema que nadie ha resuelto antes. ¿Cuál es tu impulso más fuerte?",
		type: "CHOICE",
		options: [
			"Generar múltiples enfoques creativos (Brainstormer)",
			"Investigar todo lo disponible sobre el tema (Philomath)",
			"Confiar en que encontraré la solución (Self-Believer)",
			"Disecar el problema sistemáticamente (Problem Solver)",
		],
		domain: "Thinking",
		strength: "Brainstormer",
		weight: 1.2,
	},
	{
		phase: 2,
		order: 28,
		text: "Una decisión crítica requiere elegir entre velocidad o profundidad. ¿Qué te define mejor?",
		type: "CHOICE",
		options: [
			"Optimizo el tiempo sin sacrificar calidad (Time Keeper)",
			"Profundizo lo necesario para decidir bien (Thinker)",
			"Actúo decisivamente con lo que sé (Commander)",
			"Encuentro el punto práctico de equilibrio (Problem Solver)",
		],
		domain: "Doing",
		strength: "Time Keeper",
		weight: 1.0,
	},
	{
		phase: 2,
		order: 29,
		text: "El equipo tiene una oportunidad única pero arriesgada. ¿Cuál es tu contribución natural?",
		type: "CHOICE",
		options: [
			"Energizo al equipo para aprovecharla (Catalyst)",
			"Evalúo estratégicamente el riesgo-beneficio (Strategist)",
			"Narro el potencial de esta oportunidad (Storyteller)",
			"Analizo los datos para validar la decisión (Analyst)",
		],
		domain: "Motivating",
		strength: "Catalyst",
		weight: 1.1,
	},
	{
		phase: 2,
		order: 30,
		text: "Tu contribución más natural cuando hay incertidumbre es:",
		type: "CHOICE",
		options: [
			"Mantener al equipo enfocado en lo esencial (Focus Expert)",
			"Entender cómo se siente cada persona (Empathizer)",
			"Reflexionar sobre el significado de la situación (Thinker)",
			"Defender los principios que nos guían (Believer)",
		],
		domain: "Doing",
		strength: "Focus Expert",
		weight: 1.0,
	},
];

// PHASE 3: Ranking Confirmation (10 questions)
// RANKING questions that confirm and order the top 5 strengths
// IMPORTANT: Options do NOT show strength names to avoid bias
// Comments indicate hidden strength mapping for seeding

export const phase3Questions: AssessmentQuestionSeed[] = [
	// Question 1: Mixed domains - Execution focus
	{
		phase: 3,
		order: 1,
		text: "Cuando trabajas en un proyecto importante, ordena según qué tan cierto es para ti (más a menos):",
		type: "RANKING",
		options: [
			"Cumplo mis compromisos sin importar los obstáculos", // Deliverer
			"Organizo mi tiempo con precisión milimétrica", // Time Keeper
			"Me concentro profundamente bloqueando distracciones", // Focus Expert
			"Busco la solución más práctica y eficiente", // Problem Solver
			"Actúo según mis principios aunque sea difícil", // Believer
		],
		domain: "Doing",
		weight: 2.0,
	},

	// Question 2: Mixed domains - Cognitive styles
	{
		phase: 3,
		order: 2,
		text: "Frente a una decisión compleja, ordena según tu proceso natural:",
		type: "RANKING",
		options: [
			"Reflexiono profundamente sobre las implicaciones", // Thinker
			"Analizo todos los datos y números disponibles", // Analyst
			"Genero múltiples alternativas creativas", // Brainstormer
			"Diseño una estrategia de largo plazo", // Strategist
			"Investigo hasta dominar completamente el tema", // Philomath
		],
		domain: "Thinking",
		weight: 2.0,
	},

	// Question 3: Mixed domains - Relational dynamics
	{
		phase: 3,
		order: 3,
		text: "En situaciones de equipo, ordena según tu contribución más instintiva:",
		type: "RANKING",
		options: [
			"Mantengo la armonía y resuelvo conflictos", // Peace Keeper
			"Conecto emocionalmente con lo que sienten otros", // Empathizer
			"Me adapto al estilo de cada persona", // Chameleon
			"Ayudo a otros a ver y desarrollar su potencial", // Coach
			"Mantengo la energía positiva del grupo", // Optimist
		],
		domain: "Feeling",
		weight: 2.0,
	},

	// Question 4: Mixed domains - Drive and motivation
	{
		phase: 3,
		order: 4,
		text: "Cuando hay una oportunidad de liderazgo, ordena según qué te define mejor:",
		type: "RANKING",
		options: [
			"Confío plenamente en mi capacidad de lograrlo", // Self-Believer
			"Impulso cambios y nuevas posibilidades", // Catalyst
			"Me motiva ganar y ser el mejor", // Winner
			"Tomo el mando y dirijo con claridad", // Commander
			"Narro una visión que inspire a otros", // Storyteller
		],
		domain: "Motivating",
		weight: 2.0,
	},

	// Question 5: Cross-domain - Natural behaviors
	{
		phase: 3,
		order: 5,
		text: "Ordena estos comportamientos según cuál surge más naturalmente en ti:",
		type: "RANKING",
		options: [
			"Diagnostico rápidamente dónde está el problema", // Problem Solver
			"Busco patrones en la información que tengo", // Analyst
			"Creo un ambiente donde todos se sientan seguros", // Peace Keeper
			"Inicio conversaciones sobre nuevas oportunidades", // Catalyst
			"Planifico cuidadosamente cada paso", // Time Keeper
		],
		domain: "Thinking",
		weight: 1.9,
	},

	// Question 6: Cross-domain - Response to challenges
	{
		phase: 3,
		order: 6,
		text: "Cuando el equipo enfrenta un obstáculo, ordena según tu primera reacción:",
		type: "RANKING",
		options: [
			"Me sumerjo intensamente hasta encontrar la salida", // Focus Expert
			"Exploro múltiples caminos creativos", // Brainstormer
			"Entiendo primero cómo afecta a cada persona", // Empathizer
			"Proyecto confianza en que lo superaremos", // Self-Believer
			"Anticipo escenarios y planifico la estrategia", // Strategist
		],
		domain: "Thinking",
		weight: 1.9,
	},

	// Question 7: Cross-domain - Work style preferences
	{
		phase: 3,
		order: 7,
		text: "Ordena según el ambiente donde te sientes más en tu elemento:",
		type: "RANKING",
		options: [
			"Cuando puedo aprender algo completamente nuevo", // Philomath
			"Cuando ajusto mi estilo para conectar con otros", // Chameleon
			"Cuando lidero al equipo hacia una meta ambiciosa", // Commander
			"Cuando diseño la visión de largo plazo", // Strategist
			"Cuando cumplo exactamente lo que prometí", // Deliverer
		],
		domain: "Motivating",
		weight: 1.8,
	},

	// Question 8: Cross-domain - Value drivers
	{
		phase: 3,
		order: 8,
		text: "Ordena según qué valoras más en tu forma de trabajar:",
		type: "RANKING",
		options: [
			"Mantener mi palabra como mi mayor activo", // Deliverer
			"Pensar profundamente antes de actuar", // Thinker
			"Ver el lado positivo de cada situación", // Optimist
			"Ganar y superar las expectativas", // Winner
			"Construir narrativas que conecten e inspiren", // Storyteller
		],
		domain: "Motivating",
		weight: 1.8,
	},

	// Question 9: Cross-domain - Impact and contribution
	{
		phase: 3,
		order: 9,
		text: "Ordena según el impacto por el que más te reconocen:",
		type: "RANKING",
		options: [
			"Encontrar soluciones donde otros no ven salida", // Problem Solver
			"Diseñar experiencias que ayudan a otros a crecer", // Coach
			"Analizar profundamente situaciones complejas", // Analyst
			"Movilizar energía hacia la acción", // Catalyst
			"Defender principios importantes sin ceder", // Believer
		],
		domain: "Feeling",
		weight: 1.9,
	},

	// Question 10: Cross-domain - Peak performance moments
	{
		phase: 3,
		order: 10,
		text: "Ordena según cuándo sientes que estás dando tu mejor contribución:",
		type: "RANKING",
		options: [
			"Cuando optimizo procesos y manejo el tiempo", // Time Keeper
			"Cuando me concentro intensamente en una prioridad", // Focus Expert
			"Cuando genero ideas innovadoras", // Brainstormer
			"Cuando leo y respondo a las emociones del grupo", // Empathizer
			"Cuando inspiro con historias y visión", // Storyteller
		],
		domain: "Feeling",
		weight: 1.9,
	},
];

import { phase4Questions } from "./phase4-questions.data";

export const allAssessmentQuestions = [
	...phase1Questions,
	...phase2Questions,
	...phase3Questions,
	...phase4Questions,
];
