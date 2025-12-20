"use client";

import {
	ArrowRight,
	BookOpen,
	CheckCircle2,
	Clock,
	Lock,
	Play,
	Star,
	Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

import type { ModuleNodeData } from "../_schemas";
import { getLevelIcon, getLevelLabel, getStatusColor } from "../_utils";

interface ModulePreviewPanelProps {
	module: ModuleNodeData | null;
	open: boolean;
	onClose: () => void;
}

/**
 * Panel lateral que muestra detalles del módulo seleccionado.
 * Incluye título, descripción, XP, duración y botón de acción.
 */
export function ModulePreviewPanel({
	module,
	open,
	onClose,
}: ModulePreviewPanelProps) {
	const router = useRouter();

	if (!module) return null;

	const statusColor = getStatusColor(module.status);
	const levelLabel = getLevelLabel(module.level);
	const levelEmoji = getLevelIcon(module.level);

	const handleAction = () => {
		onClose();
		router.push(`/dashboard/development/module/${module.moduleId}`);
	};

	const getActionButton = () => {
		switch (module.status) {
			case "completed":
				return (
					<Button onClick={handleAction} variant="outline" className="w-full">
						<BookOpen className="mr-2 h-4 w-4" />
						Revisar Módulo
					</Button>
				);
			case "in_progress":
				return (
					<Button onClick={handleAction} className="w-full">
						<Play className="mr-2 h-4 w-4" />
						Continuar
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				);
			case "not_started":
				return (
					<Button onClick={handleAction} className="w-full">
						<Play className="mr-2 h-4 w-4" />
						Comenzar
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				);
			case "locked":
				return (
					<Button disabled className="w-full">
						<Lock className="mr-2 h-4 w-4" />
						Bloqueado
					</Button>
				);
		}
	};

	const getStatusBadge = () => {
		const variants: Record<string, "default" | "secondary" | "outline"> = {
			completed: "default",
			in_progress: "secondary",
			not_started: "outline",
			locked: "outline",
		};

		const labels: Record<string, string> = {
			completed: "Completado",
			in_progress: "En Progreso",
			not_started: "No Iniciado",
			locked: "Bloqueado",
		};

		return (
			<Badge variant={variants[module.status]} className={statusColor}>
				{module.status === "completed" && (
					<CheckCircle2 className="mr-1 h-3 w-3" />
				)}
				{module.status === "locked" && <Lock className="mr-1 h-3 w-3" />}
				{labels[module.status]}
			</Badge>
		);
	};

	return (
		<Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
			<SheetContent className="flex flex-col sm:max-w-md">
				<SheetHeader>
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.2 }}
					>
						<div className="flex items-center gap-2 mb-2">
							<span className="text-2xl">{levelEmoji}</span>
							<Badge variant="outline" className="text-xs">
								{levelLabel}
							</Badge>
							{getStatusBadge()}
						</div>
						<SheetTitle className="text-xl">{module.title}</SheetTitle>
						<SheetDescription className="text-muted-foreground mt-2">
							Módulo de desarrollo{" "}
							{module.moduleType === "personalized"
								? "personalizado"
								: "general"}
							{module.strengthKey && ` enfocado en ${module.strengthKey}`}
						</SheetDescription>
					</motion.div>
				</SheetHeader>

				<Separator className="my-4" />

				<motion.div
					className="flex-1 space-y-6"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.1 }}
				>
					{/* Stats Grid */}
					<div className="grid grid-cols-2 gap-4">
						{/* XP Reward */}
						<div className="bg-muted/50 rounded-lg p-4 text-center">
							<div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
								<Star className="h-5 w-5" />
								<span className="text-2xl font-bold">{module.xpReward}</span>
							</div>
							<span className="text-xs text-muted-foreground">XP Reward</span>
						</div>

						{/* Duration */}
						<div className="bg-muted/50 rounded-lg p-4 text-center">
							<div className="flex items-center justify-center gap-1 text-primary mb-1">
								<Clock className="h-5 w-5" />
								<span className="text-2xl font-bold">
									{module.estimatedMinutes || 15}
								</span>
							</div>
							<span className="text-xs text-muted-foreground">Minutos</span>
						</div>
					</div>

					{/* Progress (if in progress) */}
					{module.status === "in_progress" && module.progress !== undefined && (
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Progreso</span>
								<span className="font-medium">{module.progress}%</span>
							</div>
							<Progress value={module.progress} className="h-2" />
							<p className="text-xs text-muted-foreground">
								<Zap className="inline h-3 w-3 mr-1" />
								¡Continúa donde lo dejaste!
							</p>
						</div>
					)}

					{/* Completed Message */}
					{module.status === "completed" && (
						<div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
							<CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
							<p className="text-sm font-medium text-green-600 dark:text-green-400">
								¡Módulo Completado!
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								Has ganado {module.xpReward} XP por este módulo
							</p>
						</div>
					)}

					{/* Locked Message */}
					{module.status === "locked" && (
						<div className="bg-muted rounded-lg p-4 text-center">
							<Lock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
							<p className="text-sm font-medium">Módulo Bloqueado</p>
							<p className="text-xs text-muted-foreground mt-1">
								Completa los módulos anteriores para desbloquear
							</p>
						</div>
					)}
				</motion.div>

				<SheetFooter className="mt-4">
					<motion.div
						className="w-full"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						{getActionButton()}
					</motion.div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
