"use client";

/**
 * components/animations/ScrollReveal.tsx
 * Scroll-triggered animation wrapper using Framer Motion's useInView.
 */

import { useRef, type ReactNode } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimationVariant =
  | "fadeIn"
  | "fadeInUp"
  | "fadeInDown"
  | "fadeInLeft"
  | "fadeInRight"
  | "scaleIn"
  | "slideUp";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

const animationMap: Record<
  AnimationVariant,
  { hidden: Variants["hidden"]; visible: Variants["visible"] }
> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
};

export function ScrollReveal({
  children,
  variant = "fadeInUp",
  delay = 0,
  duration = 0.6,
  threshold = 0.15,
  className,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
  });

  const animation = animationMap[variant];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: animation.hidden,
        visible: {
          ...animation.visible,
          transition: {
            duration,
            delay,
            ease: [0.215, 0.61, 0.355, 1],
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// ------------------------------------------------------------------
// Stagger children on scroll reveal
// ------------------------------------------------------------------
interface StaggerRevealProps {
  children: ReactNode;
  staggerDelay?: number;
  delay?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
  childVariant?: AnimationVariant;
}

export function StaggerReveal({
  children,
  staggerDelay = 0.08,
  delay = 0,
  threshold = 0.1,
  className,
  once = true,
  childVariant = "fadeInUp",
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const childAnim = animationMap[childVariant];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// ------------------------------------------------------------------
// Individual item for use inside StaggerReveal
// ------------------------------------------------------------------
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  variant?: AnimationVariant;
}

export function StaggerItem({
  children,
  className,
  variant = "fadeInUp",
}: StaggerItemProps) {
  const anim = animationMap[variant];
  return (
    <motion.div
      variants={{
        hidden: anim.hidden,
        visible: {
          ...anim.visible,
          transition: {
            duration: 0.6,
            ease: [0.215, 0.61, 0.355, 1],
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
