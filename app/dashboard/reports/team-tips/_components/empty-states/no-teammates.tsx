"use client";

import Link from "next/link";
import { UsersIcon } from "lucide-react";
import { ClippedContainer, HexIcon } from "@/components/cyber-ui";
import { Button } from "@/components/ui/button";
import { CLIP_PATHS } from "@/lib/constants/clip-paths";

export function NoTeammatesState() {
	return (
		<div className="max-w-xl mx-auto py-24">
			<ClippedContainer
				size="large"
				borderColor="destructive"
				borderOpacity={30}
				padding="p-12"
				innerClassName="text-center space-y-8"
			>
				<div className="flex justify-center">
					<HexIcon icon={UsersIcon} color="destructive" size="xl" animated />
				</div>
				<div className="space-y-3">
					<h3 className="text-2xl font-black uppercase tracking-[0.3em] text-foreground">
						DATA_VACUUM_DETECTED
					</h3>
					<div className="h-px w-24 bg-[hsl(var(--destructive)/30%)] mx-auto" />
					<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 leading-relaxed max-w-sm mx-auto">
						SUS_NODOS_ADYACENTES_NO_HAN_SIDO_CALIBRADOS.
						TODOS_LOS_MIEMBROS_DEBEN_CARGAR_SU_PERFIL_DE_TALENTO_PARA_HABILITAR_SINCRO.
					</p>
				</div>
				<Button
					asChild
					variant="outline"
					className="h-14 px-10 border border-[hsl(var(--destructive)/20%)] text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/10%)] transition-all duration-300"
					style={{ clipPath: CLIP_PATHS.medium }}
				>
					<Link
						href="/dashboard/team"
						className="text-[10px] font-black uppercase tracking-[0.2em]"
					>
						NOTIFICAR_NODOS_DE_EQUIPO
					</Link>
				</Button>
			</ClippedContainer>
		</div>
	);
}
