/**
 * Feedback Questions Seeder
 * Seeds the 5 behavioral observation questions for peer feedback
 * Based on research.md question design
 */

import type { PrismaClient } from '../../generated/prisma/client';

/**
 * Feedback questions with strength mappings
 * Each question maps answer options to strength weights (0.0-1.0)
 */
const feedbackQuestions = [
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
    text: "In team discussions, this person's contribution style is best described as...",
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q2_a', text: 'Sharing knowledge and helping others learn', order: 1 },
      { id: 'q2_b', text: 'Keeping everyone positive and focused on possibilities', order: 2 },
      { id: 'q2_c', text: 'Challenging ideas and pushing for excellence', order: 3 },
      { id: 'q2_d', text: 'Building bridges between different perspectives', order: 4 },
    ],
    strengthMapping: {
      q2_a: { philomath: 0.8, coach: 0.7, storyteller: 0.6 },
      q2_b: { optimist: 0.9, 'peace-keeper': 0.6, empathizer: 0.5 },
      q2_c: { winner: 0.8, commander: 0.7, 'self-believer': 0.6 },
      q2_d: { 'peace-keeper': 0.9, empathizer: 0.7, chameleon: 0.6 },
    },
  },
  {
    order: 3,
    text: 'When working on projects with deadlines, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q3_a', text: 'Reliably follows through on every commitment', order: 1 },
      { id: 'q3_b', text: 'Takes initiative to get things moving quickly', order: 2 },
      { id: 'q3_c', text: 'Adapts approach based on what the situation needs', order: 3 },
      { id: 'q3_d', text: 'Stays guided by core principles and values', order: 4 },
    ],
    strengthMapping: {
      q3_a: { deliverer: 0.9, 'time-keeper': 0.7, 'focus-expert': 0.6 },
      q3_b: { catalyst: 0.8, commander: 0.6, winner: 0.5 },
      q3_c: { chameleon: 0.9, 'problem-solver': 0.7, brainstormer: 0.5 },
      q3_d: { believer: 0.9, deliverer: 0.6, 'self-believer': 0.5 },
    },
  },
  {
    order: 4,
    text: 'When conflicts or tension arise in the team, this person tends to...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q4_a', text: 'Sense others emotions and create space for everyone', order: 1 },
      { id: 'q4_b', text: 'Step up to make clear decisions and provide direction', order: 2 },
      { id: 'q4_c', text: 'Stay focused on the goal and keep work moving forward', order: 3 },
      { id: 'q4_d', text: 'Invest time in developing others perspectives', order: 4 },
    ],
    strengthMapping: {
      q4_a: { empathizer: 0.9, 'peace-keeper': 0.8, coach: 0.5 },
      q4_b: { commander: 0.9, catalyst: 0.6, winner: 0.5 },
      q4_c: { 'focus-expert': 0.8, deliverer: 0.7, 'time-keeper': 0.5 },
      q4_d: { coach: 0.9, empathizer: 0.7, 'peace-keeper': 0.6 },
    },
  },
  {
    order: 5,
    text: 'When communicating ideas or plans, this person...',
    answerType: 'behavioral_choice',
    answerOptions: [
      { id: 'q5_a', text: 'Crafts compelling narratives that engage everyone', order: 1 },
      { id: 'q5_b', text: 'Presents data and logical analysis clearly', order: 2 },
      { id: 'q5_c', text: 'Thinks several steps ahead and maps out scenarios', order: 3 },
      { id: 'q5_d', text: 'Inspires confidence through their self-assurance', order: 4 },
    ],
    strengthMapping: {
      q5_a: { storyteller: 0.9, optimist: 0.6, chameleon: 0.5 },
      q5_b: { analyst: 0.8, strategist: 0.7, thinker: 0.6 },
      q5_c: { strategist: 0.9, thinker: 0.7, 'time-keeper': 0.5 },
      q5_d: { 'self-believer': 0.9, winner: 0.6, commander: 0.5 },
    },
  },
];

/**
 * Seeds the feedback questions into the database
 */
export async function seedFeedbackQuestions(prisma: PrismaClient): Promise<void> {
  console.log('🌱 Seeding feedback questions...');

  for (const question of feedbackQuestions) {
    await prisma.feedbackQuestion.upsert({
      where: { order: question.order },
      update: {
        text: question.text,
        answerType: question.answerType,
        answerOptions: JSON.stringify(question.answerOptions),
        strengthMapping: JSON.stringify(question.strengthMapping),
      },
      create: {
        text: question.text,
        answerType: question.answerType,
        answerOptions: JSON.stringify(question.answerOptions),
        strengthMapping: JSON.stringify(question.strengthMapping),
        order: question.order,
      },
    });

    console.log(`  ✅ Question ${question.order}: ${question.text.slice(0, 50)}...`);
  }

  console.log(`🎉 Seeded ${feedbackQuestions.length} feedback questions`);
}

/**
 * Clears all feedback questions from the database
 */
export async function clearFeedbackQuestions(prisma: PrismaClient): Promise<void> {
  console.log('🧹 Clearing feedback questions...');
  await prisma.feedbackQuestion.deleteMany({});
  console.log('✅ Cleared all feedback questions');
}
