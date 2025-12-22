/**
 * Complete Quest Integration Tests
 *
 * Integration tests for quest completion flow with XP update and level up.
 * Uses mocked Prisma client and session for testing.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuestStatus, QuestType } from "@/generated/prisma/enums";

// Mock auth session
vi.mock("@/lib/auth", () => ({
	getSession: vi.fn(),
}));

// Mock Prisma
vi.mock("@/lib/prisma.db", () => ({
	prisma: {
		questCompletion: {
			findFirst: vi.fn(),
			update: vi.fn(),
		},
		strengthMaturityLevel: {
			findUnique: vi.fn(),
			upsert: vi.fn(),
		},
	},
}));

// Mock maturity level service
vi.mock(
	"@/app/dashboard/strength-levels/_services/maturity-level.service",
	() => ({
		addXpToMaturityLevel: vi.fn(),
	}),
);

import {
	completeQuest,
	startQuest,
} from "@/app/dashboard/strength-levels/_actions/complete-quest";
import { addXpToMaturityLevel } from "@/app/dashboard/strength-levels/_services/maturity-level.service";
// Import after mocking
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";

const mockedGetSession = getSession as ReturnType<typeof vi.fn>;
const mockedPrisma = prisma as unknown as {
	questCompletion: {
		findFirst: ReturnType<typeof vi.fn>;
		update: ReturnType<typeof vi.fn>;
	};
	strengthMaturityLevel: {
		findUnique: ReturnType<typeof vi.fn>;
		upsert: ReturnType<typeof vi.fn>;
	};
};
const mockedAddXpToMaturityLevel = addXpToMaturityLevel as ReturnType<
	typeof vi.fn
>;

// Test fixtures
const mockUser = {
	id: "a1234567-89ab-4def-8123-456789abcdef",
	email: "test@example.com",
	name: "Test User",
};

const mockQuestCompletion = {
	id: "b1234567-89ab-4def-8123-456789abcdef",
	userId: "a1234567-89ab-4def-8123-456789abcdef",
	questId: "c1234567-89ab-4def-8123-456789abcdef",
	status: QuestStatus.AVAILABLE,
	expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
	createdAt: new Date(),
	quest: {
		id: "c1234567-89ab-4def-8123-456789abcdef",
		strengthId: "d1234567-89ab-4def-8123-456789abcdef",
		type: QuestType.DAILY,
		title: "Test Quest",
		description: "Test Description",
		xpReward: 50,
		difficulty: 1,
		icon: "📚",
		isActive: true,
		requiresPartner: false,
	},
};

describe("Complete Quest Integration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockedGetSession.mockResolvedValue({
			user: mockUser,
		});
	});

	describe("completeQuest", () => {
		it("should complete quest and award XP successfully", async () => {
			mockedPrisma.questCompletion.findFirst.mockResolvedValue(
				mockQuestCompletion,
			);
			mockedPrisma.questCompletion.update.mockResolvedValue({
				...mockQuestCompletion,
				status: QuestStatus.COMPLETED,
				completedAt: new Date(),
				xpAwarded: 50,
			});
			mockedAddXpToMaturityLevel.mockResolvedValue({
				maturityLevel: { xpCurrent: 550, maturityLevel: "CONNECTOR" },
				leveledUp: true,
				newLevel: "CONNECTOR",
			});

			const result = await completeQuest({
				questId: "b1234567-89ab-4def-8123-456789abcdef",
			});

			expect(result.success).toBe(true);
			expect(result.xpAwarded).toBe(50);
			expect(result.leveledUp).toBe(true);
			expect(result.newLevel).toBe("CONNECTOR");
			expect(result.newXpCurrent).toBe(550);

			// Verify addXpToMaturityLevel was called with correct args
			expect(mockedAddXpToMaturityLevel).toHaveBeenCalledWith(
				"a1234567-89ab-4def-8123-456789abcdef",
				"d1234567-89ab-4def-8123-456789abcdef",
				50,
			);

			// Verify quest was marked as completed
			expect(mockedPrisma.questCompletion.update).toHaveBeenCalledWith({
				where: { id: "b1234567-89ab-4def-8123-456789abcdef" },
				data: expect.objectContaining({
					status: QuestStatus.COMPLETED,
					xpAwarded: 50,
				}),
			});
		});

		it("should return error when user not authenticated", async () => {
			mockedGetSession.mockResolvedValue(null);

			const result = await completeQuest({
				questId: "b1234567-89ab-4def-8123-456789abcdef",
			});

			expect(result.success).toBe(false);
			expect(result.error).toBe("Usuario no autenticado");
			expect(result.xpAwarded).toBe(0);
		});

		it("should return error when quest not found", async () => {
			mockedPrisma.questCompletion.findFirst.mockResolvedValue(null);

			const result = await completeQuest({
				questId: "e1234567-89ab-4def-8123-456789abcdef",
			});

			expect(result.success).toBe(false);
			expect(result.error).toBe("Misión no encontrada o ya completada");
		});

		it("should return error when quest is expired", async () => {
			const expiredQuest = {
				...mockQuestCompletion,
				expiresAt: new Date(Date.now() - 1000), // Already expired
			};
			mockedPrisma.questCompletion.findFirst.mockResolvedValue(expiredQuest);

			const result = await completeQuest({
				questId: "b1234567-89ab-4def-8123-456789abcdef",
			});

			expect(result.success).toBe(false);
			expect(result.error).toBe("Esta misión ha expirado");
		});

		it("should return error when cooperative quest lacks confirmation", async () => {
			const coopQuest = {
				...mockQuestCompletion,
				quest: {
					...mockQuestCompletion.quest,
					type: QuestType.COOPERATIVE,
					requiresPartner: true,
				},
			};
			mockedPrisma.questCompletion.findFirst.mockResolvedValue(coopQuest);

			const result = await completeQuest({
				questId: "b1234567-89ab-4def-8123-456789abcdef",
			});

			expect(result.success).toBe(false);
			expect(result.error).toBe(
				"Las misiones cooperativas requieren confirmación de un compañero",
			);
		});

		it("should complete cooperative quest with confirmation", async () => {
			const coopQuest = {
				...mockQuestCompletion,
				quest: {
					...mockQuestCompletion.quest,
					type: QuestType.COOPERATIVE,
					requiresPartner: true,
					xpReward: 75,
				},
			};
			mockedPrisma.questCompletion.findFirst.mockResolvedValue(coopQuest);
			mockedPrisma.questCompletion.update.mockResolvedValue({
				...coopQuest,
				status: QuestStatus.COMPLETED,
			});
			mockedAddXpToMaturityLevel.mockResolvedValue({
				maturityLevel: { xpCurrent: 175, maturityLevel: "SPONGE" },
				leveledUp: false,
			});

			const result = await completeQuest({
				questId: "b1234567-89ab-4def-8123-456789abcdef",
				confirmedBy: "f1234567-89ab-4def-8123-456789abcdef",
			});

			expect(result.success).toBe(true);
			expect(result.xpAwarded).toBe(75);

			// Verify confirmedBy was saved
			expect(mockedPrisma.questCompletion.update).toHaveBeenCalledWith({
				where: { id: "b1234567-89ab-4def-8123-456789abcdef" },
				data: expect.objectContaining({
					confirmedBy: "f1234567-89ab-4def-8123-456789abcdef",
					confirmedAt: expect.any(Date),
				}),
			});
		});

		it("should handle level up correctly", async () => {
			mockedPrisma.questCompletion.findFirst.mockResolvedValue(
				mockQuestCompletion,
			);
			mockedPrisma.questCompletion.update.mockResolvedValue({
				...mockQuestCompletion,
				status: QuestStatus.COMPLETED,
			});
			mockedAddXpToMaturityLevel.mockResolvedValue({
				maturityLevel: { xpCurrent: 500, maturityLevel: "CONNECTOR" },
				leveledUp: true,
				newLevel: "CONNECTOR",
			});

			const result = await completeQuest({
				questId: "b1234567-89ab-4def-8123-456789abcdef",
			});

			expect(result.success).toBe(true);
			expect(result.leveledUp).toBe(true);
			expect(result.newLevel).toBe("CONNECTOR");
		});

		it("should not level up when staying in same level", async () => {
			mockedPrisma.questCompletion.findFirst.mockResolvedValue(
				mockQuestCompletion,
			);
			mockedPrisma.questCompletion.update.mockResolvedValue({
				...mockQuestCompletion,
				status: QuestStatus.COMPLETED,
			});
			mockedAddXpToMaturityLevel.mockResolvedValue({
				maturityLevel: { xpCurrent: 150, maturityLevel: "SPONGE" },
				leveledUp: false,
			});

			const result = await completeQuest({
				questId: "b1234567-89ab-4def-8123-456789abcdef",
			});

			expect(result.success).toBe(true);
			expect(result.leveledUp).toBe(false);
			expect(result.newLevel).toBeUndefined();
		});

		it("should return validation error for invalid input", async () => {
			const result = await completeQuest({ questId: "" });

			expect(result.success).toBe(false);
			expect(result.error).toBeDefined();
		});
	});

	describe("startQuest", () => {
		it("should start quest successfully", async () => {
			mockedPrisma.questCompletion.update.mockResolvedValue({
				...mockQuestCompletion,
				status: QuestStatus.IN_PROGRESS,
				startedAt: new Date(),
			});

			const result = await startQuest("b1234567-89ab-4def-8123-456789abcdef");

			expect(result.success).toBe(true);
			expect(mockedPrisma.questCompletion.update).toHaveBeenCalledWith({
				where: {
					id: "b1234567-89ab-4def-8123-456789abcdef",
					userId: "a1234567-89ab-4def-8123-456789abcdef",
					status: QuestStatus.AVAILABLE,
				},
				data: expect.objectContaining({
					status: QuestStatus.IN_PROGRESS,
					startedAt: expect.any(Date),
				}),
			});
		});

		it("should return error when user not authenticated", async () => {
			mockedGetSession.mockResolvedValue(null);

			const result = await startQuest("b1234567-89ab-4def-8123-456789abcdef");

			expect(result.success).toBe(false);
			expect(result.error).toBe("Usuario no autenticado");
		});

		it("should handle database errors gracefully", async () => {
			mockedPrisma.questCompletion.update.mockRejectedValue(
				new Error("Database error"),
			);

			const result = await startQuest("b1234567-89ab-4def-8123-456789abcdef");

			expect(result.success).toBe(false);
			expect(result.error).toBe("Database error");
		});
	});

	describe("XP Calculation Flow", () => {
		it("should correctly pass XP amount to maturity level service", async () => {
			const questWithHighXp = {
				...mockQuestCompletion,
				quest: {
					...mockQuestCompletion.quest,
					type: QuestType.BOSS_BATTLE,
					xpReward: 150,
				},
			};
			mockedPrisma.questCompletion.findFirst.mockResolvedValue(questWithHighXp);
			mockedPrisma.questCompletion.update.mockResolvedValue({
				...questWithHighXp,
				status: QuestStatus.COMPLETED,
			});
			mockedAddXpToMaturityLevel.mockResolvedValue({
				maturityLevel: { xpCurrent: 250, maturityLevel: "SPONGE" },
				leveledUp: false,
			});

			const result = await completeQuest({
				questId: "b1234567-89ab-4def-8123-456789abcdef",
			});

			expect(result.success).toBe(true);
			expect(result.xpAwarded).toBe(150);
			expect(mockedAddXpToMaturityLevel).toHaveBeenCalledWith(
				"a1234567-89ab-4def-8123-456789abcdef",
				"d1234567-89ab-4def-8123-456789abcdef",
				150,
			);
		});

		it("should handle IN_PROGRESS quests correctly", async () => {
			const inProgressQuest = {
				...mockQuestCompletion,
				status: QuestStatus.IN_PROGRESS,
			};
			mockedPrisma.questCompletion.findFirst.mockResolvedValue(inProgressQuest);
			mockedPrisma.questCompletion.update.mockResolvedValue({
				...inProgressQuest,
				status: QuestStatus.COMPLETED,
			});
			mockedAddXpToMaturityLevel.mockResolvedValue({
				maturityLevel: { xpCurrent: 100, maturityLevel: "SPONGE" },
				leveledUp: false,
			});

			const result = await completeQuest({
				questId: "b1234567-89ab-4def-8123-456789abcdef",
			});

			expect(result.success).toBe(true);
			expect(result.xpAwarded).toBe(50);
		});
	});
});
