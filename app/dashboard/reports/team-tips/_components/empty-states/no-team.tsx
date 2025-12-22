"use client";

import Link from "next/link";
import { UsersIcon } from "lucide-react";
import { ClippedContainer, HexIcon } from "@/components/cyber-ui";
import { Button } from "@/components/ui/button";
import { CLIP_PATHS } from "@/lib/constants/clip-paths";

export function NoTeamState() {
	return (
		<div className="max-w-xl mx-auto py-24">
			<ClippedContainer
				size="large"
				borderColor="warning"
				borderOpacity={30}
				padding="p-12"
				innerClassName="text-center space-y-8"
			>
				<div className="flex justify-center">
					<HexIcon icon={UsersIcon} color="warning" size="xl" animated />
				</div>
				<div className="space-y-3">
					<h3 className="text-2xl font-black uppercase tracking-[0.3em] text-foreground">
						NODE_CONNECTION_REQUIRED
					</h3>
					<div className="h-px w-24 bg-[hsl(var(--warning)/30%)] mx-auto" />
					<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 leading-relaxed max-w-sm mx-auto">
						PARA_SINCRO_INTERPERSONAL_ES_OBLIGATORIO_CONECTARSE_A_UN_NODO_DE_EQUIPO_ACTIVO.
						ESTABLEZCA_LA_ESTRUCTURA_DE_RED_EN_EL_TERMINAL.
					</p>
				</div>
				<Button
					asChild
					className="h-14 px-10 border border-[hsl(var(--warning)/20%)] bg-[hsl(var(--warning)/10%)] text-[hsl(var(--warning))] hover:bg-[hsl(var(--warning)/20%)] transition-all duration-300"
					style={{ clipPath: CLIP_PATHS.medium }}
				>
					<Link
						href="/dashboard/team"
						className="text-[10px] font-black uppercase tracking-[0.2em]"
					>
						ESTABLECER_CONEXIÓN_DE_NODO
					</Link>
				</Button>
			</ClippedContainer>
		</div>
	);
}
