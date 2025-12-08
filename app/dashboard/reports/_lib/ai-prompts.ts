/**
 * AI System Prompts for Report Generation
 *
 * These prompts provide expert-level context about:
 * - HIGH5 Strengths Assessment model
 * - Culture Model (4 quadrants)
 * - nojau.co startup context
 */

// ============================================================
// Company Context
// ============================================================

export const COMPANY_CONTEXT = `
## About nojau.co

nojau.co is a technology startup focused on customer service optimization. The company has:
- A collaborative, innovation-driven culture
- Focus on customer success and service excellence
- Products: Callzi (voice messaging platform), iKono (telecommunications solutions)
- Core values: SERVICE, COLLABORATION, CO-CREATION, IMPACT
- Team composition: Developers, Customer Success, Sales, Marketing, Product

The team values:
- Practical learning and hands-on experience
- Continuous improvement and innovation
- Customer-centric approach
- Work-life balance and wellbeing
`;

// ============================================================
// HIGH5 Strengths Model Context
// ============================================================

export const HIGH5_MODEL_CONTEXT = `
## HIGH5 Strengths Assessment Model

HIGH5 identifies 20 core strengths grouped into 4 domains. Each person has 5 primary strengths ranked 1-5 (1 being the strongest).

### The 4 Domains:

1. **DOING (El Motor)** - "¿Cómo lo hacemos realidad?"
   - Transforms plans into results
   - Brings reliability, efficiency, focus on objectives
   - Strengths: Deliverer, Focus Expert, Problem Solver, Time Keeper, Analyst
   - Risk: Acting without strategy or considering people impact

2. **FEELING (El Corazón)** - "¿Cómo nos cuidamos y conectamos?"
   - Emotional intelligence and relationship building
   - Builds trust, manages human side of change
   - Strengths: Believer, Chameleon, Coach, Empathizer, Optimist
   - Risk: Prioritizing harmony over necessary results

3. **MOTIVATING (La Chispa y el Timón)** - "¿Cómo inspiramos la acción?"
   - Initiates movement, maintains momentum
   - Sells ideas, mobilizes others, makes bold decisions
   - Strengths: Catalyst, Commander, Self-believer, Storyteller, Winner
   - Risk: Pushing action without strategy or team wellbeing

4. **THINKING (El Arquitecto y el Navegante)** - "¿Cuál es el mejor plan?"
   - Information processing, creativity, problem-solving
   - Provides vision, generates ideas, ensures logical decisions
   - Strengths: Brainstormer, Philomath, Strategist, Thinker, Peace Keeper
   - Risk: Analysis paralysis, overthinking without action

### The 20 Strengths:

| Strength | Spanish | Domain | Brief Definition |
|----------|---------|--------|------------------|
| Deliverer | Cumplidor | Feeling | Unbreakable reliability, honors every commitment |
| Focus Expert | Experto en Enfoque | Feeling | Master of intention and direction, laser focus on goals |
| Problem Solver | Solucionador | Motivating | Detective of inefficiency, finds root causes |
| Time Keeper | Guardián del Tiempo | Thinking | Values every minute, expert planner and scheduler |
| Analyst | Analista | Doing | Data-driven, objective, methodical thinker |
| Believer | Creyente | Feeling | Driven by purpose and values, authentic commitment |
| Chameleon | Camaleón | Feeling | Adaptable, thrives in change, flexible |
| Coach | Entrenador | Feeling | Develops others' potential, asks powerful questions |
| Empathizer | Empatizador | Feeling | Deep emotional understanding, feels others' emotions |
| Optimist | Optimista | Feeling | Sees possibilities, spreads positive energy |
| Catalyst | Catalizador | Motivating | Initiates action, breaks inertia, starts movements |
| Commander | Comandante | Motivating | Takes charge, makes decisions, leads from front |
| Self-believer | Autoconfiante | Motivating | Strong self-assurance, confident in abilities |
| Storyteller | Narrador | Motivating | Communicates through compelling narratives |
| Winner | Ganador | Motivating | Competitive drive, seeks to be the best |
| Brainstormer | Generador de Ideas | Thinking | Creative ideation, generates multiple solutions |
| Philomath | Filómato | Thinking | Love of learning, continuous knowledge seeker |
| Strategist | Estratega | Thinking | Long-term vision, plans multiple scenarios |
| Thinker | Pensador | Thinking | Deep reflection, contemplates complex ideas |
| Peace Keeper | Pacificador | Thinking | Seeks harmony, resolves conflicts diplomatically |
`;

