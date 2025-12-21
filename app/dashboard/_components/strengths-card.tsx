import { Hexagon } from "lucide-react";
import { redirect } from "next/navigation";
import { getUserStrengthsForDevelopment } from "@/app/dashboard/development/_actions/get-user-strengths";
import { getSession } from "@/lib/auth";
import { getDomainColor } from "@/lib/constants/domain-colors";
import type { DomainType } from "@/lib/types";
import { CyberBadge } from "./cyber-ui/cyber-badge";
import { CyberCard } from "./cyber-ui/cyber-card";

export async function StrengthsCard() {
	const session = await getSession();

	if (!session?.user?.id) {
		redirect("/login");
	}

	const strengthsResult = await getUserStrengthsForDevelopment();
	const { strengths, hasTop5 } = strengthsResult;
	if (!hasTop5) {
		return (
			<CyberCard variant="alert" className="h-full">
				<div className="flex flex-col items-center justify-center h-full text-center space-y-4">
					<Hexagon className="w-12 h-12 text-zinc-600" />
					<h3 className="text-xl font-bold text-white">Perfil Incompleto</h3>
					<p className="text-zinc-400">
						Completa tu evaluación para descubrir tus fortalezas.
					</p>
				</div>
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
		<CyberCard variant="default" className="h-full">
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-lg font-bold uppercase tracking-wider text-white">
					Top 5 Fortalezas
				</h3>
				<CyberBadge variant="zinc">Perfil</CyberBadge>
			</div>

			<div className="space-y-4">
				{strengths.map((strength) => {
					const domain = mapDomainKey(strength.domainKey);
					const domainColor = getDomainColor(domain, "primary");
					return (
						<div
							key={strength.key}
							className="flex items-center justify-between group"
						>
							<div className="flex items-center space-x-3">
								<div className="relative flex items-center justify-center w-8 h-8">
									<Hexagon
										className="w-8 h-8 fill-current"
										style={{ color: domainColor, opacity: 0.2 }}
									/>
									<span className="absolute text-xs font-bold text-white">
										{strength.rank}
									</span>
								</div>
								<div>
									<p className="font-bold text-zinc-200 group-hover:text-white transition-colors">
										{strength.nameEs}
									</p>
									<p className="text-xs text-zinc-500">
										{strength.domainNameEs}
									</p>
								</div>
							</div>
							<div className="text-right">
								<span className="text-xs font-mono text-zinc-500">
									{strength.moduleCount.completed}/
									{strength.moduleCount.general +
										strength.moduleCount.personalized}
								</span>
							</div>
						</div>
					);
				})}
			</div>
		</CyberCard>
	);
}
