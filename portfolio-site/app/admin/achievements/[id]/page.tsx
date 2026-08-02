"use client";

/**
 * app/admin/achievements/[id]/page.tsx — Achievement Editor (create + edit)
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";

type FormData = Omit<Achievement, "id" | "order">;

export default function AchievementEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      title: "", description: "", date: new Date().toISOString().split("T")[0],
      category: "Competition", type: "Award", organizer: "", location: "",
      image: "", certificate: "", featured: false,
    },
  });

  useEffect(() => {
    if (!isNew) {
      fetch("/api/admin/achievements")
        .then((r) => r.json())
        .then((items: Achievement[]) => {
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

      const res = await fetch("/api/admin/achievements", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      toast.success(isNew ? "Achievement created!" : "Achievement updated!");
      router.push("/admin/achievements");
    } catch {
      toast.error("Failed to save achievement.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-[var(--text-muted)]">Loading...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/achievements" className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
            {isNew ? "Add Achievement" : "Edit Achievement"}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">Enter achievement details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card-glass p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="label-text">Title *</label>
            <input {...register("title", { required: true })} className="form-input" placeholder="e.g. 2nd Place — Web Development" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="label-text">Organizer / Issuer *</label>
              <input {...register("organizer", { required: true })} className="form-input" placeholder="e.g. TUP Manila" />
            </div>
            <div className="space-y-1.5">
              <label className="label-text">Date *</label>
              <input type="date" {...register("date", { required: true })} className="form-input" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="label-text">Category</label>
              <select {...register("category")} className="form-input">
                <option value="Competition">Competition</option>
                <option value="Academic">Academic</option>
                <option value="Recognition">Recognition</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="label-text">Type</label>
              <select {...register("type")} className="form-input">
                <option value="Award">Award</option>
                <option value="Recognition">Recognition</option>
                <option value="Honor">Honor</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="label-text">Description</label>
            <textarea {...register("description")} rows={3} className="form-input resize-none" placeholder="Brief details about the achievement..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUploadInput
              label="Achievement Image"
              value={watch("image") || ""}
              onChange={(url) => setValue("image", url)}
              folder="achievements"
              placeholder="/uploads/achievements/..."
            />
            <ImageUploadInput
              label="Certificate Image / PDF"
              value={watch("certificate") || ""}
              onChange={(url) => setValue("certificate", url)}
              folder="certificates"
              placeholder="/uploads/certificates/..."
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" {...register("featured")} id="ach-featured" className="h-4 w-4 rounded border-[var(--border-color)] text-indigo-500" />
            <label htmlFor="ach-featured" className="text-sm text-[var(--text-secondary)]">Mark as Featured</label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/achievements">
            <button type="button" className="px-5 py-2.5 rounded-xl text-sm bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              Cancel
            </button>
          </Link>
          <button type="submit" disabled={saving}
            className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 transition-all", saving && "opacity-70 cursor-not-allowed")}>
            {saving ? <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Save size={15} />}
            Save Achievement
          </button>
        </div>
      </form>
    </div>
  );
}
