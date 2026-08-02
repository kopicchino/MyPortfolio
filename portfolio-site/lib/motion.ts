/**
 * lib/motion.ts
 * Shared Framer Motion animation variants used across components.
 * Import these variants instead of defining them inline for consistency.
 */

import { type Variants, type Transition } from "framer-motion";

// ------------------------------------------------------------------
// Base transitions
// ------------------------------------------------------------------
export const easeOutCubic: Transition = {
  ease: [0.215, 0.61, 0.355, 1],
  duration: 0.6,
};

export const easeOutQuart: Transition = {
  ease: [0.165, 0.84, 0.44, 1],
  duration: 0.7,
};

export const spring: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 15,
  mass: 0.8,
};

export const springFast: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
};

// ------------------------------------------------------------------
// Common variants
// ------------------------------------------------------------------
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: easeOutCubic,
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: easeOutCubic,
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: easeOutCubic,
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: easeOutCubic,
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: easeOutCubic,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: easeOutCubic,
  },
};

export const scaleInSpring: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: spring,
  },
};

// ------------------------------------------------------------------
// Stagger container variants
// ------------------------------------------------------------------
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// ------------------------------------------------------------------
// Slide variants
// ------------------------------------------------------------------
export const slideInLeft: Variants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: easeOutQuart,
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

export const slideInRight: Variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: easeOutQuart,
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

// ------------------------------------------------------------------
// Page transition variants
// ------------------------------------------------------------------
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.3 },
  },
};

// ------------------------------------------------------------------
// Card hover variants
// ------------------------------------------------------------------
export const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: springFast,
  },
};

export const cardHoverGlow: Variants = {
  rest: { boxShadow: "0 0 0 0 rgba(99, 102, 241, 0)" },
  hover: {
    boxShadow: "0 0 30px 5px rgba(99, 102, 241, 0.15)",
    transition: { duration: 0.3 },
  },
};

// ------------------------------------------------------------------
// Progress bar variants (for skill bars)
// ------------------------------------------------------------------
export const progressBar = (width: number): Variants => ({
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    originX: 0,
    transition: {
      duration: 1.2,
      ease: [0.215, 0.61, 0.355, 1],
      delay: 0.2,
    },
  },
});

// ------------------------------------------------------------------
// Menu/overlay variants
// ------------------------------------------------------------------
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const drawerVariants: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", damping: 25, stiffness: 200 },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.25 },
  },
};

export const mobileMenuVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2, when: "afterChildren" },
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
};

export const menuItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

// ------------------------------------------------------------------
// Typewriter / character animation
// ------------------------------------------------------------------
export const charVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 },
  },
};

// ------------------------------------------------------------------
// Timeline item variants
// ------------------------------------------------------------------
export const timelineItem: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: easeOutCubic,
  },
};
