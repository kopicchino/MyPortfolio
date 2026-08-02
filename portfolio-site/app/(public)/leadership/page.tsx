/**
 * app/(public)/leadership/page.tsx — Leadership Page
 */

import type { Metadata } from "next";
import { getLeadership, getSettings } from "@/lib/data";
import { generatePageMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/public/SectionHeader";
import { TimelineItem } from "@/components/public/TimelineItem";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Badge } from "@/components/ui/Badge";
import { formatDateRange } from "@/lib/utils";
import { Star } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return generatePageMetadata(
    "Leadership",
    "Leadership roles, responsibilities, and impact across organizations and initiatives.",
    settings
  );
}

export default function LeadershipPage() {
  const leadership = getLeadership();

  return (
    <div className="min-h-screen">
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute inset-0 hero-radial" />
        <div className="container-custom relative text-center">
          <ScrollReveal variant="fadeInUp">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-4">
              <Star size={12} />
              Leadership
            </span>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-4">
              Leadership <span className="gradient-text">Roles</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              Positions of responsibility where I led teams, organized events,
              and drove meaningful impact.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="container-custom max-w-4xl">
          <div className="space-y-0">
            {leadership.map((item, i) => (
              <TimelineItem
                key={item.id}
                logo={item.organizationLogo}
                iconFallback={item.organization.charAt(0)}
                title={item.title}
                subtitle={item.organization}
                dateRange={formatDateRange(item.startDate, item.endDate, item.current)}
                badge={item.current ? "Active" : "Completed"}
                badgeVariant={item.current ? "success" : "primary"}
                description={item.description}
                bullets={item.responsibilities}
                isLast={i === leadership.length - 1}
                index={i}
              >
                {/* Achievements */}
                {item.achievements.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                    <p className="text-xs font-semibold text-violet-400 uppercase tracking-wide mb-2">
                      ✨ Accomplishments
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.achievements.map((ach, j) => (
                        <span key={j} className="text-xs text-[var(--text-secondary)] bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/20">
                          {ach}
                        </span>
                      ))}
                    </div>
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
