"use client";
/**
 * app/admin/testimonials/page.tsx
 */
import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import type { Testimonial } from "@/types";

export default function AdminTestimonialsPage() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => { const r = await fetch("/api/admin/testimonials"); setData(await r.json()); setLoading(false); };
  useEffect(() => { load(); }, []);
  const onDelete = async (id: string) => { await fetch("/api/admin/testimonials", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); await load(); };
  const onToggle = async (id: string) => { await fetch("/api/admin/testimonials", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "toggleFeatured" }) }); await load(); };

  if (loading) return <div className="text-[var(--text-muted)]">Loading...</div>;
  return (
    <div className="space-y-6 max-w-7xl">
      <div><h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">Testimonials</h2><p className="text-sm text-[var(--text-muted)] mt-1">Peer and mentor recommendations</p></div>
      <DataTable data={data} title="Testimonials" addHref="/admin/testimonials/new" editHref={(t) => `/admin/testimonials/${t.id}`}
        onDelete={onDelete} onToggleFeatured={onToggle} searchKeys={["name", "company", "relationship"]}
        emptyMessage="No testimonials yet."
        columns={[
          { key: "name", label: "Person", render: (t) => <div><p className="font-medium text-[var(--text-primary)] text-sm">{t.name}</p><p className="text-xs text-[var(--text-muted)]">{t.relationship} · {t.company}</p></div> },
          { key: "rating", label: "Rating", render: (t) => <span className="text-amber-400 text-xs">{"★".repeat(t.rating)}</span> },
          { key: "text", label: "Quote", render: (t) => <p className="text-xs text-[var(--text-muted)] line-clamp-2 max-w-xs">&ldquo;{t.text}&rdquo;</p> },
          { key: "featured", label: "Featured", render: (t) => <span className={`text-xs ${t.featured ? "text-amber-400" : "text-[var(--text-muted)]"}`}>{t.featured ? "⭐ Yes" : "No"}</span> },
        ]}
      />
    </div>
  );
}
