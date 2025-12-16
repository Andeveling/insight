# Data Model: Development Module Refactor

**Feature**: 007-development-refactor  
**Date**: 2025-12-15  
**Status**: Complete

## Overview

Este documento define los cambios al modelo de datos para soportar:
1. Dos tipos de módulos (general/personalizado)
2. Perfil profesional del usuario
3. Archivado de módulos de dominio
4. Relaciones actualizadas para filtrado por Top 5

---

## Schema Changes

### 1. DevelopmentModule - Extensión

```prisma
model DevelopmentModule {
  id               String   @id @default(uuid())
  key              String   @unique
  titleEs          String
  descriptionEs    String
  content          String   // Markdown content
  estimatedMinutes Int
  xpReward         Int
  level            String   // "beginner", "intermediate", "advanced"
  strengthKey      String?  // Required for strength-based modules
  domainKey        String?  // Deprecated: will be archived
  order            Int      @default(0)
  isActive         Boolean  @default(true)
  
  // NEW FIELDS
  moduleType       String   @default("general") // "general" | "personalized"
  userId           String?  // Only for personalized modules
  isArchived       Boolean  @default(false) // For soft-delete of domain modules
  generatedBy      String?  // AI model used (for personalized)
  
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  // Relations
  challenges       Challenge[]
  userProgress     UserModuleProgress[]
  user             User?    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([strengthKey])
  @@index([domainKey])
  @@index([level])
  @@index([order])
  @@index([moduleType, strengthKey]) // NEW: For filtering by type
  @@index([userId, moduleType])      // NEW: For user's personalized modules
  @@index([isArchived])              // NEW: For filtering archived
}
```

### 2. UserProfessionalProfile - Nueva Tabla

```prisma
model UserProfessionalProfile {
  id              String    @id @default(uuid())
  userId          String    @unique
  
  // Core Profile Fields
  roleStatus      String    @default("neutral") // "satisfied" | "partially_satisfied" | "unsatisfied" | "neutral"
  currentRole     String?   // Free text: user's current job title/role
  industryContext String?   // Free text: industry/sector
  careerGoals     String?   // JSON array of goal strings
  
  // Onboarding Status
  completedAt     DateTime? // When user finished the questionnaire
  skippedAt       DateTime? // When user skipped (if allowed)
  
  // Audit Fields
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([roleStatus])
}
```

### 3. User Model - Nueva Relación

```prisma
model User {
  // ... existing fields ...
  
  // Existing relations
  profile              UserProfile?
  dna                  UserDNA?
  userStrengths        UserStrength[]
  gamification         UserGamification?
  moduleProgress       UserModuleProgress[]
  // ... other existing relations ...
  
  // NEW RELATIONS
  professionalProfile  UserProfessionalProfile?
  personalizedModules  DevelopmentModule[]  // Modules created for this user
}
```

---

## Migration Plan

### Migration 1: Add Module Type Fields

```sql
-- Migration: add_module_type_and_archived
-- Description: Adds moduleType, userId, isArchived fields to DevelopmentModule

-- Step 1: Add new columns with defaults
ALTER TABLE DevelopmentModule ADD COLUMN moduleType TEXT DEFAULT 'general';
ALTER TABLE DevelopmentModule ADD COLUMN userId TEXT;
ALTER TABLE DevelopmentModule ADD COLUMN isArchived INTEGER DEFAULT 0;
ALTER TABLE DevelopmentModule ADD COLUMN generatedBy TEXT;

-- Step 2: Create indexes
CREATE INDEX idx_development_module_type_strength ON DevelopmentModule(moduleType, strengthKey);
CREATE INDEX idx_development_module_user_type ON DevelopmentModule(userId, moduleType);
CREATE INDEX idx_development_module_archived ON DevelopmentModule(isArchived);

-- Step 3: Archive domain-only modules (no strengthKey)
UPDATE DevelopmentModule 
SET isArchived = 1 
WHERE strengthKey IS NULL AND domainKey IS NOT NULL;
```

### Migration 2: Create Professional Profile Table

```sql
-- Migration: create_user_professional_profile
-- Description: Creates UserProfessionalProfile table for onboarding data

CREATE TABLE UserProfessionalProfile (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL UNIQUE,
  roleStatus TEXT DEFAULT 'neutral',
  currentRole TEXT,
  industryContext TEXT,
  careerGoals TEXT,
  completedAt TEXT,
  skippedAt TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
);

CREATE INDEX idx_professional_profile_user ON UserProfessionalProfile(userId);
CREATE INDEX idx_professional_profile_status ON UserProfessionalProfile(roleStatus);
```

