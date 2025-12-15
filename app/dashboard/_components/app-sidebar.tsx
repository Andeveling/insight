"use client";

import {
  BookOpen,
  ChevronUp,
  HeartHandshakeIcon,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Settings,
  Sparkles,
  Trophy,
  User,
  UserIcon,
  Users,
  UsersIcon,
  Users2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type * as React from "react";
import { useMemo, useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string;
    email: string;
    image?: string;
  };
  teamId?: string;
}

export function AppSidebar({ user, teamId, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Build menu groups organized by category
  const menuGroups: MenuGroup[] = useMemo(() => {
    const groups: MenuGroup[] = [
      {
        label: "Principal",
        items: [
          {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
          },
          {
            title: "Mi Perfil",
            url: "/dashboard/profile",
            icon: User,
          },
        ],
      },
      {
        label: "Desarrollo",
        items: [
          {
            title: "Evaluación",
            url: "/dashboard/assessment",
            icon: Sparkles,
          },
          {
            title: "Mi Progreso",
            url: "/dashboard/development/dashboard",
            icon: LayoutDashboard,
          },
          {
            title: "Módulos",
            url: "/dashboard/development",
            icon: BookOpen,
          },
          {
            title: "Mis Insignias",
            url: "/dashboard/development/badges",
            icon: Trophy,
          },
          {
            title: "Feedback 360°",
            url: "/dashboard/feedback",
            icon: MessageCircle,
          },
        ],
      },
      {
        label: "Equipo",
        items: [
          {
            title: "Equipo",
            url: "/dashboard/team",
            icon: Users,
          },
          ...(teamId
            ? [
                {
                  title: "Sub-Equipos",
                  url: `/dashboard/team/${teamId}/sub-teams`,
                  icon: Users2Icon,
                },
              ]
            : []),
        ],
      },
      {
        label: "Reportes",
        items: [
          {
            title: "Individual",
            url: "/dashboard/reports/individual",
            icon: UserIcon,
          },
          {
            title: "Equipo",
            url: "/dashboard/reports/team",
            icon: UsersIcon,
          },
          {
            title: "Consejos",
            url: "/dashboard/reports/team-tips",
            icon: HeartHandshakeIcon,
          },
        ],
      },
    ];

    return groups;
  }, [teamId]);

  const handleSignOut = () => {
    startTransition(async () => {
      await authClient.signOut();
      router.refresh();
    });
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <LayoutDashboard className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Insight</span>
                  <span className="truncate text-xs">Team Strengths</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    item.url === "/dashboard"
                      ? pathname === item.url
                      : pathname.startsWith(item.url);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.url}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <User className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.name || "Usuario"}
                    </span>
                    <span className="truncate text-xs">
                      {user?.email || "email@example.com"}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 size-4" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 size-4" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isPending}
                    className="flex w-full items-center"
                  >
                    <LogOut className="mr-2 size-4" />
                    {isPending ? "Cerrando..." : "Cerrar Sesión"}
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
