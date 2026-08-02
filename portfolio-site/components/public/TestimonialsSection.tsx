"use client";

/**
 * components/public/TestimonialsSection.tsx
 * Auto-scrolling testimonial cards.
 */

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { ScrollReveal, StaggerReveal, StaggerItem } from "@/components/animations/ScrollReveal";
import { cn, initials } from "@/lib/utils";
import type { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={cn(
            i < rating
              ? "text-amber-400 fill-amber-400"
              : "text-[var(--text-muted)]"
          )}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  return (
    <section className="section bg-[var(--bg-secondary)]">
      <div className="container-custom">
        <SectionHeader
          badge="What People Say"
          title="Kind "
          highlight="Words"
          subtitle="Feedback from colleagues, managers, and clients I've had the pleasure of working with."
        />

        <StaggerReveal
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          staggerDelay={0.1}
        >
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.id}>
              <motion.div
                whileHover={{ y: -4 }}
                className="card-glass p-6 flex flex-col gap-4 h-full relative overflow-hidden"
              >
                {/* Background quote mark */}
                <Quote
                  size={80}
                  className="absolute -top-2 -right-2 text-indigo-500/5"
                />

                {/* Stars */}
                <StarRating rating={testimonial.rating} />

                {/* Quote text */}
                <blockquote className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-color)]">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                    {testimonial.avatar ? (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-white">
                        {initials(testimonial.name)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {testimonial.title} · {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
