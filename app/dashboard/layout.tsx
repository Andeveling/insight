import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image ?? undefined,
        }}
        teamId={userTeam?.id}
      />
      <SidebarInset>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
