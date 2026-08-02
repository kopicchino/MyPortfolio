/**
 * app/api/admin/projects/route.ts — Projects CRUD API
 */
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getProjects } from "@/lib/data";
import { addItem, updateItem, deleteItem, toggleFeatured } from "@/lib/admin-data";
import { v4 as uuidv4 } from "uuid";

async function authorize() {
  const session = await getAdminSession();
  return !!session;
}

export async function GET() {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getProjects());
}

export async function POST(req: Request) {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const slug = body.title?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || uuidv4();
  const item = { ...body, id: body.id || uuidv4(), slug, order: 0 };
  const updated = addItem("projects.json", item);
  return NextResponse.json({ success: true, data: updated });
}

export async function PUT(req: Request) {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, action, ...updates } = body;
  if (action === "toggleFeatured") {
    const updated = toggleFeatured("projects.json", id);
    return NextResponse.json({ success: true, data: updated });
  }
  const updated = updateItem("projects.json", id, updates);
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(req: Request) {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const updated = deleteItem("projects.json", id);
  return NextResponse.json({ success: true, data: updated });
}
