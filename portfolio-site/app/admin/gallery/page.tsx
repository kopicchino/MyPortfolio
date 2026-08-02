"use client";

/**
 * app/admin/gallery/page.tsx — Admin Media Library
 * Full file browser + upload UI.
 */

import { useState, useEffect } from "react";
import { FileUploader } from "@/components/admin/FileUploader";
import Image from "next/image";
import { formatFileSize, isImageFile } from "@/lib/utils";
import { Folder, FileIcon, Trash2, Copy, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface FileItem {
  type: "file" | "folder";
  name: string;
  url: string;
  size?: number;
  modifiedAt?: string;
  children?: FileItem[];
}

export default function AdminGalleryPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const load = async (folder = "") => {
    setLoading(true);
    const url = folder ? `/api/upload?folder=${folder}` : "/api/upload";
    const res = await fetch(url);
    setFiles(await res.json());
    setCurrentFolder(folder);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (fileUrl: string) => {
    if (!confirm("Delete this file?")) return;
    const res = await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: fileUrl }),
    });
    if (res.ok) {
      toast.success("File deleted!");
      load(currentFolder);
    } else {
      toast.error("Delete failed.");
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">Media Library</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">Upload and manage all your images and files</p>
        </div>
        <button onClick={() => load(currentFolder)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-color)] transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Upload zone */}
      <div className="card-glass p-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">Upload Files</h3>
        <FileUploader
          folder={currentFolder || "general"}
          onUpload={() => load(currentFolder)}
        />
      </div>

      {/* Folder navigation */}
      {currentFolder && (
        <button onClick={() => load("")}
          className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
          ← Back to root
        </button>
      )}

      {/* File grid */}
      {loading ? (
        <div className="flex items-center gap-3 text-[var(--text-muted)]">
          <div className="h-5 w-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          Loading files...
        </div>
      ) : (
        <div>
          {files.length === 0 ? (
            <div className="text-center py-16 card-glass">
              <p className="text-4xl mb-3">📂</p>
              <p className="text-[var(--text-muted)]">No files yet. Upload some above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {files.map((item) => (
                <div
                  key={item.url}
                  onClick={() => setSelected(selected === item.url ? null : item.url)}
                  className={cn(
                    "card-glass p-3 cursor-pointer group relative transition-all",
                    selected === item.url && "border-indigo-500/50 bg-indigo-500/5"
                  )}
                >
                  {/* Preview */}
                  <div className="aspect-square rounded-lg overflow-hidden bg-[var(--bg-tertiary)] mb-2 flex items-center justify-center">
                    {item.type === "folder" ? (
                      <Folder size={32} className="text-indigo-400" />
                    ) : isImageFile(item.name) ? (
                      <Image src={item.url} alt={item.name} width={100} height={100}
                        className="object-cover w-full h-full" />
                    ) : (
                      <FileIcon size={24} className="text-[var(--text-muted)]" />
                    )}
                  </div>

                  {/* Name */}
                  <p className="text-xs text-[var(--text-primary)] font-medium truncate">{item.name}</p>
                  {item.size && <p className="text-[10px] text-[var(--text-muted)]">{formatFileSize(item.size)}</p>}

                  {/* Actions overlay */}
                  {item.type === "file" && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); copyUrl(item.url); }}
                        className="p-1 rounded bg-black/60 text-white hover:bg-black/80">
                        <Copy size={10} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(item.url); }}
                        className="p-1 rounded bg-red-500/80 text-white hover:bg-red-600">
                        <Trash2 size={10} />
                      </button>
                    </div>
                  )}

                  {item.type === "folder" && (
                    <button onClick={() => load(item.name)} className="absolute inset-0 w-full h-full opacity-0" aria-label="Open folder" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected file details */}
      {selected && (
        <div className="card-glass p-4 flex items-center gap-4">
          <div className="h-16 w-16 rounded-lg overflow-hidden bg-[var(--bg-tertiary)] flex items-center justify-center shrink-0">
            {isImageFile(selected) ? (
              <Image src={selected} alt="preview" width={64} height={64} className="object-cover w-full h-full" />
            ) : (
              <FileIcon size={24} className="text-[var(--text-muted)]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">{selected}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Click URL to copy</p>
          </div>
          <button onClick={() => copyUrl(selected)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shrink-0">
            <Copy size={13} /> Copy URL
          </button>
        </div>
      )}
    </div>
  );
}
