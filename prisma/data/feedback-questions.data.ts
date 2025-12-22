/**
 * Feedback Questions Data
 *
 * Base de datos exhaustiva de preguntas de observación conductual para feedback entre pares.
 * Cada pregunta mapea opciones de respuesta a pesos de fortaleza (0.0-1.0).
 *
 * Total preguntas: 45 (Q1-Q45)
 * Cobertura mejorada para fortalezas del dominio DOING (time-keeper, believer)
 *
 * Fortalezas cubiertas (20 en total) organizadas por dominio:
 *
 * DOING (Ejecución - 5):
 *   - deliverer: Cumple compromisos de manera confiable
 *   - time-keeper: Gestiona el tiempo con precisión
 *   - focus-expert: Mantiene concentración intensa en prioridades
 *   - problem-solver: Encuentra soluciones prácticas
 *   - believer: Actúa según principios y valores
 *
 * THINKING (Cognición - 5):
 *   - thinker: Reflexiona profundamente antes de actuar
 *   - analyst: Analiza datos y busca patrones
 *   - brainstormer: Genera múltiples ideas creativas
 *   - strategist: Diseña estrategias de largo plazo
 *   - philomath: Busca conocimiento y comprensión profunda
 *
 * FEELING (Relacional - 5):
 *   - peace-keeper: Mantiene armonía y resuelve conflictos
 *   - optimist: Mantiene actitud positiva y esperanzadora
 *   - chameleon: Se adapta a diferentes contextos y personas
 *   - empathizer: Conecta emocionalmente con otros
 *   - coach: Desarrolla el potencial de otros
 *
 * MOTIVATING (Impulso - 5):
 *   - self-believer: Confía en sus propias capacidades
 *   - catalyst: Impulsa cambio y nuevas iniciativas
 *   - winner: Compite y busca la excelencia
 *   - commander: Lidera con claridad y decisión
 *   - storyteller: Narra visiones que inspiran
 */

export interface AnswerOption {
	id: string;
	text: string;
	order: number;
}

export interface StrengthWeight {
	[strengthId: string]: number;
}

export interface StrengthMapping {
	[answerId: string]: StrengthWeight;
}

export interface FeedbackQuestion {
	order: number;
	text: string;
	answerType: "behavioral_choice";
	answerOptions: AnswerOption[];
	strengthMapping: StrengthMapping;
}

