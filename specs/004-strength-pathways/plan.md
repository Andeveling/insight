# Implementation Plan: Rutas de Desarrollo de Fortalezas (Gamificadas)

**Branch**: `004-strength-pathways` | **Date**: 14 de diciembre de 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-strength-pathways/spec.md`

## Summary

Implementar un sistema de desarrollo de fortalezas gamificado que permita a los usuarios progresar a través de módulos educativos estructurados, completar desafíos prácticos, y ganar XP e insignias por sus logros. El sistema incluye visualización de progreso, recomendaciones de IA, y capacidades de aprendizaje colaborativo entre pares. La implementación utilizará Next.js 16 App Router con Server Components, Prisma para gestión de datos, AI SDK para recomendaciones personalizadas, y una interfaz completamente en español.

## Technical Context

**Language/Version**: TypeScript (strict mode) / Next.js 16 with App Router
**Primary Dependencies**: 
- Next.js 16 (App Router, Server Components, Turbopack)
- Prisma ORM (Turso/libSQL adapter)
- Vercel AI SDK + OpenAI GPT-4o
- React Hook Form + Zod
- Tailwind CSS + shadcn/ui + Radix UI
- BetterAuth (authentication)
- Framer Motion (animations)

**Storage**: Turso (libSQL) via Prisma ORM
**Testing**: Playwright (E2E), Jest/Vitest (unit tests - to be determined)
**Target Platform**: Web application (responsive: mobile, tablet, desktop)
**Project Type**: Web application (Next.js monolith with feature-first architecture)
**Performance Goals**: 
- <2s response time for XP updates and progress calculations
- Support 500+ concurrent users completing challenges
- AI recommendations generated in <3s
- Smooth animations (<300ms duration)

**Constraints**: 
- All UI must be in Spanish
- Must integrate with existing gamification system (dependency)
- AI costs must be optimized (cache recommendations, use GPT-4o-mini where possible)
- Must follow Next.js 16 Cache Components pattern (PPR)
- Mobile-first responsive design

**Scale/Scope**: 
- ~15 screens/views (dashboard, module list, module detail, challenge view, progress tracking, leaderboard, AI coach, peer learning)
- 6 new Prisma models + modifications to existing User model
- ~30-40 Server Actions
- ~25-35 React components
- Integration with existing auth, profile, and team systems

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Human-First Design ✅

- **Status**: PASS
- **Verification**: 
  - UI completamente en español con lenguaje motivacional
  - Recomendaciones del AI Coach son explicables y accionables
  - Sistema de progreso visual empodera al usuario sin abrumar
  - Feedback loops refuerzan psicología positiva (celebración de logros, XP, insignias)
  - Usuario mantiene autonomía para elegir qué módulos completar

### II. Positive Psychology Foundation ✅

- **Status**: PASS
- **Verification**:
  - Módulos organizados por fortalezas identificadas del usuario
  - Contenido presenta desarrollo como oportunidad de crecimiento
  - Desafíos colaborativos destacan potencial de trabajo en equipo
  - Lenguaje empoderador y específico (insignias con nombres significativos)
  - Dashboard balancea progreso con reconocimiento de logros

### III. Feature-First Architecture ✅

- **Status**: PASS
- **Verification**:
  - Nueva ruta `/dashboard/development` con estructura feature-first
  - Componentes co-locados en `_components/`
  - Hooks personalizados en `_hooks/`
  - Server Actions en `_actions/`
  - Schemas de validación en `_schemas/`
  - Barrel exports (`index.ts`) para imports limpios
  - Código compartido solo en `lib/` y `components/ui/`

### IV. AI-Augmented Insights ✅

- **Status**: PASS
- **Verification**:
  - AI Coach genera recomendaciones basadas en datos reales del perfil
  - Zod schemas validan outputs del AI (recomendaciones estructuradas)
  - Recomendaciones claramente distinguidas de datos objetivos (XP, módulos completados)
  - Fallback graceful si AI no disponible (mostrar módulos sin recomendaciones)
  - AI aumenta experiencia pero no es crítico para funcionalidad core

### V. Type Safety & Explicit Contracts ✅

- **Status**: PASS
- **Verification**:
  - TypeScript strict mode en todos los archivos
  - Prisma genera types para todas las entidades (DevelopmentModule, Challenge, etc.)
  - Zod schemas para validación de forms y AI outputs
  - Tipos explícitos en `lib/types/` para contratos de API
  - JSDoc en funciones públicas y lógica compleja
  - Sin uso de `any` (excepto casos documentados)

### Constitution Compliance Summary

**Overall Status**: ✅ **ALL PRINCIPLES SATISFIED**

No violations detected. Feature aligns completely with project constitution. Proceed to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── dashboard/
│   └── development/                    # Nueva feature
│       ├── page.tsx                    # Lista de módulos (Cache Components)
│       ├── layout.tsx                  # Layout con navegación
│       ├── loading.tsx                 # Loading state
│       ├── error.tsx                   # Error boundary
│       ├── _components/
│       │   ├── index.ts                # Barrel export
│       │   ├── module-card.tsx         # Card de módulo con nivel
│       │   ├── module-list.tsx         # Grid de módulos
│       │   ├── progress-dashboard.tsx  # Dashboard de XP y progreso
│       │   ├── xp-bar.tsx              # Barra de progreso de XP
│       │   ├── level-badge.tsx         # Badge de nivel del usuario
│       │   ├── badge-showcase.tsx      # Galería de insignias
│       │   ├── ai-recommendations.tsx  # Panel de recomendaciones AI
│       │   ├── challenge-card.tsx      # Card de desafío individual
│       │   ├── challenge-list.tsx      # Lista de desafíos en módulo
│       │   ├── peer-learners.tsx       # Lista de usuarios en misma ruta
│       │   ├── collaborative-challenge.tsx  # UI desafío colaborativo
│       │   ├── level-up-notification.tsx   # Animación subida de nivel
│       │   └── stats-overview.tsx      # Resumen de estadísticas
│       ├── _actions/
│       │   ├── index.ts
│       │   ├── start-module.ts         # Iniciar módulo
│       │   ├── complete-challenge.ts   # Completar desafío + otorgar XP
│       │   ├── get-user-progress.ts    # Obtener progreso del usuario
│       │   ├── get-modules.ts          # Listar módulos por fortaleza
│       │   ├── get-ai-recommendations.ts  # Generar recomendaciones
│       │   ├── get-badges.ts           # Obtener insignias del usuario
│       │   ├── check-badge-unlock.ts   # Verificar desbloqueo de insignia
│       │   ├── get-peer-learners.ts    # Usuarios en misma ruta
│       │   └── complete-collaborative.ts  # Completar desafío colaborativo
│       ├── _hooks/
│       │   ├── index.ts
│       │   ├── use-module-progress.ts  # Hook para progreso de módulo
│       │   ├── use-xp-tracker.ts       # Hook para tracking de XP
│       │   └── use-badge-notifications.ts  # Hook para notifs de insignias
│       ├── _schemas/
│       │   ├── index.ts
│       │   ├── module.schema.ts        # Validación de módulo
│       │   ├── challenge.schema.ts     # Validación de desafío
│       │   ├── progress.schema.ts      # Validación de progreso
│       │   └── ai-recommendation.schema.ts  # Schema para AI output
│       ├── _services/
│       │   ├── index.ts
│       │   ├── xp-calculator.service.ts     # Lógica de cálculo de XP
│       │   ├── level-calculator.service.ts  # Lógica de niveles
│       │   ├── badge-rules.service.ts       # Reglas de insignias
│       │   └── ai-coach.service.ts          # Servicio de AI Coach
│       ├── _utils/
│       │   ├── index.ts
│       │   ├── module-helpers.ts       # Utilidades para módulos
│       │   └── progress-formatter.ts   # Formato de datos de progreso
│       ├── [moduleId]/
│       │   └── page.tsx                # Detalle de módulo con desafíos
│       ├── dashboard/
│       │   └── page.tsx                # Dashboard principal de progreso
│       └── badges/
│           └── page.tsx                # Galería completa de insignias

prisma/
├── schema.prisma                       # Agregar nuevos modelos
├── migrations/                         # Nueva migración
└── data/
    ├── development-modules.data.ts     # Seed data para módulos
    ├── challenges.data.ts              # Seed data para desafíos
    └── badges.data.ts                  # Seed data para insignias

lib/
├── types/
│   ├── development.types.ts            # Tipos para módulos y desafíos
│   ├── gamification.types.ts           # Tipos para XP e insignias
│   └── ai-coach.types.ts               # Tipos para recomendaciones
└── constants/
    ├── xp-levels.ts                    # Constantes de niveles de XP
    └── badge-criteria.ts               # Criterios de insignias

components/ui/
├── badge.tsx                           # Component primitivo (ya existe)
├── progress.tsx                        # Progress bar (ya existe)
└── [otros componentes existentes]

tests/
└── e2e/
    └── development/
        ├── module-navigation.spec.ts   # Test navegación de módulos
        ├── challenge-completion.spec.ts # Test completar desafíos
        ├── xp-tracking.spec.ts         # Test sistema de XP
        └── badge-unlock.spec.ts        # Test desbloqueo de insignias
```

