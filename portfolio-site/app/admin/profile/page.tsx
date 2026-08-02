"use client";

/**
 * app/admin/profile/page.tsx — Profile Editor
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";
import { ImageUploadInput } from "@/components/admin/ImageUploadInput";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<Profile>();

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((p: Profile) => {
        Object.entries(p).forEach(([k, v]) => {
          if (typeof v !== "object") setValue(k as keyof Profile, v as never);
        });
        if (p.social) {
          Object.entries(p.social).forEach(([k, v]) => {
            setValue(`social.${k as keyof Profile["social"]}`, v as never);
          });
        }
        setLoading(false);
      });
  }, [setValue]);

  const onSubmit = async (data: Profile) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-[var(--text-muted)]">Loading...</div>;

  const inputGroup = (label: string, name: keyof Profile, type = "text", placeholder = "") => (
    <div className="space-y-1.5">
      <label className="label-text">{label}</label>
      <input type={type} {...register(name as never)} className="form-input" placeholder={placeholder} />
    </div>
  );

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">Profile</h2>
        <p className="text-sm text-[var(--text-muted)] mt-1">Update your personal information</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal */}
        <div className="card-glass p-6 space-y-4">
          <h3 className="font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">Personal Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {inputGroup("Full Name", "name", "text", "e.g. Jeffrey Cruz")}
            {inputGroup("Title", "title", "text", "e.g. BSIT Student & Developer")}
          </div>
          {inputGroup("Tagline", "tagline", "text", "One-line tagline")}
          <div className="space-y-1.5">
            <label className="label-text">Bio</label>
            <textarea {...register("bio")} rows={4} className="form-input resize-none" placeholder="Tell your story..." />
          </div>
          <div className="space-y-1.5">
            <label className="label-text">Mission</label>
            <textarea {...register("mission")} rows={2} className="form-input resize-none" />
          </div>
          <div className="space-y-1.5">
            <label className="label-text">Vision</label>
            <textarea {...register("vision")} rows={2} className="form-input resize-none" />
          </div>
        </div>

        {/* Contact */}
        <div className="card-glass p-6 space-y-4">
          <h3 className="font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {inputGroup("Email", "email", "email", "you@example.com")}
            {inputGroup("Phone", "phone", "text", "+63 912 000 0000")}
            {inputGroup("Location", "location", "text", "Manila, Philippines")}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUploadInput
              label="Avatar Photo"
              value={watch("avatar") || ""}
              onChange={(url) => setValue("avatar", url)}
              folder="profile"
              placeholder="/uploads/profile/avatar.jpg"
            />
            <ImageUploadInput
              label="Resume File (PDF / Image)"
              value={watch("resume") || ""}
              onChange={(url) => setValue("resume", url)}
              folder="resume"
              accept="image/*,.pdf,application/pdf"
              placeholder="/uploads/resume/resume.pdf"
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("available")} id="available" className="h-4 w-4 rounded border-[var(--border-color)] text-indigo-500" />
            <label htmlFor="available" className="text-sm text-[var(--text-secondary)]">Open to opportunities</label>
          </div>
        </div>

        {/* Social */}
        <div className="card-glass p-6 space-y-4">
          <h3 className="font-semibold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">Social Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="label-text">GitHub</label>
              <input {...register("social.github")} className="form-input" placeholder="https://github.com/..." />
            </div>
            <div className="space-y-1.5">
              <label className="label-text">LinkedIn</label>
              <input {...register("social.linkedin")} className="form-input" placeholder="https://linkedin.com/in/..." />
            </div>
            <div className="space-y-1.5">
              <label className="label-text">Facebook</label>
              <input {...register("social.facebook")} className="form-input" placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-1.5">
              <label className="label-text">Twitter</label>
              <input {...register("social.twitter")} className="form-input" placeholder="https://twitter.com/..." />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold",
              "bg-gradient-to-r from-indigo-600 to-violet-600 text-white",
              "hover:from-indigo-500 hover:to-violet-500 shadow-sm transition-all",
              saving && "opacity-70 cursor-not-allowed"
            )}>
            {saving ? <><div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Saving...</> : <><Save size={15} />Save Profile</>}
          </button>
        </div>
      </form>
    </div>
  );
}
