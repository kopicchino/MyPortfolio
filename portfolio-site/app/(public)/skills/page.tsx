/**
 * app/(public)/skills/page.tsx — Skills Page
 * Animated skill bars grouped by category.
 */

import type { Metadata } from "next";
import { getSkills, getSettings } from "@/lib/data";
import { generatePageMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/public/SectionHeader";
import { SkillCategoryCard } from "@/components/public/SkillBar";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Cpu, Monitor, Server, Database, Cloud, Wrench } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return generatePageMetadata(
    "Skills",
    "A comprehensive overview of my technical skills across frontend, backend, database, and cloud technologies.",
    settings
  );
}

const iconMap: Record<string, React.ReactNode> = {
  Monitor: <Monitor size={18} />,
  Server: <Server size={18} />,
  Database: <Database size={18} />,
  Cloud: <Cloud size={18} />,
  Wrench: <Wrench size={18} />,
  Cpu: <Cpu size={18} />,
};

export default function SkillsPage() {
  const skillsData = getSkills();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute inset-0 hero-radial" />
        <div className="container-custom relative text-center">
          <ScrollReveal variant="fadeInUp">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
              <Cpu size={12} />
              Technical Expertise
            </span>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-4">
              My <span className="gradient-text">Skills</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              Technologies and tools I&apos;ve mastered through years of
              building real-world projects.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="section">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {skillsData.categories.map((category, i) => (
              <SkillCategoryCard
                key={category.id}
                name={category.name}
                icon={iconMap[category.icon] || <Cpu size={18} />}
                skills={category.skills}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
