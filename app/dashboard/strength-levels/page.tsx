/**
 * Strength Levels Page
 *
 * Main page displaying user's strength maturity levels with progress visualization.
 * Uses Cache Components pattern with Suspense for optimal SSR performance.
 */

import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getMaturityLevels } from "./_actions/get-maturity-levels";
import {
	DailyQuestsSection,
	DailyQuestsSectionSkeleton,
} from "./_components/daily-quests-section";
import { MaturityLevelCard } from "./_components/maturity-level-card";

/**
 * Static shell - prerendered with PPR
 */
export default function StrengthLevelsPage() {
	return (
		<div className="space-y-10">
			{/* Daily Quests Section */}
			<Suspense fallback={<DailyQuestsSectionSkeleton />}>
				<DailyQuestsSection />
			</Suspense>

			{/* Separator */}
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-border/30" />
				</div>
				<div className="relative flex justify-center">
					<span className="bg-background px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
						PROGRESO DE FORTALEZAS
					</span>
				</div>
			</div>

			{/* Section Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
						TUS FORTALEZAS
					</h2>
					<p className="text-xs text-muted-foreground/60 mt-1">
						PROGRESO DE MADUREZ POR FORTALEZA
					</p>
				</div>

				{/* Stats Badge */}
				<div
					className="px-3 py-1.5 text-xs font-mono text-primary border border-primary/30 bg-primary/5"
					style={{
						clipPath:
							"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
					}}
				>
					[SISTEMA_V1.0]
				</div>
			</div>

			{/* Maturity Levels Grid */}
			<Suspense fallback={<MaturityLevelsGridSkeleton />}>
				<MaturityLevelsGrid />
			</Suspense>
		</div>
	);
}

/**
 * Dynamic content - fetches user data at request time
 */
async function MaturityLevelsGrid() {
	const result = await getMaturityLevels();

	if (!result.success) {
		return (
			<div
				className="p-6 border border-destructive/30 bg-destructive/5 text-center"
				style={{
					clipPath:
						"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
				}}
			>
				<p className="text-sm font-bold uppercase tracking-wider text-destructive">
					[ERROR_PROTOCOLO]
				</p>
				<p className="text-xs text-muted-foreground mt-1">
					{result.error || "No se pudieron cargar los niveles de madurez"}
				</p>
			</div>
		);
	}

	if (result.maturityLevels.length === 0) {
		return (
			<div
				className="p-8 border border-border/30 bg-muted/10 text-center"
				style={{
					clipPath:
						"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
				}}
			>
				<div className="text-4xl mb-4">🌱</div>
				<p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
					NO HAY FORTALEZAS REGISTRADAS
				</p>
				<p className="text-xs text-muted-foreground/60 mt-2 max-w-md mx-auto">
					Completa tu evaluación de fortalezas HIGH5 para comenzar tu viaje de
					desarrollo.
				</p>
			</div>
		);
	}

	return (
		<div
			className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
			data-testid="maturity-levels-grid"
		>
			{result.maturityLevels.map((level) => (
				<MaturityLevelCard key={level.id} maturityLevel={level} />
			))}
		</div>
	);
}

/**
 * Skeleton loader for the maturity levels grid
 */
function MaturityLevelsGridSkeleton() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{Array.from({ length: 5 }).map((_, i) => (
				<MaturityLevelCardSkeleton key={i} />
			))}
		</div>
	);
}

/**
 * Skeleton for a single maturity level card
 */
function MaturityLevelCardSkeleton() {
	return (
		<div
			className="p-4 border border-border/30 bg-muted/10 space-y-4"
			style={{
				clipPath:
					"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
			}}
		>
			{/* Header */}
			<div className="flex items-start justify-between gap-3">
				<div className="flex-1 space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-3 w-16" />
				</div>
				<Skeleton
					className="w-8 h-9"
					style={{
						clipPath:
							"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
					}}
				/>
			</div>

			{/* Progress Bar */}
			<div className="space-y-1.5">
				<div className="flex justify-between">
					<Skeleton className="h-3 w-6" />
					<Skeleton className="h-3 w-16" />
				</div>
				<Skeleton className="h-3 w-full" />
			</div>
		</div>
	);
}
