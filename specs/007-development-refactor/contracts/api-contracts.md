# API Contracts: Development Module Refactor

**Feature**: 007-development-refactor  
**Date**: 2025-12-15  
**Status**: Complete

## Overview

Este documento define los contratos de las Server Actions y funciones de servicio para el módulo de desarrollo refactorizado.

---

## Server Actions

### 1. getModules (MODIFIED)

**Location**: `app/dashboard/development/_actions/get-modules.ts`

**Purpose**: Obtener módulos filtrados por las fortalezas Top 5 del usuario.

```typescript
// Input
interface GetModulesInput {
  filters?: {
    level?: 'beginner' | 'intermediate' | 'advanced';
    strengthKey?: string;
    search?: string;
    moduleType?: 'general' | 'personalized' | 'all';
  };
}

// Output
interface GetModulesOutput {
  general: ModuleCard[];      // Módulos generales para sus fortalezas
  personalized: ModuleCard[]; // Módulos personalizados del usuario
}

interface ModuleCard {
  id: string;
  key: string;
  titleEs: string;
  descriptionEs: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  xpReward: number;
  strengthKey: string;
  moduleType: 'general' | 'personalized';
  progress: {
    status: 'not_started' | 'in_progress' | 'completed';
    percentComplete: number;
    completedChallenges: number;
    totalChallenges: number;
  };
}

// Errors
- Unauthorized: User not authenticated
- StrengthsRequired: User has < 5 strengths defined
```

---

### 2. checkCanGenerateModule (NEW)

**Location**: `app/dashboard/development/_actions/check-can-generate.ts`

**Purpose**: Verificar si el usuario puede solicitar un nuevo módulo personalizado.

```typescript
// Input
interface CheckCanGenerateInput {
  // No input required - uses session
}

// Output
interface CheckCanGenerateOutput {
  canGenerate: boolean;
  reason?: 'pending_modules' | 'daily_limit' | 'no_profile';
  pendingModules?: {
    id: string;
    titleEs: string;
    percentComplete: number;
  }[];
  message?: string; // User-friendly message
}

// Errors
- Unauthorized: User not authenticated
```

---

### 3. generatePersonalizedModule (NEW)

**Location**: `app/dashboard/development/_actions/generate-personalized.ts`

**Purpose**: Generar un nuevo módulo personalizado usando AI.

```typescript
// Input
interface GeneratePersonalizedModuleInput {
  strengthKey: string; // Which strength to focus on
}

// Output
interface GeneratePersonalizedModuleOutput {
  success: boolean;
  module?: {
    id: string;
    titleEs: string;
    descriptionEs: string;
  };
  error?: string;
}

// Errors
- Unauthorized: User not authenticated
- CannotGenerate: Has pending modules
- InvalidStrength: Strength not in user's Top 5
- GenerationFailed: AI generation error
```

---

### 4. getProfessionalProfile (NEW)

**Location**: `app/dashboard/development/_actions/get-professional-profile.ts`

**Purpose**: Obtener el perfil profesional del usuario.

```typescript
// Input
interface GetProfessionalProfileInput {
  // No input required - uses session
}

// Output
interface GetProfessionalProfileOutput {
  hasProfile: boolean;
  isComplete: boolean;
  profile?: {
    roleStatus: 'satisfied' | 'partially_satisfied' | 'unsatisfied' | 'neutral';
    currentRole?: string;
    industryContext?: string;
    careerGoals?: string[];
    completedAt?: Date;
  };
}

// Errors
- Unauthorized: User not authenticated
```

---

### 5. saveProfessionalProfile (NEW)

**Location**: `app/dashboard/development/_actions/save-professional-profile.ts`

**Purpose**: Guardar las respuestas del cuestionario de perfil profesional.

```typescript
// Input
interface SaveProfessionalProfileInput {
  roleStatus: 'satisfied' | 'partially_satisfied' | 'unsatisfied';
  currentRole?: string;
  industryContext?: string;
  careerGoals?: string[];
  skip?: boolean; // If true, marks as skipped
}

// Output
interface SaveProfessionalProfileOutput {
  success: boolean;
  profile: {
    roleStatus: string;
    completedAt?: Date;
    skippedAt?: Date;
  };
}

// Validation
- roleStatus: Required, one of enum values
- currentRole: Max 100 characters
- industryContext: Max 100 characters
- careerGoals: Array of max 5 strings, each max 100 chars

// Errors
- Unauthorized: User not authenticated
- ValidationError: Invalid input data
```

---

### 6. getUserStrengthsForDevelopment (NEW)

**Location**: `app/dashboard/development/_actions/get-user-strengths.ts`

**Purpose**: Obtener las fortalezas Top 5 del usuario con metadata para el módulo de desarrollo.

```typescript
// Input
interface GetUserStrengthsInput {
  // No input required - uses session
}

// Output
interface GetUserStrengthsOutput {
  hasTop5: boolean;
  strengths: {
    rank: number;
    key: string;
    nameEs: string;
    domainKey: string;
    domainNameEs: string;
    moduleCount: {
      general: number;
      personalized: number;
      completed: number;
    };
  }[];
}

// Errors
- Unauthorized: User not authenticated
```

---

## Zod Schemas

### Module Schemas (Extended)

