/**
 * SubTeam Form
 *
 * Form for creating or editing a sub-team.
 * Note: This component skips React Compiler memoization due to react-hook-form's watch() API.
 *
 * @module app/dashboard/team/[teamId]/sub-teams/_components/subteam-form
 */

"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { MatchScoreBreakdown } from "./match-score-breakdown";
import { MatchScoreDisplay } from "./match-score-display";
import { MemberSelector } from "./member-selector";
import { ProjectTypeSelector } from "./project-type-selector";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { SubTeamMember } from "@/lib/types";
import type { ProjectTypeOption } from "@/lib/types/project-type.types";

import { createSubTeam } from "../_actions/create-subteam";
import { updateSubTeamAction } from "../_actions/update-subteam";
import { useMatchScore } from "../_hooks/use-match-score";
import {
	createSubTeamSchema,
	updateSubTeamSchema,
	type CreateSubTeamFormData,
	SUBTEAM_CONSTRAINTS,
} from "../_schemas/subteam.schema";

// ============================================================
// Types
// ============================================================

interface SubTeamFormBaseProps {
	teamId: string;
	members: SubTeamMember[];
	projectTypes: ProjectTypeOption[];
}

interface CreateFormProps extends SubTeamFormBaseProps {
	mode: "create";
}

interface EditFormProps extends SubTeamFormBaseProps {
	mode: "edit";
	subTeamId: string;
	defaultValues: {
		name: string;
		description: string | null;
		projectTypeProfileId: string;
		members: string[];
	};
}

type SubTeamFormProps = CreateFormProps | EditFormProps;

// ============================================================
// Component
// ============================================================

export function SubTeamForm(props: SubTeamFormProps) {
	const { teamId, members, projectTypes, mode } = props;
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	// Default values for edit mode
	const editDefaults = mode === "edit" ? props.defaultValues : undefined;

	// Define form type explicitly to match input requirements
	type FormValues = {
		parentTeamId: string;
		name: string;
		description: string;
		projectTypeProfileId: string;
		members: string[];
	};

	const form = useForm<FormValues>({
		defaultValues: {
			parentTeamId: teamId,
			name: editDefaults?.name || "",
			description: editDefaults?.description || "",
			projectTypeProfileId: editDefaults?.projectTypeProfileId || "",
			members: editDefaults?.members || [],
		},
	});

	// Watch form values for match score calculation
	const watchedMembers = form.watch("members");
	const watchedProjectType = form.watch("projectTypeProfileId");

	// Use match score hook for real-time preview
	const { result: matchScoreResult, isCalculating } = useMatchScore({
		teamId,
		projectTypeProfileId: watchedProjectType,
		memberIds: watchedMembers,
		debounceMs: 300,
	});

	const onSubmit = (data: FormValues) => {
		if (mode === "edit") {
			// Edit mode: validate with update schema
			const validationResult = updateSubTeamSchema.safeParse({
				...data,
				id: props.subTeamId,
			});
			if (!validationResult.success) {
				const firstError = validationResult.error.issues[0];
				toast.error(firstError?.message || "Datos inválidos");
				return;
			}

			startTransition(async () => {
				const result = await updateSubTeamAction(validationResult.data);

				if (result.success) {
					toast.success("Sub-equipo actualizado exitosamente", {
						description: result.data?.matchScore
							? `Match Score: ${Math.round(result.data.matchScore)}%`
							: undefined,
					});
					router.push(`/dashboard/team/${teamId}/sub-teams/${props.subTeamId}`);
					router.refresh();
				} else {
					toast.error("Error al actualizar sub-equipo", {
						description: result.error,
					});
				}
			});
		} else {
			// Create mode: validate with create schema
			const validationResult = createSubTeamSchema.safeParse(data);
			if (!validationResult.success) {
				const firstError = validationResult.error.issues[0];
				toast.error(firstError?.message || "Datos inválidos");
				return;
			}

			startTransition(async () => {
				const result = await createSubTeam(
					validationResult.data as CreateSubTeamFormData,
				);

				if (result.success) {
					toast.success("Sub-equipo creado exitosamente", {
						description: result.data.matchScore
							? `Match Score: ${Math.round(result.data.matchScore)}%`
							: undefined,
					});
					router.push(`/dashboard/team/${teamId}/sub-teams/${result.data.id}`);
				} else {
					toast.error("Error al crear sub-equipo", {
						description: result.error,
					});
				}
			});
		}
	};

	// Show match score preview when we have enough data
	const showScorePreview = watchedMembers.length >= 2 && watchedProjectType;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{/* Hidden field for teamId */}
				<input type="hidden" {...form.register("parentTeamId")} />

				{/* Name */}
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nombre del sub-equipo</FormLabel>
							<FormControl>
								<Input
									placeholder="Ej: Equipo de Innovación Q1"
									{...field}
									maxLength={SUBTEAM_CONSTRAINTS.NAME_MAX}
								/>
							</FormControl>
							<FormDescription>
								Un nombre descriptivo para identificar este sub-equipo.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Description */}
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Descripción (opcional)</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Describe el propósito o el proyecto de este sub-equipo..."
									className="resize-none"
									{...field}
									value={field.value || ""}
									maxLength={SUBTEAM_CONSTRAINTS.DESCRIPTION_MAX}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Project Type */}
				<FormField
					control={form.control}
					name="projectTypeProfileId"
					render={({ field }) => (
						<FormItem>
							<ProjectTypeSelector
								projectTypes={projectTypes}
								selectedId={field.value}
								onChange={field.onChange}
								error={form.formState.errors.projectTypeProfileId?.message}
							/>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Members */}
				<FormField
					control={form.control}
					name="members"
					render={({ field }) => (
						<FormItem>
							<MemberSelector
								members={members}
								selectedIds={field.value}
								onChange={field.onChange}
								error={form.formState.errors.members?.message}
							/>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Match Score Preview */}
				{showScorePreview && (
					<Card>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="text-lg">Match Score Preview</CardTitle>
									<CardDescription>
										Compatibilidad estimada del equipo con el tipo de proyecto
									</CardDescription>
								</div>
								{isCalculating ? (
									<Spinner className="h-6 w-6" />
								) : matchScoreResult ? (
									<MatchScoreDisplay
										score={matchScoreResult.totalScore}
										size="md"
										showLabel={true}
									/>
								) : null}
							</div>
						</CardHeader>
						{matchScoreResult && (
							<CardContent className="pt-0">
								<MatchScoreBreakdown
									factors={matchScoreResult.factors}
									gaps={matchScoreResult.gaps}
									recommendations={matchScoreResult.recommendations}
									defaultOpen={false}
								/>
							</CardContent>
						)}
					</Card>
				)}

				{/* Actions */}
				<div className="flex items-center justify-end gap-4 pt-4 border-t">
					<Button
						type="button"
						variant="outline"
						onClick={() => router.back()}
						disabled={isPending}
					>
						Cancelar
					</Button>
					<Button type="submit" disabled={isPending}>
						{isPending && <Spinner className="mr-2 h-4 w-4" />}
						{mode === "edit" ? "Guardar Cambios" : "Crear Sub-Equipo"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