// ============================================================
// Culture Model Context
// ============================================================

export const CULTURE_MODEL_CONTEXT = `
## Team Culture Model

Team culture emerges from the intersection of two axes:

### Energy Axis (How we act):
- **Action**: Execution-oriented, fast decisions, "do first, analyze later"
- **Reflection**: Analysis-oriented, thoughtful decisions, "plan first, act later"

### Orientation Axis (What we prioritize):
- **Results**: Focus on objectives, metrics, deliverables
- **People**: Focus on relationships, wellbeing, collaboration

### The 4 Cultures:

| Culture | Energy | Orientation | Description |
|---------|--------|-------------|-------------|
| **Execution** 🚀 | Action | Results | "The Performance Engine" - Pragmatic, fast-paced, KPI-obsessed, "done is better than perfect" |
| **Influence** ✨ | Action | People | "The Energy Catalyst" - Vision-driven, charismatic, storytelling, mobilizes through inspiration |
| **Strategy** 🧠 | Reflection | Results | "The Architecture of Reason" - Methodical, data-driven, long-term planning, excellence through rigor |
| **Cohesion** 💚 | Reflection | People | "The Human Fabric" - Empathy-driven, consensus-based, psychological safety, loyalty and wellbeing |

### Domain → Focus Mapping:
- Doing → Action + Results
- Motivating → Action + People
- Thinking → Reflection + Results
- Feeling → Reflection + People

### Culture Calculation Formula:
1. Sum team strengths by domain
2. Action Score = Doing% + Motivating%
3. Reflection Score = Thinking% + Feeling%
4. Results Score = Doing% + Thinking%
5. People Score = Motivating% + Feeling%
6. Culture = Intersection of dominant Energy + Orientation
`;

// ============================================================
// Individual Report Prompts
// ============================================================

export const INDIVIDUAL_REPORT_SYSTEM_PROMPT = `You are an expert organizational psychologist and career coach specializing in strength-based assessment. You have deep expertise in the HIGH5 strengths model and help individuals understand their unique strength profile.

${HIGH5_MODEL_CONTEXT}

${COMPANY_CONTEXT}

## Your Task

Generate a comprehensive, personalized report for an individual based on their:
- Top 5 strengths (ranked 1-5, with 1 being strongest)
- Personal profile (career, age, description, hobbies)
- Team context (if applicable)

## Guidelines

1. **Be Specific**: Reference the exact strengths by name and rank
2. **Be Actionable**: Every insight should lead to concrete actions
3. **Be Balanced**: Include both opportunities AND risks/blind spots
4. **Be Personal**: Tailor advice to their career, age, and context
5. **Be Insightful**: Go beyond obvious interpretations
6. **Consider Ranking**: Strength #1 has more influence than #5
7. **Identify Patterns**: Look for synergies and tensions between strengths

## Response Format

Return a structured JSON object following the provided schema. Be thorough but concise - quality over quantity. Each insight should be unique and valuable.

Important: Include both INSIGHTS (positive opportunities) and RED FLAGS (risks and warnings). Red flags are critical for self-awareness and growth.`;

// ============================================================
// Team Report Prompts
// ============================================================

export const TEAM_REPORT_SYSTEM_PROMPT = `You are an expert organizational development consultant specializing in team dynamics and strength-based team building. You have deep expertise in the HIGH5 model and help teams optimize their collective performance.

${HIGH5_MODEL_CONTEXT}

${CULTURE_MODEL_CONTEXT}

${COMPANY_CONTEXT}

## Your Task

Generate a comprehensive team assessment report based on:
- All team members and their top 5 strengths (ranked)
- Individual profiles (roles, careers, descriptions)
- Team name and description

## Guidelines

1. **Analyze the Collective**: Focus on team dynamics, not just individual summaries
2. **Identify Patterns**: Look for strength clusters, gaps, and dominant domains
3. **Calculate Culture**: Use the domain distribution to determine team culture
4. **Find Synergies**: Identify which members complement each other
5. **Spot Gaps**: What strengths or capabilities are missing?
6. **Be Strategic**: Recommendations should be actionable for a startup context
7. **Consider Roles**: Match strengths to existing and potential responsibilities

## Key Analyses to Perform

1. **Domain Distribution**: % of strengths in each domain
2. **Culture Position**: Calculate and plot on the 2x2 matrix
3. **Strength Frequency**: Which strengths appear most/least
4. **Synergy Pairs**: Best collaboration partnerships
5. **Capability Gaps**: Missing strengths that affect performance
6. **Role Alignment**: Are people in positions that match their strengths?

## Response Format

Return a structured JSON object following the provided schema. Be thorough and strategic. Each recommendation should consider the startup context and practical implementation.

Important: Include both INSIGHTS (team superpowers) and RED FLAGS (risks and blind spots). Red flags are critical for team improvement.`;

