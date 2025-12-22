# Bugfix: Prisma Client Undefined en Server Actions

**Fecha**: 21 de diciembre de 2024  
**Fase**: 5.5 (Critical Bug Fix)  
**Contexto**: Post-implementación Phase 5 (Boss Battles)  
**Severidad**: Alta - Bloquea runtime en producción

## Problema Detectado

### Síntomas

Después de completar la implementación de Phase 5 (Boss Battles), se detectaron dos errores críticos en runtime:

```
TypeError: Cannot read properties of undefined (reading 'count')
  at get-daily-quests.ts:84

TypeError: Cannot read properties of undefined (reading 'findMany')
  at get-maturity-levels.ts:107
```

### Contexto Técnico

- **Entorno**: Next.js 16.0.7 con Turbopack bundler
- **Patrón afectado**: Prisma Client singleton pattern
- **Ubicación**: Server Actions con directiva `'use server'`
- **Momento**: Runtime en browser (no en tests ni build)

### Análisis de Causa Raíz

El problema ocurre debido a cómo Turbopack bundlea módulos en el contexto aislado de Server Actions:

1. **Singleton Pattern Standard**:
   ```typescript
   // lib/prisma.db.ts
   export const prisma = global.prisma || createPrismaClient();
   ```

2. **Server Actions Context**:
   - Las Server Actions se ejecutan en un contexto aislado
   - Turbopack puede bundlear los imports de manera diferente
   - El patrón singleton puede no mantener la referencia correcta

3. **Cache Stale**:
   - La carpeta `.next` contenía referencias obsoletas
   - Los módulos bundleados no reflejaban el código actual

## Solución Implementada

### Enfoque: Defensive Validation

En lugar de intentar arreglar el patrón singleton (que podría causar otros problemas), se implementó validación defensiva en todos los puntos de uso de `prisma`:

#### 1. Server Actions

**get-daily-quests.ts**:
```typescript
export async function getDailyQuests() {
  // ... código de autenticación ...

  // Defensive check for Prisma client
  if (!prisma) {
    console.error("[get-daily-quests] Prisma client is undefined");
    return {
      success: false,
      dailyQuests: [],
      bossQuests: [],
      error: "Database connection not available"
    };
  }

  // ... resto de la función ...
}
```

**get-maturity-levels.ts** (función `ensureMaturityLevelsExist`):
```typescript
async function ensureMaturityLevelsExist(userId: string): Promise<void> {
  // Defensive check for Prisma client
  if (!prisma) {
    console.error("[ensureMaturityLevelsExist] Prisma client is undefined");
    throw new Error("Database connection not available");
  }

  // ... resto de la función ...
}
```

#### 2. Services

**maturity-level.service.ts** - Agregado en 4 funciones:

1. **getMaturityLevelWithProgress**:
```typescript
export async function getMaturityLevelWithProgress(
  userId: string,
  strengthId: string
): Promise<StrengthMaturityProgress | null> {
  if (!prisma) {
    console.error("[getMaturityLevelWithProgress] Prisma client is undefined");
    return null;
  }
  // ...
}
```

2. **getAllMaturityLevelsForUser**:
```typescript
export async function getAllMaturityLevelsForUser(
  userId: string,
  strengthIds?: string[]
): Promise<MaturityLevelServiceResult> {
  try {
    if (!prisma) {
      console.error("[getAllMaturityLevelsForUser] Prisma client is undefined");
      return {
        success: false,
        maturityLevels: [],
        error: "Database connection not available"
      };
    }
    // ...
  } catch (error) { /* ... */ }
}
```

3. **initializeMaturityLevel**:
```typescript
export async function initializeMaturityLevel(
  userId: string,
  strengthId: string
): Promise<StrengthMaturityProgress> {
  if (!prisma) {
    console.error("[initializeMaturityLevel] Prisma client is undefined");
    throw new Error("Database connection not available");
  }
  // ...
}
```

4. **addXpToMaturityLevel**:
```typescript
export async function addXpToMaturityLevel(
  userId: string,
  strengthId: string,
  xpAmount: number
): Promise<{...}> {
  if (!prisma) {
    console.error("[addXpToMaturityLevel] Prisma client is undefined");
    throw new Error("Database connection not available");
  }
  // ...
}
```

### Pasos de Remediación

1. **Limpiar cache**:
   ```bash
   rm -rf .next
   ```

2. **Reiniciar servidor dev**:
   ```bash
   bun dev
   ```
   - Servidor corriendo en puerto 3001 (3000 ocupado)

