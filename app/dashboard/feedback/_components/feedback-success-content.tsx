"use client";

/**
 * FeedbackSuccessContent Component
 *
 * Client component that handles XP celebration from URL params
 * Part of Feature 008: Feedback Gamification Integration
 */

import { use } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { FeedbackSuccessCelebration } from "./feedback-success-celebration";
import type {
	AwardXpResult,
	UnlockedBadge,
} from "@/lib/types/gamification.types";

interface FeedbackSuccessContentProps {
	searchParams: Promise<{
		xp?: string;
		level?: string;
		badges?: string;
	}>;
}

/**
 * Displays success message with optional gamification celebration
 */
export function FeedbackSuccessContent({
	searchParams,
}: FeedbackSuccessContentProps) {
	const params = use(searchParams);

	// Parse XP data from URL params (if present)
	const xpData: AwardXpResult | undefined = params.xp
		? JSON.parse(decodeURIComponent(params.xp))
		: undefined;

	const badges: UnlockedBadge[] | undefined = params.badges
		? JSON.parse(decodeURIComponent(params.badges))
		: undefined;

	// If XP data present, show celebration
	if (xpData) {
		return (
			<FeedbackSuccessCelebration
				celebrationData={{
					xpResult: xpData,
					unlockedBadges: badges,
				}}
			/>
		);
	}

	// Fallback: Simple success message (progressive enhancement)
	return (
		<div className="max-w-lg mx-auto">
			<Card>
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
						<CheckCircle2 className="h-8 w-8 text-success" />
					</div>
					<CardTitle className="text-2xl">Respuesta Enviada</CardTitle>
					<CardDescription>
						Tu feedback ayudará a tu compañero a crecer profesionalmente
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
						<p className="flex items-center gap-2">
							<Users className="h-4 w-4" />
							Tu respuesta ha sido registrada de forma{" "}
							<strong className="text-foreground">anónima</strong>.
						</p>
						<p className="mt-2">
							Tu compañero recibirá los insights una vez que tenga suficientes
							respuestas.
						</p>
					</div>

					<div className="flex flex-col gap-2">
						<Link href="/dashboard/feedback">
							<Button className="w-full">
								<ArrowLeft className="h-4 w-4 mr-2" />
								Volver al Dashboard de Feedback
							</Button>
						</Link>
						<Link href="/dashboard">
							<Button variant="outline" className="w-full">
								Ir al Dashboard Principal
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
