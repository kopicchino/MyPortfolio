/**
 * app/api/upload/route.ts — File Upload API
 * Handles image/file uploads with Sharp optimization.
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_BASE = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE_MB = 20;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/x-pdf",
];

async function authorize() {
  const session = await getAdminSession();
  return !!session;
}

export async function POST(req: Request) {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";
    const quality = parseInt((formData.get("quality") as string) || "85");
    const maxWidth = parseInt((formData.get("maxWidth") as string) || "1920");

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return NextResponse.json({ error: `File too large (max ${MAX_SIZE_MB}MB)` }, { status: 400 });

    const fileType = file.type || "";
    const fileName = file.name || "file";
    const fileExt = path.extname(fileName).toLowerCase();
    const isPdf = fileExt === ".pdf" || fileType === "application/pdf" || fileType === "application/x-pdf";
    const isAllowed = isPdf || ALLOWED_TYPES.includes(fileType);
    if (!isAllowed) return NextResponse.json({ error: "Invalid file type" }, { status: 400 });

    const uploadDir = path.join(UPLOAD_BASE, folder);
    fs.mkdirSync(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = isPdf ? "pdf" : "webp";
    const filename = `${Date.now()}-${uuidv4().slice(0, 8)}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    if (isPdf) {
      fs.writeFileSync(filepath, buffer);
    } else {
      await sharp(buffer)
        .resize({ width: maxWidth, withoutEnlargement: true })
        .webp({ quality })
        .toFile(filepath);
    }

    const url = `/uploads/${folder}/${filename}`;
    const stats = fs.statSync(filepath);

    return NextResponse.json({ success: true, url, filename, size: stats.size });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { url } = await req.json();
  if (!url || !url.startsWith("/uploads/")) return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  const filepath = path.join(process.cwd(), "public", url);
  try {
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder") || "";
  const scanDir = folder ? path.join(UPLOAD_BASE, folder) : UPLOAD_BASE;

  function scanFiles(dir: string, baseUrl = "/uploads"): object[] {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true }).map((entry) => {
      const url = `${baseUrl}/${entry.name}`;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return { type: "folder", name: entry.name, url, children: scanFiles(fullPath, url) };
      const stats = fs.statSync(fullPath);
      return { type: "file", name: entry.name, url, size: stats.size, modifiedAt: stats.mtime.toISOString() };
    });
  }

  return NextResponse.json(scanFiles(scanDir));
}
