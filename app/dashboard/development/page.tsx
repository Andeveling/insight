import { Suspense } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma.db";
import { Skeleton } from "@/components/ui/skeleton";
import { ModuleList } from "./_components/module-list";
import { StatsOverview } from "./_components/stats-overview";
import { XpBar } from "./_components/xp-bar";
import { StrengthGate } from "./_components/strength-gate";
import { GenerateModuleSection } from "./_components/generate-module-section";
import { ProfessionalProfileCheck } from "./_components/professional-profile-check";
import { LevelBadge } from "@/components/gamification";
import {
  getModules,
  getUserStrengthsForDevelopment,
  checkCanGenerateModule,
  getProfessionalProfile,
} from "./_actions";
import { getLevelDetails } from "@/lib/services/level-calculator.service";

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
 */
async function ModulesSection() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const modulesResult = await getModules();

  return (
    <ModuleList
      modulesResult={modulesResult}
      showFilters
      showSearch
      emptyMessage="No hay módulos disponibles para tus fortalezas"
    />
  );
}

/**
 * Generate Module Section Wrapper - Server Component
 */
async function GenerateModuleSectionWrapper() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [strengthsResult, canGenerateResult] = await Promise.all([
    getUserStrengthsForDevelopment(),
    checkCanGenerateModule(),
  ]);

  if (!strengthsResult.hasTop5) {
    return null;
  }

  return (
    <GenerateModuleSection
      strengths={strengthsResult.strengths}
      canGenerate={canGenerateResult.canGenerate}
      blockedMessage={
        canGenerateResult.canGenerate
          ? undefined
          : "Completa tus módulos pendientes antes de generar uno nuevo"
      }
      pendingModules={canGenerateResult.pendingModules ?? []}
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
 * Modules Section Skeleton
 */
function ModulesSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
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
