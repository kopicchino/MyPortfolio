/**
 * app/admin/dashboard/page.tsx — Admin Dashboard Overview
 */

import Link from "next/link";
import {
  getProfile, getProjects, getEducation, getSkills,
  getAchievements, getCertifications, getOrganizations,
  getEvents, getTestimonials, getLeadership,
} from "@/lib/data";
import {
  FolderKanban, GraduationCap, Trophy, ShieldCheck,
  Users, CalendarDays, Star, MessageSquare, Cpu,
  ArrowRight, TrendingUp, Eye,
} from "lucide-react";
import fs from "fs";
import path from "path";

function getMessageCount() {
  try {
    const p = path.join(process.cwd(), "data", "messages.json");
    if (!fs.existsSync(p)) return 0;
    const msgs = JSON.parse(fs.readFileSync(p, "utf-8")) as Array<{ read: boolean }>;
    return msgs.filter((m) => !m.read).length;
  } catch { return 0; }
}

export default function DashboardPage() {
  const profile = getProfile();
  const projects = getProjects();
  const education = getEducation();
  const skills = getSkills();
  const achievements = getAchievements();
  const certifications = getCertifications();
  const organizations = getOrganizations();
  const events = getEvents();
  const testimonials = getTestimonials();
  const leadership = getLeadership();
  const unreadMessages = getMessageCount();

  const totalSkills = skills.categories.reduce((sum, cat) => sum + cat.skills.length, 0);

  const stats = [
    { label: "Projects", value: projects.length, icon: FolderKanban, href: "/admin/projects", color: "indigo" },
    { label: "Skills", value: totalSkills, icon: Cpu, href: "/admin/skills", color: "violet" },
    { label: "Achievements", value: achievements.length, icon: Trophy, href: "/admin/achievements", color: "amber" },
    { label: "Certifications", value: certifications.length, icon: ShieldCheck, href: "/admin/certifications", color: "emerald" },
    { label: "Organizations", value: organizations.length, icon: Users, href: "/admin/organizations", color: "blue" },
    { label: "Events", value: events.length, icon: CalendarDays, href: "/admin/events", color: "violet" },
    { label: "Leadership", value: leadership.length, icon: Star, href: "/admin/leadership", color: "indigo" },
    { label: "Testimonials", value: testimonials.length, icon: MessageSquare, href: "/admin/testimonials", color: "pink" },
  ];

  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-500/10 text-indigo-400",
    violet: "bg-violet-500/10 text-violet-400",
    amber: "bg-amber-500/10 text-amber-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    blue: "bg-blue-500/10 text-blue-400",
    pink: "bg-pink-500/10 text-pink-400",
  };

  const sections = [
    { label: "Profile", href: "/admin/profile", description: "Update your bio, photo, and contact info", icon: "👤" },
    { label: "Projects", href: "/admin/projects", description: `${projects.length} project${projects.length !== 1 ? "s" : ""}`, icon: "💻" },
    { label: "Skills", href: "/admin/skills", description: `${totalSkills} skills across ${skills.categories.length} categories`, icon: "⚡" },
    { label: "Certifications", href: "/admin/certifications", description: `${certifications.length} certification${certifications.length !== 1 ? "s" : ""}`, icon: "🏅" },
    { label: "Education", href: "/admin/education", description: `${education.length} record${education.length !== 1 ? "s" : ""}`, icon: "🎓" },
    { label: "Achievements", href: "/admin/achievements", description: `${achievements.length} award${achievements.length !== 1 ? "s" : ""}`, icon: "🏆" },
    { label: "Organizations", href: "/admin/organizations", description: `${organizations.length} organization${organizations.length !== 1 ? "s" : ""}`, icon: "🤝" },
    { label: "Events", href: "/admin/events", description: `${events.length} event${events.length !== 1 ? "s" : ""}`, icon: "📅" },
    { label: "Gallery", href: "/admin/gallery", description: "Manage your photo gallery", icon: "🖼️" },
    { label: "Messages", href: "/admin/messages", description: `${unreadMessages} unread message${unreadMessages !== 1 ? "s" : ""}`, icon: "✉️" },
    { label: "Settings", href: "/admin/settings", description: "Site title, nav, theme", icon: "⚙️" },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            Welcome back! 👋
          </h2>
          <p className="text-[var(--text-muted)] mt-1">
            Manage your portfolio content from here.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] transition-colors">
            <Eye size={15} /> View Site
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}
              className="card-glass p-5 group hover:border-indigo-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${colorMap[stat.color]}`}>
                  <Icon size={18} />
                </div>
                <ArrowRight size={14} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Profile snapshot */}
      <div className="card-glass p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={18} className="text-indigo-400" />
          <h3 className="font-display font-bold text-base text-[var(--text-primary)]">Portfolio Snapshot</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-[var(--text-muted)] text-xs mb-1">Name</p>
            <p className="font-semibold text-[var(--text-primary)]">{profile.name}</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] text-xs mb-1">Title</p>
            <p className="font-semibold text-[var(--text-primary)] text-xs leading-snug">{profile.title}</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] text-xs mb-1">Status</p>
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${profile.available ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`} />
              <span className="text-xs font-medium">{profile.available ? "Available" : "Not Available"}</span>
            </div>
          </div>
          <div>
            <p className="text-[var(--text-muted)] text-xs mb-1">Email</p>
            <p className="font-semibold text-[var(--text-primary)] text-xs">{profile.email}</p>
          </div>
        </div>
      </div>

      {/* Quick links grid */}
      <div>
        <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-4">
          Manage Content
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {sections.map((section) => (
            <Link key={section.href} href={section.href}
              className="card-glass p-4 group hover:border-indigo-500/30 transition-all flex items-start gap-3">
              <span className="text-2xl shrink-0">{section.icon}</span>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors">
                  {section.label}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{section.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
