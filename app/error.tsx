"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

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
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-6 text-center">
                <div className="flex justify-center">
                    <div className="rounded-full bg-destructive/10 p-4">
                        <AlertCircle className="size-12 text-destructive" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Algo salió mal
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
                    </p>
                </div>

                {error.message && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                        <p className="text-sm font-mono text-destructive">
                            {error.message}
                        </p>
                    </div>
                )}

                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    <RefreshCw className="size-4" />
                    Intentar nuevamente
                </button>
            </div>
        </div>
    );
}
