# Data Model: Sub-Team Builder & Match Analyzer

**Feature**: 003-subteam-builder  
**Date**: 13 de diciembre de 2025  
**Purpose**: Define database schema extensions for sub-team functionality

---

## Overview

This feature requires two new Prisma models and modifications to existing models to support sub-team creation, match scoring, and project type profiling.

---

## New Models

### SubTeam

Represents a virtual team composed of members from a parent team, assigned to a specific project.

```prisma
model SubTeam {
  id                    String   @id @default(uuid())
  parentTeamId          String
  projectTypeProfileId  String
  name                  String
  description           String?
  members               String   // JSON: array of userIds
  matchScore            Float?   // 0-100, calculated
  analysis              String?  // JSON: detailed match breakdown
  status                String   @default("active") // "active" | "archived"
  createdBy             String
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  deletedAt             DateTime? // Soft delete

  parentTeam          Team                @relation("TeamSubTeams", fields: [parentTeamId], references: [id], onDelete: Cascade)
  projectTypeProfile  ProjectTypeProfile  @relation("ProjectType", fields: [projectTypeProfileId], references: [id])
  creator             User                @relation("SubTeamCreator", fields: [createdBy], references: [id])

  @@index([parentTeamId, deletedAt])
  @@index([createdBy])
  @@index([projectTypeProfileId])
  @@index([status])
}
```

**Field Definitions**:

| Field | Type | Purpose | Notes |
|-------|------|---------|-------|
| `id` | UUID | Primary key | Auto-generated |
| `parentTeamId` | String | Reference to main team | Foreign key to Team |
| `projectTypeProfileId` | String | Type of project | Foreign key to ProjectTypeProfile |
| `name` | String | Sub-team name | Max 50 chars, validated by Zod |
| `description` | String? | Optional context | Max 500 chars |
| `members` | String (JSON) | Array of user IDs | `["uuid1", "uuid2", ...]` |
| `matchScore` | Float? | Compatibility score | 0-100, null if not calculated |
| `analysis` | String (JSON) | Score breakdown | See MatchScoreAnalysis interface |
| `status` | String | Active/Archived | Default "active" |
| `createdBy` | String | Creator user ID | Foreign key to User |
| `createdAt` | DateTime | Creation timestamp | Auto |
| `updatedAt` | DateTime | Last update | Auto |
| `deletedAt` | DateTime? | Soft delete timestamp | Null = not deleted |

**JSON Structure for `members`**:
```json
["uuid-1", "uuid-2", "uuid-3", "uuid-4", "uuid-5"]
```

**JSON Structure for `analysis`**:
```json
{
  "totalScore": 78,
  "factors": {
    "strengthCoverage": { "score": 85, "weight": 0.30 },
    "domainBalance": { "score": 72, "weight": 0.25 },
    "cultureFit": { "score": 80, "weight": 0.20 },
    "teamSize": { "score": 90, "weight": 0.15 },
    "redundancyPenalty": { "score": 5, "weight": 0.10 }
  },
  "gaps": [
    {
      "strengthName": "Strategist",
      "strengthNameEs": "Estratega",
      "reason": "Recommended for long-term planning in innovation projects"
    }
  ],
  "recommendations": [
    "Consider adding a Strategist to improve planning capabilities",
    "Team has strong execution focus - ensure strategic alignment"
  ]
}
```

**Indexes Rationale**:
- `[parentTeamId, deletedAt]`: List all active sub-teams for a team
- `[createdBy]`: User's created sub-teams
- `[projectTypeProfileId]`: Filter by project type
- `[status]`: Filter active vs. archived

---

### ProjectTypeProfile

Defines the ideal characteristics for different project types (Innovation, Execution, Crisis, Growth).

```prisma
model ProjectTypeProfile {
  id                 String   @id @default(uuid())
  type               String   @unique // "innovation" | "execution" | "crisis" | "growth"
  name               String
  nameEs             String
  idealStrengths     String   // JSON: array of strength names
  criticalDomains    String   // JSON: domain weights
  cultureFit         String   // JSON: culture preferences
  description        String
  descriptionEs      String
  icon               String?  // Optional icon identifier
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  subTeams SubTeam[] @relation("ProjectType")

  @@index([type])
}
```

**Field Definitions**:

