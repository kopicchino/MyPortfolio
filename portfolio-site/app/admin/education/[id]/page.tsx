"use client";

/**
 * app/admin/education/[id]/page.tsx — Education Editor
 * Supports School Logo Upload, Awards & Honors, and Activities.
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Save, ArrowLeft, Plus, X, Award, Activity } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Education } from "@/types";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";
import { v4 as uuidv4 } from "uuid";

type FormData = Omit<Education, "id" | "order">;

export default function EducationEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue, watch, control } = useForm<FormData>({
    defaultValues: {
      school: "Technological University of the Philippines", degree: "Bachelor of Science in Information Technology",
      field: "Information Technology", logo: "", startYear: 2022, endYear: 2026,
      current: true, gpa: "", location: "Manila, Philippines",
      description: "", awards: [], activities: [], courses: [], projects: [],
    },
  });

  const { fields: awardFields, append: appendAward, remove: removeAward } = useFieldArray({
    control,
    name: "awards",
  });

  const [newAwardTitle, setNewAwardTitle] = useState("");
  const [newAwardYear, setNewAwardYear] = useState<number>(new Date().getFullYear());

  const [newActivity, setNewActivity] = useState("");
  const activitiesList = watch("activities") || [];

  const logoValue = watch("logo") || "";

  useEffect(() => {
    if (!isNew) {
      fetch("/api/admin/education")
        .then((r) => r.json())
        .then((items: Education[]) => {
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
      const res = await fetch("/api/admin/education", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      toast.success(isNew ? "Education added!" : "Education updated!");
      router.push("/admin/education");
    } catch { toast.error("Failed to save education."); }
    finally { setSaving(false); }
  };

  const handleAddAward = () => {
    if (!newAwardTitle.trim()) return;
    appendAward({ title: newAwardTitle.trim(), year: newAwardYear });
    setNewAwardTitle("");
    setNewAwardYear(new Date().getFullYear());
  };

  const handleAddActivity = () => {
    if (!newActivity.trim()) return;
    setValue("activities", [...activitiesList, newActivity.trim()]);
    setNewActivity("");
  };

  const handleRemoveActivity = (idx: number) => {
    setValue("activities", activitiesList.filter((_, i) => i !== idx));
  };

  if (loading) return <div className="text-[var(--text-muted)]">Loading...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/education" className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">{isNew ? "Add Education" : "Edit Education"}</h2>
          <p className="text-sm text-[var(--text-muted)]">Academic details, honors, and activities</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="card-glass p-6 space-y-4">
          <h3 className="font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">Basic Info</h3>

          <div className="space-y-1.5"><label className="label-text">School / University *</label><input {...register("school", { required: true })} className="form-input" placeholder="Technological University of the Philippines" /></div>
          
          <ImageUploadInput
            label="School Logo"
            value={logoValue}
            onChange={(url) => setValue("logo", url)}
            folder="education"
            placeholder="/uploads/education/tup-logo.png"
          />

          <div className="space-y-1.5"><label className="label-text">Degree *</label><input {...register("degree", { required: true })} className="form-input" placeholder="Bachelor of Science in Information Technology" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="label-text">Field of Study</label><input {...register("field")} className="form-input" placeholder="Information Technology" /></div>
            <div className="space-y-1.5"><label className="label-text">GWA / GPA</label><input {...register("gpa")} className="form-input" placeholder="e.g. 1.75" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="label-text">Start Year *</label><input type="number" {...register("startYear", { valueAsNumber: true, required: true })} className="form-input" placeholder="2022" /></div>
            <div className="space-y-1.5"><label className="label-text">End Year / Expected</label><input type="number" {...register("endYear", { valueAsNumber: true })} className="form-input" placeholder="2026" /></div>
          </div>
          <div className="space-y-1.5"><label className="label-text">Location</label><input {...register("location")} className="form-input" placeholder="Manila, Philippines" /></div>
          <div className="space-y-1.5"><label className="label-text">Description</label><textarea {...register("description")} rows={3} className="form-input resize-none" placeholder="Summary of your program or specialization..." /></div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" {...register("current")} id="edu-current" className="h-4 w-4 rounded" />
            <label htmlFor="edu-current" className="text-sm text-[var(--text-secondary)]">Currently Studying Here</label>
          </div>
        </div>

        {/* Awards & Honors */}
        <div className="card-glass p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
            <Award size={18} className="text-amber-400" />
            <h3 className="font-semibold text-[var(--text-primary)]">Awards &amp; Honors</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={newAwardTitle}
              onChange={(e) => setNewAwardTitle(e.target.value)}
              placeholder="e.g. Dean's List"
              className="form-input sm:col-span-2"
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={newAwardYear}
                onChange={(e) => setNewAwardYear(parseInt(e.target.value) || new Date().getFullYear())}
                className="form-input w-24"
              />
              <button
                type="button"
                onClick={handleAddAward}
                className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shrink-0"
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {awardFields.length > 0 && (
            <div className="space-y-2 mt-3">
              {awardFields.map((field, idx) => (
                <div key={field.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">🏅 {field.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">Year: {field.year}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAward(idx)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activities */}
        <div className="card-glass p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
            <Activity size={18} className="text-violet-400" />
            <h3 className="font-semibold text-[var(--text-primary)]">University Activities</h3>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddActivity())}
              placeholder="e.g. IT Student Council Committee Member"
              className="form-input flex-1"
            />
            <button
              type="button"
              onClick={handleAddActivity}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shrink-0"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          {activitiesList.length > 0 && (
            <div className="space-y-2 mt-3">
              {activitiesList.map((act, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-sm">
                  <span className="text-[var(--text-secondary)]">• {act}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveActivity(idx)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/education"><button type="button" className="px-5 py-2.5 rounded-xl text-sm bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]">Cancel</button></Link>
          <button type="submit" disabled={saving} className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500", saving && "opacity-70 cursor-not-allowed")}>
            {saving ? <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Save size={15} />} Save Education
          </button>
        </div>
      </form>
    </div>
  );
}
