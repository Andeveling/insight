/**
 * Pending Modules Tooltip
 *
 * Shows a list of pending modules that need to be completed
 * before generating new personalized modules.
 */

"use client";

import { AlertTriangle, ChevronRight, Clock } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { TRANSITIONS, VARIANTS } from "../_utils/motion-tokens";

interface PendingModule {
	id: string;
	titleEs: string;
	percentComplete: number;
}

interface PendingModulesTooltipProps {
	/**
	 * List of pending modules
	 */
	pendingModules: PendingModule[];
	/**
	 * Children element to trigger tooltip
	 */
	children: React.ReactNode;
	/**
	 * Message to show in tooltip header
	 */
	message?: string;
}

export function PendingModulesTooltip({
	pendingModules,
	children,
	message = "Completa tus módulos pendientes",
}: PendingModulesTooltipProps) {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={200}>
				<TooltipTrigger asChild>
					<motion.span
						animate={{
							x: [0, -2, 2, -2, 2, 0],
						}}
						transition={{
							duration: 0.5,
							repeat: 0,
						}}
						className="inline-block"
					>
						{children}
					</motion.span>
				</TooltipTrigger>
				<TooltipContent
					side="top"
					align="center"
					className="w-72 p-0 overflow-hidden"
				>
					<motion.div
						variants={VARIANTS.scaleIn}
						initial="initial"
						animate="animate"
					>
						{/* Header */}
						<div className="flex items-center gap-2 p-3 bg-amber-500/10 border-b border-amber-500/20">
							<AlertTriangle className="h-4 w-4 text-amber-500" />
							<span className="text-sm font-medium text-amber-700 dark:text-amber-400">
								{message}
							</span>
						</div>

						{/* Pending Modules List */}
						<div className="p-2 max-h-48 overflow-y-auto">
							{pendingModules.slice(0, 3).map((module, idx) => (
								<motion.div
									key={module.id}
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{
										...TRANSITIONS.fadeIn,
										delay: idx * 0.1,
									}}
								>
									<Link
										href={`/dashboard/development/module/${module.id}`}
										className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 transition-colors group"
									>
										<Clock className="h-3 w-3 text-muted-foreground shrink-0" />
										<div className="flex-1 min-w-0">
											<p className="text-xs font-medium truncate">
												{module.titleEs}
											</p>
											<div className="flex items-center gap-2 mt-1">
												<Progress
													value={module.percentComplete}
													className="h-1 flex-1"
												/>
												<span className="text-[10px] text-muted-foreground">
													{Math.round(module.percentComplete)}%
												</span>
											</div>
										</div>
										<ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
									</Link>
								</motion.div>
							))}

							{pendingModules.length > 3 && (
								<p className="text-xs text-muted-foreground text-center py-2">
									+{pendingModules.length - 3} módulos más
								</p>
							)}
						</div>
					</motion.div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
