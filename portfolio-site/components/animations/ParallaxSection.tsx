"use client";

/**
 * components/animations/ParallaxSection.tsx
 * Parallax scroll effect wrapper using Framer Motion's useScroll + useTransform.
 */

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number; // 0 = no movement, 1 = same speed as scroll, 0.5 = half speed
  direction?: "up" | "down";
  className?: string;
}

export function ParallaxSection({
  children,
  speed = 0.4,
  direction = "up",
  className,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const factor = direction === "up" ? -speed * 100 : speed * 100;
  const rawY = useTransform(scrollYProgress, [0, 1], ["0%", `${factor}%`]);
  const y = useSpring(rawY, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

// ------------------------------------------------------------------
// Floating decoration element (for hero backgrounds)
// ------------------------------------------------------------------
interface FloatingElementProps {
  children?: React.ReactNode;
  amplitude?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

export function FloatingElement({
  children,
  amplitude = 12,
  duration = 6,
  delay = 0,
  className,
}: FloatingElementProps) {
  return (
    <motion.div
      animate={{
        y: [0, -amplitude, 0],
        rotate: [0, 2, 0, -2, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

// ------------------------------------------------------------------
// Parallax image (moves independently from its container)
// ------------------------------------------------------------------
interface ParallaxImageProps {
  scrollY: MotionValue<number>;
  speed?: number;
  className?: string;
  children: ReactNode;
}

export function ParallaxImage({
  scrollY,
  speed = 0.3,
  className,
  children,
}: ParallaxImageProps) {
  const y = useTransform(scrollY, (val) => val * speed);
  return (
    <motion.div style={{ y }} className={cn(className)}>
      {children}
    </motion.div>
  );
}
