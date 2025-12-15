import { TrendingUp, User, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import DashboardContainer from "./_components/dashboard-container";

export default async function DashboardPage() {
  // Session is cached - this won't make another DB call if layout already called it
  const session = await getSession();

  return (
    <DashboardContainer
      title={`Bienvenido de nuevo, ${session?.user?.name ?? "Usuario"}!`}
      description="Descubre tus fortalezas"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mi Perfil</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 Fortalezas</div>
            <p className="text-xs text-muted-foreground">
              Descubre tus fortalezas principales
            </p>
            <Button asChild className="mt-4 w-full" variant="default">
              <Link href="/dashboard/profile">Ver Perfil</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mi Equipo</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 Miembros</div>
            <p className="text-xs text-muted-foreground">
              Análisis de fortalezas del equipo
            </p>
            <Button asChild className="mt-4 w-full" variant="default">
              <Link href="/dashboard/team">Ver Equipo</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Colaboración</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Activa</div>
            <p className="text-xs text-muted-foreground">
              Mejora la dinámica del equipo
            </p>
            <Button asChild className="mt-4 w-full" variant="default">
              <Link href="/dashboard/team">Explorar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Acerca de HIGH5</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">
              Convierte la competencia en colaboración
            </h3>
            <p className="text-sm text-muted-foreground">
              La colaboración eficiente es el motor que impulsa la innovación
              organizacional. HIGH5 ayuda a los equipos a convertir sus
              diferencias en oportunidades de colaboración complementarias.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              Minimiza la falta de comunicación
            </h3>
            <p className="text-sm text-muted-foreground">
              HIGH5 ofrece claridad al hacer que los equipos sean conscientes de
              sus diferentes estilos de comunicación y trabajo, disolviendo las
              barreras de comunicación.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              Fomenta la seguridad psicológica
            </h3>
            <p className="text-sm text-muted-foreground">
              Al abrazar las fortalezas individuales, HIGH5 crea un entorno de
              apoyo donde cada miembro del equipo se siente valorado y
              respetado.
            </p>
          </div>
        </CardContent>
      </Card>
    </DashboardContainer>
  );
}
