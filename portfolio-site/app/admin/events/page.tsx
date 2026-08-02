"use client";
/**
 * app/admin/events/page.tsx
 */
import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import type { Event } from "@/types";
import { formatDateShort } from "@/lib/utils";

export default function AdminEventsPage() {
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => { const r = await fetch("/api/admin/events"); setData(await r.json()); setLoading(false); };
  useEffect(() => { load(); }, []);
  const onDelete = async (id: string) => { await fetch("/api/admin/events", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); await load(); };
  const onToggle = async (id: string) => { await fetch("/api/admin/events", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "toggleFeatured" }) }); await load(); };

  if (loading) return <div className="text-[var(--text-muted)]">Loading...</div>;
  return (
    <div className="space-y-6 max-w-7xl">
      <div><h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">Events</h2><p className="text-sm text-[var(--text-muted)] mt-1">Hackathons, conferences, and workshops</p></div>
      <DataTable data={data} title="Events" addHref="/admin/events/new" editHref={(e) => `/admin/events/${e.id}`}
        onDelete={onDelete} onToggleFeatured={onToggle} viewHref="/events" searchKeys={["title", "organizer", "type"]}
        emptyMessage="No events yet."
        columns={[
          { key: "title", label: "Event", render: (e) => <div><p className="font-medium text-[var(--text-primary)] text-sm">{e.title}</p><p className="text-xs text-[var(--text-muted)]">{e.organizer}</p></div> },
          { key: "type", label: "Type", render: (e) => <Badge variant="primary" size="xs">{e.type}</Badge> },
          { key: "role", label: "Role", render: (e) => <Badge variant="secondary" size="xs">{e.role}</Badge> },
          { key: "date", label: "Date", render: (e) => <span className="text-xs text-[var(--text-muted)]">{formatDateShort(e.date)}</span> },
          { key: "result", label: "Result", render: (e) => e.result ? <span className="text-xs text-amber-400">🏆 {e.result}</span> : <span className="text-[var(--text-muted)] text-xs">—</span> },
        ]}
      />
    </div>
  );
}
