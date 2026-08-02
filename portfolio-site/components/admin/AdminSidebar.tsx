"use client";

/**
 * components/admin/AdminSidebar.tsx
 * Collapsible admin sidebar with navigation.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, User, GraduationCap, FolderKanban,
  Trophy, ShieldCheck, Users, CalendarDays, Images,
  Star, Briefcase, Cpu, Heart, MessageSquare,
  Settings, LogOut, ChevronLeft, ChevronRight,
} from "lucide-react";

const navSections = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Messages", href: "/admin/messages", icon: MessageSquare },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Profile", href: "/admin/profile", icon: User },
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "Experience", href: "/admin/experience", icon: Briefcase },
      { label: "Education", href: "/admin/education", icon: GraduationCap },
      { label: "Skills", href: "/admin/skills", icon: Cpu },
      { label: "Achievements", href: "/admin/achievements", icon: Trophy },
      { label: "Certifications", href: "/admin/certifications", icon: ShieldCheck },
      { label: "Organizations", href: "/admin/organizations", icon: Users },
      { label: "Events", href: "/admin/events", icon: CalendarDays },
      { label: "Leadership", href: "/admin/leadership", icon: Star },
      { label: "Volunteer", href: "/admin/volunteer", icon: Heart },
      { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
      { label: "Gallery", href: "/admin/gallery", icon: Images },
    ],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative flex flex-col h-screen bg-[var(--bg-secondary)] border-r border-[var(--border-color)] shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-[var(--border-color)]">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.span
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-display font-bold text-lg gradient-text whitespace-nowrap"
            >
              Admin Panel
            </motion.span>
          ) : (
            <motion.span
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-display font-bold text-lg gradient-text"
            >
              A
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {navSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                {section.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
                        active
                          ? "bg-indigo-500/10 text-indigo-400"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]",
                        collapsed && "justify-center"
                      )}
                    >
                      <Icon size={18} className="shrink-0" />
                      {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[var(--border-color)] space-y-1">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium",
            "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all",
            collapsed && "justify-center"
          )}
          title={collapsed ? "View Site" : undefined}
        >
          <ChevronLeft size={18} className="shrink-0" />
          {!collapsed && <span>View Site</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium",
            "text-red-400 hover:bg-red-500/10 transition-all",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute top-4 -right-3 z-10 h-6 w-6 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shadow-sm"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
