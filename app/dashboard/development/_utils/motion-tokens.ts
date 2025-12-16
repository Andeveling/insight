/**
 * Motion Tokens - Gaming Fluent Design System
 *
 * Consistent animation tokens for the development feature
 * using motion/react (Framer Motion v12).
 */

import type { Transition, Variants } from "motion/react";

/**
 * Base timing tokens
 */
export const TIMING = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  leisurely: 0.8,
} as const;

/**
 * Easing curves - Gaming Fluent Design
 */
export const EASING = {
  // Standard curves
  default: [ 0.4, 0, 0.2, 1 ] as const,
  easeOut: [ 0, 0, 0.2, 1 ] as const,
  easeIn: [ 0.4, 0, 1, 1 ] as const,
  // Gaming-specific curves
  bounce: [ 0.68, -0.6, 0.32, 1.6 ] as const,
  elastic: [ 0.22, 1, 0.36, 1 ] as const,
  sharp: [ 0.4, 0, 0.6, 1 ] as const,
} as const;

/**
 * Common transitions
 */
export const TRANSITIONS = {
  fadeIn: {
    duration: TIMING.normal,
    ease: EASING.easeOut,
  } as Transition,
  fadeOut: {
    duration: TIMING.fast,
    ease: EASING.easeIn,
  } as Transition,
  spring: {
    type: "spring",
    stiffness: 400,
    damping: 25,
  } as Transition,
  bounce: {
    type: "spring",
    stiffness: 500,
    damping: 15,
  } as Transition,
  smooth: {
    duration: TIMING.normal,
    ease: EASING.default,
  } as Transition,
  stagger: {
    staggerChildren: 0.08,
    delayChildren: 0.1,
  } as Transition,
} as const;

/**
 * Variant presets for common animations
 */
export const VARIANTS = {
  /**
   * Fade in from bottom (for cards, list items)
   */
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  } as Variants,

  /**
   * Scale in (for badges, icons)
   */
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  } as Variants,

  /**
   * Slide in from left (for panels)
   */
  slideInLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  } as Variants,

  /**
   * Slide in from right (for modals)
   */
  slideInRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  } as Variants,

  /**
   * Container for staggered children
   */
  staggerContainer: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: TRANSITIONS.stagger,
    },
    exit: { opacity: 0 },
  } as Variants,

  /**
   * Child item for stagger animation
   */
  staggerItem: {
    initial: { opacity: 0, y: 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: TRANSITIONS.spring,
    },
    exit: { opacity: 0, y: 8 },
  } as Variants,

  /**
   * Pulse animation for attention (badges, notifications)
   */
  pulse: {
    initial: { scale: 1 },
    animate: {
      scale: [ 1, 1.05, 1 ],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: EASING.elastic,
      },
    },
  } as Variants,

  /**
   * Glow effect for gaming elements
   */
  glow: {
    initial: { boxShadow: "0 0 0 0 rgba(var(--primary), 0)" },
    animate: {
      boxShadow: [
        "0 0 0 0 rgba(var(--primary), 0)",
        "0 0 20px 4px rgba(var(--primary), 0.3)",
        "0 0 0 0 rgba(var(--primary), 0)",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: EASING.default,
      },
    },
  } as Variants,

  /**
   * Hover lift effect for cards
   */
  hoverLift: {
    initial: { y: 0 },
    whileHover: {
      y: -4,
      transition: TRANSITIONS.spring,
    },
    whileTap: {
      y: 0,
      scale: 0.98,
    },
  } as Variants,

  /**
   * Button press effect
   */
  buttonPress: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  } as Variants,

  /**
   * Skeleton loading shimmer
   */
  shimmer: {
    initial: { x: "-100%" },
    animate: {
      x: "100%",
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear",
      },
    },
  } as Variants,
} as const;

/**
 * Gaming-specific animations for achievements/rewards
 */
export const GAMING_VARIANTS = {
  /**
   * XP gain pop animation
   */
  xpPop: {
    initial: { opacity: 0, scale: 0.5, y: 0 },
    animate: {
      opacity: [ 0, 1, 1, 0 ],
      scale: [ 0.5, 1.2, 1, 0.8 ],
      y: [ 0, -30, -50, -60 ],
      transition: {
        duration: 1.2,
        ease: EASING.bounce,
      },
    },
  } as Variants,

  /**
   * Badge unlock celebration
   */
  badgeUnlock: {
    initial: { opacity: 0, scale: 0, rotate: -180 },
    animate: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        ...TRANSITIONS.bounce,
        duration: 0.6,
      },
    },
  } as Variants,

  /**
   * Progress bar fill
   */
  progressFill: {
    initial: { scaleX: 0 },
    animate: (progress: number) => ({
      scaleX: progress,
      transition: {
        duration: TIMING.slow,
        ease: EASING.easeOut,
      },
    }),
  } as Variants,

  /**
   * Level up celebration
   */
  levelUp: {
    initial: { opacity: 0, scale: 0.3 },
    animate: {
      opacity: [ 0, 1, 1, 0 ],
      scale: [ 0.3, 1.3, 1, 0.9 ],
      transition: {
        duration: 1.5,
        times: [ 0, 0.3, 0.7, 1 ],
        ease: EASING.elastic,
      },
    },
  } as Variants,

  /**
   * Streak flame flicker
   */
  flameFlicker: {
    animate: {
      scale: [ 1, 1.1, 1 ],
      opacity: [ 0.8, 1, 0.8 ],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  } as Variants,
} as const;

/**
 * Helper to create custom stagger animation
 */
export function createStagger(
  staggerDelay: number = 0.08,
  childDelay: number = 0.1
): Variants {
  return {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: childDelay,
      },
    },
    exit: { opacity: 0 },
  };
}

/**
 * Helper to create fade in animation with custom offset
 */
export function createFadeIn(
  offsetY: number = 20,
  duration: number = TIMING.normal
): Variants {
  return {
    initial: { opacity: 0, y: offsetY },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration, ease: EASING.easeOut },
    },
    exit: { opacity: 0, y: offsetY / 2 },
  };
}
