"use client";

/**
 * components/admin/DataTable.tsx
 * Reusable admin data table with search, delete, reorder actions.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Plus, Pencil, Trash2, Star, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  title: string;
  addHref?: string;
  editHref?: (row: T) => string;
  onDelete?: (id: string) => Promise<void>;
  onToggleFeatured?: (id: string, featured: boolean) => Promise<void>;
  viewHref?: string;
  searchKeys?: (keyof T)[];
  emptyMessage?: string;
}

export function DataTable<T extends { id: string; featured?: boolean }>({
  data,
  columns,
  title,
  addHref,
  editHref,
  onDelete,
  onToggleFeatured,
  viewHref,
  searchKeys = [],
  emptyMessage = "No entries yet.",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = data.filter((row) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return searchKeys.some((key) => {
      const val = row[key];
      return typeof val === "string" && val.toLowerCase().includes(q);
    });
  });

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    if (!confirm("Are you sure you want to delete this item? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await onDelete(id);
      toast.success("Deleted successfully!");
    } catch {
      toast.error("Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="search"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-9"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {viewHref && (
            <Link href={viewHref} target="_blank"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)] transition-colors">
              <Eye size={14} /> Preview
            </Link>
          )}
          {addHref && (
            <Link href={addHref}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 transition-all shadow-sm">
              <Plus size={14} /> Add New
            </Link>
          )}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-[var(--text-muted)]">
        {filtered.length} of {data.length} item{data.length !== 1 ? "s" : ""}
        {search && ` matching "${search}"`}
      </p>

      {/* Table */}
      <div className="card-glass overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-[var(--text-muted)]">{emptyMessage}</p>
            {addHref && (
              <Link href={addHref}
                className="inline-flex items-center gap-1.5 mt-4 text-sm text-indigo-400 hover:text-indigo-300">
                <Plus size={14} /> Add your first entry
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  {columns.map((col) => (
                    <th key={String(col.key)}
                      className={cn(
                        "px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider",
                        col.className
                      )}>
                      {col.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((row, i) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                      {columns.map((col) => (
                        <td key={String(col.key)}
                          className={cn("px-4 py-3 text-sm text-[var(--text-secondary)]", col.className)}>
                          {col.render
                            ? col.render(row)
                            : String(row[col.key as keyof T] ?? "")}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {onToggleFeatured && row.featured !== undefined && (
                            <button
                              onClick={() => onToggleFeatured(row.id, !row.featured!)}
                              className={cn(
                                "p-1.5 rounded-lg transition-colors",
                                row.featured
                                  ? "text-amber-400 bg-amber-500/10"
                                  : "text-[var(--text-muted)] hover:text-amber-400 hover:bg-amber-500/10"
                              )}
                              title={row.featured ? "Remove featured" : "Mark as featured"}
                            >
                              <Star size={14} className={row.featured ? "fill-amber-400" : ""} />
                            </button>
                          )}
                          {editHref && (
                            <Link href={editHref(row)}
                              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors">
                              <Pencil size={14} />
                            </Link>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => handleDelete(row.id)}
                              disabled={deletingId === row.id}
                              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                            >
                              {deletingId === row.id
                                ? <div className="h-3.5 w-3.5 rounded-full border-2 border-red-400/30 border-t-red-400 animate-spin" />
                                : <Trash2 size={14} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
