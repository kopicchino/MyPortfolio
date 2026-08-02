/**
 * lib/data.ts
 * Server-side JSON file readers for all data files.
 * These run on the server only — never exposed to the client.
 * Uses Node.js `fs` and `path` modules.
 */

import fs from "fs";
import path from "path";
import type {
  Profile,
  Education,
  Project,
  Achievement,
  Certification,
  Leadership,
  Organization,
  Event,
  GalleryItem,
  SkillsData,
  Experience,
  Volunteer,
  Testimonial,
  Settings,
} from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");

/** Generic JSON file reader with type safety */
export function readJsonFile<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    throw new Error(`Failed to read data file: ${filename}`);
  }
}

/** Generic JSON file writer */
export function writeJsonFile<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw new Error(`Failed to write data file: ${filename}`);
  }
}

// ------------------------------------------------------------------
// Data readers (used in Server Components)
// ------------------------------------------------------------------

export function getProfile(): Profile {
  return readJsonFile<Profile>("profile.json");
}

export function getEducation(): Education[] {
  return readJsonFile<Education[]>("education.json").sort(
    (a, b) => a.order - b.order
  );
}

export function getProjects(): Project[] {
  return readJsonFile<Project[]>("projects.json").sort(
    (a, b) => a.order - b.order
  );
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getAchievements(): Achievement[] {
  return readJsonFile<Achievement[]>("achievements.json").sort(
    (a, b) => a.order - b.order
  );
}

export function getCertifications(): Certification[] {
  return readJsonFile<Certification[]>("certifications.json").sort(
    (a, b) => a.order - b.order
  );
}

export function getLeadership(): Leadership[] {
  return readJsonFile<Leadership[]>("leadership.json").sort(
    (a, b) => a.order - b.order
  );
}

export function getOrganizations(): Organization[] {
  return readJsonFile<Organization[]>("organizations.json").sort(
    (a, b) => a.order - b.order
  );
}

export function getEvents(): Event[] {
  return readJsonFile<Event[]>("events.json").sort(
    (a, b) => a.order - b.order
  );
}

export function getGallery(): GalleryItem[] {
  return readJsonFile<GalleryItem[]>("gallery.json").sort(
    (a, b) => a.order - b.order
  );
}

export function getSkills(): SkillsData {
  return readJsonFile<SkillsData>("skills.json");
}

export function getExperience(): Experience[] {
  return readJsonFile<Experience[]>("experience.json").sort(
    (a, b) => a.order - b.order
  );
}

export function getVolunteer(): Volunteer[] {
  return readJsonFile<Volunteer[]>("volunteer.json").sort(
    (a, b) => a.order - b.order
  );
}

export function getTestimonials(): Testimonial[] {
  return readJsonFile<Testimonial[]>("testimonials.json").sort(
    (a, b) => a.order - b.order
  );
}

export function getSettings(): Settings {
  return readJsonFile<Settings>("settings.json");
}

// ------------------------------------------------------------------
// Search utility (used by search API)
// ------------------------------------------------------------------
export interface SearchResult {
  type: string;
  id: string;
  title: string;
  description: string;
  href: string;
  image?: string;
}

export function globalSearch(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: SearchResult[] = [];

  // Search projects
  getProjects().forEach((p) => {
    if (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.tech.some((t) => t.toLowerCase().includes(q))
    ) {
      results.push({
        type: "Project",
        id: p.id,
        title: p.title,
        description: p.description,
        href: `/projects#${p.slug}`,
        image: p.coverImage,
      });
    }
  });

  // Search achievements
  getAchievements().forEach((a) => {
    if (
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q)
    ) {
      results.push({
        type: "Achievement",
        id: a.id,
        title: a.title,
        description: a.description,
        href: `/achievements#${a.id}`,
        image: a.image,
      });
    }
  });

  // Search certifications
  getCertifications().forEach((c) => {
    if (
      c.title.toLowerCase().includes(q) ||
      c.issuer.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q))
    ) {
      results.push({
        type: "Certification",
        id: c.id,
        title: c.title,
        description: `Issued by ${c.issuer}`,
        href: `/certifications#${c.id}`,
        image: c.image,
      });
    }
  });

  // Search experience
  getExperience().forEach((e) => {
    if (
      e.company.toLowerCase().includes(q) ||
      e.position.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.technologies.some((t) => t.toLowerCase().includes(q))
    ) {
      results.push({
        type: "Experience",
        id: e.id,
        title: `${e.position} at ${e.company}`,
        description: e.description,
        href: `/experience#${e.id}`,
        image: e.logo,
      });
    }
  });

  // Search events
  getEvents().forEach((e) => {
    if (
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.tags.some((t) => t.toLowerCase().includes(q))
    ) {
      results.push({
        type: "Event",
        id: e.id,
        title: e.title,
        description: e.description,
        href: `/events#${e.id}`,
        image: e.coverImage,
      });
    }
  });

  return results.slice(0, 20); // max 20 results
}
