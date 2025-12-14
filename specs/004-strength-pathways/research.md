# Research: Rutas de Desarrollo de Fortalezas (Gamificadas)

**Branch**: `004-strength-pathways` | **Date**: 14 de diciembre de 2025
**Phase**: Phase 0 - Technical Research & Decision Making

## Overview

Este documento consolida los hallazgos de la fase de investigación técnica (Phase 0) realizada antes del diseño detallado. Cada sección documenta decisiones técnicas clave, alternativas consideradas y la justificación de cada elección.

---

## RT-001: Sistema de Gamificación Base

### Pregunta de Investigación
¿Existe un sistema de gamificación (XP, badges, niveles) en el codebase actual o debe crearse desde cero?

### Hallazgos

**Estado Actual**: NO existe ningún sistema de gamificación en el codebase.

- **Búsqueda en Prisma Schema**: No hay modelos `UserGamification`, `Badge`, `Achievement`, `XP` o similares
- **Búsqueda en codebase**: Todas las referencias a gamificación están en documentos de planificación (specs, docs), no en código implementado
- **Relaciones en User model**: El modelo `User` tiene relaciones con `Profile`, `AssessmentSession`, `UserStrength`, `FeedbackRequest`, `SubTeam`, pero NO con gamificación

### Decisión

**Crear sistema de gamificación completo desde cero**

**Componentes a implementar**:
1. **Modelo `UserGamification`**: XP acumulado, nivel actual, racha de días consecutivos
2. **Modelo `Badge`**: Catálogo de insignias con criterios de desbloqueo
3. **Modelo `UserBadge`**: Relación many-to-many entre usuarios e insignias desbloqueadas
4. **Lógica de cálculo**: Función para calcular nivel basado en XP (estructura progresiva)
5. **Triggers de XP**: Server Actions que otorgan XP por completar desafíos, módulos, streaks

### Alternativas Consideradas

| Opción                               | Pros                                            | Cons                                    | Decisión           |
| ------------------------------------ | ----------------------------------------------- | --------------------------------------- | ------------------ |
| **Crear desde cero**                 | Control total, integración perfecta con dominio | Más trabajo inicial                     | ✅ **SELECCIONADA** |
| Usar librería (gamification.js)      | Implementación rápida                           | Dependencia externa, menor flexibilidad | ❌ Rechazada        |
| Servicio externo (Badgr, Accredible) | No mantener código                              | Costo recurrente, vendor lock-in        | ❌ Rechazada        |

### Implementación Base

```prisma
// prisma/schema.prisma
model UserGamification {
  id                   String   @id @default(uuid())
  userId               String   @unique
  xpTotal              Int      @default(0)
  currentLevel         Int      @default(1)
  currentLevelXp       Int      @default(0)
  nextLevelXpRequired  Int      @default(500)
  longestStreak        Int      @default(0)
  currentStreak        Int      @default(0)
  lastActivityDate     DateTime?
  modulesCompleted     Int      @default(0)
  challengesCompleted  Int      @default(0)
  collaborativeChallenges Int   @default(0)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  badges UserBadge[]
  
  @@index([userId])
  @@index([xpTotal])
  @@index([currentLevel])
}

model Badge {
  id               String   @id @default(uuid())
  key              String   @unique
  nameEs           String
  descriptionEs    String
  iconUrl          String
  tier             String   // "bronze", "silver", "gold", "platinum"
  unlockCriteria   String   // JSON: { type: "xp", threshold: 1000 }
  xpReward         Int      @default(0)
  isActive         Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  
  userBadges UserBadge[]
  
  @@index([key])
  @@index([tier])
}

model UserBadge {
  id                String   @id @default(uuid())
  userId            String
  badgeId           String
  unlockedAt        DateTime @default(now())
  
  user              UserGamification @relation(fields: [userId], references: [userId], onDelete: Cascade)
  badge             Badge            @relation(fields: [badgeId], references: [id], onDelete: Cascade)
  
  @@unique([userId, badgeId])
  @@index([userId])
  @@index([badgeId])
}
```

### Riesgos Identificados

1. **Performance**: Calcular XP y nivel en cada acción puede ser costoso
   - **Mitigación**: Usar campos denormalizados (`currentLevel`, `currentLevelXp`)
   
2. **Concurrencia**: Usuarios completando múltiples desafíos simultáneamente
   - **Mitigación**: Usar transacciones Prisma para actualizaciones atómicas

