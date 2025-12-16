# Research: Development Module Refactor

**Feature**: 007-development-refactor  
**Date**: 2025-12-15  
**Status**: Complete

## Research Summary

Este documento consolida las decisiones técnicas tomadas durante la fase de investigación para el refactor del módulo de desarrollo.

---

## R1: Módulos Generales vs Personalizados - Estrategia de Almacenamiento

### Decision
Extender el modelo `DevelopmentModule` existente con un campo `moduleType` discriminador.

### Rationale
- **General modules**: `moduleType = 'general'`, `userId = null`, `strengthKey` obligatorio
- **Personalized modules**: `moduleType = 'personalized'`, `userId` obligatorio, `strengthKey` obligatorio
- Reutilización: Módulos generales se comparten automáticamente entre usuarios con la misma fortaleza

### Alternatives Considered
1. **Tablas separadas** (`GeneralModule`, `PersonalizedModule`) - Rechazada por duplicación de estructura y complejidad en queries
2. **Herencia Prisma** - No soportada nativamente en Prisma
3. **Campo discriminador** (elegida) - Simple, extensible, compatible con queries existentes

### Implementation Notes
```prisma
// Extensión al modelo existente
model DevelopmentModule {
  // ... campos existentes
  moduleType  String   @default("general") // "general" | "personalized"
  userId      String?  // Solo para personalizados
  user        User?    @relation(fields: [userId], references: [id])
  
  @@index([moduleType, strengthKey])
  @@index([userId, moduleType])
}
```

---

## R2: Progresión Secuencial - Lógica de Gate

### Decision
Implementar verificación antes de permitir generación de nuevos módulos.

### Rationale
- Query: `count(*) WHERE userId = ? AND status != 'completed'`
- Si count > 0, generación bloqueada
- UI: Botón deshabilitado con tooltip animado explicando qué módulos faltan

### Implementation Notes
```typescript
// check-can-generate.ts
export async function checkCanGenerateModule(userId: string) {
  const pending = await prisma.userModuleProgress.count({
    where: { userId, status: { not: 'completed' } }
  });
  
  return {
    canGenerate: pending === 0,
    pendingCount: pending,
    pendingModules: pending > 0 ? await getPendingModules(userId) : []
  };
}
```

### UX Considerations
- Mostrar progreso de módulos pendientes en tooltip
- Animación de "shake" en botón al hacer click cuando bloqueado
- Mensaje motivacional: "Completa X para desbloquear nuevos desafíos"

---

## R3: Cuestionario de Perfil Profesional - Schema

### Decision
Nueva tabla `UserProfessionalProfile` con campos mínimos esenciales.

### Rationale
Mantener el cuestionario corto (<2 minutos) para maximizar completion rate.

### Schema
```prisma
model UserProfessionalProfile {
  id            String   @id @default(uuid())
  userId        String   @unique
  
  // Core questions
  roleStatus    String   @default("neutral") // "satisfied" | "partially_satisfied" | "unsatisfied" | "neutral"
  currentRole   String?  // Rol actual del usuario
  industryContext String? // Industria/sector
  careerGoals   String?  // JSON array de metas
  
  // Metadata
  completedAt   DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Questions Flow
1. **¿Estás satisfecho con tu rol actual?** (Sí/Parcialmente/No/Prefiero no decir)
2. **¿Cuál es tu rol actual?** (Texto libre, opcional)
3. **¿Qué te gustaría lograr en los próximos 6 meses?** (Multiselect)
   - Mejorar en mi rol actual
   - Explorar nuevas responsabilidades
   - Cambiar de área
   - Liderar un equipo
   - Otro

---

## R4: Eliminación de Módulos de Dominio - Migración

### Decision
Soft-delete con flag `isArchived` + filtro en queries.

### Rationale
- Preserva datos históricos y progreso de usuarios
- Migración reversible si se cambia de opinión
- No requiere eliminar registros de `UserModuleProgress`

### Migration Script
```sql
-- Paso 1: Agregar campo isArchived
ALTER TABLE DevelopmentModule ADD COLUMN isArchived BOOLEAN DEFAULT false;

-- Paso 2: Archivar módulos de dominio (sin strengthKey)
UPDATE DevelopmentModule 
SET isArchived = true 
WHERE strengthKey IS NULL AND domainKey IS NOT NULL;

-- Paso 3: Actualizar queries existentes
-- WHERE isActive = true AND isArchived = false
```

### Query Update
```typescript
// get-modules.ts - actualización
const modules = await prisma.developmentModule.findMany({
  where: {
    isActive: true,
    isArchived: false,  // NEW
    // Solo módulos de fortaleza (no dominio)
    strengthKey: { not: null },
    OR: [
      { moduleType: 'general' },
      { moduleType: 'personalized', userId: session.user.id }
    ]
  }
});
```

---

## R5: Top 5 Strength Gate - Implementación

### Decision
Componente gate que verifica fortalezas antes de mostrar contenido.

### Rationale
- Verificar `UserStrength.count() WHERE userId = ?` >= 5
- Si no tiene Top 5, mostrar mensaje con CTA a assessment
- Componente reutilizable para otras features

### Component Structure
```tsx
// strength-gate.tsx
interface StrengthGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export async function StrengthGate({ children, fallback }: StrengthGateProps) {
  const session = await getSession();
  const strengthCount = await prisma.userStrength.count({
    where: { userId: session.user.id }
  });
  
