# Insight - Product Requirements Document (PRD)

**Version**: 1.0.0  
**Last Updated**: December 12, 2025  
**Status**: Current State Documentation

---

## Executive Summary

Insight is a human-centered platform for personal and team strength assessment and development. Built on the HIGH5 strengths methodology rooted in positive psychology, the platform enables individuals and organizations to identify, understand, and enhance their unique abilities through AI-augmented insights.

### Mission

Empower individuals to become the best version of themselves and help teams achieve high productivity by leveraging the science of positive psychology combined with AI-generated personalized guidance.

### Value Proposition

- **For Individuals**: Discover your top 5 strengths, understand how they work together, and receive actionable development strategies
- **For Teams**: Visualize team dynamics, identify cultural tendencies, and optimize collaboration through complementary strengths

---

## System Architecture

### Technology Stack

| Layer              | Technology                                                  |
| ------------------ | ----------------------------------------------------------- |
| Framework          | Next.js 16 (App Router, React Server Components, Turbopack) |
| Language           | TypeScript (strict mode)                                    |
| Database           | Turso (libSQL) via Prisma ORM                               |
| Authentication     | BetterAuth                                                  |
| AI Engine          | Vercel AI SDK with OpenAI GPT-4o                            |
| Styling            | Tailwind CSS with CSS variables                             |
| UI Primitives      | shadcn/ui + Radix UI                                        |
| Forms & Validation | React Hook Form + Zod                                       |
| Package Manager    | Bun                                                         |

### Architecture Pattern

**Feature-First Organization** with co-located components following Next.js 16 conventions:

```
app/dashboard/{feature}/
├── page.tsx              # Route entry point
├── _actions/             # Server actions
├── _components/          # Feature-specific components
├── _schemas/             # Zod validation schemas
├── _hooks/               # Feature-specific hooks (when needed)
└── _lib/                 # Feature-specific utilities (when needed)
```

---

## Data Model Overview

### Core Entities

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│    User     │────▶│  UserProfile │     │   UserDNA    │
│             │     │  (optional)  │     │ (AI-generated)│
└──────┬──────┘     └──────────────┘     └──────────────┘
       │
       │ 1:N (max 5)
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ UserStrength │────▶│   Strength   │────▶│   Domain     │
│  (ranked)    │     │  (catalog)   │     │ (4 types)    │
└──────────────┘     └──────────────┘     └──────────────┘
       │
       │ N:M via TeamMember
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Team      │────▶│   Report     │     │   Culture    │
│              │     │ (AI reports) │     │ (derived)    │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Domain Classification

The HIGH5 methodology organizes 20 strengths into 4 domains:

| Domain         | Description               | Key Question                    |
| -------------- | ------------------------- | ------------------------------- |
| **Doing**      | Action-oriented strengths | "How do I get things done?"     |
| **Feeling**    | Emotional intelligence    | "How do I connect with others?" |
| **Motivating** | Influence and inspiration | "How do I energize others?"     |
| **Thinking**   | Analytical and strategic  | "How do I approach problems?"   |

### Culture Mapping

Team cultures emerge from the intersection of two axes:

- **Energy Axis**: Action ↔ Reflection
- **Orientation Axis**: Results ↔ People

This creates 4 culture types:

| Culture   | Energy     | Orientation | Characteristics                   |
| --------- | ---------- | ----------- | --------------------------------- |
| Execution | Action     | Results     | Fast-paced, goal-driven           |
| Influence | Action     | People      | Collaborative, energetic          |
| Strategy  | Reflection | Results     | Analytical, planning-focused      |
| Cohesion  | Reflection | People      | Relationship-building, supportive |

---

## Feature Modules

### Module 1: Authentication (`app/(auth)/`)

**Status**: ✅ Complete

**Description**: Secure user authentication powered by BetterAuth.

**Capabilities**:
- Email/password login
- Session management with secure tokens
- OAuth provider support (configurable)
- Protected route middleware

