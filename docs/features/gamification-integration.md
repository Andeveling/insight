# Feature 005: Gamificación para Assessment y Feedback

Esta documentación describe la integración de gamificación en los módulos de Assessment y Feedback de Insight.

## Resumen

La Feature 005 integra el sistema de gamificación existente con los flujos de evaluación (assessment) y retroalimentación entre pares (feedback), incentivando la participación activa de los usuarios mediante:

- **XP (Puntos de Experiencia)**: Recompensas por completar acciones
- **Badges (Insignias)**: Logros desbloqueables por hitos específicos
- **Streaks (Rachas)**: Bonificaciones por actividad continua
- **Niveles**: Progresión visual basada en XP acumulado

## Recompensas de XP

### Assessment

| Acción              | XP Base | Descripción                       |
| ------------------- | ------- | --------------------------------- |
| Fase 1 completada   | 100     | Primeras preguntas del assessment |
| Fase 2 completada   | 150     | Preguntas de profundización       |
| Assessment completo | 250     | Bonus por finalización            |
| Assessment retomado | 200     | Repetir evaluación tras feedback  |

**Total máximo primera vez:** 500 XP  
**Retake:** 200 XP

### Feedback

| Acción                 | XP Base | Descripción                              |
| ---------------------- | ------- | ---------------------------------------- |
| Feedback enviado       | 75      | Por responder a solicitud de feedback    |
| Feedback recibido      | 25      | Por cada feedback que recibes            |
| Insights desbloqueados | 50      | Bonus al alcanzar 3+ feedbacks recibidos |

## Badges (Insignias)

### Nuevas insignias de Assessment y Feedback

| Badge                 | Tier   | XP  | Criterio                             |
| --------------------- | ------ | --- | ------------------------------------ |
| 🔍 Explorador Interior | Bronce | 25  | Completar primera evaluación         |
| 🪞 Espejo Generoso     | Plata  | 75  | Dar 3 feedbacks en 30 días           |
| 👂 Escucha Activa      | Oro    | 150 | Recibir 10 feedbacks de compañeros   |
| 🦋 Evolución Continua  | Plata  | 75  | Retomar evaluación tras 2+ feedbacks |

## Arquitectura

### Principios

1. **Feature-First**: Cada módulo (assessment, feedback, development) es independiente
2. **Inversión de Dependencias**: Los módulos consumen del servicio compartido `lib/services/gamification.service.ts`
3. **No hay imports cruzados**: Assessment no importa de Feedback ni viceversa

### Estructura de archivos

```
lib/
├── services/
│   └── gamification.service.ts    # Servicio central de XP y badges
├── constants/
│   ├── xp-rewards.ts              # Constantes de XP por acción
│   └── xp-levels.ts               # Niveles y cálculos de progreso
└── types/
    └── gamification.types.ts      # Tipos compartidos

app/dashboard/
├── assessment/
│   ├── _actions/
│   │   └── award-assessment-xp.ts # Server actions de XP
│   └── _hooks/
│       └── use-assessment-xp.ts   # Hook cliente para XP
└── feedback/
    ├── _actions/
    │   └── award-feedback-xp.ts   # Server actions de XP
    └── _hooks/
        └── use-feedback-xp.ts     # Hook cliente para XP

components/gamification/
├── xp-gain-toast.tsx              # Toast animado de XP ganado
├── badge-unlock-modal.tsx         # Modal de badge desbloqueado
├── level-up-notification.tsx      # Notificación de subida de nivel
└── gamification-context-badge.tsx # Badge de progreso en contexto
```

### API Endpoint

```
GET /api/gamification/progress
```

Retorna:
```json
{
  "progress": {
    "userId": "string",
    "xpTotal": 1250,
    "currentLevel": 3,
    "currentLevelXp": 250,
    "nextLevelXpRequired": 250,
    "levelProgress": 50,
    "currentStreak": 3,
    "streakMultiplier": 1.1
  }
}
```

## Flujos de Usuario

### Assessment con XP

1. Usuario inicia assessment
2. Al completar Fase 1 → `awardAssessmentXp(sessionId, 'phase1')` → +100 XP
3. Al completar Fase 2 → `awardAssessmentXp(sessionId, 'phase2')` → +150 XP
4. Al finalizar → `awardAssessmentXp(sessionId, 'completion')` → +250 XP
5. Se muestra `XpGainToast` con animación
6. Si desbloquea badge → se muestra `BadgeUnlockModal`
7. Si sube de nivel → se muestra `LevelUpNotification`

### Feedback con XP

1. Usuario recibe solicitud de feedback
2. Ve `XpIncentiveBanner` mostrando "75 XP" como incentivo
3. Completa cuestionario de 5 preguntas
4. Al enviar → `awardFeedbackGivenXp(requestId)` → +75 XP al respondedor
5. Automáticamente → `awardFeedbackReceivedXpInternal(requestId)` → +25 XP al solicitante
6. Se muestra `XpGainToast` al respondedor
7. Si desbloquea badge → se muestra `BadgeUnlockModal`

## Idempotencia

Los awards de XP son idempotentes:

- **Assessment**: Tracking en `session.results.xpAwarded` por milestone
- **Feedback**: Verificación de `request.status === 'COMPLETED'` antes de otorgar

## Bonificaciones de Racha

| Días consecutivos | Multiplicador     |
| ----------------- | ----------------- |
| 1-2 días          | 1.0x              |
| 3-6 días          | 1.1x (10% bonus)  |
| 7-13 días         | 1.25x (25% bonus) |
| 14-29 días        | 1.5x (50% bonus)  |
| 30+ días          | 2.0x (100% bonus) |

## Componentes UI

### GamificationContextBadge

Muestra el nivel y XP actual del usuario en la esquina superior derecha de las páginas de assessment y feedback.

```tsx
import { GamificationContextBadge } from '@/components/gamification';

// Modo compacto (solo badge)
<GamificationContextBadge mode="compact" />

// Modo completo (con barra de XP)
<GamificationContextBadge mode="full" />
```

### XpGainToast

Toast animado que aparece al ganar XP.

```tsx
import { XpGainToast } from '@/components/gamification';

<XpGainToast
  xpAmount={75}
  source="feedback_given"
  streakBonus={1.1}
  onComplete={() => {}}
/>
```

### BadgeUnlockModal

Modal de celebración cuando se desbloquea un badge.

```tsx
import { BadgeUnlockModal } from '@/components/gamification';

<BadgeUnlockModal
  badge={{
    name: "Explorador Interior",
    description: "Completa tu primera evaluación",
    tier: "bronze",
    xpReward: 25,
    iconUrl: "🔍"
  }}
  open={showModal}
  onOpenChange={setShowModal}
/>
```

## Seed de Datos

Los 4 nuevos badges se crean ejecutando:

```bash
bun prisma db seed
```

Los badges están definidos en `prisma/data/badges.data.ts`.