  if (strengthCount < 5) {
    return fallback ?? <StrengthsRequiredMessage />;
  }
  
  return children;
}
```

---

## R6: Gaming Fluent Design - Motion Patterns

### Decision
Establecer patrones de animación consistentes usando motion/react.

### Animation Tokens
```typescript
// motion-tokens.ts
export const motionConfig = {
  // Entry animations
  fadeSlideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  },
  
  // Card hover
  cardHover: {
    whileHover: { y: -4, scale: 1.02 },
    transition: { type: "spring", stiffness: 400, damping: 25 }
  },
  
  // Progress bar
  progressBar: {
    initial: { width: 0 },
    animate: { width: "var(--progress)" },
    transition: { duration: 0.5, ease: "easeOut" }
  },
  
  // Badge unlock celebration
  badgeUnlock: {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    transition: { type: "spring", bounce: 0.5 }
  },
  
  // Stagger children
  stagger: {
    animate: { transition: { staggerChildren: 0.1 } }
  }
};
```

### Existing Components to Extend
- `/components/gamification/hexagonal-badge.tsx` - Para badges de tipo de módulo
- `/components/gamification/level-badge.tsx` - Ya usado en development
- `/components/gamification/xp-gain-toast.tsx` - Para feedback de progreso

---

## R7: AI Module Generation - Prompt Strategy

### Decision
Usar Vercel AI SDK con structured output para generación de módulos personalizados.

### Prompt Template
```typescript
const generatePersonalizedModulePrompt = (context: GenerationContext) => `
Eres un coach de desarrollo personal especializado en el enfoque de fortalezas.

**Usuario:**
- Fortaleza principal: ${context.strengthName} (${context.strengthNameEs})
- Definición: ${context.strengthDefinition}
- Situación laboral: ${context.roleStatus}
- Rol actual: ${context.currentRole || 'No especificado'}
- Metas: ${context.careerGoals?.join(', ') || 'No especificadas'}

**Tarea:**
Genera un módulo de desarrollo PERSONALIZADO para esta persona, considerando:
1. Su fortaleza específica
2. Su nivel de satisfacción laboral
3. Sus metas profesionales

El módulo debe:
- Ser práctico y aplicable a su contexto
- Incluir 3 desafíos (reflexión, acción, colaboración)
- Tomar ~15 minutos de completar
- Usar lenguaje en español, empoderador y específico

**Formato de salida (JSON):**
{
  "titleEs": "string - Título atractivo y específico",
  "descriptionEs": "string - Descripción breve (max 200 chars)",
  "content": "string - Contenido en Markdown",
  "challenges": [
    {
      "titleEs": "string",
      "descriptionEs": "string", 
      "type": "reflection" | "action" | "collaboration",
      "xpReward": number (10-30)
    }
  ],
  "estimatedMinutes": number (10-20),
  "xpReward": number (50-150)
}
`;
```

### Zod Schema for Validation
```typescript
const PersonalizedModuleOutputSchema = z.object({
  titleEs: z.string().min(10).max(100),
  descriptionEs: z.string().min(20).max(200),
  content: z.string().min(500),
  challenges: z.array(z.object({
    titleEs: z.string(),
    descriptionEs: z.string(),
    type: z.enum(['reflection', 'action', 'collaboration']),
    xpReward: z.number().min(10).max(30)
  })).length(3),
  estimatedMinutes: z.number().min(10).max(20),
  xpReward: z.number().min(50).max(150)
});
```

---

## Decisions Log

| ID | Topic | Decision | Date |
|----|-------|----------|------|
| R1 | Storage Strategy | Campo discriminador `moduleType` | 2025-12-15 |
| R2 | Progression Gate | Count query + disabled button | 2025-12-15 |
| R3 | Profile Schema | Nueva tabla `UserProfessionalProfile` | 2025-12-15 |
| R4 | Domain Removal | Soft-delete con `isArchived` | 2025-12-15 |
| R5 | Strength Gate | Componente server con fallback | 2025-12-15 |
| R6 | Motion Patterns | Tokens reutilizables definidos | 2025-12-15 |
| R7 | AI Generation | Structured output con Zod validation | 2025-12-15 |

---

## Next Steps

1. ✅ Research complete
2. → Proceed to Phase 1: Data Model & Contracts
3. → Generate `data-model.md` with Prisma schema changes
4. → Generate API contracts in `/contracts/`
5. → Create `quickstart.md` with implementation guide
