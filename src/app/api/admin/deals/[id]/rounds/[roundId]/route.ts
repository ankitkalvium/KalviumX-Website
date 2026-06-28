import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminEmail } from "@/auth";
import { removeDealStudentRound, updateDealStudentRound } from "@/lib/db-deals";

const schema = z.object({
  status: z.enum(["shared", "interviewing", "selected", "rejected"]).optional(),
  feedback: z.string().max(3000).optional(),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string; roundId: string }> }) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { roundId } = await context.params;
  const round = await updateDealStudentRound(roundId, parsed.data);
  if (!round) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true, round });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string; roundId: string }> }) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { roundId } = await context.params;
  const deleted = await removeDealStudentRound(roundId);
  if (!deleted) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
