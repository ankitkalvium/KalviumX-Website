import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminEmail } from "@/auth";
import { DEAL_STAGES, deleteDeal, updateDealStage } from "@/lib/db-deals";

const schema = z.object({ stage: z.enum(DEAL_STAGES) });

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid stage." }, { status: 400 });

  const { id } = await context.params;
  const deal = await updateDealStage(id, parsed.data.stage);
  if (!deal) return NextResponse.json({ error: "Deal not found." }, { status: 404 });
  return NextResponse.json({ ok: true, deal });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const deleted = await deleteDeal(id);
  if (!deleted) return NextResponse.json({ error: "Deal not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
