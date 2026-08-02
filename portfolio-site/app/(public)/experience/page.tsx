/**
 * app/(public)/experience/page.tsx
 * Shows a CTA to explore other sections when there's no work experience yet.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { getExperience, getSettings } from "@/lib/data";
import { generatePageMetadata } from "@/lib/seo";
import { TimelineItem } from "@/components/public/TimelineItem";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { formatDateRange, getDuration } from "@/lib/utils";
import { ArrowRight, Briefcase } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return generatePageMetadata("Experience", "Work experience and professional background.", settings);
}

export default function ExperiencePage() {
  const experience = getExperience();
  const hasExperience = experience.length > 0;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute inset-0 hero-radial" />
        <div className="container-custom relative text-center">
          <ScrollReveal variant="fadeInUp">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
              <Briefcase size={12} />
              Work Experience
            </span>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-4">
              Work <span className="gradient-text">Experience</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              Professional experience, internships, and part-time work.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="container-custom max-w-3xl">
          {hasExperience ? (
            <div className="space-y-0">
              {experience.map((exp, i) => (
                <TimelineItem
                  key={exp.id}
                  logo={exp.logo}
                  iconFallback={exp.company.charAt(0)}
                  title={exp.position}
                  subtitle={`${exp.company} · ${exp.location}`}
                  dateRange={formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  badge={exp.type}
                  badgeVariant="secondary"
                  description={exp.description}
                  bullets={exp.responsibilities}
                  isLast={i === experience.length - 1}
                  index={i}
                >
                  {exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {exp.technologies.map((tech) => (
                        <span key={tech} className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </TimelineItem>
              ))}
            </div>
          ) : (
            /* Student CTA — no work experience yet */
            <ScrollReveal variant="scaleIn">
              <div className="card-glass p-12 text-center">
                <div className="text-6xl mb-4">🎓</div>
                <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-3">
                  Currently Focused on Studies
                </h2>
                <p className="text-[var(--text-muted)] mb-6 max-w-md mx-auto">
                  I&apos;m a 3rd year BSIT student at TUP actively building my
                  skills through projects, competitions, and coursework. I&apos;m
                  open to internship and part-time opportunities!
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                  <Link href="/projects">
                    <span className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all">
                      See My Projects <ArrowRight size={16} />
                    </span>
                  </Link>
                  <Link href="/contact">
                    <span className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)] hover:border-indigo-500/50 transition-all">
                      Hire / Collaborate
                    </span>
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto text-center">
                  {[
                    { emoji: "💻", label: "Projects Built" },
                    { emoji: "🏆", label: "Competitions" },
                    { emoji: "📜", label: "Certifications" },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-xl bg-[var(--bg-tertiary)]">
                      <p className="text-2xl mb-1">{item.emoji}</p>
                      <p className="text-xs text-[var(--text-muted)]">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>
    </div>
  );
}
