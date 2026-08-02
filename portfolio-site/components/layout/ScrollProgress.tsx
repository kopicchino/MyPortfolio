"use client";

/**
 * components/layout/ScrollProgress.tsx
 * Thin reading progress bar fixed at the top of the page.
 */

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)",
      }}
    />
  );
}
