"use client";

import { RefreshCwIcon } from "lucide-react";
import { ClippedContainer } from "@/components/cyber-ui";
import { Button } from "@/components/ui/button";
import { CLIP_PATHS } from "@/lib/constants/clip-paths";
import { Loader } from "@/dashboard/reports/_components/loader";

interface RegenerateSectionProps {
	isPending: boolean;
	canRegenerate: boolean;
	daysUntilRegenerate: number;
	onRegenerate: () => void;
	error?: string | null;
	regenerateMessage?: string | null;
}

export function RegenerateSection({
	isPending,
	canRegenerate,
	daysUntilRegenerate,
	onRegenerate,
	error,
	regenerateMessage,
}: RegenerateSectionProps) {
	return (
		<div className="flex justify-center pt-8">
			<div className="w-full max-w-2xl">
				<ClippedContainer
					size="large"
					borderColor="border"
					borderOpacity={20}
					padding="p-10"
					innerClassName="flex flex-col items-center gap-8 text-center"
				>
					<div className="space-y-2">
						<h3 className="text-xl font-black uppercase tracking-[0.2em] text-foreground">
							¿NODE_NETWORK_CHANGES?
						</h3>
						<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-relaxed">
							{!canRegenerate
								? `PODRÁS_ACTUALIZAR_ESTE_REPORTE_EN ${daysUntilRegenerate} DÍA${
										daysUntilRegenerate !== 1 ? "S" : ""
									}.`
								: "SI_HAN_CAMBIADO_LOS_MIEMBROS_O_SUS_FORTALEZAS, GENERA_UN_NUEVO_ANÁLISIS_DE_RESONANCIA."}
						</p>
					</div>

					<Button
						variant="outline"
						onClick={onRegenerate}
						disabled={isPending || !canRegenerate}
						className="h-14 px-10 border border-[hsl(var(--border)/40%)] hover:bg-[hsl(var(--primary)/10%)] hover:text-[hsl(var(--primary))] gap-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300"
						style={{ clipPath: CLIP_PATHS.medium }}
					>
						{isPending ? (
							<>
								<Loader className="size-5 animate-spin" />
								RECALIBRATING...
							</>
						) : (
							<>
								<RefreshCwIcon className="size-5" />
								REGENERAR_SINCRO_DE_RED
							</>
						)}
					</Button>

					{error && (
						<div className="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--destructive))]">
							SYSTEM_ERROR: {error}
						</div>
					)}
					{regenerateMessage && (
						<div className="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--warning))] bg-[hsl(var(--warning)/5%)] px-4 py-2 border border-[hsl(var(--warning)/20%)]">
							{regenerateMessage.toUpperCase()}
						</div>
					)}
				</ClippedContainer>
			</div>
		</div>
	);
}
