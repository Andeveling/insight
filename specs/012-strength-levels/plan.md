# Implementation Plan: Sistema de Niveles de Madurez para Fortalezas

**Branch**: `012-strength-levels` | **Date**: 21 de diciembre de 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/012-strength-levels/spec.md`

## Summary

Sistema de progresión gamificado que añade niveles de madurez (Esponja, Conector, Guía, Alquimista) a las fortalezas HIGH5 existentes. Los usuarios ganan XP completando misiones diarias, Boss Battles (desafíos del lado oscuro), Combo Breakers (sinergias entre fortalezas) y misiones cooperativas. El progreso es persistente, visual (barras de XP con animaciones) y está diseñado para fomentar el desarrollo consciente de fortalezas sin penalizar ausencias.

**Technical Approach**: Extender el modelo de datos existente (`UserStrength`, `UserGamification`, `XpTransaction`) con nuevas entidades para misiones, niveles de madurez y combos. Usar React Server Components para renderizado inicial, Server Actions para mutaciones, y motion/framer-motion para animaciones de XP. Sistema de generación de misiones basado en catálogo estático (sin AI en MVP) con cron job para renovación diaria.

## Technical Context

**Language/Version**: TypeScript 5.7 (strict mode)
**Primary Dependencies**: Next.js 16 (App Router, RSC, Turbopack), React 19, Prisma 6.15, BetterAuth 1.4, Tailwind CSS 4.0, shadcn/ui, Radix UI, Framer Motion 11, Zod 3.24
**Storage**: Turso (libSQL) via Prisma ORM, existing `UserStrength` and `UserGamification` models to extend
**Testing**: Vitest (unit), Playwright (E2E), React Testing Library (componentes)
**Target Platform**: Web (Next.js 16 SSR + Edge Runtime), responsive mobile-first UI
**Project Type**: Web application (existing monolith, feature extends dashboard)
**Performance Goals**: 
- Misiones diarias cargadas en <200ms (primera carga desde base de datos)
- Animaciones de XP a 60fps (motion GPU-accelerated)
- Cron job de renovación diaria <5s para 10k usuarios activos
**Constraints**: 
- Sin AI en MVP (catálogo estático de misiones)
- Optimistic updates para completar misiones (rollback en error)
- Cooldowns persistentes en DB (no cache volátil)
- Mantener compatibilidad con sistema de gamificación existente (`XpTransaction`, `UserBadge`)
**Scale/Scope**: 
- 500-1000 usuarios activos concurrentes
- ~30 plantillas de misiones por fortaleza (25 fortalezas × 30 = 750 misiones totales)
- ~15 Combo Breakers predefinidos (sinergias comunes)
- 4 niveles de madurez × 25 fortalezas = 100 instancias `StrengthMaturityLevel` por usuario máximo

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Human-First Design
✅ **PASS**: El sistema de niveles enfatiza el crecimiento humano sobre métricas arbitrarias. Los niveles (Esponja/Conector/Guía/Alquimista) tienen nombres humanizados que describen comportamientos, no números fríos. Las Boss Battles introducen autoconciencia del "lado oscuro" (sótano de la fortaleza), alineado con principios de psicología positiva. Sin penalizaciones por ausencia para evitar culpa/presión.

### II. Positive Psychology Foundation
✅ **PASS**: El feature se basa explícitamente en el Espectro de Uso de fortalezas HIGH5. Los 4 niveles reflejan la madurez en aplicación de fortalezas (inmaduro → maestro), no rasgos fijos. Las misiones diarias son accionables y específicas ("Inicia una conversación necesaria"), no genéricas. Boss Battles reconocen que cada fortaleza tiene un "sótano" (sobreuso), promoviendo balance, no maximización ciega.

### III. Feature-First Architecture and Reusability
✅ **PASS**: El feature se organiza como `/app/dashboard/strength-levels/` con co-ubicación de componentes, hooks, actions y types. Reutiliza componentes existentes del design system (CyberBadge, CyberCard, CyberButton). Extiende modelos Prisma existentes (`UserStrength`, `UserGamification`) sin duplicación. Sigue SOLID: separación clara entre generación de misiones (service), persistencia (Prisma actions), UI (RSC + client components para animaciones).

### IV. AI-Augmented Insights
✅ **PASS**: MVP usa catálogo estático de misiones (sin AI), asegurando fiabilidad y control sobre calidad de contenido. Futuras iteraciones pueden añadir generación de misiones personalizadas con AI, pero la especificación no depende de AI para funcionalidad core. Las descripciones de niveles de madurez están predefinidas y validadas por expertos en psicología positiva.

### V. Behavioral Design & Engagement
✅ **PASS**: 
- **Trigger Design**: Notificación diaria ("Nuevas misiones disponibles") es externa e intencional, no manipulativa. Contador regresivo para próximas misiones crea anticipación positiva.
- **Friction Reduction**: Completar misión es 1 click (botón "Completar"), sin formularios complejos. Opcional: pregunta de reflexión que no bloquea XP.
- **Reward Mechanisms**: XP está atado a acciones reales (completar misiones), no check-ins vacíos. Animaciones de +XP son feedback inmediato. Boss Battles (3x XP) recompensan desafío significativo.
- **Habit Formation**: Misiones diarias (24h cooldown) crean ritmo sostenible, no compulsión. Cooldown semanal en Boss Battles previene burnout.
- **Progressive Disclosure**: Nivel inicial (Esponja) muestra solo misiones diarias. Boss Battles se desbloquean en nivel Conector. Combo Breakers aparecen al tener 2+ fortalezas elegibles.

### VI. Type Safety & Explicit Contracts
✅ **PASS**: Todas las entidades (StrengthMaturityLevel, Quest, QuestCompletion, ComboBreaker) tendrán modelos Prisma con tipos generados. Server Actions para mutations con Zod schemas validando inputs (ej: `completeQuestSchema`). Enums TypeScript para niveles de madurez, tipos de misión, estados. JSDoc en funciones públicas del service layer. Sin `any` types.

**Constitution Compliance**: ✅ **ALL GATES PASSED** - El feature está alineado con todos los principios constitucionales. No se requieren justificaciones de complejidad.

## Project Structure

### Documentation (this feature)

```text
specs/012-strength-levels/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output - Not needed (all decisions resolved)
├── data-model.md        # Phase 1 output (next step)
├── quickstart.md        # Phase 1 output (next step)
├── contracts/           # Phase 1 output (Server Actions contracts)
│   ├── complete-quest.schema.ts
│   ├── get-daily-quests.schema.ts
│   └── get-maturity-levels.schema.ts
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Existing Next.js 16 Web Application (extending dashboard feature)
app/
├── dashboard/
│   └── strength-levels/           # New feature directory
│       ├── page.tsx                # Main dashboard page (RSC)
│       ├── layout.tsx              # Layout wrapper
│       ├── _actions/
│       │   ├── complete-quest.ts   # Server Action
│       │   ├── get-daily-quests.ts
│       │   ├── get-maturity-levels.ts
│       │   └── index.ts            # Barrel export
│       ├── _components/
│       │   ├── maturity-level-card.tsx        # RSC - Muestra nivel + XP
│       │   ├── quest-card.tsx                 # Client - Animación XP
│       │   ├── boss-battle-card.tsx           # Client - Animación especial
│       │   ├── combo-breaker-card.tsx
│       │   ├── xp-progress-bar.tsx            # Client - Framer Motion
│       │   ├── level-up-notification.tsx      # Client - Toast
│       │   └── index.ts                       # Barrel export
│       └── _services/
│           ├── quest-generator.service.ts     # Genera misiones desde catálogo
│           ├── maturity-level.service.ts      # Lógica de niveles
│           ├── combo-breaker.service.ts       # Detecta combos elegibles
│           └── index.ts                       # Barrel export

