import { Spinner } from "@/components/ui/spinner";

/**
 * Root loading UI component
 * Displayed while page segments are loading
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/loading
 */
export default function Loading() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<div className="flex flex-col items-center gap-4">
				<Spinner className="size-8 text-primary" />
				<p className="text-sm text-muted-foreground">Cargando...</p>
			</div>
		</div>
	);
}
