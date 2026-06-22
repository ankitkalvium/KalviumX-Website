import { NextResponse } from "next/server";
import { upsertZohoLead, verifyCalSignature } from "@/lib/zoho";
import { getPostHogClient } from "@/lib/posthog-server";

interface CalAttendee {
  email: string;
  name: string;
  timeZone?: string;
}

interface CalWebhookBody {
  triggerEvent?: string;
  payload?: {
    uid?: string;
    startTime?: string;
    attendees?: CalAttendee[];
    responses?: {
      notes?: { value?: string };
      [key: string]: unknown;
    };
  };
}

function deriveNames(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/);
  const firstName = parts[0] ?? "Lead";
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : firstName;
  return { firstName, lastName };
}

export async function POST(request: Request) {
  const rawBody = await request.text();

  // Verify Cal.com webhook signature if secret is configured.
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (secret) {
    const signature = request.headers.get("x-cal-signature-256") ?? "";
    if (!verifyCalSignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let body: CalWebhookBody;
  try {
    body = JSON.parse(rawBody) as CalWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Only act on booking creation. Acknowledge all other events with 200.
  if (body.triggerEvent !== "BOOKING_CREATED") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  // Extract the attendee (first non-empty entry — Cal puts the booker first).
  const attendee = body.payload?.attendees?.[0];
  if (!attendee?.email) {
    return NextResponse.json({ error: "No attendee email" }, { status: 400 });
  }

  const { firstName, lastName } = deriveNames(attendee.name ?? attendee.email);
  const email = attendee.email.trim().toLowerCase();
  const company = email.split("@")[1] ?? "unknown";
  const notes = body.payload?.responses?.notes?.value ?? "";
  const bookingUid = body.payload?.uid ?? "unknown";
  const startTime = body.payload?.startTime ?? "";

  const brief = [
    notes ? `Booking notes: ${notes}` : "",
    startTime ? `Scheduled: ${startTime}` : "",
    `Booking ID: ${bookingUid}`,
  ]
    .filter(Boolean)
    .join("\n");

  const zoho = await upsertZohoLead({
    firstName,
    lastName,
    email,
    company,
    brief,
    source: "Cal - Let's Talk",
    tags: ["Inbound", "Booked"],
    status: "Appointment Scheduled",
  });

  if (!zoho.ok) {
    console.error("Cal webhook: Zoho upsert failed", zoho.error);
  }

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: email,
    event: "cal_booking_crm_upsert",
    properties: {
      zoho_ok: zoho.ok,
      zoho_action: zoho.ok ? zoho.action : null,
      booking_uid: bookingUid,
    },
  });

  return NextResponse.json({ ok: true });
}
