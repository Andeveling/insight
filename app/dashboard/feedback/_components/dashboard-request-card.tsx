"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { FeedbackRequestStatus } from "@/generated/prisma/client";
import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export interface FeedbackRequestCardProps {
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

export function DashboardRequestCard({
	request,
	type,
}: FeedbackRequestCardProps) {
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
						<div
							className="p-px bg-primary/30 hover:bg-primary transition-colors"
							style={{
								clipPath:
									"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
							}}
						>
							<Button
								size="sm"
								className="h-8 text-[10px] font-black uppercase tracking-widest bg-primary/10 hover:bg-primary/20 text-primary border-0"
								style={{
									clipPath:
										"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
								}}
							>
								Responder
							</Button>
						</div>
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
