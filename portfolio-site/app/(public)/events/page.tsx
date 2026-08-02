/**
 * app/(public)/events/page.tsx — Events Page
 */

import type { Metadata } from "next";
import Image from "next/image";
import { getEvents, getSettings } from "@/lib/data";
import { generatePageMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/public/SectionHeader";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/animations/ScrollReveal";
import { Badge } from "@/components/ui/Badge";
import { formatDateShort, uniqueValues } from "@/lib/utils";
import { Calendar, MapPin, Users, ExternalLink } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return generatePageMetadata(
    "Events",
    "Conferences, hackathons, workshops, and tech events I've attended or participated in.",
    settings
  );
}

const roleColorMap: Record<string, string> = {
  Speaker: "warning",
  Organizer: "primary",
  Participant: "secondary",
  Attendee: "default",
  Judge: "info",
  Mentor: "success",
};

export default function EventsPage() {
  const events = getEvents();
  const types = uniqueValues(events.map((e) => e.type));

  return (
    <div className="min-h-screen">
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute inset-0 hero-radial" />
        <div className="container-custom relative text-center">
          <ScrollReveal variant="fadeInUp">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
              <Calendar size={12} />
              Events & Conferences
            </span>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-4">
              Events &amp; <span className="gradient-text">Conferences</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              Hackathons, tech conferences, workshops, and community events
              I&apos;ve participated in or helped organize.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Events by type */}
      {types.map((type, typeIdx) => {
        const typeEvents = events.filter((e) => e.type === type);
        return (
          <section
            key={type}
            className={`section ${typeIdx % 2 === 1 ? "bg-[var(--bg-secondary)]" : ""}`}
          >
            <div className="container-custom">
              <ScrollReveal variant="fadeInLeft">
                <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-3">
                  <span className="h-6 w-1.5 rounded-full gradient-bg" />
                  {type}s
                </h2>
              </ScrollReveal>

              <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
                {typeEvents.map((event) => (
                  <StaggerItem key={event.id}>
                    <div id={event.id} className="card-glass overflow-hidden group flex flex-col h-full">
                      {/* Cover */}
                      <div className="relative h-44 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 overflow-hidden shrink-0">
                        {event.coverImage ? (
                          <Image src={event.coverImage} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-5xl">🎯</div>
                        )}
                        {event.featured && (
                          <div className="absolute top-3 right-3">
                            <Badge variant="warning" size="xs">⭐ Featured</Badge>
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3">
                          <Badge variant={roleColorMap[event.role] as "warning" | "primary" | "secondary" | "default" | "info" | "success" ?? "default"} size="xs">
                            {event.role}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-display font-bold text-base text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors mb-3 leading-snug">
                          {event.title}
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 flex-1">
                          {event.description}
                        </p>

                        {/* Meta info */}
                        <div className="space-y-1.5 mb-4 text-xs text-[var(--text-muted)]">
                          <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-indigo-400 shrink-0" />
                            <span>{formatDateShort(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={12} className="text-indigo-400 shrink-0" />
                            <span>{event.location}</span>
                            {event.online && <span className="text-emerald-400">(Online)</span>}
                          </div>
                          {event.organizer && (
                            <div className="flex items-center gap-2">
                              <Users size={12} className="text-indigo-400 shrink-0" />
                              <span>{event.organizer}</span>
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {event.tags.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="primary" size="xs">{tag}</Badge>
                          ))}
                        </div>

                        {/* Links */}
                        <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-color)] mt-auto">
                          {event.website && (
                            <a href={event.website} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-indigo-400 border border-[var(--border-color)] transition-colors">
                              <ExternalLink size={11} /> Website
                            </a>
                          )}
                          {event.certificate && (
                            <a href={event.certificate} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">
                              Certificate
                            </a>
                          )}
                          {event.result && (
                            <span className="ml-auto text-xs font-semibold text-amber-400">🏆 {event.result}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerReveal>
            </div>
          </section>
        );
      })}
    </div>
  );
}