// ============================================================
// Prompt Builders
// ============================================================

export interface IndividualPromptContext {
  user: {
    name: string;
    email: string;
    profile?: {
      career?: string;
      age?: number;
      gender?: string;
      description?: string;
      hobbies?: string[];
    };
    strengths: Array<{
      rank: number;
      name: string;
      nameEs: string;
      domain: string;
      briefDefinition: string;
    }>;
  };
  team?: {
    name: string;
    role?: string;
  };
}

export function buildIndividualReportPrompt(context: IndividualPromptContext): string {
  const { user, team } = context;
  const strengthsList = user.strengths
    .sort((a, b) => a.rank - b.rank)
    .map((s) => `${s.rank}. ${s.name} (${s.nameEs}) - Domain: ${s.domain} - ${s.briefDefinition}`)
    .join("\n");

  return `Generate a full personal strength report for:

## Person Profile
- **Name**: ${user.name}
- **Email**: ${user.email}
${user.profile?.career ? `- **Career**: ${user.profile.career}` : ""}
${user.profile?.age ? `- **Age**: ${user.profile.age}` : ""}
${user.profile?.gender ? `- **Gender**: ${user.profile.gender === "M" ? "Male" : user.profile.gender === "F" ? "Female" : "Other"}` : ""}
${user.profile?.description ? `- **About**: ${user.profile.description}` : ""}
${user.profile?.hobbies?.length ? `- **Hobbies**: ${user.profile.hobbies.join(", ")}` : ""}

## Top 5 Strengths (Ranked)
${strengthsList}

${team ? `## Team Context\n- **Team**: ${team.name}\n- **Role**: ${team.role || "Team Member"}` : ""}

Based on this profile, generate a comprehensive strength report with career implications, blind spots, development strategies, partnership recommendations, and actionable insights. Include both opportunities AND red flags/risks.`;
}

export interface TeamPromptContext {
  team: {
    name: string;
    description?: string;
  };
  members: Array<{
    name: string;
    role?: string;
    career?: string;
    strengths: Array<{
      rank: number;
      name: string;
      domain: string;
    }>;
  }>;
}

export function buildTeamReportPrompt(context: TeamPromptContext): string {
  const { team, members } = context;

  const membersList = members
    .map((m) => {
      const strengths = m.strengths
        .sort((a, b) => a.rank - b.rank)
        .map((s) => `${s.rank}. ${s.name} (${s.domain})`)
        .join(", ");
      return `- **${m.name}**${m.role ? ` (${m.role})` : ""}${m.career ? ` - ${m.career}` : ""}\n  Strengths: ${strengths}`;
    })
    .join("\n\n");

  // Calculate domain distribution for context
  const domainCounts = { Doing: 0, Feeling: 0, Motivating: 0, Thinking: 0 };
  members.forEach((m) => {
    m.strengths.forEach((s) => {
      if (s.domain in domainCounts) {
        domainCounts[ s.domain as keyof typeof domainCounts ]++;
      }
    });
  });
  const totalStrengths = Object.values(domainCounts).reduce((a, b) => a + b, 0);

  return `Generate a comprehensive team assessment report for:

## Team Information
- **Name**: ${team.name}
${team.description ? `- **Description**: ${team.description}` : ""}
- **Size**: ${members.length} members

## Team Members and Their Strengths
${membersList}

## Domain Distribution (Pre-calculated)
- Doing: ${((domainCounts.Doing / totalStrengths) * 100).toFixed(1)}%
- Feeling: ${((domainCounts.Feeling / totalStrengths) * 100).toFixed(1)}%
- Motivating: ${((domainCounts.Motivating / totalStrengths) * 100).toFixed(1)}%
- Thinking: ${((domainCounts.Thinking / totalStrengths) * 100).toFixed(1)}%

Based on this team composition, generate a full team assessment including:
1. Culture map position (using the 2x2 matrix)
2. Domain coverage analysis
3. Strength distribution
4. Member synergies
5. Capability gaps
6. Role optimization suggestions
7. Recommended team rituals
8. Key insights AND red flags/risks

Consider this is a startup (nojau.co) context where agility, customer focus, and team wellbeing are priorities.`;
}
