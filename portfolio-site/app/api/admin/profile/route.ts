/**
 * app/api/admin/profile/route.ts — Profile Read & Update
 */
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getProfile, writeJsonFile } from "@/lib/data";

async function authorize() {
  const session = await getAdminSession();
  return !!session;
}

export async function GET() {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getProfile());
}

export async function PUT(req: Request) {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const updated = { ...getProfile(), ...body, updatedAt: new Date().toISOString() };
  writeJsonFile("profile.json", updated);
  return NextResponse.json({ success: true, data: updated });
}
