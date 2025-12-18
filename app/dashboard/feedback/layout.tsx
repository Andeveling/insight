import type { Metadata } from "next";
import { GamificationContextBadge } from "@/components/gamification";

export const metadata: Metadata = {
	title: "Feedback 360° | Insight",
	description:
		"Gestiona solicitudes de feedback y descubre nuevas perspectivas",
};

export default function FeedbackLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen">
			<div className="container mx-auto py-6">
				<div className="flex justify-end mb-4">
					<GamificationContextBadge compact showStreak />
				</div>
				{children}
			</div>
		</div>
	);
}
