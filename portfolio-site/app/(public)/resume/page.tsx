/**
 * app/(public)/resume/page.tsx — Online Resume / CV Page
 * A clean, printable CV with all sections pulled from JSON data.
 */

import type { Metadata } from "next";
import Image from "next/image";
import { getProfile, getEducation, getExperience, getSkills, getCertifications, getAchievements, getSettings } from "@/lib/data";
import { generatePageMetadata } from "@/lib/seo";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { MotionButton } from "@/components/ui/Button";
import { PrintButton } from "@/components/resume/PrintButton";
import { Badge } from "@/components/ui/Badge";
import { formatDateRange, getDuration } from "@/lib/utils";
import { Download, Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Award, Cpu } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return generatePageMetadata("Resume", "My full CV — education, experience, skills, and achievements.", settings);
}

export default function ResumePage() {
  const profile = getProfile();
  const education = getEducation();
  const experience = getExperience();
  const skills = getSkills();
  const certifications = getCertifications().slice(0, 6);
  const achievements = getAchievements().filter((a) => a.featured).slice(0, 5);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute inset-0 hero-radial" />
        <div className="container-custom relative">
          <ScrollReveal variant="fadeInUp">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-1">
                  My <span className="gradient-text">Resume</span>
                </h1>
                <p className="text-[var(--text-muted)]">Last updated · {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
              </div>
              <div className="flex gap-3 print:hidden">
                <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                  <MotionButton variant="gradient" leftIcon={<Download size={15} />}>
                    Download PDF
                  </MotionButton>
                </a>
                <PrintButton />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Resume body */}
      <section className="section">
        <div className="container-custom max-w-5xl print:max-w-full">
          <div className="card-glass p-8 md:p-12 print:shadow-none print:border-0">

            {/* CV Header */}
            <div className="flex flex-col md:flex-row items-start gap-8 pb-8 border-b border-[var(--border-color)] mb-8">
              {profile.avatar && (
                <Image src={profile.avatar} alt={profile.name} width={100} height={100}
                  className="rounded-2xl object-cover shrink-0 border-2 border-[var(--border-color)]" />
              )}
              <div className="flex-1">
                <h2 className="font-display text-4xl font-black text-[var(--text-primary)] mb-1">{profile.name}</h2>
                <p className="text-xl text-indigo-400 font-semibold mb-3">{profile.title}</p>
                <div className="space-y-2 text-[var(--text-secondary)] text-sm leading-relaxed mb-4 max-w-2xl">
                  {profile.bio
                    .split(/\n\s*\n/)
                    .filter(Boolean)
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph.trim()}</p>
                    ))}
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-[var(--text-muted)]">
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-indigo-400">
                    <Mail size={12} />{profile.email}
                  </a>
                  {profile.phone && <span className="flex items-center gap-1.5"><Phone size={12} />{profile.phone}</span>}
                  <span className="flex items-center gap-1.5"><MapPin size={12} />{profile.location}</span>
                  {profile.social.github && (
                    <a href={profile.social.github} className="flex items-center gap-1.5 hover:text-indigo-400" target="_blank" rel="noopener noreferrer">
                      <FaGithub size={12} />GitHub
                    </a>
                  )}
                  {profile.social.linkedin && (
                    <a href={profile.social.linkedin} className="flex items-center gap-1.5 hover:text-indigo-400" target="_blank" rel="noopener noreferrer">
                      <FaLinkedin size={12} />LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Main column */}
              <div className="lg:col-span-2 space-y-10">

                {/* Experience */}
                <div>
                  <h3 className="font-display font-bold text-lg text-[var(--text-primary)] flex items-center gap-2 mb-5 pb-2 border-b border-[var(--border-color)]">
                    <Briefcase size={18} className="text-indigo-400" /> Work Experience
                  </h3>
                  <div className="space-y-6">
                    {experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex flex-wrap justify-between gap-2 mb-1">
                          <div>
                            <p className="font-semibold text-[var(--text-primary)]">{exp.position}</p>
                            <p className="text-sm text-indigo-400">{exp.company} · {exp.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[var(--text-muted)]">{formatDateRange(exp.startDate, exp.endDate, exp.current)}</p>
                            <p className="text-xs text-[var(--text-muted)]">{getDuration(exp.startDate, exp.endDate, exp.current)}</p>
                          </div>
                        </div>
                        <ul className="mt-2 space-y-1">
                          {exp.responsibilities.slice(0, 4).map((r, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                              <span className="mt-2 h-1 w-1 rounded-full bg-indigo-400 shrink-0" />{r}
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {exp.technologies.slice(0, 6).map((t) => (
                            <Badge key={t} variant="primary" size="xs">{t}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 className="font-display font-bold text-lg text-[var(--text-primary)] flex items-center gap-2 mb-5 pb-2 border-b border-[var(--border-color)]">
                    <GraduationCap size={18} className="text-indigo-400" /> Education
                  </h3>
                  <div className="space-y-5">
                    {education.map((edu) => (
                      <div key={edu.id}>
                        <div className="flex flex-wrap justify-between gap-2">
                          <div>
                            <p className="font-semibold text-[var(--text-primary)]">{edu.degree}</p>
                            <p className="text-sm text-indigo-400">{edu.school}</p>
                            {edu.gpa && <p className="text-xs text-emerald-400">GPA: {edu.gpa}</p>}
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[var(--text-muted)]">{edu.startYear} – {edu.current ? "Present" : edu.endYear}</p>
                            <p className="text-xs text-[var(--text-muted)]">{edu.location}</p>
                          </div>
                        </div>
                        {edu.awards.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {edu.awards.map((a) => (
                              <span key={a.title} className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">🏅 {a.title}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                {achievements.length > 0 && (
                  <div>
                    <h3 className="font-display font-bold text-lg text-[var(--text-primary)] flex items-center gap-2 mb-5 pb-2 border-b border-[var(--border-color)]">
                      <Award size={18} className="text-indigo-400" /> Key Achievements
                    </h3>
                    <div className="space-y-2">
                      {achievements.map((ach) => (
                        <div key={ach.id} className="flex items-start gap-2">
                          <span className="text-amber-400 mt-0.5">🏆</span>
                          <div>
                            <p className="text-sm font-medium text-[var(--text-primary)]">{ach.title}</p>
                            <p className="text-xs text-[var(--text-muted)]">{ach.organizer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Skills */}
                <div>
                  <h3 className="font-display font-bold text-base text-[var(--text-primary)] flex items-center gap-2 mb-4 pb-2 border-b border-[var(--border-color)]">
                    <Cpu size={16} className="text-indigo-400" /> Skills
                  </h3>
                  {skills.categories.map((cat) => (
                    <div key={cat.id} className="mb-4">
                      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">{cat.name}</p>
                      <div className="flex flex-wrap gap-1">
                        {cat.skills.map((skill) => (
                          <span key={skill.id} className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Certifications */}
                {certifications.length > 0 && (
                  <div>
                    <h3 className="font-display font-bold text-base text-[var(--text-primary)] flex items-center gap-2 mb-4 pb-2 border-b border-[var(--border-color)]">
                      <Award size={16} className="text-indigo-400" /> Certifications
                    </h3>
                    <div className="space-y-2">
                      {certifications.map((cert) => (
                        <div key={cert.id}>
                          <p className="text-xs font-semibold text-[var(--text-primary)]">{cert.title}</p>
                          <p className="text-xs text-[var(--text-muted)]">{cert.issuer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
