"use client";

import { useMemo, useState, useTransition } from "react";
import { getDaysUntilRegenerate } from "@/lib/utils";
import { generateTeamTips } from "../../_actions/generate-team-tips.action";

interface UseTeamTipsGenerationParams {
	userId: string;
	teamId: string;
	createdAt?: Date;
	onSuccess?: () => void;
}

export function useTeamTipsGeneration({
	userId,
	teamId,
	createdAt,
	onSuccess,
}: UseTeamTipsGenerationParams) {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [regenerateMessage, setRegenerateMessage] = useState<string | null>(
		null,
	);

	const daysUntilRegenerate = useMemo(() => {
		if (!createdAt) return 0;
		return getDaysUntilRegenerate(createdAt);
	}, [createdAt]);

	const canRegenerate = daysUntilRegenerate === 0;

	const handleGenerate = (forceRegenerate: boolean) => {
		setError(null);
		setRegenerateMessage(null);

		startTransition(async () => {
			const result = await generateTeamTips({
				userId,
				teamId,
				forceRegenerate,
			});

			if (!result.success) {
				setError(result.error ?? "Error al generar el reporte");
				return;
			}

			if (result.fromCache && result.regenerateMessage) {
				setRegenerateMessage(result.regenerateMessage);
				return;
			}

			(onSuccess ?? (() => window.location.reload()))();
		});
	};

	return {
		isPending,
		error,
		regenerateMessage,
		daysUntilRegenerate,
		canRegenerate,
		handleGenerate,
	};
}
