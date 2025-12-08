"use client";

import {
  TeamStrengthsGrid,
  TeamWatchOuts,
  UniqueContributions,
  TeamCultureMap,
  UserStrengthProfile,
} from "@/app/_shared";
import type {
  TeamMemberWithStrengths,
  StrengthWithDomain,
} from "@/app/_shared/types/strength.types";
import { calculateTeamAnalytics } from "@/lib/utils/strength-helpers";
import { Separator } from "@/components/ui/separator";

// Sample data for demonstration
const sampleStrengths: StrengthWithDomain[] = [
  {
    id: "1",
    name: "Deliverer",
    nameEs: "Cumplidor",
    domain: "Doing",
    briefDefinition:
      "Cumplen con sus compromisos y disfrutan viendo cómo esto genera más confianza y respeto entre los demás.",
    fullDefinition:
      "El Cumplidor es una fortaleza que va mucho más allá de simplemente hacer lo que se dice. Representa la esencia misma de la fiabilidad inquebrantable.",
    howToUseMoreEffectively: [
      "Usa tu fiabilidad para liderar proyectos críticos",
      "Comunica proactivamente tu capacidad y tus límites",
    ],
    watchOuts: [
      "Evita comprometerte en exceso",
      "No asumas la responsabilidad de otros que no cumplen",
    ],
    bestPartners: ["Estrategas", "Generadores de Ideas"],
    careerApplications: ["Gestión de proyectos", "Operaciones"],
  },
  {
    id: "2",
    name: "Empathizer",
    nameEs: "Empatizador",
    domain: "Feeling",
    briefDefinition:
      "Son excelentes para darse cuenta de cómo se sienten los demás y utilizar esta comprensión para hacer algo bueno.",
    fullDefinition:
      "El Empatizador es un radiólogo emocional, capaz de ver más allá de las palabras y percibir las corrientes de sentimientos.",
    howToUseMoreEffectively: [
      "Dedica tiempo a preguntar y escuchar activamente",
      "Usa tu intuición para mediar conflictos",
    ],
    watchOuts: [
      "Evita sobrecargarte emocionalmente",
      "No permitas que la búsqueda de armonía frene decisiones necesarias",
    ],
    bestPartners: ["Analistas", "Comandantes"],
    careerApplications: ["Recursos Humanos", "Coaching"],
  },
  {
    id: "3",
    name: "Strategist",
    nameEs: "Estratega",
    domain: "Thinking",
    briefDefinition:
      "Son capaces de ver el panorama general y de identificar patrones donde otros ven complejidad.",
    fullDefinition:
      "El Estratega posee una perspectiva única que le permite elevarse por encima del caos diario para ver el panorama completo.",
    howToUseMoreEffectively: [
      "Ayuda a tu equipo a definir una visión clara",
      "Simplifica la complejidad para los demás",
    ],
    watchOuts: [
      "Evita que tus planes sean tan abstractos",
      "No ignores los detalles importantes de la ejecución",
    ],
    bestPartners: ["Cumplidores", "Analistas"],
    careerApplications: ["Liderazgo ejecutivo", "Consultoría"],
  },
  {
    id: "4",
    name: "Catalyst",
    nameEs: "Catalizador",
    domain: "Motivating",
    briefDefinition:
      "Disfrutan de poner las cosas en marcha y de crear un impulso en un entorno estancado.",
    fullDefinition:
      "El Catalizador posee una impaciencia productiva que lo impulsa a pasar de la idea a la acción a la velocidad de la luz.",
    howToUseMoreEffectively: [
      "Toma la iniciativa en proyectos atascados",
      "Transforma la discusión en decisiones",
    ],
    watchOuts: [
      "Evita empezar demasiadas cosas sin terminarlas",
      "Sé paciente con quienes necesitan más tiempo",
    ],
    bestPartners: ["Cumplidores", "Expertos en Enfoque"],
    careerApplications: ["Emprendimiento", "Ventas"],
  },
  {
    id: "5",
    name: "Problem Solver",
    nameEs: "Solucionador de Problemas",
    domain: "Doing",
    briefDefinition:
      "Les encanta encontrar errores, descubrir fallas, diagnosticar problemas y encontrar soluciones.",
    fullDefinition:
      "El Solucionador de Problemas es un detective nato de la ineficiencia.",
    howToUseMoreEffectively: [
      "Asume roles donde la mejora continua sea clave",
      "Enseña a otros tu metodología",
    ],
    watchOuts: [
      "Evita centrarte únicamente en lo negativo",
      "No busques problemas donde no los hay",
    ],
    bestPartners: ["Optimistas", "Cumplidores"],
    careerApplications: ["Ingeniería", "Consultoría"],
  },
];

