import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import type {
  BookingDetails,
  ChatMessage,
  JourneyStatus,
  OpportunityDraft,
  OpportunityRecord,
} from "@/lib/opportunity-types";

let sqlClient: NeonQueryFunction<false, false> | null = null;
let tableReady: Promise<void> | null = null;

export function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured");
  if (!sqlClient) sqlClient = neon(databaseUrl);
  return sqlClient;
}

let adminUsersTableReady: Promise<void> | null = null;

export async function ensureAdminUsersTable() {
  if (adminUsersTableReady) return adminUsersTableReady;
  adminUsersTableReady = prepareAdminUsersTable().catch((error) => {
    adminUsersTableReady = null;
    throw error;
  });
  return adminUsersTableReady;
}

async function prepareAdminUsersTable() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      email TEXT PRIMARY KEY,
      name TEXT,
      first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_login TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      login_count INTEGER NOT NULL DEFAULT 1
    )
  `;
}

export async function recordAdminLogin(email: string, name?: string | null) {
  await ensureAdminUsersTable();
  const sql = getSql();
  await sql`
    INSERT INTO admin_users (email, name)
    VALUES (${email.toLowerCase()}, ${name ?? null})
    ON CONFLICT (email) DO UPDATE SET
      name = COALESCE(${name ?? null}, admin_users.name),
      last_login = NOW(),
      login_count = admin_users.login_count + 1
  `;
}

export async function ensureOpportunityTable() {
  if (tableReady) return tableReady;
  tableReady = prepareOpportunityTable().catch((error) => {
    tableReady = null;
    throw error;
  });
  return tableReady;
}

async function prepareOpportunityTable() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS opportunity_intakes (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'pending',
      company_name TEXT NOT NULL DEFAULT '',
      role_title TEXT NOT NULL DEFAULT '',
      contact_name TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL,
      alignment TEXT NOT NULL DEFAULT 'Yellow',
      data JSONB NOT NULL DEFAULT '{}'::jsonb,
      transcript JSONB NOT NULL DEFAULT '[]'::jsonb,
      rejection_reason TEXT,
      reviewed_by TEXT,
      reviewed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE opportunity_intakes ADD COLUMN IF NOT EXISTS journey_status TEXT NOT NULL DEFAULT 'started'`;
  await sql`ALTER TABLE opportunity_intakes ADD COLUMN IF NOT EXISTS current_step INTEGER NOT NULL DEFAULT 0`;
  await sql`ALTER TABLE opportunity_intakes ADD COLUMN IF NOT EXISTS intent_level TEXT NOT NULL DEFAULT 'started'`;
  await sql`ALTER TABLE opportunity_intakes ADD COLUMN IF NOT EXISTS advice JSONB NOT NULL DEFAULT '[]'::jsonb`;
  await sql`ALTER TABLE opportunity_intakes ADD COLUMN IF NOT EXISTS booking JSONB`;
  await sql`ALTER TABLE opportunity_intakes ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ`;
  await sql`ALTER TABLE opportunity_intakes ADD COLUMN IF NOT EXISTS ip TEXT`;
  await sql`ALTER TABLE opportunity_intakes ALTER COLUMN company_name SET DEFAULT ''`;
  await sql`ALTER TABLE opportunity_intakes ALTER COLUMN role_title SET DEFAULT ''`;
  await sql`ALTER TABLE opportunity_intakes ALTER COLUMN contact_name SET DEFAULT ''`;
  await sql`
    CREATE INDEX IF NOT EXISTS opportunity_intakes_status_created_idx
    ON opportunity_intakes (status, created_at DESC)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS opportunity_intakes_email_updated_idx
    ON opportunity_intakes (email, updated_at DESC)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS opportunity_intakes_ip_updated_idx
    ON opportunity_intakes (ip, updated_at DESC)
  `;
}

