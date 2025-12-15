# Implementation Plan: Gamified UI Refresh (Profile + Theme)

**Branch**: `006-gamified-profile-ui` | **Date**: 2025-12-15 | **Spec**: `specs/006-gamified-profile-ui/spec.md`
**Input**: Feature specification from `/specs/006-gamified-profile-ui/spec.md`

## Summary

Refresco visual del theme y de la vista **Dashboard → Profile** para que la UI se perciba más “gamificada” y alineada con diseño:

- Header de perfil con identidad + progreso (nivel/XP/racha)
- Bloque de logros/recompensas con empty state motivacional
- Presentación de fortalezas y DNA más clara y atractiva
- Mantener la edición de perfil y estados de carga/error

En términos técnicos: mantener composición server-first (RSC + server actions), extender el theme vía **tokens CSS** (sin hardcode de colores), y estructurar los bloques del Profile con SRP (SOLID) y feature-first.

Clarificaciones aplicadas (desde `spec.md`):
- XP en header: `XP en el nivel actual / XP requerido para el siguiente nivel` + barra.
- Logros recientes: mostrar 3 por defecto.
- “Ver todo”: navega a `/dashboard/development/badges`.
- Sin “siguiente objetivo” en Profile.

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 16 (App Router)  
**Primary Dependencies**: Tailwind CSS v4 (tokens en `app/globals.css`), shadcn/ui + Radix, motion, Zod, React Hook Form, BetterAuth  
**Storage**: Turso/libSQL vía Prisma 7 (`@prisma/client`, `@prisma/adapter-libsql`)  
**Testing**: Sin runner de tests automatizados en `package.json` actualmente; quality gates: TypeScript (compilación en `next build`) + ESLint (`bun run lint`) + verificación manual (ver `quickstart.md`)  
**Target Platform**: Web (SSR/RSC), despliegue típico en Vercel; navegadores modernos  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**:
- Perfil “utilizable” rápidamente (SC-005): evitar fetches HTTP internos innecesarios; preferir queries server-side.
- Streaming: usar patrón “shell estático + Suspense” para reducir sensación de espera en redes lentas.

**Constraints**:
- UI en español y tono “positive psychology”.
- No introducir nuevos colores hardcodeados (evitar `text-red-500`, `bg-purple-500`, etc.); usar tokens/semánticos.
- Mantener feature-first: cambios del Profile viven en `app/dashboard/profile/_components|_actions|_schemas`.
- Type safety estricta: evitar `any`, contratos explícitos en boundaries.

**Scale/Scope**:
- Alcance: Profile + ajustes de theme necesarios para soportar el look gamificado.
- Sin cambios de DB ni nuevas reglas de gamificación (solo lectura/presentación).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**I. Human-First Design** — PASS
- UI con jerarquía clara: identidad + progreso arriba, fortalezas y logros debajo.
- Estados vacíos/carga/error comprensibles (sin mensajes técnicos).

**II. Positive Psychology Foundation** — PASS
- Lenguaje motivacional y accionable (logros/empty state) sin “shaming”.
- Fortalezas presentadas como oportunidades de crecimiento.

**III. Feature-First Architecture** — PASS
- Los nuevos bloques UI se implementarán como componentes co-localizados.
- Código compartido solo si es verdaderamente transversal (p.ej. `components/gamification/*`).

**IV. AI-Augmented Insights** — PASS (no cambios)
- Esta feature no introduce nuevo output de IA.

**V. Type Safety & Explicit Contracts** — PASS
- View-models documentados en `data-model.md`.
- Si se expone endpoint para achievements, se mantiene contrato en OpenAPI.

Re-check post Phase 1 design: **PASS** (ver `research.md` + `data-model.md` + `contracts/openapi.yaml`).

## Project Structure

### Documentation (this feature)

```text
specs/006-gamified-profile-ui/
├── plan.md              # Este archivo
├── spec.md              # Requerimientos y escenarios
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── openapi.yaml     # Contratos mínimos (progress + achievements)
└── tasks.md             # Phase 2 output (/speckit.tasks) - no creado por /speckit.plan
```

### Source Code (repository root)