const sampleTeamMembers: TeamMemberWithStrengths[] = [
  {
    id: "user1",
    name: "Jessica McCauley",
    email: "jessica@example.com",
    strengths: [
      { strengthId: "1", strength: sampleStrengths[0], rank: 1 },
      { strengthId: "2", strength: sampleStrengths[1], rank: 2 },
      { strengthId: "3", strength: sampleStrengths[2], rank: 3 },
      { strengthId: "4", strength: sampleStrengths[3], rank: 4 },
      { strengthId: "5", strength: sampleStrengths[4], rank: 5 },
    ],
  },
  {
    id: "user2",
    name: "Peter Johnson",
    email: "peter@example.com",
    strengths: [
      { strengthId: "1", strength: sampleStrengths[0], rank: 1 },
      { strengthId: "3", strength: sampleStrengths[2], rank: 2 },
      { strengthId: "4", strength: sampleStrengths[3], rank: 3 },
    ],
  },
  {
    id: "user3",
    name: "Melissa Fastner",
    email: "melissa@example.com",
    strengths: [
      { strengthId: "1", strength: sampleStrengths[0], rank: 1 },
      { strengthId: "2", strength: sampleStrengths[1], rank: 2 },
    ],
  },
  {
    id: "user4",
    name: "John Travolta",
    email: "john@example.com",
    strengths: [
      { strengthId: "3", strength: sampleStrengths[2], rank: 1 },
      { strengthId: "4", strength: sampleStrengths[3], rank: 2 },
    ],
  },
];

export default function TeamComponentsDemo() {
  const analytics = calculateTeamAnalytics(sampleTeamMembers);

  return (
    <div className="container mx-auto py-8 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">
          Componentes de Perfiles y Matrices del Equipo
        </h1>
        <p className="text-lg text-muted-foreground">
          Demostración de los componentes UI para visualizar fortalezas del equipo
          basados en HIGH5
        </p>
      </div>

      <Separator />

      {/* Team Strengths Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Team Strengths Grid</h2>
          <p className="text-muted-foreground">
            Matriz que muestra cómo los miembros del equipo se complementan entre sí
          </p>
        </div>
        <TeamStrengthsGrid teamMembers={sampleTeamMembers} />
      </section>

      <Separator />

      {/* Team Culture Map */}
      <section className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Team Culture Map</h2>
          <p className="text-muted-foreground">
            Mapa de cuadrantes del estilo de trabajo del equipo
          </p>
        </div>
        <TeamCultureMap analytics={analytics} />
      </section>

      <Separator />

      {/* Team Watch Outs */}
      <section className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Team Watch Outs</h2>
          <p className="text-muted-foreground">
            Identificación de riesgos de rendimiento por fortalezas sobreutilizadas
          </p>
        </div>
        <TeamWatchOuts analytics={analytics} />
      </section>

      <Separator />

      {/* Unique Contributions */}
      <section className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Unique Contributions</h2>
          <p className="text-muted-foreground">
            Contribuciones únicas de cada miembro del equipo
          </p>
        </div>
        <UniqueContributions analytics={analytics} />
      </section>

      <Separator />

      {/* User Strength Profile */}
      <section className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">User Strength Profile</h2>
          <p className="text-muted-foreground">
            Perfil individual de fortalezas de un usuario
          </p>
        </div>
        <UserStrengthProfile user={sampleTeamMembers[0]} />
      </section>
    </div>
  );
}
