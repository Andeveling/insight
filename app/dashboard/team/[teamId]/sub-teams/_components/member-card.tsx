/**
 * Member Card
 *
 * Displays a team member with their strengths for selection in sub-team creation.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_components/member-card
 */

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/cn";
import type { SubTeamMember } from "@/lib/types";
import { getDomainColor } from "../_utils/score-helpers";

interface MemberCardProps {
	member: SubTeamMember;
	isSelected: boolean;
	onToggle: (memberId: string) => void;
	disabled?: boolean;
}

export function MemberCard({
	member,
	isSelected,
	onToggle,
	disabled,
}: MemberCardProps) {
	const topStrengths = member.strengths?.slice(0, 3) || [];

	return (
		<Card
			className={cn(
				"p-4 transition-all cursor-pointer",
				isSelected && "ring-2 ring-primary bg-primary/5",
				disabled && "opacity-50 cursor-not-allowed",
				!disabled && !isSelected && "hover:bg-muted/50",
			)}
			onClick={() => !disabled && onToggle(member.id)}
		>
			<div className="flex items-start gap-3">
				{/* Checkbox */}
				<div className="pt-1">
					<Checkbox
						checked={isSelected}
						disabled={disabled}
						onCheckedChange={() => onToggle(member.id)}
						onClick={(e) => e.stopPropagation()}
					/>
				</div>

				{/* Avatar */}
				<div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
					{member.image ? (
						<Image
							src={member.image}
							alt={member.name || "Avatar"}
							width={40}
							height={40}
							className="h-10 w-10 rounded-full object-cover"
						/>
					) : (
						<span className="text-sm font-medium text-muted-foreground">
							{member.name?.charAt(0).toUpperCase() || "?"}
						</span>
					)}
				</div>

				{/* Info */}
				<div className="flex-1 min-w-0">
					<p className="font-medium truncate">{member.name || "Usuario"}</p>
					<p className="text-sm text-muted-foreground truncate">
						{member.email}
					</p>

					{/* Top strengths */}
					{topStrengths.length > 0 && (
						<div className="flex flex-wrap gap-1 mt-2">
							{topStrengths.map((strength) => (
								<Badge
									key={strength.id}
									variant="secondary"
									className={cn(
										"text-xs",
										getDomainColor(strength.domain?.name || ""),
									)}
								>
									{strength.nameEs || strength.name}
								</Badge>
							))}
						</div>
					)}
				</div>
			</div>
		</Card>
	);
}
