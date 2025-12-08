/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";

import {
	AlertTriangleIcon,
	ArrowLeftIcon,
	BrainIcon,
	LightbulbIcon,
	RefreshCwIcon,
	RocketIcon,
	ShieldAlertIcon,
	SparklesIcon,
	TargetIcon,
	UsersIcon,
	ZapIcon,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Loader } from "@/components/ai-elements/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ModelProvider } from "@/lib/ai";
import { generateTeamReport } from "../_actions";
import {
	ActionPlanCard,
	DomainCoverageChart,
	InsightCard,
	RedFlagCard,
	ReportSection,
	TeamMemberCard,
} from "../_components/report-cards";
import type { TeamReport } from "../_schemas/team-report.schema";

interface TeamReportViewProps {
	team: {
		id: string;
		name: string;
		description: string | null;
		members: Array<{
			id: string;
			name: string;
			role: string | null;
			career: string | null;
			hasStrengths: boolean;
			strengths: Array<{
				rank: number;
				name: string;
				domain: string;
			}>;
		}>;
	};
	membersWithStrengthsCount: number;
	existingReport: {
		id: string;
		version: number;
		createdAt: Date;
		modelUsed: string | null;
		content: TeamReport | null;
		metadata: Record<string, unknown> | null;
	} | null;
}

