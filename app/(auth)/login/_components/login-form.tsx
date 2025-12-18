"use client";

import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useLoginForm } from "../_hooks/use-login-form";
import { Shield, Sparkles, Trophy } from "lucide-react";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { form, onSubmit, serverMessage } = useLoginForm();

	return (
		<div className={cn("flex flex-col gap-6 w-full", className)} {...props}>
			{/* Floating decorative elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-20 right-10 w-40 h-40 bg-chart-2/10 rounded-full blur-3xl animate-pulse delay-1000" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gamified-glow rounded-full blur-3xl animate-pulse delay-500" />
			</div>

			<Card className="relative overflow-hidden border-gamified-border bg-gamified-surface/95 backdrop-blur-xl shadow-2xl max-w-md mx-auto w-full">
				{/* Glow effect */}
				<div className="absolute inset-0 bg-linear-to-br from-gamified-gradient-from/5 via-transparent to-gamified-gradient-to/5 pointer-events-none" />

				{/* Top accent bar */}
				<div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary to-transparent" />

				<CardContent className="relative p-0">
					<Form {...form}>
						<form onSubmit={onSubmit} className="p-8 md:p-10">
							<div className="flex flex-col gap-8">
								{/* Logo and Title Section */}
								<div className="flex flex-col items-center gap-4 text-center">
									<div className="relative">
										{/* Hexagonal badge container */}
										<div className="relative w-20 h-20 flex items-center justify-center">
											<Shield className="w-16 h-16 text-primary drop-shadow-[0_0_15px_var(--color-primary)]" />
											<Sparkles className="absolute w-4 h-4 text-primary top-0 right-0 animate-pulse" />
										</div>
									</div>

									<div className="space-y-2">
										<h1 className="text-3xl font-bold bg-linear-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent animate-gradient-x">
											Bienvenido de Nuevo
										</h1>
										<p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
											<Trophy className="w-4 h-4 text-primary" />
											<span>Prepárate para desbloquear tu potencial</span>
										</p>
									</div>
								</div>

								{/* Error Message */}
								{serverMessage && (
									<div className="relative rounded-lg bg-destructive/10 border border-destructive/30 p-4 backdrop-blur-sm">
										<div className="absolute inset-0 bg-linear-to-r from-destructive/5 to-transparent rounded-lg" />
										<p className="relative text-destructive text-sm font-medium">
											{serverMessage}
										</p>
									</div>
								)}

								{/* Form Fields */}
								<div className="space-y-5">
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-foreground font-semibold">
													Email
												</FormLabel>
												<FormControl>
													<Input
														placeholder="jugador@insight.com"
														className="h-12 bg-background/50 border-gamified-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<div className="flex items-center justify-between">
													<FormLabel className="text-foreground font-semibold">
														Contraseña
													</FormLabel>
													<a
														href="#"
														className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
													>
														¿Olvidaste tu contraseña?
													</a>
												</div>
												<FormControl>
													<Input
														type="password"
														className="h-12 bg-background/50 border-gamified-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Submit Button */}
								<Button
									type="submit"
									size="lg"
									className="w-full h-12 bg-linear-to-r from-primary/5 to-primary/5 hover:from-primary/5 hover:to-primary/90 text-primary-foreground font-bold text-base shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
									disabled={form.formState.isSubmitting}
								>
									{form.formState.isSubmitting ? (
										<span className="flex items-center gap-2">
											<div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
											Iniciando sesión...
										</span>
									) : (
										<span className="flex items-center gap-2">
											<Shield className="w-4 h-4" />
											Iniciar Sesión
										</span>
									)}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>

				{/* Bottom accent bar */}
				<div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-chart-2 to-transparent" />
			</Card>

			{/* Footer Text */}
			<div className="relative text-balance text-center text-xs text-muted-foreground max-w-md mx-auto">
				<p className="[&_a]:text-primary [&_a]:font-medium [&_a]:hover:underline [&_a]:underline-offset-4 [&_a]:transition-colors">
					Al hacer clic en continuar, aceptas nuestros{" "}
					<a href="#">Términos de servicio</a> y{" "}
					<a href="#">Política de privacidad</a>.
				</p>
			</div>
		</div>
	);
}
