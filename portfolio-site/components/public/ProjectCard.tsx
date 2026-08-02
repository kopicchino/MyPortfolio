"use client";

/**
 * components/public/ProjectCard.tsx
 * Rich project card with image, tech stack, links, and hover animation.
 */

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Star } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Badge, TechBadge, StatusBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  index?: number;
  onScreenshotClick?: (images: string[], index: number) => void;
}

export function ProjectCard({
  project,
  index = 0,
  onScreenshotClick,
}: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.1,
        ease: [0.215, 0.61, 0.355, 1],
      }}
      whileHover={{ y: -6 }}
      className="card-glass overflow-hidden group flex flex-col h-full"
      id={project.slug}
    >
      {/* Cover image */}
      <div className="relative h-48 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 overflow-hidden shrink-0">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-5xl font-bold gradient-text opacity-30">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/90 text-white text-xs font-semibold">
              <Star size={10} className="fill-white" />
              Featured
            </span>
          </div>
        )}

        {/* Status */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={project.status} />
        </div>

        {/* Screenshots button */}
        {project.screenshots.length > 0 && onScreenshotClick && (
          <button
            onClick={() => onScreenshotClick(project.screenshots, 0)}
            className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
          >
            {project.screenshots.length} screenshots
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category */}
        <div className="mb-2">
          <Badge variant="secondary" size="xs">
            {project.category}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-lg text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors mb-2 leading-snug">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {/* Highlights */}
        {project.highlights.length > 0 && (
          <ul className="mb-4 space-y-1">
            {project.highlights.slice(0, 2).map((h, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-[var(--text-secondary)]"
              >
                <span className="mt-1 h-1 w-1 rounded-full bg-emerald-400 shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        )}

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.slice(0, 5).map((tech) => (
            <TechBadge key={tech}>{tech}</TechBadge>
          ))}
          {project.tech.length > 5 && (
            <Badge variant="outline" size="xs">
              +{project.tech.length - 5}
            </Badge>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action links */}
        <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-color)] mt-auto">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium",
                "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]",
                "hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]",
                "border border-[var(--border-color)] transition-all duration-200"
              )}
            >
              <FaGithub size={14} />
              Code
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium",
                "bg-gradient-to-r from-indigo-600 to-violet-600 text-white",
                "hover:from-indigo-500 hover:to-violet-500",
                "shadow-sm transition-all duration-200 flex-1 justify-center"
              )}
            >
              <ExternalLink size={14} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
