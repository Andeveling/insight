/**
 * CyberPunk UI Design System - Clip Path Constants
 *
 * Geometría industrial para contenedores y elementos.
 * Los bordes redondeados no existen - solo polígonos agresivos.
 *
 * @see docs/design-system/cyberpunk-ui.md
 */

export const CLIP_PATHS = {
	/**
	 * Large containers (16px cutoff)
	 * Para cards principales y contenedores de nivel superior
	 */
	large:
		"polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",

	/**
	 * Medium containers (12px cutoff)
	 * Para botones principales y sub-contenedores
	 */
	medium:
		"polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",

	/**
	 * Small containers (8px cutoff)
	 * Para badges, inputs y elementos pequeños
	 */
	small:
		"polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",

	/**
	 * Hexagonal shape
	 * Para iconos, avatares y elementos decorativos
	 */
	hex: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
} as const;

export type ClipPathSize = keyof typeof CLIP_PATHS;
