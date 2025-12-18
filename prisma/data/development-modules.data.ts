/**
 * Development Modules Seed Data
 *
 * Contains 20 development modules organized by strength domains.
 * Each module has content, challenges, and XP rewards.
 */

export interface DevelopmentModuleData {
	key: string;
	titleEs: string;
	descriptionEs: string;
	content: string;
	estimatedMinutes: number;
	xpReward: number;
	level: "beginner" | "intermediate" | "advanced";
	strengthKey?: string;
	domainKey?: string;
	order: number;
}

export const developmentModulesData: DevelopmentModuleData[] = [
	// ============================================================================
	// DOMAIN: DOING (Hacer) - Modules 1-4
	// ============================================================================
	{
		key: "doing-foundations",
		titleEs: "Fundamentos del Dominio Hacer",
		descriptionEs:
			"Descubre cómo las fortalezas de acción y ejecución impulsan resultados tangibles en tu vida y trabajo.",
		content: `# Fundamentos del Dominio Hacer

## Introducción

El dominio **Hacer** representa las fortalezas que transforman ideas en realidad. Las personas con fortalezas en este dominio son los ejecutores, los finalizadores y los solucionadores prácticos.

## Características Clave

- **Orientación a resultados**: Enfoque incansable en la consecución de objetivos
- **Fiabilidad**: Los demás saben que pueden contar contigo
- **Eficiencia**: Capacidad de optimizar procesos y recursos
- **Pragmatismo**: Soluciones prácticas sobre teorías abstractas

## Las Fortalezas del Dominio

1. **Cumplidor (Deliverer)**: La palabra como contrato de honor
2. **Experto en Enfoque (Focus Expert)**: Concentración láser en prioridades
3. **Solucionador de Problemas (Problem Solver)**: Desafíos como oportunidades
4. **Guardián del Tiempo (Time Keeper)**: Maestría en gestión temporal
5. **Analista (Analyst)**: Datos como base de decisiones

## Reflexión Inicial

Antes de continuar, reflexiona:
- ¿Cuándo fue la última vez que transformaste una idea en acción concreta?
- ¿Qué obstáculos típicamente te impiden ejecutar?
- ¿Cómo defines el "éxito" en un proyecto?

## Próximos Pasos

En los siguientes módulos, exploraremos cada fortaleza en detalle y aprenderás técnicas específicas para potenciarlas.`,
		estimatedMinutes: 15,
		xpReward: 150,
		level: "beginner",
		domainKey: "doing",
		order: 1,
	},
	{
		key: "deliverer-mastery",
		titleEs: "Dominando la Fortaleza del Cumplidor",
		descriptionEs:
			"Aprende a convertir cada compromiso en una demostración de fiabilidad y genera confianza inquebrantable.",
		content: `# Dominando la Fortaleza del Cumplidor

## ¿Qué es ser un Cumplidor?

El **Cumplidor** no solo hace lo que dice, sino que entiende cada promesa como un contrato personal de honor. Tu palabra construye tu reputación.

## El Ciclo de la Confianza

\`\`\`
Promesa → Acción → Resultado → Confianza → Más Oportunidades
\`\`\`

Cada compromiso cumplido es un ladrillo que edifica tu carácter y fortalece tus relaciones.

## Técnicas de Potenciación

### 1. El Método de los Tres Filtros
Antes de comprometerte, pregúntate:
- ¿Tengo los recursos para cumplir?
- ¿Es realista el plazo?
- ¿Entiendo completamente lo que se espera?

### 2. Comunicación Proactiva
- Actualiza sobre el progreso antes de que te pregunten
- Si hay obstáculos, comunícalos inmediatamente
- Celebra los hitos cumplidos

### 3. Gestión de Capacidad
- Lleva un registro de compromisos activos
- Aprende a decir "no" cuando sea necesario
- Delega lo que otros pueden hacer

## Señales de Alerta

⚠️ **Sobrecarga**: Demasiados compromisos = calidad reducida
⚠️ **Frustración**: No todos comparten tu nivel de compromiso
⚠️ **Agotamiento**: La responsabilidad sin límites desgasta

## Ejercicio Práctico

Esta semana, documenta cada promesa que hagas (grande o pequeña) y evalúa:
- ¿La cumplí en tiempo y forma?
- ¿Qué aprendí del proceso?
- ¿Cómo puedo mejorar para la próxima?`,
		estimatedMinutes: 20,
		xpReward: 200,
		level: "intermediate",
		strengthKey: "deliverer",
		domainKey: "doing",
		order: 2,
	},
	{
		key: "focus-expert-mastery",
		titleEs: "Dominando el Enfoque Profundo",
		descriptionEs:
			"Desarrolla la capacidad de concentración láser y aprende a priorizar lo verdaderamente importante.",
		content: `# Dominando el Enfoque Profundo

## La Fortaleza del Enfoque

El **Experto en Enfoque** posee la rara habilidad de filtrar el ruido y concentrarse en lo que realmente importa. En un mundo de distracciones constantes, esta fortaleza es invaluable.

## El Costo del Multitasking

Estudios demuestran que el cambio constante de tareas puede:
- Reducir la productividad hasta un 40%
- Aumentar los errores
- Generar estrés y fatiga mental

## Técnicas de Enfoque Profundo

### 1. Time Blocking
Dedica bloques de tiempo ininterrumpidos a tareas importantes:
- 90 minutos de trabajo enfocado
- 20 minutos de descanso
- Repite

### 2. La Regla del Uno
- Una tarea principal por día
- Una prioridad por semana
- Un objetivo por trimestre

### 3. Diseño del Entorno
- Elimina notificaciones durante el trabajo profundo
- Crea un espacio físico dedicado
- Usa señales visuales para indicar "no interrumpir"

## El Framework de Priorización

| Urgente + Importante | No Urgente + Importante |
|---------------------|------------------------|
| Hazlo ahora         | Programa tiempo        |

| Urgente + No Importante | No Urgente + No Importante |
|------------------------|---------------------------|
| Delega                 | Elimina                   |

## Desafío Semanal

Implementa una sesión de "Deep Work" de 2 horas esta semana:
1. Elige tu tarea más importante
2. Bloquea un horario sin interrupciones
3. Documenta qué lograste vs. tu productividad normal`,
		estimatedMinutes: 25,
		xpReward: 250,
		level: "intermediate",
		strengthKey: "focus-expert",
		domainKey: "doing",
		order: 3,
	},
	{
		key: "doing-advanced-integration",
		titleEs: "Integración Avanzada del Dominio Hacer",
		descriptionEs:
			"Combina tus fortalezas de ejecución para maximizar impacto y liderar proyectos complejos.",
		content: `# Integración Avanzada del Dominio Hacer

## Sinergia de Fortalezas

Cuando las fortalezas del dominio Hacer trabajan juntas, el resultado es mayor que la suma de sus partes.

## Patrones de Integración

### Patrón 1: Cumplidor + Enfoque
- **Resultado**: Proyectos entregados con excelencia
- **Aplicación**: Usa el enfoque para priorizar, el cumplimiento para ejecutar

### Patrón 2: Analista + Solucionador
- **Resultado**: Decisiones basadas en datos con acción rápida
- **Aplicación**: Analiza hasta tener suficiente información, luego actúa

### Patrón 3: Guardián del Tiempo + Cumplidor
- **Resultado**: Plazos cumplidos sin sacrificar calidad
- **Aplicación**: Planifica hacia atrás desde la fecha límite

## Liderando con el Dominio Hacer

Como líder con fortalezas en Hacer:

1. **Modela la ejecución**: Los demás seguirán tu ejemplo
2. **Establece estándares claros**: Define qué significa "terminado"
3. **Celebra los logros**: Reconoce la ejecución, no solo las ideas
4. **Protege el tiempo del equipo**: Elimina reuniones innecesarias

## El Riesgo de la Sobre-Acción

> "La actividad sin propósito es el enemigo del progreso."

Señales de que estás actuando sin estrategia:
- Siempre ocupado pero sin avances significativos
- El equipo está agotado pero los resultados no mejoran
- Las prioridades cambian constantemente

## Plan de Desarrollo Personal

Crea tu plan de 30 días:
1. **Semana 1**: Identifica tu fortaleza dominante del dominio
2. **Semana 2**: Practica la integración con una fortaleza complementaria
3. **Semana 3**: Aplica en un proyecto real
4. **Semana 4**: Evalúa resultados y ajusta`,
		estimatedMinutes: 30,
		xpReward: 350,
		level: "advanced",
		domainKey: "doing",
		order: 4,
	},

	// ============================================================================
	// DOMAIN: FEELING (Sentir) - Modules 5-8
	// ============================================================================
	{
		key: "feeling-foundations",
		titleEs: "Fundamentos del Dominio Sentir",
		descriptionEs:
			"Explora cómo la inteligencia emocional y las relaciones profundas fortalecen equipos y organizaciones.",
		content: `# Fundamentos del Dominio Sentir

## El Corazón del Equipo

El dominio **Sentir** representa las fortalezas interpersonales y la inteligencia emocional. Quienes lideran con estas fortalezas son el pegamento que une al equipo.

## Características Clave

- **Conexión genuina**: Relaciones profundas y significativas
- **Lectura emocional**: Capacidad de percibir el clima del grupo
- **Apoyo incondicional**: Estar presente para los demás
- **Armonía constructiva**: Facilitar la colaboración

## Las Fortalezas del Dominio

1. **Creyente (Believer)**: Valores como brújula
2. **Camaleón (Chameleon)**: Adaptabilidad social
3. **Entrenador (Coach)**: Desarrollo del potencial ajeno
4. **Empatizador (Empathizer)**: Sentir lo que otros sienten
5. **Optimista (Optimist)**: Ver posibilidades donde otros ven problemas

## El Impacto en el Equipo

Equipos con fortalezas en Sentir:
- Mayor retención de talento
- Mejor manejo de conflictos
- Cultura de seguridad psicológica
- Innovación a través de la colaboración

## Reflexión Inicial

- ¿Cómo describes la calidad de tus relaciones profesionales?
- ¿Cuándo fue la última vez que alguien te confió algo importante?
- ¿Cómo manejas las emociones difíciles en el trabajo?`,
		estimatedMinutes: 15,
		xpReward: 150,
		level: "beginner",
		domainKey: "feeling",
		order: 5,
	},
	{
		key: "empathizer-mastery",
		titleEs: "Dominando la Empatía Activa",
		descriptionEs:
			"Desarrolla la capacidad de conectar profundamente con otros sin perderte en el proceso.",
		content: `# Dominando la Empatía Activa

## Más Allá de "Entender"

El **Empatizador** no solo comprende los sentimientos ajenos; los siente. Esta fortaleza crea conexiones profundas pero requiere gestión consciente.

## Los Tres Niveles de Empatía

### 1. Empatía Cognitiva
- Entender la perspectiva del otro
- "Comprendo por qué te sientes así"

### 2. Empatía Emocional
- Sentir lo que el otro siente
- "Siento tu frustración/alegría"

### 3. Empatía Compasiva
- Motivación a ayudar
- "¿Cómo puedo apoyarte?"

## Técnicas de Empatía Activa

### Escucha de Tres Niveles
1. **Contenido**: ¿Qué dicen las palabras?
2. **Emoción**: ¿Qué siento detrás de las palabras?
3. **Necesidad**: ¿Qué necesitan realmente?

### El Arte del Reflejo
- "Lo que escucho es..."
- "Parece que sientes..."
- "Me pregunto si necesitas..."

## Protección Emocional

⚠️ **Señales de sobrecarga empática**:
- Fatiga emocional constante
- Dificultad para separar emociones propias de ajenas
- Evitación de interacciones

### Estrategias de Protección
1. Establece límites claros de tiempo y energía
2. Practica la "desconexión compasiva"
3. Recarga con actividades que te nutran
4. Distingue entre apoyo y rescate

## Ejercicio: El Diario Empático

Durante una semana, registra:
- Momento de conexión empática
- Emoción percibida
- Cómo te afectó
- Qué aprendiste`,
		estimatedMinutes: 20,
		xpReward: 200,
		level: "intermediate",
		strengthKey: "empathizer",
		domainKey: "feeling",
		order: 6,
	},
	{
		key: "coach-mastery",
		titleEs: "El Arte del Coaching Transformador",
		descriptionEs:
			"Aprende a desarrollar el potencial de otros a través de preguntas poderosas y feedback efectivo.",
		content: `# El Arte del Coaching Transformador

## La Fortaleza del Entrenador

El **Coach** ve el potencial que otros no ven en sí mismos. Tu don es ayudar a las personas a crecer.

## Coaching vs. Mentoría vs. Consejo

| Coaching | Mentoría | Consejo |
|----------|----------|---------|
| Preguntas | Experiencia | Soluciones |
| "¿Qué crees que deberías hacer?" | "Cuando yo estuve ahí..." | "Deberías hacer X" |
| Desarrolla capacidad | Transfiere conocimiento | Resuelve problema inmediato |

## El Modelo GROW

### Goal (Meta)
- ¿Qué quieres lograr?
- ¿Cómo sabrás que lo lograste?

### Reality (Realidad)
- ¿Dónde estás ahora?
- ¿Qué has intentado?

### Options (Opciones)
- ¿Qué podrías hacer?
- ¿Qué más?

### Will (Voluntad)
- ¿Qué harás?
- ¿Cuándo?
- ¿Qué apoyo necesitas?

## Preguntas Poderosas

- "¿Qué te impide avanzar?"
- "¿Qué sería posible si...?"
- "¿Qué consejo le darías a alguien en tu situación?"
- "¿Cuál es el primer paso más pequeño?"

## Feedback Efectivo

### Modelo SBI
- **Situación**: "En la reunión de ayer..."
- **Comportamiento**: "Cuando interrumpiste a María..."
- **Impacto**: "El equipo pareció desconectarse"

## Práctica: Una Conversación de Coaching

Esta semana, ten una conversación usando solo preguntas:
1. Identifica a alguien con un desafío
2. Usa el modelo GROW
3. Resiste dar consejos
4. Evalúa el resultado`,
		estimatedMinutes: 25,
		xpReward: 250,
		level: "intermediate",
		strengthKey: "coach",
		domainKey: "feeling",
		order: 7,
	},
	{
		key: "feeling-advanced-integration",
		titleEs: "Liderazgo Emocional Integrado",
		descriptionEs:
			"Desarrolla un estilo de liderazgo que combina inteligencia emocional con efectividad organizacional.",
		content: `# Liderazgo Emocional Integrado

## La Paradoja del Líder Empático

El liderazgo efectivo requiere:
- Conexión profunda Y toma de decisiones difíciles
- Empatía Y accountability
- Cuidado del equipo Y logro de resultados

## Patrones de Integración

### Patrón 1: Empatía + Coaching
- **Resultado**: Desarrollo de talento acelerado
- **Aplicación**: Usa la empatía para entender, el coaching para crecer

### Patrón 2: Optimismo + Creyente
- **Resultado**: Visión inspiradora y auténtica
- **Aplicación**: Conecta el propósito con las posibilidades

### Patrón 3: Camaleón + Empatizador
- **Resultado**: Influencia adaptativa y genuina
- **Aplicación**: Ajusta tu estilo sin perder autenticidad

## Creando Seguridad Psicológica

Los equipos de alto rendimiento comparten:
1. **Seguridad para hablar**: Sin miedo a represalias
2. **Seguridad para fallar**: Los errores son oportunidades
3. **Seguridad para ser auténtico**: No hay que fingir

### Tu Rol como Líder
- Modela la vulnerabilidad
- Responde positivamente al feedback
- Celebra los aprendizajes, no solo los éxitos

## El Balance Emocional

> "Cuida del equipo, pero no a costa de ti mismo."

Señales de desequilibrio:
- Priorizas la armonía sobre los resultados necesarios
- Evitas conversaciones difíciles
- Asumes los problemas emocionales de todos

## Plan de Desarrollo: 30 Días

1. **Semana 1**: Practica una conversación difícil con empatía
2. **Semana 2**: Implementa una rutina de check-in emocional
3. **Semana 3**: Da feedback usando el modelo SBI
4. **Semana 4**: Evalúa el clima emocional del equipo`,
		estimatedMinutes: 30,
		xpReward: 350,
		level: "advanced",
		domainKey: "feeling",
		order: 8,
	},

	// ============================================================================
	// DOMAIN: MOTIVATING (Motivar) - Modules 9-12
	// ============================================================================
	{
		key: "motivating-foundations",
		titleEs: "Fundamentos del Dominio Motivar",
		descriptionEs:
			"Descubre cómo las fortalezas de influencia y liderazgo impulsan a los equipos hacia la acción.",
		content: `# Fundamentos del Dominio Motivar

## La Chispa y el Timón

El dominio **Motivar** agrupa las fortalezas que inician el movimiento y mantienen el impulso. Son los catalizadores, influenciadores y líderes natos.

## Características Clave

- **Iniciativa**: Actúan primero, no esperan permiso
- **Influencia**: Movilizan a otros hacia objetivos
- **Competitividad**: El deseo de ganar como combustible
- **Carisma**: Atraen seguidores naturalmente

## Las Fortalezas del Dominio

1. **Catalizador (Catalyst)**: Inicia el cambio
2. **Comandante (Commander)**: Toma decisiones decisivas
3. **Competidor (Competitor)**: Impulso por superar
4. **Autoconfiado (Self-Believer)**: Certeza interna
5. **Vendedor (Peacemaker/Influencer)**: Persuasión efectiva

## El Motor del Cambio

Equipos con fortalezas en Motivar:
- Mayor velocidad de decisión
- Cultura de iniciativa
- Capacidad de movilización
- Resiliencia ante la adversidad

## Reflexión Inicial

- ¿Cuándo fue la última vez que inspiraste a alguien a actuar?
- ¿Cómo manejas el deseo de ganar?
- ¿Qué te da confianza en tus decisiones?`,
		estimatedMinutes: 15,
		xpReward: 150,
		level: "beginner",
		domainKey: "motivating",
		order: 9,
	},
	{
		key: "catalyst-mastery",
		titleEs: "Dominando el Arte de Catalizar el Cambio",
		descriptionEs:
			"Aprende a iniciar transformaciones y movilizar equipos hacia nuevas direcciones.",
		content: `# Dominando el Arte de Catalizar el Cambio

## El Poder del Catalizador

El **Catalizador** no espera a que el cambio suceda; lo inicia. Ves oportunidades donde otros ven obstáculos y actúas primero.

## La Química del Cambio

Como en una reacción química:
\`\`\`
Estado Actual + Catalizador → Transformación → Nuevo Estado
\`\`\`

Tu presencia acelera procesos que de otra forma tomarían mucho más tiempo.

## Técnicas de Catálisis Efectiva

### 1. El Primer Paso Visible
- Actúa antes de tener el plan perfecto
- Muestra que es posible con el ejemplo
- Crea momentum con victorias rápidas

### 2. Creación de Urgencia Constructiva
- ¿Por qué ahora y no después?
- ¿Qué costo tiene la inacción?
- ¿Qué oportunidad se pierde si esperamos?

### 3. Alianzas Estratégicas
- Identifica a otros catalizadores
- Encuentra a los influenciadores clave
- Construye una coalición de cambio

## El Modelo de Kotter para el Cambio

1. Crear urgencia
2. Formar coalición
3. Desarrollar visión
4. Comunicar la visión
5. Empoderar para la acción
6. Generar victorias a corto plazo
7. Consolidar y producir más cambio
8. Anclar en la cultura

## Señales de Alerta

⚠️ **Cambio sin propósito**: Cambiar por cambiar
⚠️ **Resistencia ignorada**: No todos los stakeholders están listos
⚠️ **Fatiga de cambio**: Demasiadas iniciativas simultáneas

## Práctica: Inicia un Micro-Cambio

Esta semana:
1. Identifica algo que debería cambiar en tu entorno
2. Define el primer paso más pequeño
3. Actúa sin pedir permiso
4. Documenta la reacción`,
		estimatedMinutes: 20,
		xpReward: 200,
		level: "intermediate",
		strengthKey: "catalyst",
		domainKey: "motivating",
		order: 10,
	},
	{
		key: "commander-mastery",
		titleEs: "Liderazgo Decisivo y Responsable",
		descriptionEs:
			"Desarrolla la capacidad de tomar decisiones difíciles con confianza y responsabilidad.",
		content: `# Liderazgo Decisivo y Responsable

## La Fortaleza del Comandante

El **Comandante** tiene presencia. Cuando hablas, la gente escucha. Tomas decisiones cuando otros dudan y asumes la responsabilidad de los resultados.

## El Peso de Decidir

> "La peor decisión es no tomar ninguna decisión."

Pero decidir rápido ≠ decidir bien. El comandante efectivo:
- Recopila información suficiente (no perfecta)
- Considera perspectivas clave
- Actúa con convicción
- Se adapta según resultados

## Framework de Decisión Rápida

### El Método 40-70
- Con menos del 40% de información: No decides
- Con más del 70% de información: Ya tardaste
- Entre 40-70%: Es momento de actuar

### Preguntas de Clarificación
1. ¿Cuál es la decisión real que debo tomar?
2. ¿Qué pasa si no decido ahora?
3. ¿Es reversible o irreversible?
4. ¿Quién será impactado?

## Liderazgo con Autoridad y Humildad

El comandante maduro:
- **Dirige con claridad**: Sin ambigüedad en las expectativas
- **Escucha antes de decidir**: La autoridad no excluye el input
- **Asume errores**: "Me equivoqué" construye más respeto que excusas
- **Desarrolla sucesores**: El poder compartido multiplica impacto

## Comunicación del Comandante

### Estructura BLUF (Bottom Line Up Front)
1. La decisión/acción principal
2. Por qué
3. Cómo
4. Próximos pasos

Ejemplo:
> "Vamos a cambiar de proveedor [decisión]. Los costos actuales son insostenibles [por qué]. Migraremosen 3 fases [cómo]. Esta semana finalizamos el contrato [próximo paso]."

## Práctica: Una Decisión Difícil

Identifica una decisión que has estado posponiendo:
1. Usa el método 40-70 para evaluar tu información
2. Aplica las preguntas de clarificación
3. Decide y comunica usando BLUF
4. Evalúa el resultado en una semana`,
		estimatedMinutes: 25,
		xpReward: 250,
		level: "intermediate",
		strengthKey: "commander",
		domainKey: "motivating",
		order: 11,
	},
	{
		key: "motivating-advanced-integration",
		titleEs: "Influencia Estratégica y Sostenible",
		descriptionEs:
			"Combina tus fortalezas de motivación para crear cambio duradero y equipos autónomos.",
		content: `# Influencia Estratégica y Sostenible

## Más Allá del Impulso Inicial

El catalizador inicia, pero el líder efectivo sostiene. ¿Cómo convertir la motivación inicial en cambio duradero?

## Patrones de Integración

### Patrón 1: Catalizador + Comandante
- **Resultado**: Cambio rápido y decisivo
- **Aplicación**: Inicia con urgencia, decide con claridad

### Patrón 2: Competidor + Autoconfiado
- **Resultado**: Persistencia ante la adversidad
- **Aplicación**: Usa la competencia como combustible, la confianza como ancla

### Patrón 3: Vendedor + Catalizador
- **Resultado**: Movimientos virales de cambio
- **Aplicación**: Vende la visión, cataliza la acción

## El Dilema del Motivador

> "¿Cómo motivo sin crear dependencia?"

### De la Motivación Extrínseca a la Intrínseca
1. **Fase 1**: Inspiras directamente (tú eres el motor)
2. **Fase 2**: Conectas con el propósito personal de otros
3. **Fase 3**: Creas sistemas que auto-refuerzan
4. **Fase 4**: El equipo se motiva solo

## Influencia sin Autoridad Formal

Cuando no tienes el título pero sí la responsabilidad:
- **Construye credibilidad**: Resultados hablan más que palabras
- **Crea reciprocidad**: Da antes de pedir
- **Alinea intereses**: ¿Qué ganan ellos?
- **Usa la autoridad de otros**: Alianzas estratégicas

## Liderazgo Situacional

| Nivel del Equipo | Tu Estilo |
|------------------|-----------|
| Nuevo, inseguro | Directivo: Instrucciones claras |
| Competente pero desmotivado | Coaching: Apoyo y guía |
| Capaz y motivado | Delegación: Autonomía y confianza |

## Plan de 30 Días: Influencia Sostenible

1. **Semana 1**: Identifica a 3 personas clave que necesitas influenciar
2. **Semana 2**: Mapea sus intereses y motivaciones
3. **Semana 3**: Crea valor para ellos antes de pedir algo
4. **Semana 4**: Propón una iniciativa conjunta`,
		estimatedMinutes: 30,
		xpReward: 350,
		level: "advanced",
		domainKey: "motivating",
		order: 12,
	},

	// ============================================================================
	// DOMAIN: THINKING (Pensar) - Modules 13-16
	// ============================================================================
	{
		key: "thinking-foundations",
		titleEs: "Fundamentos del Dominio Pensar",
		descriptionEs:
			"Explora cómo las fortalezas de pensamiento estratégico y análisis aportan claridad y dirección.",
		content: `# Fundamentos del Dominio Pensar

## La Mente del Equipo

El dominio **Pensar** agrupa las fortalezas cognitivas que aportan perspectiva, análisis y visión estratégica. Son los arquitectos intelectuales del equipo.

## Características Clave

- **Perspectiva amplia**: Ven el panorama completo
- **Profundidad analítica**: Descomponen la complejidad
- **Visión a largo plazo**: Piensan en consecuencias futuras
- **Curiosidad insaciable**: Siempre aprendiendo

## Las Fortalezas del Dominio

1. **Estratega (Strategist)**: Planificación y visión
2. **Generador de Ideas (Brainstormer)**: Creatividad fluida
3. **Filósofo (Philosopher)**: Pensamiento profundo
4. **Estudioso (Philomath)**: Amor por el aprendizaje
5. **Contextualista**: Conexión pasado-presente-futuro

## El Aporte al Equipo

Equipos con fortalezas en Pensar:
- Decisiones más informadas
- Menos errores estratégicos
- Innovación basada en análisis
- Adaptabilidad ante la incertidumbre

## Reflexión Inicial

- ¿Cuándo fue la última vez que cambiaste de opinión por nueva información?
- ¿Cómo procesas ideas complejas?
- ¿Qué te impulsa a aprender?`,
		estimatedMinutes: 15,
		xpReward: 150,
		level: "beginner",
		domainKey: "thinking",
		order: 13,
	},
	{
		key: "strategist-mastery",
		titleEs: "Pensamiento Estratégico en Acción",
		descriptionEs:
			"Desarrolla la capacidad de crear visiones claras y planes ejecutables para el largo plazo.",
		content: `# Pensamiento Estratégico en Acción

## La Fortaleza del Estratega

El **Estratega** ve patrones donde otros ven caos. Conectas puntos, anticipas obstáculos y trazas caminos hacia objetivos distantes.

## Estrategia vs. Táctica

| Estrategia | Táctica |
|------------|---------|
| Ganar la guerra | Ganar la batalla |
| 3-5 años | 1-12 meses |
| Dirección | Acciones |
| "¿Hacia dónde vamos?" | "¿Cómo llegamos?" |

## El Framework de Pensamiento Estratégico

### 1. Análisis de Situación
- ¿Dónde estamos ahora?
- ¿Cuáles son nuestras fortalezas y debilidades?
- ¿Qué oportunidades y amenazas enfrentamos?

### 2. Visión de Futuro
- ¿Dónde queremos estar?
- ¿Cómo se ve el éxito?
- ¿Qué debe ser verdad para lograrlo?

### 3. Caminos Alternativos
- ¿Cuáles son las opciones?
- ¿Cuáles son los trade-offs?
- ¿Qué barreras enfrentará cada camino?

### 4. Elección y Compromiso
- ¿Qué elegimos y qué sacrificamos?
- ¿Cómo mediremos el progreso?
- ¿Cuáles son los hitos clave?

## Herramientas del Estratega

### Pensamiento de Segundo Orden
No solo: "¿Qué pasará si hago X?"
Sino: "¿Y luego qué? ¿Y después de eso qué?"

### Escenarios
- **Optimista**: Todo sale bien
- **Pesimista**: Todo sale mal
- **Realista**: Combinación probable

## Práctica: Tu Estrategia Personal

Aplica el framework a tu desarrollo profesional:
1. ¿Dónde estás profesionalmente hoy?
2. ¿Dónde quieres estar en 5 años?
3. ¿Cuáles son 3 caminos posibles?
4. ¿Cuál eliges y por qué?`,
		estimatedMinutes: 25,
		xpReward: 250,
		level: "intermediate",
		strengthKey: "strategist",
		domainKey: "thinking",
		order: 14,
	},
	{
		key: "brainstormer-mastery",
		titleEs: "Creatividad Productiva y Enfocada",
		descriptionEs:
			"Aprende a canalizar tu generación de ideas hacia resultados concretos y valiosos.",
		content: `# Creatividad Productiva y Enfocada

## La Fortaleza del Generador de Ideas

El **Brainstormer** tiene un flujo constante de posibilidades. Tu mente hace conexiones inesperadas y ve soluciones que otros pasan por alto.

## El Desafío del Ideador

> "Tener muchas ideas ≠ Tener buenas ideas implementables"

El brainstormer efectivo no solo genera; también filtra, refina y ejecuta.

## Técnicas de Generación Estructurada

### 1. SCAMPER
- **S**ustituir: ¿Qué puedo reemplazar?
- **C**ombinar: ¿Qué puedo unir?
- **A**daptar: ¿Qué puedo ajustar?
- **M**odificar: ¿Qué puedo cambiar?
- **P**oner otros usos: ¿Cómo más puedo usarlo?
- **E**liminar: ¿Qué puedo quitar?
- **R**eordenar: ¿Qué puedo reorganizar?

### 2. Los Seis Sombreros
- ⚪ Blanco: Datos y hechos
- 🔴 Rojo: Emociones e intuición
- ⚫ Negro: Riesgos y problemas
- 🟡 Amarillo: Beneficios y optimismo
- 🟢 Verde: Creatividad y alternativas
- 🔵 Azul: Proceso y control

### 3. Conexiones Forzadas
1. Elige dos conceptos no relacionados
2. Encuentra 10 conexiones entre ellos
3. Evalúa cuáles son aplicables a tu desafío

## Del Ideamiento a la Acción

### El Filtro de 3 Preguntas
1. ¿Es deseable? (¿Alguien lo quiere?)
2. ¿Es factible? (¿Podemos hacerlo?)
3. ¿Es viable? (¿Tiene sentido económico/estratégico?)

### El Prototipo Rápido
- No esperes a tener la idea perfecta
- Crea una versión mínima en horas, no semanas
- Obtén feedback real temprano

## Práctica: Sesión de Ideación Estructurada

1. Define un problema específico
2. Usa SCAMPER para generar 15+ ideas
3. Filtra con las 3 preguntas
4. Prototipa la mejor idea en 1 hora`,
		estimatedMinutes: 25,
		xpReward: 250,
		level: "intermediate",
		strengthKey: "brainstormer",
		domainKey: "thinking",
		order: 15,
	},
	{
		key: "thinking-advanced-integration",
		titleEs: "Arquitectura Intelectual del Equipo",
		descriptionEs:
			"Combina pensamiento estratégico, creatividad y análisis para liderar la dirección intelectual del equipo.",
		content: `# Arquitectura Intelectual del Equipo

## El Rol del Pensador Integrado

El pensador maduro no solo piensa; facilita el pensamiento del equipo. Crea las estructuras que permiten a otros pensar mejor.

## Patrones de Integración

### Patrón 1: Estratega + Brainstormer
- **Resultado**: Innovación estratégica
- **Aplicación**: Genera opciones creativas, filtra por valor estratégico

### Patrón 2: Filósofo + Estudioso
- **Resultado**: Sabiduría aplicada
- **Aplicación**: Profundiza en el conocimiento, extrae principios universales

### Patrón 3: Contextualista + Estratega
- **Resultado**: Decisiones informadas por la historia
- **Aplicación**: Aprende del pasado, planifica el futuro

## Facilitando el Pensamiento Colectivo

### El Arte de las Buenas Preguntas
- No des respuestas; haz mejores preguntas
- "¿Qué pasaría si...?" abre posibilidades
- "¿Por qué es esto importante?" clarifica valores
- "¿Qué estamos asumiendo?" revela puntos ciegos

### Creando Espacios de Reflexión
El equipo necesita tiempo para pensar:
- Agendas con "tiempo blanco"
- Retrospectivas regulares
- Días sin reuniones

## El Dilema del Pensador

> "¿Cuándo dejo de analizar y empiezo a actuar?"

### Señales de sobre-análisis:
- Tienes toda la información pero no decides
- Cada nueva idea abre más preguntas
- El equipo está frustrado esperando

### El Principio de "Suficientemente Bueno"
- Define criterios mínimos antes de analizar
- Cuando se cumplen, actúa
- Ajusta en el camino

## Plan de 30 Días

1. **Semana 1**: Facilita una sesión de pensamiento estratégico
2. **Semana 2**: Implementa un "espacio de reflexión" semanal
3. **Semana 3**: Practica hacer solo preguntas (sin dar respuestas)
4. **Semana 4**: Evalúa la calidad del pensamiento del equipo`,
		estimatedMinutes: 30,
		xpReward: 350,
		level: "advanced",
		domainKey: "thinking",
		order: 16,
	},

	// ============================================================================
	// CROSS-DOMAIN MODULES - 17-20
	// ============================================================================
	{
		key: "cross-domain-integration",
		titleEs: "Integrando los Cuatro Dominios",
		descriptionEs:
			"Aprende a balancear y combinar fortalezas de diferentes dominios para máximo impacto.",
		content: `# Integrando los Cuatro Dominios

## El Líder Completo

Ningún dominio es suficiente por sí solo. Los equipos y líderes más efectivos combinan:

- **Pensar**: Visión y estrategia
- **Motivar**: Influencia y acción
- **Sentir**: Conexión y cultura
- **Hacer**: Ejecución y resultados

## El Ciclo de Impacto

\`\`\`
Pensar → Motivar → Hacer → Sentir → Pensar...
\`\`\`

1. **Pensar**: Claridad sobre qué y por qué
2. **Motivar**: Energía y dirección para actuar
3. **Hacer**: Transformación en resultados
4. **Sentir**: Cuidado de las personas y la cultura
5. Volver a **Pensar**: Aprendizaje y ajuste

## Patrones de Integración Avanzada

### El Líder Estratégico-Empático
- Combina: Pensar + Sentir
- Fortaleza: Decisiones que consideran el impacto humano
- Riesgo: Lentitud por sobre-consideración

### El Catalizador Analítico
- Combina: Pensar + Motivar
- Fortaleza: Cambio basado en datos
- Riesgo: Parálisis por análisis

### El Ejecutor Conectado
- Combina: Hacer + Sentir
- Fortaleza: Resultados sin dañar relaciones
- Riesgo: Evitar decisiones difíciles

### El Motivador Práctico
- Combina: Motivar + Hacer
- Fortaleza: Ideas que se convierten en acción
- Riesgo: Actuar sin estrategia clara

## Diagnóstico Personal

Para cada dominio, evalúa del 1 al 5:
- ¿Cuánto uso este dominio actualmente?
- ¿Cuánto debería usarlo dado mi rol?
- ¿Cuál es la brecha?

## Plan de Desarrollo Integrado

1. Identifica tu dominio más fuerte
2. Identifica tu dominio más débil
3. Busca un compañero con fortalezas complementarias
4. Practica integración consciente por 30 días`,
		estimatedMinutes: 25,
		xpReward: 300,
		level: "advanced",
		order: 17,
	},
	{
		key: "team-strength-dynamics",
		titleEs: "Dinámicas de Fortalezas en Equipo",
		descriptionEs:
			"Comprende cómo las fortalezas individuales interactúan para crear equipos de alto rendimiento.",
		content: `# Dinámicas de Fortalezas en Equipo

## Más que la Suma de las Partes

Un equipo no es solo una colección de individuos. Las fortalezas interactúan, se amplifican y a veces chocan.

## Patrones de Interacción

### Fortalezas Complementarias
- Cuando A + B > A o B por separado
- Ejemplo: Estratega + Cumplidor = Planes ejecutados
- Buscar: Parejas donde uno inicia y otro termina

### Fortalezas Que Chocan
- Cuando A vs B crea fricción
- Ejemplo: Comandante + Empatizador en decisiones difíciles
- Resolver: Definir cuándo cada uno lidera

### Fortalezas Amplificadas
- Cuando A + A = Súper A
- Ejemplo: Dos Catalizadores = Cambio acelerado
- Cuidar: Puede haber exceso y puntos ciegos

## El Mapa de Fortalezas del Equipo

### Análisis de Cobertura
1. Lista las fortalezas de cada miembro
2. Agrupa por dominio
3. Identifica: ¿Dónde hay abundancia? ¿Dónde hay vacíos?

### Preguntas Clave
- ¿Quién piensa estratégicamente?
- ¿Quién cuida las relaciones?
- ¿Quién ejecuta consistentemente?
- ¿Quién energiza y moviliza?

## Diseño Intencional de Equipos

### Por Proyecto
- **Innovación**: Más Pensar + Motivar
- **Ejecución**: Más Hacer + Sentir
- **Crisis**: Más Motivar + Hacer
- **Cultura**: Más Sentir + Pensar

### Por Fase
- **Inicio**: Catalizadores, Estrategas
- **Desarrollo**: Brainstormers, Coaches
- **Cierre**: Cumplidores, Enfocadores

## Conversaciones de Fortalezas

### Para el equipo:
1. ¿Cuáles son nuestras fortalezas colectivas?
2. ¿Dónde somos vulnerables?
3. ¿Cómo compensamos los vacíos?
4. ¿Quién lidera en qué situaciones?

## Práctica: Mapeo de Tu Equipo

1. Recopila las top 5 fortalezas de cada miembro
2. Crea un mapa visual por dominio
3. Identifica patrones y vacíos
4. Presenta los hallazgos al equipo`,
		estimatedMinutes: 25,
		xpReward: 300,
		level: "advanced",
		order: 18,
	},
	{
		key: "personal-development-plan",
		titleEs: "Tu Plan de Desarrollo Personal",
		descriptionEs:
			"Crea un plan personalizado para potenciar tus fortalezas y compensar tus áreas de desarrollo.",
		content: `# Tu Plan de Desarrollo Personal

## El Enfoque Basado en Fortalezas

> "No intentes arreglar tus debilidades. Potencia tus fortalezas."

La investigación muestra:
- Enfocarse en fortalezas aumenta el engagement 6x
- Los equipos basados en fortalezas son 12% más productivos
- Las personas que usan sus fortalezas diariamente son 3x más felices

## Framework de Desarrollo Personal

### 1. Conocer
- ¿Cuáles son mis top 5 fortalezas?
- ¿En qué dominio predomino?
- ¿Cuál es mi patrón único?

### 2. Aplicar
- ¿Dónde estoy usando mis fortalezas actualmente?
- ¿Dónde podría usarlas más?
- ¿Qué actividades me drenan porque no uso fortalezas?

### 3. Desarrollar
- ¿Cómo llevo mis fortalezas de "bueno" a "excepcional"?
- ¿Qué habilidades complementarias necesito?
- ¿Quién puede mentorearme?

### 4. Compensar
- ¿Cuáles son mis puntos ciegos?
- ¿Quién en mi entorno tiene fortalezas complementarias?
- ¿Qué sistemas puedo crear para cubrir debilidades?

## El Plan de 90 Días

### Mes 1: Conciencia
- Semana 1-2: Documenta cuándo usas cada fortaleza
- Semana 3-4: Identifica patrones y oportunidades

### Mes 2: Experimentación
- Semana 1-2: Prueba usar fortalezas en nuevos contextos
- Semana 3-4: Evalúa resultados, ajusta enfoque

### Mes 3: Integración
- Semana 1-2: Establece rutinas que potencien fortalezas
- Semana 3-4: Mide impacto, celebra progreso

## Métricas de Éxito

- % del tiempo usando fortalezas
- Nivel de energía y engagement
- Resultados objetivos en tu rol
- Feedback de colegas y líderes

## Tu Compromiso

Completa las siguientes frases:
1. Mi fortaleza más distintiva es __________
2. La usaré más en __________
3. Pediré feedback sobre __________
4. En 90 días, habré logrado __________`,
		estimatedMinutes: 30,
		xpReward: 350,
		level: "intermediate",
		order: 19,
	},
	{
		key: "collaborative-excellence",
		titleEs: "Excelencia Colaborativa",
		descriptionEs:
			"Desarrolla habilidades para colaborar efectivamente aprovechando las fortalezas de todos.",
		content: `# Excelencia Colaborativa

## El Poder de la Colaboración Basada en Fortalezas

> "Solo vamos rápido. Juntos llegamos lejos."

La colaboración efectiva no es solo trabajar juntos; es potenciarse mutuamente.

## Principios de Colaboración Basada en Fortalezas

### 1. Transparencia de Fortalezas
- Conoce las fortalezas de tus colaboradores
- Comunica las tuyas abiertamente
- Habla sobre cómo pueden complementarse

### 2. Asignación Intencional
- Tareas asignadas según fortalezas, no solo disponibilidad
- Roles que permiten brillar a cada persona
- Flexibilidad para ajustar según el contexto

### 3. Apreciación Activa
- Reconoce las contribuciones únicas de cada uno
- Celebra cómo las fortalezas se complementan
- Normaliza pedir ayuda en áreas no fuertes

## El Framework de Colaboración

### Antes del Proyecto
1. Mapea fortalezas del equipo
2. Define roles según fortalezas
3. Identifica posibles fricciones

### Durante el Proyecto
1. Check-ins sobre dinámica de fortalezas
2. Ajusta roles según emerge información
3. Facilita conversaciones cuando hay fricción

### Después del Proyecto
1. ¿Dónde brillaron las fortalezas?
2. ¿Dónde hubo puntos ciegos?
3. ¿Qué haríamos diferente?

## Desafíos Colaborativos

### Diseño de Desafíos en Pareja
Los desafíos colaborativos funcionan cuando:
- Cada persona aporta algo único
- El resultado requiere ambas contribuciones
- Hay interdependencia genuina

### Ejemplo: Empatizador + Estratega
- El empatizador entrevista stakeholders
- El estratega estructura los hallazgos
- Juntos crean una propuesta que es humana y viable

## Práctica: Un Proyecto Colaborativo

1. Elige un compañero con fortalezas diferentes
2. Define un pequeño proyecto (1-2 semanas)
3. Diseña roles basados en fortalezas
4. Ejecuta y reflexiona sobre la dinámica
5. Documenta aprendizajes

## Tu Red de Fortalezas

Crea tu mapa de colaboradores:
- ¿Quién complementa tu Pensar?
- ¿Quién complementa tu Motivar?
- ¿Quién complementa tu Sentir?
- ¿Quién complementa tu Hacer?`,
		estimatedMinutes: 25,
		xpReward: 350,
		level: "advanced",
		order: 20,
	},
	// ============================================================================
	// ADDITIONAL STRENGTH-SPECIFIC MODULES (12 missing strengths)
	// ============================================================================
	{
		key: "problem-solver-mastery",
		titleEs: "El Arte de Resolver Problemas",
		descriptionEs:
			"Desarrolla tu capacidad innata para encontrar soluciones creativas a desafíos complejos.",
		content: `# El Arte de Resolver Problemas

## La Fortaleza del Solucionador

Los **Solucionadores de Problemas** ven los desafíos como oportunidades disfrazadas. Donde otros ven obstáculos, tú ves puzzles esperando ser resueltos.

## El Framework de Resolución

### 1. Definir el Problema Real
- ¿Cuál es el problema detrás del problema?
- ¿Quién se beneficia de la solución?
- ¿Qué restricciones existen?

### 2. Generar Alternativas
- Brainstorming sin censura
- Invertir el problema: "¿Cómo lo empeoraría?"
- Buscar soluciones en otros dominios

### 3. Evaluar y Seleccionar
- Matriz de impacto vs esfuerzo
- Prototipar antes de implementar
- Aceptar que la primera solución rara vez es la mejor

### 4. Implementar y Aprender
- Medir resultados
- Documentar aprendizajes
- Iterar sin miedo

## Trampas Comunes

⚠️ **Solucionitis**: Resolver problemas que nadie tiene
⚠️ **Perfeccionismo**: Buscar la solución perfecta que nunca llega
⚠️ **Aislamiento**: Resolver solo cuando otros pueden ayudar

## Práctica Semanal

Elige un problema pequeño esta semana. Aplica el framework completo y documenta el proceso.`,
		estimatedMinutes: 20,
		xpReward: 200,
		level: "intermediate",
		strengthKey: "problem-solver",
		order: 21,
	},
	{
		key: "time-keeper-mastery",
		titleEs: "Maestría en Gestión del Tiempo",
		descriptionEs:
			"Potencia tu habilidad natural para organizar, priorizar y maximizar cada minuto.",
		content: `# Maestría en Gestión del Tiempo

## La Fortaleza del Guardián del Tiempo

Los **Guardianes del Tiempo** entienden que el tiempo es el recurso más democrático pero menos renovable. Tu don es convertir cada momento en productividad con propósito.

## Principios del Guardián

### La Regla del 80/20
- El 20% de tus actividades genera el 80% del valor
- Identifica tus actividades de alto impacto
- Protege tiempo para lo que realmente importa

### Bloques de Tiempo
- Trabajo profundo: bloques de 90-120 minutos
- Tareas administrativas: bloques de 30 minutos
- Buffer: 20% del día para imprevistos

### Energía, No Solo Tiempo
- Alinea tareas difíciles con tu pico de energía
- Respeta tus ritmos naturales
- Descanso es parte de la productividad

## El Sistema del Guardián

1. **Revisión semanal**: Qué logré, qué aprendí, qué haré
2. **Planificación diaria**: 3 prioridades máximo
3. **Revisión nocturna**: Celebrar logros, ajustar mañana

## Señales de Alerta

⚠️ Sentirte ansioso por "perder tiempo"
⚠️ Optimizar tanto que pierdes espontaneidad
⚠️ Juzgar a otros por su gestión del tiempo

## Práctica

Esta semana, registra cómo usas tu tiempo durante 3 días. Identifica ladrones de tiempo y actividades de alto valor.`,
		estimatedMinutes: 20,
		xpReward: 200,
		level: "intermediate",
		strengthKey: "time-keeper",
		order: 22,
	},
	{
		key: "analyst-mastery",
		titleEs: "El Poder del Análisis Profundo",
		descriptionEs:
			"Desarrolla tu capacidad para transformar datos en insights y decisiones informadas.",
		content: `# El Poder del Análisis Profundo

## La Fortaleza del Analista

Los **Analistas** no se conforman con respuestas superficiales. Buscan los "porqués" detrás de los "qués" y convierten datos en sabiduría accionable.

## El Método Analítico

### 1. Recolección de Datos
- Distinguir datos de ruido
- Múltiples fuentes para validar
- Cuestionar la calidad de los datos

### 2. Análisis Sistemático
- Buscar patrones y anomalías
- Correlación no es causalidad
- Considerar variables ocultas

### 3. Síntesis y Comunicación
- Traducir complejidad a claridad
- Visualizaciones que cuentan historias
- Recomendaciones accionables

## Herramientas Mentales

- **Pensamiento de primeros principios**: Desarmar hasta los elementos básicos
- **Abogado del diablo**: Buscar activamente evidencia contraria
- **Escenarios**: ¿Qué pasa si...?

## Señales de Alerta

⚠️ Parálisis por análisis: Esperar datos perfectos que nunca llegan
⚠️ Frialdad: Ignorar el factor humano en las decisiones
⚠️ Superioridad: Menospreciar intuición y experiencia

## Práctica

Toma una decisión reciente importante. ¿Qué datos usaste? ¿Qué datos faltaron? ¿Qué harías diferente?`,
		estimatedMinutes: 20,
		xpReward: 200,
		level: "intermediate",
		strengthKey: "analyst",
		order: 23,
	},
	{
		key: "believer-mastery",
		titleEs: "Viviendo con Propósito: La Fortaleza del Creyente",
		descriptionEs:
			"Aprende a conectar tu trabajo con valores profundos y encontrar significado en cada acción.",
		content: `# Viviendo con Propósito

## La Fortaleza del Creyente

Los **Creyentes** tienen un ancla interna de valores que guía cada decisión. No trabajan solo por resultados; trabajan por significado.

## Los Pilares del Propósito

### Clarificar Valores
- ¿Qué defenderías aunque tuviera un costo?
- ¿Qué te hace sentir auténtico?
- ¿Cuándo te sientes más alineado?

### Alinear Acciones
- Cada tarea puede conectar con un valor mayor
- El "cómo" importa tanto como el "qué"
- Pequeñas elecciones construyen integridad

### Inspirar a Otros
- Tu claridad de propósito es contagiosa
- Comparte el "porqué" detrás de tus acciones
- Respeta que otros tengan diferentes valores

## El Reto del Creyente

En un mundo pragmático, mantener valores puede sentirse ingenuo. Pero tu fortaleza no es rigidez; es una brújula que otros no tienen.

## Señales de Alerta

⚠️ Juzgar a quienes no comparten tus valores
⚠️ Conflicto entre valores personales y organizacionales
⚠️ Sentirte solo en tu postura

## Práctica

Identifica tres valores fundamentales. Esta semana, registra momentos donde los viviste y momentos donde fue difícil hacerlo.`,
		estimatedMinutes: 20,
		xpReward: 200,
		level: "intermediate",
		strengthKey: "believer",
		order: 24,
	},
	{
		key: "chameleon-mastery",
		titleEs: "La Flexibilidad del Camaleón",
		descriptionEs:
			"Desarrolla tu capacidad de adaptarte a cualquier contexto sin perder tu esencia.",
		content: `# La Flexibilidad del Camaleón

## La Fortaleza del Camaleón

Los **Camaleones** leen contextos con precisión y ajustan su estilo naturalmente. No es ser falso; es ser versátil.

## El Arte de la Adaptación

### Leer el Contexto
- ¿Cuál es la cultura de este grupo?
- ¿Qué se valora aquí?
- ¿Qué estilo de comunicación funciona?

### Ajustar sin Perder Esencia
- Tu estilo cambia, tus valores no
- Adaptación no es sumisión
- Mantén tu voz mientras ajustas el tono

### Crear Puentes
- Traducir entre culturas y estilos
- Facilitar conexiones improbables
- Ser el pegamento en equipos diversos

## El Superpoder del Camaleón

Puedes prosperar donde otros luchan por encajar. Eres el facilitador natural en ambientes multiculturales o cross-funcionales.

## Señales de Alerta

⚠️ ¿Quién eres realmente? Perder tu centro
⚠️ Agotamiento por cambio constante de máscaras
⚠️ Otros perciben falta de autenticidad

## Práctica

Identifica tres contextos diferentes en tu vida (trabajo, familia, amigos). ¿Qué ajustas en cada uno? ¿Qué permanece constante?`,
		estimatedMinutes: 20,
		xpReward: 200,
		level: "intermediate",
		strengthKey: "chameleon",
		order: 25,
	},
	{
		key: "optimist-mastery",
		titleEs: "El Poder del Optimismo Estratégico",
		descriptionEs:
			"Aprende a usar tu visión positiva como motor de cambio y resiliencia.",
		content: `# El Poder del Optimismo Estratégico

## La Fortaleza del Optimista

Los **Optimistas** no ignoran la realidad; eligen enfocarse en posibilidades. Tu energía positiva es contagiosa y mueve equipos hacia adelante.

## Optimismo Inteligente

### No es Negar Problemas
- Reconocer desafíos con honestidad
- Creer que hay soluciones por encontrar
- Enfocarse en lo controlable

### Es Energía de Acción
- Cada obstáculo tiene una lección
- El fracaso es información, no final
- El futuro es moldeable

### Es Contagioso
- Tu actitud eleva a otros
- En crisis, eres el ancla emocional
- Tu visión inspira movimiento

## El Equilibrio del Optimista

Optimismo sin acción es fantasía. Optimismo con estrategia es poder.

## Señales de Alerta

⚠️ Minimizar problemas reales ("No es para tanto")
⚠️ Frustración con "pesimistas" (que pueden ser realistas)
⚠️ Evitar conversaciones difíciles con positividad

## Práctica

Elige un desafío actual. Escribe tres cosas negativas sobre él (siendo honesto). Luego escribe tres oportunidades escondidas. Comparte con alguien.`,
		estimatedMinutes: 20,
		xpReward: 200,
		level: "intermediate",
		strengthKey: "optimist",
		order: 26,
	},
	{
		key: "self-believer-mastery",
		titleEs: "Confianza Auténtica: La Fortaleza del Auto-Creyente",
		descriptionEs:
			"Desarrolla una confianza interna sólida que te permita enfrentar cualquier desafío.",
		content: `# Confianza Auténtica

## La Fortaleza del Auto-Creyente

Los **Auto-Creyentes** tienen una convicción interna que no depende de validación externa. Saben que pueden manejar lo que venga.

## Los Pilares de la Auto-Confianza

### Conócete Profundamente
- Tus fortalezas reales, no las que deseas tener
- Tus límites honestos
- Tu track record de superar adversidades

### Acepta la Imperfección
- Confianza no es perfección
- Puedes creer en ti y tener dudas
- El crecimiento requiere incomodidad

### Actúa Desde la Confianza
- No esperes a "sentirte listo"
- La confianza se construye actuando
- Celebra pequeñas victorias

## La Trampa del Auto-Creyente

Confianza sin humildad es arrogancia. La verdadera fortaleza es saber cuándo pedir ayuda.

## Señales de Alerta

⚠️ No escuchar feedback porque "ya lo sabes"
⚠️ Aislamiento: No necesitar a nadie
⚠️ Dificultad para admitir errores

## Práctica

Escribe tres logros recientes que demuestran tu capacidad. Luego escribe una situación donde pediste ayuda y funcionó. Ambas son fortalezas.`,
		estimatedMinutes: 20,
		xpReward: 200,
		level: "intermediate",
		strengthKey: "self-believer",
		order: 27,
	},
	{
		key: "storyteller-mastery",
		titleEs: "El Arte de Contar Historias",
		descriptionEs:
			"Potencia tu habilidad natural para conectar ideas y personas a través de narrativas.",
		content: `# El Arte de Contar Historias

## La Fortaleza del Narrador

Los **Narradores** transforman información en experiencias memorables. Tu don es hacer que las ideas cobren vida.

## La Estructura del Poder Narrativo

### El Héroe y el Desafío
- Toda historia necesita un protagonista
- El conflicto genera engagement
- La transformación es el corazón

### El Detalle Sensorial
- Mostrar, no decir
- Emociones concretas, no abstractas
- Detalles específicos > generalidades

### El Mensaje Universal
- ¿Qué verdad humana resuena?
- ¿Por qué debería importar?
- ¿Qué acción inspira?

## Aplicaciones Profesionales

- Presentaciones que no se olvidan
- Liderazgo a través de narrativa
- Ventas basadas en transformación, no features

## Señales de Alerta

⚠️ Adornar tanto que se pierde la verdad
⚠️ Ser el centro de cada historia
⚠️ Historias sin propósito claro

## Práctica

Elige un proyecto reciente. Cuéntalo como historia: ¿Quién era el héroe? ¿Cuál fue el desafío? ¿Qué se transformó?`,
		estimatedMinutes: 20,
		xpReward: 200,
		level: "intermediate",
		strengthKey: "storyteller",
		order: 28,
	},
	{
		key: "winner-mastery",
		titleEs: "La Mentalidad del Ganador",
		descriptionEs:
			"Canaliza tu competitividad natural hacia logros significativos y crecimiento constante.",
		content: `# La Mentalidad del Ganador

## La Fortaleza del Ganador

Los **Ganadores** tienen un drive interno para superar límites, propios y externos. La competencia te energiza.

## Competir Inteligentemente

### Contra Ti Mismo
- El verdadero rival es tu versión de ayer
- Métricas personales de crecimiento
- Récords propios por romper

### Con Propósito
- Ganar para crear valor, no solo para ganar
- Victorias que inspiran a otros
- Competencia que eleva el estándar

### Con Gracia
- Ganar sin menospreciar
- Perder sin excusas
- Aprender de ambos resultados

## El Lado Oscuro del Ganador

Sin consciencia, la competitividad puede dañar relaciones y bienestar.

## Señales de Alerta

⚠️ No disfrutar victorias porque ya piensas en la siguiente
⚠️ Dificultad en contextos no competitivos
⚠️ Relaciones dañadas por tu drive

## Práctica

Identifica una "competencia" importante para ti. ¿Qué ganarías al ganar? ¿Qué perderías si conviertes todo en competencia?`,
		estimatedMinutes: 20,
		xpReward: 200,
		level: "intermediate",
		strengthKey: "winner",
		order: 29,
	},
	{
		key: "philomath-mastery",
		titleEs: "El Amor por el Aprendizaje",
		descriptionEs:
			"Desarrolla tu pasión por el conocimiento en una ventaja competitiva sostenible.",
		content: `# El Amor por el Aprendizaje

## La Fortaleza del Philomath

Los **Philomaths** tienen una curiosidad insaciable. El proceso de aprender es tan satisfactorio como el resultado.

## Aprender Estratégicamente

### Curiosidad Dirigida
- ¿Qué conocimiento tiene más impacto ahora?
- Balance entre profundidad y amplitud
- Aprender para aplicar, no solo acumular

### Múltiples Modalidades
- Leer, escuchar, hacer, enseñar
- Cada formato refuerza de forma diferente
- Experimentar es la mejor forma de aprender

### Compartir el Conocimiento
- Enseñar consolida el aprendizaje
- Ser recurso para tu equipo
- Documentar para otros (y tu yo futuro)

## El Reto del Philomath

El peligro es convertirse en eterno estudiante que nunca aplica.

## Señales de Alerta

⚠️ Acumular cursos sin terminar
⚠️ Síndrome del impostor perpetuo ("aún no sé suficiente")
⚠️ Menospreciar conocimiento "práctico" vs "teórico"

## Práctica

Elige algo que hayas aprendido recientemente. ¿Cómo lo has aplicado? Si no lo has hecho, ¿cuándo lo harás?`,
		estimatedMinutes: 20,
		xpReward: 200,
		level: "intermediate",
		strengthKey: "philomath",
		order: 30,
	},
	{
		key: "thinker-mastery",
		titleEs: "El Poder del Pensamiento Profundo",
		descriptionEs:
			"Convierte tu capacidad reflexiva en insights que otros no pueden ver.",
		content: `# El Poder del Pensamiento Profundo

## La Fortaleza del Pensador

Los **Pensadores** procesan el mundo internamente antes de actuar. Tu profundidad de análisis produce insights únicos.

## Pensar con Propósito

### Tiempo para Reflexión
- Proteger espacio para pensar
- No todo pensamiento es procrastinación
- La claridad emerge del silencio

### Estructurar el Pensamiento
- Journaling para externalizar ideas
- Mapas mentales para conectar conceptos
- Preguntas que guían la reflexión

### De Pensamiento a Acción
- Deadline para decidir
- Compartir ideas antes de que estén "perfectas"
- El mundo necesita tus conclusiones

## El Reto del Pensador

Vivir en la cabeza puede desconectarte del mundo exterior.

## Señales de Alerta

⚠️ Over-thinking: Dar vueltas sin concluir
⚠️ Parecer distante o desinteresado
⚠️ Frustración en ambientes de acción rápida

## Práctica

Elige un problema que llevas tiempo pensando. Escribe tus conclusiones actuales y compártelas con alguien. Observa qué pasa.`,
		estimatedMinutes: 20,
		xpReward: 200,
		level: "intermediate",
		strengthKey: "thinker",
		order: 31,
	},
	{
		key: "peace-keeper-mastery",
		titleEs: "El Arte de Mantener la Paz",
		descriptionEs:
			"Desarrolla tu habilidad natural para crear armonía y resolver conflictos constructivamente.",
		content: `# El Arte de Mantener la Paz

## La Fortaleza del Pacificador

Los **Pacificadores** ven los hilos que conectan a las personas y trabajan para mantenerlos fuertes. Donde otros ven conflicto, tú ves oportunidad de entendimiento.

## Crear Armonía Auténtica

### Escuchar Todas las Voces
- Entender antes de mediar
- Buscar la necesidad detrás de la posición
- Cada perspectiva tiene valor

### Facilitar Diálogo
- Crear espacios seguros para hablar
- Traducir entre diferentes estilos
- Buscar terreno común

### Resolver Sin Evitar
- Paz no es ausencia de conflicto
- Abordar tensiones antes de que escalen
- Soluciones que honran a todas las partes

## El Reto del Pacificador

Mantener la paz a costa de tus propias necesidades no es sostenible.

## Señales de Alerta

⚠️ Sacrificar tu posición por "no crear problemas"
⚠️ Absorber el estrés de otros
⚠️ Evitar conflictos necesarios

## Práctica

Identifica un conflicto menor en tu entorno. ¿Qué necesita cada parte? ¿Hay un "tercer camino" que no se ha explorado?`,
		estimatedMinutes: 20,
		xpReward: 200,
		level: "intermediate",
		strengthKey: "peace-keeper",
		order: 32,
	},
];
