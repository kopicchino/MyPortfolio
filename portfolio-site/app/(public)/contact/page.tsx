/**
 * app/(public)/contact/page.tsx — Contact Page
 */

import type { Metadata } from "next";
import { getProfile, getSettings } from "@/lib/data";
import { generatePageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/public/ContactForm";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/animations/ScrollReveal";
import { Mail, MapPin, Phone, Clock, MessageSquare } from "lucide-react";
import {
  FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaInstagram,
} from "react-icons/fa";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return generatePageMetadata(
    "Contact",
    "Get in touch — I'm open to freelance work, full-time opportunities, and interesting collaborations.",
    settings
  );
}

const socialIconMap: Record<string, React.ElementType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  facebook: FaFacebook,
  instagram: FaInstagram,
};

export default function ContactPage() {
  const profile = getProfile();
  const socialEntries = Object.entries(profile.social).filter(([, url]) => !!url);

  const contactInfo = [
    { icon: <Mail size={18} />, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: <Phone size={18} />, label: "Phone", value: profile.phone, href: `tel:${profile.phone}` },
    { icon: <MapPin size={18} />, label: "Location", value: profile.location, href: null },
    { icon: <Clock size={18} />, label: "Response Time", value: "Within 24 hours", href: null },
  ].filter((item) => item.value);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute inset-0 hero-radial" />
        <div className="container-custom relative text-center">
          <ScrollReveal variant="fadeInUp">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
              <MessageSquare size={12} />
              Let&apos;s Talk
            </span>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-4">
              Get In <span className="gradient-text">Touch</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              Have a project, opportunity, or just want to say hello? I&apos;d
              love to hear from you.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main content */}
      <section className="section">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Availability banner */}
              {profile.available && (
                <ScrollReveal variant="fadeInLeft">
                  <div className="card-glass p-5 border-emerald-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-semibold text-emerald-400 text-sm">Available for hire</span>
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">
                      I&apos;m currently open to new opportunities — freelance,
                      part-time, or full-time positions.
                    </p>
                  </div>
                </ScrollReveal>
              )}

              {/* Contact info */}
              <ScrollReveal variant="fadeInLeft" delay={0.1}>
                <div className="card-glass p-6 space-y-4">
                  <h2 className="font-display font-bold text-lg text-[var(--text-primary)] mb-4">
                    Contact Information
                  </h2>
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-muted)] mb-0.5">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-sm font-medium text-[var(--text-primary)] hover:text-indigo-400 transition-colors">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-[var(--text-primary)]">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              {/* Social links */}
              <ScrollReveal variant="fadeInLeft" delay={0.2}>
                <div className="card-glass p-6">
                  <h2 className="font-display font-bold text-base text-[var(--text-primary)] mb-4">
                    Find me online
                  </h2>
                  <div className="space-y-2">
                    {socialEntries.map(([platform, url]) => {
                      const Icon = socialIconMap[platform];
                      if (!Icon) return null;
                      return (
                        <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors group">
                          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                            <Icon size={16} />
                          </div>
                          <span className="text-sm font-medium capitalize text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                            {platform}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>

              {/* Map embed */}
              {profile.mapEmbedUrl && (
                <ScrollReveal variant="fadeInLeft" delay={0.3}>
                  <div className="card-glass overflow-hidden">
                    <iframe
                      src={profile.mapEmbedUrl}
                      width="100%"
                      height="220"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Location map"
                      className="w-full"
                    />
                  </div>
                </ScrollReveal>
              )}
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <ScrollReveal variant="fadeInRight" delay={0.1}>
                <h2 className="font-display font-bold text-xl text-[var(--text-primary)] mb-6">
                  Send a Message
                </h2>
                <ContactForm />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
