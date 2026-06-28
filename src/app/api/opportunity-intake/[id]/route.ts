import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpportunity, updateOpportunityJourney } from "@/lib/db";
import { isRateLimited } from "@/lib/lead-validation";
import { JOURNEY_STATUSES } from "@/lib/opportunity-types";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(5000),
});

const draftSchema = z.object({
  companyName: z.string().max(200).optional(),
  companyConfirmed: z.boolean().optional(),
  contactName: z.string().max(160).optional(),
  email: z.string().max(320).optional(),
  headcount: z.string().max(100).optional(),
  roles: z.array(z.string().max(100)).max(12).optional(),
  roleTitle: z.string().max(500).optional(),
  skills: z.string().max(3000).optional(),
  expectations: z.string().max(3000).optional(),
  dealbreakers: z.string().max(3000).optional(),
  interviewGaps: z.string().max(3000).optional(),
  readinessPreference: z.string().max(1000).optional(),
  readinessCustom: z.string().max(3000).optional(),
  compensationType: z.enum(["stipend", "ctc", "either", "deciding"]).optional(),
  compensationRange: z.string().max(200).optional(),
  stipend: z.string().max(200).optional(),
  jdText: z.string().max(15000).optional(),
  alignment: z.enum(["Green", "Yellow", "Red"]).optional(),
  alignmentNotes: z.string().max(3000).optional(),
});

const updateSchema = z.object({
  draft: draftSchema,
  transcript: z.array(messageSchema).max(100),
  journeyStatus: z.enum(JOURNEY_STATUSES),
  currentStep: z.number().int().min(0).max(8),
  advice: z.array(z.string().max(500)).max(5).optional(),
  confirmed: z.boolean().optional(),
  booking: z.object({
    id: z.string().max(500).optional(),
    title: z.string().max(500).optional(),
    startTime: z.string().max(200).optional(),
    endTime: z.string().max(200).optional(),
    timeZone: z.string().max(200).optional(),
    hostName: z.string().max(300).optional(),
    meetingUrl: z.string().max(1000).optional(),
    raw: z.record(z.string(), z.unknown()).optional(),
  }).optional(),
});

function compensationError(
  type: "stipend" | "ctc" | "either" | "deciding" | undefined,
  range: string | undefined,
) {
  if (!type || !range) return "Choose a compensation structure and range.";
  if (type === "either" || type === "deciding") return null;
  const normalized = range.toLowerCase().replaceAll(",", "");
  const number = Number(normalized.match(/\d+(?:\.\d+)?/)?.[0]);
  if (!Number.isFinite(number)) return "Enter a clear numeric compensation range.";

  if (type === "stipend") {
    const monthly =
      normalized.includes("lakh") || normalized.includes("₹1l")
        ? number * 100000
        : normalized.includes("k")
          ? number * 1000
          : number;
    if (monthly < 10000 || monthly > 150000) {
      return "Monthly stipend must be between ₹10,000 and ₹1,50,000.";
    }
  }

  if (type === "ctc") {
    const lpa = number > 1000 ? number / 100000 : number;
    if (lpa < 6) return "Full-time CTC must be at least ₹6 LPA.";
  }
  return null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const opportunity = await getOpportunity(id);
  if (!opportunity) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  return NextResponse.json({ opportunity });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const ipForLimit = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ipForLimit, "opportunity-patch", 30)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid conversation update." }, { status: 400 });
  }
  const { id } = await context.params;
  const existing = await getOpportunity(id);
  if (!existing) return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  if (existing.email.toLowerCase() !== parsed.data.draft.email?.toLowerCase()) {
    return NextResponse.json({ error: "Conversation email does not match." }, { status: 403 });
  }
  if (
    ["summary_generated", "requirement_confirmed", "meeting_booked"].includes(
      parsed.data.journeyStatus,
    )
  ) {
    const error = compensationError(
      parsed.data.draft.compensationType,
      parsed.data.draft.compensationRange,
    );
    if (error) return NextResponse.json({ error }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined;
  const opportunity = await updateOpportunityJourney({
    id,
    data: parsed.data.draft,
    transcript: parsed.data.transcript,
    journeyStatus: parsed.data.journeyStatus,
    currentStep: parsed.data.currentStep,
    advice: parsed.data.advice,
    confirmed: parsed.data.confirmed,
    booking: parsed.data.booking,
    ip,
  });
  return NextResponse.json({ ok: true, opportunity });
}
