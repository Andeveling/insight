import { Info } from "lucide-react";
import { redirect } from "next/navigation";
import { UserStrengthProfile } from "@/app/_shared";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  generateUserDna,
  getCurrentUserWithStrengths,
  getUserDna,
  getUserProfile,
} from "./_actions";
import { EditProfileCard } from "./_components/edit-profile-card";
import { UserDnaCard } from "./_components/user-dna-card";

export default async function ProfilePage() {
  // Fetch authenticated user with strengths securely via server action
  const [user, userProfile, existingDna] = await Promise.all([
    getCurrentUserWithStrengths(),
    getUserProfile(),
    getUserDna(),
  ]);

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login");
  }

  let dna = existingDna;

  // Auto-generate DNA if missing and user has enough strengths
  if (!dna && user.strengths.length >= 5) {
    try {
      dna = await generateUserDna(user.id);
    } catch (error) {
      console.error("Error generating User DNA:", error);
    }
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Strengths */}
        <div className="lg:col-span-2 space-y-6">
          {dna && <UserDnaCard dna={dna} />}
          <UserStrengthProfile user={user} />
        </div>

        {/* Sidebar - Profile Details */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <EditProfileCard initialData={userProfile} />
          </div>
        </div>
      </div>
    </div>
  );
}
