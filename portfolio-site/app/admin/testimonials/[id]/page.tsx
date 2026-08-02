"use client";

/**
 * app/admin/testimonials/[id]/page.tsx — Testimonial Editor
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";
import { v4 as uuidv4 } from "uuid";

type FormData = Omit<Testimonial, "id" | "order">;

export default function TestimonialEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      name: "", title: "BSIT Student / Peer", company: "TUP Manila",
      avatar: "", text: "", relationship: "Peer", rating: 5,
      date: new Date().toISOString().split("T")[0], featured: true,
    },
  });

  useEffect(() => {
    if (!isNew) {
      fetch("/api/admin/testimonials")
        .then((r) => r.json())
        .then((items: Testimonial[]) => {
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
      const res = await fetch("/api/admin/testimonials", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      toast.success(isNew ? "Testimonial added!" : "Testimonial updated!");
      router.push("/admin/testimonials");
    } catch { toast.error("Failed to save testimonial."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-[var(--text-muted)]">Loading...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/testimonials" className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">{isNew ? "Add Testimonial" : "Edit Testimonial"}</h2>
          <p className="text-sm text-[var(--text-muted)]">Recommendation from a peer, mentor, or professor</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card-glass p-6 space-y-4">
          <div className="space-y-1.5"><label className="label-text">Person's Name *</label><input {...register("name", { required: true })} className="form-input" placeholder="Juan Dela Cruz" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="label-text">Role / Title *</label><input {...register("title", { required: true })} className="form-input" placeholder="BSIT Student / Professor" /></div>
            <div className="space-y-1.5"><label className="label-text">Organization / University</label><input {...register("company")} className="form-input" placeholder="TUP Manila" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="label-text">Relationship</label><input {...register("relationship")} className="form-input" placeholder="e.g. Capstone Teammate, Professor" /></div>
            <div className="space-y-1.5"><label className="label-text">Rating (1 to 5)</label><input type="number" min={1} max={5} {...register("rating", { valueAsNumber: true })} className="form-input" /></div>
          </div>
          <ImageUploadInput
            label="Avatar Photo"
            value={watch("avatar") || ""}
            onChange={(url) => setValue("avatar", url)}
            folder="testimonials"
            placeholder="/uploads/testimonials/..."
          />
          <div className="space-y-1.5"><label className="label-text">Testimonial Quote *</label><textarea {...register("text", { required: true })} rows={4} className="form-input resize-none" placeholder="What they said about working with you..." /></div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" {...register("featured")} id="test-featured" className="h-4 w-4 rounded" />
            <label htmlFor="test-featured" className="text-sm text-[var(--text-secondary)]">Mark as Featured</label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/testimonials"><button type="button" className="px-5 py-2.5 rounded-xl text-sm bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]">Cancel</button></Link>
          <button type="submit" disabled={saving} className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500", saving && "opacity-70 cursor-not-allowed")}>
            {saving ? <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Save size={15} />} Save Testimonial
          </button>
        </div>
      </form>
    </div>
  );
}
