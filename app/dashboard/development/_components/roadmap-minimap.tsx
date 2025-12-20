/**
 * RoadmapMinimap Component
 *
 * Optional minimap for the Learning Path Flow visualization.
 * Shows an overview of all nodes for easy navigation.
 */

"use client";

import { memo } from "react";
import { MiniMap } from "@xyflow/react";

import { cn } from "@/lib/cn";

export interface RoadmapMinimapProps {
  /** Optional className for styling */
  className?: string;
  /** Whether to show the minimap */
  visible?: boolean;
}

/**
 * RoadmapMinimap - Overview minimap for roadmap navigation
 *
 * Uses React Flow's built-in MiniMap component with custom styling.
 */
function RoadmapMinimapComponent({
  className,
  visible = true,
}: RoadmapMinimapProps) {
  if (!visible) return null;

  return (
    <MiniMap
      className={cn("bg-background/80 backdrop-blur-sm rounded-lg", className)}
      nodeColor={(node) => {
        switch (node.type) {
          case "section":
            return "var(--color-muted)";
          case "module":
            // Color based on status if available
            const data = node.data as { status?: string } | undefined;
            switch (data?.status) {
              case "completed":
                return "var(--color-success)";
              case "in_progress":
                return "var(--color-warning)";
              case "locked":
                return "var(--color-muted)";
              default:
                return "var(--color-primary)";
            }
          default:
            return "var(--color-primary)";
        }
      }}
      nodeStrokeWidth={2}
      pannable
      zoomable
      position="bottom-right"
    />
  );
}

/**
 * Memoized RoadmapMinimap for performance
 */
export const RoadmapMinimap = memo(RoadmapMinimapComponent);
