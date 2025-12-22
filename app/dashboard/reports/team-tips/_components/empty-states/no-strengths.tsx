"use client";

import Link from "next/link";
import { SparklesIcon } from "lucide-react";
import { ClippedContainer, HexIcon } from "@/components/cyber-ui";
import { Button } from "@/components/ui/button";
import { CLIP_PATHS } from "@/lib/constants/clip-paths";

export function NoStrengthsState() {
	return (
		<div className="max-w-xl mx-auto py-24">
			<ClippedContainer
				size="large"
				borderColor="primary"
				borderOpacity={30}
				padding="p-12"
				innerClassName="text-center space-y-8"
			>
				<div className="flex justify-center">
					<HexIcon icon={SparklesIcon} color="primary" size="xl" animated />
				</div>
				<div className="space-y-3">
					<h3 className="text-2xl font-black uppercase tracking-[0.3em] text-foreground">
						CORE_AUTH_PENDING
					</h3>
					<div className="h-px w-24 bg-[hsl(var(--primary)/30%)] mx-auto" />
					<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 leading-relaxed max-w-sm mx-auto">
						DATOS_DE_TALENTO_NO_ENCONTRADOS_EN_LACORE_DATABASE.
						COMPLETE_LA_EVALUACIÓN_NEURAL_DE_FORTALEZAS_PARA_DBC_SINCRO.
					</p>
				</div>
				<Button
					asChild
					className="h-14 px-10 border border-[hsl(var(--primary)/20%)] bg-[hsl(var(--primary)/10%)] text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/20%)] transition-all duration-300"
					style={{ clipPath: CLIP_PATHS.medium }}
				>
					<Link
						href="/dashboard/profile"
						className="text-[10px] font-black uppercase tracking-[0.2em]"
					>
						INICIAR_CALIBRACIÓN_NEURAL
					</Link>
				</Button>
			</ClippedContainer>
		</div>
	);
}
