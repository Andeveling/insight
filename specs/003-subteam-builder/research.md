# Research: Sub-Team Builder & Match Analyzer

**Feature**: 003-subteam-builder  
**Date**: 13 de diciembre de 2025  
**Purpose**: Resolve technical unknowns and document technology choices

---

## Research Questions Resolved

### Q1: ¿Cómo implementar drag-and-drop para selección de miembros?

**Decision**: Usar @dnd-kit/core + @dnd-kit/sortable

**Rationale**:
- Librería moderna y mantenida activamente
- Compatible con React Server Components (RSC)
- Accesibilidad incorporada (keyboard navigation)
- Performance optimizada con React 18+ features
- Menor tamaño de bundle comparado con react-beautiful-dnd

**Alternatives considered**:
- react-beautiful-dnd: No mantenida activamente, incompatible con React 18 strict mode
- react-dnd: Configuración compleja, API menos intuitiva para casos simples

**Implementation notes**:
- Componente será "use client" por interactividad
- Estado del drag se maneja localmente, solo se persiste al guardar
- Fallback para touch devices incluido

---

### Q2: ¿Dónde calcular el match score - cliente o servidor?

**Decision**: Cálculo híbrido con lógica en servidor

**Rationale**:
- **Cliente (optimistic updates)**: Cálculo inmediato para feedback visual durante drag
- **Servidor (source of truth)**: Validación y persistencia del score final
- Algoritmo es determinístico y no requiere AI para score base
- Permite agregar complejidad futura (ej: histórico, tendencias) sin cambiar contrato

**Alternatives considered**:
- Solo cliente: Riesgo de inconsistencias, lógica duplicada si se necesita en reportes
- Solo servidor: Latencia inaceptable para feedback en tiempo real (<2s requirement)

**Implementation notes**:
- Utility function compartida entre cliente y servidor
- Server Action valida y recalcula antes de guardar
- Cliente usa la misma función para preview inmediato

---

### Q3: ¿Cómo estructurar el algoritmo de match score?

**Decision**: Sistema de factores ponderados con pesos configurables

**Rationale**:
- Transparencia: Cada factor es explicable al usuario
- Extensibilidad: Fácil agregar/modificar factores sin romper cálculo base
- Testeable: Cada factor puede probarse independientemente
- Alineado con principio de "explicable insights"

**Algorithm Structure**:
```typescript
interface MatchScoreFactors {
  strengthCoverage: number;    // 30% - ¿Cuántas fortalezas únicas están representadas?
  domainBalance: number;       // 25% - ¿Balance entre 4 dominios?
  cultureFit: number;          // 20% - ¿Alineación con tipo de proyecto?
  teamSize: number;            // 15% - ¿Tamaño óptimo (5-7 miembros)?
  redundancyPenalty: number;   // -10% - Penalización por fortalezas duplicadas
}

finalScore = (
  strengthCoverage * 0.30 +
  domainBalance * 0.25 +
  cultureFit * 0.20 +
  teamSize * 0.15
) - (redundancyPenalty * 0.10)
```

**Alternatives considered**:
- Machine learning model: Overkill, requiere datos de entrenamiento que no existen
- Reglas binarias (pass/fail): Menos granular, no permite optimización gradual
- Score único sin desglose: No explicable, dificulta mejoras

**Implementation notes**:
- Pesos configurables vía constantes (futuro: admin UI)
- Cada factor retorna 0-100
- Score final normalizado a 0-100

---

### Q4: ¿Cómo modelar tipos de proyecto en base de datos?

**Decision**: Tabla ProjectTypeProfile con seed data inicial

**Rationale**:
- Permite modificación futura sin código (admin UI)
- Seed data proporciona 4 tipos predefinidos
- JSON columns para flexibilidad en arrays (fortalezas ideales, pesos de dominio)
- Relación foreign key con SubTeam garantiza integridad

**Alternatives considered**:
- Enum hardcodeado: Inflexible, requiere migration para nuevos tipos
- Archivo JSON estático: No permite personalización por organización

**Schema Design**:
```prisma
model ProjectTypeProfile {
  id                 String   @id @default(uuid())
  type               String   @unique
  name               String
  nameEs             String
  idealStrengths     String   // JSON: ["Deliverer", "Strategist", ...]
  criticalDomains    String   // JSON: {"Doing": 0.4, "Thinking": 0.3, ...}
  cultureFit         String   // JSON: ["Execution", "Strategy"]
  description        String
  descriptionEs      String
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  
  subTeams           SubTeam[] @relation("ProjectType")
}
```

---

### Q5: ¿Cómo implementar el modo "What-If" sin persistir cambios?

**Decision**: Estado local transitorio con React Context

**Rationale**:
- No requiere cambios en backend
- Estado se descarta al cancelar o cambiar de página
- Permite múltiples simulaciones antes de decidir
- Compatible con Next.js 16 Cache Components (cliente-only)