lib/
├── types/
│   └── strength-levels.types.ts   # Enums (MaturityLevel, QuestType, QuestStatus)
├── services/
│   └── strength-levels/           # Shared services
│       ├── xp-calculator.ts       # Calcula XP para nivel siguiente
│       └── cooldown.ts            # Lógica de cooldowns
└── constants/
    └── strength-levels.constants.ts  # XP thresholds, catálogo misiones

prisma/
├── schema.prisma                  # Nuevos modelos (ver data-model.md)
└── migrations/
    └── [timestamp]_add_strength_levels/
        └── migration.sql

prisma/data/
└── strength-levels/
    ├── maturity-levels.json       # 4 niveles predefinidos
    ├── quest-templates.json       # ~750 plantillas misiones
    └── combo-breakers.json        # ~15 combos predefinidos

components/
└── cyber-ui/                      # Existing design system components (reused)
    ├── cyber-badge.tsx
    ├── cyber-button.tsx
    └── cyber-card.tsx

tests/
├── unit/
│   └── strength-levels/
│       ├── xp-calculator.test.ts
│       ├── quest-generator.test.ts
│       └── cooldown.test.ts
├── integration/
│   └── strength-levels/
│       └── complete-quest.test.ts # Server Action integration
└── e2e/
    └── strength-levels/
        └── daily-quests.spec.ts   # Playwright E2E
