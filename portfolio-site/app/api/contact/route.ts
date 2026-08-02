/**
 * app/api/contact/route.ts — Contact Form API
 * Receives form submissions and logs them (extend to send email via Resend/Nodemailer).
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { writeJsonFile } from "@/lib/data";
import fs from "fs";
import path from "path";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(20).max(2000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    // Persist message to /data/messages.json
    const messagesPath = path.join(process.cwd(), "data", "messages.json");
    let messages: object[] = [];
    try {
      if (fs.existsSync(messagesPath)) {
        messages = JSON.parse(fs.readFileSync(messagesPath, "utf-8"));
      }
    } catch { /* first time */ }

    messages.push({
      id: crypto.randomUUID(),
      name,
      email,
      subject,
      message,
      receivedAt: new Date().toISOString(),
      read: false,
    });

    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));

    // Log for development
    console.log(`📧 New contact from ${name} <${email}>: ${subject}`);

    return NextResponse.json({ success: true, message: "Message received!" });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
