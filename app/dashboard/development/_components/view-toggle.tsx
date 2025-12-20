"use client";

import { Map, List } from "lucide-react";

import { cn } from "@/lib/cn";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import type { ViewPreference } from "../_hooks";

export interface ViewToggleProps {
  /** Current view preference */
  view: ViewPreference;
  /** Callback when view changes */
  onChange: (view: ViewPreference) => void;
  /** Optional className */
  className?: string;
  /** Whether the toggle is disabled */
  disabled?: boolean;
}

/**
 * ViewToggle - Toggle between Roadmap and List views
 *
 * Uses ToggleGroup from shadcn/ui with icons for each view mode.
 */
export function ViewToggle({
  view,
  onChange,
  className,
  disabled = false,
}: ViewToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={view}
      onValueChange={(value) => {
        if (value) {
          onChange(value as ViewPreference);
        }
      }}
      className={cn("bg-muted rounded-lg p-1", className)}
      disabled={disabled}
    >
      <ToggleGroupItem
        value="roadmap"
        aria-label="Vista Roadmap"
        className={cn(
          "gap-2 px-3 py-1.5 text-xs",
          view === "roadmap" && "bg-background shadow-sm"
        )}
      >
        <Map className="size-4" />
        <span className="hidden sm:inline">Roadmap</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="list"
        aria-label="Vista Lista"
        className={cn(
          "gap-2 px-3 py-1.5 text-xs",
          view === "list" && "bg-background shadow-sm"
        )}
      >
        <List className="size-4" />
        <span className="hidden sm:inline">Lista</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