| Field | Type | Purpose | Notes |
|-------|------|---------|-------|
| `id` | UUID | Primary key | Auto-generated |
| `type` | String | Unique identifier | "innovation", "execution", etc. |
| `name` | String | English display name | "Innovation Sprint" |
| `nameEs` | String | Spanish display name | "Sprint de Innovación" |
| `idealStrengths` | String (JSON) | Recommended strengths | Array of strength names |
| `criticalDomains` | String (JSON) | Domain weights | Object mapping domains to weights |
| `cultureFit` | String (JSON) | Ideal cultures | Array of culture names |
| `description` | String | English description | What this project type entails |
| `descriptionEs` | String | Spanish description | Descripción del tipo de proyecto |
| `icon` | String? | Icon identifier | Optional, for UI display |

**JSON Structure for `idealStrengths`**:
```json
["Strategist", "Thinker", "Deliverer", "Coach"]
```

**JSON Structure for `criticalDomains`**:
```json
{
  "Thinking": 0.35,
  "Doing": 0.30,
  "Motivating": 0.20,
  "Feeling": 0.15
}
```

**JSON Structure for `cultureFit`**:
```json
["Strategy", "Innovation"]
```

**Seed Data** (4 predefined types):

1. **Innovation**
   - Ideal: Strategist, Thinker, Coach, Believer
   - Domains: Thinking (35%), Motivating (30%), Doing (20%), Feeling (15%)
   - Cultures: Strategy, Innovation

2. **Execution**
   - Ideal: Deliverer, Chameleon, Commander, Time Keeper
   - Domains: Doing (40%), Thinking (25%), Motivating (20%), Feeling (15%)
   - Cultures: Execution

3. **Crisis**
   - Ideal: Commander, Problem Solver, Deliverer, Empathizer
   - Domains: Doing (35%), Thinking (30%), Feeling (20%), Motivating (15%)
   - Cultures: Execution, Cohesion

4. **Growth**
   - Ideal: Coach, Believer, Winner, Philomath
   - Domains: Motivating (35%), Feeling (25%), Thinking (20%), Doing (20%)
   - Cultures: Cohesion, Influence

---

## Modified Models

### User

Add relation to SubTeam as creator.

```prisma
model User {
  // ... existing fields
  
  createdSubTeams SubTeam[] @relation("SubTeamCreator")
  
  // ... rest of existing relations
}
```

**Rationale**: Track which user created each sub-team for authorization and audit.

---

### Team

Add relation to SubTeam.

```prisma
model Team {
  // ... existing fields
  
  subTeams SubTeam[] @relation("TeamSubTeams")
  
  // ... rest of existing relations
}
```

**Rationale**: Enable cascade delete and easy querying of all sub-teams for a parent team.

---

## Validation Rules

### SubTeam Validation

**Enforced by Zod schema** (not database constraints):

- `name`: 3-50 characters, required
- `description`: Max 500 characters, optional
- `members`: Array of 2-10 valid user IDs from parent team
- `projectTypeProfileId`: Must exist in ProjectTypeProfile table
- `parentTeamId`: Must exist in Team table
- `createdBy`: Must be a member of parent team with appropriate permissions

**Business Logic Validation**:
- All member IDs must exist in User table
- All member IDs must be members of parentTeam
- No duplicate member IDs
- createdBy user must have permission to create sub-teams (team member or admin)

---

## Computed Fields

These are calculated in application code, not stored as database columns:

### memberCount (SubTeam)

```typescript
const memberCount = JSON.parse(subTeam.members).length;
```

### strengthCoverage (SubTeam)

```typescript
const members = JSON.parse(subTeam.members);
const uniqueStrengths = await getUniqueStrengths(members);
const coverage = uniqueStrengths.length; // 0-25 (max 5 strengths * 5 members)
```

### domainDistribution (SubTeam)

```typescript
const domainCounts = {
  Thinking: 0,
  Doing: 0,
  Motivating: 0,
  Feeling: 0
};

for (const userId of members) {
  const userStrengths = await getUserStrengths(userId);
  for (const strength of userStrengths) {
    domainCounts[strength.domain.name]++;
  }
}
```

---

## Migration Strategy

### Step 1: Create Migration

```bash
bun prisma migrate dev --name add_subteam_models
```

### Step 2: Seed ProjectTypeProfile

```bash
bun prisma db seed
```

**Seed script location**: `prisma/seeders/seed-project-types.ts`

### Step 3: Verify

```bash
bun prisma studio
```

Check that ProjectTypeProfile table has 4 rows.

---

## Indexes Performance Impact