**Structure Decision**: Se utiliza la estructura de Next.js App Router con feature-first architecture. La nueva feature `development` se coloca dentro de `/dashboard` ya que es una funcionalidad autenticada. Se sigue estrictamente el patrón de underscore para carpetas privadas (`_components/`, `_actions/`, etc.) y se proveen barrel exports para imports limpios. Los tests E2E se agregan en `/tests/e2e/` siguiendo la estructura existente del proyecto.

## Complexity Tracking

> **No violations detected** - Constitution Check passed all principles.

N/A - Feature design aligns with all constitution principles without requiring complexity exceptions.

---

## Phase 0: Research & Technology Validation

**Objective**: Resolver incertidumbres técnicas y validar decisiones de arquitectura antes del diseño detallado.

### Research Tasks

#### RT-001: Sistema de Gamificación Base ✅
**Status**: COMPLETED  
**Decision**: Crear sistema completo desde cero (UserGamification, Badge, UserBadge)  
**Key Findings**: No existe ningún sistema de gamificación en el codebase actual. Todas las referencias están en docs/specs.  
**Output**: Schema Prisma completo en research.md

#### RT-002: Estrategia de Almacenamiento de Contenido ✅
**Status**: COMPLETED  
**Decision**: Almacenar en base de datos (campo `content: String` en DevelopmentModule)  
**Key Findings**: Patrón existente usa `/prisma/data/*.ts`. Turso soporta TEXT hasta 1GB sin problemas.  
**Output**: Estructura de seeding y migración documentada

