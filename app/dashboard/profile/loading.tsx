import DashboardContainer from "../_components/dashboard-container";
import { ProfilePageSkeleton } from "./_components";

export default function Loading() {
	return (
		<DashboardContainer title="Mi Perfil" description="Descubre tus fortalezas">
			<ProfilePageSkeleton />
		</DashboardContainer>
	);
}
