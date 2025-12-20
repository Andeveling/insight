"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * View preference type for development roadmap
 */
export type ViewPreference = "roadmap" | "list";

const VIEW_PREFERENCE_KEY = "development-view-preference";

/**
 * Hook to manage view preference (roadmap vs list) with localStorage persistence
 *
 * @param defaultView - Default view if none is stored
 * @returns Current view preference and setter function
 *
 * @example
 * ```tsx
 * const { view, setView, isRoadmap, isList } = useViewPreference();
 *
 * return (
 *   <div>
 *     {isRoadmap ? <LearningPathFlow /> : <ModuleList />}
 *     <ViewToggle view={view} onChange={setView} />
 *   </div>
 * );
 * ```
 */
export function useViewPreference(defaultView: ViewPreference = "roadmap") {
  const [view, setViewState] = useState<ViewPreference>(defaultView);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load preference from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(VIEW_PREFERENCE_KEY);
      if (stored === "roadmap" || stored === "list") {
        setViewState(stored);
      }
    } catch {
      // localStorage not available (SSR or privacy mode)
    }
    setIsHydrated(true);
  }, []);

  // Persist preference to localStorage
  const setView = useCallback((newView: ViewPreference) => {
    setViewState(newView);
    try {
      localStorage.setItem(VIEW_PREFERENCE_KEY, newView);
    } catch {
      // localStorage not available
    }
  }, []);

  // Toggle between views
  const toggleView = useCallback(() => {
    setView(view === "roadmap" ? "list" : "roadmap");
  }, [view, setView]);

  return {
    /** Current view preference */
    view,
    /** Set view preference (persisted) */
    setView,
    /** Toggle between roadmap and list views */
    toggleView,
    /** Whether current view is roadmap */
    isRoadmap: view === "roadmap",
    /** Whether current view is list */
    isList: view === "list",
    /** Whether localStorage has been read (for hydration) */
    isHydrated,
  };
}

export type UseViewPreferenceReturn = ReturnType<typeof useViewPreference>;
