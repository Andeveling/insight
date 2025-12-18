"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DevelopmentErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

/**
 * Development Feature Error Boundary
 *
 * Catches errors in the development feature and provides
 * a user-friendly error message with retry option.
 */
export default function DevelopmentError({
	error,
	reset,
}: DevelopmentErrorProps) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error("Development feature error:", error);
	}, [error]);

	return (
		<div className="flex min-h-[400px] flex-col items-center justify-center p-6">
			<div className="flex flex-col items-center gap-4 text-center">
				{/* Error Icon */}
				<div className="rounded-full bg-destructive/10 p-4">
					<AlertTriangle className="h-8 w-8 text-destructive" />
				</div>

				{/* Error Message */}
				<div className="space-y-2">
					<h2 className="text-xl font-semibold">Algo salió mal</h2>
					<p className="text-sm text-muted-foreground max-w-md">
						Ocurrió un error al cargar esta sección. Por favor intenta de nuevo.
					</p>
					{error.digest && (
						<p className="text-xs text-muted-foreground font-mono">
							Código: {error.digest}
						</p>
					)}
				</div>

				{/* Retry Button */}
				<Button onClick={reset} variant="outline" className="gap-2">
					<RefreshCcw className="h-4 w-4" />
					Intentar de nuevo
				</Button>
			</div>
		</div>
	);
}