```typescript
// module.schema.ts - Extensions

export const ModuleTypeSchema = z.enum(['general', 'personalized']);

export const ModuleCardSchema = z.object({
  id: z.string(),
  key: z.string(),
  titleEs: z.string(),
  descriptionEs: z.string(),
  level: ModuleLevelSchema,
  estimatedMinutes: z.number(),
  xpReward: z.number(),
  strengthKey: z.string(),
  moduleType: ModuleTypeSchema, // NEW
  progress: z.object({
    status: z.enum(['not_started', 'in_progress', 'completed']),
    percentComplete: z.number(),
    completedChallenges: z.number(),
    totalChallenges: z.number(),
  }),
});

export const GenerateModuleInputSchema = z.object({
  strengthKey: z.string().min(1, 'Fortaleza requerida'),
});
```

### Professional Profile Schemas (NEW)

```typescript
// professional-profile.schema.ts

export const RoleStatusSchema = z.enum([
  'satisfied',
  'partially_satisfied', 
  'unsatisfied',
  'neutral'
]);

export const CareerGoalSchema = z.enum([
  'improve_current_role',
  'explore_new_responsibilities',
  'change_area',
  'lead_team',
  'other'
]);

export const ProfessionalProfileSchema = z.object({
  roleStatus: RoleStatusSchema,
  currentRole: z.string().max(100).optional(),
  industryContext: z.string().max(100).optional(),
  careerGoals: z.array(CareerGoalSchema).max(5).optional(),
});

export const SaveProfileInputSchema = ProfessionalProfileSchema.extend({
  skip: z.boolean().optional(),
});

export const ProfileOutputSchema = z.object({
  hasProfile: z.boolean(),
  isComplete: z.boolean(),
  profile: ProfessionalProfileSchema.extend({
    completedAt: z.date().optional(),
  }).optional(),
});
```

---

## Service Layer

### ModuleGeneratorService (NEW)

**Location**: `lib/services/module-generator.service.ts`

**Purpose**: Servicio para generar módulos personalizados usando AI.

```typescript
interface ModuleGeneratorService {
  /**
   * Generate a personalized development module for a user.
   * Uses GPT-4o with structured output.
   */
  generatePersonalizedModule(context: GenerationContext): Promise<GeneratedModule>;
  
  /**
   * Validate generated module content.
   */
  validateGeneratedModule(module: unknown): GeneratedModule;
  
  /**
   * Save generated module to database.
   */
  saveGeneratedModule(userId: string, module: GeneratedModule): Promise<DevelopmentModule>;
}

interface GenerationContext {
  userId: string;
  strengthKey: string;
  strengthName: string;
  strengthNameEs: string;
  strengthDefinition: string;
  roleStatus: string;
  currentRole?: string;
  careerGoals?: string[];
}

interface GeneratedModule {
  titleEs: string;
  descriptionEs: string;
  content: string;
  challenges: {
    titleEs: string;
    descriptionEs: string;
    type: 'reflection' | 'action' | 'collaboration';
    xpReward: number;
  }[];
  estimatedMinutes: number;
  xpReward: number;
}
```

---

## Component Contracts

### StrengthGate (NEW)

```typescript
// strength-gate.tsx
interface StrengthGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Server Component that checks user has Top 5 defined
// Renders children if Top 5 exists, fallback otherwise
```

### ProfessionalProfileForm (NEW)

```typescript
// professional-profile-form.tsx
interface ProfessionalProfileFormProps {
  onComplete: () => void;
  onSkip?: () => void;
  initialValues?: Partial<ProfessionalProfile>;
}

// Client Component for the onboarding questionnaire
// Uses React Hook Form + Zod validation
// Animated with motion/react
```

### ModuleTypeBadge (NEW)

```typescript
// module-type-badge.tsx
interface ModuleTypeBadgeProps {
  type: 'general' | 'personalized';
  size?: 'sm' | 'md';
  animated?: boolean;
}

// Visual badge indicating module type
// General: Shield icon, neutral color
// Personalized: Star icon, accent color
```

### GenerateModuleButton (NEW)

```typescript
// generate-module-button.tsx
interface GenerateModuleButtonProps {
  strengthKey: string;
  strengthNameEs: string;
  disabled?: boolean;
  disabledReason?: string;
  onGenerated?: (moduleId: string) => void;
}

// Button to trigger personalized module generation
// Shows loading state during generation
// Disabled with tooltip when user has pending modules
```

---

## Error Handling

### Standard Error Format

```typescript
interface ActionError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Common error codes
const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  STRENGTHS_REQUIRED: 'STRENGTHS_REQUIRED',
  CANNOT_GENERATE: 'CANNOT_GENERATE',
  INVALID_STRENGTH: 'INVALID_STRENGTH',
  GENERATION_FAILED: 'GENERATION_FAILED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;
```

### Error Messages (Spanish)

```typescript
const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Debes iniciar sesión para continuar.',
  STRENGTHS_REQUIRED: 'Completa tu evaluación de fortalezas para acceder a este módulo.',
  CANNOT_GENERATE: 'Completa tus módulos pendientes antes de generar nuevos.',
  INVALID_STRENGTH: 'Esta fortaleza no está en tu Top 5.',
  GENERATION_FAILED: 'No pudimos generar el módulo. Intenta de nuevo.',
  VALIDATION_ERROR: 'Los datos proporcionados no son válidos.',
};
```