---

## RT-002: Estrategia de Almacenamiento de Contenido Educativo

### Pregunta de Investigación
¿Dónde almacenar el contenido educativo de los módulos (Markdown): base de datos, archivos locales, o CMS externo?

### Hallazgos

**Patrón actual del proyecto**: Datos estáticos en `/prisma/data/*.ts` con seeding

- **strengths.data.ts**: ~750 líneas, 68KB - contiene definiciones completas de fortalezas en TypeScript
- **domains.data.ts**: ~100 líneas - metadata de dominios con descripciones largas
- **cultures.data.ts, project-types.data.ts**: Similar patrón con contenido estructurado

**Turso/libSQL Capacidad**: SQLite nativo soporta campos TEXT de hasta 1GB sin problemas de rendimiento

**Next.js 16**: No hay uso de CMS externo (Contentful, Sanity) en el proyecto actual

### Decisión

**Almacenar contenido en base de datos con campo `content: String` en `DevelopmentModule`**

**Rationale**:
1. **Consistencia con patrón existente**: El proyecto ya usa este patrón para contenido largo (`Strength.fullDefinition`, `Domain.summary`)
2. **Simplicidad operativa**: No requiere sincronización entre archivos y DB
3. **Versionamiento**: Prisma migrations controlan cambios en contenido
4. **Queries eficientes**: Permite filtros SQL nativos por módulo, fortaleza, etc.
5. **Turso sin limitaciones**: SQLite maneja TEXT de hasta 1GB sin problemas

**Proceso de seeding**:
```typescript
// prisma/data/modules.data.ts
export const modulesData = [
  {
    key: "deliverer-intro",
    titleEs: "Introducción al Cumplidor",
    descriptionEs: "Descubre cómo tu fortaleza Cumplidor...",
    content: `# Bienvenido a la Fortaleza Cumplidor

Tu habilidad para cumplir promesas es única...

## Características Clave
- Fiabilidad inquebrantable
- Compromiso personal con cada promesa
- Motor de confianza en equipos

## Aplicación Práctica
...`, // Markdown completo aquí
    estimatedMinutes: 5,
    xpReward: 50,
    strengthKey: "Deliverer"
  }
  // ... más módulos
];
```

### Alternativas Consideradas

