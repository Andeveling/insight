import { Spinner } from "@/components/ui/spinner";

/**
 * Auth route group loading UI
 * Displayed while authentication pages are loading
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/loading
 */
export default function AuthLoading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Spinner className="size-8 text-primary" />
                <p className="text-sm text-muted-foreground">
                    Cargando autenticación...
                </p>
            </div>
        </div>
    );
}
