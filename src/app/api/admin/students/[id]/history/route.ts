import { NextResponse } from "next/server";
import { getAdminEmail } from "@/auth";
import { getDeal, listDealStudentRoundsForStudent } from "@/lib/db-deals";

// Powers the "Student history" panel — every deal/round this student has
// ever been put forward for, across every company, with feedback attached.
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const rounds = await listDealStudentRoundsForStudent(id);
  const history = await Promise.all(
    rounds.map(async (round) => ({
      round,
      deal: await getDeal(round.dealId),
    })),
  );
  return NextResponse.json({ history });
}
