import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
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
		<div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-gamified-hero overflow-hidden">
			{/* Animated background pattern */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

			{/* Radial gradient overlay */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-background)_100%)]" />

			{/* Floating orbs */}
			<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
			<div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-chart-2/5 rounded-full blur-3xl animate-float delay-1000" />

			<div className="relative w-full max-w-sm md:max-w-md z-10">
				<Suspense fallback={null}>
					<AuthCheck />
				</Suspense>
				<LoginForm />
			</div>
		</div>
	);
}
