import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminEmail } from "@/auth";
import { deleteLead, updateLeadStatus } from "@/lib/db";

const schema = z.object({
  status: z.enum(["new", "contacted"]),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { id } = await context.params;
  const updated = await updateLeadStatus(id, parsed.data.status);
  if (!updated) return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const deleted = await deleteLead(id);
  if (!deleted) return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
