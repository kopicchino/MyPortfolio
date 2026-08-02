"use client";
/**
 * app/admin/organizations/page.tsx
 */
import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import type { Organization } from "@/types";

export default function AdminOrganizationsPage() {
  const [data, setData] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => { const r = await fetch("/api/admin/organizations"); setData(await r.json()); setLoading(false); };
  useEffect(() => { load(); }, []);
  const onDelete = async (id: string) => { await fetch("/api/admin/organizations", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); await load(); };

  if (loading) return <div className="text-[var(--text-muted)]">Loading...</div>;
  return (
    <div className="space-y-6 max-w-7xl">
      <div><h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">Organizations</h2><p className="text-sm text-[var(--text-muted)] mt-1">Communities and organizations</p></div>
      <DataTable data={data} title="Organizations" addHref="/admin/organizations/new" editHref={(o) => `/admin/organizations/${o.id}`}
        onDelete={onDelete} viewHref="/organizations" searchKeys={["name", "role", "category"]}
        emptyMessage="No organizations yet."
        columns={[
          { key: "name", label: "Organization", render: (o) => <div><p className="font-medium text-[var(--text-primary)] text-sm">{o.name}</p><p className="text-xs text-indigo-400">{o.role}</p></div> },
          { key: "category", label: "Category", render: (o) => <Badge variant="secondary" size="xs">{o.category}</Badge> },
          { key: "current", label: "Status", render: (o) => <Badge variant={o.current ? "success" : "default"} size="xs" dot={o.current}>{o.current ? "Active" : "Alumni"}</Badge> },
        ]}
      />
    </div>
  );
}
