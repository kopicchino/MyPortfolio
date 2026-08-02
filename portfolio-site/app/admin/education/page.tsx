"use client";
/**
 * app/admin/education/page.tsx
 */
import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import type { Education } from "@/types";

export default function AdminEducationPage() {
  const [data, setData] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => { const r = await fetch("/api/admin/education"); setData(await r.json()); setLoading(false); };
  useEffect(() => { load(); }, []);
  const onDelete = async (id: string) => { await fetch("/api/admin/education", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); await load(); };

  if (loading) return <div className="text-[var(--text-muted)]">Loading...</div>;
  return (
    <div className="space-y-6 max-w-7xl">
      <div><h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">Education</h2><p className="text-sm text-[var(--text-muted)] mt-1">Academic history and degrees</p></div>
      <DataTable data={data} title="Education" addHref="/admin/education/new" editHref={(e) => `/admin/education/${e.id}`}
        onDelete={onDelete} viewHref="/education" searchKeys={["school", "degree", "field"]}
        emptyMessage="No education records yet."
        columns={[
          { key: "degree", label: "Degree", render: (e) => <div><p className="font-medium text-[var(--text-primary)] text-sm">{e.degree}</p><p className="text-xs text-indigo-400">{e.school}</p></div> },
          { key: "field", label: "Field", render: (e) => <Badge variant="secondary" size="xs">{e.field}</Badge> },
          { key: "startYear", label: "Period", render: (e) => <span className="text-xs text-[var(--text-muted)]">{e.startYear} – {e.current ? "Present" : e.endYear}</span> },
          { key: "current", label: "Status", render: (e) => <Badge variant={e.current ? "success" : "default"} size="xs" dot={e.current}>{e.current ? "Current" : "Completed"}</Badge> },
          { key: "gpa", label: "GPA", render: (e) => <span className="text-xs text-emerald-400">{e.gpa || "—"}</span> },
        ]}
      />
    </div>
  );
}
