/**
 * Strength Descriptions
 * Static content for each of the 20 strengths
 * Includes descriptions, characteristics, development tips, and potential blind spots
 */

export interface StrengthDescription {
  id: string;
  name: string;
  domain: "doing" | "thinking" | "feeling" | "motivating";
  tagline: string;
  description: string;
  characteristics: string[];
  developmentTips: string[];
  blindSpots: string[];
  famousPeople?: string[];
}

export const STRENGTH_DESCRIPTIONS: Record<string, StrengthDescription> = {
  // DOING Domain
  analyst: {
    id: "analyst",
    name: "Analyst",
    domain: "doing",
    tagline: "You thrive on data and logical reasoning",
    description:
      "Analysts excel at examining information objectively and making decisions based on facts and evidence. You have a natural ability to identify patterns, spot inconsistencies, and draw logical conclusions.",
    characteristics: [
      "Strong attention to detail",
      "Data-driven decision making",
      "Objective evaluation of situations",
      "Skilled at identifying patterns",
    ],
    developmentTips: [
      "Practice communicating insights in accessible ways",
      "Balance analysis with intuition",
      "Set time limits to avoid over-analysis",
      "Share your analytical process with others",
    ],
    blindSpots: [
      "May overlook emotional factors",
      "Can be perceived as cold or detached",
      "Risk of analysis paralysis",
    ],
  },
  believer: {
    id: "believer",
    name: "Believer",
    domain: "doing",
    tagline: "Your values guide your actions and decisions",
    description:
      "Believers are driven by core values and ethics. You have strong convictions about what matters and are willing to stand up for your beliefs even when it is difficult.",
    characteristics: [
      "Strong ethical foundation",
      "Authentic and genuine",
      "Committed to principles",
      "Inspires trust in others",
    ],
    developmentTips: [
      "Remain open to perspectives that challenge your views",
      "Find common ground with those who disagree",
      "Channel your beliefs into constructive action",
      "Articulate your values clearly to others",
    ],
    blindSpots: [
      "May be seen as inflexible",
      "Can struggle with moral gray areas",
      "Risk of imposing values on others",
    ],
  },
  chameleon: {
    id: "chameleon",
    name: "Chameleon",
    domain: "doing",
    tagline: "You adapt seamlessly to any situation",
    description:
      "Chameleons have remarkable adaptability and can thrive in any environment. You quickly read social situations and adjust your approach accordingly.",
    characteristics: [
      "Highly adaptable",
      "Strong social awareness",
      "Flexible communication style",
      "Comfortable with change",
    ],
    developmentTips: [
      "Develop a strong sense of core identity",
      "Be authentic while remaining adaptable",
      "Use your adaptability to help others adjust",
      "Balance flexibility with consistency",
    ],
    blindSpots: [
      "May lose sense of authentic self",
      "Can appear inconsistent to others",
      "Risk of people-pleasing",
    ],
  },
  catalyst: {
    id: "catalyst",
    name: "Catalyst",
    domain: "doing",
    tagline: "You spark action and drive change",
    description:
      "Catalysts are action-oriented and excel at getting things moving. You have natural ability to energize others and turn ideas into reality.",
    characteristics: [
      "Action-oriented mindset",
      "Energizes and motivates others",
      "Comfortable taking initiative",
      "Drives results and outcomes",
    ],
    developmentTips: [
      "Balance urgency with thorough planning",
      "Ensure buy-in before pushing forward",
      "Listen to concerns about pace of change",
      "Celebrate progress, not just completion",
    ],
    blindSpots: [
      "May rush important decisions",
      "Can be impatient with slower processes",
      "Risk of burning out self and others",
    ],
  },
  brainstormer: {
    id: "brainstormer",
    name: "Brainstormer",
    domain: "doing",
    tagline: "Your mind generates endless possibilities",
    description:
      "Brainstormers are idea generators who see possibilities everywhere. You excel at creative thinking and love exploring new concepts and approaches.",
    characteristics: [
      "Creative and innovative thinking",
      "Generates multiple solutions",
      "Sees connections others miss",
      "Energized by possibilities",
    ],
    developmentTips: [
      "Follow through on your best ideas",
      "Prioritize ideas for maximum impact",
      "Document ideas so they are not lost",
      "Partner with implementers to bring ideas to life",
    ],
    blindSpots: [
      "May struggle with execution",
      "Can overwhelm others with ideas",
      "Risk of abandoning good ideas for new ones",
    ],
  },

  // FEELING Domain
  deliverer: {
    id: "deliverer",
    name: "Deliverer",
    domain: "feeling",
    tagline: "You take responsibility and follow through",
    description:
      "Deliverers are highly dependable and take pride in completing what they commit to. You have a strong sense of responsibility and rarely let others down.",
    characteristics: [
      "Highly reliable and dependable",
      "Strong follow-through",
      "Takes ownership of commitments",
      "Builds trust through actions",
    ],
    developmentTips: [
      "Learn to say no to protect quality",
      "Delegate when appropriate",
      "Set realistic expectations upfront",
      "Take time to recharge between commitments",
    ],
    blindSpots: [
      "May overcommit and burn out",
      "Can feel resentful when others do not match effort",
      "Risk of perfectionism",
    ],
  },
  "focus-expert": {
    id: "focus-expert",
    name: "Focus Expert",
    domain: "feeling",
    tagline: "You maintain laser-sharp concentration",
    description:
      "Focus Experts have exceptional ability to concentrate on priorities and filter out distractions. You help teams stay on track and ensure important work gets done.",
    characteristics: [
      "Exceptional concentration ability",
      "Clear prioritization skills",
      "Filters distractions effectively",
      "Keeps teams aligned on goals",
    ],
    developmentTips: [
      "Remain flexible when priorities shift",
      "Help others understand your focus areas",
      "Take breaks to maintain sustained focus",
      "Balance depth with breadth of perspective",
    ],
    blindSpots: [
      "May miss important peripheral information",
      "Can be perceived as narrow-minded",
      "Risk of tunnel vision",
    ],
  },
  coach: {
    id: "coach",
    name: "Coach",
    domain: "feeling",
    tagline: "You develop and empower others",
    description:
      "Coaches are natural developers of people. You see potential in others and help them grow through guidance, feedback, and encouragement.",
    characteristics: [
      "Sees potential in others",
      "Patient and supportive",
      "Skilled at giving feedback",
      "Invests in others growth",
    ],
    developmentTips: [
      "Balance giving advice with asking questions",
      "Know when to step back and let others fail",
      "Develop your own skills alongside others",
      "Set boundaries to avoid caretaker fatigue",
    ],
    blindSpots: [
      "May invest in people who are not ready",
      "Can be disappointed by lack of progress",
      "Risk of neglecting own development",
    ],
  },
  empathizer: {
    id: "empathizer",
    name: "Empathizer",
    domain: "feeling",
    tagline: "You deeply understand how others feel",
    description:
      "Empathizers have a natural ability to sense and understand the emotions of others. You create psychological safety and help people feel truly heard.",
    characteristics: [
      "Strong emotional intelligence",
      "Creates psychological safety",
      "Builds deep connections",
      "Understands unspoken feelings",
    ],
    developmentTips: [
      "Set emotional boundaries",
      "Balance empathy with objectivity",
      "Practice self-care to avoid emotional exhaustion",
      "Use empathy to drive constructive action",
    ],
    blindSpots: [
      "May absorb others negative emotions",
      "Can struggle with emotional boundaries",
      "Risk of emotional exhaustion",
    ],
  },
  commander: {
    id: "commander",
    name: "Commander",
    domain: "feeling",
    tagline: "You lead with confidence and clarity",
    description:
      "Commanders naturally take charge and provide direction. You are comfortable making decisions and guiding others through uncertainty.",
    characteristics: [
      "Natural leadership presence",
      "Comfortable with decision-making",
      "Provides clear direction",
      "Confident under pressure",
    ],
    developmentTips: [
      "Seek input before making decisions",
      "Develop others leadership abilities",
      "Practice active listening",
      "Balance assertiveness with collaboration",
    ],
    blindSpots: [
      "May dominate conversations",
      "Can overlook others input",
      "Risk of appearing controlling",
    ],
  },

  // MOTIVATING Domain
  "problem-solver": {
    id: "problem-solver",
    name: "Problem Solver",
    domain: "motivating",
    tagline: "You thrive on finding solutions",
    description:
      "Problem Solvers are energized by challenges and excel at finding solutions. You approach obstacles as opportunities and persist until you find a way forward.",
    characteristics: [
      "Energized by challenges",
      "Persistent in finding solutions",
      "Creative problem-solving approach",
      "Stays calm under pressure",
    ],
    developmentTips: [
      "Know when to ask for help",
      "Document solutions for future reference",
      "Share your problem-solving process with others",
      "Balance solving problems with preventing them",
    ],
    blindSpots: [
      "May try to fix things that are not broken",
      "Can be frustrated by others complacency",
      "Risk of overlooking simple solutions",
    ],
  },
  optimist: {
    id: "optimist",
    name: "Optimist",
    domain: "motivating",
    tagline: "You see possibilities where others see obstacles",
    description:
      "Optimists bring positive energy and hope to any situation. You naturally focus on opportunities and help others maintain perspective during difficult times.",
    characteristics: [
      "Positive outlook on life",
      "Resilient in adversity",
      "Uplifts team morale",
      "Sees opportunities in challenges",
    ],
    developmentTips: [
      "Acknowledge challenges while staying positive",
      "Validate others concerns before reframing",
      "Balance optimism with realism",
      "Use optimism to inspire action, not denial",
    ],
    blindSpots: [
      "May minimize real problems",
      "Can frustrate those dealing with difficulties",
      "Risk of being seen as naive",
    ],
  },
  "self-believer": {
    id: "self-believer",
    name: "Self-Believer",
    domain: "motivating",
    tagline: "You have unshakeable confidence in your abilities",
    description:
      "Self-Believers have strong inner confidence and self-assurance. You trust your abilities and are willing to take on challenges that others might avoid.",
    characteristics: [
      "Strong self-confidence",
      "Takes on ambitious challenges",
      "Resilient to criticism",
      "Inspires confidence in others",
    ],
    developmentTips: [
      "Seek and accept constructive feedback",
      "Acknowledge the contributions of others",
      "Balance confidence with humility",
      "Use your confidence to encourage others",
    ],
    blindSpots: [
      "May miss blind spots in self-assessment",
      "Can appear arrogant",
      "Risk of underestimating challenges",
    ],
  },
  philomath: {
    id: "philomath",
    name: "Philomath",
    domain: "motivating",
    tagline: "You have an insatiable love of learning",
    description:
      "Philomaths are driven by curiosity and the desire to learn. You constantly seek new knowledge and find joy in the learning process itself.",
    characteristics: [
      "Insatiable curiosity",
      "Continuous learner",
      "Quick to acquire new skills",
      "Shares knowledge generously",
    ],
    developmentTips: [
      "Apply learning to practical situations",
      "Share knowledge to reinforce learning",
      "Balance breadth with depth of expertise",
      "Focus learning on high-impact areas",
    ],
    blindSpots: [
      "May pursue learning over action",
      "Can become a knowledge hoarder",
      "Risk of analysis paralysis",
    ],
  },
  "peace-keeper": {
    id: "peace-keeper",
    name: "Peace Keeper",
    domain: "motivating",
    tagline: "You create harmony and resolve conflicts",
    description:
      "Peace Keepers excel at maintaining harmony and resolving conflicts. You have a natural ability to find common ground and help people work together effectively.",
    characteristics: [
      "Natural mediator",
      "Finds common ground",
      "Reduces tension effectively",
      "Builds bridges between people",
    ],
    developmentTips: [
      "Address conflicts directly when needed",
      "Balance harmony with healthy debate",
      "Voice your own opinions and needs",
      "Know when conflict is productive",
    ],
    blindSpots: [
      "May avoid necessary conflict",
      "Can suppress own needs for harmony",
      "Risk of enabling poor behavior",
    ],
  },

  // THINKING Domain
  "time-keeper": {
    id: "time-keeper",
    name: "Time Keeper",
    domain: "thinking",
    tagline: "You maximize every moment",
    description:
      "Time Keepers excel at managing time and priorities effectively. You help others stay on track and ensure that important work gets completed on schedule.",
    characteristics: [
      "Exceptional time management",
      "Keeps projects on schedule",
      "Efficient and organized",
      "Respects deadlines",
    ],
    developmentTips: [
      "Build in buffer time for unexpected delays",
      "Balance efficiency with quality",
      "Allow time for creative exploration",
      "Be patient with those who have different time perspectives",
    ],
    blindSpots: [
      "May prioritize speed over thoroughness",
      "Can be frustrated by delays",
      "Risk of becoming rigid about schedules",
    ],
  },
  storyteller: {
    id: "storyteller",
    name: "Storyteller",
    domain: "thinking",
    tagline: "You bring ideas to life through narrative",
    description:
      "Storytellers have a gift for communication and making ideas memorable. You use narrative to engage, inspire, and help others understand complex concepts.",
    characteristics: [
      "Compelling communicator",
      "Makes complex ideas accessible",
      "Engages and inspires audiences",
      "Memorable presentations",
    ],
    developmentTips: [
      "Balance storytelling with data and evidence",
      "Adapt stories for different audiences",
      "Listen as much as you speak",
      "Use stories to inspire action, not just entertainment",
    ],
    blindSpots: [
      "May oversimplify complex issues",
      "Can dominate conversations",
      "Risk of style over substance",
    ],
  },
  winner: {
    id: "winner",
    name: "Winner",
    domain: "thinking",
    tagline: "You compete to achieve excellence",
    description:
      "Winners are driven by competition and the desire to achieve. You set high standards and push yourself and others toward excellence.",
    characteristics: [
      "Driven to succeed",
      "Sets high standards",
      "Thrives in competition",
      "Pushes for excellence",
    ],
    developmentTips: [
      "Celebrate others successes",
      "Compete with your past self, not just others",
      "Define winning in terms of growth, not just results",
      "Balance competition with collaboration",
    ],
    blindSpots: [
      "May create unnecessary competition",
      "Can struggle with losing gracefully",
      "Risk of burning out from constant striving",
    ],
  },
  strategist: {
    id: "strategist",
    name: "Strategist",
    domain: "thinking",
    tagline: "You see the big picture and plan accordingly",
    description:
      "Strategists excel at seeing patterns and planning for the future. You think several steps ahead and help others navigate complexity with clear direction.",
    characteristics: [
      "Long-term thinking",
      "Sees patterns and connections",
      "Plans for multiple scenarios",
      "Navigates complexity effectively",
    ],
    developmentTips: [
      "Balance planning with execution",
      "Communicate strategy in accessible terms",
      "Remain flexible when plans need to change",
      "Involve others in strategic thinking",
    ],
    blindSpots: [
      "May overcomplicate simple situations",
      "Can be slow to act",
      "Risk of missing short-term opportunities",
    ],
  },
  thinker: {
    id: "thinker",
    name: "Thinker",
    domain: "thinking",
    tagline: "You reflect deeply before acting",
    description:
      "Thinkers value reflection and careful consideration. You process information thoroughly and provide thoughtful insights that others often miss.",
    characteristics: [
      "Deep reflective thinking",
      "Thorough analysis",
      "Thoughtful insights",
      "Values quality over speed",
    ],
    developmentTips: [
      "Set time limits for reflection",
      "Share your thoughts even when not fully formed",
      "Balance thinking with action",
      "Use reflection to prepare for action, not avoid it",
    ],
    blindSpots: [
      "May overthink and delay action",
      "Can appear disengaged in fast-paced situations",
      "Risk of missing opportunities while reflecting",
    ],
  },
};

/**
 * Get strength description by ID
 */
export function getStrengthDescription(strengthId: string): StrengthDescription | null {
  const normalizedId = strengthId.toLowerCase().replace(/[_\s]+/g, "-");
  return STRENGTH_DESCRIPTIONS[ normalizedId ] ?? null;
}

/**
 * Get all strengths for a domain
 */
export function getStrengthsByDomain(domain: string): StrengthDescription[] {
  return Object.values(STRENGTH_DESCRIPTIONS).filter(
    (s) => s.domain === domain.toLowerCase()
  );
}
