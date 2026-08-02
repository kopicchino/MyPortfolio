"use client";

/**
 * app/admin/events/[id]/page.tsx — Event Editor
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Event } from "@/types";
import { v4 as uuidv4 } from "uuid";

type FormData = Omit<Event, "id" | "order">;

export default function EventEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      title: "", subtitle: "", type: "Competition",
      date: new Date().toISOString().split("T")[0], endDate: "",
      location: "", online: false, organizer: "", role: "Participant",
      description: "", responsibilities: [], photos: [], tags: [], featured: false,
      result: "", certificate: "", website: "",
    },
  });

  useEffect(() => {
    if (!isNew) {
      fetch("/api/admin/events")
        .then((r) => r.json())
        .then((items: Event[]) => {
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
      const res = await fetch("/api/admin/events", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      toast.success(isNew ? "Event created!" : "Event updated!");
      router.push("/admin/events");
    } catch { toast.error("Failed to save event."); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-[var(--text-muted)]">Loading...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/events" className="p-2 rounded-xl hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">{isNew ? "Add Event" : "Edit Event"}</h2>
          <p className="text-sm text-[var(--text-muted)]">Hackathon, workshop, or conference</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card-glass p-6 space-y-4">
          <div className="space-y-1.5"><label className="label-text">Event Title *</label><input {...register("title", { required: true })} className="form-input" placeholder="Technolympics 2024" /></div>
          <div className="space-y-1.5"><label className="label-text">Subtitle</label><input {...register("subtitle")} className="form-input" placeholder="Annual inter-school IT competition" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="label-text">Organizer *</label><input {...register("organizer", { required: true })} className="form-input" placeholder="TUP Manila" /></div>
            <div className="space-y-1.5"><label className="label-text">Event Type</label><select {...register("type")} className="form-input"><option value="Competition">Competition</option><option value="Conference">Conference</option><option value="Workshop">Workshop</option><option value="Hackathon">Hackathon</option><option value="Meetup">Meetup</option></select></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="label-text">Your Role</label><input {...register("role")} className="form-input" placeholder="e.g. Participant, Speaker" /></div>
            <div className="space-y-1.5"><label className="label-text">Result / Award</label><input {...register("result")} className="form-input" placeholder="e.g. 2nd Place" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="label-text">Start Date *</label><input type="date" {...register("date", { required: true })} className="form-input" /></div>
            <div className="space-y-1.5"><label className="label-text">End Date</label><input type="date" {...register("endDate")} className="form-input" /></div>
          </div>
          <div className="space-y-1.5"><label className="label-text">Location</label><input {...register("location")} className="form-input" placeholder="TUP Manila Auditorium" /></div>
          <div className="space-y-1.5"><label className="label-text">Description</label><textarea {...register("description")} rows={3} className="form-input resize-none" placeholder="Summary of what took place..." /></div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" {...register("featured")} id="evt-featured" className="h-4 w-4 rounded" />
            <label htmlFor="evt-featured" className="text-sm text-[var(--text-secondary)]">Mark as Featured</label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/admin/events"><button type="button" className="px-5 py-2.5 rounded-xl text-sm bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]">Cancel</button></Link>
          <button type="submit" disabled={saving} className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500", saving && "opacity-70 cursor-not-allowed")}>
            {saving ? <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Save size={15} />} Save Event
          </button>
        </div>
      </form>
    </div>
  );
}
