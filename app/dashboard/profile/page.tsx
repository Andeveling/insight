import { Info } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserStrengthProfile } from "@/app/_shared";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserByEmailWithStrengths } from "@/lib/data/strengths.data";

export default async function ProfilePage() {
  // Access request data first to make this page dynamic
  await cookies();

  // For demo purposes, we'll use the first seeded user
  // In production, this would come from the authenticated session
  const userEmail = "andres@nojau.co";

  const user = await getUserByEmailWithStrengths(userEmail);

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTitle>Usuario no encontrado</AlertTitle>
          <AlertDescription>
            No se pudo cargar el perfil del usuario. Por favor, verifica que el
            usuario existe en la base de datos.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (user.strengths.length === 0) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{user.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </CardHeader>
        </Card>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Configura tu perfil de fortalezas</AlertTitle>
          <AlertDescription>
            Aún no has completado el test de fortalezas HIGH5. Completa el test
            para descubrir tus fortalezas y cómo puedes contribuir mejor al
            equipo.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <UserStrengthProfile user={user} />
    </div>
  );
}