| Opción                           | Pros                                           | Cons                                               | Decisión                        |
| -------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ------------------------------- |
| **DB (Prisma)**                  | Simple, consistente, versionado con migrations | Contenido en código (no CMS visual)                | ✅ **SELECCIONADA**              |
| Archivos locales (/content/*.md) | Fácil editar con editor Markdown               | Requiere sincronización con DB, más complejidad    | ❌ Rechazada                     |
| CMS externo (Contentful)         | Editor visual, preview                         | Dependencia externa, costo adicional, latencia API | ❌ Rechazada - overkill para MVP |

### Implementación

```prisma
model DevelopmentModule {
  id                String   @id @default(uuid())
  key               String   @unique
  titleEs           String
  descriptionEs     String
  content           String   // Markdown completo
  estimatedMinutes  Int
  xpReward          Int
  order             Int
  strengthKey       String?
  domainKey         String?
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  challenges        Challenge[]
  userProgress      UserModuleProgress[]
  
  @@index([strengthKey])
  @@index([domainKey])
  @@index([order])
}
```

**Ventajas adicionales**:
- Fácil backup: dump de Turso incluye todo el contenido
- Sin dependencia de filesystem para deploys (Vercel Serverless Functions)
- Búsqueda full-text posible con extensiones SQLite si fuera necesario

### Plan de Migración Futura (si fuera necesario)

Si el contenido crece significativamente (>100 módulos con contenido muy largo), considerar:
1. **CMS Headless** (Contentful, Sanity): Para editor visual y colaboración de equipo de contenido
2. **Markdown en repo Git**: Con CI/CD que sincroniza a DB automáticamente

**Trigger para migración**: >50 módulos O >5 editores de contenido no-técnicos

---

## RT-003: Caché de Recomendaciones IA

### Pregunta de Investigación
¿Qué estrategia de caché usar para optimizar costos de OpenAI en recomendaciones de módulos personalizados?

### Hallazgos

**Patrón actual en el proyecto**: DB-based caching con regeneración controlada

- **generate-individual-report.action.ts**: Usa campo `content` en tabla `Report` como caché
- **Política de regeneración**: `canRegenerate()` valida tiempo mínimo (24hrs) y hash de fortalezas
- **Flag `fromCache`**: Indica si resultado viene de caché o generación nueva
- **Sin Redis/Upstash**: No hay infraestructura de caché distribuida

**Vercel AI SDK**: Soporta caching nativo pero requiere configuración manual

### Decisión

**Usar patrón DB-based caching existente con tabla `UserRecommendation`**

**Rationale**:
1. **Consistencia**: Mismo patrón que reportes (ya probado en producción)
2. **Sin dependencias externas**: No requiere Redis/Upstash ni infraestructura adicional
3. **Simplicidad**: Turso maneja reads rápidos (<50ms)
4. **Persistencia**: Recomendaciones sobreviven redeploys
5. **Auditoría**: Fácil rastrear cuándo y por qué se regeneraron recomendaciones

### Implementación

```prisma
model UserRecommendation {
  id                String   @id @default(uuid())
  userId            String
  recommendationType String   // "next-module", "challenge", "peer-match"
  recommendations   String   // JSON: [{ moduleId, reason, priority }]
  strengthsHash     String   // Hash MD5 de fortalezas actuales
  lastGeneratedAt   DateTime @default(now())
  expiresAt         DateTime // TTL: 7 días por defecto
  modelUsed         String   // "gpt-4o-mini"
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId, recommendationType])
  @@index([userId])
  @@index([expiresAt])
}
```

**Lógica de invalidación**:
```typescript
// _actions/get-recommendations.ts
"use server"

import { generateObject } from "ai";
import { createHash } from "crypto";

export async function getRecommendations(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { userStrengths: true }
  });
  
  const strengthsHash = createHash('md5')
    .update(JSON.stringify(user.userStrengths.map(s => s.strengthId).sort()))
    .digest('hex');
  
  const cachedRec = await prisma.userRecommendation.findUnique({
    where: { 
      userId_recommendationType: { 
        userId, 
        recommendationType: 'next-module' 
      } 
    }
  });
  
  // Usar caché si:
  // 1. Existe
  // 2. No ha expirado
  // 3. Hash de fortalezas coincide
  if (
    cachedRec && 
    cachedRec.expiresAt > new Date() &&
    cachedRec.strengthsHash === strengthsHash
  ) {
    return {
      success: true,
      recommendations: JSON.parse(cachedRec.recommendations),
      fromCache: true
    };
  }
  
  // Regenerar con AI
  const { object } = await generateObject({
    model: "gpt-4o-mini",
    schema: RecommendationSchema,
    prompt: `Recomienda 3 módulos para usuario con fortalezas: ${user.userStrengths.map(s => s.strengthId).join(', ')}`
  });
  
  // Guardar en caché
  await prisma.userRecommendation.upsert({
    where: { 
      userId_recommendationType: { userId, recommendationType: 'next-module' } 
    },
    update: {
      recommendations: JSON.stringify(object.recommendations),
      strengthsHash,
      lastGeneratedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      modelUsed: "gpt-4o-mini"
    },
    create: {
      userId,
      recommendationType: 'next-module',
      recommendations: JSON.stringify(object.recommendations),
      strengthsHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      modelUsed: "gpt-4o-mini"
    }
  });
  
  return {
    success: true,
    recommendations: object.recommendations,
    fromCache: false
  };
}
```

### Parámetros de Caché

| Parámetro                   | Valor                     | Justificación                                                    |
| --------------------------- | ------------------------- | ---------------------------------------------------------------- |
| **TTL Default**             | 7 días                    | Recomendaciones válidas hasta que usuario complete módulos       |
| **Invalidación por cambio** | Hash de fortalezas cambia | Si usuario ajusta fortalezas en Feedback 360°                    |
| **Modelo IA**               | gpt-4o-mini               | Costo-eficiente para recomendaciones (60x más barato que GPT-4o) |
| **Regeneración manual**     | Botón "Actualizar"        | Usuario puede forzar regeneración si quiere                      |

### Alternativas Consideradas

| Opción                 | Pros                             | Cons                                                                     | Decisión            |
| ---------------------- | -------------------------------- | ------------------------------------------------------------------------ | ------------------- |
| **DB caching (Turso)** | Simple, consistente, persistente | Latencia ~50ms (aceptable)                                               | ✅ **SELECCIONADA**  |
| Next.js unstable_cache | Built-in, rápido                 | Inestable (nombre sugiere), pierde caché en redeploy                     | ❌ Rechazada         |
| Redis/Upstash          | Muy rápido (<10ms), distribuido  | Dependencia externa, costo adicional                                     | ❌ Overkill para MVP |
| Sin caché              | Simple                           | Costo de OpenAI prohibitivo (~$0.10/request × 1000 users/day = $100/día) | ❌ No viable         |

### Estimación de Ahorro

**Escenario**: 500 usuarios activos, 3 requests de recomendación por usuario/semana

**Sin caché**:
- 500 users × 3 requests × 4 weeks = 6,000 requests/mes
- 6,000 × $0.10 = **$600/mes en costos de IA**

**Con caché (TTL 7 días)**:
- Primera request: generación con IA
- Siguientes 2 requests: desde caché
- 500 users × 1 generación × 4 weeks = 2,000 requests/mes
- 2,000 × $0.10 = **$200/mes** ⟹ **Ahorro: 67%**

---

## RT-004: Biblioteca de Animaciones

### Pregunta de Investigación
¿Qué biblioteca usar para animaciones de gamificación (XP bars, badge unlocks, confetti)?

### Hallazgos

**Estado actual**: Framer Motion 12.23.25 ya instalado en `bun.lock`

**Uso actual en proyecto**: No encontrado uso explícito, pero está en dependencias

### Decisión

**Usar Framer Motion (ya disponible)**

**Rationale**:
1. **Ya instalado**: No requiere nueva dependencia
2. **Maduro y probado**: 50K+ estrellas en GitHub, usado por Vercel, Stripe
3. **Performance**: Usa GPU acceleration, 60fps garantizado
4. **API declarativa**: Muy fácil de usar con React Server Components
5. **Variedad de efectos**: motion.div, AnimatePresence, useAnimation hooks

### Animaciones a Implementar

```typescript
// _components/xp-gain-toast.tsx
"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function XpGainToast({ amount }: { amount: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
    >
      <Sparkles className="w-5 h-5" />
      <span className="font-bold">+{amount} XP</span>
    </motion.div>
  );
}

// _components/badge-unlock-modal.tsx
export function BadgeUnlockModal({ badge }: { badge: Badge }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 20 
      }}
      className="w-32 h-32"
    >
      <img src={badge.iconUrl} alt={badge.nameEs} />
    </motion.div>
  );
}

// _components/progress-bar.tsx
export function ProgressBar({ current, max }: { current: number; max: number }) {
  const percentage = (current / max) * 100;
  
  return (
    <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="h-full bg-gradient-to-r from-primary to-primary/80"
      />
    </div>
  );
}
```

### Alternativas Consideradas

| Opción            | Pros                           | Cons                                   | Decisión                     |
| ----------------- | ------------------------------ | -------------------------------------- | ---------------------------- |
| **Framer Motion** | Ya instalado, completo, rápido | Bundle size ~30KB gzip                 | ✅ **SELECCIONADA**           |
| React Spring      | Physics-based, muy natural     | Más complejo, bundle ~40KB             | ❌ No necesario               |
| CSS Animations    | Cero JS, muy ligero            | Menos flexible, no programático        | ❌ Limitado para gamificación |
| GSAP              | Muy poderoso, usado en gaming  | Licencia comercial ($99/año), overkill | ❌ Rechazada                  |

### Performance Target

**Objetivo**: Todas las animaciones < 300ms, 60fps

**Validación**: Usar Chrome DevTools Performance profiler para verificar:
- No frame drops durante animaciones
- GPU acceleration activa (transform, opacity)
- No reflows/repaints costosos

---

## RT-005: Sincronización de Desafíos Colaborativos

### Pregunta de Investigación
¿Cómo sincronizar confirmación dual de desafíos colaborativos (Usuario A completa + Usuario B confirma)?

### Hallazgos

**Patrón actual**: Sin sincronización en tiempo real en el proyecto

- No hay WebSockets, Server-Sent Events, ni Pusher implementados
- El proyecto usa Server Actions con `revalidatePath` para invalidar caché de Next.js
- `eventsource-parser` existe pero solo para streaming de respuestas del AI SDK

### Decisión

**MVP: Modelo asíncrono con notificaciones + polling opcional**

**Rationale**:
1. **Simplicidad**: No requiere infraestructura de WebSockets
2. **Consistente**: Mismo patrón que Feedback 360° (usuario A solicita, B responde)
3. **Escalable**: Polling es opcional, no bloquea funcionalidad core
4. **Serverless-friendly**: Compatible con Vercel Functions (sin conexiones persistentes)

### Implementación

```prisma
model CollaborativeChallenge {
  id                String   @id @default(uuid())
  challengeId       String
  initiatorUserId   String
  partnerUserId     String
  initiatorCompleted Boolean  @default(false)
  partnerCompleted   Boolean  @default(false)
  initiatorCompletedAt DateTime?
  partnerCompletedAt   DateTime?
  xpBonusAwarded     Int?
  status             String   @default("PENDING") // PENDING, CONFIRMED, EXPIRED
  expiresAt          DateTime
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  
  challenge       Challenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)
  initiatorUser   User      @relation("InitiatorChallenges", fields: [initiatorUserId], references: [id], onDelete: Cascade)
  partnerUser     User      @relation("PartnerChallenges", fields: [partnerUserId], references: [id], onDelete: Cascade)
  
  @@unique([challengeId, initiatorUserId, partnerUserId])
  @@index([initiatorUserId])
  @@index([partnerUserId])
  @@index([status])
}
```

**Flujo de Usuario**:

1. **Usuario A completa desafío colaborativo**:
   ```typescript
   // _actions/complete-collaborative.ts
   export async function completeCollaborativeChallenge(
     challengeId: string, 
     partnerUserId: string
   ) {
     const session = await getSession();
     
     // Crear o actualizar registro
     const collab = await prisma.collaborativeChallenge.upsert({
       where: {
         challengeId_initiatorUserId_partnerUserId: {
           challengeId,
           initiatorUserId: session.user.id,
           partnerUserId
         }
       },
       update: {
         initiatorCompleted: true,
         initiatorCompletedAt: new Date()
       },
       create: {
         challengeId,
         initiatorUserId: session.user.id,
         partnerUserId,
         initiatorCompleted: true,
         initiatorCompletedAt: new Date(),
         expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
       }
     });
     
     // Enviar notificación a partner (email/in-app)
     await sendCollaborativeNotification(partnerUserId, {
       type: "COLLABORATIVE_REQUEST",
       from: session.user.name,
       challengeId
     });
     
     return { success: true, requiresConfirmation: true };
   }
   ```

2. **Usuario B recibe notificación** (email o in-app notification badge)

3. **Usuario B confirma su parte**:
   ```typescript
   export async function confirmCollaborativeChallenge(collabId: string) {
     const session = await getSession();
     
     const collab = await prisma.collaborativeChallenge.update({
       where: { id: collabId },
       data: {
         partnerCompleted: true,
         partnerCompletedAt: new Date(),
         status: "CONFIRMED"
       }
     });
     
     // Si ambos completaron, otorgar bonus XP
     if (collab.initiatorCompleted && collab.partnerCompleted) {
       await awardCollaborativeBonus(collabId);
     }
     
     return { success: true, xpAwarded: collab.xpBonusAwarded };
   }
   ```

**UI Feedback**:
- Usuario A ve estado "Esperando confirmación de [Nombre]"
- Usuario B ve notificación badge en navbar
- Cuando B confirma, A recibe actualización en próximo page load

### Alternativas Consideradas

| Opción                     | Pros                              | Cons                                                                      | Decisión                    |
| -------------------------- | --------------------------------- | ------------------------------------------------------------------------- | --------------------------- |
| **Async + Notificaciones** | Simple, serverless-compatible     | No real-time                                                              | ✅ **SELECCIONADA para MVP** |
| Polling cada 30s           | Pseudo real-time                  | Carga en servidor                                                         | ⏸️ Nice-to-have opcional     |
| WebSockets                 | Real-time perfecto                | Requiere infraestructura persistente, no compatible con Vercel Serverless | ❌ Overkill para MVP         |
| Server-Sent Events         | Unidireccional, más simple que WS | Aún requiere conexiones persistentes                                      | ❌ Similar problema a WS     |
| Pusher/Ably                | Managed, fácil implementar        | Costo adicional ($29+/mes), vendor lock-in                                | ❌ Innecesario para MVP      |

### Plan de Mejora Futura (Post-MVP)

Si la funcionalidad colaborativa es altamente usada (>30% de usuarios), considerar:

1. **Polling ligero** (Phase 2):
   ```typescript
   // Hook para polling opcional
   function useCollaborativeStatus(collabId: string) {
     const [status, setStatus] = useState("PENDING");
     
     useEffect(() => {
       const interval = setInterval(async () => {
         const res = await fetch(`/api/collaborative/${collabId}/status`);
         const data = await res.json();
         setStatus(data.status);
         
         if (data.status === "CONFIRMED") {
           clearInterval(interval);
         }
       }, 30000); // 30 segundos
       
       return () => clearInterval(interval);
     }, [collabId]);
     
     return status;
   }
   ```

2. **Vercel Edge Functions + Polling** (Phase 3): Para reducir latencia

3. **WebSockets con Soketi self-hosted** (Phase 4): Si escala crítico requiere real-time

**Trigger para upgrade**: >50% de usuarios reportan frustración con delay de confirmación

---

## RT-006: Preparación para Internacionalización (Nice-to-Have)

### Pregunta de Investigación
¿Preparar el sistema para soporte multiidioma futuro con next-intl o react-i18next?

### Hallazgos

**Estado actual**: TODO el contenido es español hardcoded

- No hay infraestructura de i18n en el proyecto
- El spec define que "All UI must be in Spanish" es un constraint

### Recomendación

**NO implementar i18n en MVP, pero preparar arquitectura**

**Razones**:
1. **Constraint explícito**: Spanish-only es requisito actual
2. **Simplicidad**: i18n agrega complejidad innecesaria para MVP
3. **Costo-beneficio**: Tiempo mejor usado en features core

**Preparación arquitectural** (sin costo de implementación):

```typescript
// lib/types/module.types.ts
// Usar sufijo "Es" en todos los campos de texto
export interface DevelopmentModule {
  titleEs: string;        // ✅ Preparado para titleEn en futuro
  descriptionEs: string;  // ✅ Preparado para descriptionEn
  content: string;        // Markdown - puede tener campo contentEn después
}

// prisma/schema.prisma
model Badge {
  nameEs        String  // ✅ Agregar nameEn en migración futura sin breaking changes
  descriptionEs String
}
```

### Plan de Migración Futura (si fuera necesario)

**Trigger para implementar i18n**: Pedido explícito de mercado internacional (US, Latam)

**Stack recomendado**:
- **next-intl**: Mejor integración con Next.js App Router
- **Crowdin**: Para gestión de traducciones colaborativa
- **Migración**: Agregar campos `*En` sin eliminar `*Es`, luego usar locale cookie

**Costo estimado**: ~2-3 sprints para traducir todo el contenido y actualizar UI

---

## Resumen de Decisiones

| Research Task              | Decisión                                              | Impacto                        | Prioridad      |
| -------------------------- | ----------------------------------------------------- | ------------------------------ | -------------- |
| **RT-001: Gamificación**   | Crear desde cero (UserGamification, Badge, UserBadge) | Alto - Core feature            | 🔴 P0           |
| **RT-002: Contenido**      | Almacenar en DB (campo `content: String`)             | Medio - Afecta seeding         | 🟡 P1           |
| **RT-003: Caché IA**       | DB-based caching con TTL 7 días                       | Alto - Optimización costos     | 🔴 P0           |
| **RT-004: Animaciones**    | Framer Motion (ya instalado)                          | Bajo - UX enhancement          | 🟢 P2           |
| **RT-005: Sincronización** | Async + notificaciones (sin WebSockets)               | Medio - Afecta UX colaborativa | 🟡 P1           |
| **RT-006: i18n**           | NO implementar en MVP, solo preparar                  | Bajo - Futuro                  | ⚪ Nice-to-have |

---

## Próximos Pasos (Phase 1)

Con todas las decisiones técnicas tomadas, podemos proceder a:

1. ✅ **Phase 0 Complete** - Todas las incertidumbres técnicas resueltas
2. ⏭️ **Phase 1: Design** - Crear `data-model.md` con schema Prisma completo de los 6 modelos
3. ⏭️ **Phase 1: Contracts** - Documentar contratos de Server Actions y Component Props
4. ⏭️ **Phase 1: Quickstart** - Guía de setup para developers

**Branch actual**: `004-strength-pathways` | **Ready for Phase 1**: ✅ YES

---

## Referencias Técnicas

- [Turso libSQL Documentation](https://docs.turso.tech/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Vercel AI SDK - Caching](https://sdk.vercel.ai/docs/ai-sdk-core/caching)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Next.js 16 Cache Components](https://nextjs.org/docs/app/getting-started/cache-components)