```

**Structure Decision**: Web application monolith con feature-first organization. El feature `strength-levels` vive dentro de `/app/dashboard/` porque es una extensión del dashboard existente. Siguiendo el patrón establecido en el proyecto (ver `app/dashboard/assessment/`, `app/dashboard/feedback/`), cada feature tiene subdirectorios `_actions/`, `_components/`, `_services/` con barrel exports para encapsulación. Los tipos compartidos van a `lib/types/`, servicios reutilizables a `lib/services/`, y constantes a `lib/constants/`. Seed data JSON en `prisma/data/` para población inicial de catálogos.

## Complexity Tracking

**No violations detected** - All Constitution principles are satisfied without requiring justifications.

---

## Phase 0: Research ✅

**Status**: SKIPPED - All technical decisions resolved during planning

**Reason**: El feature extiende arquitectura existente (Prisma + Next.js 16 RSC). Las decisiones técnicas son estándar:
- XP progression: Exponencial (500/1500/5000) basado en gaming best practices
- Quest generation: Catálogo estático (no AI) para MVP, extensible a AI en futuras iteraciones
- Cooldowns: DB-persisted (no cache) para garantizar idempotencia cross-device
- Animations: Framer Motion (ya en stack) para 60fps GPU-accelerated

**Output**: N/A - Todas las clarificaciones resueltas en Technical Context

---

## Phase 1: Design & Contracts ✅

**Status**: COMPLETED

**Deliverables**:
- ✅ [data-model.md](./data-model.md) - 6 entidades nuevas, ERD, migration strategy
- ✅ [contracts/complete-quest.schema.ts](./contracts/complete-quest.schema.ts) - Zod schema para completar misiones
- ✅ [contracts/get-maturity-levels.schema.ts](./contracts/get-maturity-levels.schema.ts) - Zod schema para obtener niveles
- ✅ [contracts/get-daily-quests.schema.ts](./contracts/get-daily-quests.schema.ts) - Zod schema para obtener misiones
- ✅ [quickstart.md](./quickstart.md) - Guía de implementación paso a paso

**Key Decisions**:
1. **Data Model**: Extiende `UserStrength` sin modificarlo, añade `StrengthMaturityLevel` como tabla independiente
2. **Quest System**: `Quest` dual-purpose (templates con `isTemplate=true` + instancias activas)
3. **Idempotency**: Unique constraint `[userId, questId]` en `QuestCompletion` previene duplicados
4. **XP Transactions**: Reutiliza tabla existente `XpTransaction` con `source="quest_completed"`
5. **Cooldowns**: Columnas `expiresAt` y `cooldownUntil` en `Quest` para gestión temporal

**Agent Context Updated**: ✅ Copilot context file actualizado con nuevas tecnologías del feature

---

## Phase 2: Tasks Breakdown 🚧

**Status**: PENDING

**Next Command**: `/speckit.tasks` - Genera breakdown de tareas por User Story

**What it will create**:
- `specs/012-strength-levels/tasks.md` - Lista de tareas técnicas con:
  - User Story asociada (P1-P4)
  - Dependencias entre tareas
  - Estimación de tiempo
  - Criterios de aceptación técnicos
  - Prioridad de implementación

---

## Ready for Implementation

✅ **All planning phases completed**. El feature está listo para comenzar implementación.

**Recommended Implementation Order**:
1. **Week 1**: Database migration + seed data + core services (P1: Visualización)
2. **Week 2**: Server Actions + UI components + animations (P2: Misiones Diarias)
3. **Week 3**: Boss Battles + Combo Breakers (P3: Gamificación avanzada)
4. **Week 4**: Cooperative Quests + E2E tests + cron jobs (P4: Social features)

**Success Metrics to Track**:
- SC-001: 60% daily quest completion rate (primeros 30 días)
- SC-002: Primera fortaleza a nivel Conector en 2 semanas
- SC-007: <3 minutos para completar primera misión del día

**Documentation Generated**:
- 📄 [plan.md](./plan.md) - Este archivo (plan técnico completo)
- 📊 [data-model.md](./data-model.md) - Esquema de base de datos con ERD y migraciones
- 🚀 [quickstart.md](./quickstart.md) - Guía de implementación paso a paso
- 📋 [contracts/*.schema.ts](./contracts/) - Zod schemas para validación type-safe
- ✅ [checklists/requirements.md](./checklists/requirements.md) - Validación de especificación

**Branch**: `012-strength-levels`  
**Spec**: [spec.md](./spec.md)  
**Next Step**: Ejecutar `/speckit.tasks` para generar breakdown de tareas o comenzar implementación directamente siguiendo [quickstart.md](./quickstart.md)
