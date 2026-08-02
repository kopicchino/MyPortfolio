/**
 * app/(public)/loading.tsx — Shared loading skeleton for public pages
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 opacity-20 animate-pulse" />
        </div>
        <p className="text-sm text-[var(--text-muted)] animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
