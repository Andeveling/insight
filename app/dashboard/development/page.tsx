import { BookOpen } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LevelBadge } from "@/components/gamification";
import { Skeleton } from "@/components/ui/skeleton";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import { getLevelDetails } from "@/lib/services/level-calculator.service";
import {
	getModules,
	getProfessionalProfile,
	getUserStrengthsForDevelopment,
} from "./_actions";
import { GenerateModuleSection } from "./_components/generate-module-section";
import { ModulesRoadmapSection } from "./_components/modules-roadmap-section";
import { ProfessionalProfileCheck } from "./_components/professional-profile-check";
import { StatsOverview } from "./_components/stats-overview";
import { StrengthGate } from "./_components/strength-gate";
import { XpBar } from "./_components/xp-bar";

/**
 * Development Feature - Main Page
 *
 * Shows overview of user's development progress and available modules.
 * Uses Cache Components pattern for optimal performance.
 * REFACTORED: Now gates access based on Top 5 strengths.
 */
export default function DevelopmentPage() {
	return (
		<div className="container mx-auto space-y-8 p-6">
			{/* Page Header */}
			<header className="space-y-2">
				<div className="flex items-center gap-3">
					<div className="rounded-lg bg-primary/10 p-2">
						<BookOpen className="h-6 w-6 text-primary" />
					</div>
					<div>
						<h1 className="text-2xl font-bold">Desarrollo de Fortalezas</h1>
						<p className="text-muted-foreground">
							Explora módulos para potenciar tus habilidades únicas
						</p>
					</div>
				</div>
			</header>

			{/* Strength Gate: Only show content if user has Top 5 */}
			<StrengthGate>
				{/* Profile Check: Shows onboarding modal for first-time users */}
				<Suspense fallback={null}>
					<ProfileCheckWrapper>
						{/* User Progress Section */}
						<Suspense fallback={<ProgressSkeleton />}>
							<UserProgressSection />
						</Suspense>

						{/* Modules Section */}
						<section className="space-y-4 mt-8">
							<h2 className="text-xl font-semibold">Módulos Disponibles</h2>
							<Suspense fallback={<ModulesSkeleton />}>
								<ModulesSection />
							</Suspense>
						</section>

						{/* Generate Personalized Module Section */}
						<section className="mt-8">
							<Suspense fallback={<GenerateSectionSkeleton />}>
								<GenerateModuleSectionWrapper />
							</Suspense>
						</section>
					</ProfileCheckWrapper>
				</Suspense>
			</StrengthGate>
		</div>
	);
}

/**
 * User Progress Section - Server Component
 */
