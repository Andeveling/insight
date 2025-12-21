"use client";

import {
	ArrowRight,
	BarChart3,
	BrainCircuit,
	CheckCircle2,
	History,
	LayoutDashboard,
	Shield,
	Sparkles,
	Target,
	TrendingUp,
	Users,
	BookOpen,
	Trophy,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/cn";

// Shared Clip-Paths
const clipPath16 =
	"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";
const clipPath15 =
	"polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)";
const clipPath8 =
	"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";
const clipPath20 =
	"polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)";

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/30 relative">
			{/* HUD Grid Background */}
			<div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-grid-tech" />
			<div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-background)_100%)] pointer-events-none" />

			{/* Scan Line Animation */}
			<div className="fixed top-0 left-0 w-full h-px bg-primary/10 z-[200] pointer-events-none animate-scan" />

			{/* Header */}
			<header className="sticky top-0 z-[100] w-full border-b border-white/5 bg-background/60 backdrop-blur-md">
				<div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
					<div className="flex items-center gap-3 group cursor-pointer">
						<div
							className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary border border-primary/20 transition-transform group-hover:scale-110"
							style={{
								clipPath:
									"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
							}}
						>
							<LayoutDashboard className="size-5 drop-shadow-[0_0_8px_currentColor]" />
						</div>
						<div className="flex flex-col -space-y-1">
							<span className="font-black text-xl tracking-tighter uppercase">
								Insight
							</span>
							<span className="text-[8px] font-black tracking-[0.4em] text-primary/60">
								SYSTEM_v4.2
							</span>
						</div>
					</div>
					<nav className="flex items-center gap-6">
						<div className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
							<Link
								href="#features"
								className="hover:text-primary transition-colors"
							>
								Características
							</Link>
							<Link
								href="#stats"
								className="hover:text-primary transition-colors"
							>
								Métricas
							</Link>
						</div>
						<Link href="/login">
							<button
								className="px-5 py-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-primary/90 active:scale-95"
								style={{ clipPath: clipPath8 }}
							>
								Inicializar Sesión
							</button>
						</Link>
					</nav>
				</div>
			</header>

			<main className="flex-1 relative z-10">
				{/* Hero Section */}
				<section className="relative w-full py-20 md:py-32 lg:py-48 overflow-hidden">
					{/* Localized Grid with Mask & Glow */}
					<div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none bg-grid-tech [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-primary/10 blur-[160px] rounded-full pointer-events-none select-none" />

					<div className="container mx-auto px-4 md:px-6 relative z-10">
						<div className="flex flex-col items-center space-y-12 text-center">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								className="space-y-6"
							>
								<div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/20 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
									<Sparkles className="size-3" />
									Protocolo_Optimización_IA
								</div>
								<h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-8xl/none uppercase">
									Potencia el <span className="text-primary italic">Core</span>{" "}
									<br />
									de tu{" "}
									<span className="relative">
										Equipo
										<svg
											className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-2 md:h-4 text-primary/30"
											viewBox="0 0 100 20"
											preserveAspectRatio="none"
										>
											<path
												d="M0 15 Q 25 5 50 15 T 100 15"
												fill="none"
												stroke="currentColor"
												strokeWidth="4"
											/>
										</svg>
									</span>
								</h1>
								<p className="mx-auto max-w-[800px] text-muted-foreground/80 md:text-lg font-medium leading-relaxed uppercase tracking-wide text-xs">
									[ANALIZANDO_FORTALEZAS]{" "}
									{/* Insight utiliza inteligencia artificial para decodificar */}
									el rendimiento colectivo y potenciar la comunicación_
								</p>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ delay: 0.2 }}
								className="flex flex-wrap items-center justify-center gap-6"
							>
								<Link href="/login">
									<div
										className="p-px bg-primary/40 hover:bg-primary/60 transition-colors"
										style={{ clipPath: clipPath15 }}
									>
										<button
											className="group relative px-10 py-4 bg-primary text-primary-foreground text-xs font-black uppercase tracking-[0.3em] transition-all hover:bg-primary/95"
											style={{ clipPath: clipPath15 }}
										>
											Comenzar_Protocolo
											<ArrowRight className="inline-block ml-3 size-4 transition-transform group-hover:translate-x-1" />
										</button>
									</div>
								</Link>
								<Link href="#features">
									<div
										className="p-px bg-border hover:bg-primary/50 transition-colors"
										style={{ clipPath: clipPath15 }}
									>
										<button
											className="px-10 py-4 bg-muted/20 backdrop-blur-sm text-foreground text-xs font-black uppercase tracking-[0.3em] transition-all hover:bg-muted/40"
											style={{ clipPath: clipPath15 }}
										>
											Explorar_Data
										</button>
									</div>
								</Link>
							</motion.div>
						</div>
					</div>

					{/* Decorative Side Elements */}
					<div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-px bg-linear-to-r from-primary/30 to-transparent hidden xl:block" />
					<div className="absolute top-1/2 right-0 -translate-y-1/2 w-48 h-px bg-linear-to-l from-primary/30 to-transparent hidden xl:block" />
				</section>

				{/* Features Section */}
				<section
					id="features"
					className="w-full py-24 md:py-32 bg-muted/5 relative overflow-hidden"
				>
					{/* Section Header */}
					<div className="container mx-auto px-4 md:px-6 mb-20 relative z-10">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<div className="text-xs font-black uppercase tracking-[0.4em] text-primary/60 mb-2">
									Módulos_Operativos
								</div>
								<h2 className="text-3xl font-black tracking-tighter md:text-5xl uppercase">
									Arquitectura de{" "}
									<span className="text-primary">Liderazgo</span>
								</h2>
								<p className="max-w-[600px] text-muted-foreground/60 text-[10px] font-bold uppercase tracking-widest mx-auto">
									Infraestructura de datos diseñada para la optimización de
									capital humano_
								</p>
							</div>
						</div>

						<div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
							<FeatureCard
								icon={<BarChart3 />}
								title="Análisis Individual"
								description="Decodifica el perfil ADN de cada miembro con reportes de precisión absoluta basados en el modelo Gallup."
								details="[SYNC_ENABLED] // [DATA_MINING]"
							/>
							<FeatureCard
								icon={<Users />}
								title="Dinámicas de Equipo"
								description="Algoritmos avanzados para visualizar la interacción de talentos y detectar cuellos de botella comunicativos."
								details="[NODE_READY] // [MAPPING_COMPLETE]"
							/>
							<FeatureCard
								icon={<BrainCircuit />}
								title="Asistente IA"
								description="Redes neuronales dedicadas a curar estrategias de liderazgo y gestión de conflictos personalizadas."
								details="[AI_COACH_v2] // [ACTIVE]"
							/>
						</div>
					</div>

					{/* Decorative background circle */}
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
				</section>

				{/* Value Prop / HUD Section */}
				<section
					id="stats"
					className="w-full py-24 md:py-32 border-y border-white/5 relative bg-background"
				>
					<div className="container mx-auto px-4 md:px-6">
						<div className="grid gap-16 lg:grid-cols-2 items-center">
							<div className="space-y-8">
								<div className="space-y-4">
									<h2 className="text-3xl font-black tracking-tighter md:text-5xl uppercase">
										Optimiza la <span className="text-primary">Cultura</span>{" "}
										Organica
									</h2>
									<p className="text-muted-foreground/80 md:text-lg font-medium leading-relaxed uppercase tracking-wide text-xs">
										Insight no es hardware redundante; es el núcleo para
										construir escuadrones de alto impacto mediante analítica de
										comportamiento_
									</p>
								</div>

								<div className="grid gap-4">
									<TechList
										icon={<Target />}
										text="Sincronización de comunicación interna"
									/>
									<TechList
										icon={<CheckCircle2 />}
										text="Compromiso verificado vía protocolos IA"
									/>
									<TechList
										icon={<TrendingUp />}
										text="Escalabilidad basada en métricas de fortalezas"
									/>
									<TechList
										icon={<History />}
										text="Historial de evolución de equipos dinámico"
									/>
								</div>

								<div className="pt-4">
									<Link href="/login">
										<div
											className="inline-block p-px bg-primary/40 hover:bg-primary transition-colors"
											style={{ clipPath: clipPath8 }}
										>
											<button
												className="px-8 py-4 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.3em] transition-all"
												style={{ clipPath: clipPath8 }}
											>
												Inicializar_Despliegue_Gratis
											</button>
										</div>
									</Link>
								</div>
							</div>

							<div className="flex items-center justify-center p-4">
								<div
									className="relative w-full max-w-[500px] aspect-square p-px bg-primary/20"
									style={{ clipPath: clipPath16 }}
								>
									<div
										className="absolute inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center overflow-hidden"
										style={{ clipPath: clipPath16 }}
									>
										<div className="absolute inset-0 bg-grid-tech opacity-10" />

										<div className="relative z-10 grid gap-6">
											<motion.div
												initial={{ x: 50, opacity: 0 }}
												whileInView={{ x: 0, opacity: 1 }}
											>
												<div
													className="p-px bg-primary/40"
													style={{ clipPath: clipPath8 }}
												>
													<div
														className="p-6 bg-background/90 backdrop-blur-lg h-full"
														style={{ clipPath: clipPath8 }}
													>
														<div className="text-5xl font-black text-primary mb-1 tracking-tighter">
															30%
														</div>
														<div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
															Productividad_Boosted
														</div>
													</div>
												</div>
											</motion.div>

											<motion.div
												initial={{ x: -50, opacity: 0 }}
												whileInView={{ x: 0, opacity: 1 }}
												className="translate-x-12"
											>
												<div
													className="p-px bg-chart-2/40"
													style={{ clipPath: clipPath8 }}
												>
													<div
														className="p-6 bg-background/90 backdrop-blur-lg h-full"
														style={{ clipPath: clipPath8 }}
													>
														<div className="text-5xl font-black text-chart-2 mb-1 tracking-tighter">
															95%
														</div>
														<div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
															Satisfaction_Ratio
														</div>
													</div>
												</div>
											</motion.div>

											<div className="absolute -top-10 -left-10 text-primary/10 select-none">
												<Shield className="size-48" />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Development Module Promotion Section */}
				<section
					id="development"
					className="w-full py-24 md:py-32 bg-muted/5 relative overflow-hidden border-t border-white/5"
				>
					<div className="container mx-auto px-4 md:px-6 relative z-10">
						<div className="flex flex-col items-center justify-center mb-16 text-center">
							<div
								className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4"
								style={{ clipPath: clipPath8 }}
							>
								<Sparkles className="size-3" />
								Nuevo: Módulo_de_Desarrollo
							</div>
							<h2 className="text-3xl font-black tracking-tighter md:text-5xl uppercase mb-4">
								Laboratorio de{" "}
								<span className="text-primary italic">Evolución</span>
							</h2>
							<p className="max-w-[700px] text-muted-foreground/60 text-xs font-bold uppercase tracking-widest leading-relaxed">
								No solo identifiques fortalezas; desarróllalas mediante un
								sistema de aprendizaje adaptativo basado en IA_
							</p>
						</div>

						<div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
							<div className="space-y-4 group">
								<div
									className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary border border-primary/20 transition-all group-hover:bg-primary group-hover:text-primary-foreground"
									style={{
										clipPath:
											"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
									}}
								>
									<BookOpen className="size-6" />
								</div>
								<h3 className="text-sm font-black uppercase tracking-tight">
									Módulos On-Demand
								</h3>
								<p className="text-[11px] text-muted-foreground leading-relaxed">
									Generación instantánea de micro-learning adaptados a tu rol
									profesional y tus Top 5 fortalezas.
								</p>
							</div>

							<div className="space-y-4 group">
								<div
									className="w-12 h-12 flex items-center justify-center bg-chart-2/10 text-chart-2 border border-chart-2/20 transition-all group-hover:bg-chart-2 group-hover:text-white"
									style={{
										clipPath:
											"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
									}}
								>
									<Trophy className="size-6" />
								</div>
								<h3 className="text-sm font-black uppercase tracking-tight">
									Gamificación Gallup
								</h3>
								<p className="text-[11px] text-muted-foreground leading-relaxed">
									Gana XP, desbloquea Badges de Maestría y escala en los
									rankings de liderazgo de tu organización.
								</p>
							</div>

							<div className="space-y-4 group">
								<div
									className="w-12 h-12 flex items-center justify-center bg-amber-500/10 text-amber-500 border border-amber-500/20 transition-all group-hover:bg-amber-500 group-hover:text-black"
									style={{
										clipPath:
											"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
									}}
								>
									<BrainCircuit className="size-6" />
								</div>
								<h3 className="text-sm font-black uppercase tracking-tight">
									AI Coach 24/7
								</h3>
								<p className="text-[11px] text-muted-foreground leading-relaxed">
									Recibe directivas diarias y consejos tácticos para aplicar tus
									fortalezas en situaciones reales de trabajo.
								</p>
							</div>

							<div className="space-y-4 group">
								<div
									className="w-12 h-12 flex items-center justify-center bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 transition-all group-hover:bg-emerald-500 group-hover:text-black"
									style={{
										clipPath:
											"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
									}}
								>
									<TrendingUp className="size-6" />
								</div>
								<h3 className="text-sm font-black uppercase tracking-tight">
									Métricas de Crecimiento
								</h3>
								<p className="text-[11px] text-muted-foreground leading-relaxed">
									Visualiza tu evolución técnica y blanda mediante gráficos HUD
									de alto impacto y reportes de progreso.
								</p>
							</div>
						</div>

						<div className="mt-20 flex justify-center">
							<Link href="/login">
								<div
									className="p-px bg-primary/40 hover:bg-primary transition-colors"
									style={{ clipPath: clipPath15 }}
								>
									<button
										className="px-12 py-4 bg-background text-primary text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary hover:text-primary-foreground transition-all"
										style={{ clipPath: clipPath15 }}
									>
										Acceder_al_Laboratorio
									</button>
								</div>
							</Link>
						</div>
					</div>

					{/* Decorative Scan lines */}
					<div className="absolute top-0 left-0 w-full h-px bg-primary/5 animate-pulse" />
					<div className="absolute bottom-10 left-0 w-full h-10 bg-primary/5 -skew-y-3 opacity-20" />
				</section>
			</main>

			{/* Footer */}
			<footer className="w-full border-t border-white/5 py-12 relative z-10 bg-background">
				<div className="container mx-auto flex flex-col items-center justify-between gap-8 md:flex-row px-4 md:px-6">
					<div className="flex items-center gap-3">
						<div
							className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary border border-primary/20"
							style={{
								clipPath:
									"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
							}}
						>
							<LayoutDashboard className="size-4" />
						</div>
						<div className="flex flex-col -space-y-1">
							<span className="font-black text-lg tracking-tighter uppercase">
								Insight
							</span>
							<span className="text-[7px] font-black tracking-[0.4em] text-primary/40 text-center">
								CORE
							</span>
						</div>
					</div>
					<div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
						<a href="#" className="hover:text-primary transition-colors">
							Seguridad
						</a>
						<a href="#" className="hover:text-primary transition-colors">
							API
						</a>
						<a href="#" className="hover:text-primary transition-colors">
							Privacidad
						</a>
					</div>
					<p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">
						© 2025 Insight_HQ {/* Todos los derechos reservados. */}
					</p>
				</div>
			</footer>
		</div>
	);
}

