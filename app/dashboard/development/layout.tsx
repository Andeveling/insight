import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { BookOpen, Trophy, Users, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/cn";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface DevelopmentLayoutProps {
  children: ReactNode;
}

/**
 * Development Feature Layout
 *
 * Provides navigation between development sub-pages:
 * - Dashboard (overview, XP, level)
 * - Modules (browse and start modules)
 * - Badges (achievement gallery)
 * - Community (peer learners)
 */
export default function DevelopmentLayout({
  children,
}: DevelopmentLayoutProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <Suspense fallback={<NavSkeleton />}>
          <DevelopmentNav />
        </Suspense>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

/**
 * Navigation Skeleton
 */
function NavSkeleton() {
  return (
    <div className="flex gap-2 p-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-9 w-24" />
      ))}
    </div>
  );
}

/**
 * Dynamic Navigation Component
 */
async function DevelopmentNav() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const navItems = [
    {
      href: "/dashboard/development/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/development",
      label: "Módulos",
      icon: BookOpen,
    },
    {
      href: "/dashboard/development/badges",
      label: "Insignias",
      icon: Trophy,
    },
    {
      href: "/dashboard/development/community",
      label: "Comunidad",
      icon: Users,
    },
  ];

  return (
    <div className="flex items-center gap-1 overflow-x-auto px-4 py-3">
      {navItems.map((item) => (
        <NavLink key={item.href} href={item.href}>
          <item.icon className="h-4 w-4" />
          <span className="hidden sm:inline">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
}

/**
 * Navigation Link Component
 */
function NavLink({ href, children }: { href: string; children: ReactNode }) {
  // Using plain Link without active state detection for now
  // Active state would require usePathname which needs 'use client'
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
        "text-muted-foreground transition-colors",
        "hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {children}
    </Link>
  );
}
