<!--
  Sync Impact Report
  ==================
  Version Change: 0.0.0 → 1.0.0 (Initial ratification)
  
  Added Sections:
  - Core Principles (5 principles defined)
  - Technology Standards
  - Development Workflow
  - Governance

  Modified Principles: N/A (Initial version)
  Removed Sections: N/A (Initial version)
  
  Templates Requiring Updates:
  - ✅ plan-template.md - Constitution Check section aligned
  - ✅ spec-template.md - User scenarios align with human-first principle
  - ✅ tasks-template.md - Phase structure compatible with feature-first
  
  Follow-up TODOs: None
-->

# Insight Constitution

## Core Principles

### I. Human-First Design

Every feature, component, and interaction MUST prioritize human understanding and growth over 
technical convenience. AI augments human capability—it never replaces human judgment or autonomy.

- User interfaces MUST be accessible, intuitive, and emotionally supportive
- AI-generated insights MUST be explainable and actionable
- Feedback loops MUST reinforce positive psychology principles
- Data presentation MUST empower users, not overwhelm them

**Rationale**: Insight exists to help individuals become their best selves. Technology serves 
this mission only when it genuinely enhances human potential rather than creating dependency.

### II. Positive Psychology Foundation

All features MUST align with evidence-based positive psychology principles, specifically the 
strengths-based approach derived from HIGH5 methodology.

- Strengths MUST be presented as growth opportunities, never as fixed limitations
- Team dynamics MUST highlight complementary strengths and collaborative potential
- Reports MUST balance constructive insights with encouraging affirmation
- Language MUST be empowering, specific, and actionable

**Rationale**: The platform's scientific foundation differentiates it from generic assessments. 
Maintaining fidelity to positive psychology ensures meaningful, lasting impact.

### III. Feature-First Architecture

Code organization MUST follow Next.js 16 feature-first conventions with co-located components, 
hooks, actions, and schemas within feature directories.

- Feature folders use underscore prefix: `_components/`, `_hooks/`, `_actions/`, `_schemas/`
- Truly shared code lives in `lib/` (utilities, types) or `components/ui/` (primitives)
- Each feature MUST be independently navigable and testable
- Barrel exports (`index.ts`) MUST be provided for clean imports

**Rationale**: Co-location reduces cognitive load, simplifies maintenance, and makes the 
codebase navigable for new contributors.

### IV. AI-Augmented Insights

AI capabilities (GPT-4o via AI SDK) MUST enhance—not replace—the strengths assessment process.

- Generated content MUST be grounded in user's actual strength profile data
- AI outputs MUST use Zod schemas for type-safe structured generation
- Reports MUST clearly distinguish between data-driven facts and AI interpretations
- Fallback behavior MUST gracefully handle AI service unavailability

**Rationale**: AI adds personalization and depth to insights, but the core value proposition 
is the validated strengths framework, not the AI technology itself.

### V. Type Safety & Explicit Contracts

TypeScript MUST be used with strict typing throughout. No `any` types permitted except in 
exceptional, documented cases.

- All API boundaries MUST have explicit type definitions in `lib/types/`
- Zod schemas MUST validate all external inputs (forms, API requests, AI outputs)
- Prisma models MUST generate types consumed by application code
- JSDoc comments MUST document public methods and complex logic

**Rationale**: Type safety prevents runtime errors, enables confident refactoring, and serves 
as living documentation for the development team.

## Technology Standards

**Stack Requirements**:
- **Framework**: Next.js 16 with App Router, React Server Components, Turbopack
- **Language**: TypeScript (strict mode)
- **Database**: Turso (libSQL) via Prisma ORM
- **Authentication**: BetterAuth
- **AI**: Vercel AI SDK with OpenAI GPT-4o
- **Styling**: Tailwind CSS with CSS variables from `globals.css` (no arbitrary colors)
- **UI Primitives**: shadcn/ui + Radix UI
- **Forms**: React Hook Form + Zod validation
- **Package Manager**: Bun (use `bun` and `bunx` exclusively)

**Naming Conventions**:
- Classes/Interfaces: `PascalCase`
- Variables/Functions: `camelCase`
- Files/Directories: `kebab-case`
- Constants: `UPPERCASE`
- Boolean flags: verb-based (`isLoading`, `hasError`)

**File Organization**:
- One export per file
- Documentation in `/docs/` folder only
- Seed data in `prisma/data/`
- Centralized types in `lib/types/`

## Development Workflow

**Quality Gates**:

1. **Pre-Commit**: All code MUST pass TypeScript compilation and ESLint checks
2. **Build Verification**: `bun run build` MUST succeed before merging
3. **Type Generation**: Prisma types MUST be regenerated after schema changes

**Code Review Requirements**:

- Constitution principles MUST be verified in every PR
- Feature changes MUST include updated barrel exports
- AI-related changes MUST include Zod schema validation
- Database changes MUST include migration files

**Documentation Standards**:

- README updates for new features
- JSDoc for public APIs
- Architecture decision records for significant changes

## Governance

This Constitution supersedes all other development practices for the Insight project. 
Amendments require:

1. Documentation of the proposed change with rationale
2. Impact assessment on existing features
3. Update to all affected templates and guidance files
4. Version increment following semantic versioning:
   - **MAJOR**: Breaking changes to principles or governance
   - **MINOR**: New principles or sections added
   - **PATCH**: Clarifications, wording improvements

All pull requests and code reviews MUST verify compliance with these principles. 
Complexity beyond these standards MUST be explicitly justified and documented.

Reference `.github/copilot-instructions.md` for detailed runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2025-07-22 | **Last Amended**: 2025-07-22
