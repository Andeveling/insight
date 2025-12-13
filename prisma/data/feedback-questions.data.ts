/**
 * Feedback Questions Data
 *
 * Comprehensive database of behavioral observation questions for peer feedback.
 * Each question maps answer options to strength weights (0.0-1.0).
 *
 * Strengths covered (20 total):
 * - Deliverer, Focus Expert, Problem Solver, Time Keeper, Analyst
 * - Believer, Chameleon, Coach, Empathizer, Optimist
 * - Catalyst, Commander, Self-believer, Storyteller, Winner
 * - Brainstormer, Philomath, Strategist, Thinker, Peace Keeper
 */

export interface AnswerOption {
  id: string;
  text: string;
  order: number;
}

export interface StrengthWeight {
  [ strengthId: string ]: number;
}

export interface StrengthMapping {
  [ answerId: string ]: StrengthWeight;
}

export interface FeedbackQuestion {
  order: number;
  text: string;
  answerType: 'behavioral_choice';
  answerOptions: AnswerOption[];
  strengthMapping: StrengthMapping;
}

const feedbackQuestions: FeedbackQuestion[] = [
  // ============================================
  // SECCIÓN 1: ENFRENTANDO DESAFÍOS Y PROBLEMAS
  // ============================================
  {
    order: 1,
    text: 'When facing a complex challenge, this person typically...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q1_a', text: 'Pauses to reflect deeply before proposing solutions', order: 1 },
      { id: 'q1_b', text: 'Quickly generates multiple creative ideas to explore', order: 2 },
      { id: 'q1_c', text: 'Breaks it down into structured, logical steps', order: 3 },
      { id: 'q1_d', text: 'Energizes others to tackle it together', order: 4 },
    ],
    strengthMapping: {
      q1_a: { thinker: 0.9, analyst: 0.7, strategist: 0.6 },
      q1_b: { brainstormer: 0.9, catalyst: 0.6, philomath: 0.5 },
      q1_c: { analyst: 0.8, strategist: 0.7, 'focus-expert': 0.5 },
      q1_d: { catalyst: 0.8, commander: 0.7, optimist: 0.6 },
    },
  },
  {
    order: 2,
    text: 'When something goes wrong unexpectedly, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q2_a', text: 'Immediately starts diagnosing the root cause', order: 1 },
      { id: 'q2_b', text: 'Adapts quickly and finds alternative paths forward', order: 2 },
      { id: 'q2_c', text: 'Stays calm and reassures everyone that it will work out', order: 3 },
      { id: 'q2_d', text: 'Takes charge and assigns clear next steps', order: 4 },
    ],
    strengthMapping: {
      q2_a: { 'problem-solver': 0.9, analyst: 0.7, thinker: 0.5 },
      q2_b: { chameleon: 0.9, 'problem-solver': 0.6, brainstormer: 0.5 },
      q2_c: { optimist: 0.9, 'peace-keeper': 0.7, empathizer: 0.5 },
      q2_d: { commander: 0.9, catalyst: 0.7, deliverer: 0.5 },
    },
  },
  {
    order: 3,
    text: 'When the team encounters obstacles, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q3_a', text: 'Researches thoroughly to understand all angles', order: 1 },
      { id: 'q3_b', text: 'Proposes unconventional solutions others might not see', order: 2 },
      { id: 'q3_c', text: 'Keeps everyone focused on what truly matters', order: 3 },
      { id: 'q3_d', text: 'Ensures commitments are still met despite difficulties', order: 4 },
    ],
    strengthMapping: {
      q3_a: { philomath: 0.9, analyst: 0.7, thinker: 0.6 },
      q3_b: { brainstormer: 0.9, 'problem-solver': 0.7, chameleon: 0.5 },
      q3_c: { 'focus-expert': 0.9, strategist: 0.7, commander: 0.5 },
      q3_d: { deliverer: 0.9, 'time-keeper': 0.7, believer: 0.5 },
    },
  },

  // ============================================
  // SECCIÓN 2: DINÁMICAS DE EQUIPO Y DISCUSIONES
  // ============================================
  {
    order: 4,
    text: "In team discussions, this person's contribution style is best described as...",
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q4_a', text: 'Sharing knowledge and helping others learn', order: 1 },
      { id: 'q4_b', text: 'Keeping everyone positive and focused on possibilities', order: 2 },
      { id: 'q4_c', text: 'Challenging ideas and pushing for excellence', order: 3 },
      { id: 'q4_d', text: 'Building bridges between different perspectives', order: 4 },
    ],
    strengthMapping: {
      q4_a: { philomath: 0.8, coach: 0.7, storyteller: 0.6 },
      q4_b: { optimist: 0.9, 'peace-keeper': 0.6, empathizer: 0.5 },
      q4_c: { winner: 0.8, commander: 0.7, 'self-believer': 0.6 },
      q4_d: { 'peace-keeper': 0.9, empathizer: 0.7, chameleon: 0.6 },
    },
  },
  {
    order: 5,
    text: 'During brainstorming sessions, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q5_a', text: 'Generates a flood of creative and original ideas', order: 1 },
      { id: 'q5_b', text: 'Analyzes which ideas are most feasible', order: 2 },
      { id: 'q5_c', text: 'Connects different ideas into a cohesive strategy', order: 3 },
      { id: 'q5_d', text: 'Encourages everyone to participate and share', order: 4 },
    ],
    strengthMapping: {
      q5_a: { brainstormer: 0.9, philomath: 0.6, chameleon: 0.5 },
      q5_b: { analyst: 0.9, 'problem-solver': 0.7, 'focus-expert': 0.5 },
      q5_c: { strategist: 0.9, thinker: 0.7, analyst: 0.5 },
      q5_d: { coach: 0.8, empathizer: 0.7, 'peace-keeper': 0.6 },
    },
  },
  {
    order: 6,
    text: 'When the team needs to make a decision, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q6_a', text: 'Takes the lead and makes the call decisively', order: 1 },
      { id: 'q6_b', text: 'Ensures everyone has had a chance to voice their opinion', order: 2 },
      { id: 'q6_c', text: 'Presents data and facts to guide the decision', order: 3 },
      { id: 'q6_d', text: 'Considers how the decision aligns with core values', order: 4 },
    ],
    strengthMapping: {
      q6_a: { commander: 0.9, 'self-believer': 0.7, catalyst: 0.6 },
      q6_b: { 'peace-keeper': 0.9, empathizer: 0.8, coach: 0.5 },
      q6_c: { analyst: 0.9, strategist: 0.7, thinker: 0.6 },
      q6_d: { believer: 0.9, deliverer: 0.6, thinker: 0.5 },
    },
  },
  {
    order: 7,
    text: 'When someone shares a new idea in a meeting, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q7_a', text: 'Builds on it with even more creative possibilities', order: 1 },
      { id: 'q7_b', text: 'Evaluates its strengths and potential weaknesses', order: 2 },
      { id: 'q7_c', text: 'Considers how it fits the bigger picture', order: 3 },
      { id: 'q7_d', text: 'Supports the person and creates space for elaboration', order: 4 },
    ],
    strengthMapping: {
      q7_a: { brainstormer: 0.9, optimist: 0.6, catalyst: 0.5 },
      q7_b: { analyst: 0.8, 'problem-solver': 0.7, thinker: 0.6 },
      q7_c: { strategist: 0.9, thinker: 0.7, 'focus-expert': 0.5 },
      q7_d: { empathizer: 0.8, coach: 0.7, 'peace-keeper': 0.6 },
    },
  },

  // ============================================
  // SECCIÓN 3: GESTIÓN DEL TIEMPO Y COMPROMISOS
  // ============================================
  {
    order: 8,
    text: 'When working on projects with deadlines, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q8_a', text: 'Reliably follows through on every commitment', order: 1 },
      { id: 'q8_b', text: 'Takes initiative to get things moving quickly', order: 2 },
      { id: 'q8_c', text: 'Adapts approach based on what the situation needs', order: 3 },
      { id: 'q8_d', text: 'Stays guided by core principles and values', order: 4 },
    ],
    strengthMapping: {
      q8_a: { deliverer: 0.9, 'time-keeper': 0.7, 'focus-expert': 0.6 },
      q8_b: { catalyst: 0.8, commander: 0.6, winner: 0.5 },
      q8_c: { chameleon: 0.9, 'problem-solver': 0.7, brainstormer: 0.5 },
      q8_d: { believer: 0.9, deliverer: 0.6, 'self-believer': 0.5 },
    },
  },
  {
    order: 9,
    text: 'Regarding time management, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q9_a', text: 'Plans meticulously and respects every deadline', order: 1 },
      { id: 'q9_b', text: 'Stays laser-focused on the most important priorities', order: 2 },
      { id: 'q9_c', text: 'Adjusts flexibly when circumstances change', order: 3 },
      { id: 'q9_d', text: 'Pushes to get things done faster than expected', order: 4 },
    ],
    strengthMapping: {
      q9_a: { 'time-keeper': 0.9, deliverer: 0.7, analyst: 0.5 },
      q9_b: { 'focus-expert': 0.9, strategist: 0.7, deliverer: 0.5 },
      q9_c: { chameleon: 0.9, 'problem-solver': 0.6, optimist: 0.5 },
      q9_d: { catalyst: 0.8, winner: 0.7, commander: 0.6 },
    },
  },
  {
    order: 10,
    text: 'When a project is falling behind schedule, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q10_a', text: 'Reorganizes priorities to get back on track', order: 1 },
      { id: 'q10_b', text: 'Motivates the team to push through the challenge', order: 2 },
      { id: 'q10_c', text: 'Identifies what went wrong and proposes fixes', order: 3 },
      { id: 'q10_d', text: 'Doubles down on their own commitments to help', order: 4 },
    ],
    strengthMapping: {
      q10_a: { 'time-keeper': 0.8, strategist: 0.7, 'focus-expert': 0.6 },
      q10_b: { catalyst: 0.8, optimist: 0.7, commander: 0.6 },
      q10_c: { 'problem-solver': 0.9, analyst: 0.7, thinker: 0.5 },
      q10_d: { deliverer: 0.9, believer: 0.6, 'focus-expert': 0.5 },
    },
  },

  // ============================================
  // SECCIÓN 4: MANEJO DE CONFLICTOS Y TENSIONES
  // ============================================
  {
    order: 11,
    text: 'When conflicts or tension arise in the team, this person tends to...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q11_a', text: "Sense others' emotions and create space for everyone", order: 1 },
      { id: 'q11_b', text: 'Step up to make clear decisions and provide direction', order: 2 },
      { id: 'q11_c', text: 'Stay focused on the goal and keep work moving forward', order: 3 },
      { id: 'q11_d', text: "Invest time in developing others' perspectives", order: 4 },
    ],
    strengthMapping: {
      q11_a: { empathizer: 0.9, 'peace-keeper': 0.8, coach: 0.5 },
      q11_b: { commander: 0.9, catalyst: 0.6, winner: 0.5 },
      q11_c: { 'focus-expert': 0.8, deliverer: 0.7, 'time-keeper': 0.5 },
      q11_d: { coach: 0.9, empathizer: 0.7, 'peace-keeper': 0.6 },
    },
  },
  {
    order: 12,
    text: 'When two team members disagree, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q12_a', text: 'Mediates to find common ground and restore harmony', order: 1 },
      { id: 'q12_b', text: 'Helps each person understand the other\'s viewpoint', order: 2 },
      { id: 'q12_c', text: 'Analyzes the facts to determine the best solution', order: 3 },
      { id: 'q12_d', text: 'Makes a decisive call to move things forward', order: 4 },
    ],
    strengthMapping: {
      q12_a: { 'peace-keeper': 0.9, empathizer: 0.7, chameleon: 0.5 },
      q12_b: { coach: 0.8, empathizer: 0.7, 'peace-keeper': 0.6 },
      q12_c: { analyst: 0.8, thinker: 0.7, 'problem-solver': 0.6 },
      q12_d: { commander: 0.9, 'self-believer': 0.6, winner: 0.5 },
    },
  },
  {
    order: 13,
    text: 'In high-pressure situations, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q13_a', text: 'Remains optimistic and lifts team morale', order: 1 },
      { id: 'q13_b', text: 'Thrives on the competition and pressure', order: 2 },
      { id: 'q13_c', text: 'Stays calm and thinks through the situation carefully', order: 3 },
      { id: 'q13_d', text: 'Adapts quickly to changing circumstances', order: 4 },
    ],
    strengthMapping: {
      q13_a: { optimist: 0.9, 'peace-keeper': 0.6, storyteller: 0.5 },
      q13_b: { winner: 0.9, catalyst: 0.7, commander: 0.6 },
      q13_c: { thinker: 0.8, analyst: 0.7, strategist: 0.6 },
      q13_d: { chameleon: 0.9, 'problem-solver': 0.7, catalyst: 0.5 },
    },
  },

  // ============================================
  // SECCIÓN 5: COMUNICACIÓN E INFLUENCIA
  // ============================================
  {
    order: 14,
    text: 'When communicating ideas or plans, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q14_a', text: 'Crafts compelling narratives that engage everyone', order: 1 },
      { id: 'q14_b', text: 'Presents data and logical analysis clearly', order: 2 },
      { id: 'q14_c', text: 'Thinks several steps ahead and maps out scenarios', order: 3 },
      { id: 'q14_d', text: 'Inspires confidence through their self-assurance', order: 4 },
    ],
    strengthMapping: {
      q14_a: { storyteller: 0.9, optimist: 0.6, chameleon: 0.5 },
      q14_b: { analyst: 0.8, strategist: 0.7, thinker: 0.6 },
      q14_c: { strategist: 0.9, thinker: 0.7, 'time-keeper': 0.5 },
      q14_d: { 'self-believer': 0.9, winner: 0.6, commander: 0.5 },
    },
  },
  {
    order: 15,
    text: 'When presenting to a group, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q15_a', text: 'Uses stories and examples to make ideas memorable', order: 1 },
      { id: 'q15_b', text: 'Backs everything up with solid evidence and facts', order: 2 },
      { id: 'q15_c', text: 'Speaks with conviction that inspires trust', order: 3 },
      { id: 'q15_d', text: 'Connects emotionally with the audience', order: 4 },
    ],
    strengthMapping: {
      q15_a: { storyteller: 0.9, brainstormer: 0.6, optimist: 0.5 },
      q15_b: { analyst: 0.9, philomath: 0.7, thinker: 0.5 },
      q15_c: { 'self-believer': 0.9, commander: 0.7, winner: 0.5 },
      q15_d: { empathizer: 0.8, storyteller: 0.7, coach: 0.6 },
    },
  },
  {
    order: 16,
    text: 'When trying to persuade others, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q16_a', text: 'Uses logical arguments and compelling data', order: 1 },
      { id: 'q16_b', text: 'Shares inspiring stories and paints a vision', order: 2 },
      { id: 'q16_c', text: 'Leads by example with unwavering confidence', order: 3 },
      { id: 'q16_d', text: 'Appeals to shared values and beliefs', order: 4 },
    ],
    strengthMapping: {
      q16_a: { analyst: 0.8, thinker: 0.7, strategist: 0.6 },
      q16_b: { storyteller: 0.9, optimist: 0.7, brainstormer: 0.5 },
      q16_c: { 'self-believer': 0.9, commander: 0.7, winner: 0.5 },
      q16_d: { believer: 0.9, coach: 0.6, empathizer: 0.5 },
    },
  },

  // ============================================
  // SECCIÓN 6: LIDERAZGO Y TOMA DE INICIATIVA
  // ============================================
  {
    order: 17,
    text: 'When a project needs to get started, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q17_a', text: 'Jumps in immediately to create momentum', order: 1 },
      { id: 'q17_b', text: 'Develops a comprehensive plan before beginning', order: 2 },
      { id: 'q17_c', text: 'Rallies the team and assigns clear responsibilities', order: 3 },
      { id: 'q17_d', text: 'Ensures the project aligns with important principles', order: 4 },
    ],
    strengthMapping: {
      q17_a: { catalyst: 0.9, winner: 0.6, 'self-believer': 0.5 },
      q17_b: { strategist: 0.9, 'time-keeper': 0.7, analyst: 0.6 },
      q17_c: { commander: 0.9, coach: 0.6, catalyst: 0.5 },
      q17_d: { believer: 0.9, thinker: 0.6, deliverer: 0.5 },
    },
  },
  {
    order: 18,
    text: 'In a leadership role, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q18_a', text: 'Focuses on developing each team member\'s potential', order: 1 },
      { id: 'q18_b', text: 'Sets clear expectations and holds people accountable', order: 2 },
      { id: 'q18_c', text: 'Creates a positive and encouraging environment', order: 3 },
      { id: 'q18_d', text: 'Drives the team to outperform the competition', order: 4 },
    ],
    strengthMapping: {
      q18_a: { coach: 0.9, empathizer: 0.7, philomath: 0.5 },
      q18_b: { commander: 0.9, deliverer: 0.7, 'focus-expert': 0.5 },
      q18_c: { optimist: 0.9, 'peace-keeper': 0.7, storyteller: 0.5 },
      q18_d: { winner: 0.9, catalyst: 0.7, 'self-believer': 0.6 },
    },
  },
  {
    order: 19,
    text: 'When the team lacks direction, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q19_a', text: 'Steps up to take charge and provide clarity', order: 1 },
      { id: 'q19_b', text: 'Develops a strategic vision for the future', order: 2 },
      { id: 'q19_c', text: 'Keeps spirits high and maintains team motivation', order: 3 },
      { id: 'q19_d', text: 'Helps everyone refocus on what matters most', order: 4 },
    ],
    strengthMapping: {
      q19_a: { commander: 0.9, 'self-believer': 0.7, catalyst: 0.6 },
      q19_b: { strategist: 0.9, thinker: 0.7, analyst: 0.5 },
      q19_c: { optimist: 0.9, storyteller: 0.6, 'peace-keeper': 0.5 },
      q19_d: { 'focus-expert': 0.9, believer: 0.6, coach: 0.5 },
    },
  },

  // ============================================
  // SECCIÓN 7: APRENDIZAJE Y CRECIMIENTO
  // ============================================
  {
    order: 20,
    text: 'When it comes to learning new things, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q20_a', text: 'Is constantly curious and seeks deep understanding', order: 1 },
      { id: 'q20_b', text: 'Learns by experimenting and trying things out', order: 2 },
      { id: 'q20_c', text: 'Shares knowledge and helps others grow', order: 3 },
      { id: 'q20_d', text: 'Focuses on learning what\'s most relevant to goals', order: 4 },
    ],
    strengthMapping: {
      q20_a: { philomath: 0.9, thinker: 0.7, analyst: 0.5 },
      q20_b: { catalyst: 0.8, brainstormer: 0.7, chameleon: 0.6 },
      q20_c: { coach: 0.9, philomath: 0.6, storyteller: 0.5 },
      q20_d: { 'focus-expert': 0.8, strategist: 0.7, deliverer: 0.5 },
    },
  },
  {
    order: 21,
    text: 'When facing a topic they don\'t understand, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q21_a', text: 'Dives deep into research until they master it', order: 1 },
      { id: 'q21_b', text: 'Asks experts and learns from others quickly', order: 2 },
      { id: 'q21_c', text: 'Experiments to learn through trial and error', order: 3 },
      { id: 'q21_d', text: 'Thinks it through carefully before acting', order: 4 },
    ],
    strengthMapping: {
      q21_a: { philomath: 0.9, analyst: 0.7, thinker: 0.6 },
      q21_b: { coach: 0.7, empathizer: 0.6, chameleon: 0.5 },
      q21_c: { catalyst: 0.8, brainstormer: 0.7, 'problem-solver': 0.6 },
      q21_d: { thinker: 0.9, strategist: 0.7, analyst: 0.5 },
    },
  },
  {
    order: 22,
    text: 'When helping a teammate improve, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q22_a', text: 'Provides patient guidance and mentorship', order: 1 },
      { id: 'q22_b', text: 'Shares resources and knowledge generously', order: 2 },
      { id: 'q22_c', text: 'Challenges them to push beyond their limits', order: 3 },
      { id: 'q22_d', text: 'Offers emotional support and encouragement', order: 4 },
    ],
    strengthMapping: {
      q22_a: { coach: 0.9, empathizer: 0.6, 'peace-keeper': 0.5 },
      q22_b: { philomath: 0.8, storyteller: 0.6, analyst: 0.5 },
      q22_c: { winner: 0.8, commander: 0.7, 'self-believer': 0.5 },
      q22_d: { empathizer: 0.9, optimist: 0.7, coach: 0.5 },
    },
  },

  // ============================================
  // SECCIÓN 8: CREATIVIDAD E INNOVACIÓN
  // ============================================
  {
    order: 23,
    text: 'When the team needs fresh ideas, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q23_a', text: 'Generates numerous creative possibilities', order: 1 },
      { id: 'q23_b', text: 'Connects seemingly unrelated concepts', order: 2 },
      { id: 'q23_c', text: 'Thinks strategically about long-term impact', order: 3 },
      { id: 'q23_d', text: 'Brings energy and enthusiasm to spark creativity', order: 4 },
    ],
    strengthMapping: {
      q23_a: { brainstormer: 0.9, catalyst: 0.6, philomath: 0.5 },
      q23_b: { brainstormer: 0.8, philomath: 0.7, thinker: 0.6 },
      q23_c: { strategist: 0.9, thinker: 0.7, analyst: 0.5 },
      q23_d: { catalyst: 0.9, optimist: 0.7, storyteller: 0.5 },
    },
  },
  {
    order: 24,
    text: 'When exploring new approaches, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q24_a', text: 'Embraces change and tries new methods eagerly', order: 1 },
      { id: 'q24_b', text: 'Evaluates new approaches against proven methods', order: 2 },
      { id: 'q24_c', text: 'Tells compelling stories about what could be', order: 3 },
      { id: 'q24_d', text: 'Ensures new approaches align with core values', order: 4 },
    ],
    strengthMapping: {
      q24_a: { chameleon: 0.9, catalyst: 0.7, brainstormer: 0.6 },
      q24_b: { analyst: 0.8, 'problem-solver': 0.7, strategist: 0.6 },
      q24_c: { storyteller: 0.9, optimist: 0.6, brainstormer: 0.5 },
      q24_d: { believer: 0.9, thinker: 0.6, deliverer: 0.5 },
    },
  },
  {
    order: 25,
    text: 'When conventional solutions aren\'t working, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q25_a', text: 'Thinks outside the box for creative alternatives', order: 1 },
      { id: 'q25_b', text: 'Analyzes the root cause to find the real issue', order: 2 },
      { id: 'q25_c', text: 'Adapts quickly to try different approaches', order: 3 },
      { id: 'q25_d', text: 'Stays confident that a solution will be found', order: 4 },
    ],
    strengthMapping: {
      q25_a: { brainstormer: 0.9, philomath: 0.6, thinker: 0.5 },
      q25_b: { 'problem-solver': 0.9, analyst: 0.8, thinker: 0.5 },
      q25_c: { chameleon: 0.9, catalyst: 0.6, 'problem-solver': 0.5 },
      q25_d: { 'self-believer': 0.8, optimist: 0.7, winner: 0.5 },
    },
  },

  // ============================================
  // SECCIÓN 9: VALORES Y PRINCIPIOS
  // ============================================
  {
    order: 26,
    text: 'When making important decisions, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q26_a', text: 'Ensures alignment with personal and team values', order: 1 },
      { id: 'q26_b', text: 'Relies on data and objective analysis', order: 2 },
      { id: 'q26_c', text: 'Trusts their instincts and inner confidence', order: 3 },
      { id: 'q26_d', text: 'Considers the impact on all people involved', order: 4 },
    ],
    strengthMapping: {
      q26_a: { believer: 0.9, thinker: 0.6, deliverer: 0.5 },
      q26_b: { analyst: 0.9, strategist: 0.7, thinker: 0.5 },
      q26_c: { 'self-believer': 0.9, commander: 0.6, winner: 0.5 },
      q26_d: { empathizer: 0.9, 'peace-keeper': 0.7, coach: 0.5 },
    },
  },
  {
    order: 27,
    text: 'When asked to compromise on something important, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q27_a', text: 'Stands firm on core principles and values', order: 1 },
      { id: 'q27_b', text: 'Seeks a creative solution that works for everyone', order: 2 },
      { id: 'q27_c', text: 'Adapts flexibly to find middle ground', order: 3 },
      { id: 'q27_d', text: 'Prioritizes maintaining relationships and harmony', order: 4 },
    ],
    strengthMapping: {
      q27_a: { believer: 0.9, 'self-believer': 0.7, commander: 0.5 },
      q27_b: { brainstormer: 0.7, 'problem-solver': 0.7, strategist: 0.6 },
      q27_c: { chameleon: 0.9, 'peace-keeper': 0.6, empathizer: 0.5 },
      q27_d: { 'peace-keeper': 0.9, empathizer: 0.8, coach: 0.5 },
    },
  },
  {
    order: 28,
    text: 'What motivates this person most at work?',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q28_a', text: 'Working on meaningful projects aligned with their values', order: 1 },
      { id: 'q28_b', text: 'Achieving results and outperforming expectations', order: 2 },
      { id: 'q28_c', text: 'Learning and growing their expertise', order: 3 },
      { id: 'q28_d', text: 'Helping others succeed and develop', order: 4 },
    ],
    strengthMapping: {
      q28_a: { believer: 0.9, thinker: 0.6, deliverer: 0.5 },
      q28_b: { winner: 0.9, catalyst: 0.7, 'self-believer': 0.6 },
      q28_c: { philomath: 0.9, analyst: 0.6, thinker: 0.5 },
      q28_d: { coach: 0.9, empathizer: 0.7, 'peace-keeper': 0.5 },
    },
  },

  // ============================================
  // SECCIÓN 10: ADAPTABILIDAD Y RESILIENCIA
  // ============================================
  {
    order: 29,
    text: 'When plans change unexpectedly, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q29_a', text: 'Embraces the change and adapts immediately', order: 1 },
      { id: 'q29_b', text: 'Stays focused on the original goal despite obstacles', order: 2 },
      { id: 'q29_c', text: 'Reassures the team and maintains positivity', order: 3 },
      { id: 'q29_d', text: 'Analyzes the new situation before responding', order: 4 },
    ],
    strengthMapping: {
      q29_a: { chameleon: 0.9, catalyst: 0.6, 'problem-solver': 0.5 },
      q29_b: { 'focus-expert': 0.9, deliverer: 0.7, believer: 0.5 },
      q29_c: { optimist: 0.9, 'peace-keeper': 0.7, empathizer: 0.5 },
      q29_d: { analyst: 0.8, thinker: 0.7, strategist: 0.6 },
    },
  },
  {
    order: 30,
    text: 'In times of uncertainty, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q30_a', text: 'Thrives and sees opportunity in the chaos', order: 1 },
      { id: 'q30_b', text: 'Stays grounded and maintains a long-term view', order: 2 },
      { id: 'q30_c', text: 'Keeps morale high and spirits lifted', order: 3 },
      { id: 'q30_d', text: 'Takes decisive action to create stability', order: 4 },
    ],
    strengthMapping: {
      q30_a: { chameleon: 0.9, catalyst: 0.7, brainstormer: 0.5 },
      q30_b: { strategist: 0.8, thinker: 0.7, believer: 0.6 },
      q30_c: { optimist: 0.9, storyteller: 0.6, 'peace-keeper': 0.5 },
      q30_d: { commander: 0.9, deliverer: 0.6, 'focus-expert': 0.5 },
    },
  },
  {
    order: 31,
    text: 'When facing setbacks, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q31_a', text: 'Bounces back quickly with renewed energy', order: 1 },
      { id: 'q31_b', text: 'Learns from the experience and adjusts approach', order: 2 },
      { id: 'q31_c', text: 'Keeps the team motivated and looking forward', order: 3 },
      { id: 'q31_d', text: 'Doubles down on commitments and pushes through', order: 4 },
    ],
    strengthMapping: {
      q31_a: { catalyst: 0.8, optimist: 0.7, chameleon: 0.6 },
      q31_b: { philomath: 0.7, analyst: 0.7, 'problem-solver': 0.6 },
      q31_c: { optimist: 0.9, storyteller: 0.6, coach: 0.5 },
      q31_d: { deliverer: 0.9, winner: 0.7, 'self-believer': 0.6 },
    },
  },

  // ============================================
  // SECCIÓN 11: COLABORACIÓN Y TRABAJO EN EQUIPO
  // ============================================
  {
    order: 32,
    text: 'As a team member, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q32_a', text: 'Brings people together and builds connections', order: 1 },
      { id: 'q32_b', text: 'Contributes reliable and consistent work', order: 2 },
      { id: 'q32_c', text: 'Challenges the team to aim higher', order: 3 },
      { id: 'q32_d', text: 'Supports others emotionally and professionally', order: 4 },
    ],
    strengthMapping: {
      q32_a: { 'peace-keeper': 0.9, empathizer: 0.7, storyteller: 0.5 },
      q32_b: { deliverer: 0.9, 'time-keeper': 0.7, 'focus-expert': 0.5 },
      q32_c: { winner: 0.8, commander: 0.7, 'self-believer': 0.6 },
      q32_d: { coach: 0.8, empathizer: 0.8, 'peace-keeper': 0.5 },
    },
  },
  {
    order: 33,
    text: 'When working with diverse personalities, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q33_a', text: 'Adapts their style to connect with everyone', order: 1 },
      { id: 'q33_b', text: 'Helps mediate differences and find common ground', order: 2 },
      { id: 'q33_c', text: 'Stays true to their own approach regardless', order: 3 },
      { id: 'q33_d', text: 'Learns from different perspectives with curiosity', order: 4 },
    ],
    strengthMapping: {
      q33_a: { chameleon: 0.9, empathizer: 0.6, storyteller: 0.5 },
      q33_b: { 'peace-keeper': 0.9, empathizer: 0.7, coach: 0.5 },
      q33_c: { 'self-believer': 0.8, believer: 0.7, commander: 0.5 },
      q33_d: { philomath: 0.8, thinker: 0.7, brainstormer: 0.5 },
    },
  },
  {
    order: 34,
    text: 'When the team celebrates success, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q34_a', text: 'Tells the story of how the team achieved it', order: 1 },
      { id: 'q34_b', text: 'Recognizes individual contributions', order: 2 },
      { id: 'q34_c', text: 'Already focuses on the next challenge to win', order: 3 },
      { id: 'q34_d', text: 'Brings infectious energy to the celebration', order: 4 },
    ],
    strengthMapping: {
      q34_a: { storyteller: 0.9, optimist: 0.6, philomath: 0.5 },
      q34_b: { coach: 0.8, empathizer: 0.7, 'peace-keeper': 0.5 },
      q34_c: { winner: 0.9, catalyst: 0.7, 'focus-expert': 0.5 },
      q34_d: { optimist: 0.9, catalyst: 0.7, storyteller: 0.5 },
    },
  },

  // ============================================
  // SECCIÓN 12: ENFOQUE EN RESULTADOS
  // ============================================
  {
    order: 35,
    text: 'When it comes to achieving goals, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q35_a', text: 'Is intensely competitive and driven to be the best', order: 1 },
      { id: 'q35_b', text: 'Follows through on every commitment reliably', order: 2 },
      { id: 'q35_c', text: 'Takes initiative to make things happen quickly', order: 3 },
      { id: 'q35_d', text: 'Maintains unwavering focus on the end goal', order: 4 },
    ],
    strengthMapping: {
      q35_a: { winner: 0.9, 'self-believer': 0.7, commander: 0.5 },
      q35_b: { deliverer: 0.9, 'time-keeper': 0.7, believer: 0.5 },
      q35_c: { catalyst: 0.9, winner: 0.6, commander: 0.5 },
      q35_d: { 'focus-expert': 0.9, strategist: 0.7, deliverer: 0.5 },
    },
  },
  {
    order: 36,
    text: 'When measuring success, this person values...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q36_a', text: 'Beating the competition and being number one', order: 1 },
      { id: 'q36_b', text: 'Completing tasks on time and as promised', order: 2 },
      { id: 'q36_c', text: 'Making a positive impact on people around them', order: 3 },
      { id: 'q36_d', text: 'Achieving goals that align with deeper purpose', order: 4 },
    ],
    strengthMapping: {
      q36_a: { winner: 0.9, catalyst: 0.6, commander: 0.5 },
      q36_b: { deliverer: 0.9, 'time-keeper': 0.8, 'focus-expert': 0.5 },
      q36_c: { empathizer: 0.8, coach: 0.7, 'peace-keeper': 0.6 },
      q36_d: { believer: 0.9, thinker: 0.6, strategist: 0.5 },
    },
  },
  {
    order: 37,
    text: 'When a task seems impossible, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q37_a', text: 'Finds creative ways to make it possible', order: 1 },
      { id: 'q37_b', text: 'Believes firmly they can figure it out', order: 2 },
      { id: 'q37_c', text: 'Breaks it into manageable steps', order: 3 },
      { id: 'q37_d', text: 'Rallies the team to tackle it together', order: 4 },
    ],
    strengthMapping: {
      q37_a: { 'problem-solver': 0.8, brainstormer: 0.7, chameleon: 0.5 },
      q37_b: { 'self-believer': 0.9, optimist: 0.7, winner: 0.5 },
      q37_c: { analyst: 0.7, strategist: 0.7, 'focus-expert': 0.6 },
      q37_d: { catalyst: 0.8, commander: 0.7, coach: 0.5 },
    },
  },

  // ============================================
  // SECCIÓN 13: VISIÓN Y ESTRATEGIA
  // ============================================
  {
    order: 38,
    text: 'When thinking about the future, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q38_a', text: 'Develops comprehensive long-term strategies', order: 1 },
      { id: 'q38_b', text: 'Imagines multiple creative possibilities', order: 2 },
      { id: 'q38_c', text: 'Focuses on what needs to happen right now', order: 3 },
      { id: 'q38_d', text: 'Inspires others with an optimistic vision', order: 4 },
    ],
    strengthMapping: {
      q38_a: { strategist: 0.9, thinker: 0.7, analyst: 0.5 },
      q38_b: { brainstormer: 0.9, philomath: 0.6, chameleon: 0.5 },
      q38_c: { catalyst: 0.8, deliverer: 0.7, 'focus-expert': 0.6 },
      q38_d: { optimist: 0.9, storyteller: 0.7, coach: 0.5 },
    },
  },
  {
    order: 39,
    text: 'When planning for the long term, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q39_a', text: 'Sees patterns and connections others miss', order: 1 },
      { id: 'q39_b', text: 'Creates detailed timelines and milestones', order: 2 },
      { id: 'q39_c', text: 'Keeps flexibility for unexpected changes', order: 3 },
      { id: 'q39_d', text: 'Ensures plans serve a meaningful purpose', order: 4 },
    ],
    strengthMapping: {
      q39_a: { strategist: 0.9, thinker: 0.8, analyst: 0.5 },
      q39_b: { 'time-keeper': 0.9, 'focus-expert': 0.7, deliverer: 0.5 },
      q39_c: { chameleon: 0.9, 'problem-solver': 0.6, brainstormer: 0.5 },
      q39_d: { believer: 0.9, thinker: 0.6, coach: 0.5 },
    },
  },
  {
    order: 40,
    text: 'When analyzing complex situations, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q40_a', text: 'Gathers all available data before concluding', order: 1 },
      { id: 'q40_b', text: 'Reflects deeply to understand underlying dynamics', order: 2 },
      { id: 'q40_c', text: 'Identifies the most critical factors quickly', order: 3 },
      { id: 'q40_d', text: 'Considers how all stakeholders are affected', order: 4 },
    ],
    strengthMapping: {
      q40_a: { analyst: 0.9, philomath: 0.7, 'problem-solver': 0.5 },
      q40_b: { thinker: 0.9, strategist: 0.7, analyst: 0.5 },
      q40_c: { 'focus-expert': 0.8, strategist: 0.7, 'problem-solver': 0.6 },
      q40_d: { empathizer: 0.8, 'peace-keeper': 0.7, coach: 0.5 },
    },
  },
];

export default feedbackQuestions;