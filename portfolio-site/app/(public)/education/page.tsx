/**
 * app/(public)/education/page.tsx — Education Page
 * Timeline of schools, degrees, awards, courses, and activities.
 */

import type { Metadata } from "next";
import { getEducation, getSettings } from "@/lib/data";
import { generatePageMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/public/SectionHeader";
import { TimelineItem } from "@/components/public/TimelineItem";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/animations/ScrollReveal";
import { Badge } from "@/components/ui/Badge";
import { GraduationCap, Award, BookOpen, Activity } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return generatePageMetadata(
    "Education",
    "My academic background, degrees, academic awards, courses, and university activities.",
    settings
  );
}

export default function EducationPage() {
  const education = getEducation();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute inset-0 hero-radial" />
        <div className="container-custom relative text-center">
          <ScrollReveal variant="fadeInUp">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
              <GraduationCap size={12} />
              Academic Background
            </span>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-4">
              My <span className="gradient-text">Education</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              The academic journey that shaped my technical foundation, critical
              thinking, and passion for innovation.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container-custom max-w-4xl">
          <div className="space-y-0">
            {education.map((edu, i) => (
              <TimelineItem
                key={edu.id}
                logo={edu.logo}
                iconFallback={edu.school.charAt(0)}
                title={edu.degree}
                subtitle={edu.school}
                dateRange={`${edu.startYear} – ${edu.current ? "Present" : edu.endYear ?? ""}`}
                location={edu.location}
                badge={edu.current ? "Ongoing" : "Completed"}
                badgeVariant={edu.current ? "info" : "success"}
                description={edu.description}
                isLast={i === education.length - 1}
                index={i}
              >
                {/* Awards */}
                {edu.awards.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                    <div className="flex items-center gap-2 mb-2">
                      <Award size={14} className="text-amber-400" />
                      <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                        Awards & Honors
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {edu.awards.map((award) => (
                        <span
                          key={award.title}
                          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        >
                          🏅 {award.title} ({award.year})
                        </span>
                      ))}
                    </div>
                  </div>
                )}



                {/* Activities */}
                {edu.activities.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity size={14} className="text-violet-400" />
                      <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                        Activities
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {edu.activities.map((act) => (
                        <li
                          key={act}
                          className="flex items-start gap-2 text-xs text-[var(--text-secondary)]"
                        >
                          <span className="mt-1.5 h-1 w-1 rounded-full bg-violet-400 shrink-0" />
                          {act}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* GPA */}
                {edu.gpa && (
                  <div className="mt-3 inline-flex items-center gap-2">
                    <span className="text-xs text-[var(--text-muted)]">GPA:</span>
                    <span className="text-xs font-bold text-emerald-400">{edu.gpa}</span>
                  </div>
                )}
              </TimelineItem>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
