"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, X } from "lucide-react";
import { useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { updateProfile } from "../_actions";
import {
	type ProfileFormValues,
	profileSchema,
} from "../_schemas/profile.schema";

interface EditProfileCardProps {
	initialData?: ProfileFormValues | null;
}

export function EditProfileCard({ initialData }: EditProfileCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema) as Resolver<ProfileFormValues>,
		defaultValues: {
			career: initialData?.career || "",
			age: initialData?.age || undefined,
			gender: initialData?.gender || undefined,
			description: initialData?.description || "",
			hobbies: initialData?.hobbies || [],
		},
	});

	async function onSubmit(data: ProfileFormValues) {
		setIsSaving(true);
		try {
			await updateProfile(data);
			toast.success("Perfil actualizado correctamente");
			setIsEditing(false);
		} catch (error) {
			if (error instanceof Error) {
				if (error.message === "NOT_AUTHENTICATED") {
					toast.error("Tu sesión expiró. Vuelve a iniciar sesión.");
				} else if (error.message === "INVALID_INPUT") {
					toast.error("Revisa los campos e inténtalo de nuevo.");
				} else {
					toast.error("Error al actualizar el perfil");
				}
			} else {
				toast.error("Error al actualizar el perfil");
			}
			console.error(error);
		} finally {
			setIsSaving(false);
		}
	}

	// Hobbies handling
	const [hobbyInput, setHobbyInput] = useState("");
	const hobbies = form.watch("hobbies") || [];

	const addHobby = () => {
		if (hobbyInput.trim()) {
			const currentHobbies = form.getValues("hobbies") || [];
			if (!currentHobbies.includes(hobbyInput.trim())) {
				form.setValue("hobbies", [...currentHobbies, hobbyInput.trim()]);
			}
			setHobbyInput("");
		}
	};

	const removeHobby = (hobby: string) => {
		const currentHobbies = form.getValues("hobbies") || [];
		form.setValue(
			"hobbies",
			currentHobbies.filter((h) => h !== hobby),
		);
	};

	if (!isEditing) {
		return (
			<Card className="relative h-full overflow-hidden border bg-gamified-surface">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 bg-linear-to-br from-gamified-gradient-from/10 to-gamified-gradient-to/10"
				/>
				<CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-xl font-bold">Mi Perfil</CardTitle>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsEditing(true)}
					>
						<Pencil className="h-4 w-4" />
					</Button>
				</CardHeader>
				<CardContent className="relative space-y-4 pt-4">
					<div className="grid gap-1">
						<span className="text-sm font-medium text-muted-foreground">
							Carrera / Profesión
						</span>
						<p className="text-sm font-medium">
							{initialData?.career || "No especificado"}
						</p>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="grid gap-1">
							<span className="text-sm font-medium text-muted-foreground">
								Edad
							</span>
							<p className="text-sm font-medium">
								{initialData?.age || "No especificado"}
							</p>
						</div>
						<div className="grid gap-1">
							<span className="text-sm font-medium text-muted-foreground">
								Género
							</span>
							<p className="text-sm font-medium">
								{initialData?.gender === "M"
									? "Masculino"
									: initialData?.gender === "F"
										? "Femenino"
										: initialData?.gender === "O"
											? "Otro"
											: "No especificado"}
							</p>
						</div>
					</div>
					<div className="grid gap-1">
						<span className="text-sm font-medium text-muted-foreground">
							Sobre mí
						</span>
						<p className="text-sm text-muted-foreground whitespace-pre-wrap">
							{initialData?.description || "Sin descripción"}
						</p>
					</div>
					<div className="grid gap-2">
						<span className="text-sm font-medium text-muted-foreground">
							Intereses / Hobbies
						</span>
						<div className="flex flex-wrap gap-2">
							{initialData?.hobbies && initialData.hobbies.length > 0 ? (
								initialData.hobbies.map((hobby) => (
									<Badge key={hobby} variant="secondary">
										{hobby}
									</Badge>
								))
							) : (
								<span className="text-sm text-muted-foreground italic">
									Sin intereses agregados
								</span>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="relative h-full overflow-hidden border bg-gamified-surface">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-linear-to-br from-gamified-gradient-from/10 to-gamified-gradient-to/10"
			/>
			<CardHeader className="relative">
				<CardTitle>Editar Perfil</CardTitle>
				<CardDescription>
					Completa tu información para personalizar tu experiencia.
				</CardDescription>
			</CardHeader>
			<CardContent className="relative">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="career"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Carrera / Profesión</FormLabel>
									<FormControl>
										<Input
											placeholder="Ej. Desarrollador de Software"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="age"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Edad</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder="Ej. 30"
												{...field}
												onChange={(e) =>
													field.onChange(
														e.target.value === ""
															? undefined
															: e.target.valueAsNumber,
													)
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="gender"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Género</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Selecciona" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="M">Masculino</SelectItem>
												<SelectItem value="F">Femenino</SelectItem>
												<SelectItem value="O">Otro</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Sobre mí</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Cuéntanos un poco sobre ti..."
											className="resize-none min-h-[100px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="space-y-2">
							<FormLabel>Intereses / Hobbies</FormLabel>
							<div className="flex flex-col sm:flex-row gap-2">
								<Input
									value={hobbyInput}
									onChange={(e) => setHobbyInput(e.target.value)}
									placeholder="Agregar un hobby y presiona Enter"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addHobby();
										}
									}}
								/>
								<Button type="button" onClick={addHobby} variant="secondary">
									Agregar
								</Button>
							</div>
							<div className="flex flex-wrap gap-2 mt-2">
								{hobbies.map((hobby) => (
									<Badge key={hobby} variant="secondary" className="gap-1 pr-1">
										{hobby}
										<button
											type="button"
											onClick={() => removeHobby(hobby)}
											className="hover:bg-muted rounded-full p-0.5"
										>
											<X className="h-3 w-3" />
										</button>
									</Badge>
								))}
							</div>
						</div>

						<div className="flex justify-end gap-2 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsEditing(false)}
								disabled={isSaving}
							>
								Cancelar
							</Button>
							<Button type="submit" disabled={isSaving}>
								{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Guardar Cambios
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
