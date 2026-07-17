import { NextResponse } from "next/server";
import { getAdminEmail } from "@/auth";
import { ensureTab } from "@/lib/repo/_sheets";

const TABS: { name: string; headers: string[] }[] = [
  {
    name: "Leads",
    headers: ["id", "first_name", "last_name", "email", "company", "role", "brief", "source", "status", "zoho_id", "created_at"],
  },
  {
    name: "Meetings",
    headers: ["id", "company_name", "contact_name", "contact_email", "role_title", "start_time", "status", "inbound_id", "created_at", "updated_at"],
  },
  {
    name: "AdminUsers",
    headers: ["email", "name", "first_seen", "last_login", "login_count"],
  },
  {
    name: "Students",
    headers: [
      "id", "name", "email", "phone", "year", "role_interests", "skills",
      "status", "resume_url", "squad_number", "campus_name", "location",
      "placements_status", "eligibility_status", "work_integration_status",
      "availability_for_work", "source", "custom_fields", "created_at", "updated_at",
    ],
  },
  {
    name: "Deals",
    headers: [
      "id", "company_name", "contact_name", "contact_email", "role_title",
      "stage", "inbound_id", "meeting_id", "form_token", "form_data", "custom_fields",
      "created_at", "updated_at",
    ],
  },
  {
    name: "DealStudentRounds",
    headers: ["id", "deal_id", "student_id", "round_index", "status", "feedback", "created_at", "updated_at"],
  },
  {
    name: "Opportunities",
    headers: [
      "id", "status", "company_name", "role_title", "contact_name", "email",
      "alignment", "journey_status", "current_step", "intent_level",
      "data", "transcript", "advice", "booking", "confirmed_at",
      "rejection_reason", "reviewed_by", "reviewed_at", "ip", "created_at", "updated_at",
    ],
  },
];

export async function POST() {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const results: { tab: string; ok: boolean; error?: string }[] = [];

  for (const { name, headers } of TABS) {
    try {
      await ensureTab(name, headers);
      results.push({ tab: name, ok: true });
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : String(err);
      console.error(`setup-sheets: failed to ensure tab "${name}"`, err);
      results.push({ tab: name, ok: false, error });
    }
  }

  const allOk = results.every((r) => r.ok);
  return NextResponse.json({ ok: allOk, results }, { status: allOk ? 200 : 500 });
}
