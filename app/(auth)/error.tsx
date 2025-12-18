"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, LogIn } from "lucide-react";
import Link from "next/link";

/**
 * Auth route group error UI
 * Catches errors in authentication flows with specific recovery options
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
export default function AuthError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error("Authentication error:", error);
	}, [error]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4">
			<div className="w-full max-w-md space-y-6 text-center">
				<div className="flex justify-center">
					<div className="rounded-full bg-destructive/10 p-4">
						<AlertCircle className="size-12 text-destructive" />
					</div>
				</div>

				<div className="space-y-2">
					<h1 className="text-2xl font-bold tracking-tight">
						Error de autenticación
					</h1>
					<p className="text-sm text-muted-foreground">
						Ha ocurrido un error durante el proceso de autenticación.
					</p>
				</div>

				{error.message && (
					<div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
						<p className="text-sm font-mono text-destructive">
							{error.message}
						</p>
					</div>
				)}

				<div className="flex flex-col gap-3">
					<button
						onClick={reset}
						className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					>
						<RefreshCw className="size-4" />
						Intentar nuevamente
					</button>

					<Link
						href="/login"
						className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					>
						<LogIn className="size-4" />
						Volver al inicio de sesión
					</Link>
				</div>
			</div>
		</div>
	);
}
