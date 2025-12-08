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
            fullDefinition: `El "Cumplidor" es una fortaleza que va mucho más allá de simplemente hacer lo que se dice. Representa la esencia misma de la **fiabilidad inquebrantable**.

Para un Cumplidor, su palabra no es solo una declaración; es un **contrato personal de honor**. Sienten una profunda y visceral responsabilidad por cada compromiso que asumen, ya sea grande o pequeño. Esta fortaleza no se trata solo de la acción de completar una tarea, sino de la **integridad** que se construye a través de una reputación de confianza. Ven cada promesa cumplida como un ladrillo que edifica su carácter y su relación con los demás.

Su motivación principal es mantener esa integridad. La idea de fallar en un compromiso, ya sea propio o ajeno, les genera una profunda incomodidad y frustración. Por eso, actúan como el ancla de un equipo, la persona en la que todos pueden confiar para que las cosas se hagan, y los plazos se respeten. Son el motor que transforma ideas en realidad tangible y resultados concretos.

En su máxima expresión, un Cumplidor no solo cumple sus promesas, sino que también inspira a otros a hacer lo mismo. Son modelos a seguir en cuanto a responsabilidad, elevando el estándar de compromiso y ética en su entorno.`,
            howToUseMoreEffectively: [
                "Usa tu fiabilidad para liderar proyectos críticos y asegurar que los plazos se cumplan sin excepción.",
                "Comunica proactivamente tu capacidad y tus límites para que los demás sepan qué esperar de ti.",
                "Sé un modelo a seguir en cuanto a responsabilidad, inspirando a otros a cumplir sus propias promesas y elevando el estándar del equipo.",
            ],
            watchOuts: [
                "Evita comprometerte en exceso; tu deseo de cumplir puede llevarte a la sobrecarga y al agotamiento.",
                "No asumas la responsabilidad de otros que no cumplen; aprende a delegar y a exigir rendición de cuentas.",
                "Cuidado con la frustración extrema cuando otros no comparten tu mismo nivel de compromiso.",
            ],
            strengthsDynamics:
                "Se complementa perfectamente con el 'Estratega', que define el rumbo mientras el Cumplidor asegura la llegada. Con el 'Catalizador', transforman el impulso inicial en resultados tangibles y sostenibles. Aportan la ejecución al 'porqué' del 'Creyente'.",
            bestPartners: [
                "Estrategas (Strategists) (para asegurar que la ejecución se alinee con una visión clara)",
                "Generadores de Ideas (Brainstormers) (para convertir conceptos creativos en proyectos realizados)",
                "Comandantes (Commanders) (que valoran la acción y la responsabilidad directa)",
            ],
            careerApplications: [
                "Gestión de proyectos y operaciones",
                "Roles de cumplimiento (compliance) y auditoría",
                "Administración y coordinación de equipos",
                "Logística y cadena de suministro",
            ],
        },
    },
    {
        strength: "Focus Expert",
        nameEs: "Experto en Enfoque",
        domain: "Doing",
        briefDefinition:
            "Las personas con esta fortaleza son expertas en establecer y mantener la concentración en una dirección u objetivo específico, evitando distracciones para lograr resultados.",
        details: {
            fullDefinition: `La fortaleza de "Experto en Enfoque" es mucho más que la simple concentración. Es la **habilidad maestra de la intención y la dirección**.

Para un Experto en Enfoque, la meta no es solo un punto final, es el centro de su universo. Su mente es como un **rayo láser**, capaz de cortar a través del ruido y las distracciones para iluminar el camino más directo hacia un objetivo. Poseen un **radar interno** que detecta y elimina todo lo que no sea esencial. No se sienten abrumados por la información o las opciones, ya que saben instintivamente cómo priorizar y canalizar su energía.

Esta fortaleza se manifiesta en su capacidad para actuar como el **faro del equipo**, recordándoles a todos el propósito central y corrigiendo el rumbo cuando la atención se dispersa. Su valor principal es su capacidad para **traducir la visión en acción sostenida**, asegurando que el impulso inicial se mantenga hasta que se logre el resultado. Se sienten en su elemento cuando tienen un objetivo claro y tangible, lo que les permite desatar todo su potencial. Son la fuerza que convierte los planes en realidades, los sueños en proyectos terminados y las ideas en logros concretos.`,
            howToUseMoreEffectively: [
                "1. Ayuda a tu equipo a definir y visualizar la meta más importante en cada proyecto.",
                "2. Utiliza herramientas (listas, tableros Kanban) para mantener las prioridades visibles y eliminar tareas no esenciales.",
                "3. En reuniones, redirige la conversación amablemente hacia el objetivo principal cuando la discusión se desvíe.",
            ],
            watchOuts: [
                "• Evita la visión de túnel; no te cierres a nueva información u oportunidades que puedan surgir.",
                "• Ten paciencia con aquellos que necesitan explorar varias ideas antes de centrarse en una.",
                "• Cuidado con la frustración cuando las prioridades cambian de forma inesperada; practica la flexibilidad.",
            ],
            strengthsDynamics:
                "Funciona muy bien con el 'Generador de Ideas', ya que el Experto en Enfoque puede seleccionar la idea más viable y llevarla a término. Con el 'Camaleón', que prospera en el cambio, aporta un ancla de estabilidad y dirección. Equilibra al 'Pacificador', asegurando que la búsqueda de armonía no desvíe del objetivo.",
            bestPartners: [
                "Generadores de Ideas (Brainstormers) (para filtrar y ejecutar las mejores ideas)",
                "Estrategas (Strategists) (para desglosar la visión a largo plazo en objetivos concretos)",
                "Catalizadores (Catalysts) (para dirigir su energía inicial hacia un fin productivo)",
            ],
            careerApplications: [
                "Desarrollo de software (con metodologías ágiles)",
                "Control de tráfico aéreo o roles que exigen alta concentración",
                "Cirugía y especialidades médicas",
                "Análisis financiero y de inversiones",
            ],
        },
    },
    {
        strength: "Problem Solver",
        nameEs: "Solucionador de Problemas",
        domain: "Doing",
        briefDefinition:
            "Les encanta encontrar errores, descubrir fallas, diagnosticar problemas y encontrar soluciones. Les resulta difícil barrer los problemas debajo de la alfombra y seguir adelante.",
        details: {
            fullDefinition: `Imagina a alguien que **ve cada obstáculo como una oportunidad de mejora**. Esta es la esencia del "Solucionador de Problemas", una mentalidad intrínseca de **investigación y mejora continua** que trasciende la simple capacidad de resolver dificultades.

El Solucionador de Problemas es un **detective nato de la ineficiencia**. Su cerebro está diseñado para identificar inconsistencias, fallos y áreas de fricción que otros podrían pasar por alto. No se sienten intimidados por la complejidad; de hecho, se sienten atraídos por ella. Para ellos, un problema no es un obstáculo, sino un **rompecabezas desafiante** que no descansa hasta resolver. Sienten una satisfacción profunda al desarmar una situación complicada para entender su **causa raíz** y proponer una solución que no solo arregle el síntoma, sino que prevenga futuras reincidencias.

Su valor principal es su **incapacidad para ignorar lo roto o lo que no funciona**. No pueden "barrer los problemas debajo de la alfombra". Su presencia en un equipo es invaluable, ya que garantizan que los fallos no se ignoren, sino que se enfrenten de frente. Son los guardianes de la eficiencia y la calidad, siempre buscando formas de hacer las cosas mejor, más fluidas y más duraderas.`,
            howToUseMoreEffectively: [
                "1. Asume roles donde la mejora continua y la resolución de incidencias sean clave.",
                "2. Enseña a otros tu metodología para diagnosticar problemas, creando una cultura proactiva.",
                "3. Enfócate no solo en identificar el problema, sino también en implementar y verificar la solución.",
            ],
            watchOuts: [
                "• Evita centrarte únicamente en lo negativo; reconoce y celebra también lo que funciona bien.",
                "• No busques problemas donde no los hay; a veces 'suficientemente bueno' es la respuesta correcta.",
                "• Comunica tus hallazgos de forma constructiva, sin que parezca una crítica constante hacia los demás.",
            ],
            strengthsDynamics:
                "Se asocia eficazmente con el 'Optimista', quien aporta una perspectiva positiva mientras el Solucionador de Problemas se encarga de la parte difícil. Con el 'Cumplidor', garantiza que las soluciones no solo se diseñen, sino que se implementen de manera fiable. Aporta pragmatismo a las grandes ideas del 'Estratega'.",
            bestPartners: [
                "Optimistas (Optimists) (para equilibrar el enfoque en problemas con una visión positiva)",
                "Cumplidores (Deliverers) (para implementar las soluciones de manera efectiva)",
                "Analistas (Analysts) (para usar datos que validen la causa raíz del problema)",
            ],
            careerApplications: [
                "Ingeniería y control de calidad (QA)",
                "Soporte técnico y atención al cliente (Nivel 2-3)",
                "Consultoría de gestión y procesos",
                "Medicina diagnóstica y epidemiología",
            ],
        },
    },
    {
        strength: "Time Keeper",
        nameEs: "Guardián del Tiempo",
        domain: "Doing",
        briefDefinition:
            "Son eficientes y puntuales, y se aseguran de que las cosas se hagan a tiempo. Valoran la puntualidad y la gestión eficaz del tiempo para cumplir con los plazos y los objetivos.",
        details: {
            fullDefinition: `Cuando observas a alguien que **respeta profundamente cada minuto que pasa**, estás viendo la esencia del "Guardián del Tiempo", una comprensión intrínseca de que **el tiempo es el recurso más valioso y no renovable**.

El Guardián del Tiempo posee un **reloj interno infalible** que le permite planificar y estructurar su vida y la de su equipo en torno a la eficiencia. No se trata solo de llegar a tiempo, sino de honrar y respetar cada minuto. Ven los plazos no como presiones, sino como **guías esenciales** para lograr sus objetivos. Se destacan en la capacidad de desglosar proyectos complejos en tareas manejables con cronogramas realistas, asegurando que el impulso se mantenga y que los hitos se cumplan.

Su valor principal es su habilidad para **traducir la visión en un plan de acción viable**. Son los arquitectos del cronograma, los que garantizan que las grandes ideas tengan una estructura temporal sólida. La impuntualidad y la ineficiencia les causan una profunda ansiedad, ya que las perciben como una pérdida de recursos irrecuperables. Su presencia en un equipo es fundamental para asegurar que los proyectos no solo avancen, sino que lo hagan de manera constante y dentro de los plazos establecidos, modelando un comportamiento de respeto por el tiempo de todos.`,
            howToUseMoreEffectively: [
                "1. Asume la responsabilidad de la planificación y el seguimiento de cronogramas en los proyectos.",
                "2. Ayuda a tu equipo a desglosar tareas grandes en pasos más pequeños y con plazos definidos.",
                "3. Modela el comportamiento siendo siempre puntual y respetando el tiempo de los demás en reuniones.",
            ],
            watchOuts: [
                "• Evita la impaciencia con quienes tienen un ritmo de trabajo diferente o más reflexivo.",
                "• No sacrifiques la calidad o la creatividad por cumplir un plazo a toda costa.",
                "• Sé flexible cuando surjan imprevistos legítimos que alteren el plan original.",
            ],
            strengthsDynamics:
                "Es el complemento ideal para el 'Generador de Ideas', a quien ayuda a estructurar el tiempo para la exploración creativa sin perderse. Trabaja en sintonía con el 'Experto en Enfoque' para asegurar que la meta se alcance dentro del plazo estipulado. Aporta un sentido de urgencia y estructura al 'Pensador'.",
            bestPartners: [
                "Cumplidores (Deliverers) (que se aseguran de que la tarea se complete en el tiempo asignado)",
                "Estrategas (Strategists) (para crear planes de acción con cronogramas realistas)",
                "Camaleones (Chameleons) (para aportar estructura a su adaptabilidad y evitar el caos)",
            ],
            careerApplications: [
                "Planificación de eventos",
                "Gestión de la cadena de suministro y logística",
                "Producción (cine, TV, manufactura)",
                "Coordinación de proyectos y 'scrum master'",
            ],
        },
    },
    {
        strength: "Analyst",
        nameEs: "Analista",
        domain: "Doing",
        briefDefinition:
            "Las personas con esta fortaleza se sienten energizadas al buscar la simplicidad y la claridad a través de una gran cantidad de datos. Se frustran cuando se les pide que sigan su corazón en lugar de la lógica y los hechos probados.",
        details: {
            fullDefinition: `En un mundo lleno de opiniones y suposiciones, el **"Analista"** emerge como la voz de la **verdad objetiva** y la claridad, trascendiendo la simple interpretación de datos para convertirse en una búsqueda incansable de certidumbre.

Un Analista se siente en su elemento cuando se enfrenta a un mar de información. Su mente es una **máquina de patrones y lógica** capaz de filtrar el ruido y encontrar las relaciones de causa y efecto que otros no pueden ver. Para ellos, la claridad y la certidumbre se encuentran en los hechos, las cifras y la evidencia tangible. Se sienten profundamente frustrados por las decisiones basadas en la intuición o las emociones, ya que valoran la **solidez de una conclusión bien fundamentada**.

Su valor más significativo es su capacidad de ser la **voz de la razón y la objetividad** en cualquier situación. Son quienes aterrizan las ideas en la realidad, quienes validan las visiones con datos concretos y quienes aseguran que el equipo no se desvíe por conjeturas o suposiciones. Su presencia es crucial para tomar decisiones inteligentes, estratégicas y, sobre todo, **informadas**. Son los guardianes de la lógica, garantizando que cada paso se base en una comprensión clara y factual de la situación.`,
            howToUseMoreEffectively: [
                "1. Traduce datos complejos en visualizaciones y resúmenes claros que todos puedan entender.",
                "2. Fundamenta las decisiones estratégicas del equipo con evidencia sólida y análisis de escenarios.",
                "3. Sé la voz de la objetividad cuando las discusiones se vuelvan demasiado subjetivas o emocionales.",
            ],
            watchOuts: [
                "• Evita la 'parálisis por análisis'; a veces es necesario tomar una decisión con información incompleta.",
                "• No descartes la importancia de la intuición y la experiencia humana, que no siempre son cuantificables.",
                "• Cuidado con parecer frío o insensible al presentar datos que contradicen las creencias de otros.",
            ],
            strengthsDynamics:
                "Forma una pareja poderosa con el 'Empatizador', combinando datos duros con comprensión humana para tomar decisiones completas. Ayuda al 'Estratega' a validar sus visiones con hechos. Proporciona la lógica y la evidencia que el 'Comandante' necesita para actuar con confianza.",
            bestPartners: [
                "Empatizadores (Empathizers) (para equilibrar la lógica con el impacto humano)",
                "Estrategas (Strategists) (para fundamentar la visión a largo plazo con datos concretos)",
                "Autoconfiantes (Self-believers) (para aportar una base objetiva a su fuerte intuición)",
            ],
            careerApplications: [
                "Análisis de datos y Business Intelligence",
                "Investigación científica o de mercado",
                "Finanzas, contabilidad y auditoría",
                "Planificación urbana y econometría",
            ],
        },
    },
    {
        strength: "Believer",
        nameEs: "Creyente",
        domain: "Feeling",
        briefDefinition:
            "Las acciones de estas personas están impulsadas por valores fundamentales y superiores que no pueden comprometerse a expensas del éxito. Se sienten agotados si sus creencias y valores son cuestionados.",
        details: {
            fullDefinition: `La fortaleza de "Creyente" va mucho más allá de la simple fe. Es una **brújula moral inmutable** que define su identidad y sus acciones.

Para el Creyente, los valores no son solo ideas, son los cimientos de su existencia. Actúan como una **fuente inagotable de energía y resiliencia**, guiando cada decisión y cada paso que dan. Su motivación no es el éxito superficial, sino el profundo **significado** que encuentran al alinear su trabajo con una causa o misión que consideran más grande que ellos mismos. La **autenticidad** es su norte; la coherencia entre lo que creen y lo que hacen es vital para su bienestar.

El mayor valor de un Creyente es su capacidad para ser el **guardián del propósito**. En un equipo, son quienes recuerdan a todos el "porqué" de su trabajo, inyectando un sentido de significado y pasión que trasciende las tareas diarias. A través de su ejemplo, inspiran a otros a actuar no solo por obligación, sino por un propósito compartido, creando un entorno de trabajo más ético y significativo.`,
            howToUseMoreEffectively: [
                "1. Elige trabajos y proyectos que estén alineados con tus valores fundamentales.",
                "2. Sé el guardián de la misión y el propósito del equipo, recordando a todos el 'porqué' de su trabajo.",
                "3. Articula tus valores de forma clara y respetuosa para que otros entiendan tus motivaciones.",
            ],
            watchOuts: [
                "• Evita ser demasiado rígido o dogmático; respeta que otros puedan tener valores diferentes.",
                "• No juzgues a quienes toman decisiones más pragmáticas o menos basadas en principios.",
                "• Cuidado con el agotamiento emocional al luchar por causas que parecen no avanzar.",
            ],
            strengthsDynamics:
                "Inspira al 'Cumplidor' a trabajar no solo por obligación, sino por una causa. Se conecta con el 'Empatizador' a un nivel profundo de valores compartidos. Proporciona al 'Comandante' una dirección ética y un propósito que va más allá de simplemente ganar.",
            bestPartners: [
                "Cumplidores (Deliverers) (para convertir los valores en acciones y resultados concretos)",
                "Narradores (Storytellers) (para comunicar la misión y los valores de una manera inspiradora)",
                "Estrategas (Strategists) (para alinear la estrategia de la organización con un propósito superior)",
            ],
            careerApplications: [
                "Organizaciones sin fines de lucro (ONG)",
                "Trabajo social y activismo",
                "Medicina y cuidado de la salud",
                "Liderazgo en empresas con una fuerte misión social o ética",
            ],
        },
    },
    {
        strength: "Chameleon",
        nameEs: "Camaleón",
        domain: "Feeling",
        briefDefinition:
            "Obtienen entusiasmo de los entornos en constante cambio, las sorpresas y el trabajo 'sobre la marcha'. La previsibilidad y la rutina les aburren hasta las lágrimas.",
        details: {
            fullDefinition: `Aquellos que **abrazan la incertidumbre como un compañero de vida** poseen la extraordinaria fortaleza del "Camaleón", una **maestría en prosperar en la incertidumbre y el cambio** que va mucho más allá de la simple adaptación.

Para el Camaleón, la novedad no es una amenaza, sino un **estímulo vital**. Su mente se energiza con la variedad, los giros inesperados y los entornos dinámicos. Son el tipo de persona que se siente en su elemento durante una crisis o cuando un plan cambia por completo en el último minuto. No solo se ajustan a las nuevas circunstancias, sino que se sienten **revitalizados por ellas**. Su habilidad para pasar de un contexto a otro, de una tarea a otra, con rapidez y fluidez, los convierte en un recurso invaluable para cualquier equipo que opere en un entorno volátil.

El mayor valor de un Camaleón es su capacidad para ser un **agente de estabilidad durante el caos**. Mientras otros se sienten estresados por lo desconocido, ellos actúan como un ancla de calma, demostrando que el cambio puede ser manejado con gracia y flexibilidad. Son el motor que permite a un equipo pivotar rápidamente y aprovechar nuevas oportunidades, garantizando que el barco no se hunda cuando la marea sube de forma inesperada.`,
            howToUseMoreEffectively: [
                "1. Ofrécete como voluntario para proyectos piloto, nuevas iniciativas o para resolver crisis inesperadas.",
                "2. Ayuda a tu equipo a navegar por períodos de cambio, actuando como un ancla de calma y adaptabilidad.",
                "3. Busca roles que ofrezcan una gran variedad de tareas y desafíos para mantenerte estimulado.",
            ],
            watchOuts: [
                "• Evita abandonar proyectos a mitad de camino solo porque la novedad ha desaparecido.",
                "• Asegúrate de desarrollar profundidad en algunas áreas, no solo amplitud.",
                "• Cuidado con parecer poco fiable o inconsistente a ojos de quienes prefieren la estabilidad.",
            ],
            strengthsDynamics:
                "Equilibra al 'Experto en Enfoque', aportando flexibilidad cuando los planes rígidos no funcionan. Es un gran aliado del 'Catalizador', ya que puede adaptarse rápidamente a la nueva dirección que este impulsa. Aporta una perspectiva fresca y variada a las sesiones del 'Generador de Ideas'.",
            bestPartners: [
                "Expertos en Enfoque (Focus Experts) (para asegurar que la adaptabilidad tenga un propósito y se completen las tareas)",
                "Cumplidores (Deliverers) (que aportan la constancia para finalizar lo que el Camaleón empieza)",
                "Guardianes del Tiempo (Time Keepers) (para dar estructura a su flujo constante de actividades)",
            ],
            careerApplications: ["Consultoría", "Gestión de crisis y relaciones públicas", "Emprendimiento y startups", "Periodismo o producción de eventos"],
        },
    },
    {
        strength: "Coach",
        nameEs: "Entrenador",
        domain: "Feeling",
        briefDefinition: "Disfrutan descubriendo el potencial de otras personas y apoyando su crecimiento personal. Les resulta difícil aceptar que este potencial se desperdicie.",
        details: {
            fullDefinition: `Existe un tipo especial de persona que **ve potencial donde otros ven limitaciones**. Esta es la esencia del "Entrenador", una **pasión profunda por el crecimiento humano** y el desarrollo del potencial que trasciende la simple tutoría.

El Entrenador posee un **don especial para ver la semilla de la grandeza** en cada persona. Su mente está sintonizada para identificar talentos latentes, habilidades por pulir y capacidades no descubiertas. Su mayor alegría y satisfacción provienen de presenciar el momento en que alguien supera un obstáculo o alcanza un nuevo nivel de maestría. No solo dan consejos, sino que actúan como un **catalizador de la transformación personal**, haciendo las preguntas correctas y creando un entorno de apoyo y confianza donde el otro se atreve a explorar sus propios límites.

Su valor principal es su **compromiso inquebrantable con el éxito de los demás**. Son los arquitectos del crecimiento, quienes construyen los puentes para que otros puedan cruzar de "quienes son" a "quienes pueden llegar a ser". Su presencia en un equipo es fundamental para la retención y el desarrollo del talento, ya que inspiran y motivan a las personas a alcanzar su máximo potencial, creando un ciclo virtuoso de mejora continua.`,
            howToUseMoreEffectively: [
                "1. Dedica tiempo a mentorizar a colegas más jóvenes o nuevos en la organización.",
                "2. Utiliza tu habilidad para dar feedback constructivo que motive al crecimiento en lugar de desanimar.",
                "3. Ayuda a los líderes a identificar y desarrollar el talento dentro de sus equipos.",
            ],
            watchOuts: [
                "• Evita invertir demasiado tiempo en personas que no están dispuestas a esforzarse por mejorar.",
                "• No descuides tu propio desarrollo personal por estar siempre enfocado en los demás.",
                "• Cuidado con asumir un rol de 'salvador'; el crecimiento debe ser responsabilidad de cada individuo.",
            ],
            strengthsDynamics:
                "Trabaja en sinergia con el 'Comandante', ayudándole a desarrollar a su equipo para que esté a la altura de sus exigencias. Se complementa con el 'Solucionador de Problemas' para ayudar a las personas a superar sus propios bloqueos. Potencia al 'Autoconfiante', ayudándole a canalizar su talento de forma productiva.",
            bestPartners: [
                "Cumplidores (Deliverers) (para ayudarles a crecer hacia roles de mayor responsabilidad)",
                "Autoconfiantes (Self-believers) (para pulir su talento y potenciar su impacto)",
                "Comandantes (Commanders) (para desarrollar el potencial del equipo que lideran)",
            ],
            careerApplications: [
                "Recursos Humanos, especialmente en desarrollo de talento",
                "Liderazgo de equipos y gerencia",
                "Enseñanza y formación profesional",
                "Coaching ejecutivo y de vida",
            ],
        },
    },
    {
        strength: "Empathizer",
        nameEs: "Empatizador",
        domain: "Feeling",
        briefDefinition:
            "Son excelentes para darse cuenta de cómo se sienten los demás y utilizar esta comprensión para hacer algo bueno. Se frustran cuando se les pide que ignoren los sentimientos y que sigan una lógica estricta.",
        details: {
            fullDefinition: `Hay personas que **sienten el mundo a través del corazón de los demás**. Esta es la esencia del "Empatizador", la **habilidad innata para sintonizar con la esencia emocional de los demás** y actuar de forma compasiva, trascendiendo la simple comprensión de los sentimientos ajenos.

El Empatizador es un **radiólogo emocional**, capaz de ver más allá de las palabras y percibir las corrientes de sentimientos que fluyen en un equipo. No solo escuchan, sino que **sienten lo que otros sienten**, lo que les permite crear conexiones genuinas y profundas. Esta capacidad no es pasiva; les impulsa a actuar, ya sea para ofrecer una palabra de aliento, mediar en un conflicto o simplemente validar la experiencia de otra persona. Su presencia crea un ambiente de seguridad psicológica donde todos se sienten vistos y valorados.

El valor más grande de un Empatizador es ser el **pegamento emocional de un equipo**. Son los guardianes de la moral y el bienestar, los que aseguran que las decisiones no solo sean lógicas, sino también humanas. Son el puente entre la cabeza y el corazón, garantizando que el éxito no se mida solo en resultados, sino también en la salud y la cohesión de las personas que lo logran.`,
            howToUseMoreEffectively: [
                "1. Dedica tiempo a preguntar y escuchar activamente a tu equipo para tomar el pulso emocional.",
                "2. Usa tu intuición para mediar conflictos antes de que escalen, encontrando puntos en común.",
                "3. Combina tu sensibilidad con datos objetivos: presenta feedback sobre el impacto humano junto al numérico.",
            ],
            watchOuts: [
                "• Evita sobrecargarte emocionalmente con los problemas ajenos; establece límites saludables.",
                "• No permitas que la búsqueda de armonía frene decisiones necesarias aunque sean difíciles.",
                "• Cuidado con interpretar mal las señales si falta una comunicación clara; valida tus percepciones.",
            ],
            strengthsDynamics:
                "Se complementa con pensadores lógicos (Analistas) para equilibrar corazón y mente. Con los hacedores (Cumplidores), impulsa acciones que consideran el impacto en las personas. Frente al 'Comandante', aporta la perspectiva humana a sus decisiones directas.",
            bestPartners: [
                "Analistas (Analysts) (que aportan datos objetivos para complementar tus intuiciones)",
                "Comandantes (Commanders) (para suavizar su directividad con inteligencia emocional)",
                "Solucionadores de Problemas (Problem Solvers) (para abordar el aspecto humano de los problemas)",
            ],
            careerApplications: [
                "Recursos Humanos y formación de talento",
                "Coaching y mentoring",
                "Comunicación interna y gestión del cambio",
                "Atención al cliente y soporte de alto impacto",
            ],
        },
    },
    {
        strength: "Optimist",
        nameEs: "Optimista",
        domain: "Feeling",
        briefDefinition:
            "Su misión es aportar un espíritu positivo. Creen que el vaso está medio lleno. Siempre encuentran la manera de hacer las cosas más emocionantes, ya sea un proyecto o una situación cotidiana.",
        details: {
            fullDefinition: `La fortaleza de "Optimista" es mucho más que tener una actitud positiva. Es una **fuerza catalizadora que inyecta esperanza y energía** en cualquier entorno.

El Optimista no solo ve el vaso medio lleno; lo llena activamente con su entusiasmo y su visión de un futuro mejor. Posee la habilidad innata de **re-enmarcar los desafíos como oportunidades** y los contratiempos como lecciones valiosas. Su energía es contagiosa, elevando la moral de su equipo y transformando tareas mundanas en experiencias más atractivas. Su creencia inquebrantable en el éxito no es ingenua, sino una fuerza que impulsa el progreso.

El mayor valor del Optimista es su capacidad para ser la **fuente de luz en la oscuridad**. Son los que celebran los pequeños logros y mantienen al equipo enfocado en el lado brillante de las cosas, incluso cuando el camino se vuelve difícil. Su presencia es fundamental para mantener la resiliencia y el impulso, asegurando que un equipo no se rinda ante la adversidad, sino que la aborde con una creencia positiva y un espíritu inquebrantable.`,
            howToUseMoreEffectively: [
                "1. Sé el animador oficial del equipo, celebrando las pequeñas victorias y manteniendo alta la moral.",
                "2. En momentos de crisis o dificultad, enmarca la situación como un desafío superable y no como un desastre.",
                "3. Utiliza tu energía para hacer que las tareas rutinarias o aburridas parezcan más atractivas y divertidas.",
            ],
            watchOuts: [
                "• Evita parecer poco realista o ignorar problemas genuinos; valida las preocupaciones de los demás.",
                "• No minimices los sentimientos negativos de otros con un 'mira el lado bueno' demasiado rápido.",
                "• Cuidado con subestimar los riesgos o dificultades de un proyecto por exceso de confianza.",
            ],
            strengthsDynamics:
                "Es el contrapeso perfecto para el 'Solucionador de Problemas', asegurando que el equipo no se hunda en una mentalidad negativa. Energiza al 'Catalizador', proporcionando el combustible emocional para poner las cosas en marcha. Inspira al 'Narrador' para que cuente historias de éxito y esperanza.",
            bestPartners: [
                "Solucionadores de Problemas (Problem Solvers) (para equilibrar la detección de fallos con una visión de futuro)",
                "Cumplidores (Deliverers) (a quienes motivan para superar obstáculos con energía positiva)",
                "Pacificadores (Peace Keepers) (para transformar la resolución de conflictos en una oportunidad de fortalecimiento)",
            ],
            careerApplications: [
                "Ventas y desarrollo de negocio",
                "Marketing y publicidad",
                "Liderazgo de equipos, especialmente en fases de cambio",
                "Animación de eventos y oratoria motivacional",
            ],
        },
    },
    {
        strength: "Catalyst",
        nameEs: "Catalizador",
        domain: "Motivating",
        briefDefinition:
            "Disfrutan de poner las cosas en marcha y de crear un impulso en un entorno estancado. No soportan esperar y perder el tiempo cuando podrían estar haciendo que las cosas despeguen.",
        details: {
            fullDefinition: `La fortaleza de **"Catalizador"** es mucho más que la simple iniciativa. Es una **fuerza de arranque imparable** que transforma el estancamiento en movimiento.

El Catalizador posee una **impaciencia productiva** que lo impulsa a pasar de la idea a la acción a la velocidad de la luz. Su talento no reside en la planificación meticulosa, sino en su habilidad para encender la chispa inicial, generar el impulso necesario y contagiar a otros con su energía para dar el primer paso. Para ellos, la inacción es una tortura. Son los que dicen "¿y si lo hacemos ahora?" y lo hacen.

El valor más grande de un Catalizador es su capacidad para **romper la parálisis y el estancamiento**. Son los que sacan a los equipos de la fase de "discusión interminable" y los lanzan hacia la ejecución. Son el motor que hace despegar los proyectos, el impulso que transforma la reflexión en acción y las ideas en resultados iniciales. Su presencia es fundamental para que las cosas no solo se hablen, sino que realmente sucedan.`,
            howToUseMoreEffectively: [
                "1. Toma la iniciativa en proyectos que están atascados o que tardan en arrancar.",
                "2. En las reuniones, transforma la discusión en decisiones y próximos pasos claros.",
                "3. Forma equipo con personas que sean buenas en la planificación y el seguimiento para que tu impulso inicial se sostenga.",
            ],
            watchOuts: [
                "• Evita empezar demasiadas cosas sin un plan para terminarlas.",
                "• Sé paciente con las personas que necesitan más tiempo para analizar antes de actuar.",
                "• Cuidado con presionar demasiado al equipo, podrías generar estrés o decisiones precipitadas.",
            ],
            strengthsDynamics:
                "Es el socio ideal para el 'Pensador', a quien ayuda a convertir sus reflexiones en experimentos prácticos. Trabaja muy bien con el 'Estratega', iniciando la acción necesaria para explorar la viabilidad de sus planes. Depende del 'Cumplidor' y del 'Guardián del Tiempo' para dar continuidad y estructura a su impulso.",
            bestPartners: [
                "Cumplidores (Deliverers) (que toman el relevo y se aseguran de que el trabajo se complete)",
                "Expertos en Enfoque (Focus Experts) (para dirigir la energía del catalizador hacia un objetivo concreto)",
                "Pensadores (Thinkers) (para sacar sus ideas del plano mental y llevarlas a la acción)",
            ],
            careerApplications: [
                "Lanzamiento de nuevos productos o servicios",
                "Emprendimiento y dirección de startups",
                "Ventas y desarrollo de nuevos mercados",
                "Producción de eventos y campañas de marketing",
            ],
        },
    },
    {
        strength: "Commander",
        nameEs: "Comandante",
        domain: "Motivating",
        briefDefinition:
            "Les encanta estar a cargo, hablar y que se les pida una opinión directa. No evitan los conflictos y no pueden entender la mentalidad de 'andarse con rodeos'.",
        details: {
            fullDefinition: `Existe un tipo de personalidad que **nace para dirigir, decidir y enfrentar la realidad sin filtros**. Esta es la esencia del "Comandante", una fortaleza que combina autoridad natural con una **franqueza inquebrantable** y un liderazgo directo.

El Comandante posee una presencia de liderazgo innata que se manifiesta en su capacidad para tomar el control de cualquier situación. No temen a la responsabilidad; de hecho, se sienten más vivos cuando asumen la dirección y guían a otros. Su mayor valor radica en su **franqueza inquebrantable**; no se andan con rodeos, valoran la comunicación directa y ven el conflicto no como un problema, sino como una **oportunidad para la claridad y el avance**.

Su motivación principal es la acción y la toma de decisiones. Para ellos, la indecisión y la ambigüedad son los mayores enemigos del progreso. Son los que defienden a su equipo, los que toman las decisiones impopulares necesarias y los que proporcionan la dirección clara que otros evitan. Su presencia es fundamental para superar la parálisis, enfrentar los desafíos de frente y asegurar que el barco tenga un capitán firme, incluso en las tormentas más difíciles.`,
            howToUseMoreEffectively: [
                "1. Asume el liderazgo en situaciones de crisis o cuando se necesita una dirección clara e inmediata.",
                "2. Usa tu franqueza para dar feedback directo y sin ambigüedades que ayude a mejorar el rendimiento.",
                "3. Defiende a tu equipo y toma las decisiones impopulares que otros evitan.",
            ],
            watchOuts: [
                "• Evita parecer autoritario o intimidante; modula tu intensidad según la persona y la situación.",
                "• Aprende a escuchar activamente otras opiniones antes de imponer la tuya.",
                "• Cuidado con generar resentimiento al ser demasiado confrontacional; elige tus batallas.",
            ],
            strengthsDynamics:
                "Se beneficia enormemente del 'Empatizador', que le ayuda a entender el impacto de sus decisiones en el equipo. Forma una alianza poderosa con el 'Cumplidor', que ejecuta sus órdenes con fiabilidad. El 'Analista' le proporciona los datos que necesita para tomar decisiones informadas y no solo instintivas.",
            bestPartners: [
                "Empatizadores (Empathizers) (para asegurar que sus decisiones consideren el factor humano)",
                "Analistas (Analysts) (para fundamentar sus decisiones directas con datos objetivos)",
                "Cumplidores (Deliverers) (que aprecian una dirección clara y se enfocan en la ejecución)",
            ],
            careerApplications: [
                "Dirección general y gerencia de alto nivel",
                "Liderazgo militar o en servicios de emergencia",
                "Dirección de reestructuraciones o fusiones",
                "Abogacía litigante",
            ],
        },
    },
    {
        strength: "Self-believer",
        nameEs: "Autoconfiante",
        domain: "Motivating",
        briefDefinition:
            "Son personas independientes y autosuficientes, que inspiran a otros con su certeza y confianza. No soportan que otros les digan qué hacer o controlen sus acciones.",
        details: {
            fullDefinition: `Cuando observas a **alguien que confía profundamente en su propia brújula interna**, estás frente a un "Autoconfiante". Esta fortaleza representa una **convicción interna inquebrantable** que impulsa la acción, la innovación y el liderazgo sin necesidad de validación externa.

Para el Autoconfiante, la fe en sus propias habilidades es su **combustible principal**. No necesitan la validación externa, ya que su brújula interna les guía con una certeza que a menudo inspira a los demás. Esta seguridad les permite tomar riesgos calculados, explorar caminos no convencionales y mantenerse firmes ante la adversidad. Son los que se atreven a ir en contra de la corriente, confiando en su intuición y en su juicio cuando no hay un mapa claro a seguir.

El mayor valor de un Autoconfiante es su capacidad para ser un **modelo de inspiración y empoderamiento**. A través de su ejemplo, demuestran a los demás que la verdadera fuerza proviene de confiar en uno mismo. Son los líderes que inician el cambio, los pioneros que abren nuevos caminos y los que demuestran que el éxito no depende de la aprobación, sino de la convicción. Su presencia en un equipo es fundamental para impulsar la audacia, la innovación y la autosuficiencia.`,
            howToUseMoreEffectively: [
                "1. Lidera proyectos pioneros o innovadores donde no hay un camino claro a seguir.",
                "2. Inspira a otros a tener más confianza en sus propias capacidades, actuando como un modelo a seguir.",
                "3. Confía en tu intuición para tomar decisiones rápidas cuando no hay tiempo para un análisis exhaustivo.",
            ],
            watchOuts: [
                "• Evita parecer arrogante o desestimar las opiniones de expertos.",
                "• Aprende a aceptar feedback y a reconocer que no siempre tienes la razón.",
                "• No ignores las reglas o procesos importantes solo por tu deseo de independencia.",
            ],
            strengthsDynamics:
                "Se beneficia de la perspectiva del 'Analista', que puede validar o desafiar sus intuiciones con datos. Inspira al 'Ganador' a confiar en sus instintos durante la competición. Su independencia es valorada por el 'Comandante', siempre que los resultados se entreguen. El 'Coach' puede ayudarle a pulir y dirigir su talento innato.",
            bestPartners: [
                "Analistas (Analysts) (para aportar una base objetiva a su fuerte intuición)",
                "Estrategas (Strategists) (que le proporcionan un campo de juego donde aplicar su confianza para lograr grandes metas)",
                "Coaches (Coaches) (que le ayudan a entender y maximizar su impacto en los demás)",
            ],
            careerApplications: [
                "Emprendimiento",
                "Ventas a comisión y desarrollo de negocio",
                "Artista o atleta profesional",
                "Roles de liderazgo que requieren tomar riesgos calculados",
            ],
        },
    },
    {
        strength: "Storyteller",
        nameEs: "Narrador",
        domain: "Motivating",
        briefDefinition:
            "Son maestros de la comunicación. Les gusta ser anfitriones, hablar en público y ser escuchados. Utilizan las historias para conectar, inspirar e influir en los demás.",
        details: {
            fullDefinition: `Algunos individuos poseen **el don de transformar palabras simples en mundos de significado**. Esta es la esencia del "Narrador", la **maestría para conectar, persuadir e inspirar a través del poder de la narrativa**.

El Narrador posee el don de **tejer palabras en relatos que resuenan emocionalmente** con su audiencia. Su mente no solo procesa información, sino que la transforma en anécdotas, metáforas y personajes que dan vida a los datos complejos y a las ideas abstractas. Para ellos, una presentación no es solo un conjunto de diapositivas, sino una oportunidad para llevar a las personas en un viaje que las dejará inspiradas, informadas y comprometidas. Su valor principal es su capacidad de **crear significado y propósito**, haciendo que los mensajes sean no solo entendibles, sino también memorables.

El Narrador es el **altavoz del equipo y de la organización**, el que traduce las visiones estratégicas en un lenguaje que todos pueden entender y sentir. Son los encargados de construir la cultura, de celebrar los éxitos de manera que inspiren a otros y de comunicar el "porqué" detrás de cada acción. Su presencia es fundamental para unir a las personas en torno a una visión compartida y para garantizar que la historia de un equipo sea una que valga la pena contar y escuchar.`,
            howToUseMoreEffectively: [
                "1. Sé el portavoz del equipo o la empresa, traduciendo la estrategia y los datos en una narrativa convincente.",
                "2. Utiliza anécdotas y metáforas para enseñar, dar feedback y celebrar los éxitos.",
                "3. Ayuda a construir la marca y la cultura de la organización a través de una comunicación efectiva.",
            ],
            watchOuts: [
                "• Asegúrate de que tus historias tengan un propósito claro y no sean solo para entretener.",
                "• Evita exagerar o adornar los hechos hasta el punto de faltar a la verdad.",
                "• Dale espacio a otros para hablar; tu don para la comunicación no debe eclipsar a los demás.",
            ],
            strengthsDynamics:
                "Es el vehículo perfecto para las ideas del 'Generador de Ideas' y la visión del 'Estratega', haciéndolas accesibles y emocionantes. Trabaja con el 'Creyente' para comunicar la misión y los valores de la organización. Puede dar voz al optimismo del 'Optimista', contagiando su energía a una audiencia más amplia.",
            bestPartners: [
                "Estrategas (Strategists) (para comunicar la visión de futuro de una manera que inspire a la acción)",
                "Analistas (Analysts) (para transformar datos y hechos en una historia comprensible e impactante)",
                "Creyentes (Believers) (para articular y difundir la misión y los valores del equipo)",
            ],
            careerApplications: ["Comunicación corporativa y relaciones públicas", "Marketing y publicidad", "Ventas y presentaciones a clientes", "Enseñanza, política y periodismo"],
        },
    },
    {
        strength: "Winner",
        nameEs: "Ganador",
        domain: "Motivating",
        briefDefinition:
            "Su objetivo es competir con otros para ganar. En su mente, solo los perdedores creen que participar es más importante que ganar. Las competiciones se crean para seleccionar a un único ganador.",
        details: {
            fullDefinition: `En cada competición, en cada desafío, existe **alguien para quien solo existe una posición: la primera**. Esta es la naturaleza del "Ganador", una **pasión profunda e instintiva por la competición** que impulsa la excelencia y redefine los límites de lo posible.

Para el Ganador, el mundo es un campo de juego y el éxito se mide en relación con los demás. No se trata de una mentalidad maliciosa, sino de un **impulso intrínseco por ser el mejor**. La competencia es su combustible, el catalizador que agudiza su enfoque, aumenta su energía y saca a relucir su máximo potencial. Para ellos, la victoria no es solo un resultado, es la validación de su esfuerzo, su talento y su dedicación.

El mayor valor del Ganador es su capacidad para **elevar el rendimiento de todo un equipo**. Su mentalidad competitiva puede transformar tareas rutinarias en desafíos emocionantes y motivar a sus colegas a alcanzar nuevos niveles de excelencia. Son los que convierten las metas abstractas en objetivos claros y medibles, y los que no se rinden hasta que el marcador muestra la victoria. Su presencia es fundamental para impulsar el crecimiento, la innovación y la ambición en un entorno de trabajo.`,
            howToUseMoreEffectively: [
                "1. Busca entornos competitivos (ventas, deportes, mercados desafiantes) donde puedas prosperar.",
                "2. Transforma tareas individuales o de equipo en una competición sana para aumentar la motivación.",
                "3. Enfoca tu deseo de ganar en superar a la competencia externa, no a tus propios colegas.",
            ],
            watchOuts: [
                "• Evita crear un ambiente de trabajo tóxico por ser excesivamente competitivo internamente.",
                "• Aprende a perder con elegancia y a ver los fracasos como oportunidades de aprendizaje.",
                "• No sacrifiques la ética o la colaboración por la necesidad de ganar a toda costa.",
            ],
            strengthsDynamics:
                "Se motiva con los objetivos claros que le da el 'Comandante'. Su energía competitiva es un gran motor para el equipo, especialmente si se combina con el espíritu positivo del 'Optimista'. El 'Analista' puede proporcionarle las métricas que necesita para saber si está ganando o perdiendo.",
            bestPartners: [
                "Analistas (Analysts) (que proporcionan los datos y métricas para medir el éxito)",
                "Comandantes (Commanders) (que establecen metas claras y competitivas)",
                "Autoconfiantes (Self-believers) (que comparten su impulso por destacar y ser los mejores)",
            ],
            careerApplications: [
                "Ventas y desarrollo de negocios de alto rendimiento",
                "Deportes profesionales",
                "Carreras en el ámbito legal (litigios) o financiero (trading)",
                "Liderazgo de startups en mercados competitivos",
            ],
        },
    },
    {
        strength: "Brainstormer",
        nameEs: "Generador de Ideas",
        domain: "Thinking",
        briefDefinition:
            "Estas personas se emocionan cuando se les pide que presenten nuevas ideas sin límites y que conecten cosas aparentemente inconexas. Se aburren rápidamente con las prácticas estándar.",
        details: {
            fullDefinition: `La fortaleza de "Generador de Ideas" es mucho más que la simple creatividad. Es una **máquina de conexiones mentales inagotable** que transforma lo ordinario en extraordinario.

Para el Generador de Ideas, la mente es un patio de recreo sin límites. Su cerebro está constantemente buscando y estableciendo **vínculos inusuales** entre conceptos, datos y experiencias que la mayoría de la gente considera inconexos. Su mayor emoción proviene de la fase inicial de un proyecto, donde las posibilidades son infinitas y la imaginación puede volar sin restricciones. La rutina y las prácticas estándar son su némesis, ya que limitan su capacidad para innovar y encontrar soluciones frescas.

El mayor valor de un Generador de Ideas es su habilidad para ser el **motor de la innovación**. Son los que rompen los paradigmas existentes, los que encuentran la solución donde nadie más la ve y los que abren la puerta a nuevas oportunidades. Su presencia en un equipo es fundamental para evitar el estancamiento, para desafiar el *statu quo* y para garantizar que la creatividad no solo sea un concepto, sino una fuerza que impulsa el progreso.`,
            howToUseMoreEffectively: [
                "1. Lidera o participa activamente en sesiones de lluvia de ideas para resolver problemas o crear nuevos productos.",
                "2. Mantente al día de las tendencias en diferentes campos para alimentar tu capacidad de hacer conexiones.",
                "3. Colabora con personas más pragmáticas que puedan ayudarte a filtrar y desarrollar tus mejores ideas.",
            ],
            watchOuts: [
                "• Evita saltar de una idea a otra sin dar tiempo a que ninguna madure.",
                "• Aprende a evaluar tus propias ideas de forma crítica y no solo a generarlas.",
                "• No te frustres cuando las limitaciones prácticas (presupuesto, tiempo) restrinjan la creatividad.",
            ],
            strengthsDynamics:
                "Es el socio perfecto para el 'Experto en Enfoque', quien puede tomar la mejor de sus ideas y llevarla a la realidad. El 'Narrador' puede tomar sus conceptos abstractos y convertirlos en historias convincentes. El 'Catalizador' puede darle el impulso inicial a sus ideas más prometedoras.",
            bestPartners: [
                "Expertos en Enfoque (Focus Experts) (para ayudar a seleccionar y ejecutar la idea más prometedora)",
                "Cumplidores (Deliverers) (que pueden transformar una idea brillante en un proyecto real y tangible)",
                "Estrategas (Strategists) (para asegurar que las ideas se alineen con los objetivos a largo plazo)",
            ],
            careerApplications: [
                "Publicidad y creatividad",
                "Diseño de productos e innovación (I+D)",
                "Planificación estratégica y consultoría",
                "Emprendimiento y desarrollo de nuevos modelos de negocio",
            ],
        },
    },
    {
        strength: "Philomath",
        nameEs: "Filomato",
        domain: "Thinking",
        briefDefinition: "Les encanta aprender, adquirir conocimientos y buscar la verdad. Sienten una profunda curiosidad y un deseo de entender el mundo que les rodea.",
        details: {
            fullDefinition: `Imagina a **alguien cuya mente nunca deja de hacer preguntas**, cuya sed de conocimiento es tan natural como respirar. Esta es la esencia del "Filomato", una **pasión profunda e insaciable por el conocimiento** y una sed constante por la verdad.

El Filomato es un **explorador intelectual**, cuyo motor principal es la alegría de aprender. Su mente está siempre en modo de investigación, buscando entender el "porqué" de las cosas, cómo funcionan y qué hay más allá de la superficie. No aprenden por obligación, sino por el puro placer de la **comprensión y la maestría**. Para ellos, el mundo es un vasto océano de información que están ansiosos por explorar. La inacción o el estancamiento mental son sus mayores enemigos.

El mayor valor de un Filomato es su capacidad para ser el **motor de la especialización y el conocimiento profundo**. En un equipo, son quienes profundizan en los temas, se convierten en expertos en nichos y garantizan que las decisiones se basen en una comprensión sólida y bien informada. Su presencia es fundamental para la innovación y la mejora continua, ya que siempre están a la vanguardia de las nuevas ideas, tecnologías y tendencias. Son los guardianes del saber, asegurando que el equipo no solo actúe, sino que lo haga con inteligencia y contexto.`,
            howToUseMoreEffectively: [
                "1. Asume roles que requieran investigación, aprendizaje continuo y especialización.",
                "2. Conviértete en el experto residente del equipo en un tema específico y comparte tu conocimiento.",
                "3. Ayuda a tu organización a mantenerse actualizada sobre nuevas tecnologías, metodologías o tendencias del mercado.",
            ],
            watchOuts: [
                "• Evita quedarte atrapado en la fase de aprendizaje sin pasar nunca a la aplicación práctica.",
                "• No abrumes a los demás con información o detalles irrelevantes.",
                "• Acepta que no siempre es posible saberlo todo antes de tomar una decisión.",
            ],
            strengthsDynamics:
                "Proporciona al 'Analista' los conocimientos profundos y el contexto que necesita para interpretar los datos. Ayuda al 'Estratega' a entender el panorama completo antes de trazar un plan. Trabaja bien con el 'Coach', ya que ambos valoran el desarrollo, uno el propio y otro el de los demás.",
            bestPartners: [
                "Narradores (Storytellers) (que pueden ayudarle a comunicar su conocimiento de forma efectiva)",
                "Cumplidores (Deliverers) (que le ayudan a aplicar su conocimiento en proyectos concretos)",
                "Catalizadores (Catalysts) (que le impulsan a poner en práctica lo que ha aprendido)",
            ],
            careerApplications: [
                "Investigación académica o científica",
                "Desarrollo de software y arquitectura de sistemas",
                "Consultoría especializada",
                "Periodismo de investigación o documental",
            ],
        },
    },
    {
        strength: "Strategist",
        nameEs: "Estratega",
        domain: "Thinking",
        briefDefinition:
            "Son capaces de ver el panorama general y de identificar patrones donde otros ven complejidad. Disfrutan creando planes y estrategias para navegar hacia un futuro deseado.",
        details: {
            fullDefinition: `En medio del caos y la complejidad de cualquier organización, encontrarás a **alguien capaz de elevarse por encima del ruido y ver el mapa completo**. Esta es la naturaleza del "Estratega", la **habilidad visionaria para ver y trazar el camino a largo plazo** en medio de la incertidumbre.

El Estratega posee una perspectiva única que le permite elevarse por encima del caos diario para ver el **panorama completo**. Su mente está constantemente conectando puntos, identificando patrones y anticipando futuros posibles. No se limitan a reaccionar ante el presente, sino que se dedican a **diseñar el futuro deseado**. Para ellos, el verdadero arte no está en resolver el siguiente problema, sino en crear un plan que evite que esos problemas ocurran.

El mayor valor de un Estratega es su capacidad para ser el **arquitecto de la visión y la dirección**. Son los que transforman una idea en una hoja de ruta clara, los que convierten la incertidumbre en un plan de acción y los que aseguran que cada movimiento del equipo sirva a un propósito mayor. Su presencia es fundamental para garantizar que la energía y el esfuerzo de un equipo no se desperdicien en tareas sin rumbo, sino que se dirijan hacia una meta clara y convincente.`,
            howToUseMoreEffectively: [
                "1. Ayuda a tu equipo u organización a definir una visión clara y un plan de acción para el futuro.",
                "2. Ante un problema, tómate un tiempo para ver más allá de la solución inmediata y anticipar futuras consecuencias.",
                "3. Simplifica la complejidad para los demás, mostrando el camino a seguir de manera clara y convincente.",
            ],
            watchOuts: [
                "• Evita que tus planes sean tan abstractos o a largo plazo que el equipo no sepa cómo empezar.",
                "• No ignores los detalles importantes de la ejecución; una gran estrategia sin ejecución es inútil.",
                "• Sé flexible y adapta tu estrategia cuando las circunstancias cambien.",
            ],
            strengthsDynamics:
                "Forma una dupla invencible con el 'Cumpledor', donde el Estratega define el 'qué' y el 'porqué', y el Cumplidor se encarga del 'cómo'. El 'Analista' le proporciona los datos para refinar y validar sus estrategias. El 'Narrador' es su mejor aliado para comunicar la visión estratégica e inspirar al equipo.",
            bestPartners: [
                "Cumplidores (Deliverers) (que ejecutan el plan estratégico con precisión y fiabilidad)",
                "Analistas (Analysts) (que proporcionan los datos para construir y validar la estrategia)",
                "Narradores (Storytellers) (que comunican la visión estratégica de una manera inspiradora)",
            ],
            careerApplications: [
                "Liderazgo ejecutivo y dirección de empresas",
                "Planificación urbana o militar",
                "Consultoría de gestión",
                "Dirección de campañas políticas o de marketing a gran escala",
            ],
        },
    },
    {
        strength: "Thinker",
        nameEs: "Pensador",
        domain: "Thinking",
        briefDefinition:
            "Su objetivo es pensar. Disfrutan de la actividad mental y de las conversaciones significativas. Prefieren estirar sus 'músculos cerebrales' a través del pensamiento profundo.",
        details: {
            fullDefinition: `Existe un tipo de mente que **se nutre del silencio, prospera en la reflexión y encuentra energía en la profundidad del pensamiento**. Esta es la esencia del "Pensador", una **pasión profunda por la actividad mental** y una búsqueda incansable de significado a través del análisis.

Para un Pensador, la mente es un mundo vasto y fascinante por explorar. Se siente energizado por la introspección, las conversaciones profundas y el tiempo a solas para meditar sobre ideas complejas. No se contenta con la superficie de las cosas; su mayor satisfacción proviene de desentrañar los matices, encontrar la coherencia y llegar a sus propias conclusiones bien fundamentadas. Valoran el silencio y la concentración como herramientas esenciales para su trabajo, ya que es ahí donde se encuentran sus mejores ideas.

El mayor valor de un Pensador es su capacidad para ser la **voz de la profundidad y la reflexión** en cualquier equipo. Son quienes detienen la prisa para preguntar el "porqué", quienes ofrecen perspectivas que otros han pasado por alto y quienes elevan el nivel de las conversaciones más allá de lo superficial. Su presencia es fundamental para garantizar que un equipo no solo actúe, sino que lo haga con una comprensión profunda y un propósito claro.`,
            howToUseMoreEffectively: [
                "1. Bloquea tiempo en tu agenda para pensar sin interrupciones; es tu forma de trabajar mejor.",
                "2. Sé la voz reflexiva del equipo, ofreciendo perspectivas profundas que otros pueden haber pasado por alto.",
                "3. Escribe tus reflexiones para clarificar tus ideas y compartirlas de manera estructurada con los demás.",
            ],
            watchOuts: [
                "• Evita quedarte aislado o parecer distante; comparte tus pensamientos con el equipo.",
                "• No caigas en la inacción por pensar demasiado; a veces es necesario actuar y reflexionar después.",
                "• Ten paciencia con las personas que son más orientadas a la acción y menos a la reflexión.",
            ],
            strengthsDynamics:
                "Se complementa con el 'Catalizador', que le empuja a convertir sus pensamientos en acción. Sus reflexiones profundas pueden ser una fuente invaluable de ideas para el 'Generador de Ideas'. El 'Narrador' puede ayudarle a articular y comunicar sus complejas reflexiones de una manera que otros puedan entender.",
            bestPartners: [
                "Catalizadores (Catalysts) (que le ayudan a pasar del pensamiento a la acción)",
                "Narradores (Storytellers) (que pueden comunicar sus ideas profundas de manera efectiva)",
                "Empatizadores (Empathizers) (con quienes puede mantener conversaciones profundas y significativas)",
            ],
            careerApplications: [
                "Filosofía, escritura y academia",
                "Planificación estratégica y roles de 'think tank'",
                "Psicoterapia y consejería",
                "Diseño de algoritmos y arquitectura de software",
            ],
        },
    },
    {
        strength: "Peace Keeper",
        nameEs: "Pacificador",
        domain: "Thinking",
        briefDefinition:
            "Buscan la armonía y la resolución pacífica de conflictos. Se esfuerzan por encontrar un terreno común y unir a las personas, creando un ambiente de colaboración y entendimiento.",
        details: {
            fullDefinition: `En todo equipo, en toda organización, existe **alguien que ve tensiones donde otros ven normalidad y que siente el llamado a transformar la discordia en armonía**. Esta es la naturaleza del "Pacificador", una **maestría en la diplomacia y la creación de armonía** que va mucho más allá de la simple evitación de conflictos.

El Pacificador es un **arquitecto de la cohesión social**. Su mente está sintonizada para detectar tensiones, desavenencias y fricciones antes de que escalen. Su aversión al conflicto no es una debilidad, sino un motor que lo impulsa a buscar incansablemente el consenso y el terreno común. Posee la habilidad innata de actuar como un **puente entre ideas y personas opuestas**, asegurando que todas las voces sean escuchadas y que la colaboración prevalezca sobre la división.

El mayor valor de un Pacificador es su capacidad para ser el **guardián del clima emocional del equipo**. Son quienes aseguran que las discusiones sean productivas, no destructivas, y que las decisiones se tomen con el compromiso de todos. Su presencia es fundamental para construir un entorno de trabajo inclusivo y seguro, donde la diversidad de opiniones es una fortaleza y no una fuente de conflicto, permitiendo que el equipo se enfoque en sus metas en lugar de en sus desacuerdos.`,
            howToUseMoreEffectively: [
                "1. Actúa como mediador en disputas de equipo, ayudando a las partes a encontrar una solución mutuamente aceptable.",
                "2. Fomenta un ambiente de trabajo inclusivo donde todos se sientan cómodos para expresar sus opiniones.",
                "3. Ayuda a construir consensos en torno a decisiones importantes, asegurando el compromiso del equipo.",
            ],
            watchOuts: [
                "• Evita eludir los conflictos necesarios; a veces la confrontación es esencial para avanzar.",
                "• No sacrifiques la mejor decisión por la decisión que contenta a todos.",
                "• Cuidado con que tu búsqueda de armonía sea percibida como una falta de convicción propia.",
            ],
            strengthsDynamics:
                "Equilibra la naturaleza directa del 'Comandante', asegurando que la asertividad no destruya la moral del equipo. Trabaja bien con el 'Empatizador' para entender las raíces emocionales del conflicto. Aporta una necesidad de consenso a la visión del 'Estratega', asegurando que el equipo esté unido detrás del plan.",
            bestPartners: [
                "Comandantes (Commanders) (para suavizar su estilo directo y fomentar la colaboración)",
                "Empatizadores (Empathizers) (con quienes comparte el objetivo de un ambiente emocionalmente sano)",
                "Ganadores (Winners) (para recordarles que la colaboración interna es clave para ganar externamente)",
            ],
            careerApplications: [
                "Mediación y arbitraje",
                "Recursos Humanos y relaciones laborales",
                "Diplomacia y relaciones internacionales",
                "Liderazgo de equipos colaborativos y gestión de alianzas",
            ],
        },
    },
]
