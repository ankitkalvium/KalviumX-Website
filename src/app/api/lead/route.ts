import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

interface LeadPayload {
  email: string;
  role: string;
  interns: string;
  duration: string;
  notes?: string;
  source?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body: unknown): { ok: true; lead: LeadPayload } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request body." };
  }
  const b = body as Record<string, unknown>;
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const role = typeof b.role === "string" ? b.role.trim() : "";
  const interns = typeof b.interns === "string" ? b.interns.trim() : "";
  const duration = typeof b.duration === "string" ? b.duration.trim() : "";
  const notes = typeof b.notes === "string" ? b.notes.trim().slice(0, 2000) : "";
  const source = typeof b.source === "string" ? b.source.trim().slice(0, 100) : "";

  if (!EMAIL_RE.test(email)) return { ok: false, error: "Enter a valid work email." };
  if (!role) return { ok: false, error: "Role / stack is required." };
  if (!interns || Number.isNaN(Number(interns))) {
    return { ok: false, error: "Number of interns must be a number." };
  }
  if (!duration) return { ok: false, error: "Internship duration is required." };

  return { ok: true, lead: { email, role, interns, duration, notes, source } };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON." }, { status: 400 });
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json({ success: false, error: result.error }, { status: 422 });
  }

  const record = { ...result.lead, receivedAt: new Date().toISOString() };

  // Forward to CRM/notification webhook when configured (e.g. Zapier, Slack, Zoho).
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      if (!response.ok) {
        console.error(`Lead webhook failed with status ${response.status}`);
      }
    } catch (error: unknown) {
      console.error("Lead webhook error", error);
    }
  }

  // Local fallback log so no lead is ever lost in development.
  try {
    const dir = path.join(process.cwd(), ".leads");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "leads.jsonl"), `${JSON.stringify(record)}\n`);
  } catch (error: unknown) {
    console.error("Lead file log error", error);
  }

  return NextResponse.json({ success: true });
}