const feedbackQuestions: FeedbackQuestion[] = [
	// ============================================
	// SECCIÓN 1: ENFRENTANDO DESAFÍOS Y PROBLEMAS
	// ============================================
	{
		order: 1,
		text: "Cuando se enfrenta a un desafío complejo, esta persona típicamente...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q1_a",
				text: "Hace una pausa para reflexionar profundamente antes de proponer soluciones",
				order: 1,
			},
			{
				id: "q1_b",
				text: "Genera rápidamente múltiples ideas creativas para explorar",
				order: 2,
			},
			{
				id: "q1_c",
				text: "Lo desglosa en pasos estructurados y lógicos",
				order: 3,
			},
			{
				id: "q1_d",
				text: "Infunde energía a otros para abordarlo juntos",
				order: 4,
			},
		],
		strengthMapping: {
			q1_a: { thinker: 0.9, analyst: 0.7, strategist: 0.6 },
			q1_b: { brainstormer: 0.9, catalyst: 0.6, philomath: 0.5 },
			q1_c: { analyst: 0.8, strategist: 0.7, "focus-expert": 0.5 },
			q1_d: { catalyst: 0.8, commander: 0.7, optimist: 0.6 },
		},
	},
	{
		order: 2,
		text: "Cuando algo sale mal inesperadamente, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q2_a",
				text: "Inmediatamente comienza a diagnosticar la causa raíz",
				order: 1,
			},
			{
				id: "q2_b",
				text: "Se adapta rápidamente y encuentra caminos alternativos a seguir",
				order: 2,
			},
			{
				id: "q2_c",
				text: "Mantiene la calma y asegura a todos que todo saldrá bien",
				order: 3,
			},
			{
				id: "q2_d",
				text: "Toma el mando y asigna pasos claros a seguir",
				order: 4,
			},
		],
		strengthMapping: {
			q2_a: { "problem-solver": 0.9, analyst: 0.7, thinker: 0.5 },
			q2_b: { chameleon: 0.9, "problem-solver": 0.6, brainstormer: 0.5 },
			q2_c: { optimist: 0.9, "peace-keeper": 0.7, empathizer: 0.5 },
			q2_d: { commander: 0.9, catalyst: 0.7, deliverer: 0.5 },
		},
	},
	{
		order: 3,
		text: "Cuando el equipo encuentra obstáculos, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q3_a",
				text: "Investiga a fondo para comprender todos los ángulos",
				order: 1,
			},
			{
				id: "q3_b",
				text: "Propone soluciones no convencionales que otros podrían no ver",
				order: 2,
			},
			{
				id: "q3_c",
				text: "Mantiene a todos enfocados en lo que realmente importa",
				order: 3,
			},
			{
				id: "q3_d",
				text: "Asegura que los compromisos se cumplan a pesar de las dificultades",
				order: 4,
			},
		],
		strengthMapping: {
			q3_a: { philomath: 0.9, analyst: 0.7, thinker: 0.6 },
			q3_b: { brainstormer: 0.9, "problem-solver": 0.7, chameleon: 0.5 },
			q3_c: { "focus-expert": 0.9, strategist: 0.7, commander: 0.5 },
			q3_d: { deliverer: 0.9, "time-keeper": 0.8, believer: 0.5 },
		},
	},

	// ============================================
	// SECCIÓN 2: DINÁMICAS DE EQUIPO Y DISCUSIONES
	// ============================================
	{
		order: 4,
		text: "En las discusiones de equipo, el estilo de contribución de esta persona se describe mejor como...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q4_a",
				text: "Compartir conocimiento y ayudar a otros a aprender",
				order: 1,
			},
			{
				id: "q4_b",
				text: "Mantener a todos positivos y enfocados en las posibilidades",
				order: 2,
			},
			{
				id: "q4_c",
				text: "Cuestionar ideas e impulsar la excelencia",
				order: 3,
			},
			{
				id: "q4_d",
				text: "Construir puentes entre diferentes perspectivas",
				order: 4,
			},
		],
		strengthMapping: {
			q4_a: { philomath: 0.8, coach: 0.7, storyteller: 0.6 },
			q4_b: { optimist: 0.9, "peace-keeper": 0.6, empathizer: 0.5 },
			q4_c: { winner: 0.8, commander: 0.7, "self-believer": 0.6 },
			q4_d: { "peace-keeper": 0.9, empathizer: 0.7, chameleon: 0.6 },
		},
	},
	{
		order: 5,
		text: "Durante las sesiones de lluvia de ideas, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q5_a",
				text: "Genera un torrente de ideas creativas y originales",
				order: 1,
			},
			{
				id: "q5_b",
				text: "Analiza cuáles ideas son las más factibles",
				order: 2,
			},
			{
				id: "q5_c",
				text: "Conecta diferentes ideas en una estrategia cohesiva",
				order: 3,
			},
			{ id: "q5_d", text: "Anima a todos a participar y compartir", order: 4 },
		],
		strengthMapping: {
			q5_a: { brainstormer: 0.9, philomath: 0.6, chameleon: 0.5 },
			q5_b: { analyst: 0.9, "problem-solver": 0.7, "focus-expert": 0.5 },
			q5_c: { strategist: 0.9, thinker: 0.7, analyst: 0.5 },
			q5_d: { coach: 0.8, empathizer: 0.7, "peace-keeper": 0.6 },
		},
	},
	{
		order: 6,
		text: "Cuando el equipo necesita tomar una decisión, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q6_a",
				text: "Toma la iniciativa y decide de manera determinante",
				order: 1,
			},
			{
				id: "q6_b",
				text: "Se asegura de que todos hayan tenido la oportunidad de expresar su opinión",
				order: 2,
			},
			{
				id: "q6_c",
				text: "Presenta datos y hechos para guiar la decisión",
				order: 3,
			},
			{
				id: "q6_d",
				text: "Considera cómo la decisión se alinea con los valores fundamentales",
				order: 4,
			},
		],
		strengthMapping: {
			q6_a: { commander: 0.9, "self-believer": 0.7, catalyst: 0.6 },
			q6_b: { "peace-keeper": 0.9, empathizer: 0.8, coach: 0.5 },
			q6_c: { analyst: 0.9, strategist: 0.7, thinker: 0.6 },
			q6_d: { believer: 0.9, deliverer: 0.6, thinker: 0.5 },
		},
	},
	{
		order: 7,
		text: "Cuando alguien comparte una nueva idea en una reunión, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q7_a",
				text: "La desarrolla con aún más posibilidades creativas",
				order: 1,
			},
			{
				id: "q7_b",
				text: "Evalúa sus fortalezas y debilidades potenciales",
				order: 2,
			},
			{
				id: "q7_c",
				text: "Considera cómo encaja en el panorama general",
				order: 3,
			},
			{
				id: "q7_d",
				text: "Apoya a la persona y crea espacio para la elaboración",
				order: 4,
			},
		],
		strengthMapping: {
			q7_a: { brainstormer: 0.9, optimist: 0.6, catalyst: 0.5 },
			q7_b: { analyst: 0.8, "problem-solver": 0.7, thinker: 0.6 },
			q7_c: { strategist: 0.9, thinker: 0.7, "focus-expert": 0.5 },
			q7_d: { empathizer: 0.8, coach: 0.7, "peace-keeper": 0.6 },
		},
	},

	// ============================================
	// SECCIÓN 3: GESTIÓN DEL TIEMPO Y COMPROMISOS
	// ============================================
	{
		order: 8,
		text: "Cuando trabaja en proyectos con plazos de entrega, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q8_a",
				text: "Cumple de forma fiable con cada compromiso",
				order: 1,
			},
			{
				id: "q8_b",
				text: "Toma la iniciativa para poner las cosas en marcha rápidamente",
				order: 2,
			},
			{
				id: "q8_c",
				text: "Adapta el enfoque según lo que necesite la situación",
				order: 3,
			},
			{
				id: "q8_d",
				text: "Se mantiene guiado por principios y valores fundamentales",
				order: 4,
			},
		],
		strengthMapping: {
			q8_a: { deliverer: 0.9, "time-keeper": 0.7, "focus-expert": 0.6 },
			q8_b: { catalyst: 0.8, commander: 0.6, winner: 0.5, "time-keeper": 0.5 },
			q8_c: { chameleon: 0.9, "problem-solver": 0.7, brainstormer: 0.5 },
			q8_d: { believer: 0.9, deliverer: 0.6, "self-believer": 0.5 },
		},
	},
	{
		order: 9,
		text: "Respecto a la gestión del tiempo, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q9_a",
				text: "Planifica meticulosamente y respeta cada fecha límite",
				order: 1,
			},
			{
				id: "q9_b",
				text: "Se mantiene enfocado como un láser en las prioridades más importantes",
				order: 2,
			},
			{
				id: "q9_c",
				text: "Se ajusta de manera flexible cuando las circunstancias cambian",
				order: 3,
			},
			{
				id: "q9_d",
				text: "Presiona para que las cosas se hagan más rápido de lo esperado",
				order: 4,
			},
		],
		strengthMapping: {
			q9_a: { "time-keeper": 0.9, deliverer: 0.7, analyst: 0.5 },
			q9_b: { "focus-expert": 0.9, strategist: 0.7, deliverer: 0.5 },
			q9_c: { chameleon: 0.9, "problem-solver": 0.6, optimist: 0.5 },
			q9_d: { catalyst: 0.8, winner: 0.7, commander: 0.6 },
		},
	},
	{
		order: 10,
		text: "Cuando un proyecto se está quedando atrás en el cronograma, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q10_a",
				text: "Reorganiza las prioridades para retomar el camino",
				order: 1,
			},
			{ id: "q10_b", text: "Motiva al equipo a superar el desafío", order: 2 },
			{
				id: "q10_c",
				text: "Identifica qué salió mal y propone soluciones",
				order: 3,
			},
			{
				id: "q10_d",
				text: "Redobla sus propios compromisos para ayudar",
				order: 4,
			},
		],
		strengthMapping: {
			q10_a: { "time-keeper": 0.85, strategist: 0.7, "focus-expert": 0.6 },
			q10_b: { catalyst: 0.8, optimist: 0.7, commander: 0.6 },
			q10_c: { "problem-solver": 0.9, analyst: 0.7, thinker: 0.5 },
			q10_d: { deliverer: 0.9, believer: 0.6, "focus-expert": 0.5 },
		},
	},

	// ============================================
	// SECCIÓN 4: MANEJO DE CONFLICTOS Y TENSIONES
	// ============================================
	{
		order: 11,
		text: "Cuando surgen conflictos o tensiones en el equipo, esta persona tiende a...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q11_a",
				text: "Percibe las emociones de los demás y crea espacio para todos",
				order: 1,
			},
			{
				id: "q11_b",
				text: "Avanza para tomar decisiones claras y proporcionar dirección",
				order: 2,
			},
			{
				id: "q11_c",
				text: "Se mantiene enfocado en el objetivo y mantiene el trabajo avanzando",
				order: 3,
			},
			{
				id: "q11_d",
				text: "Invierte tiempo en desarrollar las perspectivas de los demás",
				order: 4,
			},
		],
		strengthMapping: {
			q11_a: { empathizer: 0.9, "peace-keeper": 0.8, coach: 0.5 },
			q11_b: { commander: 0.9, catalyst: 0.6, winner: 0.5 },
			q11_c: { "focus-expert": 0.8, deliverer: 0.7, "time-keeper": 0.5 },
			q11_d: { coach: 0.9, empathizer: 0.7, "peace-keeper": 0.6 },
		},
	},
	{
		order: 12,
		text: "Cuando dos miembros del equipo no están de acuerdo, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q12_a",
				text: "Media para encontrar puntos en común y restaurar la armonía",
				order: 1,
			},
			{
				id: "q12_b",
				text: "Ayuda a cada persona a comprender el punto de vista del otro",
				order: 2,
			},
			{
				id: "q12_c",
				text: "Analiza los hechos para determinar la mejor solución",
				order: 3,
			},
			{
				id: "q12_d",
				text: "Toma una decisión determinante para hacer avanzar las cosas",
				order: 4,
			},
		],
		strengthMapping: {
			q12_a: { "peace-keeper": 0.9, empathizer: 0.7, chameleon: 0.5 },
			q12_b: { coach: 0.8, empathizer: 0.7, "peace-keeper": 0.6 },
			q12_c: { analyst: 0.8, thinker: 0.7, "problem-solver": 0.6 },
			q12_d: { commander: 0.9, "self-believer": 0.6, winner: 0.5 },
		},
	},
	{
		order: 13,
		text: "En situaciones de alta presión, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q13_a",
				text: "Se mantiene optimista y eleva la moral del equipo",
				order: 1,
			},
			{
				id: "q13_b",
				text: "Prospera con la competencia y la presión",
				order: 2,
			},
			{
				id: "q13_c",
				text: "Mantiene la calma y reflexiona cuidadosamente sobre la situación",
				order: 3,
			},
			{
				id: "q13_d",
				text: "Se adapta rápidamente a las circunstancias cambiantes",
				order: 4,
			},
		],
		strengthMapping: {
			q13_a: { optimist: 0.9, "peace-keeper": 0.6, storyteller: 0.5 },
			q13_b: { winner: 0.9, catalyst: 0.7, commander: 0.6 },
			q13_c: { thinker: 0.8, analyst: 0.7, strategist: 0.6 },
			q13_d: { chameleon: 0.9, "problem-solver": 0.7, catalyst: 0.5 },
		},
	},

	// ============================================
	// SECCIÓN 5: COMUNICACIÓN E INFLUENCIA
	// ============================================
	{
		order: 14,
		text: "Al comunicar ideas o planes, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q14_a",
				text: "Elabora narrativas convincentes que atraen a todos",
				order: 1,
			},
			{
				id: "q14_b",
				text: "Presenta datos y análisis lógicos claramente",
				order: 2,
			},
			{
				id: "q14_c",
				text: "Piensa varios pasos por delante y traza escenarios",
				order: 3,
			},
			{
				id: "q14_d",
				text: "Inspira confianza a través de su seguridad en sí mismo",
				order: 4,
			},
		],
		strengthMapping: {
			q14_a: { storyteller: 0.9, optimist: 0.6, chameleon: 0.5 },
			q14_b: { analyst: 0.8, strategist: 0.7, thinker: 0.6 },
			q14_c: { strategist: 0.9, thinker: 0.7, "time-keeper": 0.5 },
			q14_d: { "self-believer": 0.9, winner: 0.6, commander: 0.5 },
		},
	},
	{
		order: 15,
		text: "Al presentar a un grupo, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q15_a",
				text: "Utiliza historias y ejemplos para que las ideas sean memorables",
				order: 1,
			},
			{
				id: "q15_b",
				text: "Respalda todo con evidencia y hechos sólidos",
				order: 2,
			},
			{
				id: "q15_c",
				text: "Habla con una convicción que inspira confianza",
				order: 3,
			},
			{
				id: "q15_d",
				text: "Conecta emocionalmente con la audiencia",
				order: 4,
			},
		],
		strengthMapping: {
			q15_a: { storyteller: 0.9, brainstormer: 0.6, optimist: 0.5 },
			q15_b: { analyst: 0.9, philomath: 0.7, thinker: 0.5 },
			q15_c: { "self-believer": 0.9, commander: 0.7, winner: 0.5 },
			q15_d: { empathizer: 0.8, storyteller: 0.7, coach: 0.6 },
		},
	},
	{
		order: 16,
		text: "Al tratar de persuadir a otros, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q16_a",
				text: "Utiliza argumentos lógicos y datos convincentes",
				order: 1,
			},
			{
				id: "q16_b",
				text: "Comparte historias inspiradoras y pinta una visión",
				order: 2,
			},
			{
				id: "q16_c",
				text: "Lidera con el ejemplo con una confianza inquebrantable",
				order: 3,
			},
			{
				id: "q16_d",
				text: "Apela a valores y creencias compartidas",
				order: 4,
			},
		],
		strengthMapping: {
			q16_a: { analyst: 0.8, thinker: 0.7, strategist: 0.6 },
			q16_b: { storyteller: 0.9, optimist: 0.7, brainstormer: 0.5 },
			q16_c: { "self-believer": 0.9, commander: 0.7, winner: 0.5 },
			q16_d: { believer: 0.9, coach: 0.6, empathizer: 0.5 },
		},
	},

	// ============================================
	// SECCIÓN 6: LIDERAZGO Y TOMA DE INICIATIVA
	// ============================================
	{
		order: 17,
		text: "Cuando un proyecto necesita comenzar, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q17_a",
				text: "Interviene inmediatamente para crear impulso",
				order: 1,
			},
			{
				id: "q17_b",
				text: "Desarrolla un plan integral antes de comenzar",
				order: 2,
			},
			{
				id: "q17_c",
				text: "Reúne al equipo y asigna responsabilidades claras",
				order: 3,
			},
			{
				id: "q17_d",
				text: "Asegura que el proyecto se alinee con principios importantes",
				order: 4,
			},
		],
		strengthMapping: {
			q17_a: { catalyst: 0.9, winner: 0.6, "self-believer": 0.5 },
			q17_b: {
				strategist: 0.9,
				"time-keeper": 0.7,
				analyst: 0.6,
				believer: 0.6,
			},
			q17_c: { commander: 0.9, coach: 0.6, catalyst: 0.5 },
			q17_d: { believer: 0.9, thinker: 0.6, deliverer: 0.5 },
		},
	},
	{
		order: 18,
		text: "En un rol de liderazgo, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q18_a",
				text: "Se enfoca en desarrollar el potencial de cada miembro del equipo",
				order: 1,
			},
			{
				id: "q18_b",
				text: "Establece expectativas claras y responsabiliza a las personas",
				order: 2,
			},
			{ id: "q18_c", text: "Crea un ambiente positivo y alentador", order: 3 },
			{
				id: "q18_d",
				text: "Impulsa al equipo a superar a la competencia",
				order: 4,
			},
		],
		strengthMapping: {
			q18_a: { coach: 0.9, empathizer: 0.7, philomath: 0.5 },
			q18_b: { commander: 0.9, deliverer: 0.7, "focus-expert": 0.5 },
			q18_c: { optimist: 0.9, "peace-keeper": 0.7, storyteller: 0.5 },
			q18_d: { winner: 0.9, catalyst: 0.7, "self-believer": 0.6 },
		},
	},
	{
		order: 19,
		text: "Cuando el equipo carece de dirección, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q19_a",
				text: "Avanza para tomar el control y proporcionar claridad",
				order: 1,
			},
			{
				id: "q19_b",
				text: "Desarrolla una visión estratégica para el futuro",
				order: 2,
			},
			{
				id: "q19_c",
				text: "Mantiene el ánimo alto y la motivación del equipo",
				order: 3,
			},
			{
				id: "q19_d",
				text: "Ayuda a todos a reenfocarse en lo más importante",
				order: 4,
			},
		],
		strengthMapping: {
			q19_a: { commander: 0.9, "self-believer": 0.7, catalyst: 0.6 },
			q19_b: { strategist: 0.9, thinker: 0.7, analyst: 0.5 },
			q19_c: { optimist: 0.9, storyteller: 0.6, "peace-keeper": 0.5 },
			q19_d: { "focus-expert": 0.9, believer: 0.6, coach: 0.5 },
		},
	},

	// ============================================
	// SECCIÓN 7: APRENDIZAJE Y CRECIMIENTO
	// ============================================
	{
		order: 20,
		text: "Cuando se trata de aprender cosas nuevas, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q20_a",
				text: "Es constantemente curioso y busca una comprensión profunda",
				order: 1,
			},
			{
				id: "q20_b",
				text: "Aprende experimentando y probando cosas",
				order: 2,
			},
			{
				id: "q20_c",
				text: "Comparte conocimiento y ayuda a otros a crecer",
				order: 3,
			},
			{
				id: "q20_d",
				text: "Se enfoca en aprender lo más relevante para los objetivos",
				order: 4,
			},
		],
		strengthMapping: {
			q20_a: { philomath: 0.9, thinker: 0.7, analyst: 0.5 },
			q20_b: { catalyst: 0.8, brainstormer: 0.7, chameleon: 0.6 },
			q20_c: { coach: 0.9, philomath: 0.6, storyteller: 0.5 },
			q20_d: { "focus-expert": 0.8, strategist: 0.7, deliverer: 0.5 },
		},
	},
	{
		order: 21,
		text: "Cuando se enfrenta a un tema que no comprende, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q21_a",
				text: "Se sumerge profundamente en la investigación hasta dominarlo",
				order: 1,
			},
			{
				id: "q21_b",
				text: "Pregunta a expertos y aprende de otros rápidamente",
				order: 2,
			},
			{
				id: "q21_c",
				text: "Experimenta para aprender a través de prueba y error",
				order: 3,
			},
			{
				id: "q21_d",
				text: "Lo piensa cuidadosamente antes de actuar",
				order: 4,
			},
		],
		strengthMapping: {
			q21_a: { philomath: 0.9, analyst: 0.7, thinker: 0.6 },
			q21_b: { coach: 0.7, empathizer: 0.6, chameleon: 0.5 },
			q21_c: { catalyst: 0.8, brainstormer: 0.7, "problem-solver": 0.6 },
			q21_d: { thinker: 0.9, strategist: 0.7, analyst: 0.5 },
		},
	},
	{
		order: 22,
		text: "Al ayudar a un compañero de equipo a mejorar, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{ id: "q22_a", text: "Proporciona guía y mentoría paciente", order: 1 },
			{
				id: "q22_b",
				text: "Comparte recursos y conocimiento generosamente",
				order: 2,
			},
			{ id: "q22_c", text: "Los desafía a superar sus límites", order: 3 },
			{ id: "q22_d", text: "Ofrece apoyo emocional y aliento", order: 4 },
		],
		strengthMapping: {
			q22_a: { coach: 0.9, empathizer: 0.6, "peace-keeper": 0.5 },
			q22_b: { philomath: 0.8, storyteller: 0.6, analyst: 0.5 },
			q22_c: { winner: 0.8, commander: 0.7, "self-believer": 0.5 },
			q22_d: { empathizer: 0.9, optimist: 0.7, coach: 0.5 },
		},
	},

	// ============================================
	// SECCIÓN 8: CREATIVIDAD E INNOVACIÓN
	// ============================================
	{
		order: 23,
		text: "Cuando el equipo necesita ideas frescas, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q23_a",
				text: "Genera numerosas posibilidades creativas",
				order: 1,
			},
			{
				id: "q23_b",
				text: "Conecta conceptos aparentemente no relacionados",
				order: 2,
			},
			{
				id: "q23_c",
				text: "Piensa estratégicamente sobre el impacto a largo plazo",
				order: 3,
			},
			{
				id: "q23_d",
				text: "Aporta energía y entusiasmo para encender la creatividad",
				order: 4,
			},
		],
		strengthMapping: {
			q23_a: { brainstormer: 0.9, catalyst: 0.6, philomath: 0.5 },
			q23_b: { brainstormer: 0.8, philomath: 0.7, thinker: 0.6 },
			q23_c: { strategist: 0.9, thinker: 0.7, analyst: 0.5 },
			q23_d: { catalyst: 0.9, optimist: 0.7, storyteller: 0.5 },
		},
	},
	{
		order: 24,
		text: "Al explorar nuevos enfoques, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q24_a",
				text: "Abraza el cambio y prueba nuevos métodos con entusiasmo",
				order: 1,
			},
			{
				id: "q24_b",
				text: "Evalúa nuevos enfoques contra métodos probados",
				order: 2,
			},
			{
				id: "q24_c",
				text: "Cuenta historias convincentes sobre lo que podría ser",
				order: 3,
			},
			{
				id: "q24_d",
				text: "Asegura que los nuevos enfoques se alineen con los valores fundamentales",
				order: 4,
			},
		],
		strengthMapping: {
			q24_a: { chameleon: 0.9, catalyst: 0.7, brainstormer: 0.6 },
			q24_b: { analyst: 0.8, "problem-solver": 0.7, strategist: 0.6 },
			q24_c: { storyteller: 0.9, optimist: 0.6, brainstormer: 0.5 },
			q24_d: { believer: 0.9, thinker: 0.6, deliverer: 0.5 },
		},
	},
	{
		order: 25,
		text: "Cuando las soluciones convencionales no están funcionando, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q25_a",
				text: "Piensa fuera de la caja para alternativas creativas",
				order: 1,
			},
			{
				id: "q25_b",
				text: "Analiza la causa raíz para encontrar el problema real",
				order: 2,
			},
			{
				id: "q25_c",
				text: "Se adapta rápidamente para probar diferentes enfoques",
				order: 3,
			},
			{
				id: "q25_d",
				text: "Se mantiene confiado en que se encontrará una solución",
				order: 4,
			},
		],
		strengthMapping: {
			q25_a: { brainstormer: 0.9, philomath: 0.6, thinker: 0.5 },
			q25_b: { "problem-solver": 0.9, analyst: 0.8, thinker: 0.5 },
			q25_c: { chameleon: 0.9, catalyst: 0.6, "problem-solver": 0.5 },
			q25_d: { "self-believer": 0.8, optimist: 0.7, winner: 0.5 },
		},
	},

	// ============================================
	// SECCIÓN 9: VALORES Y PRINCIPIOS
	// ============================================
	{
		order: 26,
		text: "Al tomar decisiones importantes, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q26_a",
				text: "Asegura la alineación con los valores personales y del equipo",
				order: 1,
			},
			{
				id: "q26_b",
				text: "Confía en los datos y el análisis objetivo",
				order: 2,
			},
			{
				id: "q26_c",
				text: "Confía en sus instintos y confianza interior",
				order: 3,
			},
			{
				id: "q26_d",
				text: "Considera el impacto en todas las personas involucradas",
				order: 4,
			},
		],
		strengthMapping: {
			q26_a: { believer: 0.9, thinker: 0.6, deliverer: 0.5 },
			q26_b: { analyst: 0.9, strategist: 0.7, thinker: 0.5 },
			q26_c: { "self-believer": 0.9, commander: 0.6, winner: 0.5 },
			q26_d: { empathizer: 0.9, "peace-keeper": 0.7, coach: 0.5 },
		},
	},
	{
		order: 27,
		text: "Cuando se le pide que se comprometa en algo importante, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q27_a",
				text: "Se mantiene firme en principios y valores fundamentales",
				order: 1,
			},
			{
				id: "q27_b",
				text: "Busca una solución creativa que funcione para todos",
				order: 2,
			},
			{
				id: "q27_c",
				text: "Se adapta de manera flexible para encontrar un punto intermedio",
				order: 3,
			},
			{
				id: "q27_d",
				text: "Prioriza mantener las relaciones y la armonía",
				order: 4,
			},
		],
		strengthMapping: {
			q27_a: { believer: 0.9, "self-believer": 0.7, commander: 0.5 },
			q27_b: { brainstormer: 0.7, "problem-solver": 0.7, strategist: 0.6 },
			q27_c: { chameleon: 0.9, "peace-keeper": 0.6, empathizer: 0.5 },
			q27_d: { "peace-keeper": 0.9, empathizer: 0.8, coach: 0.5 },
		},
	},
	{
		order: 28,
		text: "¿Qué motiva más a esta persona en el trabajo?",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q28_a",
				text: "Trabajar en proyectos significativos alineados con sus valores",
				order: 1,
			},
			{
				id: "q28_b",
				text: "Lograr resultados y superar las expectativas",
				order: 2,
			},
			{ id: "q28_c", text: "Aprender y aumentar su experiencia", order: 3 },
			{
				id: "q28_d",
				text: "Ayudar a otros a tener éxito y desarrollarse",
				order: 4,
			},
		],
		strengthMapping: {
			q28_a: { believer: 0.9, thinker: 0.6, deliverer: 0.5 },
			q28_b: { winner: 0.9, catalyst: 0.7, "self-believer": 0.6 },
			q28_c: { philomath: 0.9, analyst: 0.6, thinker: 0.5 },
			q28_d: { coach: 0.9, empathizer: 0.7, "peace-keeper": 0.5 },
		},
	},

	// ============================================
	// SECCIÓN 10: ADAPTABILIDAD Y RESILIENCIA
	// ============================================
	{
		order: 29,
		text: "Cuando los planes cambian inesperadamente, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q29_a",
				text: "Abraza el cambio y se adapta inmediatamente",
				order: 1,
			},
			{
				id: "q29_b",
				text: "Se mantiene enfocado en el objetivo original a pesar de los obstáculos",
				order: 2,
			},
			{
				id: "q29_c",
				text: "Asegura al equipo y mantiene la positividad",
				order: 3,
			},
			{
				id: "q29_d",
				text: "Analiza la nueva situación antes de responder",
				order: 4,
			},
		],
		strengthMapping: {
			q29_a: { chameleon: 0.9, catalyst: 0.6, "problem-solver": 0.5 },
			q29_b: { "focus-expert": 0.9, deliverer: 0.7, believer: 0.5 },
			q29_c: { optimist: 0.9, "peace-keeper": 0.7, empathizer: 0.5 },
			q29_d: { analyst: 0.8, thinker: 0.7, strategist: 0.6 },
		},
	},
	{
		order: 30,
		text: "En momentos de incertidumbre, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{ id: "q30_a", text: "Prospera y ve oportunidades en el caos", order: 1 },
			{
				id: "q30_b",
				text: "Se mantiene centrado y mantiene una visión a largo plazo",
				order: 2,
			},
			{
				id: "q30_c",
				text: "Mantiene la moral alta y el ánimo elevado",
				order: 3,
			},
			{
				id: "q30_d",
				text: "Toma medidas decisivas para crear estabilidad",
				order: 4,
			},
		],
		strengthMapping: {
			q30_a: { chameleon: 0.9, catalyst: 0.7, brainstormer: 0.5 },
			q30_b: { strategist: 0.8, thinker: 0.7, believer: 0.7 },
			q30_c: { optimist: 0.9, storyteller: 0.6, "peace-keeper": 0.5 },
			q30_d: { commander: 0.9, deliverer: 0.6, "focus-expert": 0.5 },
		},
	},
	{
		order: 31,
		text: "Al enfrentarse a contratiempos, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q31_a",
				text: "Se recupera rápidamente con energía renovada",
				order: 1,
			},
			{
				id: "q31_b",
				text: "Aprende de la experiencia y ajusta el enfoque",
				order: 2,
			},
			{
				id: "q31_c",
				text: "Mantiene al equipo motivado y mirando hacia adelante",
				order: 3,
			},
			{
				id: "q31_d",
				text: "Redobla los compromisos y sigue adelante",
				order: 4,
			},
		],
		strengthMapping: {
			q31_a: { catalyst: 0.8, optimist: 0.7, chameleon: 0.6 },
			q31_b: { philomath: 0.7, analyst: 0.7, "problem-solver": 0.6 },
			q31_c: { optimist: 0.9, storyteller: 0.6, coach: 0.5 },
			q31_d: { deliverer: 0.9, winner: 0.7, "self-believer": 0.6 },
		},
	},

	// ============================================
	// SECCIÓN 11: COLABORACIÓN Y TRABAJO EN EQUIPO
	// ============================================
	{
		order: 32,
		text: "Como miembro del equipo, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q32_a",
				text: "Une a las personas y construye conexiones",
				order: 1,
			},
			{
				id: "q32_b",
				text: "Contribuye con un trabajo fiable y constante",
				order: 2,
			},
			{ id: "q32_c", text: "Desafía al equipo a apuntar más alto", order: 3 },
			{
				id: "q32_d",
				text: "Apoya a otros emocional y profesionalmente",
				order: 4,
			},
		],
		strengthMapping: {
			q32_a: { "peace-keeper": 0.9, empathizer: 0.7, storyteller: 0.5 },
			q32_b: { deliverer: 0.9, "time-keeper": 0.7, "focus-expert": 0.5 },
			q32_c: { winner: 0.8, commander: 0.7, "self-believer": 0.6 },
			q32_d: { coach: 0.8, empathizer: 0.8, "peace-keeper": 0.5 },
		},
	},
	{
		order: 33,
		text: "Al trabajar con diversas personalidades, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q33_a",
				text: "Adapta su estilo para conectar con todos",
				order: 1,
			},
			{
				id: "q33_b",
				text: "Ayuda a mediar las diferencias y encontrar puntos en común",
				order: 2,
			},
			{
				id: "q33_c",
				text: "Se mantiene fiel a su propio enfoque a pesar de todo",
				order: 3,
			},
			{
				id: "q33_d",
				text: "Aprende de diferentes perspectivas con curiosidad",
				order: 4,
			},
		],
		strengthMapping: {
			q33_a: { chameleon: 0.9, empathizer: 0.6, storyteller: 0.5 },
			q33_b: { "peace-keeper": 0.9, empathizer: 0.7, coach: 0.5 },
			q33_c: { "self-believer": 0.8, believer: 0.7, commander: 0.5 },
			q33_d: { philomath: 0.8, thinker: 0.7, brainstormer: 0.5 },
		},
	},
	{
		order: 34,
		text: "Cuando el equipo celebra el éxito, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q34_a",
				text: "Cuenta la historia de cómo lo logró el equipo",
				order: 1,
			},
			{
				id: "q34_b",
				text: "Reconoce las contribuciones individuales",
				order: 2,
			},
			{
				id: "q34_c",
				text: "Ya se enfoca en el próximo desafío para ganar",
				order: 3,
			},
			{
				id: "q34_d",
				text: "Aporta energía contagiosa a la celebración",
				order: 4,
			},
		],
		strengthMapping: {
			q34_a: { storyteller: 0.9, optimist: 0.6, philomath: 0.5 },
			q34_b: { coach: 0.8, empathizer: 0.7, "peace-keeper": 0.5 },
			q34_c: { winner: 0.9, catalyst: 0.7, "focus-expert": 0.5 },
			q34_d: { optimist: 0.9, catalyst: 0.7, storyteller: 0.5 },
		},
	},

	// ============================================
	// SECCIÓN 12: ENFOQUE EN RESULTADOS
	// ============================================
	{
		order: 35,
		text: "En cuanto a lograr objetivos, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q35_a",
				text: "Es intensamente competitivo y está impulsado a ser el mejor",
				order: 1,
			},
			{
				id: "q35_b",
				text: "Cumple con cada compromiso de manera fiable",
				order: 2,
			},
			{
				id: "q35_c",
				text: "Toma la iniciativa para que las cosas sucedan rápidamente",
				order: 3,
			},
			{
				id: "q35_d",
				text: "Mantiene un enfoque inquebrantable en el objetivo final",
				order: 4,
			},
		],
		strengthMapping: {
			q35_a: { winner: 0.9, "self-believer": 0.7, commander: 0.5 },
			q35_b: { deliverer: 0.9, "time-keeper": 0.7, believer: 0.5 },
			q35_c: { catalyst: 0.9, winner: 0.6, commander: 0.5 },
			q35_d: { "focus-expert": 0.9, strategist: 0.7, deliverer: 0.5 },
		},
	},
	{
		order: 36,
		text: "Al medir el éxito, esta persona valora...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q36_a",
				text: "Vencer a la competencia y ser el número uno",
				order: 1,
			},
			{
				id: "q36_b",
				text: "Completar tareas a tiempo y según lo prometido",
				order: 2,
			},
			{
				id: "q36_c",
				text: "Tener un impacto positivo en las personas que les rodean",
				order: 3,
			},
			{
				id: "q36_d",
				text: "Lograr objetivos que se alineen con un propósito más profundo",
				order: 4,
			},
		],
		strengthMapping: {
			q36_a: { winner: 0.9, catalyst: 0.6, commander: 0.5 },
			q36_b: { deliverer: 0.9, "time-keeper": 0.8, "focus-expert": 0.5 },
			q36_c: { empathizer: 0.8, coach: 0.7, "peace-keeper": 0.6 },
			q36_d: { believer: 0.9, thinker: 0.6, strategist: 0.5 },
		},
	},
	{
		order: 37,
		text: "Cuando una tarea parece imposible, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q37_a",
				text: "Encuentra formas creativas de hacerlo posible",
				order: 1,
			},
			{ id: "q37_b", text: "Cree firmemente que puede resolverlo", order: 2 },
			{ id: "q37_c", text: "Lo desglosa en pasos manejables", order: 3 },
			{ id: "q37_d", text: "Reúne al equipo para abordarlo juntos", order: 4 },
		],
		strengthMapping: {
			q37_a: { "problem-solver": 0.8, brainstormer: 0.7, chameleon: 0.5 },
			q37_b: { "self-believer": 0.9, optimist: 0.7, winner: 0.5 },
			q37_c: { analyst: 0.7, strategist: 0.7, "focus-expert": 0.6 },
			q37_d: { catalyst: 0.8, commander: 0.7, coach: 0.5 },
		},
	},

	// ============================================
	// SECCIÓN 13: VISIÓN Y ESTRATEGIA
	// ============================================
	{
		order: 38,
		text: "Al pensar en el futuro, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q38_a",
				text: "Desarrolla estrategias integrales a largo plazo",
				order: 1,
			},
			{
				id: "q38_b",
				text: "Imagina múltiples posibilidades creativas",
				order: 2,
			},
			{
				id: "q38_c",
				text: "Se enfoca en lo que debe suceder ahora mismo",
				order: 3,
			},
			{
				id: "q38_d",
				text: "Inspira a otros con una visión optimista",
				order: 4,
			},
		],
		strengthMapping: {
			q38_a: { strategist: 0.9, thinker: 0.7, analyst: 0.5 },
			q38_b: { brainstormer: 0.9, philomath: 0.6, chameleon: 0.5 },
			q38_c: { catalyst: 0.8, deliverer: 0.7, "focus-expert": 0.6 },
			q38_d: { optimist: 0.9, storyteller: 0.7, coach: 0.5 },
		},
	},
	{
		order: 39,
		text: "Al planificar a largo plazo, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q39_a",
				text: "Ve patrones y conexiones que otros pasan por alto",
				order: 1,
			},
			{ id: "q39_b", text: "Crea cronogramas y hitos detallados", order: 2 },
			{
				id: "q39_c",
				text: "Mantiene flexibilidad para cambios inesperados",
				order: 3,
			},
			{
				id: "q39_d",
				text: "Asegura que los planes sirvan a un propósito significativo",
				order: 4,
			},
		],
		strengthMapping: {
			q39_a: { strategist: 0.9, thinker: 0.8, analyst: 0.5 },
			q39_b: { "time-keeper": 0.9, "focus-expert": 0.7, deliverer: 0.5 },
			q39_c: { chameleon: 0.9, "problem-solver": 0.6, brainstormer: 0.5 },
			q39_d: { believer: 0.9, thinker: 0.6, coach: 0.5 },
		},
	},
	{
		order: 40,
		text: "Al analizar situaciones complejas, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q40_a",
				text: "Reúne todos los datos disponibles antes de concluir",
				order: 1,
			},
			{
				id: "q40_b",
				text: "Reflexiona profundamente para comprender las dinámicas subyacentes",
				order: 2,
			},
			{
				id: "q40_c",
				text: "Identifica los factores más críticos rápidamente",
				order: 3,
			},
			{
				id: "q40_d",
				text: "Considera cómo se ven afectados todos los interesados",
				order: 4,
			},
		],
		strengthMapping: {
			q40_a: { analyst: 0.9, philomath: 0.7, "problem-solver": 0.5 },
			q40_b: { thinker: 0.9, strategist: 0.7, analyst: 0.5 },
			q40_c: { "focus-expert": 0.8, strategist: 0.7, "problem-solver": 0.6 },
			q40_d: { empathizer: 0.8, "peace-keeper": 0.7, coach: 0.5 },
		},
	},

	// ============================================
	// SECCIÓN 11: COBERTURA REFORZADA (DOING DOMAIN)
	// ============================================
	{
		order: 41,
		text: "Cuando hay múltiples deadlines cercanos, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q41_a",
				text: "Crea cronogramas detallados y los sigue rigurosamente",
				order: 1,
			},
			{
				id: "q41_b",
				text: "Prioriza las tareas más críticas primero",
				order: 2,
			},
			{
				id: "q41_c",
				text: "Trabaja extra para cumplir con todo",
				order: 3,
			},
			{
				id: "q41_d",
				text: "Delega para distribuir la carga",
				order: 4,
			},
		],
		strengthMapping: {
			q41_a: { "time-keeper": 0.9, "focus-expert": 0.6, analyst: 0.5 },
			q41_b: { strategist: 0.8, "focus-expert": 0.7, "time-keeper": 0.6 },
			q41_c: { deliverer: 0.9, winner: 0.6, "self-believer": 0.5 },
			q41_d: { commander: 0.8, coach: 0.6, catalyst: 0.5 },
		},
	},
	{
		order: 42,
		text: "Cuando una decisión del equipo contradice sus principios, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q42_a",
				text: "Expresa su desacuerdo basándose en valores fundamentales",
				order: 1,
			},
			{
				id: "q42_b",
				text: "Se adapta para mantener la armonía del equipo",
				order: 2,
			},
			{
				id: "q42_c",
				text: "Busca datos objetivos para resolver el dilema",
				order: 3,
			},
			{
				id: "q42_d",
				text: "Propone alternativas que satisfagan a todos",
				order: 4,
			},
		],
		strengthMapping: {
			q42_a: { believer: 0.9, commander: 0.6, "self-believer": 0.5 },
			q42_b: { chameleon: 0.8, "peace-keeper": 0.7, empathizer: 0.5 },
			q42_c: { analyst: 0.9, thinker: 0.6, strategist: 0.5 },
			q42_d: { "problem-solver": 0.8, brainstormer: 0.6, coach: 0.5 },
		},
	},
	{
		order: 43,
		text: "En la planificación de proyectos, esta persona aporta...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q43_a",
				text: "Estimaciones precisas de tiempo y recursos",
				order: 1,
			},
			{
				id: "q43_b",
				text: "Visión estratégica del panorama completo",
				order: 2,
			},
			{
				id: "q43_c",
				text: "Energía para iniciar las actividades rápidamente",
				order: 3,
			},
			{
				id: "q43_d",
				text: "Consideración del impacto en las personas",
				order: 4,
			},
		],
		strengthMapping: {
			q43_a: { "time-keeper": 0.9, analyst: 0.7, "focus-expert": 0.5 },
			q43_b: { strategist: 0.9, thinker: 0.7, philomath: 0.5 },
			q43_c: { catalyst: 0.9, winner: 0.6, commander: 0.5 },
			q43_d: { empathizer: 0.8, coach: 0.7, "peace-keeper": 0.6 },
		},
	},
	{
		order: 44,
		text: "Cuando se presenta una 'zona gris' ética en el trabajo, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q44_a",
				text: "Consulta sus valores internos para guiar la decisión",
				order: 1,
			},
			{
				id: "q44_b",
				text: "Analiza las consecuencias de cada opción",
				order: 2,
			},
			{
				id: "q44_c",
				text: "Busca precedentes y mejores prácticas",
				order: 3,
			},
			{
				id: "q44_d",
				text: "Consulta con el equipo para llegar a consenso",
				order: 4,
			},
		],
		strengthMapping: {
			q44_a: { believer: 0.9, thinker: 0.6, "self-believer": 0.5 },
			q44_b: { analyst: 0.8, strategist: 0.7, "problem-solver": 0.5 },
			q44_c: { philomath: 0.8, analyst: 0.6, strategist: 0.5 },
			q44_d: { "peace-keeper": 0.8, empathizer: 0.7, coach: 0.5 },
		},
	},
	{
		order: 45,
		text: "En el seguimiento de tareas pendientes, esta persona...",
		answerType: "behavioral_choice",
		answerOptions: [
			{
				id: "q45_a",
				text: "Mantiene listas actualizadas y verifica el progreso regularmente",
				order: 1,
			},
			{
				id: "q45_b",
				text: "Se asegura de que los compromisos se cumplan",
				order: 2,
			},
			{
				id: "q45_c",
				text: "Motiva al equipo a mantener el momentum",
				order: 3,
			},
			{
				id: "q45_d",
				text: "Identifica obstáculos y propone soluciones",
				order: 4,
			},
		],
		strengthMapping: {
			q45_a: { "time-keeper": 0.9, "focus-expert": 0.7, analyst: 0.5 },
			q45_b: { deliverer: 0.9, believer: 0.6, commander: 0.5 },
			q45_c: { catalyst: 0.8, optimist: 0.7, storyteller: 0.5 },
			q45_d: { "problem-solver": 0.9, strategist: 0.6, brainstormer: 0.5 },
		},
	},
];

export default feedbackQuestions;
