/**
 * app/(public)/certifications/page.tsx — Certifications Page
 * Shows certifications grouped by category, or a clean empty state if none exist.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCertifications, getSettings } from "@/lib/data";
import { generatePageMetadata } from "@/lib/seo";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/animations/ScrollReveal";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { Award, ExternalLink, Download, ShieldCheck, ArrowRight } from "lucide-react";
import { uniqueValues } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return generatePageMetadata(
    "Certifications",
    "Professional certifications and credentials I've earned.",
    settings
  );
}

export default function CertificationsPage() {
  const certifications = getCertifications();
  const categories = uniqueValues(certifications.map((c) => c.category));
  const hasCertifications = certifications.length > 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute inset-0 hero-radial" />
        <div className="container-custom relative text-center">
          <ScrollReveal variant="fadeInUp">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
              <ShieldCheck size={12} />
              Credentials
            </span>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-4">
              My <span className="gradient-text">Certifications</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              Industry-recognized credentials validating my expertise across
              software development, web technologies, and IT concepts.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Certs by category or Empty State */}
      <section className="section">
        <div className="container-custom">
          {hasCertifications ? (
            categories.map((category, catIdx) => {
              const certs = certifications.filter((c) => c.category === category);
              return (
                <div key={category} className="mb-14">
                  <ScrollReveal variant="fadeInLeft" delay={catIdx * 0.05}>
                    <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-3">
                      <span className="h-6 w-1.5 rounded-full gradient-bg" />
                      {category}
                    </h2>
                  </ScrollReveal>

                  <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
                    {certs.map((cert) => {
                      const isExpired = cert.expiryDate
                        ? new Date(cert.expiryDate) < new Date()
                        : false;

                      return (
                        <StaggerItem key={cert.id}>
                          <div
                            id={cert.id}
                            className="card-glass p-6 group flex flex-col h-full"
                          >
                            {/* Header */}
                            <div className="flex items-start gap-4 mb-4">
                              <div className="h-14 w-14 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-center overflow-hidden shrink-0">
                                {cert.issuerLogo ? (
                                  <Image src={cert.issuerLogo} alt={cert.issuer} width={40} height={40} className="object-contain" />
                                ) : (
                                  <Award size={24} className="text-indigo-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-display font-bold text-sm text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors leading-snug mb-1">
                                  {cert.title}
                                </h3>
                                <p className="text-xs text-indigo-400 font-medium">{cert.issuer}</p>
                              </div>
                            </div>

                            {/* Dates */}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-muted)] mb-3">
                              <span>Issued: {formatDate(cert.issueDate, "MMM yyyy")}</span>
                              {cert.expiryDate && (
                                <span className={isExpired ? "text-red-400" : ""}>
                                  {isExpired ? "Expired" : "Expires"}: {formatDate(cert.expiryDate, "MMM yyyy")}
                                </span>
                              )}
                              {!cert.expiryDate && (
                                <span className="text-emerald-400">No Expiry</span>
                              )}
                            </div>

                            {/* Credential ID */}
                            {cert.credentialId && (
                              <p className="text-xs text-[var(--text-muted)] mb-3">
                                ID: <span className="font-mono">{cert.credentialId}</span>
                              </p>
                            )}

                            {/* Skills */}
                            {cert.skills && cert.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
                                {cert.skills.map((skill) => (
                                  <Badge key={skill} variant="primary" size="xs">{skill}</Badge>
                                ))}
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t border-[var(--border-color)] mt-auto">
                              {cert.credentialUrl && (
                                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-indigo-400 border border-[var(--border-color)] transition-colors">
                                  <ExternalLink size={12} /> Verify
                                </a>
                              )}
                              {!isExpired && (
                                <Badge variant="success" size="xs" dot className="ml-auto">Active</Badge>
                              )}
                            </div>
                          </div>
                        </StaggerItem>
                      );
                    })}
                  </StaggerReveal>
                </div>
              );
            })
          ) : (
            /* Student Empty State */
            <ScrollReveal variant="scaleIn">
              <div className="card-glass p-12 text-center max-w-2xl mx-auto">
                <div className="text-6xl mb-4">🎓</div>
                <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-3">
                  Currently Focused on Coursework
                </h2>
                <p className="text-[var(--text-muted)] mb-6 max-w-md mx-auto">
                  I&apos;m currently prioritizing my BSIT studies at TUP Manila and building hands-on projects. Official certifications will be added here as I complete them!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/projects">
                    <span className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all">
                      View My Projects <ArrowRight size={16} />
                    </span>
                  </Link>
                  <Link href="/skills">
                    <span className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)] transition-all">
                      Check My Skills
                    </span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>
    </div>
  );
}
