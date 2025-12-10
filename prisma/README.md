# Prisma + Turso Database Setup

## Environment Configuration

This project uses **two database connections**:

1. **LOCAL_DATABASE_URL** (`file:./dev.db`) - Used by Prisma CLI for migrations
2. **TURSO_DATABASE_URL** + **TURSO_AUTH_TOKEN** - Used by the application at runtime

```env
# Local SQLite for Prisma CLI (migrations)
LOCAL_DATABASE_URL="file:./dev.db"

# Turso Remote Database (Production)
TURSO_DATABASE_URL="libsql://your-database.turso.io"
TURSO_AUTH_TOKEN="your-auth-token"
```

## Development Workflow

### 1. Create a new migration locally

```bash
bun run db:migrate --name <migration-name>
```

This creates migration files in `prisma/migrations/` and applies them to local SQLite.

### 2. Apply migrations to Turso (Production)

```bash
bun run db:migrate:turso
```

This applies pending migrations from `prisma/migrations/` to your Turso database.

### 3. Generate Prisma Client

```bash
bun run db:generate
```

## Available Commands

| Command                    | Description                           |
| -------------------------- | ------------------------------------- |
| `bun run db:generate`      | Generate Prisma Client                |
| `bun run db:migrate`       | Create and apply migrations locally   |
| `bun run db:migrate:turso` | Apply pending migrations to Turso     |
| `bun run db:seed:turso`    | Seed Turso database with initial data |
| `bun run db:studio`        | Open Prisma Studio                    |
| `bun run db:reset`         | Reset local database                  |

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Prisma CLI     │     │   Application   │
│  (migrations)   │     │   (runtime)     │
└────────┬────────┘     └────────┬────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  Local SQLite   │     │  Turso (libSQL) │
│  file:./dev.db  │     │  Remote DB      │
└─────────────────┘     └─────────────────┘
```

## Migration Tracking

Applied migrations to Turso are tracked in `.turso-migrations.json`.
This file should be committed to version control so the team knows which migrations have been applied.
