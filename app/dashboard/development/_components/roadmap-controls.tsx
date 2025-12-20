/**
 * RoadmapControls Component
 *
 * Zoom and navigation controls for the Learning Path Flow.
 */

"use client";

import { useReactFlow } from "@xyflow/react";
import { Maximize2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * RoadmapControls - Custom controls for React Flow
 *
 * Features:
 * - Zoom in/out buttons
 * - Fit view button to reset viewport
 * - Styled with Shadcn components
 */
export function RoadmapControls() {
	const { zoomIn, zoomOut, fitView } = useReactFlow();

	return (
		<TooltipProvider delayDuration={300}>
			<div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1 bg-background/80 backdrop-blur-sm rounded-lg border p-1 shadow-lg">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="size-8"
							onClick={() => zoomIn()}
							aria-label="Acercar"
						>
							<Plus className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="left">
						<p>Acercar</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="size-8"
							onClick={() => zoomOut()}
							aria-label="Alejar"
						>
							<Minus className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="left">
						<p>Alejar</p>
					</TooltipContent>
				</Tooltip>

				<div className="w-full h-px bg-border" />

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="size-8"
							onClick={() => fitView({ padding: 0.2 })}
							aria-label="Ajustar vista"
						>
							<Maximize2 className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="left">
						<p>Ajustar vista</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</TooltipProvider>
	);
}