**Implementation approach**:
```typescript
// _hooks/use-what-if.ts
const useWhatIf = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedMembers, setSimulatedMembers] = useState<string[]>([]);
  const [projectedScore, setProjectedScore] = useState<number>(0);
  
  const startSimulation = (currentMembers: string[]) => {
    setIsSimulating(true);
    setSimulatedMembers([...currentMembers]);
  };
  
  const swapMember = (removeId: string, addId: string) => {
    const updated = simulatedMembers.filter(id => id !== removeId);
    updated.push(addId);
    setSimulatedMembers(updated);
    // Recalcular score en cliente
    setProjectedScore(calculateMatchScore(updated));
  };
  
  const cancelSimulation = () => {
    setIsSimulating(false);
    setSimulatedMembers([]);
  };
  
  const applySimulation = async () => {
    // Guardar vía Server Action
    await updateSubTeam({ members: simulatedMembers });
    setIsSimulating(false);
  };
  
  return { isSimulating, projectedScore, swapMember, startSimulation, cancelSimulation, applySimulation };
};
```

**Alternatives considered**:
- Guardar borradores en DB: Complejidad innecesaria, overhead de persistencia
- URL state: Limitado por tamaño de query string, no apto para arrays grandes

---

### Q6: ¿Cómo generar reportes visuales compartibles?

**Decision**: Fase 1 - HTML/PDF generado en servidor; Fase 2 - Página compartible con link único

**Rationale**:
- Fase 1 es MVP suficiente para P3 priority
- @react-pdf/renderer para PDF en servidor
- Link compartible requiere tabla adicional (SharedReport) - diferible

**Alternatives considered**:
- Screenshot con Puppeteer: Pesado, requiere headless browser
- Canvas API: Complejo mantener parity con UI
- Solo email: No permite visualización directa en browser

**Implementation notes (Phase 1)**:
```typescript
// _actions/generate-report.ts
"use server"

import { pdf } from '@react-pdf/renderer';
import { SubTeamReportDocument } from '../_components/subteam-report-pdf';

export async function generateSubTeamReport(subTeamId: string) {
  const subTeam = await prisma.subTeam.findUnique({
    where: { id: subTeamId },
    include: { /* ... */ }
  });
  
  const doc = <SubTeamReportDocument subTeam={subTeam} />;
  const blob = await pdf(doc).toBlob();
  
  return blob;
}
```

---

## Technology Stack Finalized

| Category             | Technology          | Version  | Rationale                                 |
| -------------------- | ------------------- | -------- | ----------------------------------------- |
| **Drag & Drop**      | @dnd-kit/core       | ^6.1.0   | Modern, accessible, RSC-compatible        |
| **PDF Generation**   | @react-pdf/renderer | ^3.4.0   | React components → PDF, server-side       |
| **Forms**            | React Hook Form     | ^7.51.0  | Ya usado en proyecto, integración con Zod |
| **Validation**       | Zod                 | ^3.22.0  | Ya usado, type-safe schemas               |
| **State Management** | React Context       | Built-in | Suficiente para estado local del feature  |
| **Database**         | Prisma + Turso      | Current  | Ya configurado en proyecto                |

**New Dependencies to Install**:
```bash
bun add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
bun add @react-pdf/renderer
bun add -D @types/react-pdf
```

---

## Best Practices Applied

### Next.js 16 Cache Components (PPR)

**Pattern for sub-team pages**:
```typescript
// app/dashboard/team/[teamId]/sub-teams/page.tsx

export default function SubTeamsPage() {
  return (
    <Container title="Sub-Equipos" description="Gestiona sub-equipos para proyectos específicos">
      {/* Static shell */}
      <Suspense fallback={<SubTeamsListSkeleton />}>
        <SubTeamsListContent />
      </Suspense>
    </Container>
  );
}

async function SubTeamsListContent() {
  const session = await getSession();
  if (!session?.user?.id) redirect('/login');
  
  const subTeams = await getSubTeams(session.user.id);
  
  return <SubTeamsList subTeams={subTeams} />;
}
```

**Key points**:
- Shell estático prerendered (PPR)
- Contenido dinámico dentro de Suspense
- No `export const dynamic = "force-dynamic"`
- Skeleton como parte del shell

---

### Server Actions Pattern

**Best practices for this feature**:
```typescript
// _actions/create-subteam.ts
"use server"

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createSubTeamSchema } from '../_schemas/subteam.schema';

export async function createSubTeam(formData: z.infer<typeof createSubTeamSchema>) {
  // 1. Validar input con Zod
  const validated = createSubTeamSchema.parse(formData);
  
  // 2. Verificar autorización
  const session = await getSession();
  if (!session?.user?.id) throw new Error('Unauthorized');
  
  // 3. Calcular match score en servidor
  const matchScore = calculateMatchScore({
    members: validated.members,
    projectType: validated.projectType,
  });
  
  // 4. Crear en base de datos
  const subTeam = await prisma.subTeam.create({
    data: {
      ...validated,
      matchScore,
      createdBy: session.user.id,
    },
  });
  
  // 5. Revalidar cache
  revalidatePath(`/dashboard/team/${validated.parentTeamId}/sub-teams`);
  
  return subTeam;
}
```

