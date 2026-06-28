import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminEmail } from "@/auth";
import { deleteStudent, updateStudent } from "@/lib/db-students";

const schema = z.object({
  name: z.string().trim().min(1).max(160).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().max(40).optional(),
  year: z.string().max(60).optional(),
  roleInterests: z.array(z.string().max(80)).max(20).optional(),
  skills: z.array(z.string().max(80)).max(40).optional(),
  status: z.enum(["eligible", "placed", "inactive"]).optional(),
  resumeUrl: z.string().max(500).optional(),
  customFields: z.record(z.string(), z.string()).optional(),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid student data." }, { status: 400 });

  const { id } = await context.params;
  const student = await updateStudent(id, parsed.data);
  if (!student) return NextResponse.json({ error: "Student not found." }, { status: 404 });
  return NextResponse.json({ ok: true, student });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const deleted = await deleteStudent(id);
  if (!deleted) return NextResponse.json({ error: "Student not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
