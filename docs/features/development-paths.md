# Rutas de Desarrollo de Fortalezas (Gamificadas)

## Descripción General

El módulo de Desarrollo de Fortalezas proporciona una experiencia gamificada para que los usuarios desarrollen sus fortalezas personales a través de módulos de aprendizaje interactivos, desafíos prácticos y un sistema de recompensas con XP y badges.

## Características Principales

### Sistema de Gamificación

- **XP (Puntos de Experiencia)**: Los usuarios ganan XP al completar desafíos y módulos
- **Niveles**: Sistema de progresión con 10+ niveles basados en XP acumulado
- **Badges (Insignias)**: Logros desbloqueables en 4 tiers: Bronce, Plata, Oro y Platino
- **Streaks (Rachas)**: Días consecutivos de actividad

### Módulos de Desarrollo

Los módulos están organizados por:

- **Nivel de dificultad**: Principiante, Intermedio, Avanzado
- **Fortalezas asociadas**: Cada módulo desarrolla fortalezas específicas
- **Tiempo estimado**: Duración aproximada en minutos

### Tipos de Desafíos

- **Reflexión**: Ejercicios de auto-reflexión con entrada de texto
- **Acción**: Tareas prácticas para aplicar en la vida real
- **Colaboración**: Actividades con compañeros de equipo

### Recomendaciones AI

El sistema utiliza GPT-4o-mini para generar recomendaciones personalizadas de módulos basadas en:

- Fortalezas del usuario
- Progreso actual
- Objetivos de desarrollo

## Estructura de Archivos

```
app/dashboard/development/
├── page.tsx                    # Página principal del dashboard
├── layout.tsx                  # Layout con providers
├── loading.tsx                 # Estado de carga (skeleton)
├── error.tsx                   # Manejo de errores
├── [moduleId]/
│   ├── page.tsx                # Página de módulo individual
│   └── loading.tsx             # Loading del módulo
├── _actions/                   # Server Actions
│   ├── index.ts                # Exportaciones públicas
│   ├── get-user-progress.ts    # Obtener progreso del usuario
│   ├── get-modules.ts          # Obtener lista de módulos
│   ├── get-badges.ts           # Obtener badges del usuario
│   ├── start-module.ts         # Iniciar un módulo
│   ├── complete-challenge.ts   # Completar un desafío
│   ├── complete-collaborative.ts # Completar desafío colaborativo
│   ├── get-ai-recommendations.ts # Obtener recomendaciones AI
│   └── ...                     # Más actions
├── _components/                # Componentes de UI
│   ├── index.ts                # Exportaciones
│   ├── stats-overview.tsx      # Vista general de estadísticas
│   ├── xp-bar.tsx              # Barra de progreso de XP
│   ├── level-badge.tsx         # Badge de nivel
│   ├── module-card.tsx         # Tarjeta de módulo
│   ├── module-list.tsx         # Lista de módulos con filtros
│   ├── challenge-card.tsx      # Tarjeta de desafío interactivo
│   ├── badge-showcase.tsx      # Galería de badges
│   ├── badge-unlock-modal.tsx  # Modal de desbloqueo de badge
│   ├── ai-recommendations.tsx  # Panel de recomendaciones AI
│   ├── peer-learners.tsx       # Compañeros de aprendizaje
│   └── ...                     # Más componentes
├── _schemas/                   # Esquemas Zod
│   ├── index.ts                # Exportaciones
│   └── development.schemas.ts  # Esquemas de validación
└── _hooks/                     # Custom hooks
    └── use-xp-animation.ts     # Animación de XP
```

## Servicios

### XP Calculator Service

Ubicación: `lib/services/xp-calculator.service.ts`

Funciones principales:

- `calculateTotalXp()`: Calcula XP total de un usuario
- `calculateXpForAction()`: Calcula XP por tipo de acción
- `formatXp()`: Formatea XP para visualización

### Level Calculator Service

Ubicación: `lib/services/level-calculator.service.ts`

Funciones principales:

