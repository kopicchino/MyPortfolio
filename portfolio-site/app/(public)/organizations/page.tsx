/**
 * app/(public)/organizations/page.tsx — Organizations Page
 */

import type { Metadata } from "next";
import Image from "next/image";
import { getOrganizations, getSettings } from "@/lib/data";
import { generatePageMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/public/SectionHeader";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/animations/ScrollReveal";
import { Badge } from "@/components/ui/Badge";
import { formatDateRange } from "@/lib/utils";
import { Users, ExternalLink } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return generatePageMetadata(
    "Organizations",
    "Professional organizations, clubs, and communities I've been a part of.",
    settings
  );
}

export default function OrganizationsPage() {
  const organizations = getOrganizations();

  return (
    <div className="min-h-screen">
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute inset-0 hero-radial" />
        <div className="container-custom relative text-center">
          <ScrollReveal variant="fadeInUp">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
              <Users size={12} />
              Community
            </span>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-4">
              My <span className="gradient-text">Organizations</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              Communities and organizations I&apos;ve contributed to and grown
              with throughout my career.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
            {organizations.map((org) => (
              <StaggerItem key={org.id}>
                <div className="card-glass p-6 group flex flex-col h-full">
                  {/* Logo + header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="h-14 w-14 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-center overflow-hidden shrink-0">
                      {org.logo ? (
                        <Image src={org.logo} alt={org.name} width={44} height={44} className="object-contain" />
                      ) : (
                        <Users size={24} className="text-indigo-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start gap-2 mb-1">
                        <Badge variant={org.current ? "success" : "default"} size="xs" dot={org.current}>
                          {org.current ? "Active" : "Alumni"}
                        </Badge>
                        <Badge variant="secondary" size="xs">{org.category}</Badge>
                      </div>
                      <h3 className="font-display font-bold text-base text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors leading-snug">
                        {org.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-indigo-400 mb-2">{org.role}</p>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed flex-1 mb-4">
                    {org.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)] mt-auto">
                    <span className="text-xs text-[var(--text-muted)]">
                      {formatDateRange(org.startDate, org.endDate, org.current)}
                    </span>
                    {org.website && (
                      <a href={org.website} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300">
                        <ExternalLink size={12} /> Website
                      </a>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>
    </div>
  );
}
