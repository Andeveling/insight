import type { ReactNode } from "react";

interface DevelopmentLayoutProps {
  children: ReactNode;
}

/**
 * Development Feature Layout
 *
 * Simplified layout - navigation is handled by main sidebar
 */
export default function DevelopmentLayout({
  children,
}: DevelopmentLayoutProps) {
  return <>{children}</>;
}