**Key Files**:
- [lib/auth.ts](lib/auth.ts) - Server-side auth configuration
- [lib/auth-client.ts](lib/auth-client.ts) - Client-side auth hooks
- [app/(auth)/login/page.tsx](app/(auth)/login/page.tsx) - Login page

---

### Module 2: Dashboard Home (`app/dashboard/`)

**Status**: ✅ Complete

**Description**: Central hub providing overview cards and navigation to features.

**Capabilities**:
- Welcome message with user name
- Quick stats overview (5 strengths, team members count)
- Navigation cards to Profile, Team, and Reports

**Key Components**:
- `DashboardContainer` - Shared layout wrapper for all dashboard pages

---

### Module 3: Profile Management (`app/dashboard/profile/`)

**Status**: ✅ Complete

**Description**: Personal strength profile configuration and visualization.

**Capabilities**:

| Feature                  | Description                                       |
| ------------------------ | ------------------------------------------------- |
| **Strength Display**     | View ranked top 5 strengths with domain colors    |
| **User DNA**             | AI-generated personality synthesis from strengths |
| **Profile Editing**      | Update career, age, gender, description, hobbies  |
| **Domain Visualization** | Color-coded strength cards by domain type         |

**Server Actions**:

| Action                        | Purpose                                     |
| ----------------------------- | ------------------------------------------- |
| `getCurrentUserWithStrengths` | Fetch authenticated user with strength data |
| `getUserProfile`              | Retrieve extended profile information       |
| `getUserDna`                  | Get AI-generated DNA if exists              |
| `generateUserDna`             | Trigger AI DNA generation                   |
| `updateProfile`               | Save profile changes                        |

**User DNA Structure** (AI-Generated):
```typescript
{
  title: string;           // e.g., "The Strategic Connector"
  summary: string;         // 2-3 sentence overview
  dimensions: [{
    name: string;          // Dimension name
    description: string;   // How it manifests
  }];
  synergies: [{
    pair: [string, string]; // Strength pair
    insight: string;        // How they complement
  }];
  idealRole: string[];     // Career suggestions
  purpose: string;         // Core purpose statement
}
```

---

### Module 4: Team Analytics (`app/dashboard/team/`)

**Status**: ✅ Complete

**Description**: Team composition analysis and dynamics visualization.

**Capabilities**:

| Feature                  | Description                                |
| ------------------------ | ------------------------------------------ |
| **Team Strengths Grid**  | Visual matrix of all team member strengths |
| **Culture Map**          | Four-quadrant culture distribution chart   |
| **Watch Outs**           | Potential blind spots and risks            |
| **Unique Contributions** | What each member uniquely brings           |

**Key Components**:

| Component             | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `TeamStrengthsGrid`   | Displays all members with their 5 strengths      |
| `TeamCultureMap`      | Visualizes culture distribution across quadrants |
| `TeamWatchOuts`       | Highlights team blind spots and imbalances       |
| `UniqueContributions` | Shows each member's unique strength value        |
| `CulturesGrid`        | Grid display of all culture types                |

**Analytics Calculated**:
```typescript
interface TeamAnalytics {
  domainDistribution: Record<DomainType, number>;
  cultureScores: {
    execution: number;
    influence: number;
    strategy: number;
    cohesion: number;
  };
  strengthGaps: string[];      // Missing strengths
  overrepresented: string[];   // Too many of same strength
}
```

---

### Module 5: AI Reports (`app/dashboard/reports/`)

**Status**: ✅ Complete

**Description**: AI-powered report generation for individuals and teams.

#### Report Types

**Individual Reports** (`/reports/individual`):

| Report Type                | Description                  |
| -------------------------- | ---------------------------- |
| `INDIVIDUAL_FULL`          | Complete personal assessment |
| `INDIVIDUAL_STRENGTHS`     | Core strengths deep dive     |
| `INDIVIDUAL_DEVELOPMENT`   | Growth opportunities         |
| `INDIVIDUAL_RELATIONSHIPS` | Collaboration strategies     |

