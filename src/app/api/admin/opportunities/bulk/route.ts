import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminEmail } from "@/auth";
import { deleteOpportunitiesBulk, updateOpportunityStatusBulk } from "@/lib/db";

const patchSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(200),
  status: z.enum(["reviewed", "rejected"]),
  rejectionReason: z.string().min(2).max(1000).optional(),
});

const deleteSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(200),
});

export async function PATCH(request: Request) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || (parsed.data.status === "rejected" && !parsed.data.rejectionReason)) {
    return NextResponse.json({ error: "A rejection reason is required." }, { status: 400 });
  }

  const updated = await updateOpportunityStatusBulk(
    parsed.data.ids,
    parsed.data.status,
    adminEmail,
    parsed.data.rejectionReason,
  );
  return NextResponse.json({ ok: true, updatedCount: updated.length });
}

export async function DELETE(request: Request) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = deleteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const deletedCount = await deleteOpportunitiesBulk(parsed.data.ids);
  return NextResponse.json({ ok: true, deletedCount });
}
