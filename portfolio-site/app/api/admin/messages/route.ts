/**
 * app/api/admin/messages/route.ts — Messages inbox API
 */
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import fs from "fs";
import path from "path";

const MESSAGES_FILE = path.join(process.cwd(), "data", "messages.json");

function readMessages(): object[] {
  try {
    if (!fs.existsSync(MESSAGES_FILE)) return [];
    return JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
  } catch { return []; }
}

function writeMessages(data: object[]) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(data, null, 2));
}

async function authorize() { return !!(await getAdminSession()); }

export async function GET() {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const msgs = readMessages();
  msgs.sort((a, b) => new Date((b as { receivedAt: string }).receivedAt).getTime() - new Date((a as { receivedAt: string }).receivedAt).getTime());
  return NextResponse.json(msgs);
}

export async function PUT(req: Request) {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, read } = await req.json();
  const msgs = readMessages() as Array<{ id: string; read: boolean }>;
  const msg = msgs.find((m) => m.id === id);
  if (msg) msg.read = read;
  writeMessages(msgs);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  if (!await authorize()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const msgs = readMessages() as Array<{ id: string }>;
  writeMessages(msgs.filter((m) => m.id !== id));
  return NextResponse.json({ success: true });
}
