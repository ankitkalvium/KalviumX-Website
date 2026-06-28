import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminEmail } from "@/auth";
import { deleteLeadsBulk, updateLeadStatusBulk } from "@/lib/db";

const patchSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(200),
  status: z.enum(["new", "contacted"]),
});

const deleteSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(200),
});

export async function PATCH(request: Request) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const updated = await updateLeadStatusBulk(parsed.data.ids, parsed.data.status);
  return NextResponse.json({ ok: true, updatedCount: updated.length });
}

export async function DELETE(request: Request) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = deleteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const deletedCount = await deleteLeadsBulk(parsed.data.ids);
  return NextResponse.json({ ok: true, deletedCount });
}