```text
app/
├── dashboard/
│   ├── profile/
│   │   ├── page.tsx
│   │   ├── _actions/
│   │   └── _components/
│   └── ...
├── api/
│   └── gamification/
│       └── progress/route.ts
└── globals.css

components/
├── gamification/
└── ui/

lib/
├── services/
├── types/
└── ...

prisma/
└── schema.prisma
```

**Structure Decision**: Next.js App Router feature-first. La implementación del Profile gamificado se divide en:
- `app/dashboard/profile/_actions/*`: composición de datos (view-models) y reglas de lectura
- `app/dashboard/profile/_components/*`: bloques UI (header gamificado, achievements, strengths, etc.)
- `components/gamification/*`: piezas existentes reutilizables cuando aplique
- `app/globals.css`: tokens nuevos para look gamificado

## Phase 0 — Outline & Research (COMPLETE)

Salida: `research.md`.

Decisiones clave:
- Progreso: server-first para render inicial; endpoint existente para widgets cliente.
- Achievements: contrato de “summary”; preferencia por server action; endpoint opcional.
- Theme: tokens “gamified” vía CSS variables.
- UI: patrón de Cache Components + Suspense.

## Phase 1 — Design & Contracts (COMPLETE)

Salidas:
- `data-model.md`: view-models tipados para progreso y achievements.
- `contracts/openapi.yaml`: contrato mínimo.
- `quickstart.md`: pasos de verificación manual y gates técnicos.

No hay cambios de Prisma/migrations en esta feature.

## Phase 2 — Implementation Plan (PLANNED)

### 2.1 Refactor del Profile a “shell + Suspense”

- `app/dashboard/profile/page.tsx`
  - Convertir a shell estático.
  - Renderizar skeleton inmediato y envolver contenido dinámico en `<Suspense>`.
- Crear un componente interno (p.ej. `ProfilePageContent`) que:
  - Obtenga sesión (si aplica) y datos runtime.
  - Ejecute server actions para: perfil + fortalezas + DNA + progreso + achievements.

### 2.2 View-models y acciones (SRP)

- Añadir acciones dedicadas en `app/dashboard/profile/_actions/`:
  - `getProfileGamificationProgress()`
  - `getProfileAchievementsSummary({ limit })`
  - (si ya existen acciones de perfil/fortalezas, reutilizar sin acoplar gamificación)

Reglas:
- Nada de Prisma en componentes.
- Tipos explícitos (posible Zod en boundaries si hay input externo).

### 2.3 UI gamificada (bloques)

- Nuevo bloque: `ProfileGamifiedHeader`
  - Identidad + `XpPreviewCard` (si encaja) o una variante más compacta.
  - Métricas legibles (nivel, XP dentro del nivel: `currentLevelXp / nextLevelXpRequired` + barra, racha).

- Nuevo bloque: `ProfileAchievementsCard`
  - Lista de recientes (3 por defecto) con icono + nombre.
  - Empty state: motivacional, explicando cómo conseguir la primera insignia.
  - CTA “Ver todo” → `/dashboard/development/badges`.
  - No mostrar “siguiente objetivo” ni % hacia el próximo logro.

- Fortalezas/DNA:
  - Rejerarquizar layout para claridad.
  - Mantener empty state existente (pero visualmente más “juego”).

- Edición de perfil:
  - Mantener comportamiento.
  - Actualizar estilos para consistencia tokenizada.

### 2.4 Theme tokens (sin hardcode)

- Extender `app/globals.css`:
  - Tokens `--gamified-*` (superficie hero, glow, gradient, border).
  - Variantes light/dark coherentes.
- Aplicar tokens en los nuevos bloques.

### 2.5 Endpoint achievements (opcional)

- Solo si un bloque cliente lo requiere:
  - Implementar `GET /api/gamification/achievements` acorde a `contracts/openapi.yaml`.
  - Mantener respuesta pequeña y cache-friendly.

### 2.6 Validación

- `bun run lint` y `bun run build`.
- Verificación manual guiada en `quickstart.md`.
- Accesibilidad básica:
  - Foco visible y navegación por teclado.
  - Texto con contraste suficiente en light/dark.

## Complexity Tracking

No hay violaciones intencionales de la Constitución en este plan.
