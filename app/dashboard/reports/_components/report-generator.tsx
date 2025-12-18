"use client";

import {
	CheckCircleIcon,
	FileTextIcon,
	RefreshCwIcon,
	SparklesIcon,
	XCircleIcon,
} from "lucide-react";
import { useState, useTransition } from "react";
import { Loader } from "./loader";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export interface ReportGeneratorProps {
	type: "individual" | "team";
	entityId: string;
	entityName: string;
	hasExistingReport: boolean;
	lastGeneratedAt?: Date;
	onGenerate: (
		entityId: string,
		forceRegenerate: boolean,
	) => Promise<{
		success: boolean;
		error?: string;
		regenerateMessage?: string;
	}>;
	onViewReport?: () => void;
}

export function ReportGenerator({
	type,
	entityId,
	entityName,
	hasExistingReport,
	lastGeneratedAt,
	onGenerate,
	onViewReport,
}: ReportGeneratorProps) {
	const [isPending, startTransition] = useTransition();
	const [result, setResult] = useState<{
		success: boolean;
		error?: string;
		regenerateMessage?: string;
	} | null>(null);

	const handleGenerate = (forceRegenerate: boolean) => {
		setResult(null);
		startTransition(async () => {
			const res = await onGenerate(entityId, forceRegenerate);
			setResult(res);
		});
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-3">
					<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
						<SparklesIcon className="size-6 text-primary" />
					</div>
					<div>
						<CardTitle>
							{type === "individual" ? "Reporte Personal" : "Reporte de Equipo"}
						</CardTitle>
						<CardDescription>
							Análisis de {type === "individual" ? "fortalezas" : "equipo"} con
							IA para {entityName}
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Model Info */}
				<p className="text-xs text-muted-foreground">
					Los reportes se generan con GPT-4o de OpenAI. Solo puedes regenerar
					cada 30 días o si cambian tus fortalezas.
				</p>

				{/* Status */}
				{hasExistingReport && (
					<div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-600">
						<CheckCircleIcon className="size-4" />
						<span>
							Reporte disponible
							{lastGeneratedAt && (
								<> · Generado el {formatDate(lastGeneratedAt)}</>
							)}
						</span>
					</div>
				)}

				{/* Regenerate Message */}
				{result?.regenerateMessage && (
					<div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-600">
						<span>{result.regenerateMessage}</span>
					</div>
				)}

				{/* Result */}
				{result && !result.regenerateMessage && (
					<div
						className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
							result.success
								? "bg-green-500/10 text-green-600"
								: "bg-destructive/10 text-destructive"
						}`}
					>
						{result.success ? (
							<>
								<CheckCircleIcon className="size-4" />
								<span>¡Reporte generado exitosamente!</span>
							</>
						) : (
							<>
								<XCircleIcon className="size-4" />
								<span>{result.error || "Error al generar el reporte"}</span>
							</>
						)}
					</div>
				)}

				{/* Loading State */}
				{isPending && (
					<div className="flex items-center gap-3 rounded-lg bg-primary/5 px-4 py-3">
						<Loader size={20} />
						<div>
							<p className="font-medium text-sm">Generando reporte...</p>
							<p className="text-xs text-muted-foreground">
								Esto puede tomar 30-60 segundos
							</p>
						</div>
					</div>
				)}
			</CardContent>
			<CardFooter className="flex gap-2">
				{hasExistingReport ? (
					<>
						<Button
							variant="outline"
							onClick={() => handleGenerate(true)}
							disabled={isPending}
						>
							<RefreshCwIcon className="mr-2 size-4" />
							Regenerar
						</Button>
						{onViewReport && (
							<Button onClick={onViewReport} disabled={isPending}>
								<FileTextIcon className="mr-2 size-4" />
								Ver Reporte
							</Button>
						)}
					</>
				) : (
					<Button
						onClick={() => handleGenerate(false)}
						disabled={isPending}
						className="w-full"
					>
						{isPending ? (
							<>
								<Loader size={16} className="mr-2" />
								Generando...
							</>
						) : (
							<>
								<SparklesIcon className="mr-2 size-4" />
								Generar Reporte
							</>
						)}
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
