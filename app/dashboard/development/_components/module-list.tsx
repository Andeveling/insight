"use client";

import { Filter, Loader2, Search, Sparkles, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useDeferredValue, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/cn";
import type { GetModulesResult } from "../_actions/get-modules";
import type { ModuleCard as ModuleCardType, ModuleLevel } from "../_schemas";
import { ModuleCard } from "./module-card";

interface ModuleListProps {
	/** New: modules separated by type */
	modulesResult?: GetModulesResult;
	/** @deprecated Use modulesResult instead */
	modules?: ModuleCardType[];
	groupedByCategory?: Map<string, ModuleCardType[]>;
	showFilters?: boolean;
	showSearch?: boolean;
	emptyMessage?: string;
	className?: string;
}

/**
 * Module List Component
 *
 * Displays a grid of module cards with optional filtering and search.
 * Supports both flat list and grouped by category views.
 * REFACTORED: Now supports two-section display (General/Personalizado).
 */
export function ModuleList({
	modulesResult,
	modules: legacyModules,
	groupedByCategory,
	showFilters = true,
	showSearch = true,
	emptyMessage = "No hay módulos disponibles",
	className,
}: ModuleListProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [levelFilter, setLevelFilter] = useState<ModuleLevel | "all">("all");
	const [showFiltersPanel, setShowFiltersPanel] = useState(false);

	// Deferred value for smooth filtering without UI flicker
	const deferredSearchQuery = useDeferredValue(searchQuery);
	const isSearching = searchQuery !== deferredSearchQuery;

	// Support both new and legacy format
	const generalModules = modulesResult?.general ?? [];
	const personalizedModules = modulesResult?.personalized ?? [];
	const allModules = legacyModules ?? [
		...generalModules,
		...personalizedModules,
	];

	// Filter function - uses deferred value for smooth transitions
	const filterModule = (module: ModuleCardType) => {
		if (deferredSearchQuery) {
			const query = deferredSearchQuery.toLowerCase();
			const matchesSearch =
				module.titleEs.toLowerCase().includes(query) ||
				module.descriptionEs.toLowerCase().includes(query);
			if (!matchesSearch) return false;
		}
		if (levelFilter !== "all" && module.level !== levelFilter) {
			return false;
		}
		return true;
	};

	// Filter modules - uses deferred search for smooth updates
	const filteredGeneral = generalModules.filter(filterModule);
	const filteredPersonalized = personalizedModules.filter(filterModule);
	const filteredModules = allModules.filter(filterModule);

	// If grouped, filter each group using deferred value
	const filteredGroups = groupedByCategory
		? new Map(
				Array.from(groupedByCategory.entries()).map(
					([category, categoryModules]) => [
						category,
						categoryModules.filter((module) => {
							if (deferredSearchQuery) {
								const query = deferredSearchQuery.toLowerCase();
								const matchesSearch =
									module.titleEs.toLowerCase().includes(query) ||
									module.descriptionEs.toLowerCase().includes(query);
								if (!matchesSearch) return false;
							}
							if (levelFilter !== "all" && module.level !== levelFilter) {
								return false;
							}
							return true;
						}),
					],
				),
			)
		: null;

	const hasActiveFilters = deferredSearchQuery || levelFilter !== "all";

	const clearFilters = () => {
		setSearchQuery("");
		setLevelFilter("all");
	};

	return (
		<div className={cn("space-y-6", className)}>
			{/* Search and Filter Controls */}
			{(showSearch || showFilters) && (
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					{/* Search */}
					{showSearch && (
						<div className="relative flex-1 max-w-sm">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Buscar módulos..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9 pr-9"
							/>
							{isSearching ? (
								<Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
							) : searchQuery ? (
								<button
									onClick={() => setSearchQuery("")}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									<X className="h-4 w-4" />
								</button>
							) : null}
						</div>
					)}

					{/* Filters */}
					{showFilters && (
						<div className="flex items-center gap-2">
							{/* Mobile Filter Toggle */}
							<Button
								variant="outline"
								size="sm"
								className="sm:hidden"
								onClick={() => setShowFiltersPanel(!showFiltersPanel)}
							>
								<Filter className="h-4 w-4 mr-1.5" />
								Filtros
								{hasActiveFilters && (
									<span className="ml-1.5 h-2 w-2 rounded-full bg-primary" />
								)}
							</Button>

							{/* Desktop Level Filter */}
							<div className="hidden sm:flex items-center gap-2">
								<Select
									value={levelFilter}
									onValueChange={(value) =>
										setLevelFilter(value as ModuleLevel | "all")
									}
								>
									<SelectTrigger className="w-40">
										<SelectValue placeholder="Nivel" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Todos los niveles</SelectItem>
										<SelectItem value="beginner">Principiante</SelectItem>
										<SelectItem value="intermediate">Intermedio</SelectItem>
										<SelectItem value="advanced">Avanzado</SelectItem>
									</SelectContent>
								</Select>

								{hasActiveFilters && (
									<Button variant="ghost" size="sm" onClick={clearFilters}>
										<X className="h-4 w-4 mr-1" />
										Limpiar
									</Button>
								)}
							</div>
						</div>
					)}
				</div>
			)}

			{/* Mobile Filters Panel */}
			<AnimatePresence>
				{showFiltersPanel && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className="sm:hidden overflow-hidden"
					>
						<div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg">
							<Select
								value={levelFilter}
								onValueChange={(value) =>
									setLevelFilter(value as ModuleLevel | "all")
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Nivel" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Todos los niveles</SelectItem>
									<SelectItem value="beginner">Principiante</SelectItem>
									<SelectItem value="intermediate">Intermedio</SelectItem>
									<SelectItem value="advanced">Avanzado</SelectItem>
								</SelectContent>
							</Select>

							{hasActiveFilters && (
								<Button variant="outline" size="sm" onClick={clearFilters}>
									<X className="h-4 w-4 mr-1" />
									Limpiar filtros
								</Button>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Two-Section View (when using modulesResult) */}
			{modulesResult ? (
				<div
					className={cn(
						"space-y-8 transition-opacity duration-200",
						isSearching && "opacity-70",
					)}
				>
					{/* General Modules Section */}
					{filteredGeneral.length > 0 && (
						<section>
							<div className="flex items-center gap-2 mb-4">
								<Users className="h-5 w-5 text-muted-foreground" />
								<h2 className="text-lg font-semibold">Módulos Generales</h2>
								<span className="text-sm text-muted-foreground">
									({filteredGeneral.length})
								</span>
							</div>
							<motion.div
								className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
								layout
							>
								{filteredGeneral.map((module) => (
									<motion.div key={module.id} layout>
										<ModuleCard module={module} />
									</motion.div>
								))}
							</motion.div>
						</section>
					)}

					{/* Personalized Modules Section */}
					{filteredPersonalized.length > 0 && (
						<section>
							<div className="flex items-center gap-2 mb-4">
								<Sparkles className="h-5 w-5 text-primary" />
								<h2 className="text-lg font-semibold">
									Módulos Personalizados
								</h2>
								<span className="text-sm text-muted-foreground">
									({filteredPersonalized.length})
								</span>
							</div>
							<motion.div
								className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
								layout
							>
								{filteredPersonalized.map((module) => (
									<motion.div key={module.id} layout>
										<ModuleCard module={module} priority />
									</motion.div>
								))}
							</motion.div>
						</section>
					)}

					{/* Empty State */}
					{filteredGeneral.length === 0 &&
						filteredPersonalized.length === 0 && (
							<EmptyState
								message={
									hasActiveFilters
										? "No se encontraron módulos con estos filtros"
										: emptyMessage
								}
							/>
						)}
				</div>
			) : filteredGroups ? (
				// Grouped View
				<div className="space-y-8">
					{Array.from(filteredGroups.entries()).map(
						([category, categoryModules]) => {
							if (categoryModules.length === 0) return null;

							return (
								<section key={category}>
									<h2 className="text-lg font-semibold mb-4">{category}</h2>
									<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
										{categoryModules.map((module, index) => (
											<ModuleCard
												key={module.id}
												module={module}
												priority={
													category === "Recomendados para ti" && index < 3
												}
											/>
										))}
									</div>
								</section>
							);
						},
					)}
				</div>
			) : (
				// Flat List View
				<>
					{filteredModules.length > 0 ? (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{filteredModules.map((module) => (
								<ModuleCard key={module.id} module={module} />
							))}
						</div>
					) : (
						<EmptyState
							message={
								hasActiveFilters
									? "No se encontraron módulos con estos filtros"
									: emptyMessage
							}
						/>
					)}
				</>
			)}
		</div>
	);
}

/**
 * Empty State Component
 */
function EmptyState({ message }: { message: string }) {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<div className="rounded-full bg-muted p-4 mb-4">
				<Search className="h-8 w-8 text-muted-foreground" />
			</div>
			<p className="text-muted-foreground">{message}</p>
		</div>
	);
}
