# Research: Gamification Integration for Assessment & Feedback

**Feature**: 005-gamification-integration  
**Date**: December 14, 2025

## Executive Summary

Esta investigación analiza cómo integrar el sistema de gamificación existente (Feature 004) con los módulos de Assessment y Feedback, respetando los principios SOLID y la arquitectura feature-first del proyecto.

## Research Questions Resolved

### 1. ¿Cómo compartir lógica de gamificación sin violar Dependency Inversion?

**Decision**: Crear un servicio unificado en `lib/services/gamification.service.ts`

**Rationale**: 
- Los servicios en `lib/` son la capa de abstracción que todos los features pueden consumir
- El servicio encapsula la lógica compleja de XP, niveles y badges
- Cada feature (assessment, feedback) tiene su propia action que llama al servicio

**Alternatives Considered**:
1. ~~Importar directamente de development/_actions~~ - Viola Dependency Inversion
2. ~~Duplicar código en cada feature~~ - Viola DRY
3. ~~Crear un middleware~~ - Sobre-ingeniería para este caso

### 2. ¿Cómo reutilizar componentes UI de gamificación?

**Decision**: Crear `components/gamification/` con versiones genéricas de los componentes

**Rationale**:
- Los componentes en `components/` son la capa UI compartida
- Se adaptan los componentes existentes de development para ser más genéricos
- Assessment y Feedback importan de `components/gamification/`, no de `development/_components/`

**Components to Share**:
- `XpGainToast` - Notificación de XP ganado
- `LevelUpNotification` - Modal de level-up
- `BadgeUnlockModal` - Celebración de badge
- `XpPreviewCard` - Preview de XP a ganar (nuevo)

### 3. ¿Qué estructura de datos usar para tracking de XP por fuente?

**Decision**: Extender tipos existentes sin cambiar schema Prisma

**Rationale**:
- `UserGamification.xpTotal` ya existe y es suficiente
- El source tracking se puede lograr via logs o eventos sin nueva tabla
- Simplicidad > Exhaustividad para MVP

**XP Source Types**:
```typescript
type XpSource = 
  | 'assessment_phase_1' | 'assessment_phase_2' | 'assessment_complete' | 'assessment_retake'
  | 'feedback_given' | 'feedback_received' | 'feedback_insights' | 'feedback_applied'
  | 'challenge_completed' | 'module_completed' | 'collaborative';
```

### 4. ¿Cómo manejar badges específicos de assessment/feedback?

**Decision**: Agregar badges al seed data existente con criterios específicos

**Rationale**:
- El modelo Badge ya soporta `unlockCriteria` como JSON string
- Los criterios se evalúan en `badge-criteria.service.ts`
- Solo se necesita agregar nuevos tipos de criterio

**New Badge Criteria Types**:
```typescript
type BadgeCriteriaType =
  | 'modules_completed' // Existente
  | 'challenges_completed' // Existente
  | 'xp_earned' // Existente
  | 'assessment_completed' // Nuevo
  | 'feedbacks_given' // Nuevo
  | 'feedbacks_received'; // Nuevo
```

### 5. ¿Cómo evitar XP duplicado por la misma acción?

**Decision**: Usar flags de "XP ya otorgado" en los registros existentes

**Rationale**:
- `AssessmentSession` puede tener campo `phaseXpAwarded: { 1: boolean, 2: boolean, 3: boolean }`
- `FeedbackResponse` puede tener campo `xpAwarded: boolean`
- Idempotencia sin tablas adicionales

**Implementation**:
```typescript
// En AssessmentSession.results (JSON existente)
{
  ...existingResults,
  xpAwarded: { phase1: true, phase2: true, completion: false }
}

// En FeedbackRequest/Response - campos opcionales
xpAwardedToProvider?: DateTime
xpAwardedToRequester?: DateTime
```

## Technical Decisions

### Servicio Unificado de Gamificación

