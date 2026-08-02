"use client";

/**
 * components/admin/FileUploader.tsx
 * Drag-and-drop file upload component with progress and preview.
 */

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, CheckCircle, AlertCircle, FileIcon } from "lucide-react";
import { formatFileSize, isImageFile } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface UploadedFile {
  file: File;
  url?: string;
  status: "pending" | "uploading" | "done" | "error";
  progress?: number;
  error?: string;
}

interface FileUploaderProps {
  folder?: string;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSizeMB?: number;
  quality?: number;
  maxWidth?: number;
  onUpload?: (url: string) => void;
  className?: string;
}

export function FileUploader({
  folder = "general",
  accept = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
    "image/gif": [".gif"],
    "application/pdf": [".pdf"],
  },
  maxFiles = 10,
  maxSizeMB = 10,
  quality = 85,
  maxWidth = 1920,
  onUpload,
  className,
}: FileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const uploadFile = async (item: UploadedFile): Promise<void> => {
    const form = new FormData();
    form.append("file", item.file);
    form.append("folder", folder);
    form.append("quality", String(quality));
    form.append("maxWidth", String(maxWidth));

    try {
      // Update status to uploading
      setFiles((prev) =>
        prev.map((f) => f.file === item.file ? { ...f, status: "uploading" } : f)
      );

      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.error || "Upload failed");

      setFiles((prev) =>
        prev.map((f) => f.file === item.file ? { ...f, status: "done", url: data.url } : f)
      );

      onUpload?.(data.url);
      toast.success(`${item.file.name} uploaded!`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setFiles((prev) =>
        prev.map((f) => f.file === item.file ? { ...f, status: "error", error: message } : f)
      );
      toast.error(message);
    }
  };

  const onDrop = useCallback(async (accepted: File[]) => {
    const newFiles: UploadedFile[] = accepted.map((file) => ({
      file,
      status: "pending" as const,
    }));
    setFiles((prev) => [...prev, ...newFiles]);

    // Upload concurrently
    await Promise.all(newFiles.map(uploadFile));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder, quality, maxWidth]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize: maxSizeMB * 1024 * 1024,
    onDropRejected: (rejections) => {
      rejections.forEach((r) => {
        toast.error(`${r.file.name}: ${r.errors[0]?.message}`);
      });
    },
  });

  const removeFile = (file: File) => {
    setFiles((prev) => prev.filter((f) => f.file !== file));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied!");
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-indigo-500 bg-indigo-500/5"
            : "border-[var(--border-color)] hover:border-indigo-500/50 hover:bg-indigo-500/5"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            "p-4 rounded-xl transition-colors",
            isDragActive ? "bg-indigo-500/20 text-indigo-400" : "bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
          )}>
            <Upload size={28} />
          </div>
          <div>
            <p className="font-semibold text-[var(--text-primary)]">
              {isDragActive ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              or <span className="text-indigo-400">click to browse</span> · Max {maxSizeMB}MB · {maxFiles} files
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              JPG, PNG, WebP, GIF, PDF · Auto-compressed to WebP
            </p>
          </div>
        </div>
      </div>

      {/* File list */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((item) => (
              <motion.div
                key={item.file.name + item.file.size}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="card-glass p-3 flex items-center gap-3"
              >
                {/* Preview / icon */}
                <div className="h-12 w-12 rounded-lg bg-[var(--bg-tertiary)] overflow-hidden flex items-center justify-center shrink-0">
                  {item.url && isImageFile(item.url) ? (
                    <Image src={item.url} alt={item.file.name} width={48} height={48} className="object-cover w-full h-full" />
                  ) : (
                    <FileIcon size={20} className="text-[var(--text-muted)]" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">{item.file.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{formatFileSize(item.file.size)}</p>
                  {item.url && (
                    <button onClick={() => copyUrl(item.url!)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 truncate max-w-full block">
                      {item.url} (click to copy)
                    </button>
                  )}
                  {item.error && <p className="text-xs text-red-400">{item.error}</p>}
                </div>

                {/* Status */}
                <div className="shrink-0 flex items-center gap-2">
                  {item.status === "uploading" && (
                    <div className="h-5 w-5 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                  )}
                  {item.status === "done" && <CheckCircle size={18} className="text-emerald-400" />}
                  {item.status === "error" && <AlertCircle size={18} className="text-red-400" />}
                  <button onClick={() => removeFile(item.file)}
                    className="p-1 rounded-lg hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
