"use client";

import {
  BookOpen,
  ChevronRight,
  ChevronUp,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Settings,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type * as React from "react";
import { useMemo, useTransition } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

interface SubMenuItem {
  title: string;
  url: string;
}

interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: SubMenuItem[];
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

  // Build menu items with nested navigation
  const menuItems: MenuItem[] = useMemo(() => {
    const items: MenuItem[] = [
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
      {
        title: "Evaluación",
        url: "/dashboard/assessment",
        icon: Sparkles,
      },
      {
        title: "Desarrollo",
        url: "/dashboard/development",
        icon: BookOpen,
        subItems: [
          {
            title: "Mi Progreso",
            url: "/dashboard/development/dashboard",
          },
          {
            title: "Módulos",
            url: "/dashboard/development",
          },
          {
            title: "Mis Insignias",
            url: "/dashboard/development/badges",
          },
        ],
      },
      {
        title: "Feedback 360°",
        url: "/dashboard/feedback",
        icon: MessageCircle,
      },
      {
        title: "Equipo",
        url: "/dashboard/team",
        icon: Users,
        subItems: teamId
          ? [
              {
                title: "Mi Equipo",
                url: "/dashboard/team",
              },
              {
                title: "Sub-Equipos",
                url: `/dashboard/team/${teamId}/sub-teams`,
              },
            ]
          : undefined,
      },
      {
        title: "Reportes",
        url: "/dashboard/reports",
        icon: FileText,
        subItems: [
          {
            title: "Individual",
            url: "/dashboard/reports/individual",
          },
          {
            title: "Equipo",
            url: "/dashboard/reports/team",
          },
          {
            title: "Consejos",
            url: "/dashboard/reports/team-tips",
          },
        ],
      },
    ];

    return items;
  }, [teamId]);

  // Helper to check if a menu item or its subitems are active
  const isMenuActive = (item: MenuItem): boolean => {
    if (item.url === "/dashboard") {
      return pathname === item.url;
    }
    if (item.subItems) {
      return item.subItems.some((subItem) =>
        subItem.url === "/dashboard/development"
          ? pathname === subItem.url
          : pathname.startsWith(subItem.url)
      );
    }
    return pathname.startsWith(item.url);
  };

  // Helper to check if a subitem is active
  const isSubItemActive = (url: string): boolean => {
    // Special case for exact match on /dashboard/development and /dashboard/team
    if (url === "/dashboard/development" || url === "/dashboard/team") {
      return pathname === url;
    }
    return pathname.startsWith(url);
  };

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
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isActive = isMenuActive(item);

                if (hasSubItems) {
                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={isActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            isActive={isActive}
                          >
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isSubItemActive(subItem.url)}
                                >
                                  <Link href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

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
