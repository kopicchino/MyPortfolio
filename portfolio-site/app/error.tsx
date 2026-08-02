/**
 * app/error.tsx — Global error boundary
 */
"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl mb-4">💥</p>
        <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-2">Something went wrong</h2>
        <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto">{error.message || "An unexpected error occurred. Please try again."}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all">
            Try Again
          </button>
          <Link href="/" className="px-6 py-3 rounded-xl font-semibold text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)] transition-all">
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
