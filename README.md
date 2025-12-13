# Insight

A platform for personal and team strength assessment and development, designed to help individuals and organizations identify, understand, and enhance their unique abilities.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: Turso (libSQL) with Prisma ORM
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **AI**: AI SDK - OpenAI GPT-4o for report generation

## Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your secrets

# 3. Initialize database
bun run db:migrate

# 4. Start development server
bun run dev
```

## Documentation

- [Environment Setup](./docs/ENVIRONMENTS.md) - Complete guide for local, preview, and production environments
- [Database Guide](./prisma/README.md) - Prisma schema and migration instructions

## Scripts

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run db:migrate   # Run database migrations
bun run db:studio    # Open Prisma Studio
bun run db:seed      # Seed database with sample data
```

## Deployment

The project is deployed on Vercel with automatic deployments:

- **Production**: Pushes to `main` branch
- **Preview**: All other branches and PRs

See [Environment Setup](./docs/ENVIRONMENTS.md) for Vercel configuration. 