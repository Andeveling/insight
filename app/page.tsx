/** biome-ignore-all lint/correctness/useUniqueElementIds: false positive */
import {
	ArrowRight,
	BarChart3,
	BrainCircuit,
	CheckCircle2,
	LayoutDashboard,
	Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col bg-background font-sans">
			{/* Header */}
			<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
				<div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
					<div className="flex items-center gap-2 font-bold text-xl text-primary">
						<LayoutDashboard className="size-6" />
						<span>Insight</span>
					</div>
					<nav className="flex items-center gap-4">
						<Link href="/login">
							<Button>Iniciar Sesión</Button>
						</Link>
					</nav>
				</div>
			</header>

			<main className="flex-1">
				{/* Hero Section */}
				<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-linear-to-b from-background to-muted/20">
					<div className="container mx-auto px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="space-y-2">
								<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-foreground">
									Descubre el Verdadero{" "}
									<span className="text-primary">Potencial</span> de tu Equipo
								</h1>
								<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
									Insight utiliza inteligencia artificial para analizar
									fortalezas, mejorar la comunicación y potenciar el rendimiento
									colectivo a través de datos accionables.
								</p>
							</div>
							<div className="space-x-4">
								<Link href="/login">
									<Button size="lg" className="h-12 px-8 text-base">
										Comenzar Ahora
										<ArrowRight className="ml-2 size-4" />
									</Button>
								</Link>
								<Link href="#features">
									<Button
										variant="outline"
										size="lg"
										className="h-12 px-8 text-base"
									>
										Saber más
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section
					id="features"
					className="w-full py-12 md:py-24 lg:py-32 bg-background"
				>
					<div className="container mx-auto px-4 md:px-6">
						<div className="flex flex-col items-center justify-center space-y-4 text-center">
							<div className="space-y-2">
								<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-primary font-medium">
									Características
								</div>
								<h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
									Todo lo que necesitas para liderar mejor
								</h2>
								<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
									Nuestra plataforma transforma los datos de fortalezas en
									estrategias claras para el desarrollo de tu equipo.
								</p>
							</div>
						</div>
						<div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
							<Card className="border-none shadow-md bg-card/50">
								<CardHeader>
									<BarChart3 className="size-10 text-primary mb-2" />
									<CardTitle>Análisis Individual</CardTitle>
									<CardDescription>
										Profundiza en el perfil único de cada miembro.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										Obtén reportes detallados sobre las fortalezas, áreas de
										enfoque y estilo de trabajo de cada persona.
									</p>
								</CardContent>
							</Card>
							<Card className="border-none shadow-md bg-card/50">
								<CardHeader>
									<Users className="size-10 text-primary mb-2" />
									<CardTitle>Dinámicas de Equipo</CardTitle>
									<CardDescription>
										Visualiza cómo interactúan los talentos.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										Entiende la composición del equipo, identifica brechas y
										descubre cómo maximizar la colaboración.
									</p>
								</CardContent>
							</Card>
							<Card className="border-none shadow-md bg-card/50">
								<CardHeader>
									<BrainCircuit className="size-10 text-primary mb-2" />
									<CardTitle>Consejos con IA</CardTitle>
									<CardDescription>
										Recomendaciones inteligentes y personalizadas.
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground">
										Recibe tips de comunicación, estrategias de liderazgo y
										recomendaciones de libros curadas por IA.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Value Prop Section */}
				<section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
					<div className="container mx-auto px-4 md:px-6">
						<div className="grid gap-10 lg:grid-cols-2 items-center">
							<div className="space-y-4">
								<h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
									Impulsa la cultura de tu organización
								</h2>
								<p className="text-muted-foreground md:text-xl/relaxed">
									Insight no es solo una herramienta de análisis, es tu
									compañero para construir equipos más fuertes y felices.
								</p>
								<ul className="grid gap-4 py-4">
									<li className="flex items-center gap-2">
										<CheckCircle2 className="size-5 text-primary" />
										<span className="text-sm font-medium">
											Mejora la comunicación interna
										</span>
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle2 className="size-5 text-primary" />
										<span className="text-sm font-medium">
											Aumenta el compromiso del equipo
										</span>
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle2 className="size-5 text-primary" />
										<span className="text-sm font-medium">
											Desarrollo profesional basado en datos
										</span>
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle2 className="size-5 text-primary" />
										<span className="text-sm font-medium">
											Planes de acción generados por IA
										</span>
									</li>
								</ul>
								<div className="flex flex-col gap-2 min-[400px]:flex-row">
									<Link href="/login">
										<Button size="lg">Empezar Gratis</Button>
									</Link>
								</div>
							</div>
							<div className="flex items-center justify-center">
								<div className="relative w-full max-w-[500px] aspect-square rounded-xl bg-linear-to-tr from-primary/20 to-secondary/20 p-8 flex items-center justify-center">
									<div className="absolute inset-0 bg-grid-white/10 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
									<div className="relative z-10 grid gap-4 text-center">
										<div className="rounded-lg bg-background p-6 shadow-xl">
											<div className="text-4xl font-bold text-primary mb-2">
												30%
											</div>
											<div className="text-sm text-muted-foreground">
												Incremento en productividad
											</div>
										</div>
										<div className="rounded-lg bg-background p-6 shadow-xl translate-x-8">
											<div className="text-4xl font-bold text-primary mb-2">
												95%
											</div>
											<div className="text-sm text-muted-foreground">
												Satisfacción del equipo
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="w-full border-t py-6 md:py-0">
				<div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6">
					<div className="flex items-center gap-2 text-sm font-semibold">
						<LayoutDashboard className="size-5 text-primary" />
						<span>Insight</span>
					</div>
					<p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
						© 2025 Insight. Todos los derechos reservados.
					</p>
				</div>
			</footer>
		</div>
	);
}
