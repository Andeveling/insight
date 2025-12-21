import { Ghost } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center bg-background relative selection:bg-primary/30 overflow-hidden p-6 md:p-10">
			{/* HUD Background */}
			<div className="fixed inset-0 z-0 opacity-[0.03] bg-grid-tech" />
			<div className="fixed top-0 left-0 w-full h-px bg-primary/20 z-10 animate-scan" />
			
			<div className="w-full max-w-md space-y-8 relative z-10 text-center">
				<div className="flex justify-center">
					<div 
						className="w-20 h-20 p-px bg-primary/20"
						style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
					>
						<div 
							className="w-full h-full flex items-center justify-center bg-primary/5 text-primary"
							style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
						>
							<Ghost className="size-10 drop-shadow-[0_0_8px_currentColor] animate-pulse" />
						</div>
					</div>
				</div>

				<div className="space-y-3">
					<div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">NODE_NOT_FOUND_404</div>
					<h1 className="text-3xl font-black tracking-tighter uppercase">Ruta_Inexistente</h1>
					<p className="text-xs font-bold text-muted-foreground uppercase tracking-wider max-w-[320px] mx-auto leading-relaxed">
						El segmento de datos solicitado no ha sido localizado en el índice central_
					</p>
				</div>

				<div className="pt-4">
					<Link href="/">
						<button 
							className="group relative px-8 py-4 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-primary/90 active:scale-95"
							style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}
						>
							Retornar_al_Core
						</button>
					</Link>
				</div>
			</div>

			{/* Corner Technical Accents */}
			<div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-primary/20" />
			<div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-primary/20" />
		</div>
	);
}
