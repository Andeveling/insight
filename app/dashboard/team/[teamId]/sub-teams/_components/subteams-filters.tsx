/**
 * SubTeams Filters
 *
 * Client component for filtering and sorting sub-teams list.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_components/subteams-filters
 */

"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ProjectTypeOption } from "@/lib/types/project-type.types";
import type {
	SubTeamFilters,
	SubTeamSortOption,
} from "@/lib/types/subteam.types";

// ============================================================
// Types
// ============================================================

interface SubTeamsFiltersProps {
	projectTypes: ProjectTypeOption[];
}

// ============================================================
// Constants
// ============================================================

const STATUS_OPTIONS = [
	{ value: "all", label: "Todos los estados" },
	{ value: "active", label: "Activos" },
	{ value: "archived", label: "Archivados" },
] as const;

const SORT_OPTIONS = [
	{ value: "created-desc", label: "Más recientes" },
	{ value: "created-asc", label: "Más antiguos" },
	{ value: "name-asc", label: "Nombre (A-Z)" },
	{ value: "name-desc", label: "Nombre (Z-A)" },
	{ value: "score-desc", label: "Mayor Match Score" },
	{ value: "score-asc", label: "Menor Match Score" },
] as const;

// ============================================================
// Component
// ============================================================

export function SubTeamsFilters({ projectTypes }: SubTeamsFiltersProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	// Get current filter values from URL
	const currentFilters: SubTeamFilters = useMemo(
		() => ({
			status: (searchParams.get("status") as SubTeamFilters["status"]) || "all",
			projectType: searchParams.get("projectType") || undefined,
			searchQuery: searchParams.get("q") || undefined,
		}),
		[searchParams],
	);

	const currentSort =
		(searchParams.get("sort") as SubTeamSortOption) || "created-desc";

	// Check if any filters are active
	const hasActiveFilters = useMemo(() => {
		return (
			currentFilters.status !== "all" ||
			currentFilters.projectType ||
			currentFilters.searchQuery
		);
	}, [currentFilters]);

	/**
	 * Update URL search params
	 */
	const updateParams = useCallback(
		(updates: Record<string, string | undefined>) => {
			startTransition(() => {
				const params = new URLSearchParams(searchParams.toString());

				Object.entries(updates).forEach(([key, value]) => {
					if (value === undefined || value === "" || value === "all") {
						params.delete(key);
					} else {
						params.set(key, value);
					}
				});

				const queryString = params.toString();
				router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
			});
		},
		[router, pathname, searchParams],
	);

	/**
	 * Clear all filters
	 */
	const clearFilters = useCallback(() => {
		startTransition(() => {
			router.push(pathname);
		});
	}, [router, pathname]);

	/**
	 * Handle search input
	 */
	const handleSearch = useCallback(
		(value: string) => {
			updateParams({ q: value || undefined });
		},
		[updateParams],
	);

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			{/* Search */}
			<div className="relative flex-1 max-w-sm">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Buscar sub-equipos..."
					className="pl-9 pr-9"
					defaultValue={currentFilters.searchQuery || ""}
					onChange={(e) => handleSearch(e.target.value)}
				/>
				{currentFilters.searchQuery && (
					<Button
						variant="ghost"
						size="icon"
						className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
						onClick={() => handleSearch("")}
					>
						<X className="h-4 w-4" />
						<span className="sr-only">Limpiar búsqueda</span>
					</Button>
				)}
			</div>

			{/* Filters */}
			<div className="flex flex-wrap items-center gap-2">
				{/* Status Filter */}
				<Select
					value={currentFilters.status || "all"}
					onValueChange={(value) => updateParams({ status: value })}
					disabled={isPending}
				>
					<SelectTrigger className="w-[160px]">
						<SelectValue placeholder="Estado" />
					</SelectTrigger>
					<SelectContent>
						{STATUS_OPTIONS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Project Type Filter */}
				<Select
					value={currentFilters.projectType || "all"}
					onValueChange={(value) =>
						updateParams({ projectType: value === "all" ? undefined : value })
					}
					disabled={isPending}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Tipo de proyecto" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Todos los tipos</SelectItem>
						{projectTypes.map((pt) => (
							<SelectItem key={pt.id} value={pt.id}>
								{pt.icon} {pt.nameEs || pt.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Sort */}
				<Select
					value={currentSort}
					onValueChange={(value) => updateParams({ sort: value })}
					disabled={isPending}
				>
					<SelectTrigger className="w-[170px]">
						<SlidersHorizontal className="mr-2 h-4 w-4" />
						<SelectValue placeholder="Ordenar" />
					</SelectTrigger>
					<SelectContent>
						{SORT_OPTIONS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Clear Filters */}
				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearFilters}
						disabled={isPending}
						className="text-muted-foreground"
					>
						<X className="mr-1 h-4 w-4" />
						Limpiar filtros
					</Button>
				)}
			</div>
		</div>
	);
}

export default SubTeamsFilters;
