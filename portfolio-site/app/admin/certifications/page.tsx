"use client";
/**
 * app/admin/certifications/page.tsx
 */
import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import type { Certification } from "@/types";
import { formatDate } from "@/lib/utils";

export default function AdminCertificationsPage() {
  const [data, setData] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => { const r = await fetch("/api/admin/certifications"); setData(await r.json()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const onDelete = async (id: string) => { await fetch("/api/admin/certifications", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); await load(); };

  if (loading) return <div className="text-[var(--text-muted)]">Loading...</div>;
  return (
    <div className="space-y-6 max-w-7xl">
      <div><h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">Certifications</h2><p className="text-sm text-[var(--text-muted)] mt-1">Professional credentials and certificates</p></div>
      <DataTable data={data} title="Certifications" addHref="/admin/certifications/new" editHref={(c) => `/admin/certifications/${c.id}`}
        onDelete={onDelete} viewHref="/certifications" searchKeys={["title", "issuer", "category"]}
        emptyMessage="No certifications yet. Add your first!"
        columns={[
          { key: "title", label: "Certification", render: (c) => <div><p className="font-medium text-[var(--text-primary)] text-sm">{c.title}</p><p className="text-xs text-indigo-400">{c.issuer}</p></div> },
          { key: "category", label: "Category", render: (c) => <Badge variant="secondary" size="xs">{c.category}</Badge> },
          { key: "issueDate", label: "Issued", render: (c) => <span className="text-xs text-[var(--text-muted)]">{formatDate(c.issueDate, "MMM yyyy")}</span> },
          { key: "expiryDate", label: "Expiry", render: (c) => {
            if (!c.expiryDate) return <span className="text-xs text-emerald-400">No expiry</span>;
            const expired = new Date(c.expiryDate) < new Date();
            return <span className={`text-xs ${expired ? "text-red-400" : "text-[var(--text-muted)]"}`}>{expired ? "Expired" : formatDate(c.expiryDate, "MMM yyyy")}</span>;
          }},
        ]}
      />
    </div>
  );
}