- `calculateLevel()`: Determina nivel basado en XP
- `getXpRange()`: Obtiene rango de XP para un nivel
- `getLevelName()`: Nombre descriptivo del nivel
- `getLevelColor()`: Color del nivel para UI

### Badge Criteria Service

Ubicación: `lib/services/badge-criteria.service.ts`

Funciones principales:

- `parseBadgeCriteria()`: Parsea criterios JSON de badges
- `calculateBadgeProgress()`: Calcula progreso hacia un badge
- `getEligibleBadges()`: Obtiene badges disponibles para desbloquear
- `sortBadges()`: Ordena badges por prioridad

### AI Coach Service

Ubicación: `lib/services/ai-coach.service.ts`

Funciones principales:

- `getModuleRecommendations()`: Genera recomendaciones con cache
- `getPeerMatchRecommendations()`: Sugiere compañeros para colaboración

## Modelo de Datos

### Entidades Principales

- **DevelopmentModule**: Módulos de desarrollo con contenido
- **Challenge**: Desafíos individuales dentro de módulos
- **UserModuleProgress**: Progreso del usuario en módulos
- **UserChallengeProgress**: Progreso del usuario en desafíos
- **UserGamification**: XP, nivel y streaks del usuario
- **Badge**: Definición de badges disponibles
- **UserBadge**: Badges desbloqueados por usuarios
- **UserRecommendation**: Cache de recomendaciones AI

### Relaciones Clave

```
User 1──1 UserGamification 1──* UserBadge *──1 Badge
User 1──* UserModuleProgress *──1 DevelopmentModule 1──* Challenge
User 1──* UserChallengeProgress *──1 Challenge
```

## Seeders

Los datos iniciales se encuentran en:

- `prisma/data/development-modules.data.ts`: Módulos y desafíos
- `prisma/data/badges.data.ts`: Definiciones de badges

Para ejecutar los seeders:

```bash
bun run prisma:seed
```

## Configuración

### Variables de Entorno

```env
OPENAI_API_KEY=sk-...    # Requerido para recomendaciones AI
```

### Constantes de Configuración

Las constantes de gamificación se encuentran en:

- `lib/constants/xp.constants.ts`: Valores de XP por acción
- `lib/constants/level.constants.ts`: Niveles y rangos
- `lib/constants/badge.constants.ts`: Configuración de badges

## API de Recomendaciones

### Endpoint

Las recomendaciones se obtienen a través del Server Action `refreshAIRecommendations`.

### Caching

- TTL: 7 días por defecto
- Invalidación: Cuando cambian las fortalezas del usuario
- Refresh forzado: Disponible mediante botón en UI

### Modelo AI

- Provider: OpenAI
- Modelo: `gpt-4o-mini`
- Fallback: Recomendaciones basadas en reglas si AI falla

## Accesibilidad

El módulo implementa las siguientes características de accesibilidad:

- ARIA labels en progress bars y botones interactivos
- Navegación por teclado (Tab/Enter)
- Textos alternativos para iconos decorativos
- Estados de loading con skeletons
- Mensajes de error accesibles

## Performance

### Optimizaciones Implementadas

- **Caching de AI**: Recomendaciones cacheadas en DB
- **Optimistic UI**: Updates visuales inmediatos antes de confirmación del servidor
- **Lazy Loading**: Módulos y challenges cargados bajo demanda
- **Animaciones optimizadas**: Duración entre 0.2s-0.8s para mejor UX

### Métricas Objetivo

- Actualización de XP: < 2 segundos
- Carga inicial: < 3 segundos
- Refresh de recomendaciones: < 5 segundos

## Testing

### Archivos de Test

- `tests/development-paths/actions.spec.ts`: Tests de Server Actions
- `tests/development-paths/components.spec.ts`: Tests de componentes
- `tests/development-paths/services.spec.ts`: Tests de servicios

### Ejecutar Tests

```bash
bun test tests/development-paths/
```

## Roadmap Futuro

- [ ] Leaderboards por equipo
- [ ] Notificaciones push de logros
- [ ] Integración con calendario para desafíos
- [ ] Modo offline con sync