#### RT-003: Caché de Recomendaciones de IA ✅
**Status**: COMPLETED  
**Decision**: DB-based caching con TTL 7 días (patrón existente)  
**Key Findings**: Proyecto usa caché en DB para reportes. No hay Redis/Upstash. Ahorro estimado: 67% de costos OpenAI.  
**Output**: Patrón de caché con UserRecommendation model y lógica de invalidación

#### RT-004: Animaciones de Gamificación ✅
**Status**: COMPLETED  
**Decision**: Usar Framer Motion (ya instalado v12.23.25)  
**Key Findings**: Framer Motion disponible en bun.lock. Soporte GPU acceleration, 60fps garantizado.  
**Output**: Ejemplos de XpGainToast, BadgeUnlockModal, ProgressBar con motion

#### RT-005: Desafíos Colaborativos - Sincronización ✅
**Status**: COMPLETED  
**Decision**: Modelo asíncrono con notificaciones (sin WebSockets)  
**Key Findings**: No hay WebSockets en proyecto. Patrón similar a Feedback 360°. Polling opcional para futuro.  
**Output**: Schema CollaborativeChallenge + flujo completo de confirmación dual

#### RT-006: Manejo de Contenido Multilenguaje Futuro ⏸️
**Status**: NICE TO HAVE - NO IMPLEMENTAR MVP  
**Recommendation**: Preparar arquitectura usando sufijos "Es" (titleEs, descriptionEs) para futura expansión  
**Key Findings**: Constraint explícito: "Spanish only". i18n agrega complejidad innecesaria para MVP.  
**Output**: Plan de migración futura con next-intl

### Phase 0 Results ✅

**Status**: COMPLETE (14 de diciembre 2025)