function mapRecord(row: Record<string, unknown>): OpportunityRecord {
  return {
    id: String(row.id),
    status: row.status as OpportunityRecord["status"],
    journeyStatus: row.journey_status as JourneyStatus,
    currentStep: Number(row.current_step ?? 0),
    intentLevel: row.intent_level as OpportunityRecord["intentLevel"],
    companyName: String(row.company_name ?? ""),
    roleTitle: String(row.role_title ?? ""),
    contactName: String(row.contact_name ?? ""),
    email: String(row.email),
    alignment: row.alignment as OpportunityRecord["alignment"],
    data: (row.data ?? {}) as OpportunityDraft,
    transcript: (row.transcript ?? []) as ChatMessage[],
    advice: (row.advice ?? []) as string[],
    booking: (row.booking as BookingDetails | null) ?? null,
    confirmedAt: row.confirmed_at ? new Date(String(row.confirmed_at)).toISOString() : null,
    rejectionReason: row.rejection_reason ? String(row.rejection_reason) : null,
    reviewedBy: row.reviewed_by ? String(row.reviewed_by) : null,
    reviewedAt: row.reviewed_at ? new Date(String(row.reviewed_at)).toISOString() : null,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

export async function startOpportunity(data: OpportunityDraft, transcript: ChatMessage[], ip?: string) {
  await ensureOpportunityTable();
  const sql = getSql();
  const id = crypto.randomUUID();
  const rows = await sql`
    INSERT INTO opportunity_intakes (
      id, company_name, role_title, contact_name, email, data, transcript,
      journey_status, current_step, intent_level, ip
    ) VALUES (
      ${id},
      ${data.companyName ?? ""},
      '',
      ${data.contactName ?? ""},
      ${data.email ?? ""},
      ${JSON.stringify(data)},
      ${JSON.stringify(transcript)},
      'started',
      0,
      'started',
      ${ip ?? null}
    )
    RETURNING *
  `;
  return mapRecord(rows[0] as Record<string, unknown>);
}

export async function updateOpportunityJourney(input: {
  id: string;
  data: OpportunityDraft;
  transcript: ChatMessage[];
  journeyStatus: JourneyStatus;
  currentStep: number;
  advice?: string[];
  confirmed?: boolean;
  booking?: BookingDetails;
  ip?: string;
}) {
  await ensureOpportunityTable();
  const sql = getSql();
  const intentLevel =
    input.journeyStatus === "meeting_booked"
      ? "booked"
      : input.journeyStatus === "requirement_confirmed"
        ? "confirmed"
        : input.currentStep > 0
          ? "engaged"
          : "started";
  const roles = input.data.roles?.join(", ") || input.data.roleTitle || "";
  const rows = await sql`
    UPDATE opportunity_intakes
    SET
      company_name = ${input.data.companyName ?? ""},
      role_title = ${roles},
      contact_name = ${input.data.contactName ?? ""},
      email = ${input.data.email ?? ""},
      alignment = COALESCE(${input.data.alignment ?? null}, alignment, 'Yellow'),
      data = ${JSON.stringify(input.data)},
      transcript = ${JSON.stringify(input.transcript)},
      journey_status = ${input.journeyStatus},
      current_step = ${input.currentStep},
      intent_level = ${intentLevel},
      advice = ${JSON.stringify(input.advice ?? [])},
      booking = ${input.booking ? JSON.stringify(input.booking) : null},
      confirmed_at = CASE WHEN ${input.confirmed ?? false} THEN COALESCE(confirmed_at, NOW()) ELSE confirmed_at END,
      ip = COALESCE(${input.ip ?? null}, ip),
      updated_at = NOW()
    WHERE id = ${input.id}
    RETURNING *
  `;
  return rows[0] ? mapRecord(rows[0] as Record<string, unknown>) : null;
}

export async function getOpportunity(id: string) {
  await ensureOpportunityTable();
  const rows = await getSql()`SELECT * FROM opportunity_intakes WHERE id = ${id} LIMIT 1`;
  return rows[0] ? mapRecord(rows[0] as Record<string, unknown>) : null;
}

export async function getLatestOpportunityForEmail(email: string) {
  await ensureOpportunityTable();
  const rows = await getSql()`
    SELECT * FROM opportunity_intakes
    WHERE LOWER(email) = ${email.toLowerCase()}
    ORDER BY updated_at DESC
    LIMIT 1
  `;
  return rows[0] ? mapRecord(rows[0] as Record<string, unknown>) : null;
}

// Best-effort returning-visitor detection: lets a visitor who already started
// a conversation skip the contact-info gate again on a new browser/device,
// as long as they're on the same IP and the draft is recent. Shared/NAT IPs
// can occasionally collide, so this is intentionally scoped to a short
// window and never used for anything more sensitive than resuming a draft.
const IP_RESUME_WINDOW_DAYS = 14;

export async function getLatestOpportunityForIp(ip: string) {
  if (!ip || ip === "local" || ip === "unknown") return null;
  await ensureOpportunityTable();
  const rows = await getSql()`
    SELECT * FROM opportunity_intakes
    WHERE ip = ${ip}
      AND updated_at > NOW() - INTERVAL '1 day' * ${IP_RESUME_WINDOW_DAYS}
    ORDER BY updated_at DESC
    LIMIT 1
  `;
  return rows[0] ? mapRecord(rows[0] as Record<string, unknown>) : null;
}

export async function listOpportunities() {
  await ensureOpportunityTable();
  const rows = await getSql()`SELECT * FROM opportunity_intakes ORDER BY created_at DESC LIMIT 200`;
  return rows.map((row) => mapRecord(row as Record<string, unknown>));
}

export async function updateOpportunityStatus(
  id: string,
  status: "reviewed" | "rejected",
  reviewer: string,
  rejectionReason?: string,
) {
  await ensureOpportunityTable();
  const rows = await getSql()`
    UPDATE opportunity_intakes
    SET
      status = ${status},
      reviewed_by = ${reviewer},
      reviewed_at = NOW(),
      rejection_reason = ${rejectionReason ?? null},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] ? mapRecord(rows[0] as Record<string, unknown>) : null;
}

// Bulk variants for the multi-select toolbar in the admin dashboard. Looped
// rather than a single `WHERE id = ANY(...)` query — list sizes here are a
// handful of admin-selected rows at a time, not worth the array-binding
// fragility of the lightweight Neon HTTP driver.
export async function updateOpportunityStatusBulk(
  ids: string[],
  status: "reviewed" | "rejected",
  reviewer: string,
  rejectionReason?: string,
) {
  const updated: OpportunityRecord[] = [];
  for (const id of ids) {
    const result = await updateOpportunityStatus(id, status, reviewer, rejectionReason);
    if (result) updated.push(result);
  }
  return updated;
}

export async function deleteOpportunity(id: string) {
  await ensureOpportunityTable();
  const rows = await getSql()`DELETE FROM opportunity_intakes WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function deleteOpportunitiesBulk(ids: string[]) {
  let count = 0;
  for (const id of ids) {
    if (await deleteOpportunity(id)) count += 1;
  }
  return count;
}
