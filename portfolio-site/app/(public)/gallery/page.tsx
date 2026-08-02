/**
 * app/(public)/gallery/page.tsx — Gallery Page
 */

import type { Metadata } from "next";
import { getGallery, getSettings } from "@/lib/data";
import { generatePageMetadata } from "@/lib/seo";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { GalleryClient } from "@/components/public/GalleryClient";
import { Images } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  return generatePageMetadata(
    "Gallery",
    "A visual collection of my work, events, and memorable moments.",
    settings
  );
}

export default function GalleryPage() {
  const gallery = getGallery();

  return (
    <div className="min-h-screen">
      <section className="section-sm relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-30" />
        <div className="absolute inset-0 hero-radial" />
        <div className="container-custom relative text-center">
          <ScrollReveal variant="fadeInUp">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
              <Images size={12} />
              Visual Portfolio
            </span>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-4">
              Photo <span className="gradient-text">Gallery</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.2}>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              A visual collection of memorable moments — events, projects,
              and experiences that define my journey.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <GalleryClient items={gallery} />
        </div>
      </section>
    </div>
  );
}
