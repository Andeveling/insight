import { cn } from "@/lib/cn";

interface CyberBadgeProps {
	children: React.ReactNode;
	variant?: "emerald" | "amber" | "purple" | "indigo" | "zinc";
	className?: string;
}

export function CyberBadge({
	children,
	variant = "zinc",
	className,
}: CyberBadgeProps) {
	const variants = {
		emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
		amber: "border-amber-500/30 bg-amber-500/10 text-amber-400",
		purple: "border-purple-500/30 bg-purple-500/10 text-purple-400",
		indigo: "border-indigo-500/30 bg-indigo-500/10 text-indigo-400",
		zinc: "border-zinc-700 bg-zinc-800/50 text-zinc-400",
	};

	return (
		<span
			className={cn(
				"inline-flex items-center px-2.5 py-0.5 text-xs font-medium border uppercase tracking-wider",
				variants[variant],
				className,
			)}
			style={{
				clipPath:
					"polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
			}}
		>
			{children}
		</span>
	);
}
