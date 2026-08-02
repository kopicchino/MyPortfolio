"use client";

/**
 * app/admin/projects/page.tsx — Admin Projects List
 */

import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import type { Project } from "@/types";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/admin/projects");
    setProjects(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    await fetch("/api/admin/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    await fetch("/api/admin/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "toggleFeatured" }),
    });
    await load();
  };

  if (loading) return <div className="flex items-center gap-3 text-[var(--text-muted)]"><div className="h-5 w-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" /> Loading projects...</div>;

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">Projects</h2>
        <p className="text-[var(--text-muted)] text-sm mt-1">Manage your portfolio projects</p>
      </div>

      <DataTable
        data={projects}
        title="Projects"
        addHref="/admin/projects/new"
        editHref={(p) => `/admin/projects/${p.id}`}
        onDelete={handleDelete}
        onToggleFeatured={handleToggleFeatured}
        viewHref="/projects"
        searchKeys={["title", "description", "category"]}
        emptyMessage="No projects yet. Add your first project!"
        columns={[
          {
            key: "title",
            label: "Project",
            render: (p) => (
              <div>
                <p className="font-semibold text-[var(--text-primary)]">{p.title}</p>
                <p className="text-xs text-[var(--text-muted)] line-clamp-1">{p.description}</p>
              </div>
            ),
          },
          {
            key: "category",
            label: "Category",
            render: (p) => <Badge variant="secondary" size="xs">{p.category}</Badge>,
          },
          {
            key: "status",
            label: "Status",
            render: (p) => <StatusBadge status={p.status} />,
          },
          {
            key: "tech",
            label: "Tech",
            render: (p) => (
              <div className="flex flex-wrap gap-1">
                {p.tech.slice(0, 3).map((t) => (
                  <Badge key={t} variant="primary" size="xs">{t}</Badge>
                ))}
                {p.tech.length > 3 && <Badge variant="outline" size="xs">+{p.tech.length - 3}</Badge>}
              </div>
            ),
          },
          {
            key: "featured",
            label: "Featured",
            render: (p) => p.featured ? <span className="text-amber-400 text-xs">⭐ Yes</span> : <span className="text-[var(--text-muted)] text-xs">No</span>,
          },
        ]}
      />
    </div>
  );
}
