"use client";

/**
 * components/ui/Badge.tsx
 * Badge / pill component for tags, categories, status labels, etc.
 */

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline"
  | "ghost";

type BadgeSize = "xs" | "sm" | "md" | "lg";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
  children: ReactNode;
  dot?: boolean;
  dotColor?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-color)]",
  primary:
    "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 dark:bg-indigo-500/15",
  secondary:
    "bg-violet-500/10 text-violet-400 border border-violet-500/20 dark:bg-violet-500/15",
  success:
    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  warning:
    "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  danger:
    "bg-red-500/10 text-red-400 border border-red-500/20",
  info:
    "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  outline:
    "border border-[var(--border-color)] text-[var(--text-muted)] bg-transparent",
  ghost:
    "bg-transparent text-[var(--text-muted)]",
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: "px-1.5 py-0.5 text-[10px]",
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1 text-sm",
};

export function Badge({
  variant = "default",
  size = "sm",
  rounded = true,
  className,
  children,
  dot,
  dotColor,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium whitespace-nowrap",
        variantStyles[variant],
        sizeStyles[size],
        rounded ? "rounded-full" : "rounded-md",
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0",
            dotColor || "bg-current"
          )}
        />
      )}
      {children}
    </span>
  );
}

// Convenience components for common use cases
export function TechBadge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Badge variant="primary" size="sm" className={className}>
      {children}
    </Badge>
  );
}

export function CategoryBadge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Badge variant="secondary" size="sm" className={className}>
      {children}
    </Badge>
  );
}

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const variantMap: Record<string, BadgeVariant> = {
    completed: "success",
    "in progress": "info",
    archived: "default",
    active: "success",
    expired: "danger",
    current: "primary",
  };

  const variant = variantMap[status.toLowerCase()] || "default";

  return (
    <Badge variant={variant} size="sm" dot className={className}>
      {status}
    </Badge>
  );
}
