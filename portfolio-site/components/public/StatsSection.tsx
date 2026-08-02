"use client";

/**
 * components/public/StatsSection.tsx
 * Animated statistics counters section.
 */

import { Code2, Trophy, Briefcase, Award } from "lucide-react";
import { StatCard } from "@/components/animations/CounterAnimation";
import { StaggerReveal, StaggerItem } from "@/components/animations/ScrollReveal";
import type { ProfileStats } from "@/types";

interface StatsSectionProps {
  stats: ProfileStats;
}

export function StatsSection({ stats }: StatsSectionProps) {
  const statItems = [
    {
      value: stats.yearsExperience,
      label: "Years Experience",
      suffix: "+",
      icon: <Briefcase size={22} />,
      description: "Professional development",
      delay: 0,
    },
    {
      value: stats.projectsCompleted,
      label: "Projects Completed",
      suffix: "+",
      icon: <Code2 size={22} />,
      description: "Across various industries",
      delay: 200,
    },
    {
      value: stats.achievementsEarned,
      label: "Achievements",
      suffix: "+",
      icon: <Trophy size={22} />,
      description: "Awards & recognitions",
      delay: 400,
    },
    {
      value: stats.certificationsEarned,
      label: "Certifications",
      suffix: "+",
      icon: <Award size={22} />,
      description: "Industry credentials",
      delay: 600,
    },
  ];

  return (
    <section className="py-16 bg-[var(--bg-secondary)]">
      <div className="container-custom">
        <StaggerReveal
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          staggerDelay={0.08}
        >
          {statItems.map((item, i) => (
            <StaggerItem key={item.label}>
              <StatCard
                value={item.value}
                label={item.label}
                suffix={item.suffix}
                icon={item.icon}
                description={item.description}
                delay={item.delay}
              />
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>
    </section>
  );
}
