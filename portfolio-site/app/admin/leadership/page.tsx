"use client";
/**
 * app/admin/leadership/page.tsx
 */
import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import type { Leadership } from "@/types";
import { formatDateRange } from "@/lib/utils";

export default function AdminLeadershipPage() {
  const [data, setData] = useState<Leadership[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => { const r = await fetch("/api/admin/leadership"); setData(await r.json()); setLoading(false); };
  useEffect(() => { load(); }, []);
  const onDelete = async (id: string) => { await fetch("/api/admin/leadership", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); await load(); };

  if (loading) return <div className="text-[var(--text-muted)]">Loading...</div>;
  return (
    <div className="space-y-6 max-w-7xl">
      <div><h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">Leadership</h2><p className="text-sm text-[var(--text-muted)] mt-1">Leadership roles and responsibilities</p></div>
      <DataTable data={data} title="Leadership" addHref="/admin/leadership/new" editHref={(l) => `/admin/leadership/${l.id}`}
        onDelete={onDelete} viewHref="/leadership" searchKeys={["title", "organization"]}
        emptyMessage="No leadership roles yet."
        columns={[
          { key: "title", label: "Role", render: (l) => <div><p className="font-medium text-[var(--text-primary)] text-sm">{l.title}</p><p className="text-xs text-indigo-400">{l.organization}</p></div> },
          { key: "startDate", label: "Period", render: (l) => <span className="text-xs text-[var(--text-muted)]">{formatDateRange(l.startDate, l.endDate, l.current)}</span> },
          { key: "current", label: "Status", render: (l) => <Badge variant={l.current ? "success" : "default"} size="xs" dot={l.current}>{l.current ? "Active" : "Completed"}</Badge> },
        ]}
      />
    </div>
  );
}
