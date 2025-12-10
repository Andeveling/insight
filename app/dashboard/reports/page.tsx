import { FileTextIcon, SparklesIcon, UserIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="container mx-auto space-y-4 py-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Reportes de IA</h1>
        <p className="text-muted-foreground">
          Genera reportes completos impulsados por IA basados en datos de
          evaluación de fortalezas. Los reportes incluyen insights accionables,
          puntos ciegos y estrategias de desarrollo.
        </p>
      </div>

      {/* Report Types */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Individual Reports */}
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 size-32 -translate-y-8 translate-x-8 rounded-full bg-primary/10" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                <UserIcon className="size-6 text-primary" />
              </div>
              <div>
                <CardTitle>Reportes Individuales</CardTitle>
                <CardDescription>
                  Análisis de fortalezas personales
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Obtén insights personalizados sobre tus 5 fortalezas principales
              incluyendo:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-primary" />
                Implicaciones profesionales y roles ideales
              </li>
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-primary" />
                Puntos ciegos y lados oscuros a abordar
              </li>
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-primary" />
                Cómo tus fortalezas trabajan juntas
              </li>
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-primary" />
                Estrategias de desarrollo
              </li>
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-primary" />
                Mejores fortalezas para asociarse
              </li>
            </ul>
            <Button asChild className="w-full">
              <Link href="/dashboard/reports/individual">
                <FileTextIcon className="mr-2 size-4" />
                Ver Mi Reporte
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Team Reports */}
        <Card className="relative overflow-hidden">
          <div className="absolute right-0 top-0 size-32 -translate-y-8 translate-x-8 rounded-full bg-blue-500/10" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-blue-500/10">
                <UsersIcon className="size-6 text-blue-500" />
              </div>
              <div>
                <CardTitle>Reportes de Equipo</CardTitle>
                <CardDescription>
                  Análisis de composición del equipo
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Evaluación completa del equipo incluyendo:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-blue-500" />
                Mapa de cultura del equipo (matriz 2x2)
              </li>
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-blue-500" />
                Análisis de cobertura de dominios
              </li>
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-blue-500" />
                Distribución de fortalezas
              </li>
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-blue-500" />
                Sinergias y brechas de miembros
              </li>
              <li className="flex items-center gap-2">
                <SparklesIcon className="size-4 text-blue-500" />
                Sugerencias de optimización de roles
              </li>
            </ul>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard/reports/team">
                <FileTextIcon className="mr-2 size-4" />
                Ver Reporte del Equipo
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="border-dashed">
        <CardContent className="flex items-center gap-4 py-6">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <SparklesIcon className="size-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="font-medium">Cómo funciona</p>
            <p className="text-sm text-muted-foreground">
              Los reportes se generan con IA basándose en tu perfil de
              fortalezas y composición del equipo. Usamos GPT-4o de OpenAI para
              análisis comprehensivos. Los reportes se guardan en caché y solo
              puedes regenerarlos cada 30 días o si cambian tus fortalezas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
