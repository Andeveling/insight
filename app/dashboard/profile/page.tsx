import { Info } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DashboardContainer from "../_components/dashboard-container";
import {
	generateUserDna,
	getCurrentUserWithStrengths,
	getProfileAchievementsSummary,
	getProfileGamificationProgress,
	getUserDna,
	getUserProfile,
} from "./_actions";
import {
	EditProfileCard,
	ProfileAchievementsCard,
	ProfilePageSkeleton,
	UserDnaCard,
	UserStrengthProfile,
} from "./_components";

export default function ProfilePage() {
	return (
		<DashboardContainer title="Mi Perfil" description="Descubre tus fortalezas">
			<Suspense fallback={<ProfilePageSkeleton />}>
				<ProfilePageContent />
			</Suspense>
		</DashboardContainer>
	);
}

async function ProfilePageContent() {
	const [user, userProfile, existingDna] = await Promise.all([
		getCurrentUserWithStrengths(),
		getUserProfile(),
		getUserDna(),
	]);

	if (!user) {
		redirect("/login");
	}

	const [_progress, achievements] = await Promise.all([
		getProfileGamificationProgress(),
		getProfileAchievementsSummary(),
	]);

	let dna = existingDna;

	if (!dna && user.strengths.length >= 5) {
		try {
			dna = await generateUserDna(user.id);
		} catch (error) {
			console.error("Error generating User DNA:", error);
		}
	}

	if (user.strengths.length === 0) {
		return (
			<div className="space-y-6">
				<ProfileAchievementsCard summary={achievements} />

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
		<div className="space-y-2">
			<div className="mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-6">
						<ProfileAchievementsCard summary={achievements} />
						{dna && <UserDnaCard dna={dna} />}
						<UserStrengthProfile user={user} />
					</div>

					<div className="lg:col-span-1">
						<div className="sticky top-20">
							<EditProfileCard initialData={userProfile} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
