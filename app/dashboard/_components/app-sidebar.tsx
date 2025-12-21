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
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { useMemo, useRef, useTransition } from "react";
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
	useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/cn";

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
	const { state, setOpen, isMobile } = useSidebar();
	const isHoveredRef = useRef(false);

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
					: pathname.startsWith(subItem.url),
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

	const clipPath8 = "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)";
	const clipPath12 = "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)";

	return (
		<Sidebar
			collapsible="icon"
			{...props}
			side="left"
			aria-label="App Sidebar"
			className="border-r border-border bg-background/95 backdrop-blur-sm"
			onMouseEnter={() => {
				if (!isMobile && state === "collapsed") {
					setOpen(true);
					isHoveredRef.current = true;
				}
			}}
			onMouseLeave={() => {
				if (!isMobile && isHoveredRef.current) {
					setOpen(false);
					isHoveredRef.current = false;
				}
			}}
			onClick={() => {
				if (isHoveredRef.current) {
					isHoveredRef.current = false;
				}
			}}
		>
			<SidebarHeader className="p-4">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild className="hover:bg-transparent h-auto">
							<Link href="/dashboard" className="group/logo flex items-center gap-3">
								<div 
									className="flex aspect-square size-10 items-center justify-center bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all duration-300 group-hover/logo:scale-110"
									style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
								>
									<LayoutDashboard className="size-5" />
								</div>
								<div className="grid flex-1 text-left leading-tight">
									<span className="truncate font-black uppercase tracking-[0.2em] text-foreground text-sm">
										Insight
									</span>
									<span className="truncate text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-70">
										Team Strengths // V1.0
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<div className="h-px w-full bg-linear-to-r from-transparent via-border to-transparent mt-4 opacity-50" />
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup className="px-2 capitalize">
					<SidebarGroupLabel className="px-4 text-[9px] font-black uppercase tracking-[0.3em] text-primary mb-4 flex items-center gap-2">
						<span className="h-1 w-1 bg-primary animate-pulse" />
						SISTEMA_NAVEGACIÓN
					</SidebarGroupLabel>
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
														className={cn(
															"h-11 transition-all duration-300 relative group/btn",
															"hover:bg-muted/50 data-[active=true]:bg-primary/10 overflow-hidden"
														)}
														style={{ clipPath: clipPath8 }}
													>
														<div className={cn(
															"absolute inset-y-0 left-0 w-1 bg-primary transition-transform duration-300 origin-bottom",
															isActive ? "scale-y-100" : "scale-y-0 group-hover/btn:scale-y-50"
														)} />
														<item.icon
															className={cn(
																"size-4 transition-all duration-300",
																isActive ? "text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "text-muted-foreground group-hover/btn:text-foreground"
															)}
														/>
														<span className={cn(
															"font-black uppercase tracking-widest text-[10px] transition-colors",
															isActive ? "text-primary" : "text-muted-foreground group-hover/btn:text-foreground"
														)}>{item.title}</span>
														<ChevronRight className={cn(
															"ml-auto size-3 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90",
															isActive ? "text-primary" : "text-muted-foreground"
														)} />
													</SidebarMenuButton>
												</CollapsibleTrigger>
												<CollapsibleContent>
													<SidebarMenuSub className="ml-4 border-l-0 space-y-1 py-1">
														{item.subItems?.map((subItem) => (
															<SidebarMenuSubItem key={subItem.title}>
																<SidebarMenuSubButton
																	asChild
																	isActive={isSubItemActive(subItem.url)}
																	className={cn(
																		"h-8 transition-all duration-200 relative group/sub",
																		"hover:bg-muted/30 data-[active=true]:bg-transparent"
																	)}
																>
																	<Link href={subItem.url} className="flex items-center gap-2">
																		<div className={cn(
																			"h-0.5 w-2 transition-all duration-300",
																			isSubItemActive(subItem.url) ? "bg-primary w-3" : "bg-border group-hover/sub:bg-muted-foreground"
																		)} />
																		<span className={cn(
																			"text-[9px] font-black uppercase tracking-tighter transition-colors",
																			isSubItemActive(subItem.url) ? "text-primary" : "text-muted-foreground group-hover/sub:text-foreground"
																		)}>
																			{subItem.title}
																		</span>
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
											className={cn(
												"h-11 transition-all duration-300 relative group/btn",
												"hover:bg-muted/50 data-[active=true]:bg-primary/10 overflow-hidden"
											)}
											style={{ clipPath: clipPath8 }}
										>
											<Link href={item.url} className="group/link">
												<div className={cn(
													"absolute inset-y-0 left-0 w-1 bg-primary transition-transform duration-300 origin-bottom",
													isActive ? "scale-y-100" : "scale-y-0 group-hover/btn:scale-y-50"
												)} />
												<item.icon
													className={cn(
														"size-4 transition-all duration-300",
														isActive ? "text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "text-muted-foreground group-hover/link:text-foreground"
													)}
												/>
												<span className={cn(
													"font-black uppercase tracking-widest text-[10px] transition-colors",
													isActive ? "text-primary" : "text-muted-foreground group-hover/link:text-foreground"
												)}>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="p-4">
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="group/user data-[state=open]:bg-muted transition-all duration-300 h-14 border border-transparent hover:border-border/50"
									style={{ clipPath: clipPath12 }}
								>
									<div 
										className="flex aspect-square size-10 items-center justify-center bg-muted border border-border text-primary shadow-inner"
										style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
									>
										<User className="size-5" />
									</div>
									<div className="grid flex-1 text-left leading-tight ml-2">
										<span className="truncate font-black uppercase tracking-tight text-[11px] text-foreground">
											{user?.name || "USUARIO_AUTH"}
										</span>
										<span className="truncate text-[9px] font-bold uppercase tracking-tighter text-muted-foreground opacity-70">
											{user?.email || "SYNCING_DATA..."}
										</span>
									</div>
									<ChevronUp className="ml-auto size-3 opacity-30 group-hover/user:opacity-100 transition-opacity" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-[--radix-dropdown-menu-trigger-width] min-w-56 bg-background/95 backdrop-blur-md border border-border overflow-hidden"
								style={{ clipPath: clipPath12 }}
								side="top"
								align="start"
								sideOffset={8}
							>
								<DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2">
									<Link href="/dashboard/profile" className="flex items-center w-full">
										<User className="mr-3 size-4 opacity-50" />
										<span className="text-[10px] font-black uppercase tracking-widest">Mi Perfil</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer py-2">
									<Link href="/dashboard/settings" className="flex items-center w-full">
										<Settings className="mr-3 size-4 opacity-50" />
										<span className="text-[10px] font-black uppercase tracking-widest">Configuración</span>
									</Link>
								</DropdownMenuItem>
								<div className="h-px bg-border my-1 mx-2 opacity-50" />
								<DropdownMenuItem asChild className="focus:bg-destructive/10 focus:text-destructive transition-colors cursor-pointer py-2 text-destructive">
									<button
										type="button"
										onClick={handleSignOut}
										disabled={isPending}
										className="flex w-full items-center"
									>
										<LogOut className="mr-3 size-4 opacity-50" />
										<span className="text-[10px] font-black uppercase tracking-widest">
											{isPending ? "Cerrando..." : "Cerrar Sesión"}
										</span>
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
