"use client";

/**
 * components/public/SkillBar.tsx
 * Animated skill progress bar with level indicator.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn, getLevelColor } from "@/lib/utils";
import type { Skill } from "@/types";

interface SkillBarProps {
  skill: Skill;
  index?: number;
  showYears?: boolean;
}

const levelLabel = (level: number): string => {
  if (level >= 90) return "Expert";
  if (level >= 75) return "Advanced";
  if (level >= 60) return "Proficient";
  if (level >= 40) return "Intermediate";
  return "Beginner";
};

export function SkillBar({ skill, index = 0, showYears = true }: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="space-y-2">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {skill.name}
          </span>
          {showYears && (
            <span className="text-xs text-[var(--text-muted)]">
              {skill.years}yr{skill.years !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-medium", getLevelColor(skill.level))}>
            {levelLabel(skill.level)}
          </span>
          <span className="text-xs text-[var(--text-muted)] w-7 text-right">
            {skill.level}%
          </span>
        </div>
      </div>

      {/* Progress track */}
      <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : {}}
          transition={{
            duration: 1.2,
            delay: index * 0.06,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          className="h-full rounded-full progress-gradient"
        />
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Skill category card
// ------------------------------------------------------------------
interface SkillCategoryCardProps {
  name: string;
  icon?: React.ReactNode;
  skills: Skill[];
  index?: number;
}

export function SkillCategoryCard({
  name,
  icon,
  skills,
  index = 0,
}: SkillCategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.215, 0.61, 0.355, 1],
      }}
      className="card-glass p-6 space-y-5"
    >
      {/* Category header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-color)]">
        {icon && (
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            {icon}
          </div>
        )}
        <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
          {name}
        </h3>
        <span className="ml-auto text-xs text-[var(--text-muted)]">
          {skills.length} skills
        </span>
      </div>

      {/* Skills */}
      <div className="space-y-4">
        {skills.map((skill, i) => (
          <SkillBar key={skill.id} skill={skill} index={i} showYears={false} />
        ))}
      </div>
    </motion.div>
  );
}
