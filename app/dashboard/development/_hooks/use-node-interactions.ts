"use client";

import type { Node } from "@xyflow/react";
import { useCallback, useState } from "react";

import type { ModuleNodeData } from "../_schemas";

/**
 * Hook para manejar interacciones con nodos del roadmap.
 * Gestiona estado de selección y hover para mostrar paneles/tooltips.
 */
export function useNodeInteractions() {
	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
	const [selectedNodeData, setSelectedNodeData] =
		useState<ModuleNodeData | null>(null);
	const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
	const [isPanelOpen, setIsPanelOpen] = useState(false);

	/**
	 * Handler para click en nodo - abre panel de detalles
	 */
	const handleNodeClick = useCallback(
		(_event: React.MouseEvent, node: Node) => {
			// Solo manejar clicks en nodos de tipo 'module'
			if (node.type !== "module") return;

			const nodeData = node.data as ModuleNodeData;

			// No abrir panel para nodos locked
			if (nodeData.status === "locked") {
				return;
			}

			setSelectedNodeId(node.id);
			setSelectedNodeData(nodeData);
			setIsPanelOpen(true);
		},
		[],
	);

	/**
	 * Handler para cerrar el panel
	 */
	const handleClosePanel = useCallback(() => {
		setIsPanelOpen(false);
		// Pequeño delay antes de limpiar data para animación de cierre
		setTimeout(() => {
			setSelectedNodeId(null);
			setSelectedNodeData(null);
		}, 200);
	}, []);

	/**
	 * Handler para mouse enter en nodo
	 */
	const handleNodeMouseEnter = useCallback(
		(_event: React.MouseEvent, node: Node) => {
			if (node.type === "module") {
				setHoveredNodeId(node.id);
			}
		},
		[],
	);

	/**
	 * Handler para mouse leave en nodo
	 */
	const handleNodeMouseLeave = useCallback(() => {
		setHoveredNodeId(null);
	}, []);

	return {
		// State
		selectedNodeId,
		selectedNodeData,
		hoveredNodeId,
		isPanelOpen,

		// Handlers
		handleNodeClick,
		handleClosePanel,
		handleNodeMouseEnter,
		handleNodeMouseLeave,
	};
}

export type UseNodeInteractionsReturn = ReturnType<typeof useNodeInteractions>;