---

## Entity Relationship Diagram

```
┌─────────────────────┐         ┌──────────────────────────┐
│       User          │         │   UserProfessionalProfile │
├─────────────────────┤   1:1   ├──────────────────────────┤
│ id                  │◄────────│ userId                   │
│ name                │         │ roleStatus               │
│ email               │         │ currentRole              │
│ ...                 │         │ careerGoals              │
└─────────────────────┘         └──────────────────────────┘
         │
         │ 1:5 (Top 5)
         ▼
┌─────────────────────┐
│   UserStrength      │
├─────────────────────┤
│ userId              │
│ strengthId          │──────────┐
│ rank (1-5)          │          │
└─────────────────────┘          │
                                 │ 1:N
                                 ▼
┌─────────────────────────────────────────────────────────┐
│                   DevelopmentModule                      │
├─────────────────────────────────────────────────────────┤
│ id                                                       │
│ key                                                      │
│ titleEs, descriptionEs, content                         │
│ strengthKey ─────────► Links to Strength.name           │
│ moduleType: "general" | "personalized"                  │
│ userId (nullable) ───► Only for personalized            │
│ isArchived: boolean                                     │
│ ...                                                      │
└─────────────────────────────────────────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐         ┌──────────────────────┐
│    Challenge        │         │ UserModuleProgress   │
├─────────────────────┤         ├──────────────────────┤
│ moduleId            │         │ userId               │
│ titleEs             │         │ moduleId             │
│ type                │         │ status               │
│ xpReward            │         │ completedChallenges  │
└─────────────────────┘         └──────────────────────┘
```

---

## Query Patterns

### Q1: Get User's Available Modules (Top 5 filtered)

```typescript
async function getUserModules(userId: string) {
  // Step 1: Get user's Top 5 strength keys
  const userStrengths = await prisma.userStrength.findMany({
    where: { userId },
    include: { strength: { select: { name: true } } }
  });
  const strengthKeys = userStrengths.map(s => s.strength.name);
  
  // Step 2: Get modules matching those strengths
  return prisma.developmentModule.findMany({
    where: {
      isActive: true,
      isArchived: false,
      strengthKey: { in: strengthKeys },
      OR: [
        { moduleType: 'general' },
        { moduleType: 'personalized', userId }
      ]
    },
    orderBy: [{ moduleType: 'asc' }, { order: 'asc' }]
  });
}
```

### Q2: Check Can Generate New Module

```typescript
async function canGenerateModule(userId: string) {
  const pending = await prisma.userModuleProgress.count({
    where: { 
      userId, 
      status: { not: 'completed' },
      module: { isArchived: false }
    }
  });
  return pending === 0;
}
```

### Q3: Get or Create Professional Profile

```typescript
async function getOrCreateProfile(userId: string) {
  return prisma.userProfessionalProfile.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      roleStatus: 'neutral'
    }
  });
}
```

---

## Validation Rules

### DevelopmentModule Invariants

1. **General modules**: `moduleType = 'general'` MUST have `userId = null`
2. **Personalized modules**: `moduleType = 'personalized'` MUST have `userId != null`
3. **Active modules**: `isActive = true` AND `isArchived = false`
4. **Strength-based**: All non-archived modules MUST have `strengthKey != null`

### UserProfessionalProfile Invariants

1. **One per user**: `userId` is unique
2. **Valid roleStatus**: Must be one of defined enum values
3. **Completion state**: Either `completedAt` OR `skippedAt` set, not both

---

## Seed Data Considerations

### General Modules per Strength (20 strengths × 1-2 modules)

Each of the 20 HIGH5 strengths should have at least one general module:

| Strength       | Module Key                      | Level    |
| -------------- | ------------------------------- | -------- |
| deliverer      | mod-deliverer-fundamentals      | beginner |
| analyst        | mod-analyst-fundamentals        | beginner |
| focus-expert   | mod-focus-expert-fundamentals   | beginner |
| problem-solver | mod-problem-solver-fundamentals | beginner |
| time-keeper    | mod-time-keeper-fundamentals    | beginner |
| ...            | ...                             | ...      |

### Personalized Modules

Generated dynamically via AI - no seed data required.

---

## Backwards Compatibility

1. **Existing modules**: All current modules default to `moduleType = 'general'`
2. **Existing progress**: `UserModuleProgress` unchanged, continues working
3. **Archived modules**: User progress preserved but modules hidden from UI
4. **Gamification**: XP and badges continue working with new module types