```typescript
// lib/services/gamification.service.ts

export interface AwardXpParams {
  userId: string;
  amount: number;
  source: XpSource;
  applyStreakBonus?: boolean;
}

export interface AwardXpResult {
  xpAwarded: number;
  totalXp: number;
  previousLevel: number;
  newLevel: number;
  leveledUp: boolean;
}

/**
 * Awards XP to a user, handles streak bonuses, and returns level info
 */
export async function awardXp(params: AwardXpParams): Promise<AwardXpResult> {
  // 1. Get or create UserGamification record
  // 2. Calculate XP with streak bonus if applicable
  // 3. Update xpTotal and lastActivityDate
  // 4. Calculate level change
  // 5. Return result
}

/**
 * Checks for newly unlocked badges after an action
 */
export async function checkBadgeUnlocks(
  userId: string, 
  context: BadgeCheckContext
): Promise<UnlockedBadge[]> {
  // 1. Get all badges not yet unlocked by user
  // 2. Evaluate criteria against current user stats
  // 3. Unlock eligible badges
  // 4. Return newly unlocked badges
}
```

### Constantes de XP Separadas

```typescript
// lib/constants/xp-rewards.ts

export const ASSESSMENT_XP_REWARDS = {
  PHASE_1_COMPLETE: 100,
  PHASE_2_COMPLETE: 150,
  ASSESSMENT_COMPLETE: 250, // Bonus adicional
  ASSESSMENT_RETAKE: 200, // Reducido para retakes
} as const;

export const FEEDBACK_XP_REWARDS = {
  FEEDBACK_GIVEN: 75,
  FEEDBACK_RECEIVED: 25,
  INSIGHTS_UNLOCKED: 50, // Al alcanzar 3+ respuestas
  SUGGESTIONS_APPLIED: 30,
} as const;
```

### Componentes Compartidos

Los componentes de gamificación se mueven/copian a `components/gamification/`:

```typescript
// components/gamification/index.ts
export { XpGainToast } from './xp-gain-toast';
export { LevelUpNotification } from './level-up-notification';
export { BadgeUnlockModal } from './badge-unlock-modal';
export { XpPreviewCard } from './xp-preview-card';
```

**Diferencias con versiones de development**:
- Props más genéricas (no asumen contexto de "challenge" o "module")
- Mensajes configurables via props
- Estilos idénticos (reutilizan mismas clases Tailwind)

## Risks & Mitigations

| Risk                       | Impact            | Mitigation                                                         |
| -------------------------- | ----------------- | ------------------------------------------------------------------ |
| Duplicación de componentes | Mantenimiento     | Refactorizar development a usar components/gamification/ en futuro |
| Race conditions en XP      | Datos incorrectos | Transacciones Prisma atómicas                                      |
| Over-gamification fatiga   | UX negativa       | Límites de notificaciones, feedback sutil                          |

## Dependencies

### Internal Dependencies (ya implementados)
- ✅ `lib/services/xp-calculator.service.ts`
- ✅ `lib/services/level-calculator.service.ts`
- ✅ `lib/constants/xp-levels.ts`
- ✅ `lib/types/gamification.types.ts`
- ✅ `prisma/schema.prisma` (UserGamification, Badge, UserBadge)

### Features Dependencies
- ✅ Feature 002: Assessment (strength quiz) - Implementado
- ✅ Feature 001: Peer Feedback - Implementado
- ✅ Feature 004: Development Pathways (gamification base) - Implementado

## Conclusion

La integración es factible sin cambios significativos al schema o arquitectura existente. El enfoque principal es:

1. **Servicio unificado** en `lib/services/gamification.service.ts` para lógica compartida
2. **Componentes compartidos** en `components/gamification/` para UI reutilizable
3. **Actions feature-local** en cada módulo que consumen los servicios compartidos
4. **Sin cross-imports** entre features - cumple Dependency Inversion

La implementación se puede hacer en 4 fases con ~50 tareas estimadas.
