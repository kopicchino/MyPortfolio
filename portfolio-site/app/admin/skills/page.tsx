"use client";
/**
 * app/admin/skills/page.tsx — Skills manager with category view
 */
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Plus, Trash2, Save, ChevronDown, ChevronUp } from "lucide-react";
import type { SkillsData, SkillCategory, Skill } from "@/types";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export default function AdminSkillsPage() {
  const [data, setData] = useState<SkillsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string[]>([]);

  const load = async () => {
    const r = await fetch("/api/admin/skills");
    setData(await r.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/skills/all", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Skills saved!");
    } catch { toast.error("Save failed."); }
    finally { setSaving(false); }
  };

  const addCategory = () => {
    if (!data) return;
    const id = `cat-${uuidv4().slice(0, 6)}`;
    setData({ ...data, categories: [...data.categories, { id, name: "New Category", icon: "Code", skills: [] }] });
    setExpanded((e) => [...e, id]);
  };

  const removeCategory = (id: string) => {
    if (!data) return;
    if (!confirm("Delete this entire category and all its skills?")) return;
    setData({ ...data, categories: data.categories.filter((c) => c.id !== id) });
  };

  const updateCategory = (id: string, name: string) => {
    if (!data) return;
    setData({ ...data, categories: data.categories.map((c) => c.id === id ? { ...c, name } : c) });
  };

  const addSkill = (catId: string) => {
    if (!data) return;
    const newSkill: Skill = { id: `skill-${uuidv4().slice(0, 6)}`, name: "", icon: "", level: 50, years: 1 };
    setData({ ...data, categories: data.categories.map((c) => c.id === catId ? { ...c, skills: [...c.skills, newSkill] } : c) });
  };

  const updateSkill = (catId: string, skillId: string, updates: Partial<Skill>) => {
    if (!data) return;
    setData({ ...data, categories: data.categories.map((c) => c.id === catId ? { ...c, skills: c.skills.map((s) => s.id === skillId ? { ...s, ...updates } : s) } : c) });
  };

  const removeSkill = (catId: string, skillId: string) => {
    if (!data) return;
    setData({ ...data, categories: data.categories.map((c) => c.id === catId ? { ...c, skills: c.skills.filter((s) => s.id !== skillId) } : c) });
  };

  const toggleExpand = (id: string) => setExpanded((e) => e.includes(id) ? e.filter((x) => x !== id) : [...e, id]);

  if (loading) return <div className="text-[var(--text-muted)]">Loading...</div>;
  if (!data) return <div className="text-red-400">Failed to load skills data.</div>;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">Skills</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">{data.categories.length} categories · {data.categories.reduce((sum, c) => sum + c.skills.length, 0)} total skills</p>
        </div>
        <div className="flex gap-2">
          <button onClick={addCategory} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-indigo-400 transition-colors">
            <Plus size={14} /> Add Category
          </button>
          <button onClick={save} disabled={saving}
            className={cn("flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 transition-all", saving && "opacity-70 cursor-not-allowed")}>
            {saving ? <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Save size={14} />}
            Save All
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {data.categories.map((cat) => (
          <div key={cat.id} className="card-glass overflow-hidden">
            {/* Category header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border-color)] cursor-pointer" onClick={() => toggleExpand(cat.id)}>
              <div className="flex-1">
                <input value={cat.name} onChange={(e) => { e.stopPropagation(); updateCategory(cat.id, e.target.value); }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-transparent font-semibold text-[var(--text-primary)] outline-none border-b border-transparent focus:border-indigo-500/50 w-full"
                />
              </div>
              <span className="text-xs text-[var(--text-muted)]">{cat.skills.length} skills</span>
              <button onClick={(e) => { e.stopPropagation(); removeCategory(cat.id); }} className="p-1 text-[var(--text-muted)] hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
              {expanded.includes(cat.id) ? <ChevronUp size={16} className="text-[var(--text-muted)]" /> : <ChevronDown size={16} className="text-[var(--text-muted)]" />}
            </div>

            {/* Skills list */}
            {expanded.includes(cat.id) && (
              <div className="p-4 space-y-2">
                {cat.skills.length === 0 && (
                  <p className="text-xs text-[var(--text-muted)] text-center py-2">No skills yet. Add one below.</p>
                )}
                {cat.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)] group">
                    <input value={skill.name} onChange={(e) => updateSkill(cat.id, skill.id, { name: e.target.value })}
                      placeholder="Skill name" className="form-input flex-1 h-8 text-sm py-1" />
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs text-[var(--text-muted)]">Level:</span>
                      <input type="number" value={skill.level} min={0} max={100}
                        onChange={(e) => updateSkill(cat.id, skill.id, { level: parseInt(e.target.value) || 0 })}
                        className="form-input w-16 h-8 text-sm py-1 text-center" />
                      <span className="text-xs text-[var(--text-muted)]">%</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs text-[var(--text-muted)]">Yrs:</span>
                      <input type="number" value={skill.years} min={0} max={20}
                        onChange={(e) => updateSkill(cat.id, skill.id, { years: parseInt(e.target.value) || 0 })}
                        className="form-input w-14 h-8 text-sm py-1 text-center" />
                    </div>
                    <button onClick={() => removeSkill(cat.id, skill.id)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                <button onClick={() => addSkill(cat.id)}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors mt-2">
                  <Plus size={12} /> Add Skill
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