### Query Performance Estimates

| Query | Index Used | Est. Time |
|-------|-----------|-----------|
| List sub-teams for team | `[parentTeamId, deletedAt]` | <10ms |
| Get user's created sub-teams | `[createdBy]` | <10ms |
| Filter by project type | `[projectTypeProfileId]` | <20ms |
| Full-text search (future) | N/A (need FTS) | TBD |

### Storage Impact

- SubTeam row: ~500 bytes (including JSON fields)
- ProjectTypeProfile row: ~1KB
- Estimated total for 100 sub-teams: ~50KB
- Indexes overhead: ~5KB

**Conclusion**: Negligible storage impact, indexes provide significant query performance improvement.

---

## Future Considerations

### Potential Schema Enhancements (Not in Scope)

1. **SharedReport Table**: For shareable public links to reports
   ```prisma
   model SharedReport {
     id         String   @id @default(uuid())
     subTeamId  String
     token      String   @unique
     expiresAt  DateTime?
     createdAt  DateTime @default(now())
   }
   ```

2. **SubTeamHistory Table**: Track changes to sub-team composition
   ```prisma
   model SubTeamHistory {
     id         String   @id @default(uuid())
     subTeamId  String
     members    String   // JSON snapshot
     matchScore Float
     changedBy  String
     changedAt  DateTime @default(now())
   }
   ```

3. **CustomProjectType Table**: Allow users to define custom project types
   ```prisma
   model CustomProjectType {
     id             String @id @default(uuid())
     organizationId String
     // ... similar to ProjectTypeProfile
   }
   ```

**These are explicitly deferred** to maintain feature scope and simplicity.

---

## Data Integrity Checks

### Referential Integrity

**Enforced by Prisma**:
- SubTeam.parentTeamId → Team.id (CASCADE on delete)
- SubTeam.projectTypeProfileId → ProjectTypeProfile.id (RESTRICT on delete)
- SubTeam.createdBy → User.id (RESTRICT on delete)

**Application-level checks**:
- Members array contains only valid User IDs
- Members are members of parent team
- ProjectTypeProfile exists and is not deleted

### Consistency Checks

**Before saving SubTeam**:
1. Validate all member IDs exist
2. Verify members belong to parent team
3. Recalculate match score
4. Update analysis JSON

**Periodic cleanup tasks** (future):
- Archive old sub-teams (>1 year inactive)
- Remove soft-deleted records (>90 days)
- Recalculate match scores if algorithm changes

---

## Testing Data Model

### Unit Tests

**Test Prisma queries**:
```typescript
// tests/unit/subteam-queries.test.ts

describe('SubTeam Queries', () => {
  it('should create subteam with valid data', async () => {
    const subTeam = await prisma.subTeam.create({
      data: {
        name: 'Test SubTeam',
        parentTeamId: 'team-uuid',
        projectTypeProfileId: 'profile-uuid',
        members: JSON.stringify(['user1', 'user2']),
        createdBy: 'creator-uuid'
      }
    });
    
    expect(subTeam.id).toBeDefined();
    expect(subTeam.matchScore).toBeNull();
  });
  
  it('should soft delete subteam', async () => {
    await prisma.subTeam.update({
      where: { id: 'subteam-uuid' },
      data: { deletedAt: new Date() }
    });
    
    const deleted = await prisma.subTeam.findFirst({
      where: { id: 'subteam-uuid', deletedAt: { not: null } }
    });
    
    expect(deleted).toBeDefined();
  });
});
```

### Integration Tests

**Test with related models**:
```typescript
describe('SubTeam Relations', () => {
  it('should cascade delete subteams when team is deleted', async () => {
    await prisma.team.delete({ where: { id: 'team-uuid' } });
    
    const subTeams = await prisma.subTeam.findMany({
      where: { parentTeamId: 'team-uuid' }
    });
    
    expect(subTeams).toHaveLength(0);
  });
});
```

---

## Summary

**New Tables**: 2 (SubTeam, ProjectTypeProfile)  
**Modified Tables**: 2 (User, Team)  
**Indexes Added**: 5  
**Seed Data**: 4 project type profiles  
**Storage Impact**: Negligible (<100KB for typical usage)  
**Performance Impact**: Positive (indexes improve query speed)

**Next Steps**:
1. ✅ Data model design complete
2. → Generate migration files
3. → Create seed data
4. → Proceed to API Contracts (contracts/)
