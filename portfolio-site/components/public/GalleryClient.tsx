"use client";

/**
 * components/public/GalleryClient.tsx
 * Masonry gallery with lightbox and album filtering.
 */

import { useState, useMemo } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/styles.css";
import { motion, AnimatePresence } from "framer-motion";
import { cn, uniqueValues } from "@/lib/utils";
import type { GalleryItem } from "@/types";
import { ZoomIn } from "lucide-react";

interface GalleryClientProps {
  items: GalleryItem[];
}

const ALL = "All";

export function GalleryClient({ items }: GalleryClientProps) {
  const [activeAlbum, setActiveAlbum] = useState(ALL);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const albums = [ALL, ...uniqueValues(items.map((i) => i.album))];

  const filtered = useMemo(() => {
    if (activeAlbum === ALL) return items;
    return items.filter((i) => i.album === activeAlbum);
  }, [items, activeAlbum]);

  const openImage = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Album filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {albums.map((album) => (
          <button
            key={album}
            onClick={() => setActiveAlbum(album)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              activeAlbum === album
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-color)]"
            )}
          >
            {album}
            <span className="ml-1.5 text-xs opacity-60">
              ({album === ALL ? items.length : items.filter((i) => i.album === album).length})
            </span>
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <motion.div
        layout
        className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl"
              onClick={() => openImage(index)}
            >
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={item.width || 400}
                  height={item.height || 300}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <div className="w-full">
                    <p className="text-white text-sm font-semibold line-clamp-1">{item.title}</p>
                    {item.description && (
                      <p className="text-white/70 text-xs line-clamp-1">{item.description}</p>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 text-white">
                    <ZoomIn size={16} />
                  </div>
                </div>
                {item.featured && (
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-[10px] font-semibold">
                      ⭐
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[var(--text-muted)]">No photos in this album.</p>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={filtered.map((item) => ({
          src: item.image,
          title: item.title,
          description: item.description,
        }))}
        plugins={[Zoom, Download]}
      />
    </>
  );
}
