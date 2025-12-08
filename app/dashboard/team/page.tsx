import { TrendingUp, Users } from "lucide-react";
import {
  TeamCultureMap,
  TeamStrengthsGrid,
  TeamWatchOuts,
  UniqueContributions,
} from "@/app/_shared";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { calculateTeamAnalytics } from "@/lib/utils/strength-helpers";
import {
  getAllCulturesForDisplay,
  getAllStrengths,
  getTeamByName,
  getTeamMembersWithStrengths,
} from "./_actions";

export default async function TeamPage() {
  // Fetch the default team "nojau"
  const team = await getTeamByName("nojau");

  if (!team) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTitle>Equipo no encontrado</AlertTitle>
          <AlertDescription>
            No se pudo cargar el equipo. Por favor, verifica que el equipo
            existe en la base de datos.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const teamMembers = await getTeamMembersWithStrengths(team.id);
  const allStrengths = await getAllStrengths();
  const cultures = await getAllCulturesForDisplay();

  if (teamMembers.length === 0) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Users className="h-8 w-8" />
              {team.name}
            </CardTitle>
            {team.description && (
              <p className="text-sm text-muted-foreground">
                {team.description}
              </p>
            )}
          </CardHeader>
        </Card>

        <Alert>
          <AlertTitle>Equipo sin miembros</AlertTitle>
          <AlertDescription>
            Este equipo aún no tiene miembros con fortalezas configuradas.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const analytics = calculateTeamAnalytics(teamMembers);

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Team Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Users className="h-10 w-10" />
              {team.name}
            </h1>
            {team.description && (
              <p className="text-lg text-muted-foreground mt-2">
                {team.description}
              </p>
            )}
          </div>
          <Card className="min-w-[200px]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Miembros</p>
                  <p className="text-3xl font-bold">{teamMembers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Alert>
          <AlertTitle>Construye Mejores Dinámicas de Equipo</AlertTitle>
          <AlertDescription>
            Visualiza exactamente cómo los miembros de tu equipo se complementan
            entre sí. Los análisis del equipo muestran dónde sobresale tu equipo
            y te ayudan a aprovechar diversos talentos para una mejor
            colaboración y resultados.
          </AlertDescription>
        </Alert>
      </div>

      <Separator />

      {/* Team Strengths Grid */}
      <section>
        <TeamStrengthsGrid
          teamMembers={teamMembers}
          allStrengths={allStrengths}
        />
      </section>

      <Separator />

      {/* Team Culture Map */}
      <section>
        <TeamCultureMap analytics={analytics} cultures={cultures} />
      </section>

      <Separator />

      {/* Two Column Layout for Watch Outs and Unique Contributions */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamWatchOuts analytics={analytics} />
        <UniqueContributions analytics={analytics} />
      </section>
    </div>
  );
}
