"use client";

/**
 * components/ui/Spinner.tsx
 * Loading spinner component — used by Button and skeleton states.
 */

import { cn } from "@/lib/utils";

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  color?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
  xs: "h-3 w-3 border",
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-2",
  xl: "h-12 w-12 border-[3px]",
};

export function Spinner({ size = "md", className, color }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "animate-spin rounded-full",
        "border-current border-t-transparent",
        sizeMap[size],
        color || "text-current opacity-75",
        className
      )}
    />
  );
}

// Full-page loading overlay
export function PageSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" className="text-indigo-500" />
        <p className="text-sm text-[var(--text-muted)] animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}

// Inline loading state
export function InlineSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-[var(--text-muted)]">
      <Spinner size="sm" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
