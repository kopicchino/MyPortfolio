"use client";

/**
 * components/admin/AdminHeader.tsx
 * Top header bar for the admin panel.
 */

import { useSession } from "next-auth/react";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Bell, Menu } from "lucide-react";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  title?: string;
}

export function AdminHeader({ onMenuToggle, title = "Admin" }: AdminHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-between px-4 md:px-6 shrink-0 z-10">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <Menu size={20} />
          </button>
        )}
        <h1 className="font-display font-bold text-lg text-[var(--text-primary)]">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle size="sm" />

        <button className="relative p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)] transition-colors">
          <Bell size={16} />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500" />
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-[var(--border-color)]">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {session?.user?.name?.charAt(0) ?? "A"}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-[var(--text-primary)]">
              {session?.user?.name ?? "Admin"}
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