**Team Reports** (`/reports/team`):

| Report Type                   | Description                |
| ----------------------------- | -------------------------- |
| `TEAM_CULTURE`                | Culture map analysis       |
| `TEAM_STRENGTHS_DISTRIBUTION` | Strength coverage analysis |
| `TEAM_DOMAIN_COVERAGE`        | Domain balance assessment  |
| `TEAM_FULL`                   | Complete team assessment   |

**Team Tips** (`/reports/team-tips`):

| Report Type | Description                                      |
| ----------- | ------------------------------------------------ |
| `TEAM_TIPS` | Personalized collaboration advice with teammates |

**Report Lifecycle**:
```
PENDING → GENERATING → COMPLETED
                    ↘ FAILED (with error message)
```

**Server Actions**:

| Action                        | Purpose                           |
| ----------------------------- | --------------------------------- |
| `getUserIndividualReportData` | Prepare individual report context |
| `generateIndividualReport`    | Trigger AI individual report      |
| `getTeamReportData`           | Prepare team report context       |
| `generateTeamReport`          | Trigger AI team report            |
| `getTeamTipsData`             | Prepare tips report context       |
| `generateTeamTips`            | Trigger AI tips generation        |

---

### Module 6: Shared Components (`app/_shared/`)

**Status**: ✅ Refactored (Minimal)

**Description**: Truly shared UI components used across multiple features.

**Components**:

| Component            | Usage                                      |
| -------------------- | ------------------------------------------ |
| `DomainIndicator`    | Displays domain icon with tooltip          |
| `StrengthBadge`      | Compact strength display with domain color |
| `StrengthDetailCard` | Expanded strength information card         |

---

### Module 7: UI Primitives (`components/ui/`)

**Status**: ✅ Complete

**Description**: shadcn/ui components with custom theming.

**Available Components**:
- Layout: `Card`, `Sidebar`, `Sheet`, `Dialog`
- Forms: `Input`, `Textarea`, `Select`, `Field`, `Form`, `Label`
- Feedback: `Alert`, `Progress`, `Spinner`, `Skeleton`, `Sonner` (toast)
- Navigation: `Button`, `ButtonGroup`, `DropdownMenu`, `Command`
- Data Display: `Badge`, `HoverCard`, `Tooltip`, `Carousel`
- Utility: `Collapsible`, `ScrollArea`, `Separator`, `Empty`

---

## Library Utilities (`lib/`)

### Core Utilities

| File                                     | Purpose                          |
| ---------------------------------------- | -------------------------------- |
| [lib/auth.ts](lib/auth.ts)               | BetterAuth server configuration  |
| [lib/auth-client.ts](lib/auth-client.ts) | Client-side auth hooks           |
| [lib/prisma.db.ts](lib/prisma.db.ts)     | Prisma client singleton          |
| [lib/ai.ts](lib/ai.ts)                   | AI SDK configuration with OpenAI |
| [lib/cn.ts](lib/cn.ts)                   | Tailwind class merging utility   |
| [lib/utils.ts](lib/utils.ts)             | General utility functions        |

### Type Definitions (`lib/types/`)

| File                                             | Exports                                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------ |
| [strength.types.ts](lib/types/strength.types.ts) | `DomainType`, `StrengthWithDomain`, `TeamAnalytics`, `TeamMemberWithStrengths` |
| [user-dna.types.ts](lib/types/user-dna.types.ts) | Zod schemas for AI DNA generation                                              |

### Data Helpers (`lib/data/`, `lib/utils/`)

| File                                                               | Purpose                           |
| ------------------------------------------------------------------ | --------------------------------- |
| [lib/data/strengths.data.ts](lib/data/strengths.data.ts)           | Runtime strength lookup utilities |
| [lib/utils/strength-helpers.ts](lib/utils/strength-helpers.ts)     | Team analytics calculation        |
| [lib/utils/culture-calculator.ts](lib/utils/culture-calculator.ts) | Culture score computation         |
| [lib/constants/domain-colors.ts](lib/constants/domain-colors.ts)   | Domain color mappings             |