export function TeamReportView({
	team,
	membersWithStrengthsCount,
	existingReport,
}: TeamReportViewProps) {
	const [isPending, startTransition] = useTransition();
	const [provider, setProvider] = useState<ModelProvider>("openai");
	const [report, setReport] = useState<TeamReport | null>(
		existingReport?.content ?? null,
	);
	const [error, setError] = useState<string | null>(null);
	const [reportMeta, setReportMeta] = useState<{
		version: number;
		createdAt: Date;
		modelUsed: string | null;
	} | null>(
		existingReport
			? {
					version: existingReport.version,
					createdAt: existingReport.createdAt,
					modelUsed: existingReport.modelUsed,
				}
			: null,
	);

	const handleGenerate = (forceRegenerate: boolean) => {
		setError(null);
		startTransition(async () => {
			const result = await generateTeamReport({
				teamId: team.id,
				forceRegenerate,
				provider,
			});

			if (!result.success) {
				setError(result.error ?? "Failed to generate report");
				return;
			}

			// Refresh page to get new report
			window.location.reload();
		});
	};

	// No members with strengths
	if (membersWithStrengthsCount === 0) {
		return (
			<div className="container mx-auto py-8">
				<Card className="mx-auto max-w-lg text-center">
					<CardHeader>
						<CardTitle>No Team Data</CardTitle>
						<CardDescription>
							Team members need to complete their strengths assessment before
							generating a team report.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							{team.members.length} members in team, 0 with strengths assigned
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto space-y-8 py-8">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div className="space-y-1">
					<Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
						<Link href="/dashboard/reports">
							<ArrowLeftIcon className="mr-2 size-4" />
							Back to Reports
						</Link>
					</Button>
					<h1 className="text-3xl font-bold tracking-tight">
						Team Assessment Report
					</h1>
					<p className="text-muted-foreground">
						AI-powered analysis for {team.name}
					</p>
				</div>
				{reportMeta && (
					<div className="text-right text-sm text-muted-foreground">
						<p>Version {reportMeta.version}</p>
						<p>{new Date(reportMeta.createdAt).toLocaleDateString()}</p>
						{reportMeta.modelUsed && (
							<Badge variant="secondary" className="mt-1">
								{reportMeta.modelUsed}
							</Badge>
						)}
					</div>
				)}
			</div>

			{/* Team Summary */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<UsersIcon className="size-5 text-primary" />
						{team.name}
					</CardTitle>
					{team.description && (
						<CardDescription>{team.description}</CardDescription>
					)}
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-4">
						<div className="rounded-lg bg-muted px-4 py-2 text-center">
							<p className="text-2xl font-bold">{team.members.length}</p>
							<p className="text-xs text-muted-foreground">Members</p>
						</div>
						<div className="rounded-lg bg-muted px-4 py-2 text-center">
							<p className="text-2xl font-bold">{membersWithStrengthsCount}</p>
							<p className="text-xs text-muted-foreground">With Strengths</p>
						</div>
					</div>
					{membersWithStrengthsCount < team.members.length && (
						<div className="mt-4 flex items-center gap-2 text-sm text-amber-600">
							<AlertTriangleIcon className="size-4" />
							<span>
								{team.members.length - membersWithStrengthsCount} members
								haven&apos;t completed their assessment
							</span>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Generate/Regenerate Section */}
			{!report && (
				<Card>
					<CardHeader>
						<CardTitle>Generate Team Report</CardTitle>
						<CardDescription>
							Create a comprehensive AI-powered analysis of your team
							composition
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label className="text-sm font-medium">AI Provider</Label>
							<Select
								value={provider}
								onValueChange={(v) => setProvider(v as ModelProvider)}
								disabled={isPending}
							>
								<SelectTrigger className="w-[280px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="openai">
										OpenAI (GPT-4o) - Recommended
									</SelectItem>
									<SelectItem value="google">
										Google (Gemini 2.5 Pro)
									</SelectItem>
								</SelectContent>
							</Select>
							<p className="text-xs text-muted-foreground">
								Team reports use powerful models for complex multi-person
								analysis
							</p>
						</div>

						{error && (
							<div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
								{error}
							</div>
						)}

						{isPending && (
							<div className="flex items-center gap-3 rounded-lg bg-primary/5 px-4 py-3">
								<Loader size={20} />
								<div>
									<p className="font-medium text-sm">
										Analyzing team composition...
									</p>
									<p className="text-xs text-muted-foreground">
										This may take 60-90 seconds for team reports
									</p>
								</div>
							</div>
						)}

						<Button
							onClick={() => handleGenerate(false)}
							disabled={isPending}
							size="lg"
						>
							{isPending ? (
								<>
									<Loader size={16} className="mr-2" />
									Generating...
								</>
							) : (
								<>
									<SparklesIcon className="mr-2 size-4" />
									Generate Team Report
								</>
							)}
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Report Content */}
			{report && (
				<>
					{/* Regenerate Option */}
					<div className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-3">
						<p className="text-sm text-muted-foreground">
							Team composition changed? Regenerate for updated analysis.
						</p>
						<div className="flex items-center gap-2">
							<Select
								value={provider}
								onValueChange={(v) => setProvider(v as ModelProvider)}
								disabled={isPending}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="openai">GPT-4o</SelectItem>
									<SelectItem value="google">Gemini 2.5 Pro</SelectItem>
								</SelectContent>
							</Select>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleGenerate(true)}
								disabled={isPending}
							>
								{isPending ? (
									<Loader size={14} />
								) : (
									<RefreshCwIcon className="size-4" />
								)}
								<span className="ml-2">Regenerate</span>
							</Button>
						</div>
					</div>

					{/* Executive Summary */}
					<Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
						<CardHeader>
							<div className="flex items-center gap-2">
								<Badge variant="outline" className="border-blue-500/30">
									{report.summary.teamArchetype}
								</Badge>
							</div>
							<CardTitle className="text-xl">
								{report.summary.headline}
							</CardTitle>
							<CardDescription>
								{report.summary.memberCount} members analyzed
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-foreground/90 whitespace-pre-line">
								{report.summary.overview}
							</p>
							<div className="grid gap-4 md:grid-cols-2">
								<div className="rounded-lg bg-green-500/10 px-4 py-3">
									<p className="font-medium text-sm text-green-600 flex items-center gap-2">
										<ZapIcon className="size-4" />
										Team Superpower
									</p>
									<p className="text-sm text-foreground/80">
										{report.summary.superpower}
									</p>
								</div>
								<div className="rounded-lg bg-amber-500/10 px-4 py-3">
									<p className="font-medium text-sm text-amber-600 flex items-center gap-2">
										<TargetIcon className="size-4" />
										Primary Challenge
									</p>
									<p className="text-sm text-foreground/80">
										{report.summary.primaryChallenge}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Culture Map */}
					<ReportSection
						title="Team Culture Map"
						description="Your team's position on the culture quadrant"
						icon={<BrainIcon className="size-5" />}
					>
						<Card>
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="flex items-center gap-2">
											{report.cultureMap.culture} Culture
											<span className="text-lg">
												{getCultureEmoji(report.cultureMap.culture)}
											</span>
										</CardTitle>
										<CardDescription>
											{report.cultureMap.cultureEs}
										</CardDescription>
									</div>
									<div className="text-right text-sm">
										<p>
											Energy: {report.cultureMap.energyAxis.action}% Action /{" "}
											{report.cultureMap.energyAxis.reflection}% Reflection
										</p>
										<p>
											Orientation: {report.cultureMap.orientationAxis.results}%
											Results / {report.cultureMap.orientationAxis.people}%
											People
										</p>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-foreground/90">
									{report.cultureMap.description}
								</p>
								<div>
									<p className="text-xs font-medium text-muted-foreground uppercase mb-2">
										Implications
									</p>
									<ul className="space-y-1">
										{report.cultureMap.implications.map((impl, i) => (
											<li
												key={i}
												className="text-sm text-muted-foreground flex items-start gap-2"
											>
												<span className="text-primary">•</span>
												{impl}
											</li>
										))}
									</ul>
								</div>
							</CardContent>
						</Card>
					</ReportSection>

					{/* Domain Coverage */}
					<ReportSection
						title="Domain Coverage"
						description="Distribution of strengths across the four domains"
						icon={<TargetIcon className="size-5" />}
					>
						<DomainCoverageChart domains={report.domainCoverage} />
					</ReportSection>

					{/* Member Summaries */}
					<ReportSection
						title="Team Members"
						description="Individual contributions to team dynamics"
						icon={<UsersIcon className="size-5" />}
					>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{report.memberSummaries.map((member) => (
								<TeamMemberCard
									key={member.memberId}
									name={member.memberName}
									role={member.role}
									topStrengths={member.topStrengths}
									primaryDomain={member.primaryDomain}
									uniqueContribution={member.uniqueContribution}
								/>
							))}
						</div>
					</ReportSection>

					{/* Top Synergies */}
					<ReportSection
						title="Team Synergies"
						description="Best collaboration partnerships in your team"
						icon={<SparklesIcon className="size-5" />}
					>
						<div className="grid gap-4 md:grid-cols-2">
							{report.topSynergies.map((synergy, i) => (
								<Card key={i}>
									<CardHeader className="pb-2">
										<div className="flex items-center justify-between">
											<CardTitle className="text-base">
												{synergy.pair[0]} + {synergy.pair[1]}
											</CardTitle>
											<Badge
												variant={
													synergy.synergyScore === "exceptional"
														? "default"
														: "secondary"
												}
											>
												{synergy.synergyScore}
											</Badge>
										</div>
									</CardHeader>
									<CardContent className="space-y-2">
										<div className="flex flex-wrap gap-1">
											{synergy.complementaryStrengths.map((s) => (
												<Badge key={s} variant="outline">
													{s}
												</Badge>
											))}
										</div>
										<p className="text-xs font-medium text-muted-foreground">
											Best for:
										</p>
										<ul className="text-sm text-muted-foreground">
											{synergy.potentialProjects.slice(0, 2).map((p, j) => (
												<li key={j}>• {p}</li>
											))}
										</ul>
										{synergy.watchOut && (
											<p className="text-xs text-amber-600">
												⚠️ {synergy.watchOut}
											</p>
										)}
									</CardContent>
								</Card>
							))}
						</div>
					</ReportSection>

					{/* Capability Gaps */}
					{report.capabilityGaps.length > 0 && (
						<ReportSection
							title="Capability Gaps"
							description="Areas where the team could benefit from additional strengths"
							icon={<AlertTriangleIcon className="size-5" />}
						>
							<div className="grid gap-4 md:grid-cols-2">
								{report.capabilityGaps.map((gap, i) => (
									<Card key={i} className="border-l-4 border-l-amber-500">
										<CardHeader className="pb-2">
											<div className="flex items-center justify-between">
												<CardTitle className="text-base">{gap.area}</CardTitle>
												<Badge
													className={
														gap.impact === "critical"
															? "bg-destructive/10 text-destructive border-destructive/20"
															: gap.impact === "high"
																? "bg-orange-500/10 text-orange-600 border-orange-500/20"
																: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
													}
												>
													{gap.impact} impact
												</Badge>
											</div>
										</CardHeader>
										<CardContent className="space-y-3">
											<p className="text-sm text-muted-foreground">
												{gap.currentCoverage}
											</p>
											<div>
												<p className="text-xs font-medium text-muted-foreground uppercase">
													Recommendations
												</p>
												<ul className="text-sm space-y-1 mt-1">
													{gap.recommendations.map((rec, j) => (
														<li key={j} className="text-muted-foreground">
															<Badge variant="outline" className="mr-2 text-xs">
																{rec.type}
															</Badge>
															{rec.description}
														</li>
													))}
												</ul>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</ReportSection>
					)}

					{/* Insights */}
					<ReportSection
						title="Key Insights"
						description="Opportunities for team growth and impact"
						icon={<LightbulbIcon className="size-5" />}
					>
						<div className="grid gap-4 md:grid-cols-2">
							{report.insights.map((insight, i) => (
								<InsightCard
									key={i}
									title={insight.title}
									description={insight.description}
									actionItems={insight.actionItems}
								/>
							))}
						</div>
					</ReportSection>

					{/* Red Flags */}
					<ReportSection
						title="Red Flags & Risks"
						description="Warning signs to watch for as a team"
						icon={<ShieldAlertIcon className="size-5" />}
					>
						<div className="grid gap-4 md:grid-cols-2">
							{report.redFlags.map((redFlag, i) => (
								<RedFlagCard
									key={i}
									title={redFlag.title}
									description={redFlag.description}
									severity={redFlag.severity}
									mitigation={redFlag.mitigation}
								/>
							))}
						</div>
					</ReportSection>

					{/* Recommended Rituals */}
					<ReportSection
						title="Recommended Team Rituals"
						description="Practices to enhance team effectiveness"
						icon={<SparklesIcon className="size-5" />}
						defaultOpen={false}
					>
						<div className="grid gap-4 md:grid-cols-2">
							{report.recommendedRituals.map((ritual, i) => (
								<Card key={i}>
									<CardHeader className="pb-2">
										<div className="flex items-center justify-between">
											<CardTitle className="text-base">{ritual.name}</CardTitle>
											<Badge variant="outline">{ritual.frequency}</Badge>
										</div>
										<CardDescription>{ritual.purpose}</CardDescription>
									</CardHeader>
									<CardContent className="space-y-2">
										<p className="text-xs text-muted-foreground">
											Duration: {ritual.duration} · Target:{" "}
											{ritual.targetDomain}
										</p>
										<ol className="text-sm space-y-1">
											{ritual.steps.map((step, j) => (
												<li key={j} className="text-muted-foreground">
													{j + 1}. {step}
												</li>
											))}
										</ol>
									</CardContent>
								</Card>
							))}
						</div>
					</ReportSection>

					{/* Action Plan */}
					<ReportSection
						title="Team Action Plan"
						description="Your team's roadmap for the next quarter"
						icon={<RocketIcon className="size-5" />}
					>
						<ActionPlanCard
							immediate={report.actionPlan.immediate}
							shortTerm={report.actionPlan.shortTerm}
							longTerm={report.actionPlan.longTerm}
						/>
						{report.actionPlan.hiringPriorities &&
							report.actionPlan.hiringPriorities.length > 0 && (
								<Card className="mt-4">
									<CardHeader className="pb-2">
										<CardTitle className="text-base">
											Hiring Priorities
										</CardTitle>
										<CardDescription>
											Strengths to prioritize in your next hires
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex flex-wrap gap-2">
											{report.actionPlan.hiringPriorities.map((strength) => (
												<Badge key={strength} variant="default">
													{strength}
												</Badge>
											))}
										</div>
									</CardContent>
								</Card>
							)}
					</ReportSection>
				</>
			)}
		</div>
	);
}

function getCultureEmoji(culture: string): string {
	switch (culture) {
		case "Execution":
			return "🚀";
		case "Influence":
			return "✨";
		case "Strategy":
			return "🧠";
		case "Cohesion":
			return "💚";
		default:
			return "📊";
	}
}
