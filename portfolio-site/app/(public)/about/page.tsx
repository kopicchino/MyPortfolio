/**
 * app/(public)/about/page.tsx — About Page
 * Biography, mission/vision, timeline, and quick facts.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProfile, getSettings } from "@/lib/data";
import { generatePageMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/public/SectionHeader";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/animations/ScrollReveal";
import { Badge } from "@/components/ui/Badge";
import { MotionButton } from "@/components/ui/Button";
import {
  MapPin, Mail, Phone, Calendar, Download,
  ArrowRight, Target, Eye, Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return generatePageMetadata(
    "About",
    "Learn more about my background, mission, and what drives me as a developer.",
    settings
  );
}

export default function AboutPage() {
  const profile = getProfile();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute inset-0 hero-radial" />

        <div className="container-custom relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — Avatar */}
            <ScrollReveal variant="fadeInLeft">
              <div className="flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 blur-2xl opacity-20 scale-105" />
                  <div className="relative h-80 w-80 md:h-96 md:w-96 rounded-2xl overflow-hidden border-2 border-[var(--border-color)]">
                    {profile.avatar ? (
                      <Image
                        src={profile.avatar}
                        alt={profile.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 gradient-bg flex items-center justify-center">
                        <span className="font-display text-9xl font-black text-white/30">
                          {profile.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Quick info card */}
                  <div className="absolute -bottom-4 -right-4 card p-4 space-y-1.5 min-w-[180px]">
                    {profile.available && (
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-medium text-emerald-400">
                          Available to hire
                        </span>
                      </div>
                    )}
                    <p className="text-xs font-bold text-[var(--text-primary)]">{profile.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{profile.title}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right — Content */}
            <div>
              <ScrollReveal variant="fadeInRight" delay={0.1}>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
                  <Sparkles size={12} />
                  About Me
                </span>
              </ScrollReveal>

              <ScrollReveal variant="fadeInRight" delay={0.15}>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                  I&apos;m{" "}
                  <span className="gradient-text">{profile.name}</span>
                </h1>
              </ScrollReveal>

              <ScrollReveal variant="fadeInRight" delay={0.2}>
                <div className="space-y-4 text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
                  {profile.bio
                    .split(/\n\s*\n/)
                    .filter(Boolean)
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph.trim()}</p>
                    ))}
                </div>
              </ScrollReveal>

              {/* Contact info */}
              <ScrollReveal variant="fadeInRight" delay={0.25}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                    <div className="p-2 rounded-lg bg-indigo-500/10">
                      <Mail size={14} className="text-indigo-400" />
                    </div>
                    <a href={`mailto:${profile.email}`} className="hover:text-indigo-400 transition-colors">
                      {profile.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                    <div className="p-2 rounded-lg bg-indigo-500/10">
                      <Phone size={14} className="text-indigo-400" />
                    </div>
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                    <div className="p-2 rounded-lg bg-indigo-500/10">
                      <MapPin size={14} className="text-indigo-400" />
                    </div>
                    <span>{profile.location}</span>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fadeInRight" delay={0.3}>
                <div className="flex flex-wrap gap-3">
                  <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                    <MotionButton variant="gradient" leftIcon={<Download size={16} />}>
                      Download Resume
                    </MotionButton>
                  </a>
                  <Link href="/contact">
                    <MotionButton variant="outline" rightIcon={<ArrowRight size={16} />}>
                      Contact Me
                    </MotionButton>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="section-sm bg-[var(--bg-secondary)]">
        <div className="container-custom">
          <StaggerReveal
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            staggerDelay={0.08}
          >
            {profile.quickFacts.map((fact, i) => (
              <StaggerItem key={fact.label}>
                <div className="card-glass p-5 text-center">
                  <p className="text-lg font-bold text-indigo-400 mb-1">{fact.value}</p>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">{fact.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container-custom">
          <SectionHeader
            badge="Purpose"
            title="What Drives "
            highlight="Me"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal variant="fadeInLeft" delay={0.1}>
              <div className="card-glass p-8 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-indigo-500/10">
                    <Target size={24} className="text-indigo-400" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">Mission</h3>
                </div>
                <div className="space-y-3 text-[var(--text-secondary)] leading-relaxed">
                  {profile.mission
                    .split(/\n\s*\n/)
                    .filter(Boolean)
                    .map((p, i) => (
                      <p key={i}>{p.trim()}</p>
                    ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeInRight" delay={0.15}>
              <div className="card-glass p-8 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-violet-500/10">
                    <Eye size={24} className="text-violet-400" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">Vision</h3>
                </div>
                <div className="space-y-3 text-[var(--text-secondary)] leading-relaxed">
                  {profile.vision
                    .split(/\n\s*\n/)
                    .filter(Boolean)
                    .map((p, i) => (
                      <p key={i}>{p.trim()}</p>
                    ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
