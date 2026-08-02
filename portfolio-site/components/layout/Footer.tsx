/**
 * components/layout/Footer.tsx
 * Site footer with social links, navigation, and copyright.
 * Server component — reads data server-side.
 */

import Link from "next/link";
import { Mail, MapPin, Heart, ArrowUpRight } from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaGlobe,
} from "react-icons/fa";
import { cn } from "@/lib/utils";
import type { Profile, Settings } from "@/types";

interface FooterProps {
  profile: Profile;
  settings: Settings;
}

const socialIconMap: Record<string, React.ElementType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  facebook: FaFacebook,
  instagram: FaInstagram,
  website: FaGlobe,
};

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "/skills" },
  { label: "Experience", href: "/experience" },
  { label: "Certifications", href: "/certifications" },
  { label: "Achievements", href: "/achievements" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export function Footer({ profile, settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const socialEntries = Object.entries(profile.social).filter(
    ([, url]) => !!url
  );

  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-display font-bold text-2xl gradient-text focus-ring inline-block mb-4"
            >
              {settings.nav.logo}
            </Link>
            <p className="text-sm text-[var(--text-muted)] max-w-sm leading-relaxed mb-6">
              {profile.tagline}
            </p>

            {/* Contact info */}
            <div className="space-y-2 mb-6">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-indigo-400 transition-colors"
              >
                <Mail size={14} className="shrink-0" />
                <span>{profile.email}</span>
              </a>
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <MapPin size={14} className="shrink-0" />
                <span>{profile.location}</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2 flex-wrap">
              {socialEntries.map(([platform, url]) => {
                const Icon = socialIconMap[platform] || FaGlobe;
                return (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center justify-center h-9 w-9 rounded-xl",
                      "bg-[var(--bg-tertiary)] border border-[var(--border-color)]",
                      "text-[var(--text-muted)] hover:text-indigo-400",
                      "hover:border-indigo-500/40 hover:bg-indigo-500/5",
                      "transition-all duration-200 focus-ring"
                    )}
                    aria-label={`Visit my ${platform}`}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4 uppercase tracking-widest">
              Navigation
            </h3>
            <ul className="space-y-2">
              {footerLinks.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-muted)] hover:text-indigo-400 transition-colors focus-ring flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-4 uppercase tracking-widest">
              More
            </h3>
            <ul className="space-y-2">
              {footerLinks.slice(5).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-muted)] hover:text-indigo-400 transition-colors focus-ring flex items-center gap-1 group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--text-muted)] hover:text-indigo-400 transition-colors focus-ring flex items-center gap-1 group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    Resume
                  </span>
                  <ArrowUpRight
                    size={12}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
            © {currentYear} {profile.name}. Made with{" "}
            <Heart size={11} className="text-red-400 fill-red-400 mx-0.5" />
            All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {profile.available && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available for hire
              </span>
            )}
            <Link
              href="/admin/login"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors focus-ring"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