function FeatureCard({
	icon,
	title,
	description,
	details,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	details: string;
}) {
	return (
		<motion.div whileHover={{ y: -5 }}>
			<div
				className="group relative p-px bg-border/40 transition-colors hover:bg-primary/30 h-full"
				style={{ clipPath: clipPath20 }}
			>
				<div
					className="bg-background/95 backdrop-blur-sm p-8 h-full space-y-4 relative overflow-hidden"
					style={{ clipPath: clipPath20 }}
				>
					{/* Status Pulse */}
					<div className="absolute top-4 right-4 flex items-center gap-1.5">
						<div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_6px_var(--color-emerald-500)]" />
						<span className="text-[6px] font-black uppercase tracking-widest text-emerald-500/60">
							Active_Node
						</span>
					</div>

					{/* Technical Header */}
					<div className="flex items-center gap-4 mb-8">
						<div
							className="w-14 h-14 p-px bg-primary/20 transition-transform group-hover:scale-110"
							style={{
								clipPath:
									"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
							}}
						>
							<div
								className="w-full h-full flex items-center justify-center bg-primary/10 text-primary border-0"
								style={{
									clipPath:
										"polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
								}}
							>
								{icon}
							</div>
						</div>
						<div className="h-px flex-1 bg-border/20 group-hover:bg-primary/20 transition-colors" />
					</div>

					<h3 className="text-lg font-black uppercase tracking-tighter text-foreground group-hover:text-primary transition-colors">
						{title}
					</h3>
					<p className="text-[11px] text-muted-foreground/80 font-medium leading-relaxed uppercase tracking-tight">
						{description}
					</p>

					{/* Card Footer */}
					<div className="pt-6 mt-auto">
						<div className="flex items-center justify-between text-[8px] font-black uppercase tracking-[0.2em]">
							<span className="text-primary/50 group-hover:text-primary transition-colors">
								{details}
							</span>
							<ArrowRight className="size-3 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
						</div>
						<div className="h-px w-full bg-border/10 mt-2 relative overflow-hidden">
							<div className="absolute top-0 left-0 h-full bg-primary/30 w-0 group-hover:w-full transition-all duration-700" />
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

function TechList({ icon, text }: { icon: React.ReactNode; text: string }) {
	return (
		<div className="flex items-center gap-4 group">
			<div className="p-2 bg-primary/10 text-primary border border-primary/20 opacity-50 group-hover:opacity-100 transition-opacity">
				{icon}
			</div>
			<span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
				{text}
			</span>
		</div>
	);
}
