/**
 * app/(public)/projects/page.tsx — Projects Page (Server Wrapper)
 */

import type { Metadata } from "next";
import { getProjects, getSettings } from "@/lib/data";
import { generatePageMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/public/SectionHeader";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { ProjectsClient } from "@/components/public/ProjectsClient";
import { Code2 } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return generatePageMetadata(
    "Projects",
    "Explore my portfolio of full-stack web applications, tools, and open-source contributions.",
    settings
  );
}

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute inset-0 hero-radial" />
        <div className="container-custom relative text-center">
          <ScrollReveal variant="fadeInUp">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
              <Code2 size={12} />
              Portfolio
            </span>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-4">
              My <span className="gradient-text">Projects</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              A collection of projects I&apos;ve built — from side projects to
              production applications. Each one taught me something new.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Projects grid */}
      <section className="section">
        <div className="container-custom">
          <ProjectsClient projects={projects} />
        </div>
      </section>
    </div>
  );
}
