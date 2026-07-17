import { NextResponse } from "next/server";
import { z } from "zod";
import { getDealByToken, submitDealForm } from "@/lib/repo/deals";
import { isRateLimited } from "@/lib/lead-validation";

// Public route — the token itself is the access control (a long random
// id, sent by an admin directly to one company contact), same trust model
// as any other magic-link form. Rate limited to slow down token-guessing.
export async function GET(request: Request, context: { params: Promise<{ token: string }> }) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip, "hiring-form-get", 30)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }
  const { token } = await context.params;
  const deal = await getDealByToken(token);
  if (!deal) return NextResponse.json({ error: "This form link is invalid or has expired." }, { status: 404 });
  return NextResponse.json({ deal });
}

const roundSchema = z.object({ type: z.string().trim().min(1).max(120), notes: z.string().max(500).optional() });

const schema = z.object({
  companyName: z.string().trim().max(200).optional(),
  contactName: z.string().trim().max(160).optional(),
  roleTitle: z.string().trim().max(300).optional(),
  jdUrl: z.string().trim().max(1000).optional(),
  roundsCount: z.number().int().min(0).max(20).optional(),
  rounds: z.array(roundSchema).max(20).optional(),
  expectations: z.string().max(3000).optional(),
  dealbreakers: z.string().max(3000).optional(),
  headcount: z.string().max(100).optional(),
  compensationType: z.string().max(50).optional(),
  compensationRange: z.string().max(200).optional(),
  notes: z.string().max(3000).optional(),
});

export async function POST(request: Request, context: { params: Promise<{ token: string }> }) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip, "hiring-form-post", 10)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }
  const { token } = await context.params;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid form data." }, { status: 400 });

  const { companyName, contactName, roleTitle, ...formData } = parsed.data;
  const deal = await submitDealForm(token, formData, { companyName, contactName, roleTitle });
  if (!deal) return NextResponse.json({ error: "This form link is invalid or has expired." }, { status: 404 });
  return NextResponse.json({ ok: true, deal });
}
