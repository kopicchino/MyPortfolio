"use client";

/**
 * components/public/HeroSection.tsx
 * Full-screen animated hero with profile photo, typing effect, and social links.
 */

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { Download, Mail, ChevronDown } from "lucide-react";
import { TypingEffect } from "@/components/animations/TypingEffect";
import { FloatingElement } from "@/components/animations/ParallaxSection";
import { MotionButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";

const socialIconMap: Record<string, React.ElementType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  facebook: FaFacebook,
  instagram: FaInstagram,
};

interface HeroSectionProps {
  profile: Profile;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] as const },
  },
};

const typingStrings = [
  "Aspiring Information Technology Professional",
  "Student Leader",
  "UI/UX Enthusiast",
  "Turning Ideas into Reality",
  "Building Technology. Leading Innovation.",
];

export function HeroSection({ profile }: HeroSectionProps) {
  const socialEntries = Object.entries(profile.social).filter(
    ([key, url]) => !!url && key !== "website"
  );

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 hero-grid" />
      <div className="absolute inset-0 hero-radial" />

      {/* Floating orbs */}
      <FloatingElement
        amplitude={20}
        duration={8}
        delay={0}
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl"
      />
      <FloatingElement
        amplitude={15}
        duration={10}
        delay={2}
        className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl"
      />

      <div className="container-custom relative z-10 py-16">
        <motion.div
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left — Text content */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            {/* Availability badge */}
            {profile.available && (
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Available for new projects
              </motion.div>
            )}

            {/* Greeting */}
            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-[var(--text-muted)] font-medium mb-2"
            >
              Hello, I&apos;m
            </motion.p>

            {/* Name */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-[var(--text-primary)] mb-4 leading-none"
            >
              {profile.name.split(" ").map((word, i) => (
                <span
                  key={i}
                  className={cn(
                    "block",
                    i === profile.name.split(" ").length - 1 && "gradient-text"
                  )}
                >
                  {word}
                </span>
              ))}
            </motion.h1>

            {/* Typing effect */}
            <motion.div
              variants={itemVariants}
              className="text-xl md:text-2xl text-indigo-400 font-semibold mb-6 h-8"
            >
              <TypingEffect strings={typingStrings} typeSpeed={70} />
            </motion.div>

            {/* Tagline */}
            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
            >
              {profile.tagline}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8"
            >
              <Link href="/contact">
                <MotionButton
                  variant="gradient"
                  size="lg"
                  rounded
                  leftIcon={<Mail size={16} />}
                >
                  Hire Me
                </MotionButton>
              </Link>
              {profile.resume && (
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MotionButton
                    variant="secondary"
                    size="lg"
                    rounded
                    leftIcon={<Download size={16} />}
                  >
                    Resume
                  </MotionButton>
                </a>
              )}
            </motion.div>

            {/* Social links */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center lg:justify-start gap-3"
            >
              {socialEntries.map(([platform, url]) => {
                const Icon = socialIconMap[platform];
                if (!Icon) return null;
                return (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center justify-center h-10 w-10 rounded-xl",
                      "bg-[var(--bg-card)] border border-[var(--border-color)]",
                      "text-[var(--text-muted)] hover:text-indigo-400",
                      "hover:border-indigo-500/50 hover:bg-indigo-500/5",
                      "transition-all duration-200"
                    )}
                    aria-label={`${platform} profile`}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </motion.div>
          </div>

          {/* Right — Avatar */}
          <motion.div
            variants={itemVariants}
            className="order-1 lg:order-2 shrink-0"
          >
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 blur-2xl opacity-20 scale-110" />

              {/* Avatar container */}
              <FloatingElement amplitude={10} duration={7}>
                <div
                  className={cn(
                    "relative h-64 w-64 md:h-80 md:w-80 rounded-full",
                    "bg-gradient-to-br from-indigo-500/20 to-violet-500/20",
                    "border-4 border-[var(--bg-card)]",
                    "shadow-2xl overflow-hidden"
                  )}
                  style={{
                    boxShadow:
                      "0 0 0 4px var(--bg-card), 0 0 0 6px rgba(99,102,241,0.3), 0 20px 60px rgba(99,102,241,0.2)",
                  }}
                >
                  {profile.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={profile.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-8xl font-black gradient-text">
                        {profile.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </FloatingElement>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -left-6 top-1/3 card-glass px-3 py-2 flex items-center gap-2"
              >
                <span className="text-lg">⚡</span>
                <div>
                  <p className="text-xs font-bold text-[var(--text-primary)]">
                    {profile.stats.projectsCompleted}+
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Projects
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -right-6 bottom-1/3 card-glass px-3 py-2 flex items-center gap-2"
              >
                <span className="text-lg">🏆</span>
                <div>
                  <p className="text-xs font-bold text-[var(--text-primary)]">
                    {profile.stats.achievementsEarned}+
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Awards
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[var(--text-muted)]"
        >
          <span className="text-xs">Scroll to explore</span>
          <ChevronDown size={18} className="animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
