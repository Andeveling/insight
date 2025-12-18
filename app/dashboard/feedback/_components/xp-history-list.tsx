"use client";

/**
 * XP History List Component
 *
 * Timeline view of XP transactions with filtering
 * Part of Feature 008: Feedback Gamification Integration
 */

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
	MessageSquare,
	Award,
	Target,
	Flame,
	Calendar,
	Download,
	Filter,
	Sparkles,
	TrendingUp,
	ArrowDownToLine,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { XpTransactionItem } from "../_actions/xp-history.actions";
import {
	exportXpHistoryAction,
	getXpHistoryAction,
} from "../_actions/xp-history.actions";

interface XpHistoryListProps {
	initialTransactions: XpTransactionItem[];
	totalXp: number;
	totalTransactions: number;
	feedbackXpTotal: number;
	feedbackTransactionCount: number;
}

type SourceFilter = "all" | "feedback" | "assessment" | "development";

/**
 * Get icon for transaction source
 */
function getSourceIcon(source: string) {
	if (source.startsWith("feedback")) return MessageSquare;
	if (source.startsWith("assessment")) return Target;
	if (source.includes("streak") || source.includes("Flame")) return Flame;
	if (source.includes("badge")) return Award;
	return Sparkles;
}

/**
 * Get color for transaction source
 */
function getSourceColor(source: string): string {
	if (source.startsWith("feedback")) return "text-blue-500 bg-blue-500/10";
	if (source.startsWith("assessment")) return "text-green-500 bg-green-500/10";
	if (source.includes("streak")) return "text-orange-500 bg-orange-500/10";
	if (source.includes("badge")) return "text-purple-500 bg-purple-500/10";
	return "text-amber-500 bg-amber-500/10";
}

/**
 * Format relative date
 */
function formatRelativeDate(date: Date): string {
	const now = new Date();
	const diff = now.getTime() - new Date(date).getTime();
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const minutes = Math.floor(diff / (1000 * 60));

	if (minutes < 1) return "Ahora mismo";
	if (minutes < 60) return `Hace ${minutes} min`;
	if (hours < 24) return `Hace ${hours}h`;
	if (days === 1) return "Ayer";
	if (days < 7) return `Hace ${days} días`;
	return new Date(date).toLocaleDateString("es-ES", {
		day: "numeric",
		month: "short",
	});
}

/**
 * XP History List with timeline view
 */
