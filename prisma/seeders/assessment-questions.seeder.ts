import type { PrismaClient } from "../../generated/prisma/client";
import { allAssessmentQuestions } from "../data/assessment-questions.data";

export async function seedAssessmentQuestions(prisma: PrismaClient) {
	console.log("📝 Seeding assessment questions...");

	try {
		// First, get all domains to map domain names to IDs
		const domains = await prisma.domain.findMany();
		const domainMap = new Map(domains.map((d) => [d.name, d.id]));

		// Get all strengths to map strength names to IDs
		const strengths = await prisma.strength.findMany();
		const strengthMap = new Map(strengths.map((s) => [s.name, s.id]));

		console.log(
			`   Found ${domains.length} domains and ${strengths.length} strengths`,
		);

		// Delete existing assessment questions (for clean reseed)
		const deletedCount = await prisma.assessmentQuestion.deleteMany();
		console.log(`   Deleted ${deletedCount.count} existing questions`);

		// Prepare questions for insertion
		const questionsToInsert = allAssessmentQuestions.map((q) => {
			const domainId = domainMap.get(q.domain);
			if (!domainId) {
				throw new Error(`Domain "${q.domain}" not found in database`);
			}

			let strengthId: string | null = null;
			if (q.strength) {
				strengthId = strengthMap.get(q.strength) || null;
				if (!strengthId) {
					console.warn(
						`   ⚠️  Strength "${q.strength}" not found, skipping strength assignment for question ${q.order}`,
					);
				}
			}

			return {
				phase: q.phase,
				order: q.order,
				text: q.text,
				type: q.type,
				options: q.options ? JSON.stringify(q.options) : null,
				scaleRange: q.scaleRange ? JSON.stringify(q.scaleRange) : null,
				domainId,
				strengthId,
				weight: q.weight,
			};
		});

		// Insert questions in batches (to avoid potential issues with large inserts)
		const batchSize = 20;
		let insertedCount = 0;

		for (let i = 0; i < questionsToInsert.length; i += batchSize) {
			const batch = questionsToInsert.slice(i, i + batchSize);
			await prisma.assessmentQuestion.createMany({
				data: batch,
			});
			insertedCount += batch.length;
			console.log(
				`   Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(questionsToInsert.length / batchSize)} (${insertedCount}/${questionsToInsert.length} questions)`,
			);
		}

		// Verify insertion
		const totalQuestions = await prisma.assessmentQuestion.count();
		const phase1Count = await prisma.assessmentQuestion.count({
			where: { phase: 1 },
		});
		const phase2Count = await prisma.assessmentQuestion.count({
			where: { phase: 2 },
		});
		const phase3Count = await prisma.assessmentQuestion.count({
			where: { phase: 3 },
		});

		console.log(
			`   ✅ Successfully seeded ${totalQuestions} assessment questions`,
		);
		console.log(`      Phase 1 (Domain Discovery): ${phase1Count} questions`);
		console.log(
			`      Phase 2 (Strength Refinement): ${phase2Count} questions`,
		);
		console.log(
			`      Phase 3 (Ranking Confirmation): ${phase3Count} questions`,
		);
	} catch (error) {
		console.error("   ❌ Error seeding assessment questions:", error);
		throw error;
	}
}
