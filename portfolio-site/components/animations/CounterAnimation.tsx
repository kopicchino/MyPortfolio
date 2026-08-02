"use client";

/**
 * components/animations/CounterAnimation.tsx
 * Animates a numeric counter from 0 to target value when it enters view.
 */

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface CounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
  delay?: number;
}

export function Counter({
  target,
  duration = 2000,
  suffix = "",
  prefix = "",
  className,
  decimals = 0,
  delay = 0,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!isInView || hasStarted) return;

    const timer = setTimeout(() => {
      setHasStarted(true);
      const startTime = performance.now();
      const startValue = 0;

      const easeOutQuart = (t: number): number =>
        1 - Math.pow(1 - t, 4);

      const tick = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        const currentValue = startValue + (target - startValue) * easedProgress;

        setCount(parseFloat(currentValue.toFixed(decimals)));

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          setCount(target);
        }
      };

      requestAnimationFrame(tick);
    }, delay);

    return () => clearTimeout(timer);
  }, [isInView, hasStarted, target, duration, decimals, delay]);

  return (
    <span ref={ref} className={cn(className)}>
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : Math.round(count)}
      {suffix}
    </span>
  );
}

// ------------------------------------------------------------------
// Stat card with counter animation
// ------------------------------------------------------------------
interface StatCardProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  icon?: React.ReactNode;
  description?: string;
  delay?: number;
}

export function StatCard({
  value,
  label,
  suffix = "+",
  prefix = "",
  icon,
  description,
  delay = 0,
}: StatCardProps) {
  return (
    <div className="card-glass p-6 text-center group">
      {icon && (
        <div className="flex justify-center mb-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
            {icon}
          </div>
        </div>
      )}
      <div className="font-display text-4xl font-bold gradient-text mb-1">
        <Counter
          target={value}
          suffix={suffix}
          prefix={prefix}
          delay={delay}
          duration={2000}
        />
      </div>
      <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">
        {label}
      </div>
      {description && (
        <div className="text-xs text-[var(--text-muted)]">{description}</div>
      )}
    </div>
  );
}
