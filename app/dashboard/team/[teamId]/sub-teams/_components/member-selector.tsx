/**
 * Member Selector
 *
 * Component for selecting team members for a sub-team.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_components/member-selector
 */

"use client";

import { useCallback, useState } from "react";

import { MemberCard } from "./member-card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SubTeamMember } from "@/lib/types";

import { SUBTEAM_CONSTRAINTS } from "../_schemas/subteam.schema";

interface MemberSelectorProps {
	members: SubTeamMember[];
	selectedIds: string[];
	onChange: (selectedIds: string[]) => void;
	error?: string;
}

export function MemberSelector({
	members,
	selectedIds,
	onChange,
	error,
}: MemberSelectorProps) {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredMembers = members.filter((member) => {
		const query = searchQuery.toLowerCase();
		return (
			member.name?.toLowerCase().includes(query) ||
			member.email?.toLowerCase().includes(query) ||
			member.strengths?.some(
				(s) =>
					s.name.toLowerCase().includes(query) ||
					s.nameEs?.toLowerCase().includes(query),
			)
		);
	});

	const handleToggle = useCallback(
		(memberId: string) => {
			if (selectedIds.includes(memberId)) {
				onChange(selectedIds.filter((id) => id !== memberId));
			} else if (selectedIds.length < SUBTEAM_CONSTRAINTS.MEMBERS_MAX) {
				onChange([...selectedIds, memberId]);
			}
		},
		[selectedIds, onChange],
	);

	const selectedCount = selectedIds.length;
	const isAtMax = selectedCount >= SUBTEAM_CONSTRAINTS.MEMBERS_MAX;

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<Label>Miembros del sub-equipo</Label>
				<span className="text-sm text-muted-foreground">
					{selectedCount}/{SUBTEAM_CONSTRAINTS.MEMBERS_MAX} seleccionados
					{selectedCount < SUBTEAM_CONSTRAINTS.MEMBERS_MIN && (
						<span className="text-destructive ml-2">
							(mínimo {SUBTEAM_CONSTRAINTS.MEMBERS_MIN})
						</span>
					)}
				</span>
			</div>

			{/* Search */}
			<Input
				type="search"
				placeholder="Buscar por nombre, email o fortaleza..."
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>

			{/* Error message */}
			{error && <p className="text-sm text-destructive">{error}</p>}

			{/* Members grid */}
			<div className="grid gap-3 sm:grid-cols-2">
				{filteredMembers.map((member) => (
					<MemberCard
						key={member.id}
						member={member}
						isSelected={selectedIds.includes(member.id)}
						onToggle={handleToggle}
						disabled={!selectedIds.includes(member.id) && isAtMax}
					/>
				))}
			</div>

			{filteredMembers.length === 0 && (
				<div className="text-center py-8 text-muted-foreground">
					{searchQuery
						? "No se encontraron miembros con esa búsqueda."
						: "No hay miembros disponibles en este equipo."}
				</div>
			)}
		</div>
	);
}
