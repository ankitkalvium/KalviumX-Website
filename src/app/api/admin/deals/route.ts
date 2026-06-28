import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminEmail } from "@/auth";
import { createDeal } from "@/lib/db-deals";

const schema = z.object({
  companyName: z.string().trim().min(1).max(200),
  contactName: z.string().trim().max(160).optional(),
  contactEmail: z.string().trim().email(),
  roleTitle: z.string().trim().max(300).optional(),
  inboundId: z.string().max(200).nullable().optional(),
  meetingId: z.string().max(200).nullable().optional(),
  expectations: z.string().max(3000).optional(),
  headcount: z.string().max(100).optional(),
  compensationType: z.string().max(50).optional(),
  compensationRange: z.string().max(200).optional(),
});

// Triggered by the "Share form" action on an Inbound or Meeting — creates a
// new Deal at the first pipeline stage and a unique hiring-form link the
// admin copies and sends to the company contact themselves (no auto-email).
export async function POST(request: Request) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const deal = await createDeal({
    companyName: parsed.data.companyName,
    contactName: parsed.data.contactName ?? "",
    contactEmail: parsed.data.contactEmail.toLowerCase(),
    roleTitle: parsed.data.roleTitle ?? "",
    inboundId: parsed.data.inboundId ?? null,
    meetingId: parsed.data.meetingId ?? null,
    formData: {
      expectations: parsed.data.expectations,
      headcount: parsed.data.headcount,
      compensationType: parsed.data.compensationType,
      compensationRange: parsed.data.compensationRange,
    },
  });
  return NextResponse.json({ ok: true, deal });
}
