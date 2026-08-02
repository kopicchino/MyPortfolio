/**
 * lib/utils.ts
 * Shared utility functions used across the application.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";

// ------------------------------------------------------------------
// Tailwind class merging
// ------------------------------------------------------------------
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ------------------------------------------------------------------
// Date formatting
// ------------------------------------------------------------------
export function formatDate(
  dateStr: string | null | undefined,
  fmt: string = "MMMM yyyy"
): string {
  if (!dateStr) return "";
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return dateStr;
    return format(date, fmt);
  } catch {
    return dateStr;
  }
}

export function formatDateRange(
  startDate: string,
  endDate?: string | null,
  current?: boolean
): string {
  const start = formatDate(startDate, "MMM yyyy");
  if (current) return `${start} – Present`;
  if (!endDate) return start;
  const end = formatDate(endDate, "MMM yyyy");
  return `${start} – ${end}`;
}

export function formatDateShort(dateStr: string): string {
  return formatDate(dateStr, "MMM d, yyyy");
}

export function timeAgo(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return dateStr;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return dateStr;
  }
}

export function getDuration(
  startDate: string,
  endDate?: string | null,
  current?: boolean
): string {
  try {
    const start = parseISO(startDate);
    const end = current ? new Date() : endDate ? parseISO(endDate) : new Date();
    if (!isValid(start) || !isValid(end)) return "";

    const totalMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    const parts: string[] = [];
    if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
    if (months > 0) parts.push(`${months} mo${months > 1 ? "s" : ""}`);
    return parts.join(" ") || "< 1 month";
  } catch {
    return "";
  }
}

// ------------------------------------------------------------------
// String utilities
// ------------------------------------------------------------------
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .trim();
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ------------------------------------------------------------------
// File/Image utilities
// ------------------------------------------------------------------
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

export function sanitizeFilename(filename: string): string {
  const ext = getFileExtension(filename);
  const base = filename.replace(`.${ext}`, "");
  return `${slugify(base)}.${ext}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ["jpg", "jpeg", "png", "webp", "svg", "gif", "avif"].includes(ext);
}

// ------------------------------------------------------------------
// Array utilities
// ------------------------------------------------------------------
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      if (!result[groupKey]) result[groupKey] = [];
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>
  );
}

export function uniqueValues<T>(array: T[]): T[] {
  return [...new Set(array)];
}

// ------------------------------------------------------------------
// URL utilities
// ------------------------------------------------------------------
export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export function ensureAbsoluteUrl(url: string, baseUrl: string): string {
  if (!url) return "";
  if (isExternalUrl(url)) return url;
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

// ------------------------------------------------------------------
// Number utilities
// ------------------------------------------------------------------
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

// ------------------------------------------------------------------
// Color / UI utilities
// ------------------------------------------------------------------
export function getLevelColor(level: number): string {
  if (level >= 90) return "text-emerald-400";
  if (level >= 75) return "text-blue-400";
  if (level >= 60) return "text-violet-400";
  return "text-slate-400";
}

export function getStatusColor(
  status: string
): { bg: string; text: string } {
  switch (status.toLowerCase()) {
    case "completed":
      return { bg: "bg-emerald-500/10", text: "text-emerald-400" };
    case "in progress":
      return { bg: "bg-blue-500/10", text: "text-blue-400" };
    case "archived":
      return { bg: "bg-slate-500/10", text: "text-slate-400" };
    default:
      return { bg: "bg-violet-500/10", text: "text-violet-400" };
  }
}

// ------------------------------------------------------------------
// Debounce
// ------------------------------------------------------------------
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