async function UserProgressSection() {
	const session = await getSession();

	if (!session?.user?.id) {
		redirect("/login");
	}

	// Get or create gamification record
	const gamification = await prisma.userGamification.upsert({
		where: { userId: session.user.id },
		update: {},
		create: {
			userId: session.user.id,
			xpTotal: 0,
			currentLevel: 1,
			currentStreak: 0,
			longestStreak: 0,
		},
	});

	// Get stats
	const [modulesCompleted, challengesCompleted] = await Promise.all([
		prisma.userModuleProgress.count({
			where: { userId: session.user.id, status: "completed" },
		}),
		prisma.userChallengeProgress.count({
			where: { userId: session.user.id, completed: true },
		}),
	]);

	// Calculate level details
	const levelDetails = getLevelDetails(gamification.xpTotal);

	return (
		<div className="space-y-6">
			{/* Level and XP Bar */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
				<LevelBadge
					level={levelDetails.level}
					size="lg"
					showName
					animated={false}
				/>
				<div className="flex-1">
					<XpBar
						currentXp={gamification.xpTotal}
						minXp={levelDetails.minXp}
						maxXp={levelDetails.maxXp}
						level={levelDetails.level}
						size="md"
					/>
				</div>
			</div>

			{/* Stats Overview */}
			<StatsOverview
				xpTotal={gamification.xpTotal}
				currentLevel={levelDetails.level}
				modulesCompleted={modulesCompleted}
				challengesCompleted={challengesCompleted}
				currentStreak={gamification.currentStreak}
			/>
		</div>
	);
}

/**
 * Modules Section - Server Component
 * Now renders the Learning Path Flow roadmap visualization
 */
async function ModulesSection() {
	const session = await getSession();

	if (!session?.user?.id) {
		redirect("/login");
	}

	const modulesResult = await getModules();

	// Combine general and personalized modules for the roadmap
	const modules = [...modulesResult.personalized, ...modulesResult.general];

	return <ModulesRoadmapSection modules={modules} />;
}

/**
 * Generate Module Section Wrapper - Server Component
 *
 * Only shows buttons for strengths WITHOUT personalized modules.
 * Checks per-strength to avoid showing buttons for already-generated modules.
 */
async function GenerateModuleSectionWrapper() {
	const session = await getSession();

	if (!session?.user?.id) {
		redirect("/login");
	}

	const strengthsResult = await getUserStrengthsForDevelopment();

	if (!strengthsResult.hasTop5) {
		return null;
	}

	// Check which strengths already have personalized modules
	const existingPersonalizedModules = await prisma.developmentModule.findMany({
		where: {
			userId: session.user.id,
			moduleType: "personalized",
			isArchived: false,
		},
		select: { strengthKey: true },
	});

	const existingStrengthKeys = new Set(
		existingPersonalizedModules
			.map((m) => m.strengthKey)
			.filter((key): key is string => key !== null),
	);

	// Filter out strengths that already have personalized modules
	const availableStrengths = strengthsResult.strengths.filter(
		(strength) => !existingStrengthKeys.has(strength.key),
	);

	// Don't show section if all strengths have modules
	if (availableStrengths.length === 0) {
		return null;
	}

	// Check if any pending modules exist (for global message)
	const pendingModules = await prisma.userModuleProgress.findMany({
		where: {
			userId: session.user.id,
			status: { in: ["not_started", "in_progress"] },
		},
		include: {
			module: { select: { titleEs: true, strengthKey: true } },
		},
		take: 5,
	});

	const formattedPendingModules = pendingModules.map((pm) => {
		const percentComplete =
			pm.totalChallenges > 0
				? Math.round((pm.completedChallenges / pm.totalChallenges) * 100)
				: 0;

		return {
			id: pm.moduleId,
			titleEs: pm.module.titleEs,
			percentComplete,
		};
	});

	return (
		<GenerateModuleSection
			strengths={availableStrengths}
			canGenerate={true}
			blockedMessage={undefined}
			pendingModules={formattedPendingModules}
			totalStrengths={strengthsResult.strengths.length}
			availableCount={availableStrengths.length}
		/>
	);
}

/**
 * Profile Check Wrapper - Server Component
 * Checks if user has completed professional profile and passes props to client
 */
async function ProfileCheckWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const profileResult = await getProfessionalProfile();

	return (
		<ProfessionalProfileCheck
			hasCompletedProfile={profileResult.isComplete}
			isFirstTime={!profileResult.hasProfile}
		>
			{children}
		</ProfessionalProfileCheck>
	);
}

/**
 * Progress Section Skeleton
 */
function ProgressSkeleton() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
				<Skeleton className="h-10 w-32 rounded-full" />
				<div className="flex-1 space-y-2">
					<div className="flex justify-between">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-16" />
					</div>
					<Skeleton className="h-2.5 w-full" />
				</div>
			</div>
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<Skeleton key={i} className="h-24 rounded-lg" />
				))}
			</div>
		</div>
	);
}

/**
 * Modules Section Skeleton - Roadmap style
 */
function ModulesSkeleton() {
	return (
		<div className="relative w-full h-[600px] rounded-xl border bg-background">
			<div className="absolute top-4 left-4 z-10">
				<Skeleton className="h-10 w-40" />
			</div>
			<div className="flex items-center justify-center h-full">
				<div className="flex flex-col items-center gap-4">
					<div className="flex gap-6">
						<Skeleton className="h-20 w-44 rounded-xl" />
						<Skeleton className="h-20 w-44 rounded-xl" />
						<Skeleton className="h-20 w-44 rounded-xl" />
					</div>
					<Skeleton className="h-16 w-1" />
					<div className="flex gap-6">
						<Skeleton className="h-20 w-44 rounded-xl" />
						<Skeleton className="h-20 w-44 rounded-xl" />
						<Skeleton className="h-20 w-44 rounded-xl" />
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Generate Section Skeleton
 */
function GenerateSectionSkeleton() {
	return (
		<div className="space-y-4 p-6 rounded-lg border border-dashed bg-muted/30">
			<div className="flex items-center gap-2">
				<Skeleton className="h-5 w-5 rounded" />
				<Skeleton className="h-6 w-48" />
			</div>
			<Skeleton className="h-4 w-72" />
			<div className="flex flex-wrap gap-2 mt-4">
				{[1, 2, 3, 4, 5].map((i) => (
					<Skeleton key={i} className="h-10 w-32 rounded-full" />
				))}
			</div>
		</div>
	);
}
