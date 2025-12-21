"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Pencil, Plus, Save, X } from "lucide-react";
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

	const clipPath16 = "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
	const clipPath8 = "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";

	return (
		<div className="h-full">
			<AnimatePresence mode="wait">
				{!isEditing ? (
					<motion.div
						key="view"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 20 }}
						className="h-full"
					>
						<div 
							className="p-px bg-border hover:bg-primary/50 transition-colors duration-500 h-full"
							style={{ clipPath: clipPath16 }}
						>
							<div 
								className="bg-background/95 backdrop-blur-md p-6 sm:p-8 h-full relative overflow-hidden"
								style={{ clipPath: clipPath16 }}
							>
								{/* Decorative tech elements */}
								<div className="absolute top-0 right-0 p-4 opacity-20">
									<div className="text-[8px] font-black uppercase tracking-widest text-primary">
										Profile_Protocol {"//"} V1.0
									</div>
								</div>

								<div className="flex flex-row items-center justify-between mb-8">
									<div className="space-y-1">
										<h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
											<span className="h-1 w-4 bg-primary" />
											Usuario_Bio_Data
										</h3>
										<h2 className="text-3xl font-black uppercase tracking-tighter text-foreground">
											Mi Perfil
										</h2>
									</div>
									<button
										onClick={() => setIsEditing(true)}
										className="p-3 bg-muted border border-border text-foreground hover:text-primary hover:border-primary/50 transition-all"
										style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
									>
										<Pencil className="h-4 w-4" />
									</button>
								</div>

								<div className="space-y-6">
									<div className="grid gap-2 group/field">
										<span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover/field:text-primary transition-colors">
											Carrera / Profesión
										</span>
										<div className="p-3 bg-muted/30 border border-border/50 text-sm font-bold uppercase tracking-tight text-foreground">
											{initialData?.career || "No especificado"}
										</div>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
										<div className="grid gap-2 group/field">
											<span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover/field:text-primary transition-colors">
												Edad
											</span>
											<div className="p-3 bg-muted/30 border border-border/50 text-sm font-bold uppercase tracking-tight text-foreground">
												{initialData?.age || "--"}
											</div>
										</div>
										<div className="grid gap-2 group/field">
											<span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover/field:text-primary transition-colors">
												Género
											</span>
											<div className="p-3 bg-muted/30 border border-border/50 text-sm font-bold uppercase tracking-tight text-foreground">
												{initialData?.gender === "M"
													? "Masculino"
													: initialData?.gender === "F"
														? "Femenino"
														: initialData?.gender === "O"
															? "Otro"
															: "No especificado"}
											</div>
										</div>
									</div>

									<div className="grid gap-2 group/field">
										<span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover/field:text-primary transition-colors">
											Sobre mí
										</span>
										<div 
											className="p-4 bg-muted/30 border border-border/50 text-xs font-medium text-muted-foreground whitespace-pre-wrap leading-relaxed"
											style={{ clipPath: clipPath8 }}
										>
											{initialData?.description || "Inicia actualización de biografía..."}
										</div>
									</div>

									<div className="grid gap-3 group/field">
										<span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover/field:text-primary transition-colors">
											Intereses / Hobbies
										</span>
										<div className="flex flex-wrap gap-2">
											{initialData?.hobbies && initialData.hobbies.length > 0 ? (
												initialData.hobbies.map((hobby) => (
													<div 
														key={hobby}
														className="px-3 py-1.5 bg-primary/5 border border-primary/20 text-[10px] font-black uppercase tracking-tighter text-primary"
														style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
													>
														{hobby}
													</div>
												))
											) : (
												<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">
													Sin intereses registrados
												</span>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				) : (
					<motion.div
						key="edit"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						className="h-full"
					>
						<div 
							className="p-px bg-primary/30 h-full shadow-[0_0_20px_rgba(var(--primary),0.05)]"
							style={{ clipPath: clipPath16 }}
						>
							<div 
								className="bg-background p-6 sm:p-8 h-full relative overflow-hidden"
								style={{ clipPath: clipPath16 }}
							>
								<div className="flex flex-row items-center justify-between mb-8">
									<div className="space-y-1">
										<h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
											<span className="h-1 w-4 bg-primary animate-pulse" />
											Edit_Terminal {"//"} Activo
										</h3>
										<h2 className="text-3xl font-black uppercase tracking-tighter text-foreground">
											Editar Perfil
										</h2>
									</div>
									<button
										onClick={() => setIsEditing(false)}
										className="p-3 bg-muted border border-border text-foreground hover:text-destructive hover:border-destructive/50 transition-all"
										style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
									>
										<X className="h-4 w-4" />
									</button>
								</div>

								<div className="mt-6">
									<Form {...form}>
										<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
											<FormField
												control={form.control}
												name="career"
												render={({ field }) => (
													<FormItem className="space-y-2">
														<FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Carrera / Profesión</FormLabel>
														<FormControl>
															<Input
																className="bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-0 text-sm font-bold uppercase tracking-tight h-12"
																style={{ clipPath: clipPath8 }}
																placeholder="Ej. Desarrollador de Software"
																{...field}
															/>
														</FormControl>
														<FormMessage className="text-[10px] font-bold uppercase tracking-tighter" />
													</FormItem>
												)}
											/>

											<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
												<FormField
													control={form.control}
													name="age"
													render={({ field }) => (
														<FormItem className="space-y-2">
															<FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Edad</FormLabel>
															<FormControl>
																<Input
																	type="number"
																	className="bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-0 text-sm font-bold h-12"
																	style={{ clipPath: clipPath8 }}
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
															<FormMessage className="text-[10px] font-bold uppercase tracking-tighter" />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name="gender"
													render={({ field }) => (
														<FormItem className="space-y-2">
															<FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Género</FormLabel>
															<Select
																onValueChange={field.onChange}
																defaultValue={field.value}
															>
																<FormControl>
																	<SelectTrigger 
																		className="bg-muted/50 border-border/50 focus:ring-0 h-12 text-sm font-bold uppercase tracking-tight"
																		style={{ clipPath: clipPath8 }}
																	>
																		<SelectValue placeholder="Seleccionar..." />
																	</SelectTrigger>
																</FormControl>
																<SelectContent className="bg-background border-border">
																	<SelectItem value="M" className="text-[10px] font-black uppercase py-3">Masculino</SelectItem>
																	<SelectItem value="F" className="text-[10px] font-black uppercase py-3">Femenino</SelectItem>
																	<SelectItem value="O" className="text-[10px] font-black uppercase py-3">Otro</SelectItem>
																</SelectContent>
															</Select>
															<FormMessage className="text-[10px] font-bold uppercase tracking-tighter" />
														</FormItem>
													)}
												/>
											</div>

											<FormField
												control={form.control}
												name="description"
												render={({ field }) => (
													<FormItem className="space-y-2">
														<FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Sobre mí</FormLabel>
														<FormControl>
															<Textarea
																placeholder="Protocolo biográfico de usuario..."
																className="resize-none min-h-[120px] bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-0 text-xs font-medium leading-relaxed"
																style={{ clipPath: clipPath8 }}
																{...field}
															/>
														</FormControl>
														<FormMessage className="text-[10px] font-bold uppercase tracking-tighter" />
													</FormItem>
												)}
											/>

											<div className="space-y-3">
												<FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Intereses / Hobbies</FormLabel>
												<div className="flex gap-2">
													<Input
														value={hobbyInput}
														onChange={(e) => setHobbyInput(e.target.value)}
														className="bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-0 text-xs h-10"
														style={{ clipPath: clipPath8 }}
														placeholder="Agregar módulo y presiona Enter"
														onKeyDown={(e) => {
															if (e.key === "Enter") {
																e.preventDefault();
																addHobby();
															}
														}}
													/>
													<Button 
														type="button" 
														onClick={addHobby} 
														variant="secondary"
														className="h-10 px-4 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20"
														style={{ clipPath: clipPath8 }}
													>
														<Plus className="h-4 w-4" />
													</Button>
												</div>
												<div className="flex flex-wrap gap-2 pt-2">
													{hobbies.map((hobby) => (
														<div 
															key={hobby}
															className="flex items-center gap-2 pl-3 pr-1 py-1 bg-muted border border-border text-[9px] font-black uppercase tracking-widest text-foreground group/tag"
															style={{ clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)" }}
														>
															{hobby}
															<button
																type="button"
																onClick={() => removeHobby(hobby)}
																className="p-1 hover:bg-destructive/20 hover:text-destructive transition-colors rounded-sm"
															>
																<X className="h-3 w-3" />
															</button>
														</div>
													))}
												</div>
											</div>

											<div className="flex justify-end gap-3 pt-6">
												<button
													type="button"
													onClick={() => setIsEditing(false)}
													className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
													disabled={isSaving}
												>
													Cancelar
												</button>
												<button
													type="submit"
													disabled={isSaving}
													className="relative px-8 py-3 bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 overflow-hidden group/submit"
													style={{ clipPath: clipPath8 }}
												>
													<div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/submit:translate-x-full transition-transform duration-700" />
													<div className="flex items-center gap-2 text-[10px] relative z-10">
														{isSaving ? (
															<Loader2 className="h-3 w-3 animate-spin" />
														) : (
															<Save className="h-3 w-3" />
														)}
														{isSaving ? "Guardando..." : "Guardar Cambios"}
													</div>
												</button>
											</div>
										</form>
									</Form>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
