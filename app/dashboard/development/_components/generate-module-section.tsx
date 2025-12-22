/**
 * Generate Module Section
 *
 * Client component that displays strength-based buttons
 * to generate personalized development modules.
 */

"use client";

import { Info, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DevelopmentStrength } from "../_actions/get-user-strengths";
import { createStagger, TRANSITIONS, VARIANTS } from "../_utils/motion-tokens";
import { GenerateModuleButton } from "./generate-module-button";

interface PendingModule {
	id: string;
	titleEs: string;
	percentComplete: number;
}

interface GenerateModuleSectionProps {
	/**
	 * User's Top 5 strengths (filtered to only show those WITHOUT personalized modules)
	 */
	strengths: DevelopmentStrength[];
	/**
	 * Whether user can generate a new module
	 */
	canGenerate: boolean;
	/**
	 * Message to show when blocked
	 */
	blockedMessage?: string;
	/**
	 * Pending modules to show in tooltip when blocked
	 */
	pendingModules?: PendingModule[];
	/**
	 * Total number of Top 5 strengths
	 */
	totalStrengths?: number;
	/**
	 * Number of strengths available for generation (without modules)
	 */
	availableCount?: number;
}

export function GenerateModuleSection({
	strengths,
	canGenerate,
	blockedMessage,
	pendingModules = [],
	totalStrengths = 5,
	availableCount,
}: GenerateModuleSectionProps) {
	const router = useRouter();
	const staggerChildren = createStagger(0.08);
	const generatedCount = totalStrengths - (availableCount ?? strengths.length);

	const handleSuccess = () => {
		router.refresh();
	};

	return (
		<div
			className="relative overflow-hidden p-px bg-primary/20 border border-dashed border-primary/30"
			style={{
				clipPath:
					"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
			}}
		>
			<div
				className="bg-background/80 backdrop-blur-sm p-8"
				style={{
					clipPath:
						"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
				}}
			>
				<div
					className="absolute top-0 left-0 w-1 h-20 bg-primary/50"
					style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 8px)" }}
				/>

				<div className="space-y-6">
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<motion.div
								animate={{
									rotate: [0, 10, -10, 0],
									scale: [1, 1.1, 1],
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									repeatDelay: 3,
								}}
								className="p-2 bg-primary/10 text-primary border border-primary/20"
								style={{
									clipPath:
										"polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
								}}
							>
								<Sparkles className="h-4 w-4" />
							</motion.div>
							<div className="flex items-center gap-2">
								<h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">
									Genera módulos personalizados
								</h3>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Info className="h-3 w-3 text-muted-foreground cursor-help" />
										</TooltipTrigger>
										<TooltipContent className="max-w-xs border-primary/20 bg-background/5 backdrop-blur-md">
											<p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-secondary-foreground">
												Los módulos personalizados se crean con IA basándose en
												tu perfil profesional y contexto único. Son exclusivos
												para ti.
											</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						</div>

						<p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
							{generatedCount > 0 ? (
								<>
									[STATUS_SYNC]: Ya generaste {generatedCount} de{" "}
									{totalStrengths} módulos.
									{availableCount && availableCount > 0 && (
										<span className="text-primary/70">
											{" "}
											{/* */}
											{availableCount} DISPONIBLES.
										</span>
									)}
								</>
							) : (
								"Selecciona una de tus fortalezas Top 5 para crear un módulo único."
							)}
						</p>
					</div>

					<motion.div
						className="flex flex-wrap gap-3"
						variants={VARIANTS.staggerContainer}
						initial="initial"
						animate="animate"
					>
						{strengths.map((strength, index) => (
							<motion.div
								key={strength.key}
								variants={staggerChildren}
								custom={index}
								initial="initial"
								animate="animate"
							>
								<GenerateModuleButton
									strengthKey={strength.key}
									strengthName={strength.nameEs}
									domainKey={strength.domainKey}
									isBlocked={!canGenerate}
									blockedMessage={blockedMessage}
									pendingModules={pendingModules}
									onSuccess={handleSuccess}
								/>
							</motion.div>
						))}
					</motion.div>

					{!canGenerate && blockedMessage && (
						<motion.p
							className="text-[10px] uppercase font-black tracking-widest text-amber-500/80 mt-4 flex items-center gap-2 border-l border-amber-500/30 pl-3"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={TRANSITIONS.fadeIn}
						>
							<Info className="h-3.5 w-3.5" />
							{blockedMessage}
						</motion.p>
					)}
				</div>
			</div>
		</div>
	);
}
