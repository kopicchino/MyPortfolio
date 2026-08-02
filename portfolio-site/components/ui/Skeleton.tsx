"use client";

/**
 * components/ui/Skeleton.tsx
 * Loading skeleton components that match the shape of actual content.
 */

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  rounded?: boolean;
}

// Base skeleton element
export function Skeleton({ className, rounded = false }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton",
        rounded ? "rounded-full" : "rounded-lg",
        className
      )}
    />
  );
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <Skeleton className="h-48 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-9 w-24 rounded-xl" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}

// Profile card skeleton
export function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="h-32 w-32" rounded />
      <div className="space-y-2 w-full max-w-xs text-center">
        <Skeleton className="h-7 w-3/4 mx-auto" />
        <Skeleton className="h-5 w-1/2 mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5 mx-auto" />
      </div>
    </div>
  );
}

// Timeline item skeleton
export function TimelineSkeleton() {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <Skeleton className="h-10 w-10" rounded />
        <Skeleton className="w-0.5 h-full mt-2" />
      </div>
      <div className="flex-1 pb-8 space-y-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </div>
  );
}

// Stat card skeleton
export function StatSkeleton() {
  return (
    <div className="card p-6 space-y-2">
      <Skeleton className="h-10 w-10" rounded />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

// Hero skeleton
export function HeroSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-3xl mx-auto text-center space-y-6 px-4">
        <ProfileSkeleton />
        <div className="space-y-3">
          <Skeleton className="h-14 w-4/5 mx-auto" />
          <Skeleton className="h-14 w-3/5 mx-auto" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
        </div>
        <div className="flex gap-4 justify-center">
          <Skeleton className="h-12 w-36 rounded-xl" />
          <Skeleton className="h-12 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Table row skeleton
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton
            className={cn(
              "h-4",
              i === 0 ? "w-32" : i === columns - 1 ? "w-20" : "w-24"
            )}
          />
        </td>
      ))}
    </tr>
  );
}

// Gallery item skeleton
export function GalleryItemSkeleton() {
  return (
    <div className="masonry-item">
      <Skeleton
        className={cn(
          "w-full",
          Math.random() > 0.5 ? "h-48" : "h-64"
        )}
      />
    </div>
  );
}
