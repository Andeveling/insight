# Environment Configuration Guide

This document describes the environment setup for the **Insight** project, following Next.js and Vercel best practices.

## Overview

The project uses three environments:

| Environment     | Branch       | URL              | Purpose                             |
| --------------- | ------------ | ---------------- | ----------------------------------- |
| **Development** | Local        | `localhost:3000` | Local development with SQLite       |
| **Preview**     | Any non-main | `*.vercel.app`   | PR testing with Turso preview DB    |
| **Production**  | `main`       | `insight.app`    | Live application with Turso prod DB |

## Environment Variables

### Variable Load Order (Next.js)

Next.js loads environment variables in this order (first found wins):

1. `process.env` (system/Vercel)
2. `.env.$(NODE_ENV).local`
3. `.env.local` (skipped in test)
4. `.env.$(NODE_ENV)`
5. `.env`

### Variable Categories

#### 🔒 Secrets (NEVER commit)

These must be set per-environment and should **never** be committed:

| Variable             | Development  | Preview          | Production       |
| -------------------- | ------------ | ---------------- | ---------------- |
| `TURSO_DATABASE_URL` | Not needed   | Vercel Dashboard | Vercel Dashboard |
| `TURSO_AUTH_TOKEN`   | Not needed   | Vercel Dashboard | Vercel Dashboard |
| `BETTER_AUTH_SECRET` | `.env.local` | Vercel Dashboard | Vercel Dashboard |
| `OPENAI_API_KEY`     | `.env.local` | Vercel Dashboard | Vercel Dashboard |

#### 🌐 URL Configuration

| Variable          | Development             | Preview                 | Production                |
| ----------------- | ----------------------- | ----------------------- | ------------------------- |
| `BETTER_AUTH_URL` | `http://localhost:3000` | `https://${VERCEL_URL}` | `https://your-domain.com` |

#### 🛠️ CLI Only (Prisma)

| Variable             | Purpose               | Where             |
| -------------------- | --------------------- | ----------------- |
| `LOCAL_DATABASE_URL` | Prisma CLI migrations | `.env.local` only |

---

## Setup Instructions

### 1. Local Development

```bash
# 1. Copy environment template
cp .env.example .env.local

# 2. Edit .env.local with your values
# - Generate BETTER_AUTH_SECRET: openssl rand -base64 32
# - Add your OPENAI_API_KEY

# 3. Initialize local database
bun run db:migrate

# 4. Seed database (optional)
bun run db:seed

# 5. Start development server
bun run dev
```

**Local Database**: Uses SQLite via libSQL adapter at `./dev.db`

### 2. Vercel Preview Environment

Configure in Vercel Dashboard → Project Settings → Environment Variables:

```
Environment: Preview
─────────────────────────────────────────
TURSO_DATABASE_URL    = libsql://insight-preview-xxx.turso.io
TURSO_AUTH_TOKEN      = eyJ... (preview DB token)
BETTER_AUTH_SECRET    = (generate unique secret)
BETTER_AUTH_URL       = (leave empty - use dynamic VERCEL_URL)
OPENAI_API_KEY        = sk-... (can share with production)
```

### 3. Vercel Production Environment

Configure in Vercel Dashboard → Project Settings → Environment Variables:

```
Environment: Production
─────────────────────────────────────────
TURSO_DATABASE_URL    = libsql://insight-prod-xxx.turso.io
TURSO_AUTH_TOKEN      = eyJ... (production DB token)
BETTER_AUTH_SECRET    = (generate unique secret - DIFFERENT from preview!)
BETTER_AUTH_URL       = https://your-production-domain.com
OPENAI_API_KEY        = sk-...
```

---

## Database Architecture

### Local (Development)

```
┌─────────────────┐
│  Next.js App    │
│  (localhost)    │
└────────┬────────┘
         │ libSQL adapter
         ▼
┌─────────────────┐
│  SQLite File    │
│  ./dev.db       │
└─────────────────┘
```

### Vercel (Preview/Production)

```
┌─────────────────┐
│  Next.js App    │
│  (Vercel Edge)  │
└────────┬────────┘
         │ libSQL adapter + Auth Token
         ▼
┌─────────────────┐
│  Turso (libSQL) │
│  Cloud Database │
└─────────────────┘
```

---

## Database Migrations

### Local Development

```bash
# Create a new migration
bun run db:migrate

# Apply migrations and regenerate client
bun run db:generate

# Reset database (drops all data!)
bun run db:reset

# Open Prisma Studio
bun run db:studio
```

### Turso (Preview/Production)

Turso doesn't support Prisma's traditional migration flow. Use the custom script:

```bash
# Apply schema to Turso (requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN)
bun run db:migrate:turso

# Seed Turso database
bun run db:seed:turso
```

**Important**: Always test migrations locally first, then apply to Turso.

---

## Vercel Environment Variables Setup

### Via Dashboard (Recommended)

1. Go to your project in [Vercel Dashboard](https://vercel.com)
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with the appropriate environment scope:
   - ✓ Production
   - ✓ Preview  
   - ✗ Development (handled locally)

### Via CLI

```bash
# Pull existing variables
vercel env pull .env.local

# Add a new secret (interactive)
vercel env add TURSO_DATABASE_URL

# Add with specific environment
vercel env add TURSO_DATABASE_URL production
vercel env add TURSO_DATABASE_URL preview
```

---

## Troubleshooting

### Build Error: Missing `LOCAL_DATABASE_URL`

**Problem**: Build fails in Vercel with `PrismaConfigEnvError: Missing required environment variable: LOCAL_DATABASE_URL`

**Solution**: This variable is optional in `prisma.config.ts`. The fix has been applied - it defaults to `file:./dev.db` when not set.

### Authentication Redirect Issues

**Problem**: Auth redirects to wrong URL in preview/production

**Solution**: Ensure `BETTER_AUTH_URL` matches your deployment:
- Preview: Use dynamic URL or leave empty
- Production: Set to your exact production domain

### Database Connection Failed

**Problem**: Can't connect to Turso in preview/production

**Checklist**:
1. Verify `TURSO_DATABASE_URL` is correct (starts with `libsql://`)
2. Verify `TURSO_AUTH_TOKEN` is valid and not expired
3. Check the database exists in Turso dashboard
4. Ensure variables are set for the correct environment (Preview vs Production)

---

## Security Best Practices

1. **Never commit secrets** - All `.env*.local` files are gitignored
2. **Use different secrets per environment** - Each environment should have unique `BETTER_AUTH_SECRET`
3. **Rotate tokens periodically** - Regenerate Turso tokens and auth secrets quarterly
4. **Audit variable access** - Review who has access to Vercel environment variables
5. **Use HTTPS** - Always use `https://` in production URLs

---

## Quick Reference

### File Purposes

| File               | Committed | Purpose                     |
| ------------------ | --------- | --------------------------- |
| `.env.example`     | ✅ Yes     | Template with documentation |
| `.env.local`       | ❌ No      | Local development secrets   |
| `.env.development` | ✅ Yes     | Non-secret dev defaults     |
| `.env.production`  | ✅ Yes     | Non-secret prod defaults    |

### Commands

```bash
# Local development
bun run dev                 # Start dev server
bun run db:migrate          # Run migrations
bun run db:studio          # Open Prisma Studio

# Build & Deploy
bun run build               # Build for production
vercel --prod               # Deploy to production
vercel                      # Deploy to preview

# Environment management
vercel env pull             # Pull Vercel env vars
vercel env ls               # List env vars
```
