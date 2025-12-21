import { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CyberCardProps {
	children: ReactNode;
	className?: string;
	variant?: "default" | "glow" | "alert";
}

export function CyberCard({
	children,
	className,
	variant = "default",
}: CyberCardProps) {
	// Clip path for 16px cut corners
	const clipPathStyle =
		"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";

	// Border gradients based on variant
	const borderGradient = {
		default: "from-zinc-800/50 to-zinc-900/50",
		glow: "from-emerald-500/50 to-emerald-900/20",
		alert: "from-red-500/50 to-red-900/20",
	};

	return (
		<div
			className={cn(
				"p-px bg-linear-to-br relative group transition-all duration-300",
				borderGradient[variant],
				className,
			)}
			style={{ clipPath: clipPathStyle }}
		>
			<div
				className="bg-zinc-950/90 backdrop-blur-sm h-full w-full p-6 transition-colors duration-300 group-hover:bg-zinc-950/80"
				style={{ clipPath: clipPathStyle }}
			>
				{children}
			</div>
		</div>
	);
}
