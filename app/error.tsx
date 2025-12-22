"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

/**
 * Root error UI component
 * Catches errors in the app and provides recovery options
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error("Application error:", error);
	}, [error]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background relative selection:bg-destructive/30 overflow-hidden px-4">
			{/* HUD Background */}
			<div className="fixed inset-0 z-0 opacity-[0.03] bg-grid-tech" />
			<div className="fixed top-0 left-0 w-full h-px bg-destructive/20 z-10 animate-scan" />

			<div className="w-full max-w-md space-y-8 relative z-10 text-center">
				<div className="flex justify-center">
					<div
						className="w-20 h-20 p-px bg-destructive/30"
						style={{
							clipPath:
								"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
						}}
					>
						<div
							className="w-full h-full flex items-center justify-center bg-destructive/10 text-destructive relative animate-pulse"
							style={{
								clipPath:
									"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
							}}
						>
							<AlertCircle className="size-10 drop-shadow-[0_0_8px_currentColor]" />
						</div>
					</div>
				</div>

				<div className="space-y-3">
					<div className="text-[10px] font-black uppercase tracking-[0.4em] text-destructive/60">
						CRITICAL_EXCEPTION_DETECTED
					</div>
					<h1 className="text-3xl font-black tracking-tighter uppercase">
						Protocolo_Fallido
					</h1>
					<p className="text-xs font-bold text-muted-foreground uppercase tracking-wider max-w-[300px] mx-auto leading-relaxed">
						Se ha producido una interrupción en el flujo de datos_
					</p>
				</div>

				{error.message && (
					<div
						className="relative bg-destructive/5 border-l-2 border-destructive p-4 text-left"
						style={{
							clipPath:
								"polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
						}}
					>
						<div className="flex items-center gap-2 mb-2">
							<div className="w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
							<span className="text-[9px] font-black uppercase tracking-widest text-destructive">
								ERROR_LOG_OUTPUT
							</span>
						</div>
						<p className="text-[10px] font-mono font-bold text-destructive/80 break-all">
							{error.message}
						</p>
					</div>
				)}

				<button
					onClick={reset}
					className="group relative px-8 py-4 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-primary/90 active:scale-95"
					style={{
						clipPath:
							"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
					}}
				>
					<div className="flex items-center gap-3">
						<RefreshCw className="size-4 group-hover:rotate-180 transition-transform duration-500" />
						Reiniciar_Sistema
					</div>
				</button>
			</div>

			{/* Corner Technical Accents */}
			<div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-destructive/20" />
			<div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-destructive/20" />
		</div>
	);
}
