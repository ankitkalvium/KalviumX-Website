import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { validateLead, isRateLimited } from "@/lib/lead-validation";
import { upsertZohoLead } from "@/lib/zoho";
import { getPostHogClient } from "@/lib/posthog-server";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON." }, { status: 400 });
  }

  const result = validateLead(body);

  if (!result.ok) {
    // Silent drop for bot signals — return success so bots get no signal.
    if (result.silent) {
      const posthog = getPostHogClient();
      posthog.capture({ distinctId: ip, event: "lead_api_bot_dropped", properties: { ip } });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: result.error }, { status: 422 });
  }

  const { lead } = result;
  const record = { ...lead, ip, receivedAt: new Date().toISOString() };

  // Primary destination: Zoho CRM (upsert — deduplicates by email, merges tags).
  const zoho = await upsertZohoLead({
    ...lead,
    tags: ["Inbound", "Form-Filled"],
    status: "Not Contacted",
  });
  if (!zoho.ok) {
    console.error("Zoho lead upsert failed", zoho.error);
  }

  // Optional secondary webhook (Slack/Brevo/etc.) when configured.
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...record, type: "lead", zohoId: zoho.ok ? zoho.id : null }),
      });
      if (!response.ok) {
        console.error(`Lead webhook failed with status ${response.status}`);
      }
    } catch (error: unknown) {
      console.error("Lead webhook error", error);
    }
  }

  // Local fallback log so no lead is ever lost in development.
  // Skipped on Vercel — the deployment filesystem is read-only outside /tmp.
  if (!process.env.VERCEL) {
    try {
      const dir = path.join(process.cwd(), ".leads");
      await mkdir(dir, { recursive: true });
      await appendFile(
        path.join(dir, "leads.jsonl"),
        `${JSON.stringify({ ...record, zohoId: zoho.ok ? zoho.id : null })}\n`,
      );
    } catch (error: unknown) {
      console.error("Lead file log error", error);
    }
  }

  // Capture server-side lead event for analytics correlation.
  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: lead.email,
    event: "lead_api_received",
    properties: {
      role: lead.role,
      source: lead.source,
      has_brief: (lead.brief ?? "").trim().length > 0,
      zoho_ok: zoho.ok,
      zoho_action: zoho.ok ? zoho.action : null,
    },
  });

  // If Zoho failed but we captured the lead locally/via webhook, still succeed
  // for the user — we don't want to lose them over a transient CRM error.
  return NextResponse.json({ success: true });
}
