/**
 * Quest Generator Service Unit Tests
 *
 * Tests for daily quest generation logic.
 * Uses mocked Prisma client for unit testing.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuestStatus, QuestType } from "@/generated/prisma/enums";

// Mock Prisma before importing the service
vi.mock("@/lib/prisma.db", () => ({
	prisma: {
		userStrength: {
			findMany: vi.fn(),
		},
		questCompletion: {
			findMany: vi.fn(),
			create: vi.fn(),
		},
		quest: {
			findMany: vi.fn(),
		},
	},
}));

import {
	generateDailyQuestsForUser,
	getActiveQuestsForUser,
	getExpiringQuests,
} from "@/app/dashboard/strength-levels/_services/quest-generator.service";
// Import after mocking
import { prisma } from "@/lib/prisma.db";

const mockedPrisma = prisma as unknown as {
	userStrength: {
		findMany: ReturnType<typeof vi.fn>;
	};
	questCompletion: {
		findMany: ReturnType<typeof vi.fn>;
		create: ReturnType<typeof vi.fn>;
	};
	quest: {
		findMany: ReturnType<typeof vi.fn>;
	};
};

// Sample test data
const mockStrengths = [
	{ userId: "user-1", strengthId: "strength-1" },
	{ userId: "user-1", strengthId: "strength-2" },
	{ userId: "user-1", strengthId: "strength-3" },
];

const mockQuestTemplates = [
	{
		id: "quest-template-1",
		strengthId: "strength-1",
		type: QuestType.DAILY,
		title: "Quest 1",
		description: "Description 1",
		xpReward: 50,
		difficulty: 1,
		icon: "📚",
		isActive: true,
		strength: { id: "strength-1", name: "Empathy" },
	},
	{
		id: "quest-template-2",
		strengthId: "strength-2",
		type: QuestType.DAILY,
		title: "Quest 2",
		description: "Description 2",
		xpReward: 50,
		difficulty: 2,
		icon: "🎯",
		isActive: true,
		strength: { id: "strength-2", name: "Optimizer" },
	},
	{
		id: "quest-template-3",
		strengthId: "strength-3",
		type: QuestType.DAILY,
		title: "Quest 3",
		description: "Description 3",
		xpReward: 50,
		difficulty: 1,
		icon: "💡",
		isActive: true,
		strength: { id: "strength-3", name: "Believer" },
	},
];

describe("Quest Generator Service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("generateDailyQuestsForUser", () => {
		it("should return error when user has no strengths configured", async () => {
			mockedPrisma.userStrength.findMany.mockResolvedValue([]);

			const result = await generateDailyQuestsForUser("user-1");

			expect(result.success).toBe(false);
			expect(result.error).toBe("Usuario no tiene fortalezas configuradas");
			expect(result.quests).toEqual([]);
		});

		it("should generate 3 daily quests for user with strengths", async () => {
			mockedPrisma.userStrength.findMany.mockResolvedValue(mockStrengths);
			mockedPrisma.questCompletion.findMany.mockResolvedValue([]);
			mockedPrisma.quest.findMany.mockResolvedValue(mockQuestTemplates);

			let createCallCount = 0;
			mockedPrisma.questCompletion.create.mockImplementation(
				async (args: { data: { questId: string } }) => ({
					id: `completion-${++createCallCount}`,
					userId: "user-1",
					questId: args.data.questId,
					status: QuestStatus.AVAILABLE,
					expiresAt: new Date(),
					createdAt: new Date(),
				}),
			);

			const result = await generateDailyQuestsForUser("user-1");

			expect(result.success).toBe(true);
			expect(result.quests.length).toBe(3);
			expect(mockedPrisma.questCompletion.create).toHaveBeenCalledTimes(3);
		});

		it("should not generate quests if user already has daily quests today", async () => {
			mockedPrisma.userStrength.findMany.mockResolvedValue(mockStrengths);

			// User already has 3 daily quests today
			const existingQuests = mockQuestTemplates.map((t, i) => ({
				id: `existing-${i}`,
				questId: t.id,
				quest: { ...t },
				status: QuestStatus.AVAILABLE,
				createdAt: new Date(),
				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
			}));

			mockedPrisma.questCompletion.findMany.mockResolvedValue(existingQuests);

			const result = await generateDailyQuestsForUser("user-1");

			expect(result.success).toBe(true);
			expect(result.error).toBe("Usuario ya tiene misiones diarias para hoy");
			expect(result.quests).toEqual([]);
		});

		it("should exclude already active quests when selecting templates", async () => {
			mockedPrisma.userStrength.findMany.mockResolvedValue(mockStrengths);

			// User has 1 active quest from 2 days ago (not today, so doesn't count toward daily limit)
			mockedPrisma.questCompletion.findMany.mockResolvedValue([
				{
					id: "existing-1",
					questId: "quest-template-1",
					quest: mockQuestTemplates[0],
					status: QuestStatus.IN_PROGRESS,
					createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
					expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
				},
			]);

			// Return templates excluding the one already active
			mockedPrisma.quest.findMany.mockImplementation(
				async (args: { where: { id?: { notIn: string[] } } }) => {
					const excludeIds = args.where.id?.notIn || [];
					return mockQuestTemplates.filter((t) => !excludeIds.includes(t.id));
				},
			);

			let createCallCount = 0;
			mockedPrisma.questCompletion.create.mockImplementation(
				async (args: { data: { questId: string } }) => ({
					id: `completion-${++createCallCount}`,
					userId: "user-1",
					questId: args.data.questId,
					status: QuestStatus.AVAILABLE,
					expiresAt: new Date(),
					createdAt: new Date(),
				}),
			);

			const result = await generateDailyQuestsForUser("user-1");

			expect(result.success).toBe(true);
			// Should create only 2 quests (3 max - but only 2 templates available after exclusion)
			expect(result.quests.length).toBe(2);

			// Verify that quest.findMany was called with exclusion
			expect(mockedPrisma.quest.findMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: expect.objectContaining({
						id: expect.objectContaining({
							notIn: ["quest-template-1"],
						}),
					}),
				}),
			);
		});

		it("should return error when no quest templates available", async () => {
			mockedPrisma.userStrength.findMany.mockResolvedValue(mockStrengths);
			mockedPrisma.questCompletion.findMany.mockResolvedValue([]);
			mockedPrisma.quest.findMany.mockResolvedValue([]);

			const result = await generateDailyQuestsForUser("user-1");

			expect(result.success).toBe(false);
			expect(result.error).toBe(
				"No hay plantillas de misiones disponibles para las fortalezas del usuario",
			);
		});

		it("should include correct quest metadata in generated quests", async () => {
			mockedPrisma.userStrength.findMany.mockResolvedValue([mockStrengths[0]]);
			mockedPrisma.questCompletion.findMany.mockResolvedValue([]);
			mockedPrisma.quest.findMany.mockResolvedValue([mockQuestTemplates[0]]);

			mockedPrisma.questCompletion.create.mockResolvedValue({
				id: "completion-1",
				userId: "user-1",
				questId: "quest-template-1",
				status: QuestStatus.AVAILABLE,
				expiresAt: new Date(),
			});

			const result = await generateDailyQuestsForUser("user-1");

			expect(result.success).toBe(true);
			expect(result.quests.length).toBe(1);

			const quest = result.quests[0];
			expect(quest.questId).toBe("quest-template-1");
			expect(quest.questCompletionId).toBe("completion-1");
			expect(quest.strengthId).toBe("strength-1");
			expect(quest.strengthName).toBe("Empathy");
			expect(quest.title).toBe("Quest 1");
			expect(quest.xpReward).toBe(50);
			expect(quest.difficulty).toBe(1);
			expect(quest.icon).toBe("📚");
			expect(quest.expiresAt).toBeInstanceOf(Date);
		});
	});

	describe("getActiveQuestsForUser", () => {
		it("should separate quests by type", async () => {
			const mixedQuests = [
				{
					id: "completion-1",
					questId: "quest-1",
					quest: { ...mockQuestTemplates[0], type: QuestType.DAILY },
					status: QuestStatus.AVAILABLE,
					expiresAt: new Date(Date.now() + 1000000),
				},
				{
					id: "completion-2",
					questId: "quest-2",
					quest: {
						...mockQuestTemplates[1],
						type: QuestType.BOSS_BATTLE,
					},
					status: QuestStatus.IN_PROGRESS,
					expiresAt: null,
				},
				{
					id: "completion-3",
					questId: "quest-3",
					quest: {
						...mockQuestTemplates[2],
						type: QuestType.COMBO_BREAKER,
					},
					status: QuestStatus.AVAILABLE,
					expiresAt: new Date(Date.now() + 1000000),
				},
			];

			mockedPrisma.questCompletion.findMany.mockResolvedValue(mixedQuests);

			const result = await getActiveQuestsForUser("user-1");

			expect(result.dailyQuests.length).toBe(1);
			expect(result.bossQuests.length).toBe(1);
			expect(result.comboQuests.length).toBe(1);
			expect(result.coopQuests.length).toBe(0);
		});

		it("should return empty arrays when no active quests", async () => {
			mockedPrisma.questCompletion.findMany.mockResolvedValue([]);

			const result = await getActiveQuestsForUser("user-1");

			expect(result.dailyQuests).toEqual([]);
			expect(result.bossQuests).toEqual([]);
			expect(result.comboQuests).toEqual([]);
			expect(result.coopQuests).toEqual([]);
		});
	});

	describe("getExpiringQuests", () => {
		it("should return quests expiring within threshold", () => {
			const now = Date.now();
			const quests = [
				{
					id: "1",
					expiresAt: new Date(now + 1 * 60 * 60 * 1000), // 1 hour from now
					quest: mockQuestTemplates[0],
					status: QuestStatus.AVAILABLE,
				},
				{
					id: "2",
					expiresAt: new Date(now + 3 * 60 * 60 * 1000), // 3 hours from now
					quest: mockQuestTemplates[1],
					status: QuestStatus.IN_PROGRESS,
				},
				{
					id: "3",
					expiresAt: new Date(now - 1000), // Already expired
					quest: mockQuestTemplates[2],
					status: QuestStatus.AVAILABLE,
				},
			] as unknown as Parameters<typeof getExpiringQuests>[0];

			const result = getExpiringQuests(quests, 2);

			expect(result.length).toBe(1);
			expect(result[0].id).toBe("1");
		});

		it("should return empty array when no quests expiring soon", () => {
			const now = Date.now();
			const quests = [
				{
					id: "1",
					expiresAt: new Date(now + 10 * 60 * 60 * 1000), // 10 hours from now
					quest: mockQuestTemplates[0],
				},
				{
					id: "2",
					expiresAt: null, // No expiration
					quest: mockQuestTemplates[1],
				},
			] as unknown as Parameters<typeof getExpiringQuests>[0];

			const result = getExpiringQuests(quests, 2);

			expect(result.length).toBe(0);
		});

		it("should exclude quests without expiresAt", () => {
			const quests = [
				{
					id: "1",
					expiresAt: null,
					quest: mockQuestTemplates[0],
				},
			] as unknown as Parameters<typeof getExpiringQuests>[0];

			const result = getExpiringQuests(quests, 2);

			expect(result.length).toBe(0);
		});
	});

	describe("Quest Selection Variety", () => {
		it("should prefer selecting quests from different strengths", async () => {
			// Setup: 6 templates, 2 per strength
			const templates = [
				{ ...mockQuestTemplates[0], id: "q1", strengthId: "s1" },
				{ ...mockQuestTemplates[0], id: "q2", strengthId: "s1" },
				{ ...mockQuestTemplates[1], id: "q3", strengthId: "s2" },
				{ ...mockQuestTemplates[1], id: "q4", strengthId: "s2" },
				{ ...mockQuestTemplates[2], id: "q5", strengthId: "s3" },
				{ ...mockQuestTemplates[2], id: "q6", strengthId: "s3" },
			];

			mockedPrisma.userStrength.findMany.mockResolvedValue([
				{ strengthId: "s1" },
				{ strengthId: "s2" },
				{ strengthId: "s3" },
			]);
			mockedPrisma.questCompletion.findMany.mockResolvedValue([]);
			mockedPrisma.quest.findMany.mockResolvedValue(templates);

			let createCallCount = 0;
			mockedPrisma.questCompletion.create.mockImplementation(
				async (args: { data: { questId: string } }) => ({
					id: `completion-${++createCallCount}`,
					questId: args.data.questId,
				}),
			);

			const result = await generateDailyQuestsForUser("user-1");

			expect(result.success).toBe(true);
			expect(result.quests.length).toBe(3);

			// Check that we have variety - should have quests from at least 2 different strengths
			const uniqueStrengths = new Set(result.quests.map((q) => q.strengthId));
			expect(uniqueStrengths.size).toBeGreaterThanOrEqual(2);
		});
	});
});
