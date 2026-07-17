import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminEmail } from "@/auth";
import { associateStudentToDeal, listDealStudentRounds } from "@/lib/repo/deals";

const schema = z.object({
  studentId: z.string().min(1).max(200),
  roundIndex: z.number().int().min(0).max(50),
});

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const rounds = await listDealStudentRounds(id);
  return NextResponse.json({ rounds });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { id } = await context.params;
  const round = await associateStudentToDeal({
    dealId: id,
    studentId: parsed.data.studentId,
    roundIndex: parsed.data.roundIndex,
  });
  return NextResponse.json({ ok: true, round });
}