**Artifacts Generated**:
- ✅ **[research.md](./research.md)** - Documento completo con 5 research tasks resueltas
- ✅ Todas las incertidumbres técnicas clarificadas
- ✅ Decisiones documentadas con alternativas rechazadas
- ✅ Ejemplos de código y schemas Prisma
- ✅ Estimaciones de costos y performance

**Key Decisions Summary**:
1. **Gamificación**: Crear desde cero (3 modelos nuevos)
2. **Contenido**: DB storage con campo `content: String`
3. **Caché IA**: DB-based, TTL 7 días, ahorro 67%
4. **Animaciones**: Framer Motion (ya disponible)
5. **Sincronización**: Async + notificaciones (MVP), polling futuro

**Ready for Phase 1**: ✅ YES - Todas las [NEEDS CLARIFICATION] resueltas

---

## Phase 1: Design & Data Modeling

**Objective**: Diseñar el modelo de datos completo y contratos de API antes de implementar.

### Data Model Tasks

#### DM-001: Prisma Schema para Módulos y Desafíos
**Deliverable**: `data-model.md` sección "Core Entities"

```prisma
model DevelopmentModule {
  id          String   @id @default(uuid())
  strengthId  String   // FK a Strength existente
  level       String   // "beginner" | "intermediate" | "advanced"
  title       String
  description String
  content     String   @db.Text // o ruta si está en archivos
  duration    Int      // minutos estimados
  order       Int      // orden de visualización
  challenges  Challenge[]
  userProgress UserProgress[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Challenge {
  id          String   @id @default(uuid())
  moduleId    String
  module      DevelopmentModule @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  title       String
  description String
  type        String   // "reflection" | "action" | "collaboration"
  xpReward    Int
  badgeId     String?  // Opcional: badge que otorga
  order       Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model UserProgress {
  id              String   @id @default(uuid())
  userId          String
  user            User @relation(fields: [userId], references: [id], onDelete: Cascade)
  moduleId        String
  module          DevelopmentModule @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  status          String   // "not_started" | "in_progress" | "completed"
  completedChallenges Int @default(0)
  totalChallenges     Int
  moduleXpEarned  Int      @default(0)
  startedAt       DateTime?
  completedAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@unique([userId, moduleId])
}

model UserGamification {
  id          String   @id @default(uuid())
  userId      String   @unique
  user        User @relation(fields: [userId], references: [id], onDelete: Cascade)
  xpTotal     Int      @default(0)
  level       Int      @default(1)
  badges      String   @default("[]") // JSON array de badge IDs
  modulesCompleted Int @default(0)
  challengesCompleted Int @default(0)
  collaborativeChallenges Int @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Badge {
  id          String   @id @default(uuid())
  name        String   @unique
  nameEs      String   // Nombre en español
  description String
  descriptionEs String
  iconUrl     String   // URL a imagen/icono
  type        String   // "level" | "collaboration" | "milestone"
  criteria    String   // JSON con criterios de desbloqueo
  createdAt   DateTime @default(now())
}

model CollaborativeChallenge {
  id          String   @id @default(uuid())
  challengeId String
  user1Id     String
  user2Id     String
  user1Confirmed Boolean @default(false)
  user2Confirmed Boolean @default(false)
  xpBonus     Int
  completedAt DateTime?
  createdAt   DateTime @default(now())
  
  @@unique([challengeId, user1Id, user2Id])
}
```

#### DM-002: Extensión de Modelo User
**Task**: Agregar relaciones necesarias al modelo `User` existente

```prisma
model User {
  // ... campos existentes
  progress     UserProgress[]
  gamification UserGamification?
}
```

#### DM-003: Seed Data Structure
**Deliverable**: Estructura de datos de prueba en `prisma/data/`

- `development-modules.data.ts`: 15-20 módulos de ejemplo (3-4 por fortaleza común)
- `challenges.data.ts`: 60-80 desafíos (3-4 por módulo)
- `badges.data.ts`: 10-15 insignias iniciales

### API Contracts

#### AC-001: Server Actions Contracts
**Deliverable**: `contracts/server-actions.md`

