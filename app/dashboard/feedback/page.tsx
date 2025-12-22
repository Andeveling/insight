/**
 * Feedback Dashboard Page
 *
 * Main feedback page showing sent/received requests and insights
 */

import {
	AlertCircle,
	CheckCircle,
	Clock,
	History,
	Inbox,
	Lightbulb,
	Plus,
	Send,
	Sparkles,
	XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { FeedbackRequestStatus } from "@/generated/prisma/client";
import { getSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import DashboardContainer from "../_components/dashboard-container";
import { DashboardRequestCard } from "./_components/dashboard-request-card";
import { PendingXpBanner } from "./_components/pending-xp-banner";
import PendingXpIndicator from "./_components/pending-xp-indicator";
import { StatCard } from "./_components/stat-card";
import { getInsightsStatus } from "./_services/feedback-analysis.service";
import { getFeedbackRequests } from "./_services/feedback-request.service";

/**
 * Static shell with Suspense for dynamic content
 */
export default function FeedbackDashboardPage() {
	return (
		<DashboardContainer
			title="FEEDBACK_360_PROTOCOL"
			description="Gestiona tus solicitudes de feedback y descubre nuevas perspectivas_"
			card={
				<div className="flex gap-3">
					<Link href="/dashboard/feedback/history">
						<div
							className="p-px bg-border/40 hover:bg-primary/30 transition-colors"
							style={{
								clipPath:
									"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
							}}
						>
							<button
								className="group/btn flex items-center gap-2 px-4 py-2 bg-muted/20 text-foreground text-[10px] font-black uppercase tracking-widest transition-all"
								style={{
									clipPath:
										"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
								}}
							>
								<History className="h-3.5 w-3.5" />
								Historial
							</button>
						</div>
					</Link>
					<Link href="/dashboard/feedback/request">
						<div
							className="p-px bg-primary/40 hover:bg-primary/60 transition-colors"
							style={{
								clipPath:
									"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
							}}
						>
							<button
								className="group/btn flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest transition-all hover:bg-primary/95"
								style={{
									clipPath:
										"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
								}}
							>
								<Plus className="h-3.5 w-3.5" />
								Nueva Solicitud
							</button>
						</div>
					</Link>
				</div>
			}
		>
			<Suspense fallback={<FeedbackDashboardSkeleton />}>
				<FeedbackDashboardContent />
			</Suspense>
		</DashboardContainer>
	);
}

/**
 * Loading skeleton for feedback dashboard
 */
function FeedbackDashboardSkeleton() {
	const clipPath16 =
		"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
	return (
		<div className="space-y-8">
			<div className="grid gap-6 md:grid-cols-2">
				{[1, 2].map((i) => (
					<div
						key={i}
						className="p-px bg-border/40"
						style={{ clipPath: clipPath16 }}
					>
						<div
							className="bg-background/80 p-6 space-y-4"
							style={{ clipPath: clipPath16 }}
						>
							<div className="flex items-center gap-3">
								<Skeleton
									className="h-10 w-10 bg-muted/20"
									style={{
										clipPath:
											"polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
									}}
								/>
								<Skeleton className="h-5 w-40 bg-muted/20" />
							</div>
							<div className="space-y-3">
								{[1, 2, 3].map((j) => (
									<Skeleton
										key={j}
										className="h-16 w-full bg-muted/10"
										style={{
											clipPath:
												"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 12px) 100%, 0 100%, 0 8px)",
										}}
									/>
								))}
							</div>
						</div>
					</div>
				))}
			</div>
			<div className="grid gap-4 md:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<div
						key={i}
						className="p-px bg-border/20"
						style={{
							clipPath:
								"polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
						}}
					>
						<Skeleton
							className="h-16 w-full bg-muted/10"
							style={{
								clipPath:
									"polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
							}}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

/**
 * Dynamic content that accesses session and database
 */
async function FeedbackDashboardContent() {
	const session = await getSession();

	if (!session?.user?.id) {
		redirect("/login");
	}

	const [sentRequests, receivedRequests, insightsStatus] = await Promise.all([
		getFeedbackRequests(session.user.id, "sent"),
		getFeedbackRequests(session.user.id, "received"),
		getInsightsStatus(session.user.id),
	]);

	const pendingReceived = receivedRequests.filter(
		(r) => r.status === "PENDING",
	);
	const pendingSent = sentRequests.filter((r) => r.status === "PENDING");
	const completedSent = sentRequests.filter((r) => r.status === "COMPLETED");

	const clipPath16 =
		"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";

	return (
		<>
			{/* Insights CTA if available */}
			{insightsStatus.hasEnoughResponses && (
				<div className="mb-8">
					<Link href="/dashboard/feedback/insights">
						<div
							className={cn(
								"p-px transition-all",
								insightsStatus.hasNewInsights
									? "bg-primary/40 hover:bg-primary/60"
									: "bg-border/40 hover:bg-primary/30",
							)}
							style={{
								clipPath:
									"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
							}}
						>
							<button
								className={cn(
									"group flex items-center gap-3 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all w-full",
									insightsStatus.hasNewInsights
										? "bg-primary text-primary-foreground hover:bg-primary/95"
										: "bg-background/90 backdrop-blur-md text-foreground hover:bg-muted/10",
								)}
								style={{
									clipPath:
										"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
								}}
							>
								<Lightbulb className="size-10" />
								PROCESAR_INSIGHTS_FEEDBACK {"//"} [RUN_ANALYSIS]
								{insightsStatus.hasNewInsights && (
									<div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 bg-background/20 text-[8px] font-black tracking-widest border border-current">
										<Sparkles className="h-2.5 w-2.5" />
										NUEVO_REPORTE
									</div>
								)}
							</button>
						</div>
					</Link>
				</div>
			)}

			{/* Pending XP Banner (Feature 008) */}
			<PendingXpBanner />

			<div className="grid gap-8 md:grid-cols-2 mb-8">
				{/* Pending to Respond */}
				<div
					className="relative overflow-hidden p-px bg-border/40 group/inbox"
					style={{ clipPath: clipPath16 }}
				>
					<div
						className="bg-background/95 backdrop-blur-md relative h-full"
						style={{ clipPath: clipPath16 }}
					>
						<div className="p-6 pb-2 space-y-1">
							<div className="flex items-center gap-4 mb-2">
								<div
									className="p-px bg-primary/30"
									style={{
										clipPath:
											"polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
									}}
								>
									<div
										className="p-2 bg-primary/10 text-primary h-full w-full flex items-center justify-center"
										style={{
											clipPath:
												"polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
										}}
									>
										<Inbox className="h-5 w-5" />
									</div>
								</div>
								<h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">
									Entrada_Feedback
								</h3>
							</div>
							<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
								SOLICITUDES_ENTRANTES {"//"} [STATUS: ACTIVE]
							</p>
						</div>
						<div className="p-6 pt-2">
							{pendingReceived.length === 0 ? (
								<div className="py-12 border border-dashed border-border/40 flex flex-col items-center justify-center text-center">
									<p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
										Canal de datos despejado_
									</p>
								</div>
							) : (
								<div className="space-y-4">
									{pendingReceived.map((request) => (
										<DashboardRequestCard
											key={request.id}
											request={request}
											type="received"
										/>
									))}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Sent Requests */}
				<div
					className="relative overflow-hidden p-px bg-border/40 group/sent"
					style={{ clipPath: clipPath16 }}
				>
					<div
						className="bg-background/95 backdrop-blur-md relative h-full"
						style={{ clipPath: clipPath16 }}
					>
						<div className="p-6 pb-2 space-y-1">
							<div className="flex items-center gap-4 mb-2">
								<div
									className="p-px bg-primary/30"
									style={{
										clipPath:
											"polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
									}}
								>
									<div
										className="p-2 bg-primary/10 text-primary h-full w-full flex items-center justify-center"
										style={{
											clipPath:
												"polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
										}}
									>
										<Send className="h-5 w-5" />
									</div>
								</div>
								<h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground">
									Salida_Frequencia
								</h3>
							</div>
							<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
								TRANSMISIONES_EN_CURSO {"//"} [BUFF_SYNC]
							</p>
						</div>
						<div className="p-6 pt-2">
							{sentRequests.length === 0 ? (
								<div className="py-12 border border-dashed border-border/40 flex flex-col items-center justify-center text-center gap-4">
									<p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
										Sin transmisiones activas_
									</p>
									<Link href="/dashboard/feedback/request">
										<button
											className="px-4 py-2 bg-muted/30 border border-border text-[9px] font-black uppercase tracking-widest hover:border-primary/50 transition-all"
											style={{
												clipPath:
													"polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
											}}
										>
											Inicializar Solicitud
										</button>
									</Link>
								</div>
							) : (
								<div className="space-y-4">
									{pendingSent.map((request) => (
										<DashboardRequestCard
											key={request.id}
											request={request}
											type="sent"
										/>
									))}

									{pendingSent.length > 0 && completedSent.length > 0 && (
										<div className="h-px w-full bg-linear-to-r from-transparent via-border/40 to-transparent my-4" />
									)}

									{completedSent.slice(0, 3).map((request) => (
										<DashboardRequestCard
											key={request.id}
											request={request}
											type="sent"
										/>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Stats Summary */}
			<div className="grid gap-4 md:grid-cols-4 mt-6">
				<StatCard
					icon={<Clock className="size-10" />}
					label="Pendientes"
					value={pendingSent.length}
					variant="warning"
					extra={
						<PendingXpIndicator pendingCount={pendingSent.length} compact />
					}
				/>
				<StatCard
					icon={<CheckCircle className="size-10" />}
					label="Completadas"
					value={completedSent.length}
					variant="success"
				/>
				<StatCard
					icon={<Send className="size-10" />}
					label="Enviadas"
					value={sentRequests.length}
					variant="default"
				/>
				<StatCard
					icon={<Inbox className="size-10" />}
					label="Por Responder"
					value={pendingReceived.length}
					variant="primary"
				/>
			</div>
		</>
	);
}
