"use client";

/**
 * app/admin/organizations/[id]/page.tsx — Organization Editor
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Organization } from "@/types";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";
import { v4 as uuidv4 } from "uuid";

type FormData = Omit<Organization, "id" | "order">;

export default function OrganizationEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      name: "", role: "Member", category: "Academic Organization",
      description: "", startDate: new Date().toISOString().split("T")[0],
      endDate: "", current: true, website: "", featured: false,
    },
  });

  useEffect(() => {
    if (!isNew) {
      fetch("/api/admin/organizations")
        .then((r) => r.json())
        .then((items: Organization[]) => {
          const item = items.find((i) => i.id === params.id);
          if (item) {
            Object.entries(item).forEach(([k, v]) => {
              if (k !== "id" && k !== "order") setValue(k as keyof FormData, v as never);
            });
          }
          setLoading(false);
        });
    }
  }, [isNew, params.id, setValue]);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const method = isNew ? "POST" : "PUT";
      const body = isNew ? { ...data, id: uuidv4() } : { ...data, id: params.id };
      const res = await fetch("/api/admin/organizations", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      toast.success(isNew ? "Organization added!" : "Organization updated!");
      router.push("/admin/organizations");
    } catch { toast.error("Failed to save organization."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-[var(--text-muted)]">Loading...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/organizations" className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">{isNew ? "Add Organization" : "Edit Organization"}</h2>
          <p className="text-sm text-[var(--text-muted)]">Student society or tech community</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card-glass p-6 space-y-4">
          <div className="space-y-1.5"><label className="label-text">Organization Name *</label><input {...register("name", { required: true })} className="form-input" placeholder="TUP IT Society" /></div>
          <ImageUploadInput
            label="Organization Logo"
            value={watch("logo") || ""}
            onChange={(url) => setValue("logo", url)}
            folder="organizations"
            placeholder="/uploads/organizations/logo.png"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="label-text">Your Role *</label><input {...register("role", { required: true })} className="form-input" placeholder="e.g. Member, Officer" /></div>
            <div className="space-y-1.5"><label className="label-text">Category</label><input {...register("category")} className="form-input" placeholder="Academic Organization" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="label-text">Start Date *</label><input type="date" {...register("startDate", { required: true })} className="form-input" /></div>
            <div className="space-y-1.5"><label className="label-text">End Date</label><input type="date" {...register("endDate")} className="form-input" /></div>
          </div>
          <div className="space-y-1.5"><label className="label-text">Website (optional)</label><input {...register("website")} className="form-input" placeholder="https://..." /></div>
          <div className="space-y-1.5"><label className="label-text">Description</label><textarea {...register("description")} rows={3} className="form-input resize-none" placeholder="Summary of involvement..." /></div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" {...register("current")} id="org-current" className="h-4 w-4 rounded" />
            <label htmlFor="org-current" className="text-sm text-[var(--text-secondary)]">Currently Active Member</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("featured")} id="org-featured" className="h-4 w-4 rounded" />
            <label htmlFor="org-featured" className="text-sm text-[var(--text-secondary)]">Mark as Featured</label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/organizations"><button type="button" className="px-5 py-2.5 rounded-xl text-sm bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]">Cancel</button></Link>
          <button type="submit" disabled={saving} className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500", saving && "opacity-70 cursor-not-allowed")}>
            {saving ? <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Save size={15} />} Save Organization
          </button>
        </div>
      </form>
    </div>
  );
}
