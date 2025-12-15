# Data Model: Gamified UI Refresh (Profile + Theme)

Esta feature no introduce cambios de base de datos. Define **view-models** (contratos de lectura) para componer la UI del Profile.

## View Models

### 1) `ProfileGamificationProgress`

**Source of truth**: `UserGamification` + cálculos derivados desde `lib/constants/xp-levels`.

Fields:
- `userId: string`
- `xpTotal: number`
- `currentLevel: number`
- `currentLevelXp: number` (derivado de XP total y rango del nivel)
- `nextLevelXpRequired: number` (derivado)
- `levelProgress: number` (0–100, derivado)
- `currentStreak: number`
- `streakMultiplier: number`

Validation rules:
- `xpTotal >= 0`
- `currentLevel >= 1`
- `0 <= levelProgress <= 100`

### 2) `ProfileAchievement`

Representa una recompensa visible en el Profile (insignia desbloqueada).

Fields:
- `badgeId: string`
- `badgeKey: string`
- `nameEs: string`
- `descriptionEs: string`
- `tier: "bronze" | "silver" | "gold" | "platinum"`
- `icon: string` (puede ser URL o emoji/texto; se documenta como “presentational icon”)
- `unlockedAt: string` (ISO timestamp)

### 3) `ProfileAchievementsSummary`

Fields:
- `unlockedCount: number`
- `totalCount: number`
- `recent: ProfileAchievement[]` (limitado por `limit`)

Validation rules:
- `unlockedCount >= 0`
- `totalCount >= unlockedCount`
- `recent.length <= limit`

## Entities (DB) involucradas (sin cambios)

- `UserGamification` (por usuario)
- `Badge` (catálogo)
- `UserBadge` (desbloqueos)

## Notes

- Evitar confiar en campos derivados almacenados si pueden estar desactualizados; calcular progreso con utilidades existentes.
- Para fronteras JSON (si se expone API), serializar fechas a ISO string.
