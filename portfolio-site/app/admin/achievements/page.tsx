"use client";
/**
 * app/admin/achievements/page.tsx
 */
import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import type { Achievement } from "@/types";
import { formatDateShort } from "@/lib/utils";

export default function AdminAchievementsPage() {
  const [data, setData] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => { const r = await fetch("/api/admin/achievements"); setData(await r.json()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const onDelete = async (id: string) => { await fetch("/api/admin/achievements", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); await load(); };
  const onToggle = async (id: string) => { await fetch("/api/admin/achievements", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "toggleFeatured" }) }); await load(); };

  if (loading) return <div className="text-[var(--text-muted)]">Loading...</div>;
  return (
    <div className="space-y-6 max-w-7xl">
      <div><h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">Achievements</h2><p className="text-sm text-[var(--text-muted)] mt-1">Awards, recognitions, and honors</p></div>
      <DataTable data={data} title="Achievements" addHref="/admin/achievements/new" editHref={(a) => `/admin/achievements/${a.id}`}
        onDelete={onDelete} onToggleFeatured={onToggle} viewHref="/achievements" searchKeys={["title", "organizer", "category"]}
        emptyMessage="No achievements yet. Add your first!"
        columns={[
          { key: "title", label: "Title", render: (a) => <div><p className="font-medium text-[var(--text-primary)] text-sm">{a.title}</p><p className="text-xs text-[var(--text-muted)]">{a.organizer}</p></div> },
          { key: "type", label: "Type", render: (a) => <Badge variant="warning" size="xs">{a.type}</Badge> },
          { key: "category", label: "Category", render: (a) => <Badge variant="primary" size="xs">{a.category}</Badge> },
          { key: "date", label: "Date", render: (a) => <span className="text-xs text-[var(--text-muted)]">{formatDateShort(a.date)}</span> },
          { key: "featured", label: "Featured", render: (a) => <span className={`text-xs ${a.featured ? "text-amber-400" : "text-[var(--text-muted)]"}`}>{a.featured ? "⭐ Yes" : "No"}</span> },
        ]}
      />
    </div>
  );
}
