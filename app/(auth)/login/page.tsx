import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { LoginForm } from "./_components/login-form";

async function AuthCheck() {
	await connection();

	const session = await auth.api.getSession({
		headers: new Headers(),
	});

	if (session) {
		redirect("/dashboard");
	}

	return null;
}

export default function LoginPage() {
	return (
		<div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-background overflow-hidden">
			{/* Technical Background */}
			<div className="absolute inset-0 z-0">
				<div className="absolute inset-0 bg-grid-tech opacity-[0.05]" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-background)_100%)]" />

				{/* Accent technical lines */}
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-linear-to-b from-primary/20 via-transparent to-primary/20 opacity-30" />
				<div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-linear-to-r from-primary/20 via-transparent to-primary/20 opacity-30" />

				{/* Floating technical elements (low opacity) */}
				<div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
				<div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-chart-2/5 blur-[100px] rounded-full animate-pulse delay-700" />
			</div>

			<div className="relative w-full max-w-sm md:max-w-md z-10">
				<Suspense fallback={null}>
					<AuthCheck />
				</Suspense>
				<LoginForm />
			</div>

			{/* Corner accents for the whole viewport */}
			<div className="fixed top-4 left-4 w-12 h-12 border-t border-l border-primary/20 pointer-events-none" />
			<div className="fixed bottom-4 right-4 w-12 h-12 border-b border-r border-primary/20 pointer-events-none" />
		</div>
	);
}