---

## Database Seed Data (`prisma/data/`)

| File                                               | Purpose                               |
| -------------------------------------------------- | ------------------------------------- |
| [domains.data.ts](prisma/data/domains.data.ts)     | 4 domain definitions                  |
| [strengths.data.ts](prisma/data/strengths.data.ts) | 20 strength definitions with metadata |
| [focus.data.ts](prisma/data/focus.data.ts)         | 4 focus axes for culture mapping      |
| [cultures.data.ts](prisma/data/cultures.data.ts)   | 4 culture type definitions            |
| [users.data.ts](prisma/data/users.data.ts)         | Sample users for development          |

---

## API Routes

| Route                | Method | Purpose                             |
| -------------------- | ------ | ----------------------------------- |
| `/api/auth/[...all]` | ALL    | BetterAuth authentication endpoints |

---

## Extension Opportunities

### Short-Term Enhancements

| Priority | Feature                   | Description                                                   |
| -------- | ------------------------- | ------------------------------------------------------------- |
| P1       | **Strength Selection UI** | Allow users to select/rank their 5 strengths from the catalog |
| P1       | **Team Management**       | Create teams, invite members, manage roles                    |
| P2       | **Report Export**         | PDF/PNG export for generated reports                          |
| P2       | **Report History**        | View and compare past reports                                 |
| P3       | **Notifications**         | Email notifications for team updates                          |

### Medium-Term Features

| Priority | Feature                    | Description                            |
| -------- | -------------------------- | -------------------------------------- |
| P1       | **HIGH5 Integration**      | Direct API integration with HIGH5 test |
| P2       | **1:1 Collaboration Tips** | AI tips for specific pair dynamics     |
| P2       | **Dashboard Analytics**    | Personal growth tracking over time     |
| P3       | **Team Comparison**        | Compare multiple teams                 |

### Long-Term Vision

| Feature                    | Description                                      |
| -------------------------- | ------------------------------------------------ |
| **Organization Hierarchy** | Multi-team organization support                  |
| **Custom Assessments**     | Create organization-specific strength frameworks |
| **AI Coaching**            | Interactive AI coaching sessions                 |
| **Integration Hub**        | Slack, Teams, HR system integrations             |
| **Mobile App**             | Native iOS/Android applications                  |

---

## Development Guidelines

### Constitution Reference

All development must adhere to the [Insight Constitution](.specify/memory/constitution.md) which defines:

1. **Human-First Design** - Prioritize human understanding over technical convenience
2. **Positive Psychology Foundation** - Align with HIGH5 methodology principles
3. **Feature-First Architecture** - Co-locate components with features
4. **AI-Augmented Insights** - AI enhances, never replaces, the assessment process
5. **Type Safety & Explicit Contracts** - Strict TypeScript, no `any` types

### Code Conventions

- **Naming**: `kebab-case` files, `PascalCase` components, `camelCase` functions
- **Exports**: One export per file with barrel exports (`index.ts`)
- **Colors**: Use CSS variables from `globals.css`, never arbitrary Tailwind colors
- **Package Manager**: Use `bun` and `bunx` exclusively

---

## Appendix

### Environment Variables

See [docs/ENVIRONMENTS.md](docs/ENVIRONMENTS.md) for complete environment setup.

Required variables:
```env
DATABASE_URL=         # Turso database URL
DATABASE_AUTH_TOKEN=  # Turso auth token
BETTER_AUTH_SECRET=   # Auth encryption secret
OPENAI_API_KEY=       # OpenAI API key for AI reports
```

### Available Scripts

```bash
bun run dev          # Start development server with Turbopack
bun run build        # Build for production
bun run db:migrate   # Run database migrations
bun run db:studio    # Open Prisma Studio
bun run db:seed      # Seed database with sample data
```