---

### Prisma Best Practices

**Query optimization for this feature**:
```typescript
// lib/services/subteam.service.ts

// ✅ Select only needed fields
export async function getSubTeamsList(teamId: string) {
  return prisma.subTeam.findMany({
    where: { parentTeamId: teamId, deletedAt: null },
    select: {
      id: true,
      name: true,
      projectType: true,
      matchScore: true,
      memberCount: true, // Computed field via JSON array length
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

// ✅ Include relations for detail view
export async function getSubTeamDetail(subTeamId: string) {
  return prisma.subTeam.findUnique({
    where: { id: subTeamId },
    include: {
      parentTeam: {
        select: { id: true, name: true }
      },
      projectTypeProfile: true,
      // Members via JSON parsing + separate query
    },
  });
}
```

---

## Performance Considerations

### Match Score Calculation Optimization

**Strategy**: Memoización en cliente + cache en servidor

```typescript
// _utils/match-score-calculator.ts

// Cache para evitar recálculos con mismos inputs
const scoreCache = new Map<string, number>();

export function calculateMatchScore(input: MatchScoreInput): number {
  const cacheKey = JSON.stringify(input);
  
  if (scoreCache.has(cacheKey)) {
    return scoreCache.get(cacheKey)!;
  }
  
  const score = computeScore(input);
  scoreCache.set(cacheKey, score);
  
  return score;
}

// Límite de cache para evitar memory leaks
if (scoreCache.size > 1000) {
  const firstKey = scoreCache.keys().next().value;
  scoreCache.delete(firstKey);
}
```

**Estimated calculation time**: <50ms para equipo de 10 miembros

---

### Database Query Optimization

**Indexes needed**:
```prisma
model SubTeam {
  // ...
  
  @@index([parentTeamId, deletedAt]) // List query
  @@index([createdBy]) // User's created sub-teams
  @@index([projectType]) // Filter by project type
}
```

**Query patterns**:
- List: WHERE parentTeamId = ? AND deletedAt IS NULL
- User's teams: WHERE createdBy = ? 
- Filter: WHERE projectType = ?

---

## Security Considerations

### Authorization Rules

**Resource ownership**:
- Solo miembros del equipo principal pueden crear sub-equipos
- Solo creador o admin del equipo puede editar/eliminar
- Solo miembros del equipo pueden ver sub-equipos

**Implementation**:
```typescript
// _actions/authorization.ts

export async function canManageSubTeam(userId: string, subTeamId: string): Promise<boolean> {
  const subTeam = await prisma.subTeam.findUnique({
    where: { id: subTeamId },
    include: {
      parentTeam: {
        include: {
          members: { where: { userId } }
        }
      }
    }
  });
  
  if (!subTeam) return false;
  
  const isCreator = subTeam.createdBy === userId;
  const isTeamAdmin = subTeam.parentTeam.members.some(m => m.role === 'admin');
  
  return isCreator || isTeamAdmin;
}
```

### Input Validation

**Server-side validation required**:
- Nombre de sub-equipo: 3-50 caracteres
- Miembros: 2-10 IDs válidos del equipo principal
- Tipo de proyecto: Debe existir en ProjectTypeProfile
- Descripción: Max 500 caracteres

**Implemented via Zod schemas in `_schemas/`**

---

## Testing Strategy

### Unit Tests

**Scope**:
- Match score calculation algorithm
- Gap analysis logic
- Strength coverage utilities

**Tools**: Vitest (ya configurado en proyecto)

### Integration Tests

**Scope**:
- Server Actions (create, update, delete)
- Database queries (via Prisma)
- Authorization logic

**Approach**: Mock Prisma client, test business logic

### E2E Tests

**Scope**:
- Create sub-team flow
- Match score updates in real-time
- What-If simulation
- Report generation

**Tools**: Playwright (ya configurado)

**Critical user journeys**:
1. Crear sub-equipo → guardar → ver en lista
2. Seleccionar miembros → ver score actualizado
3. Modo What-If → simular cambio → cancelar/aplicar
4. Generar reporte → descargar PDF

---

## Unknowns Remaining

**None** - All technical unknowns have been resolved through research.

---

## Next Steps

1. ✅ Research complete
2. → Proceed to Phase 1: Data Model (data-model.md)
3. → Proceed to Phase 1: API Contracts (contracts/)
4. → Proceed to Phase 1: Quickstart Guide (quickstart.md)
