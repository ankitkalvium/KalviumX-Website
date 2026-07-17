import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertStudentsFromSheet } from "@/lib/repo/students";

// Public endpoint, protected by a shared secret header (same trust model as
// the Cal.com webhook signature) — called by an installable Apps Script
// trigger on the student tracker Google Sheet every time it's edited.
const rowSchema = z.object({
  email: z.string().trim().toLowerCase(),
  name: z.string().trim().optional().default(""),
  yearOfStudy: z.string().trim().optional().default(""),
  squadNumber: z.string().trim().optional().default(""),
  campusName: z.string().trim().optional().default(""),
  location: z.string().trim().optional().default(""),
  placementsStatus: z.string().trim().optional().default(""),
  eligibilityStatus: z.string().trim().optional().default(""),
  workIntegrationStatus: z.string().trim().optional().default(""),
  availabilityForWork: z.string().trim().optional().default(""),
});

const schema = z.object({
  students: z.array(rowSchema).max(5000),
});

export async function POST(request: Request) {
  const expectedSecret = process.env.STUDENT_SHEET_SYNC_SECRET;
  if (!expectedSecret) {
    return NextResponse.json({ error: "Sync is not configured on the server." }, { status: 503 });
  }
  const providedSecret = request.headers.get("x-sync-secret");
  if (providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload." }, { status: 400 });

  const validRows = parsed.data.students.filter((row) => row.email.includes("@"));
  const count = await upsertStudentsFromSheet(validRows);
  return NextResponse.json({ ok: true, count });
}
