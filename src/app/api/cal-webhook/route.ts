import { NextResponse } from "next/server";
import { upsertZohoLead, verifyCalSignature } from "@/lib/zoho";
import { getPostHogClient } from "@/lib/posthog-server";
import { fetchWithRetry } from "@/lib/fetch-retry";

interface CalAttendee {
  email: string;
  name: string;
  timeZone?: string;
}

interface CalResponseField {
  label?: string;
  value?: string | string[] | { value?: string };
  isHidden?: boolean;
}

interface CalWebhookBody {
  triggerEvent?: string;
  payload?: {
    uid?: string;
    // Cal.com includes this on the BOOKING_RESCHEDULED payload, pointing at
    // the uid of the booking being replaced.
    fromReschedule?: string;
    startTime?: string;
    attendees?: CalAttendee[];
    responses?: Record<string, CalResponseField>;
  };
}

// Each handled trigger maps to a Zoho tag, a Zoho status (status never
// downgrades — see mergeStatus — so anything other than BOOKING_CREATED
// passing "Not Contacted"/"Contacted" is safe and only upgrades a lead that
// somehow skipped the create step), and a sheet eventType/status label for
// the Apps Script to apply to the existing "Calls Booked" row.
const EVENT_CONFIG: Record<
  string,
  { zohoTag: string; zohoStatus: string; sheetEventType: string; sheetStatus: string }
> = {
  BOOKING_CREATED: {
    zohoTag: "Booked",
    zohoStatus: "Appointment Scheduled",
    sheetEventType: "created",
    sheetStatus: "Scheduled",
  },
  BOOKING_CANCELLED: {
    zohoTag: "Booking-Cancelled",
    zohoStatus: "Not Contacted",
    sheetEventType: "cancelled",
    sheetStatus: "Cancelled",
  },
  BOOKING_RESCHEDULED: {
    zohoTag: "Booking-Rescheduled",
    zohoStatus: "Not Contacted",
    sheetEventType: "rescheduled",
    sheetStatus: "Rescheduled",
  },
  BOOKING_NO_SHOW_UPDATED: {
    zohoTag: "No-Show",
    zohoStatus: "Not Contacted",
    sheetEventType: "no_show",
    sheetStatus: "No-Show",
  },
  MEETING_STARTED: {
    zohoTag: "Meeting-Started",
    zohoStatus: "Not Contacted",
    sheetEventType: "meeting_started",
    sheetStatus: "Meeting Started",
  },
  MEETING_ENDED: {
    zohoTag: "Meeting-Completed",
    zohoStatus: "Contacted",
    sheetEventType: "meeting_ended",
    sheetStatus: "Completed",
  },
  AFTER_HOSTS_DIDNT_JOIN: {
    zohoTag: "Host-No-Show",
    zohoStatus: "Not Contacted",
    sheetEventType: "host_no_show",
    sheetStatus: "Host No-Show",
  },
  AFTER_GUESTS_DIDNT_JOIN: {
    zohoTag: "Guest-No-Show",
    zohoStatus: "Not Contacted",
    sheetEventType: "guest_no_show",
    sheetStatus: "Guest No-Show",
  },
};

function deriveNames(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/);
  const firstName = parts[0] ?? "Lead";
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : firstName;
  return { firstName, lastName };
}

// Cal.com's "Exploring Candidates For" custom question — a multi-select,
// so its value comes back as a string array (e.g. ["Full Stack"]).
function extractRoles(field: CalResponseField | undefined): string {
  if (!field?.value || !Array.isArray(field.value)) return "";
  return field.value.join(", ");
}

function extractText(field: CalResponseField | undefined): string {
  if (typeof field?.value === "string") return field.value.trim();
  return "";
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

  const triggerEvent = body.triggerEvent ?? "";
  const config = EVENT_CONFIG[triggerEvent];
  if (!config) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  // Extract the attendee (first non-empty entry — Cal puts the booker first).
  const attendee = body.payload?.attendees?.[0];
  if (!attendee?.email) {
    return NextResponse.json({ error: "No attendee email" }, { status: 400 });
  }

  const responses = body.payload?.responses;
  const { firstName, lastName } = deriveNames(attendee.name ?? attendee.email);
  const email = attendee.email.trim().toLowerCase();
  const companyName = extractText(responses?.["Company-Name"]);
  const company = companyName || email.split("@")[1] || "unknown";
  const roles = extractRoles(responses?.["Exploring-Candidates-For"]);
  const bookingUid = body.payload?.uid ?? "unknown";
  const startTime = body.payload?.startTime ?? "";
  // For a reschedule, the row to update in the sheet is the *original*
  // booking (fromReschedule), not the new uid Cal.com generates. Every
  // other lifecycle event references the same uid as the original booking.
  const targetBookingId = body.payload?.fromReschedule ?? bookingUid;

  // Sheet "Notes" column always gets full scheduling context regardless of
  // whether a role was given — this is operational detail, not the lead's
  // role description.
  const sheetNotes = [
    roles ? `Exploring: ${roles}` : "",
    startTime ? `Scheduled: ${startTime}` : "",
    `Booking ID: ${bookingUid}`,
  ]
    .filter(Boolean)
    .join("\n");

  // Zoho's Description field follows the rule: only update it when this
  // booking actually specifies a role. If no role was given, leave
  // Description alone — whatever the JD form (or an earlier Cal booking
  // with a role) already set stays as-is. upsertZohoLead only overwrites
  // Description when `brief` is truthy, so an empty string here is a no-op.
  const zohoDescription = roles
    ? [`Exploring Candidates For: ${roles}`, `Scheduled: ${startTime}`, `Booking ID: ${bookingUid}`]
        .filter(Boolean)
        .join("\n")
    : "";

  const zoho = await upsertZohoLead({
    firstName,
    lastName,
    email,
    company,
    role: roles || undefined,
    brief: zohoDescription,
    source: "Cal - Let's Talk",
    tags: ["Inbound", config.zohoTag],
    status: config.zohoStatus,
  });

  if (!zoho.ok) {
    console.error("Cal webhook: Zoho upsert failed", zoho.error);
  }

  // Mirror to the "Calls Booked" sheet tab (same Apps Script endpoint as
  // /api/lead, routed by `type`). eventType + bookingId let the Apps Script
  // update the existing row in place for any lifecycle event instead of
  // appending a new one, and skip duplicate inserts on webhook retries.
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const response = await fetchWithRetry(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "booking",
          eventType: config.sheetEventType,
          sheetStatus: config.sheetStatus,
          bookingId: targetBookingId,
          firstName,
          lastName,
          email,
          company,
          startTime,
          brief: sheetNotes,
          source: "Cal - Let's Talk",
          receivedAt: new Date().toISOString(),
          zohoId: zoho.ok ? zoho.id : null,
        }),
      });
      if (!response.ok) {
        console.error(`Cal booking webhook failed with status ${response.status}`);
      }
    } catch (error: unknown) {
      console.error("Cal booking webhook error", error);
    }
  }

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: email,
    event: "cal_booking_crm_upsert",
    properties: {
      trigger_event: triggerEvent,
      zoho_ok: zoho.ok,
      zoho_action: zoho.ok ? zoho.action : null,
      booking_uid: bookingUid,
    },
  });

  return NextResponse.json({ ok: true });
}
