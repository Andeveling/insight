import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Trophy, BookOpen, Users } from "lucide-react";
import { getSession } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InteractiveChallengeList } from "../_components/interactive-challenge-list";
import {
  PeerLearners,
  PeerLearnersSkeleton,
  CollaborativeChallengeList,
} from "../_components";
import {
  getModuleDetail,
  startModule,
  getPeerLearners,
  getPendingCollaborativeChallenges,
} from "../_actions";
import ReactMarkdown from "react-markdown";

interface ModuleDetailPageProps {
  params: Promise<{ moduleId: string }>;
}

/**
 * Module Detail Page
 *
 * Shows full module content with challenges and progress.
 * Uses Cache Components pattern.
 */
export default async function ModuleDetailPage({
  params,
}: ModuleDetailPageProps) {
  const { moduleId } = await params;

  return (
    <div className="container mx-auto p-6">
      <Suspense fallback={<ModuleDetailSkeleton />}>
        <ModuleDetailContent moduleId={moduleId} />
      </Suspense>
    </div>
  );
}

/**
 * Module Detail Content - Server Component
 */
async function ModuleDetailContent({ moduleId }: { moduleId: string }) {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  let moduleDetail;
  try {
    moduleDetail = await getModuleDetail({ moduleId });
  } catch {
    notFound();
  }

  const { module: devModule, challenges, progress } = moduleDetail;

  // Auto-start module if not started
  if (progress.status === "not_started") {
    await startModule({ moduleId });
  }

  const levelConfig = {
    beginner: {
      label: "Principiante",
      className:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    },
    intermediate: {
      label: "Intermedio",
      className:
        "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    },
    advanced: {
      label: "Avanzado",
      className:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    },
  };

  const levelInfo = levelConfig[devModule.level];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Navigation */}
      <Link
        href="/dashboard/development"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a módulos
      </Link>

      {/* Module Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={levelInfo.className}>
                {levelInfo.label}
              </Badge>
              {devModule.moduleType === "personalized" && (
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                >
                  ✨ Personalizado
                </Badge>
              )}
              {devModule.moduleType === "general" && (
                <Badge variant="outline">📚 General</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{devModule.titleEs}</h1>
            <p className="text-lg text-muted-foreground">
              {devModule.descriptionEs}
            </p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {devModule.estimatedMinutes} minutos
          </span>
          <span className="flex items-center gap-1.5">
            <Trophy className="h-4 w-4" />
            {devModule.xpReward} XP al completar
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            {challenges.length} desafíos
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progreso del módulo</span>
            <span className="font-medium">{progress.percentComplete}%</span>
          </div>
          <Progress value={progress.percentComplete} className="h-2" />
        </div>
      </header>

      <Separator />

      {/* Module Content with Tabs */}
      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="content" className="gap-1">
            <BookOpen className="h-4 w-4" />
            Contenido
          </TabsTrigger>
          <TabsTrigger value="challenges" className="gap-1">
            <Trophy className="h-4 w-4" />
            Desafíos
          </TabsTrigger>
          <TabsTrigger value="community" className="gap-1">
            <Users className="h-4 w-4" />
            Comunidad
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Contenido del Módulo
          </h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown>{devModule.content}</ReactMarkdown>
          </div>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges">
          <InteractiveChallengeList
            challenges={challenges}
            moduleId={devModule.id}
          />
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="space-y-6">
          <Suspense fallback={<PeerLearnersSkeleton />}>
            <CommunitySection moduleId={devModule.id} />
          </Suspense>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4">
        <Link href="/dashboard/development">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        {progress.status === "completed" && (
          <Badge variant="default" className="bg-green-500">
            ✓ Módulo Completado
          </Badge>
        )}
      </div>
    </div>
  );
}

/**
 * Get domain display label
 */
function getDomainLabel(domainKey: string): string {
  const labels: Record<string, string> = {
    doing: "Hacer",
    feeling: "Sentir",
    motivating: "Motivar",
    thinking: "Pensar",
  };
  return labels[domainKey] || domainKey;
}

/**
 * Community Section - Server Component
 *
 * Shows peer learners and pending collaborative challenges.
 */
async function CommunitySection({ moduleId }: { moduleId: string }) {
  const session = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  const [peerLearners, pendingChallenges] = await Promise.all([
    getPeerLearners(moduleId),
    getPendingCollaborativeChallenges(),
  ]);

  // Filter pending challenges for this module (if needed)
  const relevantPending = pendingChallenges;

  return (
    <div className="space-y-6">
      {/* Pending Collaborative Challenges */}
      {relevantPending.length > 0 && (
        <CollaborativeChallengeList pendingChallenges={relevantPending} />
      )}

      {/* Peer Learners */}
      <PeerLearners peers={peerLearners} moduleId={moduleId} />
    </div>
  );
}

/**
 * Module Detail Skeleton
 */
function ModuleDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Skeleton className="h-5 w-32" />

      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-28" />
        </div>
        <Skeleton className="h-2 w-full" />
      </div>

      <Skeleton className="h-px w-full" />

      <div className="space-y-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>

      <Skeleton className="h-px w-full" />

      <div className="space-y-4">
        <Skeleton className="h-7 w-32" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}
