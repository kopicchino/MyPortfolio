"use client";

/**
 * components/admin/ImageUploadInput.tsx
 * An input field for image URLs with an integrated upload button & preview.
 * Uploads chosen image to /api/upload under the specified folder.
 */

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
}

export function ImageUploadInput({
  label,
  value,
  onChange,
  folder = "general",
  placeholder = "/uploads/...",
}: ImageUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
      toast.success("Image uploaded successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      toast.error(message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="label-text">{label}</label>

      <div className="flex gap-2">
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="form-input flex-1"
          placeholder={placeholder}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shrink-0 disabled:opacity-50"
        >
          {uploading ? (
            <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <>
              <Upload size={14} /> Upload
            </>
          )}
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 border border-[var(--border-color)] transition-colors shrink-0"
            title="Clear image"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Image Preview Thumbnail */}
      {value && (
        <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] w-fit max-w-full">
          <div className="h-12 w-12 rounded-lg bg-[var(--bg-card)] overflow-hidden relative border border-[var(--border-color)] shrink-0 flex items-center justify-center">
            {value.startsWith("/") || value.startsWith("http") ? (
              <Image
                src={value}
                alt="Preview"
                width={48}
                height={48}
                className="object-cover w-full h-full"
                onError={() => {}}
              />
            ) : (
              <ImageIcon size={20} className="text-[var(--text-muted)]" />
            )}
          </div>
          <div className="min-w-0 flex-1 pr-2">
            <p className="text-xs font-mono text-[var(--text-muted)] truncate max-w-[200px]">
              {value}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
