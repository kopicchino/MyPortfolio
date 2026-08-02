/**
 * app/api/admin/settings/route.ts
 */
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getSettings, writeJsonFile } from "@/lib/data";

async function authorize() { return !!(await getAdminSession()); }

export async function GET() {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getSettings());
}

export async function PUT(req: Request) {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const updated = { ...getSettings(), ...body, updatedAt: new Date().toISOString() };
  writeJsonFile("settings.json", updated);
  return NextResponse.json({ success: true, data: updated });
}
