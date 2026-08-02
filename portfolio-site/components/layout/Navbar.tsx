"use client";

/**
 * components/layout/Navbar.tsx
 * Top navigation bar — sticky, glassmorphism, active link detection,
 * animated hamburger button, theme toggle, and hide-on-scroll functionality.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import type { NavLink } from "@/types";

interface NavbarProps {
  siteName: string;
  links: NavLink[];
}

export function Navbar({ siteName, links }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  // Hide navbar on scroll down, show on scroll up
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest > prev && latest > 80) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 20);
  });

  // Close mobile menu on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-40",
          "transition-all duration-300",
          scrolled ? "nav-blur" : "bg-transparent"
        )}
        animate={{
          y: hidden && !mobileOpen ? "-100%" : "0%",
        }}
        transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="font-display font-bold text-xl focus-ring"
            >
              <motion.span
                className="gradient-text"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {siteName}
              </motion.span>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-1">
              {links.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-3.5 py-2 rounded-lg text-sm font-medium",
                      "transition-colors duration-200 focus-ring",
                      active
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg bg-indigo-500/10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {/* Contact / Hire me CTA button */}
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "hidden sm:inline-flex items-center gap-2",
                  "px-4 py-2 rounded-xl text-sm font-medium",
                  "bg-gradient-to-r from-indigo-600 to-violet-600",
                  "text-white shadow-md",
                  "hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-violet-500",
                  "transition-shadow duration-200"
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Contact Me
              </motion.a>

              {/* Mobile Burger Style Toggle Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={cn(
                  "lg:hidden p-2.5 rounded-xl border border-[var(--border-color)]",
                  "bg-[var(--bg-card)] text-[var(--text-primary)]",
                  "hover:bg-[var(--bg-tertiary)] hover:border-indigo-500/40",
                  "transition-all duration-200 focus-ring relative"
                )}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                <motion.div
                  key={mobileOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu drawer */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={links}
        siteName={siteName}
      />

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}
