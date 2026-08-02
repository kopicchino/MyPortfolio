"use client";

/**
 * components/public/SectionHeader.tsx
 * Reusable section heading with animated underline and optional badge/subtitle.
 */

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  highlight?: string; // portion of title to render in gradient
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  highlight,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  const alignClass = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }[align];

  // Split title around the highlight word for gradient rendering
  const renderTitle = () => {
    if (!highlight) {
      return <span>{title}</span>;
    }
    const parts = title.split(highlight);
    return (
      <>
        {parts[0]}
        <span className="gradient-text">{highlight}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className={cn("flex flex-col gap-3 mb-12", alignClass, className)}>
      {badge && (
        <ScrollReveal variant="fadeInDown" delay={0}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <span className="h-1 w-1 rounded-full bg-indigo-400" />
            {badge}
          </span>
        </ScrollReveal>
      )}

      <ScrollReveal variant="fadeInUp" delay={0.1}>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] text-balance">
          {renderTitle()}
        </h2>
      </ScrollReveal>

      {subtitle && (
        <ScrollReveal variant="fadeInUp" delay={0.2}>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl text-balance">
            {subtitle}
          </p>
        </ScrollReveal>
      )}

      {/* Decorative line */}
      <ScrollReveal variant="scaleIn" delay={0.3}>
        <div
          className={cn(
            "h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500",
            align === "center" && "mx-auto",
            align === "right" && "ml-auto"
          )}
        />
      </ScrollReveal>
    </div>
  );
}
