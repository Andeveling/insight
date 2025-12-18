import { Ghost } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export default function NotFound() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Ghost className="size-6" />
					</EmptyMedia>
					<EmptyTitle>404 - Página no encontrada</EmptyTitle>
					<EmptyDescription>
						Lo sentimos, no pudimos encontrar la página que estás buscando.
						Puede que haya sido eliminada o que la dirección sea incorrecta.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button asChild>
						<Link href="/">Volver al inicio</Link>
					</Button>
				</EmptyContent>
			</Empty>
		</div>
	);
}
