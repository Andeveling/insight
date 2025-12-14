import { redirect } from "next/navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { getSession } from "@/lib/auth";
import { AppSidebar } from "./_components/app-sidebar";
import { getUserTeam } from "./team/_actions";
import { cookies } from "next/headers";

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
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-mx-1" />
          {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
          <span className="text-sm font-semibold">Insight</span>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
