/**
 * XP History Page
 *
 * Timeline view of all XP transactions with filtering and export
 * Part of Feature 008: Feedback Gamification Integration
 *
 * Uses Cache Components pattern (Next.js 16):
 * - Static shell with Suspense boundary
 * - Dynamic content loaded in PageContent component
 */

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import DashboardContainer from "@/app/dashboard/_components/dashboard-container";
import {
  XpHistoryList,
  XpHistoryListSkeleton,
} from "../../_components/xp-history-list";
import { getXpHistoryAction } from "../../_actions/xp-history.actions";

/**
 * Metadata for the page
 */
export const metadata = {
  title: "Historial de XP | Feedback | Insight",
  description: "Revisa todo tu historial de XP ganado",
};

/**
 * Static shell - prerendered
 */
export default function XpHistoryPage() {
  return (
    <DashboardContainer
      title="Historial de XP"
      description="Revisa todas las recompensas de XP que has ganado por tus actividades"
    >
      <Suspense fallback={<XpHistoryListSkeleton />}>
        <XpHistoryPageContent />
      </Suspense>
    </DashboardContainer>
  );
}

/**
 * Dynamic content - renders at request time
 */
async function XpHistoryPageContent() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const result = await getXpHistoryAction();

  if (!result.success || !result.data) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="text-destructive">
          Error al cargar el historial: {result.error}
        </p>
      </div>
    );
  }

  return (
    <XpHistoryList
      initialTransactions={result.data.transactions}
      totalXp={result.data.totalXp}
      totalTransactions={result.data.totalTransactions}
      feedbackXpTotal={result.data.feedbackXpTotal}
      feedbackTransactionCount={result.data.feedbackTransactionCount}
    />
  );
}
