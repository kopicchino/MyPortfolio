/**
 * lib/upload.ts
 * File upload utilities — image validation, compression (Sharp), and saving.
 * Used by /api/upload route on the server.
 */

import path from "path";
import fs from "fs";
import { slugify } from "./utils";

export const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  ...ALLOWED_IMAGE_TYPES,
];

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024; // 20MB

// ------------------------------------------------------------------
// Validation
// ------------------------------------------------------------------
export function validateImageFile(
  mimetype: string,
  size: number
): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(mimetype)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: PNG, JPG, JPEG, WEBP, SVG`,
    };
  }
  if (size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: 10MB`,
    };
  }
  return { valid: true };
}

export function validateDocumentFile(
  mimetype: string,
  size: number
): { valid: boolean; error?: string } {
  if (!ALLOWED_DOCUMENT_TYPES.includes(mimetype)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: PDF, PNG, JPG, WEBP`,
    };
  }
  if (size > MAX_DOCUMENT_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: 20MB`,
    };
  }
  return { valid: true };
}

// ------------------------------------------------------------------
// Directory management
// ------------------------------------------------------------------
export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function getUploadDir(category: string, subfolder?: string): string {
  const parts = [UPLOADS_DIR, category];
  if (subfolder) parts.push(slugify(subfolder));
  const dir = path.join(...parts);
  ensureDir(dir);
  return dir;
}

// ------------------------------------------------------------------
// Filename generation (SEO-friendly)
// ------------------------------------------------------------------
export function generateSeoFilename(
  originalName: string,
  prefix?: string
): string {
  const ext = path.extname(originalName).toLowerCase();
  const base = path.basename(originalName, ext);
  const slugged = slugify(base);
  const timestamp = Date.now();
  const prefixPart = prefix ? `${slugify(prefix)}-` : "";
  return `${prefixPart}${slugged}-${timestamp}${ext}`;
}

// ------------------------------------------------------------------
// Image processing with Sharp
// ------------------------------------------------------------------
export async function processAndSaveImage(
  buffer: Buffer,
  outputPath: string,
  mimetype: string,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<{ width: number; height: number; size: number }> {
  const { maxWidth = 1920, maxHeight = 1080, quality = 85 } = options;

  // Skip Sharp processing for SVG files
  if (mimetype === "image/svg+xml") {
    fs.writeFileSync(outputPath, buffer);
    return { width: 0, height: 0, size: buffer.length };
  }

  try {
    // Dynamic import of Sharp (server-side only)
    const sharp = (await import("sharp")).default;

    const image = sharp(buffer).rotate(); // auto-rotate based on EXIF

    // Get image metadata
    const metadata = await image.metadata();
    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;

    // Only resize if larger than max dimensions
    let pipeline = image;
    if (originalWidth > maxWidth || originalHeight > maxHeight) {
      pipeline = image.resize(maxWidth, maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Determine output format from file extension
    const ext = path.extname(outputPath).toLowerCase();
    let outputBuffer: Buffer;
    let finalWidth = originalWidth;
    let finalHeight = originalHeight;

    if (ext === ".webp") {
      outputBuffer = await pipeline.webp({ quality }).toBuffer();
    } else if (ext === ".png") {
      outputBuffer = await pipeline
        .png({ compressionLevel: 8, quality })
        .toBuffer();
    } else {
      outputBuffer = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
    }

    fs.writeFileSync(outputPath, outputBuffer);

    // Get final dimensions
    const finalMeta = await sharp(outputBuffer).metadata();
    finalWidth = finalMeta.width || finalWidth;
    finalHeight = finalMeta.height || finalHeight;

    return {
      width: finalWidth,
      height: finalHeight,
      size: outputBuffer.length,
    };
  } catch (error) {
    // Fallback: save without processing
    console.error("Sharp processing failed, saving original:", error);
    fs.writeFileSync(outputPath, buffer);
    return { width: 0, height: 0, size: buffer.length };
  }
}

// ------------------------------------------------------------------
// Delete file utility
// ------------------------------------------------------------------
export function deleteUploadedFile(publicPath: string): boolean {
  try {
    // publicPath is like /uploads/projects/cover.jpg
    // Convert to absolute path
    const absolutePath = path.join(
      process.cwd(),
      "public",
      publicPath.replace(/^\//, "")
    );
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ------------------------------------------------------------------
// List uploaded files in a category
// ------------------------------------------------------------------
export function listUploads(
  category: string,
  subfolder?: string
): string[] {
  const dir = getUploadDir(category, subfolder);
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => !f.startsWith("."))
      .map((f) => {
        const rel = path.relative(
          path.join(process.cwd(), "public"),
          path.join(dir, f)
        );
        return `/${rel.replace(/\\/g, "/")}`;
      });
  } catch {
    return [];
  }
}