export function XpHistoryList({
	initialTransactions,
	totalXp,
	totalTransactions,
	feedbackXpTotal,
	feedbackTransactionCount,
}: XpHistoryListProps) {
	const [transactions, setTransactions] =
		useState<XpTransactionItem[]>(initialTransactions);
	const [filter, setFilter] = useState<SourceFilter>("all");
	const [isPending, startTransition] = useTransition();
	const [isExporting, setIsExporting] = useState(false);

	const handleFilterChange = (value: SourceFilter) => {
		setFilter(value);
		startTransition(async () => {
			const result = await getXpHistoryAction({ sourceType: value });
			if (result.success && result.data) {
				setTransactions(result.data.transactions);
			}
		});
	};

	const handleExport = async () => {
		setIsExporting(true);
		try {
			const result = await exportXpHistoryAction({ sourceType: filter });
			if (result.success && result.csv) {
				// Create download link
				const blob = new Blob([result.csv], { type: "text/csv" });
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `xp-history-${new Date().toISOString().slice(0, 10)}.csv`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
				toast.success("Historial exportado correctamente");
			} else {
				toast.error("Error al exportar historial");
			}
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Summary Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
								<Sparkles className="h-5 w-5 text-amber-500" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">XP Total</p>
								<p className="text-2xl font-bold">{totalXp.toLocaleString()}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
								<MessageSquare className="h-5 w-5 text-blue-500" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">
									XP por Feedback ({feedbackTransactionCount})
								</p>
								<p className="text-2xl font-bold">
									{feedbackXpTotal.toLocaleString()}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
								<TrendingUp className="h-5 w-5 text-green-500" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Transacciones</p>
								<p className="text-2xl font-bold">{totalTransactions}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filter and Export Controls */}
			<Card>
				<CardHeader className="pb-3">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<CardTitle className="flex items-center gap-2">
							<Calendar className="h-5 w-5" />
							Historial de XP
						</CardTitle>
						<div className="flex items-center gap-2">
							<Select
								value={filter}
								onValueChange={(v) => handleFilterChange(v as SourceFilter)}
							>
								<SelectTrigger className="w-40">
									<Filter className="mr-2 h-4 w-4" />
									<SelectValue placeholder="Filtrar" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Todas</SelectItem>
									<SelectItem value="feedback">Feedback</SelectItem>
									<SelectItem value="assessment">Evaluaciones</SelectItem>
									<SelectItem value="development">Desarrollo</SelectItem>
								</SelectContent>
							</Select>
							<Button
								variant="outline"
								size="sm"
								onClick={handleExport}
								disabled={isExporting}
							>
								{isExporting ? (
									<ArrowDownToLine className="mr-2 h-4 w-4 animate-bounce" />
								) : (
									<Download className="mr-2 h-4 w-4" />
								)}
								Exportar
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{isPending ? (
						<div className="space-y-4">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="flex items-center gap-4">
									<Skeleton className="h-10 w-10 rounded-full" />
									<div className="flex-1 space-y-2">
										<Skeleton className="h-4 w-48" />
										<Skeleton className="h-3 w-24" />
									</div>
									<Skeleton className="h-6 w-16" />
								</div>
							))}
						</div>
					) : transactions.length === 0 ? (
						<div className="py-12 text-center">
							<Sparkles className="mx-auto h-12 w-12 text-muted-foreground/50" />
							<p className="mt-4 text-muted-foreground">
								No hay transacciones de XP aún
							</p>
							<p className="text-sm text-muted-foreground/70">
								Completa actividades para ganar XP
							</p>
						</div>
					) : (
						<AnimatePresence mode="popLayout">
							<div className="relative space-y-4">
								{/* Timeline line */}
								<div className="absolute left-5 top-0 h-full w-0.5 bg-border" />

								{transactions.map((tx, index) => {
									const Icon = getSourceIcon(tx.source);
									const colorClass = getSourceColor(tx.source);

									return (
										<motion.div
											key={tx.id}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: 20 }}
											transition={{ delay: index * 0.05 }}
											className="relative flex items-start gap-4 pl-2"
										>
											{/* Timeline dot */}
											<div
												className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colorClass}`}
											>
												<Icon className="h-5 w-5" />
											</div>

											{/* Content */}
											<div className="flex flex-1 items-center justify-between gap-2 rounded-lg border bg-card p-3">
												<div className="min-w-0">
													<p className="font-medium">{tx.sourceLabel}</p>
													<p className="text-sm text-muted-foreground">
														{formatRelativeDate(tx.createdAt)}
													</p>
												</div>
												<div className="flex items-center gap-2">
													{tx.streakBonus && tx.streakBonus > 0 && (
														<Badge variant="secondary" className="gap-1">
															<Flame className="h-3 w-3 text-orange-500" />+
															{tx.streakBonus}
														</Badge>
													)}
													<Badge
														variant="outline"
														className="gap-1 font-mono font-bold"
													>
														+{tx.amount} XP
													</Badge>
												</div>
											</div>
										</motion.div>
									);
								})}
							</div>
						</AnimatePresence>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

/**
 * Loading skeleton for XP history
 */
export function XpHistoryListSkeleton() {
	return (
		<div className="space-y-6">
			{/* Summary Cards Skeleton */}
			<div className="grid gap-4 md:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<Card key={i}>
						<CardContent className="pt-6">
							<div className="flex items-center gap-3">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="space-y-2">
									<Skeleton className="h-3 w-20" />
									<Skeleton className="h-7 w-16" />
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* History Card Skeleton */}
			<Card>
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<Skeleton className="h-6 w-36" />
						<div className="flex gap-2">
							<Skeleton className="h-9 w-40" />
							<Skeleton className="h-9 w-24" />
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="flex items-center gap-4 pl-2">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="flex flex-1 items-center justify-between gap-2 rounded-lg border p-3">
									<div className="space-y-2">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-3 w-20" />
									</div>
									<Skeleton className="h-6 w-20" />
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
