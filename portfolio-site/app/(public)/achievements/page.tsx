/**
 * app/(public)/achievements/page.tsx — Achievements Page
 */

import type { Metadata } from "next";
import Image from "next/image";
import { getAchievements, getSettings } from "@/lib/data";
import { generatePageMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/public/SectionHeader";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/animations/ScrollReveal";
import { Badge } from "@/components/ui/Badge";
import { formatDateShort } from "@/lib/utils";
import { Trophy, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return generatePageMetadata(
    "Achievements",
    "Awards, recognitions, and accomplishments earned throughout my academic and professional career.",
    settings
  );
}

const typeColorMap: Record<string, string> = {
  Award: "amber",
  Recognition: "indigo",
  Competition: "violet",
  Scholarship: "emerald",
  Other: "slate",
};

export default function AchievementsPage() {
  const achievements = getAchievements();
  const featured = achievements.filter((a) => a.featured);
  const rest = achievements.filter((a) => !a.featured);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute inset-0 hero-radial" />
        <div className="container-custom relative text-center">
          <ScrollReveal variant="fadeInUp">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
              <Trophy size={12} />
              Recognitions
            </span>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-4">
              My <span className="gradient-text">Achievements</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              Awards, recognitions, and milestones that mark my journey in
              technology and leadership.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured achievements */}
      {featured.length > 0 && (
        <section className="section">
          <div className="container-custom">
            <SectionHeader badge="Highlights" title="Featured" highlight=" Awards" align="left" />
            <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.1}>
              {featured.map((ach) => (
                <StaggerItem key={ach.id}>
                  <div
                    id={ach.id}
                    className="card-glass p-6 flex gap-5 group hover:border-amber-500/30 transition-colors"
                  >
                    {/* Image */}
                    <div className="h-20 w-20 rounded-xl bg-[var(--bg-tertiary)] overflow-hidden shrink-0">
                      {ach.image ? (
                        <Image src={ach.image} alt={ach.title} width={80} height={80} className="object-cover h-full w-full" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-3xl">🏆</div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-start gap-2 mb-2">
                        <Badge variant="warning" size="xs">{ach.type}</Badge>
                        <span className="text-xs text-[var(--text-muted)]">
                          {formatDateShort(ach.date)}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-base text-[var(--text-primary)] group-hover:text-amber-400 transition-colors mb-1">
                        {ach.title}
                      </h3>
                      <p className="text-xs text-indigo-400 font-medium mb-2">{ach.organizer}</p>
                      <p className="text-sm text-[var(--text-muted)] line-clamp-2">{ach.description}</p>

                      {ach.certificate && (
                        <a href={ach.certificate} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs text-indigo-400 hover:text-indigo-300">
                          <ExternalLink size={11} /> View Certificate
                        </a>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerReveal>
          </div>
        </section>
      )}

      {/* All achievements */}
      {rest.length > 0 && (
        <section className="section bg-[var(--bg-secondary)]">
          <div className="container-custom">
            <SectionHeader badge="All" title="More " highlight="Achievements" align="left" />
            <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.06}>
              {rest.map((ach) => (
                <StaggerItem key={ach.id}>
                  <div id={ach.id} className="card-glass p-5 group">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl shrink-0">
                        {ach.type === "Award" ? "🏅" : ach.type === "Scholarship" ? "🎓" : "⭐"}
                      </span>
                      <div>
                        <h3 className="font-semibold text-sm text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors leading-snug">
                          {ach.title}
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{ach.organizer}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="primary" size="xs">{ach.category}</Badge>
                      <span className="text-xs text-[var(--text-muted)]">{formatDateShort(ach.date)}</span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerReveal>
          </div>
        </section>
      )}
    </div>
  );
}
