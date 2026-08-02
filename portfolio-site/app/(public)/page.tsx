/**
 * app/(public)/page.tsx — Home Page
 * Hero, stats, featured projects, skills preview, organizations, testimonials, CTA.
 * Dynamically hides empty sections.
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  getProfile,
  getFeaturedProjects,
  getSkills,
  getOrganizations,
  getTestimonials,
  getCertifications,
} from "@/lib/data";
import { generateHomeMetadata } from "@/lib/seo";
import { HeroSection } from "@/components/public/HeroSection";
import { StatsSection } from "@/components/public/StatsSection";
import { SectionHeader } from "@/components/public/SectionHeader";
import { ProjectCard } from "@/components/public/ProjectCard";
import { TestimonialsSection } from "@/components/public/TestimonialsSection";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/animations/ScrollReveal";
import { MotionButton } from "@/components/ui/Button";
import { ArrowRight, Users, Award } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export async function generateMetadata(): Promise<Metadata> {
  const profile = getProfile();
  return generateHomeMetadata(profile);
}

export default function HomePage() {
  const profile = getProfile();
  const featuredProjects = getFeaturedProjects();
  const skillsData = getSkills();
  const organizations = getOrganizations();
  const testimonials = getTestimonials().filter((t) => t.featured);
  const certifications = getCertifications();

  // Top skills from first 2 categories
  const topSkills = skillsData.categories
    .slice(0, 2)
    .flatMap((cat) => cat.skills.slice(0, 6));

  return (
    <>
      {/* Hero */}
      <HeroSection profile={profile} />

      {/* Stats */}
      <StatsSection stats={profile.stats} />

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="section" id="projects">
          <div className="container-custom">
            <SectionHeader
              badge="Selected Work"
              title="Featured "
              highlight="Projects"
              subtitle="A collection of projects I've built — from school assignments to personal experiments."
            />
            <StaggerReveal
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              staggerDelay={0.1}
            >
              {featuredProjects.slice(0, 3).map((project) => (
                <StaggerItem key={project.id}>
                  <ProjectCard project={project} />
                </StaggerItem>
              ))}
            </StaggerReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <div className="flex justify-center mt-10">
                <Link href="/projects">
                  <MotionButton variant="outline" size="lg" rightIcon={<ArrowRight size={16} />}>
                    View All Projects
                  </MotionButton>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Skills preview */}
      {topSkills.length > 0 && (
        <section className="section bg-[var(--bg-secondary)]" id="skills-preview">
          <div className="container-custom">
            <SectionHeader
              badge="Expertise"
              title="My Technical "
              highlight="Skills"
              subtitle="Technologies I'm learning and building with every day."
            />
            <StaggerReveal className="flex flex-wrap justify-center gap-3" staggerDelay={0.04}>
              {topSkills.map((skill) => (
                <StaggerItem key={skill.id}>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full card-glass text-sm font-medium text-[var(--text-secondary)] hover:text-indigo-400 hover:border-indigo-500/30 transition-colors cursor-default">
                    <div className="h-2 w-2 rounded-full bg-indigo-400" style={{ opacity: skill.level / 100 }} />
                    {skill.name}
                    <span className="text-xs text-[var(--text-muted)]">{skill.level}%</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerReveal>
            <ScrollReveal variant="fadeInUp" delay={0.3}>
              <div className="flex justify-center mt-10">
                <Link href="/skills">
                  <MotionButton variant="outline" size="lg" rightIcon={<ArrowRight size={16} />}>
                    View All Skills
                  </MotionButton>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Organizations & Student Communities */}
      {organizations.length > 0 && (
        <section className="section" id="organizations">
          <div className="container-custom">
            <SectionHeader
              badge="Affiliations"
              title="Student "
              highlight="Organizations"
              subtitle="Student societies and tech communities I'm active in at university."
            />
            <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto" staggerDelay={0.1}>
              {organizations.map((org) => (
                <StaggerItem key={org.id}>
                  <div className="card-glass p-6 flex flex-col justify-between h-full group hover:border-indigo-500/40 transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                            <Users size={20} />
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-lg text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors">
                              {org.name}
                            </h3>
                            <p className="text-xs text-indigo-400 font-medium">{org.role}</p>
                          </div>
                        </div>
                        <Badge variant={org.current ? "success" : "default"} size="xs" dot={org.current}>
                          {org.current ? "Active" : "Alumni"}
                        </Badge>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{org.description}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerReveal>
            <ScrollReveal variant="fadeInUp" delay={0.2}>
              <div className="flex justify-center mt-8">
                <Link href="/organizations">
                  <MotionButton variant="outline" size="md" rightIcon={<ArrowRight size={16} />}>
                    Explore Organizations
                  </MotionButton>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Certifications Preview (only if data exists) */}
      {certifications.length > 0 && (
        <section className="section bg-[var(--bg-secondary)]" id="certifications">
          <div className="container-custom">
            <SectionHeader
              badge="Credentials"
              title="Verified "
              highlight="Certifications"
              subtitle="Online courses and technical certifications earned."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {certifications.slice(0, 3).map((cert) => (
                <div key={cert.id} className="card-glass p-5 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 shrink-0">
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-[var(--text-primary)] mb-1">{cert.title}</h4>
                    <p className="text-xs text-[var(--text-muted)]">{cert.issuer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials (only if data exists) */}
      {testimonials.length > 0 && (
        <TestimonialsSection testimonials={testimonials} />
      )}

      {/* CTA Section */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute inset-0 hero-radial" />
        <div className="container-custom relative">
          <ScrollReveal variant="scaleIn">
            <div className="card-glass p-10 md:p-16 text-center max-w-3xl mx-auto">
              {profile.available && (
                <div className="flex justify-center mb-6">
                  <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Open to internships &amp; opportunities
                  </span>
                </div>
              )}
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                Let&apos;s Build Something{" "}
                <span className="gradient-text">Together</span>
              </h2>
              <p className="text-lg text-[var(--text-muted)] mb-8 max-w-xl mx-auto">
                I&apos;m a motivated BSIT student open to internships,
                freelance projects, and collaborative opportunities. Let&apos;s connect!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/contact">
                  <MotionButton variant="gradient" size="xl" rightIcon={<ArrowRight size={18} />} rounded>
                    Get In Touch
                  </MotionButton>
                </Link>
                <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                  <MotionButton variant="secondary" size="xl" rounded>
                    View Resume
                  </MotionButton>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
