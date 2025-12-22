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
import DashboardContainer from "../_components/dashboard-container";
import { PendingXpBanner } from "./_components/pending-xp-banner";
import PendingXpIndicator from "./_components/pending-xp-indicator";
import { getInsightsStatus } from "./_services/feedback-analysis.service";
import { getFeedbackRequests } from "./_services/feedback-request.service";
import { cn } from "@/lib/utils";

/**
 * Static shell with Suspense for dynamic content
 */
export default function FeedbackDashboardPage() {
	return (
		<DashboardContainer
			title="Feedback 360°"
			description="Gestiona tus solicitudes de feedback y descubre nuevas perspectivas"
			card={
				<div className="flex gap-3">
					<Link href="/dashboard/feedback/history">
						<button
							className="group/btn flex items-center gap-2 px-4 py-2 border border-border bg-muted/20 text-foreground text-[10px] font-black uppercase tracking-widest transition-all hover:border-primary/50"
							style={{
								clipPath:
									"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
							}}
						>
							<History className="h-3.5 w-3.5" />
							Historial
						</button>
					</Link>
					<Link href="/dashboard/feedback/request">
						<button
							className="group/btn flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest transition-all hover:bg-primary/90"
							style={{
								clipPath:
									"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
							}}
						>
							<Plus className="h-3.5 w-3.5" />
							Nueva Solicitud
						</button>
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
						<button
							className={cn(
								"group flex items-center gap-3 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
								insightsStatus.hasNewInsights
									? "bg-primary text-primary-foreground hover:bg-primary/90"
									: "bg-muted/30 border border-border text-foreground hover:border-primary/50",
							)}
							style={{
								clipPath:
									"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
							}}
						>
							<Lightbulb className="h-4 w-4" />
							Analizar Insights Feedback
							{insightsStatus.hasNewInsights && (
								<div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 bg-background/20 text-[8px] font-black tracking-widest border border-current">
									<Sparkles className="h-2.5 w-2.5" />
									NUEVO_REPORTE
								</div>
							)}
						</button>
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
							<div className="flex items-center gap-3 mb-2">
								<div
									className="p-2 bg-primary/10 text-primary"
									style={{
										clipPath:
											"polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
									}}
								>
									<Inbox className="h-5 w-5" />
								</div>
								<h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">
									Pendientes de Responder
								</h3>
							</div>
							<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
								Solicitudes de feedback entrantes_
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
										<FeedbackRequestCard
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
							<div className="flex items-center gap-3 mb-2">
								<div
									className="p-2 bg-primary/10 text-primary"
									style={{
										clipPath:
											"polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
									}}
								>
									<Send className="h-5 w-5" />
								</div>
								<h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">
									Solicitudes Enviadas
								</h3>
							</div>
							<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
								Feedback saliente en proceso_
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
										<FeedbackRequestCard
											key={request.id}
											request={request}
											type="sent"
										/>
									))}

									{pendingSent.length > 0 && completedSent.length > 0 && (
										<div className="h-px w-full bg-linear-to-r from-transparent via-border/40 to-transparent my-4" />
									)}

									{completedSent.slice(0, 3).map((request) => (
										<FeedbackRequestCard
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
					icon={<Clock className="h-4 w-4" />}
					label="Pendientes"
					value={pendingSent.length}
					variant="warning"
					extra={
						<PendingXpIndicator pendingCount={pendingSent.length} compact />
					}
				/>
				<StatCard
					icon={<CheckCircle className="h-4 w-4" />}
					label="Completadas"
					value={completedSent.length}
					variant="success"
				/>
				<StatCard
					icon={<Send className="h-4 w-4" />}
					label="Enviadas"
					value={sentRequests.length}
					variant="default"
				/>
				<StatCard
					icon={<Inbox className="h-4 w-4" />}
					label="Por Responder"
					value={pendingReceived.length}
					variant="primary"
				/>
			</div>
		</>
	);
}

/**
 * Individual feedback request card
 */
interface FeedbackRequestCardProps {
	request: {
		id: string;
		status: FeedbackRequestStatus;
		isAnonymous: boolean;
		sentAt: Date;
		expiresAt: Date | null;
		respondent: {
			id: string;
			name: string;
			email: string;
			image: string | null;
		};
		responseCount: number;
	};
	type: "sent" | "received";
}

function FeedbackRequestCard({ request, type }: FeedbackRequestCardProps) {
	const statusConfig = {
		PENDING: {
			label: "Pendiente",
			variant: "outline" as const,
			icon: Clock,
			color: "text-amber-500",
			bg: "bg-amber-500/10",
			border: "border-amber-500/20",
		},
		COMPLETED: {
			label: "Completada",
			variant: "default" as const,
			icon: CheckCircle,
			color: "text-emerald-500",
			bg: "bg-emerald-500/10",
			border: "border-emerald-500/20",
		},
		DECLINED: {
			label: "Rechazada",
			variant: "destructive" as const,
			icon: XCircle,
			color: "text-destructive",
			bg: "bg-destructive/10",
			border: "border-destructive/20",
		},
		EXPIRED: {
			label: "Expirada",
			variant: "secondary" as const,
			icon: AlertCircle,
			color: "text-muted-foreground",
			bg: "bg-muted",
			border: "border-border",
		},
	};

	const status = statusConfig[request.status];
	const StatusIcon = status.icon;
	const clipPathCard =
		"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)";

	return (
		<div
			className={cn(
				"group flex items-center gap-4 p-4 transition-all duration-300 bg-background/50 hover:bg-muted/30 border-l-2",
				request.status === "PENDING"
					? "border-l-primary"
					: "border-l-transparent",
			)}
			style={{
				clipPath: clipPathCard,
				backgroundImage:
					"linear-gradient(to right, transparent 98%, var(--border) 100%)",
				backgroundSize: "20px 100%",
			}}
		>
			{/* Avatar */}
			<div className="relative">
				<div className="absolute inset-0 bg-primary/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
				<div
					className="h-10 w-10 bg-muted flex items-center justify-center overflow-hidden relative z-10"
					style={{
						clipPath:
							"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
					}}
				>
					{request.respondent.image ? (
						<Image
							src={request.respondent.image}
							alt={request.respondent.name}
							width={40}
							height={40}
							className="h-full w-full object-cover"
						/>
					) : (
						<span className="text-sm font-black text-muted-foreground">
							{request.respondent.name?.charAt(0)?.toUpperCase() || "?"}
						</span>
					)}
				</div>
			</div>

			{/* Info */}
			<div className="flex-1 min-w-0 space-y-1">
				<p className="font-bold text-sm uppercase tracking-wide truncate flex items-center gap-2">
					{request.respondent.name}
					{request.isAnonymous && (
						<span className="px-1.5 py-0.5 rounded text-[9px] bg-muted text-muted-foreground">
							ANÓNIMO
						</span>
					)}
				</p>
				<p className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider flex items-center gap-2">
					<span className={cn("w-1.5 h-1.5 rounded-full", status.bg)} />
					{new Date(request.sentAt)
						.toLocaleDateString("es-ES", {
							day: "2-digit",
							month: "short",
							year: "numeric",
						})
						.toUpperCase()}
				</p>
			</div>

			{/* Actions or Status */}
			<div className="flex items-center gap-3">
				{type === "received" && request.status === "PENDING" ? (
					<Link href={`/dashboard/feedback/respond/${request.id}`}>
						<Button
							size="sm"
							className="h-8 text-[10px] font-black uppercase tracking-widest bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/50"
							style={{
								clipPath:
									"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
							}}
						>
							Responder
						</Button>
					</Link>
				) : (
					<div
						className={cn(
							"flex items-center gap-2 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border",
							status.color,
							status.bg,
							status.border,
						)}
						style={{
							clipPath:
								"polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
						}}
					>
						<StatusIcon className="h-3 w-3" />
						{status.label}
					</div>
				)}
			</div>
		</div>
	);
}

/**
 * Statistics card component
 */
interface StatCardProps {
	icon: React.ReactNode;
	label: string;
	value: number;
	variant: "default" | "primary" | "success" | "warning";
	extra?: React.ReactNode;
}

function StatCard({ icon, label, value, variant, extra }: StatCardProps) {
	const variantStyles = {
		default: {
			border: "border-border",
			text: "text-muted-foreground",
			bg: "bg-muted/10",
			accent: "text-muted-foreground/50",
		},
		primary: {
			border: "border-primary/50",
			text: "text-primary",
			bg: "bg-primary/5",
			accent: "text-primary/40",
		},
		success: {
			border: "border-emerald-500/50",
			text: "text-emerald-500",
			bg: "bg-emerald-500/5",
			accent: "text-emerald-500/40",
		},
		warning: {
			border: "border-amber-500/50",
			text: "text-amber-500",
			bg: "bg-amber-500/5",
			accent: "text-amber-500/40",
		},
	};

	const style = variantStyles[variant];

	return (
		<div
			className={cn(
				"relative group overflow-hidden p-px bg-border/40 transition-all hover:bg-border/60",
				style.border,
			)}
			style={{
				clipPath:
					"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
			}}
		>
			<div
				className="bg-background/80 backdrop-blur-sm p-5 relative h-full flex items-center gap-4"
				style={{
					clipPath:
						"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
				}}
			>
				<div
					className={cn(
						"p-2.5 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
						style.bg,
						style.accent,
					)}
					style={{
						clipPath:
							"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
						backgroundColor: "currentColor",
						opacity: 0.15,
					}}
				/>
				<div className="absolute left-[34px] top-[34px] p-2.5 flex items-center justify-center shrink-0 pointer-events-none">
					<div className={cn("h-4 w-4", style.text)}>{icon}</div>
				</div>

				<div className="flex-1">
					<p
						className={cn(
							"text-3xl font-black tracking-tighter leading-none mb-1",
							style.text,
						)}
					>
						{value}
					</p>
					<p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
						{label}
					</p>
					{extra && (
						<div className="mt-2 border-t border-border/20 pt-2">{extra}</div>
					)}
				</div>

				{/* Decorative tech detail */}
				<div className="absolute bottom-0 right-0 w-8 h-8 opacity-[0.05] pointer-events-none">
					<div
						className="absolute bottom-2 right-2 w-1 h-4 bg-current"
						style={{ backgroundColor: "currentColor" }}
					/>
					<div
						className="absolute bottom-2 right-2 w-4 h-1 bg-current"
						style={{ backgroundColor: "currentColor" }}
					/>
				</div>
			</div>
		</div>
	);
}
