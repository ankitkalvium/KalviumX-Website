import { NextResponse } from "next/server";
import { getAdminEmail } from "@/auth";
import { appendRow, deleteRow, readAllRows } from "@/lib/repo/_sheets";
import { ensureTab } from "@/lib/repo/_sheets";

const TS = () => `TEST_${Date.now()}`;

const TABS: { name: string; headers: string[]; makeRow: (id: string) => string[] }[] = [
  {
    name: "Leads",
    headers: ["id", "first_name", "last_name", "email", "company", "role", "brief", "source", "status", "zoho_id", "created_at"],
    makeRow: (id) => [id, "Test", "User", "test@kalvium.com", "TestCo", "Engineer", "brief", "form", "new", "", new Date().toISOString()],
  },
  {
    name: "Meetings",
    headers: ["id", "company_name", "contact_name", "contact_email", "role_title", "start_time", "status", "inbound_id", "created_at", "updated_at"],
    makeRow: (id) => [id, "TestCo", "Test User", "test@kalvium.com", "Engineer", new Date().toISOString(), "upcoming", "", new Date().toISOString(), new Date().toISOString()],
  },
  {
    name: "AdminUsers",
    headers: ["email", "name", "first_seen", "last_login", "login_count"],
    makeRow: (id) => [id + "@kalvium.com", "Test Admin", new Date().toISOString(), new Date().toISOString(), "1"],
  },
  {
    name: "Students",
    headers: ["id", "name", "email", "phone", "year", "role_interests", "skills", "status", "resume_url", "squad_number", "campus_name", "location", "placements_status", "eligibility_status", "work_integration_status", "availability_for_work", "source", "custom_fields", "created_at", "updated_at"],
    makeRow: (id) => [id, "Test Student", "student@kalvium.com", "", "Sem 5", "[]", "[]", "eligible", "", "", "Campus", "Bangalore", "", "", "", "", "manual", "{}", new Date().toISOString(), new Date().toISOString()],
  },
  {
    name: "Deals",
    headers: ["id", "company_name", "contact_name", "contact_email", "role_title", "stage", "inbound_id", "meeting_id", "form_token", "form_data", "custom_fields", "created_at", "updated_at"],
    makeRow: (id) => [id, "TestCo", "Test Contact", "contact@testco.com", "Engineer", "form_sent", "", "", id + "token", "{}", "{}", new Date().toISOString(), new Date().toISOString()],
  },
  {
    name: "DealStudentRounds",
    headers: ["id", "deal_id", "student_id", "round_index", "status", "feedback", "created_at", "updated_at"],
    makeRow: (id) => [id, "deal-" + id, "student-" + id, "0", "shared", "", new Date().toISOString(), new Date().toISOString()],
  },
  {
    name: "Opportunities",
    headers: ["id", "status", "company_name", "role_title", "contact_name", "email", "alignment", "journey_status", "current_step", "intent_level", "data", "transcript", "advice", "booking", "confirmed_at", "rejection_reason", "reviewed_by", "reviewed_at", "ip", "created_at", "updated_at"],
    makeRow: (id) => [id, "pending", "TestCo", "Engineer", "Test User", "test@kalvium.com", "Yellow", "started", "0", "started", "{}", "[]", "[]", "", "", "", "", "", "1.2.3.4", new Date().toISOString(), new Date().toISOString()],
  },
];

export async function POST(request: Request) {
  // Accept either an admin session or the SHEETS_TEST_SECRET bearer token
  // so this can be called via curl without a browser session.
  const bearer = request.headers.get("authorization")?.replace("Bearer ", "");
  const testSecret = process.env.SHEETS_TEST_SECRET;
  const validBearer = testSecret && bearer === testSecret;

  const adminEmail = validBearer ? "cron-test" : await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const results: { tab: string; ok: boolean; write?: boolean; read?: boolean; delete?: boolean; error?: string; ms?: number }[] = [];

  for (const { name, headers, makeRow } of TABS) {
    const id = TS();
    const start = Date.now();
    try {
      // Ensure tab exists
      await ensureTab(name, headers);

      // Write test row
      const row = makeRow(id);
      await appendRow(name, row);

      // Read back and verify
      const rows = await readAllRows(name);
      // Search by the actual value written to col 0 (not bare id — some rows prefix/suffix it)
      const foundIdx = rows.findIndex((r) => r[0] === row[0]);
      if (foundIdx === -1) {
        const debug = `looking for "${row[0]}", got ${rows.length} rows, col0 values: ${rows.slice(-3).map(r => r[0]).join(" | ")}`;
        throw new Error(`row not found after write — ${debug}`);
      }
      const rowNum = foundIdx + 1;

      // Delete it
      await deleteRow(name, rowNum);

      results.push({ tab: name, ok: true, write: true, read: true, delete: true, ms: Date.now() - start });
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : String(err);
      console.error(`test-sheets: "${name}" failed`, err);
      results.push({ tab: name, ok: false, error, ms: Date.now() - start });
    }
  }

  const allOk = results.every((r) => r.ok);
  return NextResponse.json({ ok: allOk, results, testedBy: adminEmail }, { status: allOk ? 200 : 500 });
}