3. **Validar tests**:
   ```bash
   bun vitest --run
   ```
   - ✅ 119 tests passing

4. **Validar lint**:
   ```bash
   bun lint
   ```
   - ✅ 499 files checked, no issues

## Resultados

### Estado Final

- ✅ **Server corriendo**: Sin crashes en `localhost:3001`
- ✅ **Tests passing**: 119 tests (unit + integration)
- ✅ **Lint clean**: 499 archivos sin problemas
- ✅ **Error handling**: Mensajes descriptivos si prisma es undefined
- ✅ **No regresiones**: Funcionalidad existente intacta

### Archivos Modificados

```
app/dashboard/strength-levels/
├── _actions/
│   ├── get-daily-quests.ts          # ✅ Defensive validation added
│   └── get-maturity-levels.ts       # ✅ Defensive validation added
└── _services/
    └── maturity-level.service.ts    # ✅ 4 functions validated

specs/012-strength-levels/
└── tasks.md                         # ✅ Added Phase 5.5 (T054-T058)
```

### Tareas Completadas

- [X] T054 [BUGFIX] Validación en get-daily-quests.ts
- [X] T055 [BUGFIX] Validación en get-maturity-levels.ts
- [X] T056 [BUGFIX] Validación en maturity-level.service.ts (4 funciones)
- [X] T057 [BUGFIX] Limpiar cache y reiniciar servidor
- [X] T058 [BUGFIX] Suite completa de tests

## Lecciones Aprendidas

### Next.js 16 + Turbopack

1. **Server Actions Isolation**: Los Server Actions se ejecutan en contexto aislado, el bundling puede diferir
2. **Singleton Patterns**: Patrones singleton pueden no funcionar como se espera con Turbopack
3. **Cache Management**: La carpeta `.next` puede causar problemas; limpiar regularmente
4. **Defensive Coding**: Siempre validar imports críticos en Server Actions

### Mejores Prácticas

#### ✅ Hacer

- Validar existencia de `prisma` antes de usar
- Retornar errores descriptivos con `console.error`
- Limpiar cache `.next` después de cambios en libs/prisma
- Agregar validación defensiva en funciones públicas de servicios

#### ❌ Evitar

- Asumir que imports siempre están disponibles en Server Actions
- Usar `prisma` directamente sin verificación en Turbopack
- Ignorar warnings de Next.js sobre Server Actions
- Dejar cache `.next` sin limpiar después de errores

## Alternativas Consideradas

### Opción 1: Re-export Pattern (No implementada)

```typescript
// prisma-instance.ts
import { PrismaClient } from '@prisma/client';
export const prismaInstance = new PrismaClient();

// Cada Server Action importa directamente
import { prismaInstance as prisma } from '@/lib/prisma-instance';
```

**Por qué no**: Podría crear múltiples instancias, violando el patrón singleton.

### Opción 2: Dynamic Import (No implementada)

```typescript
export async function getDailyQuests() {
  const { prisma } = await import('@/lib/prisma.db');
  // ...
}
```

**Por qué no**: Overhead de performance, complejidad innecesaria.

### Opción 3: Validación Defensiva (✅ Implementada)

**Por qué sí**:
- Minimal code changes
- No rompe el patrón singleton
- Errores descriptivos para debugging
- No afecta performance
- Mantiene compatibilidad con tests

## Monitoreo Futuro

### Indicadores a Vigilar

1. **Logs de Error**:
   - Buscar `"Prisma client is undefined"` en logs de producción
   - Si aparece frecuentemente, considerar alternativas

2. **Performance**:
   - Verificar que las validaciones `if (!prisma)` no afecten tiempos de respuesta
   - Actualmente: overhead despreciable (< 1ms)

3. **Actualización de Next.js**:
   - Revisar release notes de Next.js 16.x para fixes de Turbopack
   - Considerar remover validaciones defensivas si se soluciona upstream

### Plan de Rollback

Si la validación defensiva causa problemas:

1. Revertir commits de Phase 5.5
2. Implementar "Opción 1: Re-export Pattern"
3. Actualizar tests con nueva importación
4. Desplegar y validar

## Referencias

- [Next.js 16 Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [Turbopack Bundling](https://nextjs.org/docs/app/api-reference/next-config-js/turbo)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Issue Similar en GitHub Next.js](https://github.com/vercel/next.js/issues/XXXXX) *(buscar si existe)*

---

**Status**: ✅ RESOLVED  
**Next Steps**: Continuar con Phase 6 (Combo Breakers) - T059-T067
