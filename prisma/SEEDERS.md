# 🌱 Guía de Seeders para Turso

## 🎯 Objetivo

Este documento explica cómo ejecutar los seeders de la base de datos tanto en desarrollo local (SQLite) como en producción (Turso).

## 📦 Prerequisitos

1. Variables de entorno configuradas en `.env`:
   ```env
   TURSO_DATABASE_URL="libsql://insights-vercel-icfg-uwi8w2qjh0fyicqca7jqbzxj.aws-us-east-1.turso.io"
   TURSO_AUTH_TOKEN="eyJhbGci..."
   ```

2. Cliente Prisma generado:
   ```bash
   pnpm db:generate
   ```

## 🚀 Ejecución de Seeders

### Opción 1: Script Automatizado (RECOMENDADO)

Este script aplica el schema Y ejecuta los seeders en un solo comando:

```bash
./scripts/turso-migrate.sh
```

El script hará:
1. ✅ Verificar variables de entorno
2. 📦 Generar cliente Prisma
3. 🗄️ Aplicar schema a Turso con `prisma db push`
4. 🌱 Preguntar si deseas ejecutar seeders
5. ✅ Ejecutar seeders si confirmas

### Opción 2: Comandos Manuales

#### Para Turso (Producción):

```bash
# 1. Aplicar schema a Turso
pnpm db:push

# 2. Ejecutar seeders en Turso
pnpm db:seed:turso
```

#### Para SQLite Local (Desarrollo):

```bash
# 1. Aplicar schema localmente
pnpm db:push

# 2. Ejecutar seeders localmente
pnpm db:seed
```

## 🔍 ¿Cómo sabe el seeder a qué base conectarse?

El script `prisma/seed.ts` detecta automáticamente:

```typescript
// Si encuentra TURSO_DATABASE_URL → conecta a Turso
// Si no → conecta a SQLite local
const databaseUrl = process.env.TURSO_DATABASE_URL || 
                    process.env.DATABASE_URL || 
                    'file:./prisma/dev.db'
```

## 📊 Datos que se seedean

Los seeders poblan las siguientes tablas en orden:

1. **Domains** - Dominios de fortalezas (Doing, Feeling, Motivating, Thinking)
2. **Strengths** - Catálogo de 34 fortalezas
3. **Focus** - Ejes de cultura (Action, Reflection, Results, People)
4. **Cultures** - Culturas de equipo (Execution, Influence, Strategy, Cohesion)
5. **Teams** - Equipos de ejemplo
6. **UserProfiles** - Perfiles de usuario de ejemplo8. **DevelopmentModules** - Módulos de desarrollo de fortalezas
9. **Challenges** - Desafíos dentro de cada módulo
10. **Badges** - Insignias desbloqueables en el sistema de gamificación

### Datos de Gamificación

Los seeders de gamificación se encuentran en:

```
prisma/data/
├── development-modules.data.ts  # Módulos y challenges
└── badges.data.ts               # Definiciones de badges
```

#### Módulos de Desarrollo

Cada módulo incluye:

- **titleEs/descriptionEs**: Contenido en español
- **level**: "beginner" | "intermediate" | "advanced"
- **estimatedMinutes**: Tiempo estimado
- **xpReward**: XP al completar
- **challenges**: Lista de desafíos anidados

#### Badges

Las insignias están organizadas por tiers:

| Tier | Ejemplo | XP Reward |
|------|---------|-----------|
| Bronze | Primer Paso | 25-50 XP |
| Silver | Explorador | 75-100 XP |
| Gold | Maestro | 150-200 XP |
| Platinum | Leyenda | 250-500 XP |

Los criterios de desbloqueo (`unlockCriteria`) son JSON strings que definen:

```json
{
  "type": "modules_completed",
  "value": 3,
  "description": "Completar 3 módulos"
}
```

Tipos de criterios soportados:

- `modules_completed`: Número de módulos completados
- `challenges_completed`: Número de desafíos completados
- `xp_earned`: XP total acumulado
- `streak_days`: Días consecutivos de actividad
- `level_reached`: Nivel alcanzado
## ✅ Verificación

Después de ejecutar los seeders, deberías ver:

```
📦 Connecting to database: Turso (Remote)
🚀 Starting database seeding...

✅ Seeded 4 domains
✅ Seeded 34 strengths
✅ Seeded 4 focus axes
✅ Seeded 4 cultures
✅ Seeded 2 teams
✅ Seeded 6 user profiles

✨ Database seeding completed successfully!
🔌 Disconnected from database
```

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/adapter-libsql'"

```bash
pnpm install
```

### Error: "TURSO_AUTH_TOKEN is required"

Verifica que tu archivo `.env` tenga las credenciales correctas:

```bash
cat .env | grep TURSO
```

### Error: "Table already exists"

Si las tablas ya existen pero quieres repoblarlas:

```bash
# Opción 1: Limpiar datos manualmente en Turso Dashboard
# Opción 2: Modificar los seeders para hacer upsert en lugar de create
```

### Ver los datos en Turso

Usa la consola de Turso:

```bash
# Instalar Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Conectarse a tu base de datos
turso db shell insights-vercel-icfg-uwi8w2qjh0fyicqca7jqbzxj

# Ver datos
SELECT COUNT(*) FROM Domain;
SELECT COUNT(*) FROM Strength;
SELECT * FROM Team;
```

## 📝 Notas Importantes

- Los seeders son **idempotentes** cuando se ejecutan por primera vez
- Si intentas ejecutarlos dos veces, pueden fallar por violación de constraints únicos
- Para producción en Vercel, los seeders se ejecutan **manualmente**, no en el build
- El comando `prisma db push` sincroniza el schema sin crear archivos de migración

## 🎯 Resumen de Comandos

```bash
# Desarrollo local
pnpm db:push && pnpm db:seed

# Turso (con variables de entorno)
pnpm db:push && pnpm db:seed:turso

# Todo automatizado
./scripts/turso-migrate.sh
```
