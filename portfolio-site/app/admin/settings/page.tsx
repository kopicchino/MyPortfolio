"use client";
/**
 * app/admin/settings/page.tsx — Site settings editor
 */
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Save, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Settings } from "@/types";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, setValue, control } = useForm<Settings>();
  const { fields, append, remove } = useFieldArray({ control, name: "nav.links" });

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((s: Settings) => {
      setValue("siteTitle", s.siteTitle);
      setValue("siteDescription", s.siteDescription);
      setValue("siteUrl", s.siteUrl);
      setValue("nav.logo", s.nav.logo);
      setValue("maintenance", s.maintenance);
      s.nav.links.forEach((link, i) => {
        setValue(`nav.links.${i}.label`, link.label);
        setValue(`nav.links.${i}.href`, link.href);
      });
      setLoading(false);
    });
  }, [setValue]);

  const onSubmit = async (data: Settings) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      toast.success("Settings saved!");
    } catch { toast.error("Save failed."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-[var(--text-muted)]">Loading...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div><h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">Settings</h2><p className="text-sm text-[var(--text-muted)] mt-1">Configure your site title, navigation, and more</p></div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Site */}
        <div className="card-glass p-6 space-y-4">
          <h3 className="font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">Site Info</h3>
          <div className="space-y-1.5"><label className="label-text">Site Title</label><input {...register("siteTitle")} className="form-input" /></div>
          <div className="space-y-1.5"><label className="label-text">Site Description</label><textarea {...register("siteDescription")} rows={2} className="form-input resize-none" /></div>
          <div className="space-y-1.5"><label className="label-text">Site URL</label><input {...register("siteUrl")} className="form-input" placeholder="https://jeffersonpadua.dev" /></div>
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("maintenance")} id="maintenance" className="h-4 w-4 rounded" />
            <label htmlFor="maintenance" className="text-sm text-[var(--text-secondary)]">Maintenance Mode — hides site from visitors</label>
          </div>
        </div>

        {/* Navigation */}
        <div className="card-glass p-6 space-y-4">
          <h3 className="font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">Navigation</h3>
          <div className="space-y-1.5"><label className="label-text">Logo Text</label><input {...register("nav.logo")} className="form-input" placeholder="Jefferson.dev" /></div>
          <div className="space-y-2">
            <label className="label-text">Nav Links</label>
            {fields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <input {...register(`nav.links.${i}.label`)} placeholder="Label" className="form-input flex-1" />
                <input {...register(`nav.links.${i}.href`)} placeholder="/path" className="form-input flex-1" />
                <button type="button" onClick={() => remove(i)} className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 border border-[var(--border-color)] transition-colors"><Trash2 size={14} /></button>
              </div>
            ))}
            <button type="button" onClick={() => append({ label: "", href: "/" })}
              className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              <Plus size={14} /> Add Link
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className={cn("flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-sm transition-all", saving && "opacity-70 cursor-not-allowed")}>
            {saving ? <><div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Saving...</> : <><Save size={15} />Save Settings</>}
          </button>
        </div>
      </form>
    </div>
  );
}