**Ejemplo de contrato**:
```typescript
// complete-challenge.ts
type CompleteChallengeInput = {
  challengeId: string;
  userId: string;
  collaboratorId?: string; // si es colaborativo
};

type CompleteChallengeOutput = {
  success: boolean;
  xpEarned: number;
  newTotalXp: number;
  leveledUp: boolean;
  newLevel?: number;
  badgeUnlocked?: {
    id: string;
    name: string;
    description: string;
  };
  error?: string;
};
```

Documentar contratos para:
- `start-module`
- `complete-challenge`
- `get-user-progress`
- `get-modules`
- `get-ai-recommendations`
- `get-badges`
- `check-badge-unlock`
- `get-peer-learners`
- `complete-collaborative`

#### AC-002: Component Props Interfaces
**Deliverable**: `contracts/component-props.ts`

Definir interfaces TypeScript para props de todos los componentes principales (no implementar, solo tipos).

### Quickstart Guide

#### QS-001: Developer Setup
**Deliverable**: `quickstart.md`

Documentar:
1. Cómo ejecutar migraciones de Prisma
2. Cómo seed de datos de prueba
3. Cómo acceder a la feature localmente
4. Variables de entorno necesarias (OpenAI API key)
5. Cómo ejecutar tests E2E

### Phase 1 Deliverables

- [x] `data-model.md` - Schema completo de Prisma
- [x] `contracts/server-actions.md` - Contratos de todas las actions
- [x] `contracts/component-props.ts` - Interfaces de props
- [x] `quickstart.md` - Guía de setup para developers

### Post-Phase 1: Constitution Re-Check

Después de completar Phase 1, volver a verificar Constitution Check para asegurar que el diseño detallado sigue cumpliendo todos los principios.

---

## Phase 2: Implementation Planning

**Objective**: Dividir la implementación en tareas concretas, ordenadas por prioridad y dependencias.

**Note**: Esta fase será ejecutada por el comando `/speckit.tasks`, que generará `tasks.md` con la lista detallada de tareas de implementación.

### Task Categories (Preview)

1. **Database & Migrations**
   - Crear migración de Prisma
   - Crear seed scripts
   - Ejecutar migraciones en dev/staging

2. **Core Services**
   - Implementar `xp-calculator.service.ts`
   - Implementar `level-calculator.service.ts`
   - Implementar `badge-rules.service.ts`
   - Implementar `ai-coach.service.ts`

3. **Server Actions (Priority Order)**
   - P1: `get-modules.ts`, `start-module.ts`, `get-user-progress.ts`
   - P1: `complete-challenge.ts`, `check-badge-unlock.ts`
   - P2: `get-ai-recommendations.ts`, `get-badges.ts`
   - P3: `get-peer-learners.ts`, `complete-collaborative.ts`

4. **UI Components (Bottom-Up)**
   - Primitivos: `xp-bar.tsx`, `level-badge.tsx`, `badge-showcase.tsx`
   - Compuestos: `module-card.tsx`, `challenge-card.tsx`
   - Layouts: `module-list.tsx`, `progress-dashboard.tsx`

5. **Pages & Routes**
   - `/dashboard/development/page.tsx` (lista de módulos)
   - `/dashboard/development/dashboard/page.tsx` (dashboard de progreso)
   - `/dashboard/development/[moduleId]/page.tsx` (detalle de módulo)
   - `/dashboard/development/badges/page.tsx` (galería de insignias)

6. **Testing**
   - Unit tests para services
   - E2E tests para flujos críticos (P1 user stories)

7. **Content Creation**
   - Escribir contenido de módulos
   - Diseñar desafíos prácticos
   - Crear criterios de insignias

### Success Criteria for Phase 2

- Todas las tareas priorizadas (P1 > P2 > P3)
- Dependencias identificadas claramente
- Estimaciones de tiempo por tarea
- Asignación de responsabilidades (si aplica)

---

## Next Steps

1. ✅ **Phase 0 Complete**: Ejecutar research tasks y generar `research.md`
2. ⏳ **Phase 1 Pending**: Diseñar data model y contracts → `data-model.md`, `contracts/`, `quickstart.md`
3. ⏳ **Phase 2 Pending**: Ejecutar `/speckit.tasks` para generar `tasks.md`
4. ⏳ **Implementation**: Comenzar desarrollo siguiendo `tasks.md`

**Current Status**: Plan creado, listo para Phase 0 research.

