"use client";

import { HeartHandshakeIcon, SparklesIcon } from "lucide-react";
import {
	ClippedContainer,
	HexIcon,
	TechGridBackground,
} from "@/components/cyber-ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { CLIP_PATHS } from "@/lib/constants/clip-paths";
import { Loader } from "@/dashboard/reports/_components/loader";

interface GenerateTeamTipsPanelProps {
	isPending: boolean;
	onGenerate: () => void;
	error?: string | null;
}

export function GenerateTeamTipsPanel({
	isPending,
	onGenerate,
	error,
}: GenerateTeamTipsPanelProps) {
	return (
		<ClippedContainer
			size="large"
			borderColor="primary"
			borderOpacity={30}
			padding="p-0"
			className="relative group overflow-hidden"
		>
			<TechGridBackground opacity={10} hoverOpacity={20} />
			<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[hsl(var(--primary)/50%)] to-transparent" />

			<div className="p-12 relative space-y-10">
				<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
					<div className="space-y-6">
						<div className="flex items-center gap-6">
							<HexIcon
								icon={HeartHandshakeIcon}
								color="primary"
								size="lg"
								animated
							/>
							<div className="space-y-1">
								<h2 className="text-3xl font-black uppercase tracking-[.3em] text-foreground">
									COLLABORATION_ENGINE
								</h2>
								<div className="flex items-center gap-2">
									<span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--primary))]">
										[SYSTEM_INITIATOR_V2.4]
									</span>
									<div className="h-px w-12 bg-[hsl(var(--primary)/30%)]" />
								</div>
							</div>
						</div>
						<p className="text-[11px] font-semibold text-muted-foreground/80 leading-relaxed max-w-2xl border-l border-[hsl(var(--primary)/20%)] pl-6 uppercase tracking-widest">
							LA_IA_ANALIZARÁ_SUS_NIVELES_DE_RESONANCIA_COLECTIVA_BASADO_EN_CADA_NODO_DE_EQUIPO_ACTIVO.
							GENERANDO_PROTOCOLOS_DE_COLABORACIÓN_Y_RECOMENDACIONES_TÉCNICAS.
						</p>
					</div>

					<Button
						onClick={onGenerate}
						disabled={isPending}
						size="lg"
						className={cn(
							"h-20 px-12 gap-4 relative overflow-hidden group/btn",
							"border border-[hsl(var(--primary)/30%)] bg-[hsl(var(--primary)/10%)] hover:bg-[hsl(var(--primary)/20%)]",
							!isPending &&
								"shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.2)]",
						)}
						style={{ clipPath: CLIP_PATHS.medium }}
					>
						<div className="absolute inset-0 bg-[hsl(var(--primary))] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-700 opacity-20" />
						<span className="relative z-10 flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-[hsl(var(--primary))]">
							{isPending ? (
								<>
									<Loader className="size-6 animate-spin" />
									ANALYZING_TEAM_DYNAMICS...
								</>
							) : (
								<>
									<SparklesIcon className="size-6" />
									INICIAR_SÍNTESIS_DE_EQUIPO
								</>
							)}
						</span>
					</Button>
				</div>

				{error && (
					<ClippedContainer
						size="small"
						noBorder
						padding="p-4"
						backdropBlur={false}
						backgroundColor="destructive"
						backgroundOpacity={10}
						className="border border-[hsl(var(--destructive)/20%)]"
						innerClassName="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--destructive))]"
					>
						[CRITICAL_CORE_ERROR]: {error.toUpperCase()}
					</ClippedContainer>
				)}
			</div>
		</ClippedContainer>
	);
}
