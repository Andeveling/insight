import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "FEEDBACK_360_PROTOCOL | Insight",
	description: "GESTIÓN_ASISTIDA_DE_FORTALEZAS // [PROTOCOL_360]",
};

export default function FeedbackLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen">
			<div className="container mx-auto py-6">{children}</div>
		</div>
	);
}
