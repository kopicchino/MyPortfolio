"use client";

/**
 * components/public/TimelineItem.tsx
 * Animated timeline entry for education, experience, leadership, events.
 */

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface TimelineItemProps {
  logo?: string;
  iconFallback?: string; // First letters as fallback
  title: string;
  subtitle: string;
  dateRange: string;
  location?: string;
  badge?: string;
  badgeVariant?: "primary" | "success" | "secondary" | "info";
  description?: string;
  bullets?: string[];
  tags?: string[];
  isLast?: boolean;
  side?: "left" | "right"; // for alternating layout
  index?: number;
  children?: React.ReactNode;
}

export function TimelineItem({
  logo,
  iconFallback = "?",
  title,
  subtitle,
  dateRange,
  location,
  badge,
  badgeVariant = "primary",
  description,
  bullets = [],
  tags = [],
  isLast = false,
  index = 0,
  children,
}: TimelineItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <div className="relative flex gap-6 md:gap-8" ref={ref}>
      {/* Left column — dot + line */}
      <div className="flex flex-col items-center shrink-0">
        {/* Logo/icon circle */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{
            type: "spring" as const,
            stiffness: 260,
            damping: 20,
            delay: index * 0.08,
          }}
          className={cn(
            "relative z-10 flex items-center justify-center",
            "h-12 w-12 rounded-xl shrink-0",
            "bg-[var(--bg-card)] border-2 border-[var(--border-color)]",
            "shadow-md overflow-hidden"
          )}
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo}
              alt={subtitle}
              className="h-8 w-8 object-contain"
            />
          ) : (
            <span className="text-sm font-bold gradient-text">
              {iconFallback.slice(0, 2).toUpperCase()}
            </span>
          )}
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-xl border border-indigo-500/30 animate-ping opacity-20" />
        </motion.div>

        {/* Connector line */}
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0, originY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.08 + 0.3 }}
            className="w-px flex-1 mt-3 timeline-line min-h-[40px]"
          />
        )}
      </div>

      {/* Right column — content */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{
          duration: 0.5,
          delay: index * 0.08 + 0.1,
          ease: [0.215, 0.61, 0.355, 1],
        }}
        className={cn("flex-1 pb-10", isLast && "pb-0")}
      >
        <div className="card-glass p-5 md:p-6 group">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors">
                {title}
              </h3>
              <p className="text-sm font-medium text-indigo-400">{subtitle}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              {badge && (
                <Badge variant={badgeVariant} size="sm">
                  {badge}
                </Badge>
              )}
              <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">
                {dateRange}
              </span>
              {location && (
                <span className="text-xs text-[var(--text-muted)]">
                  📍 {location}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              {description}
            </p>
          )}

          {/* Bullet points */}
          {bullets.length > 0 && (
            <ul className="space-y-1.5 mb-4">
              {bullets.map((bullet, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Badge key={tag} variant="primary" size="xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Custom children content */}
          {children}
        </div>
      </motion.div>
    </div>
  );
}
