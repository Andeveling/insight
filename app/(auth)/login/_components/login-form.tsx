"use client";

import { Shield, Sparkles, Trophy } from "lucide-react";
import { motion } from "motion/react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { useLoginForm } from "../_hooks/use-login-form";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const { form, onSubmit, serverMessage } = useLoginForm();

	return (
		<div className={cn("flex flex-col gap-6 w-full relative", className)} {...props}>
			{/* Technical decorative elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-grid-tech" />
				<div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
				<div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-chart-2/5 blur-[100px] rounded-full" />
			</div>

			<div 
				className="relative p-px bg-border/40 max-w-md mx-auto w-full group overflow-hidden"
				style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}
			>
				{/* Inner Surface */}
				<div 
					className="relative bg-background/90 backdrop-blur-xl p-8 md:p-10 h-full w-full"
					style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}
				>
					{/* Decorative Scan Line */}
					<div 
						className="absolute top-0 left-0 w-full h-px bg-primary/20 z-20 pointer-events-none animate-scan"
					/>

					{/* Accent corners */}
					<div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40 pointer-events-none" />
					<div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40 pointer-events-none" />

					<Form {...form}>
						<form onSubmit={onSubmit} className="relative z-10">
							<div className="flex flex-col gap-10">
								{/* Logo and Title Section */}
								<div className="flex flex-col items-center gap-6 text-center">
									<div className="relative">
										{/* Hexagonal container with layered border */}
										<div 
											className="w-16 h-16 p-px bg-primary/30"
											style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
										>
											<div 
												className="w-full h-full flex items-center justify-center bg-primary/10 text-primary"
												style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
											>
												<Shield className="w-8 h-8 drop-shadow-[0_0_8px_currentColor]" />
												<Sparkles className="absolute top-1 right-1 w-3 h-3 animate-pulse opacity-50" />
											</div>
										</div>
									</div>

									<div className="space-y-3">
										<div className="flex flex-col items-center gap-1">
											<span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">SYSTEM_AUTH_V.01</span>
											<h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">
												Insight <span className="text-primary">OS</span>
											</h1>
										</div>
										<p className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-[0.2em] flex items-center justify-center gap-2 border-y border-border/20 py-2">
											<Trophy className="w-3 h-3 text-primary/60" />
											<span>Protocols: Online // Sync: Stable</span>
										</p>
									</div>
								</div>

								{/* Error Message */}
								{serverMessage && (
									<div 
										className="relative bg-destructive/10 border-l-2 border-destructive p-4"
										style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
									>
										<div className="flex items-center gap-2 mb-1">
											<div className="w-1.5 h-1.5 bg-destructive rounded-full" />
											<span className="text-[9px] font-black uppercase tracking-widest text-destructive">AUTH_FAILURE_DETECTED</span>
										</div>
										<p className="text-destructive text-xs font-bold uppercase tracking-tight">
											{serverMessage}
										</p>
									</div>
								)}

								{/* Form Fields */}
								<div className="space-y-6">
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem className="space-y-2">
												<FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
													User_Identification
												</FormLabel>
												<FormControl>
													<div className="relative group/input">
														<Input
															placeholder="user@insight.network"
															className="h-12 bg-background/40 border-border/40 focus:border-primary/50 focus:ring-0 transition-all text-xs font-bold tracking-widest uppercase placeholder:text-muted-foreground/30 placeholder:normal-case"
															style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
															{...field}
														/>
														<div className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-focus-within/input:w-full transition-all duration-500" />
													</div>
												</FormControl>
												<FormMessage className="text-[9px] font-bold uppercase tracking-tight text-destructive ml-1" />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem className="space-y-2">
												<div className="flex items-center justify-between ml-1">
													<FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
														Access_Key
													</FormLabel>
													<a
														href="#"
														className="text-[9px] text-primary/60 hover:text-primary transition-colors font-black uppercase tracking-widest"
													>
														Recuperar_Acceso
													</a>
												</div>
												<FormControl>
													<div className="relative group/input">
														<Input
															type="password"
															className="h-12 bg-background/40 border-border/40 focus:border-primary/50 focus:ring-0 transition-all text-sm font-bold tracking-[0.3em]"
															style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
															{...field}
														/>
														<div className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-focus-within/input:w-full transition-all duration-500" />
													</div>
												</FormControl>
												<FormMessage className="text-[9px] font-bold uppercase tracking-tight text-destructive ml-1" />
											</FormItem>
										)}
									/>
								</div>

								{/* Submit Button */}
								<button
									type="submit"
									className={cn(
										"relative group/btn h-12 w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.3em] transition-all overflow-hidden",
										form.formState.isSubmitting && "opacity-50 cursor-wait"
									)}
									style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}
									disabled={form.formState.isSubmitting}
								>
									<div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500 pointer-events-none" />
									{form.formState.isSubmitting ? (
										<>
											<div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
											AUTHENTICATING_USER
										</>
									) : (
										<>
											<Shield className="w-4 h-4" />
											Initialize_Session
										</>
									)}
								</button>
							</div>
						</form>
					</Form>
				</div>
			</div>

			{/* Footer Text */}
			<div className="relative text-balance text-center text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 max-w-sm mx-auto leading-relaxed">
				<p>
					Al inicializar la sesión, aceptas nuestros{" "}
					<a href="#" className="text-primary/60 hover:text-primary transition-colors">Términos de servicio</a> y{" "}
					<a href="#" className="text-primary/60 hover:text-primary transition-colors">Política de privacidad</a>.
				</p>
			</div>
		</div>
	);
}
