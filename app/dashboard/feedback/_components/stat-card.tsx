"use client";

import { cn } from "@/lib/cn";
import { ReactNode } from "react";

interface StatCardProps {
	icon: ReactNode;
	label: string;
	value: number;
	variant: "default" | "primary" | "success" | "warning";
	extra?: ReactNode;
}

export function StatCard({
	icon,
	label,
	value,
	variant,
	extra,
}: StatCardProps) {
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
				"relative group overflow-hidden p-px bg-border/40 transition-all hover:bg-border/60 h-full",
				style.border,
			)}
			style={{
				clipPath:
					"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
			}}
		>
			<div
				className="bg-background/80 backdrop-blur-sm p-5 h-full relative flex items-center gap-4"
				style={{
					clipPath:
						"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
				}}
			>
				{/* Hexagonal Icon Container - Fixed Layout */}
				<div className="relative shrink-0 size-14 flex items-center justify-center">
					{/* Background Hexagon */}
					<div
						className={cn(
							"absolute inset-0 transition-transform group-hover:scale-110",
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

					{/* Icon */}
					<div className={cn("relative z-10 size-10", style.text)}>{icon}</div>
				</div>

				<div className="flex-1 min-w-0">
					<p
						className={cn(
							"text-3xl font-black tracking-tighter leading-none mb-1",
							style.text,
						)}
					>
						{value}
					</p>
					<p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 truncate">
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
