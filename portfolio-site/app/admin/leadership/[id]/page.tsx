"use client";

/**
 * app/admin/leadership/[id]/page.tsx — Leadership Editor
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Leadership } from "@/types";
import { v4 as uuidv4 } from "uuid";

type FormData = Omit<Leadership, "id" | "order">;

export default function LeadershipEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      title: "", organization: "", startDate: new Date().toISOString().split("T")[0],
      endDate: "", current: true, description: "", responsibilities: [], achievements: [],
    },
  });

  useEffect(() => {
    if (!isNew) {
      fetch("/api/admin/leadership")
        .then((r) => r.json())
        .then((items: Leadership[]) => {
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
      const res = await fetch("/api/admin/leadership", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      toast.success(isNew ? "Leadership role added!" : "Leadership role updated!");
      router.push("/admin/leadership");
    } catch { toast.error("Failed to save leadership role."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-[var(--text-muted)]">Loading...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/leadership" className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">{isNew ? "Add Leadership Role" : "Edit Leadership Role"}</h2>
          <p className="text-sm text-[var(--text-muted)]">Role and responsibilities</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card-glass p-6 space-y-4">
          <div className="space-y-1.5"><label className="label-text">Role Title *</label><input {...register("title", { required: true })} className="form-input" placeholder="Class Representative" /></div>
          <div className="space-y-1.5"><label className="label-text">Organization *</label><input {...register("organization", { required: true })} className="form-input" placeholder="TUP Manila — BSIT 3-1" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="label-text">Start Date *</label><input type="date" {...register("startDate", { required: true })} className="form-input" /></div>
            <div className="space-y-1.5"><label className="label-text">End Date</label><input type="date" {...register("endDate")} className="form-input" /></div>
          </div>
          <div className="space-y-1.5"><label className="label-text">Description</label><textarea {...register("description")} rows={3} className="form-input resize-none" placeholder="Summary of your role..." /></div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" {...register("current")} id="lead-current" className="h-4 w-4 rounded" />
            <label htmlFor="lead-current" className="text-sm text-[var(--text-secondary)]">Currently in this Role</label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/leadership"><button type="button" className="px-5 py-2.5 rounded-xl text-sm bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]">Cancel</button></Link>
          <button type="submit" disabled={saving} className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500", saving && "opacity-70 cursor-not-allowed")}>
            {saving ? <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Save size={15} />} Save Role
          </button>
        </div>
      </form>
    </div>
  );
}
