import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminEmail } from "@/auth";
import { createStudent } from "@/lib/repo/students";

const schema = z.object({
  name: z.string().trim().min(1).max(160),
  email: z.string().trim().email(),
  phone: z.string().max(40).optional(),
  year: z.string().max(60).optional(),
  roleInterests: z.array(z.string().max(80)).max(20).optional(),
  skills: z.array(z.string().max(80)).max(40).optional(),
  status: z.enum(["eligible", "placed", "inactive"]).optional(),
  resumeUrl: z.string().max(500).optional(),
  customFields: z.record(z.string(), z.string()).optional(),
});

export async function POST(request: Request) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid student data." }, { status: 400 });

  const student = await createStudent(parsed.data);
  return NextResponse.json({ ok: true, student });
}
