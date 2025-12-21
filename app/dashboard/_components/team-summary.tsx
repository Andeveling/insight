import { Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSession } from "@/lib/auth";
import { getDomainColor } from "@/lib/constants/domain-colors";
import type { DomainType } from "@/lib/types";
import { getTeamSummary } from "../_actions/get-team-summary";
import { CyberBadge } from "./cyber-ui/cyber-badge";
import { CyberButton } from "./cyber-ui/cyber-button";
import { CyberCard } from "./cyber-ui/cyber-card";

export async function TeamSummary() {
	const session = await getSession();

	if (!session?.user?.id) {
		redirect("/login");
	}

	const teamData = await getTeamSummary();
	if (!teamData.hasTeam) {
		return (
			<CyberCard
				variant="default"
				className="h-full flex flex-col justify-center items-center text-center p-6"
			>
				<Users className="w-12 h-12 text-zinc-600 mb-4" />
				<h3 className="text-lg font-bold text-white mb-2">Sin Equipo</h3>
				<p className="text-sm text-zinc-400">
					Únete o crea un equipo para colaborar.
				</p>
			</CyberCard>
		);
	}

	const mapDomainKey = (key: string | undefined): DomainType => {
		if (!key) return "Thinking";
		const mapping: Record<string, DomainType> = {
			hacer: "Doing",
			doing: "Doing",
			sentir: "Feeling",
			feeling: "Feeling",
			motivar: "Motivating",
			motivating: "Motivating",
			pensar: "Thinking",
			thinking: "Thinking",
		};
		return mapping[key.toLowerCase()] || "Thinking";
	};

	return (
		<CyberCard variant="default" className="h-full flex flex-col">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-bold uppercase tracking-wider text-white flex items-center">
					<Users className="w-4 h-4 mr-2 text-zinc-400" />
					Mi Equipo
				</h3>
				<CyberBadge variant="zinc">Colaboración</CyberBadge>
			</div>

			<div className="flex-1 space-y-3 mb-4">
				{teamData.members.map((member) => {
					const domain = member.primaryStrength
						? mapDomainKey(member.primaryStrength.domainKey)
						: "Thinking";
					const domainColor = getDomainColor(domain, "primary");

					return (
						<div
							key={member.id}
							className="flex items-center space-x-3 p-2 rounded border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/60 transition-colors"
						>
							<Avatar className="w-8 h-8">
								<AvatarImage
									src={member.image || undefined}
									alt={member.name}
								/>
								<AvatarFallback className="text-xs">
									{member.name.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-zinc-200 truncate">
									{member.name}
								</p>
								{member.primaryStrength && (
									<p
										className="text-xs truncate"
										style={{ color: domainColor }}
									>
										{member.primaryStrength.nameEs}
									</p>
								)}
							</div>
						</div>
					);
				})}
				{teamData.memberCount > 5 && (
					<p className="text-xs text-zinc-500 text-center pt-2">
						+{teamData.memberCount - 5} más
					</p>
				)}
			</div>

			<Link href={`/dashboard/team/${teamData.teamId}`} className="w-full">
				<CyberButton variant="secondary" className="w-full">
					Ver Equipo Completo
				</CyberButton>
			</Link>
		</CyberCard>
	);
}
