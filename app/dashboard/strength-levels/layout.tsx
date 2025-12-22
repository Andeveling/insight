/**
 * Strength Levels Layout
 * 
 * Layout wrapper for the strength maturity levels section.
 * Provides consistent styling and navigation context.
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Niveles de Madurez | Insight',
  description: 'Desarrolla tus fortalezas a través de niveles de madurez: Esponja, Conector, Guía y Alquimista.',
};

interface StrengthLevelsLayoutProps {
  children: React.ReactNode;
}

export default function StrengthLevelsLayout({ children }: StrengthLevelsLayoutProps) {
  return (
    <div className="relative min-h-full">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-tech opacity-5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              {/* Section Icon */}
              <div
                className="flex items-center justify-center w-10 h-10 bg-primary/10 border border-primary/30"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                }}
              >
                <span className="text-lg">🔮</span>
              </div>
              
              {/* Title */}
              <div>
                <h1 className="text-lg font-black uppercase tracking-[0.2em] text-foreground">
                  NIVELES DE MADUREZ
                </h1>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  SISTEMA DE PROGRESIÓN DE FORTALEZAS
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
