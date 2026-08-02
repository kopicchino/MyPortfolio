import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readJsonFile } from "@/lib/data";
import { addItem, updateItem, deleteItem, toggleFeatured } from "@/lib/admin-data";
import { v4 as uuidv4 } from "uuid";

async function ok() { return !!(await getAdminSession()); }

export async function GET() {
  if (!await ok()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(readJsonFile("education.json"));
}
export async function POST(req: Request) {
  if (!await ok()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  return NextResponse.json({ success: true, data: addItem("education.json", { ...b, id: b.id || uuidv4(), order: 0 }) });
}
export async function PUT(req: Request) {
  if (!await ok()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, action, ...u } = await req.json();
  if (action === "toggleFeatured") return NextResponse.json({ success: true, data: toggleFeatured("education.json", id) });
  return NextResponse.json({ success: true, data: updateItem("education.json", id, u) });
}
export async function DELETE(req: Request) {
  if (!await ok()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  return NextResponse.json({ success: true, data: deleteItem("education.json", id) });
}
