"use client";

/**
 * app/(public)/projects/page.tsx — Projects Page
 * Filterable project grid with category filters, search, and lightbox.
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { SectionHeader } from "@/components/public/SectionHeader";
import { ProjectCard } from "@/components/public/ProjectCard";
import { SearchInput } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn, uniqueValues } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectsClientProps {
  projects: Project[];
}

const ALL = "All";

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Derive categories
  const categories = [ALL, ...uniqueValues(projects.map((p) => p.category))];

  // Filter logic
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchCategory =
        activeCategory === ALL || p.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.tech.some((t) => t.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [projects, activeCategory, search]);

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <SearchInput
          placeholder="Search projects by name, tech, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          containerClassName="max-w-lg"
        />

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                activeCategory === cat
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)]"
              )}
            >
              {cat}
              {cat !== ALL && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({projects.filter((p) => p.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Result count */}
        <p className="text-sm text-[var(--text-muted)]">
          {filtered.length} project{filtered.length !== 1 ? "s" : ""} found
          {search && ` for "${search}"`}
        </p>
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard
                project={project}
                index={i}
                onScreenshotClick={openLightbox}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            No projects found
          </h3>
          <p className="text-[var(--text-muted)]">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxImages.map((src) => ({ src }))}
      />
    </>
  );
}
