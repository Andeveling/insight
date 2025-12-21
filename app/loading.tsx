import { Spinner } from "@/components/ui/spinner";

/**
 * Root loading UI component
 * Displayed while page segments are loading
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/loading
 */
export default function Loading() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background relative selection:bg-primary/30">
			{/* Technical Background */}
			<div className="fixed inset-0 z-0 opacity-[0.03] bg-grid-tech" />
			<div className="fixed top-0 left-0 w-full h-px bg-primary/20 z-10 animate-scan" />
			
			<div className="flex flex-col items-center gap-6 relative z-10">
				<div 
					className="w-16 h-16 flex items-center justify-center bg-primary/10 text-primary border border-primary/20 relative animate-pulse"
					style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
				>
					<div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin" />
				</div>
				
				<div className="flex flex-col items-center gap-1">
					<div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">SYSTEM_BUSY</div>
					<div className="h-px w-32 bg-border relative overflow-hidden">
						<div className="absolute top-0 left-0 h-full bg-primary animate-[bar-grow_2s_ease-in-out_infinite]" />
					</div>
					<p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">
						ACCEDIENDO_A_DATOS_
					</p>
				</div>
			</div>

			{/* Corner Technical Accents */}
			<div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-primary/20" />
			<div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-primary/20" />
		</div>
	);
}
