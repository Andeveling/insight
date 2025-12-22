import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "ghost" | "destructive";
	size?: "sm" | "md" | "lg";
}

export const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
	(
		{ className, variant = "primary", size = "md", children, ...props },
		ref,
	) => {
		// Clip path for 8px cut corners
		const clipPathStyle =
			"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";

		const variants = {
			primary: {
				outer:
					"from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600",
				inner: "bg-zinc-950/80 hover:bg-emerald-950/30 text-emerald-50",
			},
			secondary: {
				outer:
					"from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700",
				inner: "bg-zinc-950/90 hover:bg-zinc-900/90 text-zinc-100",
			},
			ghost: {
				outer:
					"from-transparent to-transparent hover:from-zinc-800 hover:to-zinc-800",
				inner:
					"bg-transparent hover:bg-zinc-900/50 text-zinc-300 hover:text-white",
			},
			destructive: {
				outer: "from-red-600 to-red-800 hover:from-red-500 hover:to-red-700",
				inner: "bg-zinc-950/80 hover:bg-red-950/30 text-red-50",
			},
		};

		const sizes = {
			sm: "px-3 py-1.5 text-xs",
			md: "px-5 py-2.5 text-sm",
			lg: "px-8 py-3 text-base",
		};

		return (
			<button
				ref={ref}
				className={cn(
					"relative group p-px transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none bg-linear-to-br",
					variants[variant].outer,
					className,
				)}
				style={{ clipPath: clipPathStyle }}
				{...props}
			>
				<div
					className={cn(
						"relative flex items-center justify-center font-bold tracking-wider uppercase backdrop-blur-sm transition-colors duration-200 overflow-hidden",
						variants[variant].inner,
						sizes[size],
					)}
					style={{ clipPath: clipPathStyle }}
				>
					{/* Scanning Line Effect */}
					<div className="absolute inset-x-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent animate-scan pointer-events-none" />
					
					<div className="relative z-10 flex items-center justify-center gap-2">
						{children}
					</div>
				</div>
			</button>
		);
	},
);

CyberButton.displayName = "CyberButton";
