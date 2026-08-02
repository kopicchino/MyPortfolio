/**
 * app/api/admin/achievements/route.ts — Achievements CRUD API
 */
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readJsonFile } from "@/lib/data";
import { addItem, updateItem, deleteItem, toggleFeatured } from "@/lib/admin-data";
import { v4 as uuidv4 } from "uuid";

async function authorize() {
  const session = await getAdminSession();
  return !!session;
}

export async function GET() {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(readJsonFile("achievements.json"));
}

export async function POST(req: Request) {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const updated = addItem("achievements.json", { ...body, id: body.id || uuidv4(), order: 0 });
  return NextResponse.json({ success: true, data: updated });
}

export async function PUT(req: Request) {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, action, ...updates } = body;
  if (action === "toggleFeatured") return NextResponse.json({ success: true, data: toggleFeatured("achievements.json", id) });
  return NextResponse.json({ success: true, data: updateItem("achievements.json", id, updates) });
}

export async function DELETE(req: Request) {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  return NextResponse.json({ success: true, data: deleteItem("achievements.json", id) });
}
