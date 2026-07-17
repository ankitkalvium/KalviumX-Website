import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminEmail } from "@/auth";
import { deleteOpportunity, updateOpportunityStatus } from "@/lib/repo/opportunities";

const schema = z.object({
  status: z.enum(["reviewed", "rejected"]),
  rejectionReason: z.string().min(2).max(1000).optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || (parsed.data.status === "rejected" && !parsed.data.rejectionReason)) {
    return NextResponse.json({ error: "A rejection reason is required." }, { status: 400 });
  }

  const { id } = await context.params;
  const updated = await updateOpportunityStatus(
    id,
    parsed.data.status,
    adminEmail,
    parsed.data.rejectionReason,
  );
  if (!updated) return NextResponse.json({ error: "Opportunity not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const deleted = await deleteOpportunity(id);
  if (!deleted) return NextResponse.json({ error: "Opportunity not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
