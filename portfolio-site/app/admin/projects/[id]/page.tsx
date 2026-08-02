"use client";

/**
 * app/admin/projects/[id]/page.tsx — Project Editor (create + edit)
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Save, ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";
import { v4 as uuidv4 } from "uuid";

type FormData = Omit<Project, "id" | "order">;

const STATUS_OPTIONS = ["Completed", "In Progress", "Archived", "Planned"];
const CATEGORY_OPTIONS = ["Web Application", "Mobile App", "API/Backend", "Personal Project", "School Project", "Open Source", "Other"];

export default function ProjectEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: "", slug: "", description: "", longDescription: "",
      category: "Web Application", status: "Completed",
      tech: [], tags: [], highlights: [], screenshots: [],
      github: "", demo: "", coverImage: "", featured: false,
    },
  });

  const techValue = watch("tech");
  const tagsValue = watch("tags");
  const highlightsValue = watch("highlights");

  useEffect(() => {
    if (!isNew) {
      fetch("/api/admin/projects")
        .then((r) => r.json())
        .then((projects: Project[]) => {
          const p = projects.find((p) => p.id === params.id);
          if (p) {
            Object.entries(p).forEach(([k, v]) => {
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
      const body = isNew
        ? { ...data, id: uuidv4(), slug: data.title.toLowerCase().replace(/\s+/g, "-") }
        : { ...data, id: params.id };

      const res = await fetch("/api/admin/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success(isNew ? "Project created!" : "Project updated!");
      router.push("/admin/projects");
    } catch {
      toast.error("Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  const addArrayItem = (field: "tech" | "tags" | "highlights", value: string) => {
    const current = watch(field) as string[];
    if (value.trim() && !current.includes(value.trim())) {
      setValue(field, [...current, value.trim()]);
    }
  };

  const removeArrayItem = (field: "tech" | "tags" | "highlights", index: number) => {
    const current = watch(field) as string[];
    setValue(field, current.filter((_, i) => i !== index));
  };

  if (loading) return <div className="text-[var(--text-muted)]">Loading...</div>;

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/projects" className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
            {isNew ? "Add Project" : "Edit Project"}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">Fill in the project details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic info */}
        <div className="card-glass p-6 space-y-4">
          <h3 className="font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">Basic Info</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="label-text">Title *</label>
              <input {...register("title", { required: true })} className="form-input" placeholder="My Awesome Project" />
            </div>
            <div className="space-y-1.5">
              <label className="label-text">Category</label>
              <select {...register("category")} className="form-input">
                {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="label-text">Short Description *</label>
            <textarea {...register("description", { required: true })} rows={2} className="form-input resize-none" placeholder="A brief one-line description..." />
          </div>

          <div className="space-y-1.5">
            <label className="label-text">Long Description</label>
            <textarea {...register("longDescription")} rows={4} className="form-input resize-none" placeholder="Detailed description of what you built, how, and why..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="label-text">Status</label>
              <select {...register("status")} className="form-input">
                {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <ImageUploadInput
              label="Cover Image"
              value={watch("coverImage") || ""}
              onChange={(url) => setValue("coverImage", url)}
              folder="projects"
              placeholder="/uploads/projects/..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="label-text">GitHub URL</label>
              <input {...register("github")} className="form-input" placeholder="https://github.com/..." />
            </div>
            <div className="space-y-1.5">
              <label className="label-text">Demo URL</label>
              <input {...register("demo")} className="form-input" placeholder="https://..." />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("featured")} id="proj-featured" className="h-4 w-4 rounded border-[var(--border-color)] bg-[var(--bg-tertiary)] text-indigo-500 focus:ring-indigo-500" />
            <label htmlFor="proj-featured" className="text-sm text-[var(--text-secondary)]">Mark as Featured</label>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="card-glass p-6 space-y-3">
          <h3 className="font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">Tech Stack</h3>
          <TagInput label="Add Technology" onAdd={(v) => addArrayItem("tech", v)} tags={techValue} onRemove={(i) => removeArrayItem("tech", i)} placeholder="e.g. React, PHP, MySQL" />
        </div>

        {/* Tags */}
        <div className="card-glass p-6 space-y-3">
          <h3 className="font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">Tags</h3>
          <TagInput label="Add Tag" onAdd={(v) => addArrayItem("tags", v)} tags={tagsValue} onRemove={(i) => removeArrayItem("tags", i)} placeholder="e.g. school, open-source" />
        </div>

        {/* Highlights */}
        <div className="card-glass p-6 space-y-3">
          <h3 className="font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">Highlights</h3>
          <TagInput label="Add Highlight" onAdd={(v) => addArrayItem("highlights", v)} tags={highlightsValue} onRemove={(i) => removeArrayItem("highlights", i)} placeholder="Key feature or achievement..." />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/projects">
            <button type="button" className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)] transition-colors">
              Cancel
            </button>
          </Link>
          <button type="submit" disabled={saving}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold",
              "bg-gradient-to-r from-indigo-600 to-violet-600 text-white",
              "hover:from-indigo-500 hover:to-violet-500 transition-all shadow-sm",
              saving && "opacity-70 cursor-not-allowed"
            )}>
            {saving ? <><div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Saving...</> : <><Save size={15} />Save Project</>}
          </button>
        </div>
      </form>
    </div>
  );
}

// Tag input helper component
function TagInput({ label, onAdd, tags, onRemove, placeholder }: {
  label: string; onAdd: (v: string) => void; tags: string[];
  onRemove: (i: number) => void; placeholder: string;
}) {
  const [input, setInput] = useState("");
  const handle = () => { onAdd(input); setInput(""); };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handle())}
          className="form-input flex-1" placeholder={placeholder} />
        <button type="button" onClick={handle}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shrink-0">
          <Plus size={14} /> Add
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {tag}
              <button type="button" onClick={() => onRemove(i)} className="hover:text-red-400 transition-colors ml-0.5">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
