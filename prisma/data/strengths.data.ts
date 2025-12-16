
export interface StrengthDetails {
    fullDefinition: string
    howToUseMoreEffectively?: string[]
    watchOuts?: string[]
    strengthsDynamics?: string
    bestPartners?: string[]
    careerApplications?: string[]
}

export interface StrengthProfile {
    strength: string
    nameEs: string
    domain: string
    briefDefinition: string
    details: StrengthDetails
}

export const strengthsData: StrengthProfile[] = [
    {
        strength: "Deliverer",
        nameEs: "Cumplidor",
        domain: "Doing",
        briefDefinition:
            "Cumplen con sus compromisos y disfrutan viendo cómo esto genera más confianza y respeto entre los demás. Se sienten fatal si las promesas se rompen, tanto al recibirlas como al darlas.",
        details: {
            fullDefinition: `El **Cumplidor** es una fortaleza que va mucho más allá de simplemente hacer lo que se dice. Representa la esencia misma de la **fiabilidad inquebrantable y la integridad en acción**.

## La Naturaleza del Cumplidor

Para un Cumplidor, su palabra no es solo una declaración; es un **contrato personal de honor**. Sienten una profunda y visceral responsabilidad por cada compromiso que asumen, ya sea grande o pequeño. Esta fortaleza no se trata solo de la acción de completar una tarea, sino de la **integridad** que se construye a través de una reputación de confianza. Ven cada promesa cumplida como un ladrillo que edifica su carácter y su relación con los demás.

## Motivación Central

Su motivación principal es mantener esa integridad. La idea de fallar en un compromiso, ya sea propio o ajeno, les genera una profunda incomodidad y frustración. Por eso, actúan como el **ancla de un equipo**, la persona en la que todos pueden confiar para que las cosas se hagan, y los plazos se respeten. Son el motor que transforma ideas en realidad tangible y resultados concretos.

## Impacto Organizacional

En su máxima expresión, un Cumplidor no solo cumple sus promesas, sino que también **inspira a otros a hacer lo mismo**. Son modelos a seguir en cuanto a responsabilidad, elevando el estándar de compromiso y ética en su entorno. Su presencia en un proyecto proporciona certeza y tranquilidad a todos los involucrados.`,

            howToUseMoreEffectively: [
                "**Liderazgo de Proyectos Críticos**: Usa tu fiabilidad para liderar iniciativas donde los plazos y la entrega son no-negociables. Tu reputación te posiciona para responsabilidades de alto impacto.",
                "**Comunicación Proactiva**: Comunica claramente tu capacidad y tus límites desde el inicio. Los demás valorarán tu honestidad sobre una promesa que no puedas cumplir.",
                "**Modelado de Responsabilidad**: Sé un referente en cuanto a compromiso, inspirando a otros a cumplir sus propias promesas y elevando el estándar del equipo completo.",
                "**Documentación de Compromisos**: Registra públicamente tus compromisos para mantener la accountability clara y demostrar un seguimiento consistente.",
                "**Comunicación Proactiva de Riesgos**: Cuando identifiques que un compromiso está en riesgo, informa inmediatamente con soluciones propuestas, no solo problemas.",
            ],

            watchOuts: [
                "**Sobrecarga de Compromisos**: Tu deseo de cumplir puede llevarte a asumir más de lo que realísticamente puedes entregar. Aprende a decir 'no' de manera estratégica y protege tu capacidad.",
                "**Responsabilidad Ajena**: No asumas la carga de otros que no cumplen sus propios compromisos. Aprende a delegar y exigir rendición de cuentas sin rescatar la responsabilidad de otros.",
                "**Perfeccionismo Paralizante**: Tu búsqueda de perfección podría retrasar entregas innecesariamente. Busca el equilibrio entre excelencia y eficiencia.",
                "**Frustración con la Inconsistencia**: La falta de compromiso ajeno puede drenarte emocionalmente. Desarrolla resiliencia ante las acciones de otros y evita sobre-identificarte con sus fallos.",
                "**Rigidez ante Cambios Necesarios**: No permitas que tu compromiso inicial te ciegue a cambios contextuales que justifiquen renegociar. La flexibilidad inteligente también es responsabilidad.",
            ],

            strengthsDynamics: `**Cumplidor + Catalizador**: El Catalizador genera el impulso y la energía para iniciar; el Cumplidor asegura que esa energía se traduzca en resultados sostenibles y completados. Una combinación formidable de impulso + ejecución.

**Cumplidor + Estratega**: El Estratega define el rumbo y la visión clara; el Cumplidor asegura que cada fase se ejecute con precisión alineada a esa visión. Crean una dupla de visión + materialización.

**Cumplidor + Generador de Ideas**: El Generador de Ideas concibe posibilidades creativas; el Cumplidor las materializa en productos y servicios reales. Transforman la creatividad en realidad tangible.

**Cumplidor + Comandante**: El Comandante establece la dirección con decisión; el Cumplidor ejecuta con responsabilidad inquebrantable. Ambos valoran la acción y la responsabilidad directa.

**Cumplidor + Experto en Enfoque**: Ambos comparten el deseo de llevar proyectos al término. El Experto en Enfoque mantiene la dirección; el Cumplidor asegura la llegada. Crean persistencia en la finalización.`,

            bestPartners: [
                "**Estratega (Strategist)** - Define visión clara mientras aseguras ejecución fiel alineada a esa estrategia",
                "**Catalizador (Catalyst)** - Inicia movimiento y momentum; tú sostienes y completas lo comenzado",
                "**Generador de Ideas (Brainstormer)** - Explora posibilidades creativas; tú las conviertes en realidades ejecutadas",
                "**Comandante (Commander)** - Valora acción directa y responsabilidad; encarnas exactamente esa ética",
                "**Experto en Enfoque (Focus Expert)** - Ambos finalizan proyectos; complementan en seguimiento y entrega final",
            ],

            careerApplications: [
                "**Gestión de Proyectos y PMO** - Ideal para PMOs, líderes de proyecto y coordinadores donde la entrega es crítica",
                "**Cumplimiento y Auditoría** - Roles donde la fiabilidad y el seguimiento de estándares son absolutamente no-negociables",
                "**Operaciones y Logística** - Cadenas de suministro, coordinación logística y gestión de procesos requieren tu exactitud",
                "**Administración y Control de Calidad** - Posiciones donde se debe mantener consistencia y cumplimiento de especificaciones",
                "**Gestión de Cuentas y Relaciones** - Los clientes valoran exponencialmente la confiabilidad; tu fortaleza construye lealtad duraderas",
                "**Roles Ejecutivos de Operación** - COO, Chief Operating Officer, roles donde la operación debe funcionar como reloj",
                "**Industrias Críticas** - Medicina, Seguridad, Aviación donde los compromisos significan vidas; tu fortaleza es esencial",
            ],
        },
    },
    {
        strength: "Focus Expert",
        nameEs: "Experto en Enfoque",
        domain: "Doing",
        briefDefinition:
            "Disfrutan llevar un proyecto directamente hacia la meta final sin cambiar de dirección regularmente. Se enfocan en una cosa a la vez y detestan las distracciones.",
        details: {
            fullDefinition: `El **Experto en Enfoque** es mucho más que la simple concentración. Es la **habilidad maestra de la intención y la dirección sostenida**.

## La Naturaleza del Experto en Enfoque

Para un Experto en Enfoque, la meta no es solo un punto final lejano; es el **centro de su universo personal**. Su mente es como un **rayo láser altamente concentrado**, capaz de cortar a través del ruido, la información contradictoria y las distracciones para iluminar el camino más directo hacia un objetivo. Poseen un **radar interno refinado** que detecta y elimina todo lo que no sea esencial para avanzar. No se sienten abrumados por múltiples opciones o cambios de dirección porque saben instintivamente cómo priorizar y canalizar su energía sin dispersarse.

## El Rol en el Equipo

Esta fortaleza se manifiesta en su capacidad para actuar como el **faro de orientación del equipo**, recordándole a todos el propósito central cuando la atención se dispersa. Su valor principal es su capacidad para **traducir la visión en acción sostenida y sin desviaciones**, asegurando que el impulso inicial se mantenga intacto hasta que se logre el resultado final. Se sienten en su elemento cuando tienen un objetivo claro, tangible y medible, lo que les permite desatar todo su potencial sin restricciones.

## Impacto en Resultados

Son la **fuerza motriz que convierte los planes en realidades tangibles**, los sueños abstractos en proyectos completados y las ideas conceptuales en logros concretos medibles. Donde otros ven complejidad y bifurcaciones, el Experto en Enfoque ve un camino claro y directo. Esto los hace invaluables en contextos donde la disciplina mental y la ejecución persistente determinan el éxito.`,

            howToUseMoreEffectively: [
                "**Establece OKRs Claros**: Define objetivos clave y resultados esperados explícitamente. Tu capacidad de enfocar se maximiza cuando tienes un destino bien definido que proteger.",
                "**Diseña Sistemas Anti-Distracción**: Utiliza herramientas visuales (Kanban boards, roadmaps, dashboards) que mantengan las prioridades visibles y eliminen tareas no esenciales del flujo.",
                "**Lidera Sesiones de Priorización**: En reuniones, redirige amablemente las conversaciones hacia el objetivo principal cuando la discusión se desvíe. Tu capacidad de detectar distracciones es un superpoder.",
                "**Mentorea en Enfoque**: Enseña a otros cómo descomponer objetivos grandes en metas intermedias alcanzables. Tu claridad mental es un asset que puedes transferir.",
                "**Crea Rituales de Revisión**: Establece momentos regulares para validar que el equipo sigue enfocado en lo importante y ajustar si es necesario.",
            ],

            watchOuts: [
                "**Visión de Túnel Excesiva**: Tu enfoque intenso puede hacerte perder información periférica valiosa u oportunidades emergentes. Construye espacios deliberados para explorar lo inesperado.",
                "**Impaciencia con Exploración**: Ten paciencia con colegas que necesitan explorar varias ideas antes de comprometerse con una. El proceso divergente precede al enfoque convergente.",
                "**Rigidez ante Cambios Contextuales**: Aunque amas la dirección clara, el mundo cambia. Practica la flexibilidad inteligente cuando el contexto justifique pivotar hacia un nuevo objetivo.",
                "**Intolerancia con Multitarea Necesaria**: Algunos roles requieren contexto-switching. Desarrolla tolerancia hacia equipos o personas que deben manejar múltiples prioridades simultáneamente.",
                "**Frustración con Procesos Iterativos**: Los proyectos ágiles tienen ciclos cortos de enfoque. Evita la frustración si el objetivo se refina iterativamente en lugar de estar perfectamente definido al inicio.",
            ],

            strengthsDynamics: `**Experto en Enfoque + Catalizador**: El Catalizador aporta la energía inicial y el momentum; el Experto en Enfoque canaliza esa energía hacia una dirección específica. Impulso + dirección = avance imparable.

**Experto en Enfoque + Generador de Ideas**: El Generador de Ideas explora posibilidades múltiples; el Experto en Enfoque selecciona la más viable y la lleva a término. Creatividad filtrada y ejecutada.

**Experto en Enfoque + Estratega**: El Estratega diseña el rumbo a largo plazo; el Experto en Enfoque lo desglosa en objetivos concretos y mantiene el movimiento hacia ellos. Visión + ejecución enfocada.

**Experto en Enfoque + Cumplidor**: Ambos comparten la capacidad de llevar proyectos al cierre. El Cumplidor asegura integridad; el Experto en Enfoque asegura dirección. Responsabilidad + enfoque = finalización confiable.

**Experto en Enfoque + Pacificador**: El Pacificador busca consenso; el Experto en Enfoque busca claridad de dirección. Juntos aseguran que la armonía no desvíe del objetivo crítico.`,

            bestPartners: [
                "**Catalizador (Catalyst)** - Aporta impulso y energía inicial; tú canalizas hacia un objetivo específico con precisión",
                "**Generador de Ideas (Brainstormer)** - Explora posibilidades creativas; tú filtras las mejores y las ejecutas hasta el final",
                "**Estratega (Strategist)** - Diseña el rumbo a largo plazo; tú lo desglosas en objetivos concretos y los ejecutas",
                "**Cumplidor (Deliverer)** - Ambos finalizan proyectos; él asegura integridad, tú aseguras dirección sin desviación",
                "**Comandante (Commander)** - Toma decisiones claras; tú las ejecutas con enfoque inquebrantable",
            ],

            careerApplications: [
                "**Desarrollo de Software / Agile** - Sprints, roadmaps y entregas iterativas requieren tu capacidad de mantener el enfoque en ciclos cortos",
                "**Control de Tráfico / Aviación** - Roles que exigen concentración extrema y atención sostenida a un objetivo de seguridad crítico",
                "**Medicina y Cirugía** - Especialidades médicas donde la concentración absoluta y ausencia de distracciones salvan vidas",
                "**Análisis Financiero e Inversiones** - Evaluación de datos complejos requiere enfoque sostenido en métricas clave",
                "**Project Management** - Liderazgo de proyectos complejos donde mantener el rumbo entre distracciones es clave",
                "**Manufacturing y Quality Control** - Procesos donde la consistencia y el enfoque en estándares determinan resultados",
                "**Redacción técnica y análisis de datos** - Trabajos que requieren concentración profunda y atención a detalles específicos",
            ],
        },
    },
    {
        strength: "Problem Solver",
        nameEs: "Solucionador de Problemas",
        domain: "Doing",
        briefDefinition:
            "Les encanta descubrir fallas, diagnosticar problemas y encontrar soluciones. Les resulta difícil barrer los problemas debajo de la alfombra y seguir adelante como si nada estuviera mal.",
        details: {
            fullDefinition: `El **Solucionador de Problemas** es mucho más que alguien que resuelve dificultades. Es un **detector nato de ineficiencia y un guardián de la calidad**.

## La Mentalidad del Investigador

Imagina a alguien que **ve cada obstáculo como una oportunidad de mejora y aprendizaje**. Esta es la esencia del Solucionador de Problemas: una mentalidad intrínseca de **investigación rigurosa y mejora continua** que trasciende la simple capacidad de resolver dificultades puntuales. Su cerebro está diseñado para identificar inconsistencias, fallos y áreas de fricción que otros podrían pasar por alto sin pensarlo dos veces.

## Atraídos por la Complejidad

No se sienten intimidados por la complejidad; de hecho, se sienten **atraídos magnéticamente hacia ella**. Para ellos, un problema no es un obstáculo deprimente, sino un **rompecabezas desafiante** que los cautiva hasta que logran resolverlo. Sienten una satisfacción profunda y visceral al desarmar una situación complicada para entender su **causa raíz verdadera**, y luego proponer una solución que no solo arregle el síntoma superficial, sino que prevenga futuras reincidencias.

## El Valor Crítico

Su valor principal es su **incapacidad absoluta para ignorar lo roto o lo disfuncional**. No pueden "barrer los problemas debajo de la alfombra" y pretender que todo está bien. Esta característica los convierte en **guardianes invaluables de la eficiencia y la calidad**. Su presencia en un equipo garantiza que los fallos no se ignoren cómodamente, sino que se enfrenten de frente con rigor investigativo. Siempre buscan formas de hacer las cosas mejor, más fluidas, más duraderas y más confiables.`,

            howToUseMoreEffectively: [
                "**Lidera Iniciativas de Mejora Continua**: Asume roles donde la mejora continua, resolución de incidentes y optimización de procesos sean centrales. Eres el ideal para kaizen, six-sigma o methodologías similares.",
                "**Desarrolla Marcos de Diagnóstico**: Crea y documenta tu metodología para diagnosticar problemas. Enseña a otros este proceso riguroso, creando una cultura de investigación proactiva en lugar de reactividad.",
                "**Cierra el Ciclo Completo**: No te detengas en identificar y diseñar la solución. Participa activamente en la implementación y verificación de que la solución realmente resuelve el problema raíz.",
                "**Comunica con Tono Constructivo**: Presenta tus hallazgos como oportunidades de mejora, no como crítica. Usa lenguaje de solución: 'Aquí está la oportunidad de optimizar...' en lugar de 'Esto está mal...'",
                "**Mentorea Equipos en Pensamiento Crítico**: Entrena a otros a hacer las preguntas correctas: ¿Cuál es la causa raíz? ¿Por qué ocurre esto? ¿Cómo lo prevenimos? Tu rigor es transferible.",
            ],

            watchOuts: [
                "**Sesgo hacia lo Negativo**: Tu enfoque en encontrar lo que no funciona puede hacerte perder de vista lo que sí funciona extraordinariamente bien. Practica reconocer y celebrar los éxitos también.",
                "**Búsqueda Obsesiva de Problemas**: No busques problemas donde no los hay. A veces, 'suficientemente bueno' es la respuesta correcta, especialmente cuando el costo de optimizar supera el beneficio.",
                "**Tono Crítico Percibido**: Tu honestidad radical puede ser percibida como crítica constante o negatividad. Desarrolla sensibilidad contextual para comunicar hallazgos sin desmoralizar.",
                "**Parálisis por Análisis**: Tu afán de encontrar la causa raíz perfecta puede ralentizar la acción. A veces, una solución imperfecta implementada ahora es mejor que una perfecta diseñada eternamente.",
                "**Frustración con la Mediocridad**: El mundo no siempre aspira a la excelencia. Aprende a vivir con sistemas sub-óptimos cuando cambiarlos no es prioritario u posible.",
            ],

            strengthsDynamics: `**Solucionador de Problemas + Optimista**: El Optimista aporta una perspectiva positiva y esperanzadora; el Solucionador de Problemas se encarga del trabajo duro de diagnóstico. Esperanza + realismo = mejora sostenible.

**Solucionador de Problemas + Cumplidor**: El Cumplidor implementa las soluciones de manera confiable y verificable; el Solucionador de Problemas asegura que la solución diseñada sea la correcta. Análisis + ejecución confiable = soluciones duraderas.

**Solucionador de Problemas + Analista**: El Analista busca claridad en datos; el Solucionador de Problemas usa esos datos para diagnosticar causas. Investigación datos-driven que encuentra raíces reales.

**Solucionador de Problemas + Estratega**: El Estratega ve el sistema completo; el Solucionador de Problemas identifica las fricciones en ese sistema. Visión sistémica + diagnóstico profundo.

**Solucionador de Problemas + Catalizador**: El Catalizador quiere mover cosas adelante; el Solucionador de Problemas asegura que se muevan en dirección correcta sin arrastrar problemas. Impulso + precisión.`,

            bestPartners: [
                "**Optimista (Optimist)** - Equilibra tu enfoque en problemas con una visión positiva de las soluciones",
                "**Cumplidor (Deliverer)** - Implementa tus soluciones diagnosticadas de manera confiable y verificable",
                "**Analista (Analyst)** - Proporciona datos rigurosos que validen la causa raíz verdadera del problema",
                "**Estratega (Strategist)** - Entiende sistemas complejos; tú diagnosticas las disfunciones específicas dentro",
                "**Catalizador (Catalyst)** - Quiere mover cosas; tú aseguras que se muevan correctamente sin arrastrar problemas",
            ],

            careerApplications: [
                "**Ingeniería y Control de Calidad (QA)** - Identificar defectos, diagnosticar causas raíz y implementar mejoras es tu zona de maestría",
                "**Soporte Técnico Nivel 2-3** - Resolución de incidentes complejos y escalados requieren tu mentalidad de investigación profunda",
                "**Consultoría de Gestión y Procesos** - Diagnosticar ineficiencias en organizaciones y proponer mejoras sistémicas",
                "**Medicina Diagnóstica y Epidemiología** - Identificar causas de enfermedades y problemas de salud pública requiere tu rigor investigativo",
                "**Auditoría y Compliance** - Detectar desviaciones, riesgos y problemas de cumplimiento en procesos",
                "**Mejora Continua y Lean** - Roles en kaizen, six-sigma, lean manufacturing donde la optimización es constante",
                "**Investigación Forense / Análisis de Accidentes** - Investigar qué salió mal y por qué, previniendo reincidencias",
            ],
        },
    },
    {
        strength: "Time Keeper",
        nameEs: "Guardián del Tiempo",
        domain: "Doing",
        briefDefinition:
            "No hay nada que les emocione más que cumplir un plazo. Disfrutan estableciendo procesos, cronogramas y planes. Pueden sentirse confundidos en circunstancias caóticas donde ni los resultados ni las formas de conseguirlos están claros.",
        details: {
            fullDefinition: `El **Guardián del Tiempo** es mucho más que alguien que llega puntualmente. Es un **arquitecto de la estructura y el orden temporal**.

## La Reverencia por el Tiempo

Cuando observas a alguien que **respeta profundamente cada minuto que pasa y cada hora que transcurre**, estás viendo la esencia del Guardián del Tiempo: una comprensión casi visceral de que **el tiempo es el recurso más valioso, finito y no renovable** que existe. Para ellos, el tiempo malgastado no es una inconvenencia, es una tragedia.

El Guardián del Tiempo posee un **reloj interno calibrado con precisión** que le permite planificar y estructurar su vida y la de su equipo entero en torno a la eficiencia máxima. No se trata solo de llegar a una reunión a tiempo, sino de **honrar y respetar cada minuto** que otros invierten con su presencia. Ven los plazos no como presiones externas deprimentes, sino como **guías esenciales clarificadoras** para lograr sus objetivos sin indefinición.

## Maestría en Desglose y Cronogramas

Se destacan de manera excepcional en la capacidad de desglosar proyectos complejos en tareas manejables con cronogramas realistas y viables. Aseguran que el impulso inicial se mantenga constante a lo largo del tiempo y que cada hito se cumpla según lo planeado. Ven el camino de la visión al resultado como algo que requiere **estructura temporal clara y explícita**.

## El Valor Organizacional

Su valor principal es su habilidad para **traducir la visión abstracta en un plan de acción viable y estructurado temporalmente**. Son los **arquitectos del cronograma**, los que garantizan que las grandes ideas no queden en papel sino que tengan una estructura temporal sólida que permita su ejecución. La impuntualidad, los plazos no respetados y la ineficiencia les causan una profunda ansiedad, ya que las perciben como pérdida de recursos irrecuperables y oportunidades perdidas. Su presencia en un equipo es fundamental para asegurar que los proyectos no solo avancen, sino que lo hagan de manera **constante, predecible y dentro de los plazos establecidos**, modelando un comportamiento de respeto universal por el tiempo.`,

            howToUseMoreEffectively: [
                "**Diseña Sistemas de Planificación Rigurosos**: Asume la responsabilidad de crear y comunicar cronogramas detallados, roadmaps visuales y hitos claros. Tu capacidad de estructurar el tiempo es un superpoder organizacional.",
                "**Desglose Estratégico de Proyectos**: Ayuda a tu equipo a descomponer iniciativas grandes y complejas en tareas más pequeñas, manejables y con plazos definidos explícitamente. Esto elimina la ambigüedad.",
                "**Mentorea en Gestión del Tiempo**: Enseña a otros cómo estimar realísticamente, construir buffers, y respetar plazos. Tu rigor temporal es transferible y mejora la capacidad del equipo completo.",
                "**Modela Puntualidad y Respeto**: Sé siempre puntual y respeta el tiempo de los demás en reuniones y compromisos. Tu consistencia establece el estándar cultural para toda la organización.",
                "**Coordina Dependencias y Recursos**: Tu visión temporal integral te posiciona idealmente para coordinar equipos múltiples, asegurar que dependencias no bloqueen, y optimizar flujos.",
            ],

            watchOuts: [
                "**Impaciencia con Ritmos Diferentes**: No todos tienen tu reloj interno. Algunos necesitan tiempo para reflexionar, explorar o procesar. Aprende a valorar diferentes ritmos de trabajo sin frustración.",
                "**Calidad vs. Velocidad**: Tu presión por cumplir plazos puede hacerte sacrificar calidad o profundidad creativa. Aprende a defender los plazos que incluyen tiempo para excelencia, no solo rapidez.",
                "**Rigidez ante Imprevistos**: Los cambios inesperados y contextos emergentes requieren flexibilidad. Aunque ames los planes, practica la adaptabilidad inteligente cuando surjan imprevistos legítimos.",
                "**Micro-management de Tiempo**: Tu precisión temporal puede llevarte a controlar obsesivamente el tiempo de otros. Cultiva confianza en que otros pueden autogestionar su tiempo.",
                "**Ansiedad en Ambigüedad**: Los proyectos innovadores o exploratorios no siempre tienen cronogramas claros. Aprende a tolerar la incertidumbre temporal en fases de descubrimiento.",
            ],

            strengthsDynamics: `**Guardián del Tiempo + Catalizador**: El Catalizador quiere empezar ahora; el Guardián del Tiempo asegura que esa energía tenga un cronograma viable. Impulso + estructura temporal = inicio efectivo.

**Guardián del Tiempo + Generador de Ideas**: El Generador de Ideas explora múltiples posibilidades; el Guardián del Tiempo estructura el tiempo para que esa exploración no se pierda en infinitud. Creatividad + temporalidad.

**Guardián del Tiempo + Experto en Enfoque**: Ambos valoran la dirección clara. El Experto en Enfoque define qué lograr; el Guardián del Tiempo asegura cuándo y cómo lograrlo. Objetivo + cronograma = ejecución.

**Guardián del Tiempo + Cumplidor**: El Cumplidor asegura que se complete; el Guardián del Tiempo asegura que se complete dentro del plazo. Integridad + puntualidad = confiabilidad total.

**Guardián del Tiempo + Estratega**: El Estratega diseña el rumbo; el Guardián del Tiempo lo disgrega en fases temporales realizables. Visión + cronograma = implementación estructurada.`,

            bestPartners: [
                "**Catalizador (Catalyst)** - Aporta energía para iniciar; tú estructuras esa energía en cronogramas viables",
                "**Cumplidor (Deliverer)** - Asegura calidad de entrega; tú aseguras que se entregue dentro del plazo",
                "**Experto en Enfoque (Focus Expert)** - Define la meta clara; tú creas la estructura temporal para alcanzarla",
                "**Estratega (Strategist)** - Diseña el rumbo; tú lo desglosas en fases temporales realizables",
                "**Camaleón (Chameleon)** - Prospera en cambio; tú aportas estructura incluso a ambientes dinámicos",
            ],

            careerApplications: [
                "**Gestión de Proyectos y Scrum Master** - Tu capacidad de crear cronogramas y gestionar dependencias es exactamente lo que estos roles necesitan",
                "**Planificación de Eventos (Corporativos, Bodas, Conferencias)** - Coordinar múltiples componentes en una línea de tiempo exacta es tu experticia natural",
                "**Gestión de Cadena de Suministro y Logística** - Cumplir plazos de entrega, optimizar flujos y coordinar multiples puntos requiere tu precisión temporal",
                "**Producción (Cine, TV, Manufactura)** - Cronogramas de rodaje, líneas de producción, entregas requieren estructura temporal rígida y disciplinada",
                "**Coordinación de Operaciones y COO** - Asegurar que múltiples departamentos funcionen en sincronía temporal es exactamente tu fuerza",
                "**Coordinación de Recursos y Scheduling** - Optimizar el uso de recursos, evitar sobreasignación, gestionar calendarios complejos",
                "**Project Management Office (PMO)** - Establecer estándares de planificación, seguimiento y reporte de cronogramas organizacionales",
            ],
        },
    },
    {
        strength: "Analyst",
        nameEs: "Analista",
        domain: "Thinking",
        briefDefinition:
            "Se energizan buscando simplicidad y claridad dentro de una gran cantidad de datos. Se frustran cuando se les pide que sigan su corazón en lugar de hechos probados y lógica.",
        details: {
            fullDefinition: `El **Analista** es mucho más que alguien que interpreta datos. Es un **guardián de la verdad objetiva y la claridad radical**.

## La Búsqueda Incansable de Certidumbre

En un mundo lleno de opiniones, suposiciones y narrativas contradictorias, el **Analista** emerge como la voz de la **verdad objetiva y la claridad verificable**, trascendiendo la simple interpretación de datos para convertirse en una búsqueda incansable de certidumbre fundamentada. Un Analista se siente en su verdadero elemento cuando se enfrenta a un **mar caótico de información sin estructura**. Su mente es una **máquina refinada de patrones y lógica** capaz de filtrar el ruido inútil y encontrar las relaciones de causa y efecto que otros no pueden ver o ignoran deliberadamente.

## La Fe en los Hechos

Para ellos, la claridad y la certidumbre se encuentran únicamente en los **hechos concretos, las cifras verificables y la evidencia tangible**. Se sienten profundamente frustrados e inquietos por decisiones basadas en la intuición, las emociones o el "sentimiento" de alguien, ya que valoran la **solidez inquebrantable de una conclusión bien fundamentada en datos**. Ven las decisiones emocionales como inestables y susceptibles a sesgos, mientras que los datos les proporcionan la base firme que necesitan.

## El Guardián de la Razón Organizacional

Su valor más significativo es su capacidad de ser la **voz clara, desapasionada y objetiva** en cualquier situación compleja. Son quienes aterrizan las ideas románticas en la realidad verificable, quienes validan las visiones estratégicas con datos concretos y análisis rigurosos, y quienes aseguran que el equipo no se desvíe por conjeturas, suposiciones no probadas o sesgos cognitivos. Su presencia es crucial para tomar decisiones inteligentes, estratégicas y, sobre todo, **informadas por la realidad** y no por el deseo.

## Impacto en la Organización

Son los **guardianes de la lógica organizacional**, garantizando que cada decisión importante se base en una comprensión clara, factual y verificable de la situación actual. Sin ellos, los equipos tienden a vivir en ficciones convenientes.`,

            howToUseMoreEffectively: [
                "**Traduce Complejidad en Claridad**: Convierte conjuntos de datos complejos en visualizaciones, dashboards y resúmenes ejecutivos que todos puedan entender rápidamente. Tu capacidad de simplificar es un superpoder.",
                "**Fundamenta Decisiones Estratégicas**: Participa activamente en decisiones críticas proporcionando análisis de escenarios, modelado de impacto y evidencia que valide o cuestione propuestas. Sé el validador de realidad.",
                "**Enseña Alfabetismo de Datos**: Educa a otros en cómo leer datos, interpretar gráficos y pensar estadísticamente. Tu rigor lógico es transferible y mejora la calidad de pensamiento del equipo.",
                "**Sé la Voz de la Objetividad**: Cuando las discusiones se vuelven demasiado subjetivas, emocionales o basadas en creencias, presenta datos que reorientan hacia la realidad verificable. Sé el ancla a la realidad.",
                "**Anticipa Riesgos con Datos**: Usa tu capacidad analítica para identificar patrones riesgosos, proyectar tendencias negativas y alertar al equipo de problemas antes de que se hagan visibles.",
            ],

            watchOuts: [
                "**Parálisis por Análisis**: Tu búsqueda de certeza perfecta puede ralentizar la acción. A veces, es necesario tomar una decisión con información incompleta. Aprende a identificar cuándo 'suficientemente bueno' es bueno.",
                "**Rechazo de Intuición Valiosa**: No descartes la importancia de la experiencia acumulada y la intuición humana, que no siempre son cuantificables pero a menudo son correctas. Complementa datos con sabiduría.",
                "**Insensibilidad en Comunicación**: Tu presentación de datos duros puede parecer fría o insensible cuando contradice creencias o deseos de otros. Desarrolla empatía en cómo comunicas verdades incómodas.",
                "**Sesgo hacia lo Medible**: No todo lo importante es cuantificable. Los aspectos cualitativos, culturales y humanos importan aunque sean difíciles de medir. No descuides lo intangible.",
                "**Escepticismo Excesivo**: Tu exigencia de prueba para todo puede hacerte rechazar ideas innovadoras que no caben en paradigmas existentes. Mantén apertura a lo que no encaja en los datos históricos.",
            ],

            strengthsDynamics: `**Analista + Catalizador**: El Catalizador quiere mover cosas; el Analista asegura que se muevan en dirección correcta basada en datos. Impulso informado + precisión = avance inteligente.

**Analista + Empatizador**: El Empatizador entiende el impacto humano; el Analista proporciona la base de datos. Corazón + razón = decisiones completas que consideran hechos y personas.

**Analista + Estratega**: El Estratega imagina futuros posibles; el Analista valida cuáles son alcanzables con datos. Visión + realidad verificable = estrategia fundamentada.

**Analista + Comandante**: El Comandante decide con confianza; el Analista proporciona la lógica y evidencia que justifica esa confianza. Decisión rápida + fundamento sólido = liderazgo seguro.

**Analista + Pensador**: El Pensador reflexiona profundamente; el Analista lo ancla en datos. Reflexión rigurosa + evidencia = sabiduría basada en hechos.`,

            bestPartners: [
                "**Catalizador (Catalyst)** - Quiere mover cosas; tú aseguras que se muevan correctamente basado en datos",
                "**Empatizador (Empathizer)** - Equilibra tu lógica con comprensión del impacto humano y contexto emocional",
                "**Estratega (Strategist)** - Diseña visiones; tú las validas con datos y proyecciones realistas",
                "**Comandante (Commander)** - Necesita confianza para decidir; tú proporcionas la evidencia que justifica la acción",
                "**Pensador (Thinker)** - Reflexiona profundamente; tú anclas esa reflexión en datos y hechos verificables",
            ],

            careerApplications: [
                "**Análisis de Datos y Business Intelligence** - Transformar datos crudos en insights accionables es exactamente tu zona de genialidad",
                "**Investigación Científica y de Mercado** - Diseñar estudios rigurosos, analizar resultados y extraer conclusiones validadas",
                "**Finanzas, Contabilidad y Auditoría** - Números precisos, análisis de riesgos financieros y cumplimiento requieren tu rigor",
                "**Investigación de Operaciones y Optimización** - Modelar sistemas complejos y encontrar soluciones óptimas basadas en datos",
                "**Planificación Urbana y Econometría** - Proyectar tendencias, analizar impacto de políticas, modelar futuros posibles",
                "**Ciencia de Datos y Machine Learning** - Extraer patrones de datos complejos y crear modelos predictivos",
                "**Gestión de Riesgos y Compliance** - Identificar patrones riesgosos, auditar procesos, asegurar cumplimiento basado en hechos",
            ],
        },
    },
    {
        strength: "Believer",
        nameEs: "Creyente",
        domain: "Doing",
        briefDefinition:
            "Las acciones de estas personas están impulsadas por valores fundamentales que no pueden comprometerse a costa del éxito. Se sienten agotados si sus creencias y valores son cuestionados o si tienen que hacer algo que va contra sus principios.",
        details: {
            fullDefinition: `El **Creyente** es mucho más que alguien con fe. Es un **portador de una brújula moral inmutable** que define su identidad, sus acciones y su legado.

## La Centralidad de los Valores

Para el Creyente, los valores fundamentales no son simplemente ideas abstractas o aspiracionales; son los **cimientos bedrock de su existencia**. Actúan como una **fuente inagotable de energía, propósito y resiliencia**, guiando cada decisión, cada paso y cada sacrificio que hacen. Su motivación profunda no es el éxito superficial, el reconocimiento o las recompensas materiales, sino el **significado existencial** que encuentran al alinear su trabajo, su tiempo y su energía con una causa o misión que consideran **más grande que ellos mismos**.

## La Autenticidad como Requisito Vital

La **autenticidad radical** es su norte magnético; la coherencia inquebrantable entre lo que creen internamente y lo que hacen externamente es vital para su bienestar emocional y espiritual. Una discrepancia entre valores y acciones no es solo incómoda para ellos; es una forma de sufrimiento. No pueden desconectar sus principios de su trabajo sin experimentar una fatiga existencial profunda.

## El Guardián del Propósito Organizacional

El valor más significativo de un Creyente es su capacidad para ser el **guardián vigilante del propósito y la integridad** en cualquier contexto. En un equipo, son quienes recuerdan a todos el "porqué" fundamental de su trabajo cuando la presión o el pragmatismo los desviaba. Inyectan un sentido de **significado y pasión que trasciende las tareas diarias y los números**. A través de su ejemplo vivido, inspiran a otros a actuar no solo por obligación contractual, sino por un propósito compartido y sentido, creando un entorno de trabajo más ético, significativo e inspirador.

## Impacto en la Cultura

Su presencia en una organización eleva el tono ético y el sentido de misión. Sin embargo, también representan una brújula que señala cuando la organización se desvía de sus valores fundacionales.`,

            howToUseMoreEffectively: [
                "**Elige Alineación Estratégica**: Sé intencional en elegir trabajos, proyectos y organizaciones que estén genuinamente alineados con tus valores fundamentales. Tu productividad y satisfacción dependen de esta alineación profunda.",
                "**Sé el Custodio de la Misión**: Actúa como el guardián del propósito del equipo, recordando constantemente a todos el 'porqué' de su trabajo. Tu perspectiva es invaluable cuando las presiones pragmáticas nublan el propósito.",
                "**Articula Valores con Claridad Respetuosa**: Comunica tus valores de forma clara, apasionada pero respetuosa. Ayuda a otros a entender tus motivaciones sin imposición ni juzgamiento. La inspiración es más poderosa que la imposición.",
                "**Mentorea desde la Integridad**: Desarrolla otros enseñándoles que el éxito verdadero proviene de la alineación con principios. Tu ejemplo vivido es tu enseñanza más potente.",
                "**Canaliza Valores en Acción Concreta**: No dejes tus valores como ideas suspendidas. Tradúcelos en iniciativas, políticas y decisiones concretas que otros puedan ver y seguir.",
            ],

            watchOuts: [
                "**Rigidez Dogmática**: Evita convertir tus valores en un dogma inflexible que no tolere perspectivas diferentes. El respeto por otros que tienen valores distintos es en sí mismo un valor importante.",
                "**Juzgamiento de Pragmatismo Ajeno**: No juzgues severamente a quienes toman decisiones más pragmáticas o menos basadas en principios morales absolutos. El contexto importa; otros pueden estar navegando restricciones que no ves.",
                "**Agotamiento por Causas Aparentemente Estancadas**: Ten cuidado con el agotamiento emocional y existencial cuando luchas por causas que parecen no avanzar o cuando trabajas en entornos que constantemente contradicen tus valores.",
                "**Desconexión de Compañeros Pragmáticos**: Tu énfasis en los valores puede hacerte parecer alejado de colegas más pragmáticos. Aprende a respetar su contribución sin comprometer tus principios.",
                "**Riesgo de Santurronería**: Ten cuidado de no caer en la santurronería o en la sensación de superioridad moral. La humildad es un valor también.",
            ],

            strengthsDynamics: `**Creyente + Cumplidor**: El Cumplidor convierte tus valores en acciones realizadas y compromisos honrados. Tú proporcionas el porqué; él asegura que se haga. Propósito + ejecución confiable = cambio duradero.

**Creyente + Narrador**: El Narrador comunica tu mensaje de manera inspiradora y memorable. Tú defines la causa; él la cuenta de forma que mueve corazones. Integridad + comunicación = influencia poderosa.

**Creyente + Estratega**: El Estratega alinea la dirección organizacional con tu propósito más profundo. Visión a largo plazo + valores centrales = estrategia con alma.

**Creyente + Empatizador**: El Empatizador entiende el impacto humano de tus valores. Ambos buscan hacer lo correcto, pero desde ángulos distintos. Principios + empatía = decisiones humanas.

**Creyente + Comandante**: El Comandante lidera con decisión; tú aseguras que esa decisión esté anclada en principios. Liderazgo fuerte + brújula moral = autoridad ética.`,

            bestPartners: [
                "**Cumplidor (Deliverer)** - Convierte tus valores en acciones concretas y resultados verificables",
                "**Narrador (Storyteller)** - Comunica tu misión y valores de manera inspiradora que mueve a otros",
                "**Estratega (Strategist)** - Alinea la dirección estratégica con un propósito superior y valores fundamentales",
                "**Empatizador (Empathizer)** - Complementa tus principios con comprensión del impacto humano real",
                "**Coach (Coach)** - Desarrolla otros ayudándolos a conectar su trabajo con su propósito personal",
            ],

            careerApplications: [
                "**Organizaciones Sin Fines de Lucro y ONGs** - Trabajar por causas que importan es donde tu energía y pasión alcanzan su máxima expresión",
                "**Trabajo Social, Activismo y Cambio Social** - Luchar por justicia, equidad y transformación social alimenta tu espíritu",
                "**Medicina, Cuidado de la Salud y Bienestar** - Servir a otros y aliviar sufrimiento es una causa que trasciende lo monetario",
                "**Liderazgo Ejecutivo en Empresas con Misión Social o Ética** - CEO, directores ejecutivos en organizaciones con propósito claro",
                "**Educación y Desarrollo Humano** - Invertir en potencial humano y transformación a través del aprendizaje",
                "**Defensa Ambiental y Sostenibilidad** - Proteger el planeta para futuras generaciones es un propósito profundo",
                "**Ética, Cumplimiento y Gobierno Corporativo** - Asegurar que las organizaciones actúen de acuerdo con sus valores declarados",
            ],
        },
    },
    {
        strength: "Chameleon",
        nameEs: "Camaleón",
        domain: "Feeling",
        briefDefinition:
            "Adoran trabajar 'sobre la marcha' y obtienen entusiasmo de sorpresas, cambios constantes en el entorno y giros inesperados. Se aburren hasta las lágrimas con la rutina y la previsibilidad.",
        details: {
            fullDefinition: `El **Camaleón** es mucho más que alguien que se adapta al cambio. Es un **maestro de la navegación dinámica y la prospección en la incertidumbre**.

## La Energía del Cambio

Aquellos que **abrazan la incertidumbre como un compañero vital** y se recargan con ella poseen la extraordinaria fortaleza del Camaleón: una **maestría en prosperar dentro de la volatilidad y el cambio continuo** que va mucho más allá de la simple adaptación reactiva. Para el Camaleón, la novedad no es una amenaza que tolerar, sino un **estímulo vital que los revitaliza**. Su mente se energiza constantemente con la variedad, los giros inesperados, los ambientes dinámicos y los contextos en constante transformación.

## El Elemento del Caos Controlado

Son el tipo de persona que se siente **verdaderamente en su elemento durante una crisis**, cuando un plan cambia radicalmente en el último minuto, o cuando el terreno bajo sus pies se desmorona impredeciblemente. No solo se ajustan pasivamente a nuevas circunstancias; se sienten **revitalizados y liberados por ellas**. Su habilidad para pasar con fluidez de un contexto a otro, de una tarea a otra, con rapidez, precisión y hasta alegría, los convierte en un **recurso invaluable para cualquier equipo** que deba operar en un entorno volátil, incierto o en constante cambio.

## El Ancla de Calma en el Caos

El mayor valor de un Camaleón es su capacidad para ser un **agente de estabilidad psicológica durante el caos organizacional**. Mientras otros se sienten estresados, asustados o paralizados por lo desconocido, ellos actúan como un **ancla de calma, demostración viva de que el cambio puede manejarse con gracia, flexibilidad y hasta optimismo**. Son el motor que permite a un equipo pivotar rápidamente, experimentar con nuevas direcciones y aprovechar oportunidades emergentes, garantizando que la organización no se hunda cuando las aguas se agitan inesperadamente.

## Impacto en la Organización

Su presencia tranquiliza a otros que temen el cambio y demuestra que la adaptabilidad es una fortaleza, no una debilidad.`,

            howToUseMoreEffectively: [
                "**Lidera Transformación Organizacional**: Ofrécete voluntariamente para proyectos piloto, nuevas iniciativas, reorganizaciones o para gestionar crisis inesperadas. Tu energía ante lo nuevo es exactamente lo que estos contextos necesitan.",
                "**Sé Modelo de Resiliencia**: Ayuda a tu equipo a navegar períodos de cambio significativo actuando como un ancla de calma, optimismo y adaptabilidad. Tu demostración de que el cambio es manejable tranquiliza a otros.",
                "**Busca Roles de Variedad Alta**: Persigue posiciones que ofrezcan gran variedad de tareas, contextos y desafíos diferentes. Tu productividad y satisfacción dependen de la estimulación constante.",
                "**Mentorea en Agilidad**: Enseña a otros cómo pivotar rápidamente, mantener la perspectiva durante la incertidumbre y encontrar oportunidades dentro del cambio. Tu flexibilidad es un skill transferible.",
                "**Documenta Mientras Adaptas**: Aunque te encante lo fluido, documenta los cambios, decisiones y aprendizajes mientras ocurren. Esto ayuda a otros a seguirte y a mantener la coherencia durante la volatilidad.",
            ],

            watchOuts: [
                "**Síndrome del Proyecto Incompleto**: Evita abandonar proyectos a mitad de camino solo porque la novedad ha desaparecido y la fase de ejecución se vuelve rutinaria. Comprométete con la finalización, no solo con el inicio.",
                "**Falta de Profundidad**: Asegúrate de desarrollar expertise real y profundidad en algunas áreas, no solo amplitud y superficialidad en muchas. La variedad sin dominio es poco valiosa.",
                "**Percepción de Falta de Confiabilidad**: Cuidado con parecer poco fiable o inconsistente a ojos de colegas que valoran la estabilidad. Tu flexibilidad puede interpretarse como falta de compromiso si no comunicas claramente.",
                "**Indecisión por Demasiadas Opciones**: Tu capacidad de ver múltiples caminos posibles puede paralizarte en indecisión. Aprende a elegir una dirección y comprometerte con ella temporalmente.",
                "**Desapego Emocional a Resultados**: Tu búsqueda constante de lo nuevo puede hacerte indiferente a si las cosas que empezaste realmente tuvieron éxito. Cultiva la inversión en resultados.",
            ],

            strengthsDynamics: `**Camaleón + Experto en Enfoque**: El Experto en Enfoque mantiene la dirección clara; el Camaleón aporta flexibilidad cuando los planes rígidos necesitan adaptarse. Objetivo claro + adaptabilidad = navegación inteligente.

**Camaleón + Catalizador**: El Catalizador impulsa iniciativas nuevas; el Camaleón se adapta rápidamente a la nueva dirección que surge. Impulso + pivote ágil = movimiento constante y renovado.

**Camaleón + Cumplidor**: El Cumplidor asegura que se complete lo comenzado; el Camaleón aporta la flexibilidad para hacerlo a través de cambios. Compromiso + adaptabilidad = entrega resiliente.

**Camaleón + Guardián del Tiempo**: El Guardián del Tiempo da estructura a la adaptabilidad constante. Cronograma flexible + cambio constante = estructura que permite fluidez.

**Camaleón + Generador de Ideas**: El Generador de Ideas explora posibilidades; el Camaleón trae una perspectiva fresca y diversa. Creatividad + perspectivas múltiples = innovación constante.`,

            bestPartners: [
                "**Experto en Enfoque (Focus Expert)** - Asegura que tu adaptabilidad tenga un objetivo final y se completen las iniciativas",
                "**Cumplidor (Deliverer)** - Aporta la constancia y el compromiso para finalizar lo que el Camaleón comienza con entusiasmo",
                "**Guardián del Tiempo (Time Keeper)** - Estructura tu flujo constante de actividades y pivotes dentro de cronogramas viables",
                "**Catalizador (Catalyst)** - Impulsa nuevas direcciones; tú adaptas rápidamente y lidera el pivote con entusiasmo",
                "**Estratega (Strategist)** - Visualiza el sistema completo; tú aportas agilidad para navegar hacia él adaptándote en el camino",
            ],

            careerApplications: [
                "**Consultoría Estratégica y de Gestión** - Trabajar con múltiples clientes, contextos y desafíos diferentes alimenta tu necesidad de variedad",
                "**Gestión de Crisis y Relaciones Públicas** - Situaciones dinámicas, respuestas rápidas e incertidumbre constante son tu hábitat natural",
                "**Emprendimiento y Startups** - La volatilidad, los pivotes constantes y la incertidumbre son exactamente donde prosperas",
                "**Periodismo, Medios y Producción de Eventos** - Plazos cortos, contextos nuevos y demandas inesperadas te energizan",
                "**Gestión de Productos en Entornos Ágiles** - Cambios rápidos de dirección, feedback constante e iteración frecuente",
                "**Operaciones de Emergencia y Respuesta a Desastres** - Ambientes caóticos donde la adaptabilidad rápida salva vidas",
                "**Ventas y Negociación Compleja** - Cada cliente es diferente, cada conversación es única, cada situación requiere adaptación",
            ],
        },
    },
    {
        strength: "Coach",
        nameEs: "Entrenador",
        domain: "Feeling",
        briefDefinition:
            "Disfrutan descubriendo el potencial en las personas y apoyando su crecimiento personal. Les resulta difícil aceptar cuando ese potencial se desperdicia.",
        details: {
            fullDefinition: `El **Entrenador** es mucho más que un tutor o mentor. Es un **catalizador de transformación humana y desarrollo potencial**.

## La Visión del Potencial Oculto

Existe un tipo especial de persona que **ve la semilla de grandeza donde otros ven solo limitaciones actuales**. Esta es la esencia del Entrenador: una **pasión visceral y profunda por el crecimiento humano** y el despliegue del potencial latente que trasciende la simple tutoría técnica o transmisión de conocimiento.

El Entrenador posee un **don especial casi intuitivo para ver capacidades dormidas** en cada persona. Su mente está constantemente sintonizada para identificar talentos latentes, habilidades por pulir, capacidades no descubiertas y debilidades que pueden transformarse. Ve lo que la persona podría llegar a ser, no solo lo que es hoy. Su mayor alegría profunda y satisfacción existencial provienen de presenciar el **momento transformador en que alguien supera un obstáculo mental o alcanza un nuevo nivel de maestría**.

## El Catalizador del Crecimiento

No solo dan consejos genéricos; actúan como un **catalizador vivo de la transformación personal**, haciendo las preguntas correctas en el momento exacto y creando un entorno de **apoyo genuino, confianza y seguridad psicológica** donde el otro se atreve a explorar sus propios límites y descubrir capacidades que no sabía que tenía. Son expertos en el arte de preguntar, escuchar y espacio: el triángulo mágico del desarrollo.

## El Arquitecto del Potencial Organizacional

Su valor principal es su **compromiso inquebrantable y a veces sacrificial con el éxito y crecimiento de los demás**. Son los **arquitectos del crecimiento humano**, quienes construyen literalmente los puentes para que otros crucen de "quienes son hoy" a "quienes pueden llegar a ser mañana". Su presencia en un equipo es fundamental para la retención del talento, la satisfacción laboral y el desarrollo de futuros líderes, ya que inspiran y motivan a las personas a alcanzar su máximo potencial, creando un ciclo virtuoso de mejora continua que se expande exponencialmente.

## Impacto Duradero

El impacto de un Entrenador no se mide solo en resultados inmediatos, sino en las trayectorias transformadas de los individuos que tocan.`,

            howToUseMoreEffectively: [
                "**Liderazgo del Desarrollo de Talento**: Dedica tiempo estratégico a mentorizar colegas más jóvenes, nuevos en la organización o en transición de roles. Tu capacidad de ver potencial es invaluable en el pipeline de liderazgo.",
                "**Feedback Transformador**: Utiliza tu habilidad para dar feedback constructivo que motive el crecimiento en lugar de desanimar o criticar. Tu feedback debe ser un espejo que muestra posibilidad, no juicio.",
                "**Desarrolla Sistemas de Mentoría**: Crea estructuras formales de mentoría, programas de desarrollo o espacios donde tu fortaleza de coaching pueda multiplicarse a escala.",
                "**Consultoría en Desarrollo Organizacional**: Ayuda a líderes a identificar, evaluar y desarrollar el talento dentro de sus equipos. Sé el especialista en desenmascarar el potencial oculto.",
                "**Mentoría de Líderes Futuros**: Enfócate en desarrollar futuros líderes. Tu inversión en desarrollo humano es una de las más altas contribuciones que puede hacer alguien.",
            ],

            watchOuts: [
                "**Inversión Desequilibrada en Personas Resistentes**: Evita invertir energía desproporcionada en personas que no están dispuestas a esforzarse activamente por mejorar. El coaching requiere disposición mutua; no puedes querer más que la persona.",
                "**Negligencia de Tu Propio Desarrollo**: No descuides tu propio crecimiento y aprendizaje personal por estar siempre enfocado en el desarrollo de otros. Practica el autocuidado profesional; mantén tu propia sierra afilada.",
                "**Síndrome del Mesías**: Cuidado con asumir un rol de 'salvador' o de único responsable del crecimiento de otros. El crecimiento es responsabilidad compartida; tú eres un catalizador, no el motor completo.",
                "**Apego Emocional a Resultados**: Tu inversión emocional en el éxito de otros puede causarte dolor cuando fallan o no alcanzan su potencial. Aprende a soltar los resultados y enfocarte en el proceso.",
                "**Frustración con Ritmos de Aprendizaje Diferentes**: No todos aprenden al mismo ritmo o en la misma dirección. Respeta y adapta tu enfoque de coaching a estilos y velocidades diferentes.",
            ],

            strengthsDynamics: `**Entrenador + Comandante**: El Comandante lidera con decisión; el Entrenador desarrolla el equipo para que esté a la altura de esas exigencias altas. Liderazgo fuerte + desarrollo de talento = equipo excepcional.

**Entrenador + Solucionador de Problemas**: El Solucionador diagnostica problemas; el Entrenador ayuda a las personas a superar sus propios bloqueos mentales y emocionales. Diagnóstico + transformación = resolución profunda.

**Entrenador + Autoconfiante**: El Autoconfiante tiene talento bruto y confianza; el Entrenador lo pulsa y lo canaliza hacia impacto productivo. Talento + dirección = excelencia realizada.

**Entrenador + Empatizador**: El Empatizador comprende profundamente las emociones; el Entrenador canaliza esa comprensión hacia crecimiento. Comprensión + desarrollo = transformación empoderada.

**Entrenador + Narrador**: El Narrador inspira con historias; el Entrenador crea nuevas historias de transformación en los individuos que toca. Inspiración + desarrollo = legado transformador.`,

            bestPartners: [
                "**Comandante (Commander)** - Necesita desarrollar su equipo para que execute su visión; tú les das ese desarrollo",
                "**Cumplidor (Deliverer)** - Ayúdales a crecer hacia roles de mayor responsabilidad y liderazgo",
                "**Autoconfiante (Self-Believer)** - Canaliza su talento bruto y confianza hacia impacto productivo y medible",
                "**Empatizador (Empathizer)** - Complementa su comprensión emocional con dirección de crecimiento explícita",
                "**Solucionador de Problemas (Problem Solver)** - Ayuda a otros a diagnosticar y superar sus propios bloqueos internos",
            ],

            careerApplications: [
                "**Desarrollo de Talento y Recursos Humanos** - Diseñar y ejecutar programas de desarrollo, mentoría y pipeline de liderazgo",
                "**Liderazgo de Equipos y Gerencia** - Construir equipos de alto rendimiento a través del desarrollo intensivo de talento",
                "**Enseñanza, Entrenamiento y Educación Profesional** - Transformar el aprendizaje en crecimiento real y cambio de comportamiento",
                "**Coaching Ejecutivo y de Vida** - Trabajar 1-a-1 con líderes y profesionales en transformación de su potencial",
                "**Desarrollo Organizacional y Cambio** - Guiar organizaciones en transformación a través del desarrollo de su gente",
                "**Liderazgo en Startups y Escala** - Desarrollar talento velozmente conforme la organización crece y escala",
                "**Mentorería de Emprendedores** - Apoyar el crecimiento de emprendedores a través de coaching y desarrollo",
            ],
        },
    },
    {
        strength: "Empathizer",
        nameEs: "Empatizador",
        domain: "Feeling",
        briefDefinition:
            "Son excelentes para entender cómo se sienten los demás y usan esa comprensión para hacer lo correcto. Se frustran cuando se les pide que ignoren los sentimientos y sigan solo la lógica fría.",
        details: {
            fullDefinition: `El **Empatizador** es mucho más que alguien que entiende emociones. Es un **resonador emocional que canaliza comprensión en acción compasiva**.

## La Sintonía Emocional Profunda

Hay personas que **sienten el mundo literalmente a través del corazón de los demás**. Esta es la esencia del Empatizador: la **habilidad innata, casi sobrenatural, para sintonizar con la esencia emocional de otros** y actuar de forma genuinamente compasiva, trascendiendo la simple comprensión intelectual de los sentimientos ajenos.

El Empatizador es un **radiólogo emocional sofisticado**, capaz de ver profundamente más allá de las palabras superficiales y percibir las corrientes subterráneas de sentimientos, miedos, esperanzas y necesidades que fluyen a través de un equipo. No solo escuchan pasivamente; **literalmente sienten lo que otros sienten** a nivel visceral, lo que les permite crear conexiones genuinas, profundas y autênticas. Esta capacidad de sintonía no es puramente pasiva o receptiva; les **impulsa naturalmente a actuar**, ya sea para ofrecer una palabra de aliento en el momento exacto, mediar en un conflicto antes de que escale, o simplemente validar la experiencia de otra persona con una presencia tranquila.

## Creadores de Espacios Seguros

Su presencia literalmente **crea un ambiente de seguridad psicológica** donde todos se sienten verdaderamente vistos, escuchados y valorados por quiénes son, no solo por lo que producen. Esto transforma la dinámica grupal.

## El Pegamento Emocional Organizacional

El valor más grande y duradero de un Empatizador es ser el **pegamento emocional de un equipo**. Son los **guardianes vigilantes de la moral, el bienestar y la cohesión humana**, los que aseguran que las decisiones no solo sean lógicamente correctas, sino también **profundamente humanas** en su ejecución e impacto. Son el **puente vivo entre la cabeza analítica y el corazón compasivo**, garantizando que el éxito no se mida únicamente en resultados cuantitativos, sino también en la salud psicológica, la satisfacción y la cohesión de las personas que logran ese éxito.

## Impacto en la Cultura

Sin Empatizadores, las organizaciones tienden hacia la frialdad transaccional. Con ellos, se convierten en lugares donde la gente prospera no solo profesionalmente sino humanamente.`,

            howToUseMoreEffectively: [
                "**Sé el Pulso Emocional de la Organización**: Dedica tiempo estratégico a preguntar, escuchar activamente y tomar el pulso emocional de tu equipo. Tú eres el detector temprano de problemas culturales y de bienestar.",
                "**Media Conflictos desde la Comprensión**: Usa tu intuición emocional para anticipar y mediar conflictos antes de que escalen, buscando puntos de conexión humana genuina y necesidades compartidas.",
                "**Integra Datos con Humanidad**: Combina tu sensibilidad emocional refinada con datos objetivos. Presenta feedback sobre impacto humano junto a métricas numéricas, creando argumentos que tocan cabeza y corazón.",
                "**Diseña Experiencias Humanas**: Participa activamente en diseñar procesos, políticas y decisiones considerando el impacto emocional y humano. Sé el defensor de las personas en reuniones de decisión.",
                "**Mentorea en Inteligencia Emocional**: Enseña a líderes y colegas cómo sintonizar emocionalmente con sus equipos. Tu capacidad de leer personas es un skill altamente transferible.",
            ],

            watchOuts: [
                "**Sobrecarga Emocional y Compassion Fatigue**: Evita absorberte emocionalmente con los problemas de todos. Tu sensibilidad puede llevarte a internalizar sufrimiento ajeno. Establece límites saludables y cultiva autocuidado emocional.",
                "**Parálisis por Búsqueda de Armonía**: No permitas que tu deseo de mantener la paz y armonía frene decisiones necesarias aunque sean incómodas o difíciles. A veces, la compasión requiere tomar decisiones duras.",
                "**Malinterpretación de Señales Emocionales**: Tu intuición es poderosa pero no infalible. Evita interpretaciones mal cuando falta comunicación clara. Valida tus percepciones preguntando directamente antes de actuar.",
                "**Descuido de la Lógica Necesaria**: Tu orientación emocional no debe cegarte a hechos objetivos o realidades lógicas. Aprende a integrar emoción e información sin dejar que una domine completamente.",
                "**Falta de Límites Profesionales**: Tu cercanía emocional genuina con colegas puede dificultar decisiones profesionales difíciles (despidos, reassignments). Mantén claridad en tus roles profesionales.",
            ],

            strengthsDynamics: `**Empatizador + Analista**: El Analista proporciona datos objetivos; el Empatizador añade el contexto humano. Lógica + empatía = decisiones sabias que consideran hechos y personas.

**Empatizador + Comandante**: El Comandante decide con directividad; el Empatizador suaviza esa directividad con inteligencia emocional. Decisión fuerte + humanidad = liderazgo que inspira lealtad.

**Empatizador + Solucionador de Problemas**: El Solucionador diagnostica problemas técnicos; el Empatizador entiende el impacto humano. Diagnóstico + contexto humano = soluciones completas.

**Empatizador + Creyente**: El Creyente define valores; el Empatizador asegura que esos valores se vivan considerando a las personas. Principios + sensibilidad humana = cultura ética.

**Empatizador + Estratega**: El Estratega diseña el futuro organizacional; el Empatizador asegura que el viaje hacia ese futuro considere el bienestar de la gente. Visión + humanidad = transformación sin trauma.`,

            bestPartners: [
                "**Analista (Analyst)** - Proporciona datos objetivos que complementan y validan tus intuiciones emocionales",
                "**Comandante (Commander)** - Necesita humanidad en sus decisiones; tú añades perspectiva del impacto en las personas",
                "**Solucionador de Problemas (Problem Solver)** - Aborda problemas; tú aseguras que se considere el aspecto humano en las soluciones",
                "**Creyente (Believer)** - Comparte valores profundos; juntos crean cultura ética y humana",
                "**Entrenador (Coach)** - Ambos invierten en crecimiento humano; se complementan naturalmente en desarrollo de talento",
            ],

            careerApplications: [
                "**Recursos Humanos y Desarrollo de Talento** - Diseñar experiencias de empleados, programas de desarrollo y culturas de inclusión",
                "**Coaching Ejecutivo y Mentoring** - Trabajar 1-a-1 con líderes en su desarrollo emocional y relacional",
                "**Comunicación Interna y Gestión del Cambio** - Navegar transformaciones organizacionales considerando el impacto emocional en la gente",
                "**Atención al Cliente y Relaciones** - Crear experiencias de cliente excepcionales basadas en comprensión profunda de necesidades emocionales",
                "**Mediación y Resolución de Conflictos** - Mediar entre partes en conflicto buscando soluciones que honren a todos",
                "**Liderazgo Organizacional y Cultura** - Construir organizaciones donde las personas prosperen emocionalmente y se sientan valoradas",
                "**Bienestar Mental y Wellness Corporativo** - Diseñar programas que aborden la salud emocional y mental de la organización",
            ],
        },
    },
    {
        strength: "Optimist",
        nameEs: "Optimista",
        domain: "Feeling",
        briefDefinition:
            "Disfrutan elogiando lo bueno en las personas y sienten gratitud por lo que tienen. Les resulta difícil estar cerca de aquellos que constantemente se enfocan en lo negativo.",
        details: {
            fullDefinition: `El **Optimista** es mucho más que alguien con una actitud positiva. Es una **fuerza catalizadora que inyecta esperanza, energía y vitalidad** en cualquier entorno.

## La Visión del Potencial Futuro

El Optimista no solo ve el vaso medio lleno; activamente lo **llena aún más con su entusiasmo genuino y su visión clara de un futuro mejor** alcanzable. Posee la habilidad casi sobrenatural de **re-enmarcar los desafíos como oportunidades de crecimiento** y los contratiempos como lecciones valiosas que sirven para avanzar. Su energía no es superficial o fingida; es visceral, contagiosa y **genuinamente elevadora de la moral** de su equipo, transformando tareas mundanas y grises en experiencias más atractivas, significativas e incluso emocionantes.

## La Fe Inquebrantable

Su creencia profunda e inquebrantable en el éxito, en el potencial humano y en la posibilidad de un resultado positivo no es ingenua ni desconectada de la realidad; es una **fuerza psicológica poderosa que impulsa el progreso y la resiliencia** incluso contra las probabilidades. Es la fe que mueve montañas, o al menos hace que las personas se atrevan a intentar escalarlas.

## La Fuente de Luz en la Oscuridad

El mayor valor del Optimista es su capacidad para ser la **fuente de luz coherente en la oscuridad organizacional**. Son los que celebran públicamente los pequeños logros que otros pasan por alto, y que mantienen al equipo enfocado en el lado brillante de las cosas, incluso cuando el camino se vuelve árido, difícil o incierto. Su presencia es fundamental para mantener viva la **resiliencia y el impulso**, asegurando que un equipo no se rinda ante la adversidad con desesperación, sino que la aborde con una creencia positiva fundamentada y un espíritu inquebrantable.

## Impacto Duradero

Sin Optimistas, los equipos tienden hacia la apatía. Con ellos, florecen incluso en condiciones desafiantes.`,

            howToUseMoreEffectively: [
                "**Sé el Celebrador de Logros**: Actúa como el animador oficial del equipo, celebrando las pequeñas victorias que otros pasan por alto. Tu reconocimiento genuino mantiene alta la moral y el momentum.",
                "**Enmarca Crisis como Oportunidades**: En momentos de crisis, dificultad o incertidumbre, enmarca inteligentemente la situación como un desafío superable y una oportunidad de aprendizaje, no como un desastre inevitable.",
                "**Energiza lo Mundano**: Utiliza tu energía genuina para hacer que tareas rutinarias, repetitivas o aparentemente aburridas parezcan más atractivas, significativas y hasta divertidas. La transformación de perspectiva es tu superpoder.",
                "**Mentorea en Resiliencia**: Enseña a otros cómo reencuadrar desafíos, mantener perspectiva durante dificultades y encontrar significado incluso en adversidades. Tu filosofía es altamente transferible.",
                "**Cultiva Gratitud Colectiva**: Crea rituales o espacios donde el equipo exprese gratitud por lo que funciona bien y por los logros alcanzados. Esto amplifica tu impacto positivo.",
            ],

            watchOuts: [
                "**Evita Parecer Ingenuo o Desconectado**: No minimices problemas genuinos ni ignores riesgos reales por exceso de positivismo. Tu optimismo debe estar anclado en la realidad, no flotando en fantasía.",
                "**Respeta el Procesamiento Emocional**: No saltes demasiado rápido a 'mira el lado bueno' cuando otros están procesando sentimientos negativos legítimos. Valida primero, después reenmarca. El timing emocional es crítico.",
                "**Cuidado con la Minimización**: Tu positiva perspectiva puede sonar como si estuvieras minimizando los sentimientos ajenos. Aprende a decir 'Eso es difícil Y aquí está lo que podemos hacer' en lugar de solo 'Pero mira...'",
                "**No Subestimes Riesgos**: Tu entusiasmo no debe cegarte a riesgos genuinos o dificultades reales de un proyecto. Trabaja con Solucionadores de Problemas para validar que la optimismo está fundamentada.",
                "**Evita la Tóxicidad de la Positividad Forzada**: La positividad forzada o tóxica ahoga la autenticidad. Mantén tu optimismo genuino y permítete espacio para la realidad compleja cuando sea necesario.",
            ],

            strengthsDynamics: `**Optimista + Solucionador de Problemas**: El Solucionador ve problemas y riesgos; el Optimista ve soluciones y oportunidades. Realismo crítico + esperanza = mejora equilibrada.

**Optimista + Catalizador**: El Catalizador quiere empezar; el Optimista proporciona el combustible emocional y la creencia para que otros se animen a intentar. Impulso + energía contagiosa = movimiento inspirado.

**Optimista + Narrador**: El Narrador comunica; el Optimista proporciona historias de éxito, esperanza e inspiración. Comunicación + esperanza = narrativa que mueve.

**Optimista + Pacificador**: El Pacificador busca armonía; el Optimista transforma conflictos en oportunidades de fortalecimiento. Resolución pacífica + crecimiento = conflicto transformador.

**Optimista + Analista**: El Analista proporciona datos; el Optimista añade esperanza y posibilidad. Hechos + esperanza = decisiones informadas pero audaces.`,

            bestPartners: [
                "**Solucionador de Problemas (Problem Solver)** - Equilibra tu visión positiva con detección realista de riesgos y problemas",
                "**Catalizador (Catalyst)** - Quiere empezar; tú proporcionas el combustible emocional y la creencia para inspirar acción",
                "**Cumplidor (Deliverer)** - Motivas para superar obstáculos con energía positiva y persistencia",
                "**Pacificador (Peace Keeper)** - Juntos transforman conflictos en oportunidades de crecimiento y fortalecimiento",
                "**Narrador (Storyteller)** - Comunica tus historias de éxito y esperanza de manera memorable e inspiradora",
            ],

            careerApplications: [
                "**Ventas y Desarrollo de Negocio** - Tu capacidad de creer en posibilidades y contagiar esa creencia es exactamente lo que la venta requiere",
                "**Marketing y Publicidad** - Crear narrativas inspiradoras y atractivas que motiven a clientes a creer en posibilidades",
                "**Liderazgo de Equipos durante Cambio** - En fases de transformación, tu energía positiva es vital para mantener el momentum y la confianza",
                "**Animación de Eventos y Oratoria Motivacional** - Inspirar audiencias, motivar equipos en momentos críticos, energizar eventos",
                "**Relaciones Públicas y Comunicación** - Construir narrativas positivas, manejar crisis con esperanza, restaurar confianza",
                "**Emprendimiento y Startups** - El optimismo fundamentado es lo que impulsa innovadores a intentar lo imposible",
                "**Recursos Humanos y Cultura Organizacional** - Construir culturas donde la esperanza y el potencial humano florecen",
            ],
        },
    },
    {
        strength: "Catalyst",
        nameEs: "Catalizador",
        domain: "Motivating",
        briefDefinition:
            "Aman poner las cosas en marcha y crear momentum en ambientes estancados. Tienen dificultad para esperar y 'perder tiempo' cuando saben que podrían estar avanzando y poniendo cosas en movimiento.",
        details: {
            fullDefinition: `El **Catalizador** es mucho más que alguien con iniciativa. Es una **fuerza de arranque imparable que transforma el estancamiento paralizante en movimiento dinámico**.

## La Impaciencia Productiva

El Catalizador posee una **impaciencia productiva casi visceral** que lo impulsa a pasar de la idea abstracta a la acción concreta a velocidad de rayo. Su talento fundamental no reside en la planificación meticulosa de cada detalle, sino en su habilidad sobrenatural para **encender la chispa inicial**, generar el momentum necesario y **contagiar a otros con su energía inquieta** para dar el primer paso atrevido. Para ellos, la inacción no es simplemente incómoda; es una tortura existencial. Son los que dicen "¿y si lo hacemos ahora?" y no descansan hasta que alguien más diga "sí, hagámoslo".

## Rompedor del Estancamiento

El valor más grande y transformador de un Catalizador es su capacidad casi mágica para **romper la parálisis del análisis y el estancamiento organizacional**. Son los que sacan a equipos inteligentes pero paralizados de la fase aparentemente infinita de "discusión y más discusión", y los lanzan directamente hacia la ejecución, la experimentación y el aprendizaje real. Son el **motor que hace despegar los proyectos dormidos**, el impulso que transforma reflexión sin fin en acción rápida, y las ideas prometedoras en resultados iniciales verificables.

## Motor Organizacional de Cambio

Su presencia es fundamental para que las cosas no solo se hablen en salas de reuniones, sino que realmente sucedan en el mundo real. Sin Catalizadores, las organizaciones se quedan atrapadas en análisis infinito. Con ellos, la energía fluye hacia la acción.

## Impacto en la Cultura

Un Catalizador cambia la mentalidad organizacional de "¿y si...?" a "¿y si lo hacemos ahora?"`,

            howToUseMoreEffectively: [
                "**Lidera Iniciativas Estancadas**: Toma la delantera en proyectos, iniciativas o transformaciones que llevan meses en análisis o están bloqueados por incertidumbre. Tu capacidad de transformar discusión en acción es exactamente lo que necesitan.",
                "**Convierte Reuniones en Movimiento**: En sesiones de estrategia o planificación, transforma la discusión en decisiones claras, próximos pasos concretos y asignación de responsabilidades. Sé el que dice 'esto es lo que hacemos mañana'.",
                "**Inicia Experimentos Rápidos**: En lugar de esperar a planes perfectos, inicia pequeños experimentos, pilotos y pruebas de concepto que generen información real y momentum.",
                "**Forma Equipos Complementarios**: Asociate estratégicamente con Cumplidores, Guardianes del Tiempo y Expertos en Enfoque que puedan sostener y estructurar tu impulso inicial. Tu fortaleza multiplicada es explosiva.",
                "**Mentorea en Valentía de Acción**: Enseña a otros cómo superar la parálisis del análisis, cómo aprender experimentando en lugar de planificando perfectamente, y cómo el movimiento genera información.",
            ],

            watchOuts: [
                "**Síndrome del Proyecto Iniciado Pero No Completado**: Evita iniciar demasiadas cosas simultáneamente sin un plan claro para sostener y completarlas. El cementerio de iniciativas comenzadas está lleno de proyectos Catalizador.",
                "**Impaciencia con Procesos Necesarios**: Sé paciente y respeta a las personas que necesitan más tiempo para analizar, reflexionar o procesar antes de actuar. No todos tienen tu velocidad mental; no significa que sean lentos.",
                "**Riesgo de Decisiones Precipitadas**: Tu urgencia por actuar puede llevarte a tomar decisiones demasiado rápido sin suficiente información. A veces, esperar 24 horas produce decisiones mejores.",
                "**Presión Excesiva sobre el Equipo**: Cuidado con presionar demasiado agresivamente al equipo con tu ritmo implacable. Podrías generar estrés, burnout o resentimiento si no creas espacios para respirar.",
                "**Negligencia de la Planeación Estratégica**: Tu velocidad no debe sacrificar dirección clara. Un movimiento sin rumbo es solo agitación. Aprende a coordinar tu impulso con visión estratégica.",
            ],

            strengthsDynamics: `**Catalizador + Pensador**: El Pensador reflexiona profundamente; el Catalizador convierte esa reflexión en experimentos prácticos rápidos. Contemplación + acción = innovación fundamentada.

**Catalizador + Estratega**: El Estratega diseña el rumbo a largo plazo; el Catalizador inicia la acción necesaria para explorar viabilidad y generar momentum hacia ese rumbo. Visión + movimiento = navegación dinámico.

**Catalizador + Cumplidor**: El Cumplidor toma el relevo del impulso inicial y asegura que se complete confiablemente. Arranque + finalización = resultados.

**Catalizador + Experto en Enfoque**: El Experto en Enfoque canaliza tu energía hacia un objetivo específico, evitando dispersión. Energía + dirección = avance enfocado.

**Catalizador + Guardián del Tiempo**: El Guardián del Tiempo estructura tu urgencia en cronogramas viables. Impulso + calendario = acción organizada.`,

            bestPartners: [
                "**Cumplidor (Deliverer)** - Toma tu impulso inicial y se asegura de que se complete confiablemente y a tiempo",
                "**Experto en Enfoque (Focus Expert)** - Canaliza tu energía impetuosa hacia un objetivo concreto, evitando dispersión",
                "**Guardián del Tiempo (Time Keeper)** - Estructura tu urgencia en cronogramas realistas y secuencias organizadas",
                "**Pensador (Thinker)** - Proporciona reflexión profunda antes de tu acción, mejorando la calidad de tu impulso",
                "**Estratega (Strategist)** - Visualiza el rumbo; tú inicias el movimiento necesario hacia él",
            ],

            careerApplications: [
                "**Lanzamiento de Productos y Servicios** - Llevar nuevas soluciones al mercado rápidamente requiere exactamente tu capacidad de crear momentum",
                "**Emprendimiento y Dirección de Startups** - El espíritu startup que requiere acción rápida, experimentación y aprendizaje en movimiento es tu hábitat natural",
                "**Ventas y Desarrollo de Nuevos Mercados** - Abrir mercados nuevos, conquistar clientes nuevos, crear nuevas oportunidades requiere tu iniciativa incansable",
                "**Producción de Eventos y Campañas de Marketing** - Lanzamientos, campañas, eventos requieren alguien que genere urgencia y mueva cosas rápidamente",
                "**Transformación y Cambio Organizacional** - Superar la inercia en transformaciones grandes requiere tu capacidad de crear momentum inicial",
                "**Investigación y Desarrollo** - La experimentación rápida, el fracaso rápido y el aprendizaje en movimiento son tus fortalezas",
                "**Innovación y Emprendimiento Corporativo** - Crear nuevas líneas de negocio o iniciativas dentro de organizaciones grandes requiere exactamente tu capacidad de romper el status quo",
            ],
        },
    },
    {
        strength: "Commander",
        nameEs: "Comandante",
        domain: "Motivating",
        briefDefinition:
            "Aman estar a cargo, hablar alto y ser escuchados. No huyen del conflicto y pueden llegar a frustrarse con aquellos que 'se andan con rodeos'.",
        details: {
            fullDefinition: `El **Comandante** es mucho más que un líder con autoridad. Es un **portador de claridad inquebrantable que lidera a través de decisión directa y responsabilidad inquebrantable**.

## Autoridad Natural y Presencia

Existe un tipo de personalidad que **nace para dirigir, decidir y enfrentar la realidad sin filtros diplomáticos**. Esta es la esencia del Comandante: una fortaleza que combina **autoridad natural innata** con una **franqueza radical y un liderazgo sin ambigüedades**. 

El Comandante posee una presencia de liderazgo que no necesita ser ganada; es inherente a su forma de ser. Se manifiesta en su capacidad casi magnética para **tomar el control de cualquier situación**, estructurar el caos y proporcionar dirección clara donde otros ven confusión. No temen a la responsabilidad; de hecho, se sienten **verdaderamente vivos y energizados** cuando asumen la dirección, toman decisiones difíciles y guían a otros hacia un objetivo claro.

## La Franqueza como Herramienta

Su mayor valor radica en su **franqueza inquebrantable y su negativa a participar en juegos políticos**. No se andan con rodeos, valoran la comunicación directa y transparente, y ven el conflicto no como un problema a evitar, sino como una **oportunidad legítima para la claridad, el avance y la resolución**. Hablan la verdad incluso cuando es incómoda, lo que es exactamente lo que muchas organizaciones necesitan pero temen.

## Decisor en el Caos

Su motivación principal es la acción rápida y la toma de decisiones clara. Para ellos, la indecisión, la ambigüedad y la falta de dirección son los mayores enemigos del progreso organizacional. Son los que defienden ferozmente a su equipo contra la política externa, los que toman las **decisiones impopulares pero necesarias** que otros evitan, y los que proporcionan la dirección clara y el rumbo firme que otros no se atreven a dar.

## Liderazgo en Tormentas

Su presencia es fundamental para superar la parálisis, enfrentar los desafíos de frente con realismo, y asegurar que la organización tenga un capitán firme, decidido y responsable, incluso en las tormentas más turbulentas.`,

            howToUseMoreEffectively: [
                "**Lidera en Crisis y Ambigüedad**: Asume el liderazgo explícitamente en situaciones de crisis, ambigüedad estratégica o cuando se necesita dirección clara e inmediata. Tu capacidad de decidir sin paralizar es invaluable.",
                "**Proporciona Feedback Transformador**: Usa tu franqueza para dar feedback directo, sin ambigüedades y estructurado que impulse el mejoramiento real del rendimiento. Sé brutal en la honestidad, compasivo en la intención.",
                "**Defiende y Protege tu Equipo**: Usa tu autoridad natural para defender ferozamente a tu equipo contra presiones externas, políticas o decisiones que no creas que son correctas. Sé su escudo.",
                "**Toma Decisiones Impopulares Necesarias**: Sé el líder que otros no se atreven a ser; toma decisiones difíciles, impopulares pero necesarias. Tu coraje es lo que permite que la organización avance.",
                "**Mentorea en Liderazgo Decisivo**: Enseña a otros cómo tomar decisiones bajo incertidumbre, cómo comunicar dirección clara y cómo enfrentar conflictos como oportunidades de avance.",
            ],

            watchOuts: [
                "**Autoritarismo Percibido**: Evita parecer demasiado autoritario, intimidante o dominante; modula tu intensidad según la persona, contexto y momento. No todos responden igual a la autoridad directa.",
                "**Falta de Escucha Activa**: Aprende a pausar y escuchar genuinamente otras opiniones, perspectivas y datos antes de imponer tu propia visión. Tu decisión será mejor con input diverso.",
                "**Confrontación Excesiva**: No todas las batallas valen la pena pelear. Aprende a elegir cuáles conflictos enfrentar directamente y cuáles resolver de manera más diplomática. La sabiduría está en saber cuándo ser directo y cuándo ser estratégico.",
                "**Resentimiento por Directividad**: Tu comunicación directa, aunque honesta, puede generar resentimiento si se percibe como falta de consideración por las emociones. Sé claro pero considerado.",
                "**Negligencia del Desarrollo de Otros**: No te enfocques solo en tomar decisiones y dictar dirección. Invierte en desarrollar a otros líderes para que puedan tomar decisiones sin ti.",
            ],

            strengthsDynamics: `**Comandante + Empatizador**: El Empatizador entiende el impacto humano de tus decisiones directas; tú provides dirección clara. Decisión fuerte + sensibilidad humana = liderazgo que inspira lealtad.

**Comandante + Analista**: El Analista te proporciona datos objetivos que fundamentan tus decisiones. Decisión intuitiva + evidencia = liderazgo informado y confiable.

**Comandante + Cumplidor**: El Cumplidor aprecia tu dirección cristalina y ejecuta con fiabilidad inquebrantable. Dirección clara + ejecución confiable = resultados.

**Comandante + Catalizador**: El Catalizador crea momentum; tú provides la dirección clara hacia dónde debe fluir ese momentum. Energía + dirección = acción enfocada.

**Comandante + Estratega**: El Estratega diseña el rumbo a largo plazo; tú aseguras que la dirección se comunique sin ambigüedad y se ejecute. Visión + liderazgo directo = implementación clara.`,

            bestPartners: [
                "**Empatizador (Empathizer)** - Asegura que tus decisiones directas consideren genuinamente el factor humano y el impacto emocional",
                "**Analista (Analyst)** - Fundamenta tus decisiones con datos objetivos, evitando que confíes solo en intuición",
                "**Cumplidor (Deliverer)** - Aprecia tu dirección cristalina y ejecuta con fiabilidad, multiplicando tu impacto",
                "**Catalizador (Catalyst)** - Canaliza el momentum que creas; juntos generan movimiento decisivo",
                "**Coach (Coach)** - Desarrolla líderes en tu equipo para que puedan tomar decisiones sin ti",
            ],

            careerApplications: [
                "**Dirección General y Gerencia de Alto Nivel** - CEO, Presidents, C-Suite donde las decisiones claras y la dirección inquebrantable son críticas",
                "**Liderazgo Militar y Servicios de Emergencia** - Contextos donde la cadena de mando clara, la decisión rápida y el liderazgo bajo presión son esenciales",
                "**Dirección de Reestructuraciones y Fusiones** - Situaciones complejas que requieren coraje para tomar decisiones impopulares pero necesarias",
                "**Abogacía Litigante y Arbitraje** - Defensa agresiva, argumentación directa y confrontación estructurada requieren tu fortaleza",
                "**Turnaround y Crisis Management** - Salvar organizaciones en crisis requiere exactamente tu capacidad de tomar mando decisivo",
                "**Negociación de Altas Apuestas** - Negociaciones complejas donde la posición clara y la franqueza son ventajas",
                "**Política y Gobierno** - Liderazgo público donde la dirección clara y la responsabilidad son fundamentales",
            ],
        },
    },
    {
        strength: "Self-Believer",
        nameEs: "Autoconfiante",
        domain: "Motivating",
        briefDefinition:
            "Son personas independientes y autosuficientes que inspiran a otros con su confianza y certeza. No pueden soportar que otros les digan qué hacer o intenten controlar sus acciones.",
        details: {
            fullDefinition: `El **Autoconfiante** es mucho más que alguien con seguridad personal. Es un **portador de convicción interna inquebrantable** que magnetiza a otros hacia la audacia.

## La Brújula Interna Inquebrantable

Cuando observas a **alguien que confía profundamente en su propia brújula interna sin necesidad de validación externa**, estás frente a un Autoconfiante. Esta fortaleza representa una **convicción interna casi feroz** que impulsa la acción atrevida, la innovación radical y el liderazgo sin necesidad de aprobación de otros.

Para el Autoconfiante, la **fe inquebrantable en sus propias habilidades, intuición y juicio** es su combustible principal de energía. No necesitan la validación constante de otros, ya que su brújula interna los guía con una certeza casi magnética que a menudo inspira profundamente a los demás. Esta seguridad en sí mismo les permite **tomar riesgos calculados que otros no se atreverían a tomar**, explorar caminos no convencionales y claramente no probados, y mantenerse firmemente en pie ante la adversidad, el fracaso o la crítica.

## El Pionero sin Mapa

Son los que se atreven audazmente a ir en contra de la corriente del pensamiento convencional, **confiando absolutamente en su intuición y su juicio** cuando no hay un mapa claro a seguir, cuando no hay precedente y cuando la mayoría vería incertidumbre paralizante.

## Inspirador de Audacia

El mayor valor de un Autoconfiante es su capacidad para ser un **modelo viviente de inspiración y empoderamiento para otros**. A través de su ejemplo incuestionable, demuestran a colegas y equipos que la verdadera fuerza proviene de confiar profundamente en uno mismo. Son los **líderes que inician cambios audaces**, los **pioneros que abren nuevos caminos en territorios desconocidos** y los que demuestran tangiblemente que el éxito no depende de la aprobación externa, sino de la convicción interna y la acción.

## Impacto Transformador

Su presencia en un equipo es fundamental para impulsar la audacia, validar la innovación y modelar autosuficiencia. Sin ellos, los equipos tienden hacia la aversión al riesgo.`,

            howToUseMoreEffectively: [
                "**Lidera Iniciativas Pioneras**: Toma la delantera en proyectos innovadores, ambiciosos o donde no existe un camino claro a seguir. Tu confianza inquebrantable es exactamente lo que estos contextos radicales necesitan.",
                "**Modela Audacia Calculada**: Demuestra a otros cómo tomar riesgos inteligentes, cómo perseverar ante incertidumbre y cómo confiar en la intuición cuando los datos son incompletos. Tu ejemplo es tu enseñanza.",
                "**Inspira Autosuficiencia**: Crea espacios donde otros desarrollen confianza en sí mismos y en sus propias capacidades. Tu confianza es contagiosa si la canalizas como inspiración, no como arrogancia.",
                "**Toma Decisiones Rápidas en Ambigüedad**: En contextos donde no hay tiempo para análisis exhaustivo, usa tu intuición refinada para tomar decisiones audaces. Tu capacidad de decidir sin parálisis es un superpoder.",
                "**Mentorea en Empoderamiento**: Enseña a otros a creer en sus propias capacidades, a cuestionar la sabiduría convencional cuando sea apropiado y a tomar riesgos calculados en su desarrollo.",
            ],

            watchOuts: [
                "**Arrogancia Percibida**: Evita parecer arrogante, prepotente o desdeñoso con las opiniones, expertise o precauciones de otros. La confianza sin humildad se convierte en soberbia destructiva.",
                "**Rechazo de Feedback Valioso**: Aprende a aceptar feedback genuino, reconocer cuando te equivocas, y crecer a través de la crítica constructiva. La confianza en ti mismo no debe cerrar la puerta al aprendizaje.",
                "**Negligencia de Expertise Externo**: No ignores o subestimes el conocimiento de expertos, especialistas o aquellos con experiencia diferente. Tu intuición es poderosa, pero no es infalible.",
                "**Ruptura de Reglas Innecesaria**: No rechaces reglas, procesos o estructuras importantes solo por tu deseo visceral de independencia. A veces, las restricciones existen por buenas razones.",
                "**Aislamiento y Falta de Colaboración**: Tu independencia puede aislarte de oportunidades de crecimiento colaborativo. Aprende que la confianza en ti mismo puede coexistir con la interdependencia estratégica.",
            ],

            strengthsDynamics: `**Autoconfiante + Analista**: El Analista valida o desafía tus intuiciones con datos rigurosos. Intuición + evidencia = decisiones audaces pero fundamentadas.

**Autoconfiante + Estratega**: El Estratega visualiza campos de juego grandes; tú confías en tu capacidad de ganar en ellos. Visión + confianza = ambición realizada.

**Autoconfiante + Comandante**: El Comandante lidera con decisión; tu confianza en ti mismo complementa su autoridad. Decisión clara + autosuficiencia = liderazgo magnético.

**Autoconfiante + Entrenador**: El Entrenador canaliza tu talento innato hacia impacto productivo. Talento bruto + desarrollo = excelencia refinada.

**Autoconfiante + Catalizador**: El Catalizador impulsa cosas nuevas; tu confianza da el coraje para intentar lo no probado. Impulso + audacia = innovación radical.`,

            bestPartners: [
                "**Analista (Analyst)** - Proporciona datos objetivos que validan o refinan tu intuición innata, haciéndola más poderosa",
                "**Estratega (Strategist)** - Proporciona campos de juego grandes donde aplicar tu confianza para lograr metas audaces",
                "**Entrenador (Coach)** - Te ayuda a entender tu impacto en otros y a canalizar tu talento innato hacia máximo potencial",
                "**Comandante (Commander)** - Comparte tu decisión audaz; juntos lideran sin necesidad de consenso",
                "**Catalizador (Catalyst)** - Impulsa iniciativas nuevas; tu confianza proporciona el coraje para intentar lo desconocido",
            ],

            careerApplications: [
                "**Emprendimiento y Startups** - Crear algo de la nada requiere exactamente tu confianza inquebrantable en ti mismo y tu visión",
                "**Ventas a Comisión y Desarrollo de Negocio** - Cierres complejos, prospecting, nuevos mercados requieren tu confianza en tu capacidad de persuasión",
                "**Arte, Música y Atletismo Profesional** - Carreras donde la confianza en tu talento es fundamental para destacar",
                "**Liderazgo Ejecutivo y Transformación** - C-Suite, CEO, roles que requieren tomar decisiones audaces bajo incertidumbre extrema",
                "**Investigación y Exploración Científica** - Avanzar la ciencia requiere confianza en perseguir hipótesis no probadas",
                "**Innovación y Disruption** - Crear nuevas categorías de productos o servicios requiere audacia y convicción",
                "**Inversión y Private Equity** - Evaluación de oportunidades riesgosas requiere confianza en tu juicio ante incertidumbre",
            ],
        },
    },
    {
        strength: "Storyteller",
        nameEs: "Narrador",
        domain: "Motivating",
        briefDefinition:
            "Son maestros de la comunicación. Disfrutan ser anfitriones, hablar en público y ser escuchados. Utilizan historias para conectar, inspirar e influir en otros.",
        details: {
            fullDefinition: `El **Narrador** es mucho más que alguien que habla bien. Es un **tejedor de significado que transforma información en inspiración**.

## El Don de la Narrativa Transformadora

Existen individuos que poseen **el don casi mágico de transformar palabras simples y datos crudos en mundos de significado profundo y emoción**. Esta es la esencia del Narrador: la **maestría refinada para conectar auténticamente, persuadir genuinamente e inspirar profundamente** a través del poder irresistible de la narrativa bien tejida.

El Narrador posee el **don innato de tejer palabras en relatos que resuenan emocionalmente** a nivel visceral con su audiencia. Su mente no solo procesa información de manera transaccional; la **transforma creativamente en anécdotas vividas, metáforas reveladoras y personajes memorables** que dan vida tangible a datos complejos y a ideas abstractas que de otro modo permanecerían frías. Para ellos, una presentación no es simplemente un conjunto de diapositivas proyectadas, sino una **oportunidad sagrada para llevar a las personas en un viaje transformador** que las dejará inspiradas, genuinamente informadas y comprometidas con la causa.

## Constructor de Significado y Propósito

Su valor principal es su capacidad sin igual de **crear significado existencial y propósito compartido**, haciendo que los mensajes sean no solo intelectualmente entendibles, sino también **emocionalmente memorables** e imposibles de olvidar. Las palabras de un Narrador no se olvidan; se graban en la memoria de quienes las escuchan.

## Amplificador de la Visión Organizacional

El Narrador es el **amplificador viviente del equipo y de la organización**, el traductor que convierte las visiones estratégicas abstractas en un lenguaje que todos pueden entender, sentir y adoptar como propio. Son los encargados fundamentales de **construir la cultura organizacional**, de celebrar los éxitos de manera que inspiren a otros a aspirar a más, y de comunicar el "porqué" profundo detrás de cada acción. Su presencia es fundamental para **unir a las personas alrededor de una visión compartida** y para garantizar que la historia que cuenta un equipo o una organización sea una historia digna de ser contada y apasionadamente escuchada.

## Impacto Duradero

Sin Narradores, las organizaciones permanecen como máquinas funcionando sin alma. Con ellos, se convierten en movimientos con propósito.`,

            howToUseMoreEffectively: [
                "**Sé el Portavoz Oficial**: Asume el rol de portavoz del equipo, departamento u organización. Traduce la estrategia compleja y los datos crudos en una narrativa convincente que una a las personas alrededor del propósito.",
                "**Enseña y Alimenta a través de la Narrativa**: Utiliza anécdotas vívidas, metáforas reveladoras y ejemplos memorables para enseñar conceptos complejos, dar feedback transformador y celebrar los éxitos de manera que inspire a otros.",
                "**Construye Cultura Vivida**: Participa activamente en construir la marca, identidad y cultura de la organización a través de una comunicación auténtica, efectiva y emocionalmente resonante.",
                "**Comunica en Múltiples Contextos**: Desde presentaciones ejecutivas hasta all-hands meetings, desde comunicados internos hasta eventos públicos, usa tu don para conectar y mover a audiencias.",
                "**Mentorea en Comunicación Persuasiva**: Enseña a otros cómo contar historias que importan, cómo comunicar visión de manera que inspire acción, y cómo el poder de la narrativa puede multiplicar el impacto de cualquier mensaje.",
            ],

            watchOuts: [
                "**Historias sin Propósito Claro**: Asegúrate de que cada historia que cuentes tenga un propósito y conexión claros con el mensaje que quieres comunicar. Evita historias que entretienen pero no avanzan el objetivo.",
                "**Exageración de la Realidad**: Evita adornar o exagerar los hechos hasta el punto de distorsionar la verdad. Tu poder es transformar la realidad genuina en narrativa inspiradora, no inventar ficción.",
                "**Monopolio del Micrófono**: Tu don para la comunicación es un superpoder, pero no debe eclipsar a otros. Dale espacio generoso a otros para hablar, especialmente a voces menos naturales en público.",
                "**Manipulación Emocional**: Ten cuidado de no usar el poder de la narrativa para manipular emocionalmente hacia fines que no son éticos. La influencia requiere responsabilidad.",
                "**Negligencia del Contenido Sustancial**: No dejes que tu maestría en la forma (storytelling) eclipse el fondo (contenido real). La mejor narrativa envuelve verdades importantes, no sustituye sustancia.",
            ],

            strengthsDynamics: `**Narrador + Estratega**: El Estratega diseña el futuro; el Narrador lo comunica de manera que inspire acción. Visión + narrativa = movimiento inspirado.

**Narrador + Generador de Ideas**: El Generador de Ideas explora posibilidades creativas; el Narrador las convierte en historias que otros quieren seguir. Ideas + narrativa = movimiento de innovación.

**Narrador + Creyente**: El Creyente articula la misión y valores; el Narrador los comunica de manera que resuena emocionalmente. Propósito + narrativa = cultura con alma.

**Narrador + Optimista**: El Optimista ve lo positivo; el Narrador lo amplifica a través de historias de esperanza e inspiración. Positividad + narrativa = contagio inspirador.

**Narrador + Analista**: El Analista proporciona datos verdaderos; el Narrador los transforma en narrativa comprensible. Hechos + narrativa = comunicación que convence cabeza y corazón.`,

            bestPartners: [
                "**Estratega (Strategist)** - Comunica su visión a largo plazo de manera que inspire a la acción colectiva",
                "**Generador de Ideas (Brainstormer)** - Transforma ideas creativas en historias que otros quieren seguir y perseguir",
                "**Creyente (Believer)** - Articula y amplifica la misión y valores para que resuenen emocionalmente en toda la organización",
                "**Analista (Analyst)** - Transforma datos y hechos en narrativas comprensibles e impactantes que evidencian verdades",
                "**Optimista (Optimist)** - Amplifica su positividad a través de historias de éxito y esperanza que contagian a audiencias",
            ],

            careerApplications: [
                "**Comunicación Corporativa y Relaciones Públicas** - Construir narrativas de marca, manejar crisis, contar historias organizacionales",
                "**Marketing y Publicidad** - Crear campañas que resonan emocionalmente y motivan acción a través de narrativa convincente",
                "**Ventas y Presentaciones Complejas** - Transformar propuestas técnicas en historias de valor que cierren deals importantes",
                "**Liderazgo Ejecutivo y Transformación** - CEOs y ejecutivos que necesitan comunicar visión de manera que inspire cambio",
                "**Educación, Enseñanza e Investigación** - Hacer que conceptos complejos sean accesibles y memorables a través de narrativa",
                "**Periodismo, Medios y Contenido** - Contar historias que importan, que informan y que transforman perspectivas",
                "**Política y Activismo Social** - Comunicar visiones de cambio social de manera que movilice acción colectiva",
            ],
        },
    },
    {
        strength: "Winner",
        nameEs: "Ganador",
        domain: "Motivating",
        briefDefinition:
            "Convierten cualquier tarea mundana en un juego o desafío porque el sentimiento de competencia es esencial para ellos. Se sienten perdidos en entornos sin una medida clara de éxito definida.",
        details: {
            fullDefinition: `El **Ganador** es mucho más que alguien que quiere ganar. Es un **motor de excelencia impulsado por competencia que eleva todo lo que toca**.

## La Pasión Visceral por la Competición

En cada competición, en cada desafío, en cada juego existe **alguien para quien solo existe una posición posible: la primera**. Esta es la esencia del Ganador: una **pasión profunda, visceral e instintiva por la competición** que impulsa la excelencia sin compromiso y constantemente redefine los límites de lo posible.

Para el Ganador, el mundo no es un lugar para coexistir pasivamente; es un **campo de juego dinámico** donde el éxito se mide relativamente, en comparación con otros. No se trata de una mentalidad maliciosa o destructiva, sino de un **impulso intrínseco casi biológico por ser el mejor**, por sobresalir, por ganar. La competencia es su combustible vital, el **catalizador que agudiza su enfoque mental**, aumenta exponencialmente su energía y saca a relucir su máximo potencial latente.

## La Victoria como Validación

Para ellos, la victoria no es simplemente un resultado o un número en un tablero; es la **validación existencial de su esfuerzo, su talento y su dedicación**. Transforman cualquier tarea, incluso las más mundanas o rutinarias, en un **desafío emocionante** donde pueden demostrar su superioridad.

## Elevador de Rendimiento Colectivo

El mayor valor del Ganador es su capacidad para **elevar el rendimiento de un equipo completo**. Su mentalidad competitiva innata puede **transformar tareas rutinarias en desafíos emocionantes** que motivan a colegas a alcanzar nuevos niveles de excelencia que ni sabían que eran posibles. Son los que convierten metas abstractas en **objetivos claros, medibles y emocionantes**, y los que nunca se rinden hasta que el marcador final muestre la victoria.

## Impacto en la Cultura

Su presencia es fundamental para impulsar el crecimiento, la innovación y la ambición sana en un entorno de trabajo.`,

            howToUseMoreEffectively: [
                "**Lidera en Contextos Competitivos**: Busca entornos donde la competencia es estructural (ventas, trading, deportes, mercados desafiantes) donde tu instinto competitivo puede prosperar sin fricción cultural.",
                "**Gamifica las Iniciativas**: Transforma tareas individuales o de equipo en desafíos competitivos con métricas claras, rankings y reconocimiento para el ganador. Aumentarás la motivación exponencialmente.",
                "**Canaliza la Competencia Externamente**: Enfoca tu deseo ardiente de ganar contra la competencia externa, contra el mercado, contra objetivos desafiantes, no contra tus propios colegas internamente.",
                "**Establece Métricas Claras**: Trabaja para asegurar que haya medidas de éxito claras, visibles y actualizadas. Necesitas saber constantemente si estás ganando o perdiendo.",
                "**Mentorea en Excelencia Competitiva**: Enseña a otros cómo canalizar el instinto competitivo de manera constructiva, cómo usar la competencia para crecer, y cómo ganar con gracia y humildad.",
            ],

            watchOuts: [
                "**Toxicidad Competitiva Interna**: Evita crear un ambiente de trabajo tóxico donde la competencia interna es tan feroz que destruye la colaboración, la confianza y la cohesión del equipo.",
                "**Pérdida Patológica**: Aprende a perder con elegancia, dignidad y genuina magnanimidad. Los fracasos no son traumas; son **oportunidades cruciales de aprendizaje y crecimiento**.",
                "**Compromiso Ético por Ganar**: No sacrifiques integridad, ética o colaboración genuina por la necesidad obsesiva de ganar a toda costa. El juego limpio es más valioso que la victoria hueca.",
                "**Obsesión con Métricas Externas**: Tu sentido de valor no puede depender completamente de métricas externas y comparaciones con otros. Desarrolla sentido interno de satisfacción.",
                "**Desprecio por Participantes No-Ganadores**: No menosprecies o descartes a colegas cuya fortaleza no es ganar. Cada persona aporta valor diferente; la victoria no es la única medida de valor.",
            ],

            strengthsDynamics: `**Ganador + Comandante**: El Comandante establece metas claras y exigentes; el Ganador las persigue obsesivamente. Dirección clara + impulso competitivo = resultados excepcionales.

**Ganador + Analista**: El Analista proporciona datos y métricas rigurosas para saber exactamente si está ganando o perdiendo. Competencia + medición = mejora continua.

**Ganador + Autoconfiante**: El Autoconfiante confía en ganar; el Ganador lo demuestra repetidamente. Creencia + ejecución = ganador confiable.

**Ganador + Catalizador**: El Catalizador impulsa iniciativas nuevas; el Ganador las ejecuta obsesivamente hacia victoria. Momentum + competencia = dominio.

**Ganador + Optimista**: El Optimista ve posibilidad de ganar; el Ganador la persigue. Esperanza + instinto competitivo = equipo invencible.`,

            bestPartners: [
                "**Analista (Analyst)** - Proporciona datos y métricas rigurosas para saber exactamente si está ganando o perdiendo",
                "**Comandante (Commander)** - Establece metas claras, exigentes y competitivas que canalizan tu instinto competitivo",
                "**Autoconfiante (Self-Believer)** - Comparte tu impulso de ser el mejor y destacar en cualquier contexto",
                "**Catalizador (Catalyst)** - Impulsa iniciativas nuevas que puedas ejecutar competitivamente",
                "**Cumplidor (Deliverer)** - Asegura que la ejecución sea precisa y confiable en tu persecución de la victoria",
            ],

            careerApplications: [
                "**Ventas de Alto Rendimiento y Desarrollo de Negocio** - Cierres complejos, nuevos mercados, objetivos desafiantes requieren tu instinto competitivo incansable",
                "**Deportes Profesionales** - El competencia es estructural; es donde tu naturaleza prospera sin fricción",
                "**Trading e Inversión Financiera** - Mercados donde la victoria se mide diariamente en ganancias y pérdidas",
                "**Litigios Complejos y Abogacía de Defensa** - Ganar casos, defender clientes, vencer oponentes legales requiere tu instinto competitivo",
                "**Liderazgo de Startups en Mercados Competitivos** - Capturar mercado, vencer competencia, crecer exponencialmente requiere tu mentalidad ganadora",
                "**Gestión de Productos en Mercados Competitivos** - Ganar participación de mercado, superar competencia, dominar categorías",
                "**Deportes Corporativos y Bienestar Competitivo** - Eventos, competencias internas, challenges que canalizan tu energía competitiva constructivamente",
            ],
        },
    },
    {
        strength: "Brainstormer",
        nameEs: "Generador de Ideas",
        domain: "Thinking",
        briefDefinition:
            "Se emocionan cuando se les pide que generen ideas sin límites y que conecten lo aparentemente inconexo. Se aburren rápidamente con las prácticas estándar y los procedimientos establecidos.",
        details: {
            fullDefinition: `El **Generador de Ideas** es mucho más que alguien creativo. Es una **máquina insaciable de conexiones mentales** que transforma lo ordinario en extraordinario.

## El Patio de Recreo Mental Sin Límites

Para el Generador de Ideas, la mente es un **patio de recreo infinito y sin restricciones**. Su cerebro está en constante actividad, buscando obsesivamente y **estableciendo vínculos inusuales, inesperados e innovadores** entre conceptos, datos, experiencias y dominios que la mayoría de la gente considera completamente inconexos y desconectados. Su mayor emoción visceral proviene de la **fase inicial exploratoria de un proyecto**, donde las posibilidades parecen infinitas y la imaginación puede volar sin ninguna restricción práctica.

## El Enemigo de la Rutina

La rutina, las prácticas estándar y los procedimientos establecidos son literalmente su **némesis existencial**, ya que limitan drásticamente su capacidad para innovar, para encontrar soluciones frescas no probadas antes, y para explorar territorios mentales inexplorados. Un Generador de Ideas en un entorno demasiado estructurado es como un pájaro con alas cortadas.

## El Motor de la Innovación Organizacional

El mayor valor de un Generador de Ideas es su habilidad casi mágica de ser el **motor incansable de la innovación y la disrupción**. Son los que **rompen audazmente los paradigmas existentes** que otros aceptan como verdad eterna, los que encuentran soluciones geniales donde nadie más siquiera sabía que existía un problema, y los que abren literalmente puertas a nuevas oportunidades y territorios inexplorados.

## Prevención del Estancamiento

Su presencia en un equipo es absolutamente fundamental para **prevenir el estancamiento mental y organizacional**, para desafiar continuamente el *statu quo* cómodo, y para garantizar que la creatividad no sea solo un concepto romántico en un documento de valores, sino una **fuerza viva que impulsa tangiblemente el progreso**.`,

            howToUseMoreEffectively: [
                "**Lidera Sesiones de Ideación Estructurada**: Participa activamente liderando o facilitando sesiones de lluvia de ideas para resolver problemas complejos, crear nuevos productos o reimaginar procesos existentes.",
                "**Mantente en la Vanguardia del Conocimiento**: Dedica tiempo a mantenerte al día de tendencias, innovaciones y desarrollos en múltiples campos y dominios. Tu capacidad de hacer conexiones cruzadas se alimenta de diversidad de entrada.",
                "**Colabora con Pragmáticos**: Asociate estratégicamente con personas pragmáticas, analíticas y orientadas a la ejecución que puedan ayudarte a filtrar críticamente y desarrollar tus mejores ideas hacia realidad.",
                "**Documenta Sistemas de Ideas**: Crea sistemas visuales o documentales para capturar, organizar y revisar tus ideas constantemente. Esto previene pérdida de brillantez y te permite conectar ideas posteriores.",
                "**Mentorea en Pensamiento Divergente**: Enseña a otros cómo pensar divergentemente, cómo hacer conexiones inusuales, cómo desafiar suposiciones, y cómo la creatividad es un skill entrenable, no un don mágico.",
            ],

            watchOuts: [
                "**Síndrome del Salto Constante de Ideas**: Evita el patrón de saltar de una idea prometedora a otra emocionante sin dar tiempo a que ninguna madure, se desarrolle o se implemente. El compromiso temporal con una idea es crucial.",
                "**Evaluación Crítica de Propias Ideas**: Aprende a evaluar tus propias ideas de forma crítica, rigurosa y desapasionada. No todas son oro; algunas son chatarra brillante. Desarrolla filtros de calidad internos.",
                "**Frustración con Limitaciones Prácticas**: Tu frustración con presupuesto limitado, tiempo restringido, o restricciones técnicas es comprensible pero contraproductiva. Aprende a ver las limitaciones como restricciones creativas, no como obstáculos.",
                "**Desconexión de la Ejecución**: No te desconectes completamente del proceso de ejecución. El viaje de la idea a la realidad es donde ocurre el verdadero aprendizaje y refinamiento.",
                "**Negligencia de Implementación Práctica**: Tu brillantez ideativa no debe hacerte ignorar la necesidad de viabilidad, escalabilidad y rentabilidad. Las ideas impracticables son solo fantasía.",
            ],

            strengthsDynamics: `**Generador de Ideas + Experto en Enfoque**: El Experto en Enfoque selecciona tu mejor idea y la ejecuta con precisión inquebrantable. Ideación infinita + dirección enfocada = innovación realizada.

**Generador de Ideas + Cumplidor**: El Cumplidor transforma tu idea brillante en un proyecto real, tangible y entregable. Creatividad + ejecución confiable = producto innovador.

**Generador de Ideas + Estratega**: El Estratega asegura que tus ideas se alineen con la visión a largo plazo y el objetivo estratégico. Creatividad + dirección estratégica = innovación alineada.

**Generador de Ideas + Narrador**: El Narrador transforma tus conceptos abstractos en historias convincentes que otros quieren perseguir. Ideas + narrativa = movimiento inspirado de innovación.

**Generador de Ideas + Catalizador**: El Catalizador da el impulso inicial a tus ideas más prometedoras, rompiéndolas de la fase conceptual hacia movimiento. Ideas + momentum = realización rápida.`,

            bestPartners: [
                "**Experto en Enfoque (Focus Expert)** - Selecciona tu mejor idea y la ejecuta con precisión, evitando dispersión",
                "**Cumplidor (Deliverer)** - Transforma tu idea brillante en proyecto real, tangible y entregable",
                "**Estratega (Strategist)** - Asegura que tus ideas se alineen estratégicamente y tengan potencial de escala",
                "**Narrador (Storyteller)** - Convierte tus conceptos abstractos en narrativas convincentes que movilizan acción",
                "**Catalizador (Catalyst)** - Da impulso inicial a tus ideas, rompiéndolas de la fase conceptual hacia ejecución",
            ],

            careerApplications: [
                "**Publicidad, Creatividad y Diseño** - Agencias creativas requieren constantemente nuevas ideas revolucionarias y campañas innovadoras",
                "**Diseño de Productos e Innovación (I+D)** - Centros de innovación, R&D labs, diseño de nuevos productos requieren tu pensamiento generativo",
                "**Consultoría Estratégica y Transformación** - Ayudar a organizaciones a reinventarse requiere personas que ven soluciones donde otros ven problemas",
                "**Emprendimiento y Startups** - Crear nuevos modelos de negocio, nuevas categorías de productos requiere tu capacidad de conexión cruzada",
                "**Planificación Estratégica y Visión Futura** - Anticipar tendencias, imaginar futuros posibles, diseñar escenarios requiere pensamiento generativo",
                "**Educación e Investigación Académica** - Avanzar el conocimiento, hacer descubrimientos requiere pensamiento creativo sin límites",
                "**Desarrollo de Software y Productos Digitales** - Innovación en apps, plataformas, experiencias digitales requiere generación constante de ideas",
            ],
        },
    },
    {
        strength: "Philomath",
        nameEs: "Filomato",
        domain: "Thinking",
        briefDefinition:
            "Aman aprender. Siguen muchas rutas de interés, exploran nuevas ideas y adquieren la máxima cantidad de conocimiento posible. No disfrutan la compañía de los llamados 'sabelotodos' y de personas con poca curiosidad.",
        details: {
            fullDefinition: `El **Filomato** es mucho más que un aprendiz permanente. Es un **explorador intelectual cuya sed de verdad es insaciable**.

## La Mente que Nunca Deja de Preguntar

Imagina a **alguien cuya mente nunca deja de hacer preguntas profundas**, cuya sed de conocimiento es tan natural y vital como respirar aire. Esta es la esencia del Filomato: una **pasión profunda, visceral e insaciable por el conocimiento** y una **sed constante, casi obsesiva, por la verdad, la comprensión y la maestría**.

El Filomato es un **explorador intelectual compulsivo**, cuyo motor principal de energía es la alegría pura y sin adulteraciones del **aprendizaje, la comprensión y el descubrimiento**. Su mente está siempre activamente en modo de investigación, buscando incansablemente entender el "porqué" profundo de las cosas, cómo realmente funcionan en sus mecanismos internos, y qué misterios existen más allá de la superficie visible.

## La Búsqueda de Comprensión Profunda

No aprenden por obligación, por requisitos externos o por presión; aprenden por el **puro placer casi existencial de la comprensión, la conexión de conceptos y la maestría**. Para ellos, el mundo es un **vasto océano inexplorado de información** que están ansiosamente dispuestos a bucear profundamente para explorar. La inacción mental, el estancamiento intelectual y la ignorancia son sus mayores enemigos existenciales.

## Especialista en Profundidad

El mayor valor de un Filomato es su capacidad para ser el **motor incansable de la especialización, la profundidad y el conocimiento riguroso**. En un equipo, son quienes se sumergen profundamente en los temas complejos, se convierten en verdaderos expertos en sus nichos de especialización, y garantizan que las decisiones organizacionales se basen en una **comprensión sólida, bien informada y fundamentada en evidencia**.

## Guardián del Saber Organizacional

Su presencia es absolutamente fundamental para impulsar **innovación basada en comprensión** y para la **mejora continua estructurada**, ya que siempre están vigilantemente a la vanguardia de las nuevas ideas, tecnologías emergentes y tendencias del mercado. Son los **guardianes del saber organizacional**, asegurando que el equipo no solo actúe por impulso, sino que lo haga con **inteligencia rigurosa y contexto profundo**.`,

            howToUseMoreEffectively: [
                "**Busca Roles de Especialización Profunda**: Asume roles que requieran investigación rigurosa, aprendizaje continuo y desarrollo de expertise profunda. Tu capacidad de bucear intelectualmente es exactamente lo que estos roles necesitan.",
                "**Conviértete en Experto Residente**: Desarrolla expertise profunda en un tema específico relevante para tu organización y asume activamente el rol de especialista residente. Tu conocimiento es un asset competitivo.",
                "**Mantén Vanguardia del Conocimiento**: Dedica tiempo a mantenerte actualizado sobre nuevas tecnologías, metodologías emergentes, tendencias de mercado y desarrollos científicos. Sé los ojos y oídos del equipo.",
                "**Comunica Conocimiento Efectivamente**: Traduce tu expertise profunda en enseñanza, documentación y comunicación que otros pueden comprender y aplicar. El conocimiento no compartido es conocimiento desperdiciado.",
                "**Mentorea en Pensamiento Riguroso**: Enseña a otros cómo investigar profundamente, cómo hacer preguntas mejores, y cómo fundamentar decisiones en comprensión sólida en lugar de suposiciones.",
            ],

            watchOuts: [
                "**Parálisis Analítica del Aprendizaje**: Evita quedarte atrapado indefinidamente en la fase de aprendizaje y investigación sin nunca pasar a la aplicación práctica, a la toma de decisión o a la acción. El aprendizaje sin aplicación es teoría estéril.",
                "**Sobrecarga Informativa**: No abrumes a colegas con detalles excesivos, información irrelevante o tangentes académicas que oscurecen el mensaje central. Aprende a filtrar y comunicar solo lo esencial.",
                "**Perfeccionismo del Conocimiento**: Acepta que no siempre es posible, práctica o necesario saberlo absolutamente todo antes de tomar una decisión. La certeza del 80% aplicada es mejor que la certeza del 100% nunca implementada.",
                "**Aislamiento Intelectual**: Tu inmersión en aprendizaje profundo no debe aislarte de la colaboración con otros. El conocimiento más rico surge en la conversación interdisciplinaria.",
                "**Menosprecio por Ignorancia Ajena**: No menosprecies a aquellos que no comparten tu sed de conocimiento. Las personas tienen diferentes fortalezas y valores; la curiosidad intelectual no es superior a otros tipos de valor.",
            ],

            strengthsDynamics: `**Filomato + Analista**: El Analista interpreta datos; el Filomato proporciona contexto y conocimiento profundo. Análisis + contexto histórico = comprensión completa.

**Filomato + Estratega**: El Estratega diseña el futuro; el Filomato entiende completamente el paisaje competitivo y tecnológico. Visión + conocimiento profundo = estrategia informada.

**Filomato + Narrador**: El Narrador comunica; el Filomato proporciona contenido sustancial y verdadero. Contenido + comunicación excelente = mensaje poderoso.

**Filomato + Cumplidor**: El Cumplidor implementa; el Filomato asegura que la implementación se base en comprensión sólida, no en suposiciones. Acción informada + ejecución confiable = resultados inteligentes.

**Filomato + Entrenador**: El Entrenador desarrolla personas; el Filomato desarrolla su propio pensamiento y el de otros. Aprendizaje personal + desarrollo de otros = crecimiento exponencial.`,

            bestPartners: [
                "**Narrador (Storyteller)** - Ayuda a comunicar tu conocimiento profundo de manera que resuena y es memorable para otros",
                "**Cumplidor (Deliverer)** - Te ayuda a aplicar tu conocimiento en proyectos concretos y tangibles",
                "**Catalizador (Catalyst)** - Te impulsa a poner en práctica lo que has aprendido en lugar de solo acumular conocimiento",
                "**Estratega (Strategist)** - Te ayuda a enmarcar tu especialización dentro de una visión estratégica más amplia",
                "**Analista (Analyst)** - Complementa tu búsqueda de verdad con rigor metodológico y análisis de datos",
            ],

            careerApplications: [
                "**Investigación Académica y Científica** - Avanzar el conocimiento humano requiere exactamente tu sed insaciable de comprensión profunda",
                "**Desarrollo de Software, Arquitectura de Sistemas** - Entender sistemas complejos, nuevas tecnologías y paradigmas requiere tu profundidad intelectual",
                "**Consultoría Especializada de Alto Nivel** - Asesorar ejecutivos en decisiones complejas requiere expertise profunda y pensamiento riguroso",
                "**Periodismo de Investigación y Documentales** - Investigar historias complejas, entender contextos profundos requiere tu capacidad de aprendizaje",
                "**Investigación y Desarrollo Corporativo** - Innovación basada en comprensión profunda de tecnologías emergentes y mercados",
                "**Educación Superior y Docencia** - Enseñar a nivel universitario, desarrollar currículos, mentorear investigadores",
                "**Análisis Estratégico y Inteligencia de Mercado** - Entender panoramas competitivos complejos, tendencias y disrupciones futuras",
            ],
        },
    },
    {
        strength: "Strategist",
        nameEs: "Estratega",
        domain: "Thinking",
        briefDefinition:
            "Miran el panorama general, lo que les permite identificar fácilmente patrones en medio de la complejidad. Disfrutan conectar los puntos y trazar el mejor camino hacia un futuro deseado.",
        details: {
            fullDefinition: `El **Estratega** es mucho más que un planificador. Es un **arquitecto visionario de futuros posibles** que ve el sistema completo cuando otros ven solo fragmentos.

## La Visión Que Trasciende el Ruido

En medio del caos, la complejidad y el ruido constante de cualquier organización, encontrarás a **alguien extraordinariamente capaz de elevarse por encima del tumulto diario** para ver el **mapa completo e integrado**. Esta es la naturaleza del Estratega: la **habilidad visionaria casi sobrenatural para ver sistemas complejos como un todo coherente** y para trazar con claridad el camino óptimo a largo plazo incluso en medio de la incertidumbre radical.

El Estratega posee una perspectiva única y privilegiada que le permite **elevarse sistemáticamente por encima del caos reactivo** para ver el panorama completo del juego competitivo. Su mente está constantemente activa **conectando puntos dispersos, identificando patrones sistémicos y anticipando futuros posibles** con una precisión que sorprende a otros. No se limitan a reaccionar defensivamente ante el presente que imponen otros; se dedican obsesivamente a **diseñar proactivamente el futuro que desean ver creado**.

## El Arte de Evitar Problemas

Para ellos, el verdadero arte estratégico no está en resolver el siguiente problema táctico, sino en **crear un plan sistémico que evite inteligentemente que esos problemas ocurran** en primer lugar. Ven varios pasos adelante.

## Arquitecto de la Dirección Organizacional

El mayor valor de un Estratega es su capacidad casi única para ser el **arquitecto viviente de la visión, dirección y destino** de una organización. Son los que **transforman ideas vagas en hojas de ruta claras y secuenciadas**, los que **convierten la incertidumbre aterradora en un plan de acción coherente**, y los que **aseguran que cada movimiento del equipo sirva a un propósito mayor integrado**.

## Prevención de Dispersión Energética

Su presencia es absolutamente fundamental para **garantizar que la energía limitada y el esfuerzo precioso de un equipo no se desperdicien en tareas sin rumbo o en direcciones contradictorias**, sino que se dirijan enfocadamente **hacia una meta clara, convincente y alcanzable**. Son los faros que dan dirección en la niebla.`,

            howToUseMoreEffectively: [
                "**Define Visión Clara y Hoja de Ruta**: Asume el rol de definir estrategia clara para tu equipo u organización. Articula una visión convincente y crea una hoja de ruta secuenciada que integre múltiples iniciativas.",
                "**Anticipa Futuro, No Solo Reacciones**: Ante cada problema, tómate tiempo estratégico para ver más allá de la solución inmediata táctica. Anticipa futuras consecuencias e impactos sistémicos de cada decisión.",
                "**Simplifica Complejidad para Otros**: Tu capacidad de ver sistemas complejos como coherentes es un superpoder. Simplifica para otros la complejidad, mostrando claramente el camino a seguir y cómo cada acción contribuye.",
                "**Valida Estrategia con Datos**: Trabaja con Analistas para asegurar que tu visión estratégica está fundamentada en datos reales, no en suposiciones. La mejor estrategia es una que es tanto visionaria como realista.",
                "**Mentorea en Pensamiento Sistémico**: Enseña a otros cómo ver sistemas complejos, cómo conectar puntos, y cómo pensar en múltiples horizontes de tiempo simultáneamente. El pensamiento estratégico es entrenable.",
            ],

            watchOuts: [
                "**Planes Demasiado Abstractos**: Evita que tus planes estratégicos sean tan abstractos, vistos desde tan alto o a tan largo plazo que el equipo no sepa realísticamente cómo empezar mañana o esta semana. Estrategia debe ser inspiradora pero accionable.",
                "**Negligencia de Detalles de Ejecución**: No ignores o menosprecies los detalles importantes de la ejecución táctica. Una estrategia brillante sin ejecución es inútil. Colabora estrechamente con ejecutores.",
                "**Rigidez ante Cambio Contextual**: Sé flexible y adapta tu estrategia inteligentemente cuando las circunstancias cambien, cuando nuevas información emerge, o cuando el mercado pivota. La estrategia no es dogma; es dirección viva.",
                "**Desconexión de Realidad Operacional**: Tu visión futura no debe alejarte de la realidad presente de lo que el equipo está experimentando. Mantén los pies en la tierra incluso con la vista en el horizonte.",
                "**Aislamiento de Perspectivas Diversas**: Tu visión sistémica no debe hacerte rechazar perspectivas diferentes. Las mejores estrategias emergen de la integración de múltiples viewpoints y experiencias.",
            ],

            strengthsDynamics: `**Estratega + Cumplidor**: El Cumplidor ejecuta el plan estratégico con fiabilidad inquebrantable. Visión + ejecución confiable = resultados estratégicos sostenibles.

**Estratega + Analista**: El Analista valida y refina la estrategia con datos. Visión + evidencia = estrategia fundamentada.

**Estratega + Narrador**: El Narrador comunica la visión estratégica de manera que inspire acción colectiva. Visión + narrativa = movimiento estratégico inspirado.

**Estratega + Generador de Ideas**: El Generador de Ideas explora posibilidades creativas; el Estratega las integra en un plan coherente. Creatividad + coherencia sistémica = innovación estratégica.

**Estratega + Catalizador**: El Catalizador impulsa la acción inicial; el Estratega asegura que esa energía fluya hacia el rumbo correcto. Momentum + dirección = avance estratégico.`,

            bestPartners: [
                "**Cumplidor (Deliverer)** - Ejecuta tu plan estratégico con la precisión y fiabilidad que la ejecución requiere",
                "**Analista (Analyst)** - Proporciona datos rigurosos que validan, refinan y fundamentan tu estrategia",
                "**Narrador (Storyteller)** - Comunica tu visión estratégica de manera inspiradora que moviliza acción colectiva",
                "**Generador de Ideas (Brainstormer)** - Aporta creatividad e innovación a tu marco estratégico",
                "**Catalizador (Catalyst)** - Impulsa la iniciación de tu plan estratégico con energía y movimiento",
            ],

            careerApplications: [
                "**Liderazgo Ejecutivo y Dirección General** - CEO, Presidents, roles ejecutivos donde la visión estratégica define la trayectoria organizacional",
                "**Planificación Estratégica Corporativa** - Chief Strategy Officer, estrategia de empresa, fusiones y adquisiciones",
                "**Consultoría de Gestión y Estrategia** - Asesorar a organizaciones en transformación estratégica, reposicionamiento, innovación",
                "**Planificación Militar y Defensa** - Estrategia militar, defensa nacional requiere pensamiento estratégico de múltiples horizontes",
                "**Planificación Urbana y Desarrollo** - Visualizar ciudades futuras, planificación a décadas, impacto sistémico",
                "**Dirección de Campañas Políticas y Movimientos Sociales** - Estrategia a gran escala, visión política, movimiento de masas",
                "**Dirección de Transformación Digital y Innovación** - Reimaginar modelos de negocio, transformaciones digitales requieren pensamiento estratégico",
            ],
        },
    },
    {
        strength: "Thinker",
        nameEs: "Pensador",
        domain: "Thinking",
        briefDefinition:
            "Disfrutan de la actividad mental intensa y de las conversaciones significativas y reflexivas. Encuentran dificultad en trabajar en equipos que actúan antes de pensar.",
        details: {
            fullDefinition: `El **Pensador** es mucho más que alguien que piensa. Es un **navegador profundo del reino intelectual** que encuentra energía y propósito en la reflexión.

## El Mundo Interno de Profundidad

Existe un tipo especial de mente que **se nutre genuinamente del silencio contemplativo, prospera en la reflexión sostenida y encuentra energía vital en la profundidad del pensamiento**. Esta es la esencia del Pensador: una **pasión profunda y visceral por la actividad mental intensa** y una búsqueda incansable de significado, comprensión y coherencia a través del análisis riguroso.

Para un Pensador, la mente es un **mundo vasto, infinito y fascinante** por explorar. Se siente genuinamente energizado por la **introspección sostenida, las conversaciones profundas y significativas, y el tiempo valioso a solas** para meditar reflexivamente sobre ideas complejas, paradójicas y multifacéticas. No se contenta nunca con la superficie visible de las cosas; su mayor satisfacción profunda proviene de **desentrañar los matices ocultos, encontrar la coherencia subyacente y llegar a sus propias conclusiones bien fundamentadas** que pueden defender intelectualmente.

## El Valor del Silencio Reflexivo

Valoran el silencio contemplativo y la concentración profunda como **herramientas esenciales y no negociables** para su trabajo mental, ya que es precisamente ahí, en ese espacio protegido de silencio, donde se encuentran sus mejores ideas, sus intuiciones más profundas y sus comprensiones más transformadoras.

## La Voz de la Profundidad

El mayor valor de un Pensador es su capacidad para ser la **voz de la profundidad, la reflexión y la complejidad** en cualquier equipo u organización que tiendan hacia la acción superficial. Son quienes **detienen respetuosamente la prisa precipitada** para preguntar el "porqué" fundamental, quienes **ofrecen perspectivas matizadas que otros han pasado desapercibidamente por alto**, y quienes **elevan consistentemente el nivel de las conversaciones más allá de lo superficial y transaccional**.

## Garantía de Comprensión

Su presencia es fundamental para **garantizar que un equipo no solo actúe reactivamente, sino que lo haga con una comprensión profunda y un propósito claro que puede articular**.`,

            howToUseMoreEffectively: [
                "**Protege Tiempo para Pensamiento Profundo**: Bloquea tiempo deliberado e inviolable en tu agenda para pensar sin interrupciones constantes. La reflexión profunda es tu forma de trabajo; no es lujo sino necesidad.",
                "**Sé la Voz Reflexiva del Equipo**: Asume activamente el rol de ofrecer perspectivas profundas, preguntas incómodas y reflexiones que otros han pasado por alto en su prisa por actuar. Tu pausa reflexiva agrega valor.",
                "**Documenta y Comunica Pensamiento**: Escribe tus reflexiones, análisis y conclusiones para clarificar tus propias ideas y para compartirlas de manera estructurada y comunicable con los demás. El pensamiento documentado es pensamiento multiplicado.",
                "**Facilita Conversaciones Profundas**: Crea espacios seguros para que otros piensen profundamente también. Haz preguntas que inviten reflexión. Tu capacidad de pensar profundamente puede contagiar a otros.",
                "**Mentorea en Pensamiento Crítico**: Enseña a otros cómo pensar profundamente, cómo hacer preguntas mejores, cómo ver múltiples perspectivas de un asunto, y cómo llegar a conclusiones bien razonadas.",
            ],

            watchOuts: [
                "**Aislamiento Intelectual**: Evita quedarte aislado intelectualmente en tu mundo interior o parecer distante emocionalmente. Comparte activamente tus pensamientos y reflexiones con el equipo; el pensamiento solitario pierde potencia.",
                "**Parálisis por Reflexión Excesiva**: No caigas en la trampa de pensar demasiado, analizando cada ángulo hasta la parálisis. A veces, es necesario actuar con información incompleta y reflexionar después, aprendiendo en el camino.",
                "**Desconexión de Pragmatismo**: Tu reflexión profunda no debe desconectarte completamente de la realidad práctica y las limitaciones operacionales. La mejor reflexión es aquella que genera insights accionables.",
                "**Impaciencia con Pensadores No-Reflexivos**: Ten paciencia genuina con las personas que son más orientadas a la acción, más pragmáticas y menos dadas a la reflexión profunda. Diferentes mentes tienen diferentes fortalezas.",
                "**Comunicación Demasiado Compleja**: Tu pensamiento profundo puede expresarse de manera tan compleja que otros no pueden seguirte. Aprende a comunicar ideas profundas de manera clara y accesible.",
            ],

            strengthsDynamics: `**Pensador + Catalizador**: El Catalizador te empuja a convertir tus pensamientos en acción. Reflexión + momentum = pensamiento implementado.

**Pensador + Generador de Ideas**: El Generador de Ideas explora posibilidades; tu reflexión profunda las valida y las hace coherentes. Creatividad + reflexión = innovación fundamentada.

**Pensador + Narrador**: El Narrador comunica tus ideas complejas de manera que otros pueden entender y seguir. Profundidad + comunicación = influencia intelectual.

**Pensador + Empatizador**: El Empatizador entiende el contexto humano; tú proporcionas reflexión profunda. Comprensión + pensamiento = sabiduría integrada.

**Pensador + Estratega**: El Estratega diseña el futuro; tu reflexión profunda lo hace más sólido y considerado. Visión + reflexión = estrategia de calidad.`,

            bestPartners: [
                "**Catalizador (Catalyst)** - Te empuja a convertir tus pensamientos y reflexiones en acción y movimiento",
                "**Narrador (Storyteller)** - Comunica tus ideas profundas y complejas de manera clara que otros pueden comprender",
                "**Generador de Ideas (Brainstormer)** - Aporta creatividad que tú validas y haces coherente a través de reflexión",
                "**Empatizador (Empathizer)** - Mantiene contigo conversaciones profundas y significativas que alimentan tu pensamiento",
                "**Estratega (Strategist)** - Comprende la importancia de tu reflexión profunda para fundamentar la dirección estratégica",
            ],

            careerApplications: [
                "**Filosofía, Literatura y Escritura** - Exploración de ideas, significado, propósito a través de escritura y análisis profundo",
                "**Academia y Investigación** - Investigación intelectual rigurosa, docencia, desarrollo teórico de campos del conocimiento",
                "**Planificación Estratégica y Think Tanks** - Instituciones dedicadas a la reflexión profunda sobre política, sociedad, futuro",
                "**Psicoterapia, Consejería y Análisis** - Exploración profunda de la psiquis humana, acompañamiento reflexivo del crecimiento",
                "**Diseño de Sistemas Complejos y Arquitectura de Software** - Diseño de algoritmos, arquitecturas, sistemas requiere pensamiento profundo",
                "**Periodismo Investigativo y Análisis Político** - Investigar profundamente, analizar sistemas complejos, comunicar insights",
                "**Consultoría Filosófica y Ética Empresarial** - Ayudar a organizaciones a reflexionar sobre valores, propósito y ética",
            ],
        },
    },
    {
        strength: "Peace Keeper",
        nameEs: "Pacificador",
        domain: "Feeling",
        briefDefinition:
            "Buscan la armonía y la resolución pacífica de conflictos. Se enfocan en encontrar terrenos comunes, unir a las personas y crear entornos de colaboración, respeto y entendimiento mutuo.",
        details: {
            fullDefinition: `El **Pacificador** es mucho más que alguien que evita conflictos. Es un **orquestador consciente de la armonía humana**, alguien cuya energía se activa cuando logra transformar tensiones en entendimiento y diferencias en acuerdos sostenibles.

## La Sensibilidad al Clima Humano

Existe un tipo de persona que **percibe el clima emocional de un grupo con una precisión casi invisible**. Donde otros solo ven discusiones o desacuerdos, el Pacificador detecta fricciones latentes, malentendidos no expresados y tensiones que, si no se atienden, pueden erosionar al equipo desde dentro. Esta sensibilidad no es casual: es una **atención profunda a las dinámicas humanas y relacionales**.

El Pacificador siente un llamado interno a restaurar el equilibrio. No porque tema el conflicto, sino porque **comprende profundamente su costo emocional, relacional y productivo** cuando no se gestiona con conciencia.

## El Arte de Construir Puentes

El Pacificador posee una habilidad natural para **encontrar puntos de conexión incluso entre posturas aparentemente opuestas**. Escucha activamente, valida perspectivas diversas y busca patrones de acuerdo donde otros solo ven diferencias. Su talento no está en imponer soluciones, sino en **facilitar conversaciones donde las personas se sienten vistas, escuchadas y respetadas**.

En su mejor versión, actúa como un **puente vivo entre ideas, egos y emociones**, permitiendo que la colaboración emerja sin forzarla.

## Guardián del Clima Emocional

El mayor valor del Pacificador es su rol como **guardián del clima emocional del equipo**. Asegura que las discusiones sean constructivas y no destructivas, que los desacuerdos no se conviertan en divisiones personales, y que las decisiones se sostengan en el compromiso genuino y no en la imposición.

Su presencia crea **entornos psicológicamente seguros**, donde las personas se atreven a opinar, disentir y colaborar sin miedo, lo que fortalece la confianza y la cohesión a largo plazo.

## Armonía como Estrategia

El Pacificador entiende que la armonía no es debilidad ni pasividad. Es una **estrategia relacional consciente** que permite que los equipos mantengan el enfoque en sus objetivos, en lugar de desgastarse en conflictos internos innecesarios. Cuando este talento se usa con madurez, la armonía se convierte en un **acelerador silencioso del rendimiento colectivo**.`,
            howToUseMoreEffectively: [
                "**Asume el Rol de Mediador Consciente**: Intervén activamente en conflictos del equipo para facilitar conversaciones honestas y soluciones de beneficio mutuo.",
                "**Crea Espacios de Diálogo Seguro**: Diseña momentos donde todas las voces puedan expresarse sin interrupciones ni juicios. La armonía se construye, no aparece sola.",
                "**Practica el Consenso Informado**: Ayuda al equipo a llegar a acuerdos donde todos entiendan el porqué de la decisión, incluso si no es su opción preferida.",
                "**Traduce Emociones en Acuerdos**: Ayuda a transformar emociones difusas en acuerdos claros y acciones concretas.",
                "**Facilita Retroalimentación Colectiva**: Promueve círculos de feedback donde el aprendizaje colectivo fortalezca las relaciones.",
            ],
            watchOuts: [
                "**Evasión de Conflictos Necesarios**: No todo conflicto debe suavizarse. Algunos desacuerdos requieren ser abordados de frente para permitir el crecimiento.",
                "**Armonía Superficial**: Evita priorizar la paz aparente sobre la resolución real de problemas estructurales o emocionales.",
                "**Dilución de Postura Propia**: No sacrifiques constantemente tu opinión para mantener el equilibrio. Tu voz también importa.",
                "**Decisiones Lentas por Consenso Excesivo**: Buscar acuerdo total puede frenar la acción cuando se requiere decisión rápida.",
                "**Percepción de Falta de Firmeza**: Asegúrate de que tu estilo conciliador no sea interpretado como indecisión o falta de criterio.",
            ],
            strengthsDynamics: `**Pacificador + Comandante**: El Comandante aporta claridad y decisión; tú aseguras que esa firmeza no fracture al equipo. Decisión + armonía = liderazgo sostenible.

**Pacificador + Empatizador**: Juntos comprenden profundamente las emociones y las transforman en acuerdos saludables. Empatía + conciliación = cohesión profunda.

**Pacificador + Estratega**: El Estratega define el rumbo; tú alineas al equipo detrás de la visión. Visión + consenso = ejecución comprometida.

**Pacificador + Ganador**: El Ganador impulsa el logro; tú recuerdas que la colaboración interna es clave para ganar externamente. Resultado + relación = éxito duradero.

**Pacificador + Catalizador**: El Catalizador genera movimiento; tú reduces fricciones que podrían sabotear ese impulso. Acción + armonía = progreso fluido.`,
            bestPartners: [
                "**Comandante (Commander)** - Aporta decisión y claridad que tú equilibras con consenso y cuidado relacional",
                "**Empatizador (Empathizer)** - Comparte contigo la sensibilidad emocional necesaria para sostener entornos sanos",
                "**Estratega (Strategist)** - Valora tu capacidad para alinear personas detrás de una visión clara",
                "**Ganador (Winner)** - Te recuerda la importancia del resultado mientras tú cuidas la cohesión interna",
                "**Catalizador (Catalyst)** - Aporta velocidad que tú ayudas a canalizar sin generar fricción innecesaria",
            ],
            careerApplications: [
                "**Mediación y Resolución de Conflictos** - Facilitación de acuerdos entre personas, equipos u organizaciones",
                "**Recursos Humanos y Desarrollo Organizacional** - Construcción de culturas colaborativas y saludables",
                "**Diplomacia y Relaciones Institucionales** - Gestión de intereses diversos con tacto y equilibrio",
                "**Liderazgo de Equipos Colaborativos** - Coordinación de personas con perfiles y opiniones diversas",
                "**Gestión de Alianzas y Comunidades** - Sostener relaciones de largo plazo basadas en confianza mutua",
                "**Educación y Facilitación de Grupos** - Crear entornos de aprendizaje seguros y participativos",
            ],
        },
    }

]
