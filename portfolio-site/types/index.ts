// ============================================================
// Portfolio TypeScript Types
// All data shapes mirror the corresponding /data/*.json files
// ============================================================

// ------------------------------------------------------------------
// Profile
// ------------------------------------------------------------------
export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
}

export interface ProfileStats {
  yearsExperience: number;
  projectsCompleted: number;
  achievementsEarned: number;
  certificationsEarned: number;
}

export interface QuickFact {
  label: string;
  value: string;
  icon: string;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  mission: string;
  vision: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  resume: string;
  available: boolean;
  social: SocialLinks;
  stats: ProfileStats;
  quickFacts: QuickFact[];
  mapEmbedUrl?: string;
  updatedAt: string;
}

// ------------------------------------------------------------------
// Education
// ------------------------------------------------------------------
export interface EducationAward {
  title: string;
  year: number;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  logo?: string;
  startYear: number;
  endYear?: number;
  current: boolean;
  gpa?: string;
  location: string;
  description: string;
  awards: EducationAward[];
  courses: string[];
  activities: string[];
  projects: string[];
  order: number;
}

// ------------------------------------------------------------------
// Projects
// ------------------------------------------------------------------
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  tech: string[];
  github?: string;
  demo?: string;
  featured: boolean;
  status: "Completed" | "In Progress" | "Archived";
  coverImage?: string;
  images: string[];
  screenshots: string[];
  highlights: string[];
  startDate: string;
  endDate?: string;
  order: number;
}

// ------------------------------------------------------------------
// Achievements
// ------------------------------------------------------------------
export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  type: "Award" | "Recognition" | "Competition" | "Scholarship" | "Other";
  organizer: string;
  location: string;
  image?: string;
  certificate?: string;
  featured: boolean;
  order: number;
}

// ------------------------------------------------------------------
// Certifications
// ------------------------------------------------------------------
export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issuerLogo?: string;
  credentialId?: string;
  credentialUrl?: string;
  issueDate: string;
  expiryDate?: string | null;
  image?: string;
  pdf?: string;
  category: string;
  featured: boolean;
  skills: string[];
  order: number;
}

// ------------------------------------------------------------------
// Leadership
// ------------------------------------------------------------------
export interface Leadership {
  id: string;
  title: string;
  organization: string;
  organizationLogo?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  gallery: string[];
  image?: string;
  order: number;
}

// ------------------------------------------------------------------
// Organizations
// ------------------------------------------------------------------
export interface Organization {
  id: string;
  name: string;
  logo?: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  website?: string;
  category: string;
  featured: boolean;
  order: number;
}

// ------------------------------------------------------------------
// Events
// ------------------------------------------------------------------
export interface Event {
  id: string;
  title: string;
  subtitle?: string;
  type: string;           // e.g. "Hackathon", "Conference", "Workshop"
  date: string;
  endDate?: string;
  location: string;
  online?: boolean;
  organizer: string;
  role: string;
  description: string;
  responsibilities: string[];
  photos: string[];
  coverImage?: string;
  tags: string[];
  featured: boolean;
  result?: string;        // e.g. "1st Place", "Finalist"
  certificate?: string;  // URL to certificate
  website?: string;      // Event website URL
  order: number;
}

// ------------------------------------------------------------------
// Gallery
// ------------------------------------------------------------------
export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  album: string;
  tags: string[];
  date: string;
  featured: boolean;
  width?: number;
  height?: number;
  order: number;
}

// ------------------------------------------------------------------
// Skills
// ------------------------------------------------------------------
export interface Skill {
  id: string;
  name: string;
  icon: string;
  level: number; // 0–100
  years: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  skills: Skill[];
}

export interface SkillsData {
  categories: SkillCategory[];
}

// ------------------------------------------------------------------
// Experience
// ------------------------------------------------------------------
export interface Experience {
  id: string;
  company: string;
  logo?: string;
  position: string;
  type: "Full-time" | "Part-time" | "Freelance" | "Internship" | "Contract";
  location: string;
  remote: boolean;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  order: number;
}

// ------------------------------------------------------------------
// Volunteer
// ------------------------------------------------------------------
export interface Volunteer {
  id: string;
  organization: string;
  logo?: string;
  role: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description: string;
  responsibilities: string[];
  hours: number;
  cause: string;
  order: number;
}

// ------------------------------------------------------------------
// Testimonials
// ------------------------------------------------------------------
export interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar?: string;
  relationship: string;
  text: string;
  rating: number;
  date: string;
  featured: boolean;
  order: number;
}

// ------------------------------------------------------------------
// Settings
// ------------------------------------------------------------------
export interface NavLink {
  label: string;
  href: string;
}

export interface Settings {
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  favicon: string;
  ogImage: string;
  theme: {
    primaryColor: string;
    accentColor: string;
    defaultMode: "dark" | "light";
  };
  nav: {
    logo: string;
    links: NavLink[];
  };
  contact: {
    formEndpoint: string;
    showPhone: boolean;
    showEmail: boolean;
    showMap: boolean;
  };
  analytics: {
    googleAnalyticsId: string;
    plausibleDomain: string;
  };
  maintenance: boolean;
  updatedAt: string;
}

// ------------------------------------------------------------------
// API Response types
// ------------------------------------------------------------------
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ------------------------------------------------------------------
// UI / Utility types
// ------------------------------------------------------------------
export type Theme = "dark" | "light" | "system";

export interface PageMeta {
  title: string;
  description: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}
