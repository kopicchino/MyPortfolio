/**
 * app/not-found.tsx — 404 Page
 */

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 hero-grid opacity-20" />
      <div className="absolute inset-0 hero-radial" />

      <div className="relative text-center px-4">
        <div className="font-display text-[180px] md:text-[240px] font-black leading-none gradient-text opacity-20 select-none absolute -top-20 left-1/2 -translate-x-1/2">
          404
        </div>

        <div className="relative z-10">
          <p className="text-8xl mb-6">🔍</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-[var(--text-muted)] mb-8 max-w-md mx-auto">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="px-8 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg"
            >
              Back to Home
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 rounded-2xl font-semibold text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)] hover:border-indigo-500/50 transition-all"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
