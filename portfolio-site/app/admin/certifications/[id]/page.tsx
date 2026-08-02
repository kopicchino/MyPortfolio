"use client";

/**
 * app/admin/certifications/[id]/page.tsx — Certification Editor
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Save, ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Certification } from "@/types";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";
import { v4 as uuidv4 } from "uuid";

type FormData = Omit<Certification, "id" | "order">;

export default function CertificationEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      title: "", issuer: "", category: "Web Development",
      issueDate: new Date().toISOString().split("T")[0], expiryDate: null,
      credentialId: "", credentialUrl: "", image: "", skills: [], featured: false,
    },
  });

  const skills = watch("skills") || [];

  useEffect(() => {
    if (!isNew) {
      fetch("/api/admin/certifications")
        .then((r) => r.json())
        .then((items: Certification[]) => {
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
      const res = await fetch("/api/admin/certifications", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      toast.success(isNew ? "Certification created!" : "Certification updated!");
      router.push("/admin/certifications");
    } catch { toast.error("Failed to save certification."); }
    finally { setSaving(false); }
  };

  const addSkill = (val: string) => {
    if (val.trim() && !skills.includes(val.trim())) setValue("skills", [...skills, val.trim()]);
  };

  const removeSkill = (idx: number) => {
    setValue("skills", skills.filter((_, i) => i !== idx));
  };

  if (loading) return <div className="text-[var(--text-muted)]">Loading...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/certifications" className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">{isNew ? "Add Certification" : "Edit Certification"}</h2>
          <p className="text-sm text-[var(--text-muted)]">Enter certification details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card-glass p-6 space-y-4">
          <div className="space-y-1.5"><label className="label-text">Title *</label><input {...register("title", { required: true })} className="form-input" placeholder="Responsive Web Design" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="label-text">Issuer *</label><input {...register("issuer", { required: true })} className="form-input" placeholder="freeCodeCamp" /></div>
            <div className="space-y-1.5"><label className="label-text">Category</label><input {...register("category")} className="form-input" placeholder="Web Development" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="label-text">Issue Date *</label><input type="date" {...register("issueDate", { required: true })} className="form-input" /></div>
            <div className="space-y-1.5"><label className="label-text">Expiry Date (optional)</label><input type="date" {...register("expiryDate")} className="form-input" /></div>
          </div>
          <ImageUploadInput
            label="Certificate Badge / Image"
            value={watch("image") || ""}
            onChange={(url) => setValue("image", url)}
            folder="certificates"
            placeholder="/uploads/certificates/..."
          />
          <div className="space-y-1.5"><label className="label-text">Credential URL</label><input {...register("credentialUrl")} className="form-input" placeholder="https://..." /></div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" {...register("featured")} id="cert-featured" className="h-4 w-4 rounded" />
            <label htmlFor="cert-featured" className="text-sm text-[var(--text-secondary)]">Mark as Featured</label>
          </div>
        </div>

        {/* Skills Covered */}
        <div className="card-glass p-6 space-y-3">
          <h3 className="font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">Skills Covered</h3>
          <SkillTagInput onAdd={addSkill} tags={skills} onRemove={removeSkill} />
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/certifications"><button type="button" className="px-5 py-2.5 rounded-xl text-sm bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]">Cancel</button></Link>
          <button type="submit" disabled={saving} className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500", saving && "opacity-70 cursor-not-allowed")}>
            {saving ? <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Save size={15} />} Save Certification
          </button>
        </div>
      </form>
    </div>
  );
}

function SkillTagInput({ onAdd, tags, onRemove }: { onAdd: (v: string) => void; tags: string[]; onRemove: (i: number) => void }) {
  const [val, setVal] = useState("");
  const add = () => { onAdd(val); setVal(""); };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} className="form-input flex-1" placeholder="e.g. HTML, CSS, JavaScript" />
        <button type="button" onClick={add} className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm bg-indigo-600 text-white"><Plus size={14} /> Add</button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t, i) => (
            <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {t} <button type="button" onClick={() => onRemove(i)}><X size={10} /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
