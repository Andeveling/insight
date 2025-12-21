import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth";
import { AppSidebar } from "./_components/app-sidebar";
import { getUserTeam } from "./team/_actions";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Get the current session once for the entire layout (cached)
	const session = await getSession();

	// Handle redirect at layout level to avoid duplicate checks
	if (!session) {
		redirect("/login");
	}

	// Get the user's team for navigation
	const userTeam = await getUserTeam();
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AppSidebar
				user={{
					name: session.user.name,
					email: session.user.email,
					image: session.user.image ?? undefined,
				}}
				teamId={userTeam?.id}
			/>
			<SidebarInset>
				<header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md">
					<div className="flex items-center gap-4">
						<SidebarTrigger className="-ml-1 h-8 w-8 hover:bg-muted transition-colors" />
						<div className="h-4 w-px bg-border mx-1" />
						<span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/70 flex items-center gap-2">
							<span className="h-1.5 w-1.5 bg-primary animate-pulse" />
							Panel de Control // Sistema Activo
						</span>
					</div>
					<ThemeToggle />
				</header>
				<main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
					{children}
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
