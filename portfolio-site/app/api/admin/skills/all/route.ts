/**
 * app/api/admin/skills/all/route.ts — Full skills.json save endpoint
 */
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { writeJsonFile } from "@/lib/data";

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  writeJsonFile("skills.json", body);
  return NextResponse.json({ success: true });
}
