/**
 * RoadmapEmptyState Component
 *
 * Displayed when there are no modules available in the roadmap.
 */

import { BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * RoadmapEmptyState - Empty state for the roadmap
 *
 * Shows a friendly message encouraging users to:
 * - Complete their strength assessment
 * - Or generate personalized modules
 */
export function RoadmapEmptyState() {
	return (
		<div className="flex flex-col items-center justify-center w-full h-[400px] rounded-xl border border-dashed bg-muted/20 p-8">
			<div className="flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
				<BookOpen className="size-8 text-primary" />
			</div>

			<h3 className="text-lg font-semibold text-center mb-2">
				Tu camino de desarrollo te espera
			</h3>

			<p className="text-sm text-muted-foreground text-center max-w-md mb-6">
				Aún no tienes módulos de desarrollo disponibles. Completa tu evaluación de
				fortalezas para desbloquear contenido personalizado.
			</p>

			<div className="flex items-center gap-3">
				<Button asChild variant="outline">
					<Link href="/dashboard/assessment">
						<Sparkles className="size-4 mr-2" />
						Evaluar Fortalezas
					</Link>
				</Button>
			</div>
		</div>
	);
}
