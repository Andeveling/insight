
// Estructura extendida para permitir perfil completo y flexible
export type UserProfileSeed = {
  name: string
  email: string
  password: string
  teamIndex: number
  career?: string
  age?: number
  gender?: 'M' | 'F' | 'O'
  description?: string
  hobbies?: string[]
  profileImageUrl?: string
  strengths?: string[] // Nombres de fortalezas principales
  // Puedes agregar más campos según necesidades futuras
}

export const usersData: UserProfileSeed[] = [
  {
    name: "Dani Ramirez",
    email: "dani@nojau.co",
    password: "password123",
    teamIndex: 0,
    career: "Cofundador y CEO en nojau / Product Owner",
    age: 34,
    gender: "M",
    description: `
    Papá de Vale, Samu y Jero, Esposo de Lore, Pastuso de nacimiento, Ingeniero de profesión y Emprendedor por vocación. Creo firmemente en el poder de SERVIR a los demás, colaborar en equipo y co-crear para generar impacto. Hoy mi foco esta dirigido en lograr la productividad de nuestros clientes, el reto que elegimos para lograrlo es servir de manera impecable a los clientes de nuestros clientes.
    `,
    hobbies: ["lectura", "viajes"],
    strengths: ["Catalyst", "Strategist", "Believer", "Commander", "Coach"],
  },
  {
    name: "Edwar Sanz",
    email: "edwarsanz.nojau@gmail.com",
    password: "password123",
    teamIndex: 0,
    career: "Ingeniero de Software Senior",
    age: 32,
    gender: "M",
    description: `
    Soy un apasionado desarrollador web con habilidades en la creación de experiencias digitales interactivas. Mi objetivo es ayudar a empresas y emprendedores a alcanzar sus metas mediante la construcción de sitios web dinámicos y funcionales, ofreciendo soluciones creativas y efectivas para mejorar la experiencia del usuario.

    Me apasiona el mundo en constante evolución de la tecnología web. Siempre me emociona la oportunidad de aprender nuevas tecnologías y aplicarlas en proyectos desafiantes. Disfruto resolviendo problemas y superando obstáculos creativamente para llevar ideas desde la concepción hasta la realidad digital.

    Mi cartera de proyectos disponibles en mi sitio web personal refleja mi dedicación, mi enfoque autodidacta y mi compromiso constante de mejora para adquirir experiencia práctica y mantenerme actualizado con las últimas tendencias en desarrollo web.
    `,
    hobbies: ["Música", "Naturaleza", "Programación"],
    strengths: ["Problem Solver", "Focus Expert", "Strategist", "Time Keeper", "Believer"],
  },
  {
    name: "Jorge León",
    email: "jorge@nojau.co",
    password: "password123",
    teamIndex: 0,
    career: "CRO at iKono Telecomunicaciones | CEO at Callzi | CRO at nojau",
    age: 36,
    gender: "M",
    description: `
    Cofounder y CEO de Callzi, plataforma líder en el envío masivo de mensajes de voz interactivos en Latinoamérica. Enviamos hasta 180.000 mensajes diarios con una escucha promedio del 70% del total mensaje y respuestas del 75% de los contactos.

    También soy Cofounder y CCO de iKono Telecomunicaciones, compañía que desde 2008 crea experiencias positivas de comunicación para clientes corporativos a través de sus plataformas de WhatsApp Multiagentes, Call/Contact Center, IP-PBX, aplicaciones telefónicas a la medida y mensajería digital (SMS y mensajes de voz).
    `,
    hobbies: ["Fotografía", "Viajes", "Aeronáutica"],
    strengths: ["Self-believer", "Problem Solver", "Coach", "Believer", "Empathizer"],
  },
  {
    name: "Lore Riascos",
    email: "lore@nojau.co",
    password: "password123",
    teamIndex: 0,
    career: "Customer Success en nojau",
    age: 29,
    gender: "F",
    description: "Madre de Vale, Samu y Jero, Especialista en experiencia de usuario y bienestar organizacional.",
    hobbies: ["Leer"],
    strengths: ["Coach", "Optimist", "Empathizer", "Time Keeper", "Believer"],
  },
  {
    name: "Pao Blandón",
    email: "pao@nojau.co",
    password: "password123",
    teamIndex: 0,
    career: "CEO Softseguros | COO en nojau",
    age: 30,
    gender: "F",
    description: `
    Creo en la respiración consciente y en vivir con pasión cada momento, creo en nuestro equipo y en nuestro propósito de todos los días: Agregar valor a la gestión administrativa y comercial de los profesionales en seguros y contribuir a que sea un gremio que se consolide y venda mucho más.

    Con mis socios propiciamos ambientes de trabajo que nos permitan trabajar felices con PERSONAS que amamos lo que hacemos y que nos apasiona aprender todos los días.
    `,
    hobbies: ["Lectura"],
    strengths: ["Coach", "Analyst", "Self-believer", "Catalyst", "Believer"],
  },
  {
    name: "Vale Ramírez",
    email: "vale@nojau.co",
    password: "password123",
    teamIndex: 0,
    career: "Communications specialist",
    age: 20,
    gender: "F",
    description: `Soy Vale una narradora en constante evolución. Cada paso que doy es un capítulo que me reta y me construye, tanto profesional como personalmente.

Me defino como una exploradora de posibilidades, abierta a nuevos horizontes. Mi experiencia me ha enseñado que el riesgo es el combustible de la innovación, la autenticidad y el motor de las conexiones significativas.

Cada desafío lo asumo como una oportunidad para aprender y crecer. Amo la narración en todas sus formas: sea en la radio, en un guion cinematográfico o en una simple pero poderosa publicación en redes sociales.`,
    hobbies: ["dibujo", "videojuegos", "lectura"],
    strengths: ["Time Keeper", "Self-believer", "Optimist", "Strategist", "Believer"],
  },
  {
    name: "Andres Parra",
    email: "andres@nojau.co",
    password: "andres-123",
    teamIndex: 0,
    career: "Fullstack Developer",
    age: 30,
    gender: "M",
    description: "Desarrollador web apasionado por la IA, automatización y el aprendizaje continuo.",
    hobbies: ["Programación", "Cine", "Videojuegos", "Estudiar"],
    strengths: ["Empathizer", "Catalyst", "Strategist", "Believer", "Problem Solver"],
  },
]