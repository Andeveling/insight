# Research: Contextual Reports System

**Feature**: 009-contextual-reports  
**Date**: 17 de diciembre de 2025  
**Status**: Complete

---

## Research Questions

### 1. ¿Qué actions de development se pueden reutilizar?

**Findings**:

El módulo `app/dashboard/development/_actions/` expone las siguientes funciones relevantes:

| Action | Signature | Uso para Readiness |
|--------|-----------|-------------------|
| `getUserProgress()` | `() => Promise<UserProgressResult>` | **Principal** - Retorna XP, level, modules/challenges completed, badges, streak |
| `getModules()` | `(options?) => Promise<GetModulesResult>` | Lista completa de módulos con estado de progreso |
| `getBadges()` | `() => Promise<BadgeGalleryResult>` | Badges desbloqueados del usuario |
| `getModulesCompletionStats()` | `(userId) => Promise<Stats>` | Stats agregados para cálculos de equipo |

**`UserProgressResult` interface**:
```typescript
interface UserProgressResult {
  xpTotal: number;
  formattedXp: string;
  xpToday: number;
  level: number;
  levelName: string;
  progressToNextLevel: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  isMaxLevel: boolean;
  modulesCompleted: number;
  modulesInProgress: number;
  challengesCompleted: number;
  totalChallenges: number;
  badgesUnlocked: number;
  totalBadges: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: Date | null;
  levelRoadmap: LevelRoadmapEntry[];
}
```

**Decision**: Importar directamente `getUserProgress()` desde `development/_actions`. Es la fuente única de verdad para stats de progreso. No crear wrappers innecesarios.

---

### 2. ¿Cómo funciona el flujo actual de generación de reportes?

**Findings**:

Analizado `generate-individual-report.action.ts`:

1. **Validación inicial**:
   - Verifica sesión de usuario
   - Carga usuario con strengths, profile, team

2. **Cache policy**:
   - Genera hash de fortalezas (`generateStrengthsHash()`)
   - Verifica reporte existente
   - Permite regenerar si: >30 días O cambio de fortalezas

3. **Generación**:
   - Construye `IndividualPromptContext` con datos del usuario
   - Llama `generateObject()` con Vercel AI SDK
   - Valida respuesta con `IndividualReportSchema` (Zod)
   - Guarda en DB con versión incremental

4. **Prompt context actual** (`IndividualPromptContext`):
```typescript
interface IndividualPromptContext {
  user: {
    name: string;
    email: string;
    profile?: { career, age, gender, description, hobbies };
    strengths: StrengthWithRank[];
  };
  team?: { name: string; role?: string };
}
```

**Integration point**: Extender `IndividualPromptContext` con campo `developmentProgress`:

```typescript
interface IndividualPromptContext {
  // ... existing fields
  developmentProgress?: {
    level: number;
    xpTotal: number;
    modulesCompleted: ModuleSummary[];
    challengesCompleted: number;
    badgesUnlocked: string[];
    currentStreak: number;
  };
}
```

**Decision**: Modificar el builder de prompts para incluir sección "Contexto de Desarrollo" solo cuando haya datos de progreso.

---

### 3. ¿Cómo integrar con el sistema de gamificación?

**Findings**:

El sistema de gamificación tiene estos entry points:

1. **Otorgar XP**: `lib/services/xp-calculator.service.ts`
   ```typescript
   awardXP(userId: string, amount: number, source: string)
   ```

2. **Check badge unlock**: `development/_actions/check-badge-unlock.ts`
   ```typescript
   checkBadgeUnlock(userId: string): Promise<UnlockedBadge[]>
   ```

3. **Badges en DB**: `prisma/data/badges.data.ts`
   - Estructura existente permite agregar nuevos badges

**Badges a crear**:

| Badge ID | Nombre | Descripción | Tier | XP Reward |
|----------|--------|-------------|------|-----------|
| `INSIGHT_INDIVIDUAL` | Insight Desbloqueado | Generaste tu primer reporte con contexto de desarrollo | SILVER | 50 |
| `INSIGHT_TEAM` | Insight de Equipo | Contribuiste al primer reporte contextualizado de tu equipo | BRONZE | 25 |

**Trigger point**: Después de `await prisma.report.update({ status: 'COMPLETED' })`, llamar:
1. `awardXP(userId, XP_AMOUNT, 'report_generation')`
2. `checkBadgeUnlock(userId)`

---

### 4. ¿Cuáles son los umbrales óptimos?

**Analysis**:

Revisando datos de seed y estructura de módulos:
- Existen 30 módulos en el sistema
- Cada módulo tiene ~4-6 challenges
- XP por challenge: 10-25 XP
- XP por módulo completo: ~50-100 XP bonus

**Cálculo de tiempo para alcanzar umbrales**:

| Umbral | Valor | Tiempo estimado | Justificación |
|--------|-------|-----------------|---------------|
| Módulos completados | 3 | 3-5 días | 1 módulo = ~30 min focused work |
| XP total | 100 | 2-3 días | ~4-5 challenges completados |
| Challenges completados | 5 | 2-3 días | Consistente con 100 XP |
| Fortalezas asignadas | Boolean | Prerequisito | Del assessment (ya existente) |

**Decision**: Los umbrales propuestos (3 módulos, 100 XP, 5 challenges) son alcanzables en 1 semana de uso moderado. Suficiente para generar contexto significativo sin frustrar usuarios nuevos.

---

### 5. ¿Cómo manejar reportes existentes sin contexto?

**Options considered**:

1. **Migración destructiva**: Invalidar reportes v1, forzar regeneración
   - ❌ Mala UX, usuarios pierden trabajo

2. **Versionado lado a lado**: v1 (sin contexto) y v2 (con contexto) coexisten
   - ✅ Mejor UX, permite comparación

3. **Badge de legacy**: Marcar reportes v1 con indicador visual
   - ✅ Transparente, incentiva regeneración

**Decision**: Opción 2 + 3. Los reportes existentes mantienen su valor pero muestran badge "Reporte Clásico". Nuevos reportes muestran badge "Reporte Contextualizado ✨". El botón "Actualizar con contexto" permite regenerar cuando el usuario cumpla requisitos.

---

## Alternatives Rejected

| Alternative | Reason Rejected |
|-------------|-----------------|
| Crear nueva tabla `ReportReadiness` en DB | Over-engineering; readiness es calculado, no persistido |
| Wrapper service sobre development actions | Innecesaria indirección; imports directos más claros |
| Bloqueo hard (error) si no cumple requisitos | Mala UX; mejor mostrar progreso hacia desbloqueo |
| Umbral de 5 módulos / 200 XP | Demasiado alto para nuevos usuarios; genera frustración |

---

## Key Decisions Summary

1. ✅ Reutilizar `getUserProgress()` como fuente única de stats
2. ✅ Extender `IndividualPromptContext` con `developmentProgress`
3. ✅ Crear 2 badges nuevos: `INSIGHT_INDIVIDUAL`, `INSIGHT_TEAM`
4. ✅ Umbrales: 3 módulos, 100 XP, 5 challenges (individual)
5. ✅ Umbrales: 60% miembros listos, 3 mínimo activos (equipo)
6. ✅ Versionado de reportes: v1 (legacy) vs v2 (contextualizado)
