import { NextResponse } from "next/server";
import { z } from "zod";
import { companyFromEmail } from "@/lib/company-domain";
import { getLatestOpportunityForEmail, getLatestOpportunityForIp, startOpportunity } from "@/lib/db";
import { isRateLimited, validateWorkEmail } from "@/lib/lead-validation";

const startSchema = z.object({
  contactName: z.string().trim().min(2).max(160),
  email: z.string().trim().max(320),
  website: z.string().max(200).optional(),
  loadedAt: z.number().optional(),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const parsed = startSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter your name and a valid work email." }, { status: 400 });
  }
  if (parsed.data.website) return NextResponse.json({ ok: true });
  if (parsed.data.loadedAt && Date.now() - parsed.data.loadedAt < 600) {
    return NextResponse.json({ ok: true });
  }
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }
  const email = parsed.data.email.toLowerCase();
  const emailError = validateWorkEmail(email);
  if (emailError) return NextResponse.json({ error: emailError }, { status: 400 });

  try {
    const existing = await getLatestOpportunityForEmail(email);
    if (
      existing &&
      !["requirement_confirmed", "meeting_booked"].includes(existing.journeyStatus)
    ) {
      return NextResponse.json({ ok: true, opportunity: existing, resumed: true });
    }

    const companyName = companyFromEmail(email);
    const transcript = [
      {
        role: "assistant" as const,
        content: `It looks like you’re with ${companyName}. Is that right?`,
      },
    ];
    const opportunity = await startOpportunity(
      {
        contactName: parsed.data.contactName,
        email,
        companyName,
        companyConfirmed: false,
      },
      transcript,
      ip,
    );
    return NextResponse.json({ ok: true, opportunity, resumed: false });
  } catch (error) {
    console.error("Opportunity start failed", error);
    return NextResponse.json({ error: "We could not save your progress. Please try again." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email")?.trim().toLowerCase() ?? "";
  if (email) {
    const emailError = validateWorkEmail(email);
    if (emailError) return NextResponse.json({ error: emailError }, { status: 400 });
    const opportunity = await getLatestOpportunityForEmail(email);
    return NextResponse.json({ opportunity });
  }

  // No email yet — this is the silent returning-visitor check the widget
  // fires on mount before showing the contact-info gate. Same-IP match only,
  // short window, never overwrites a different visitor's draft.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const opportunity = await getLatestOpportunityForIp(ip);
  return NextResponse.json({ opportunity });
}
