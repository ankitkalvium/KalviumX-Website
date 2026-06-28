import { getSql } from "@/lib/db";

export type MeetingStatus = "upcoming" | "rescheduled" | "cancelled" | "no_show" | "completed";

export interface MeetingRecord {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  roleTitle: string;
  startTime: string | null;
  status: MeetingStatus;
  inboundId: string | null;
  createdAt: string;
  updatedAt: string;
}

let meetingsTableReady: Promise<void> | null = null;

export async function ensureMeetingsTable() {
  if (meetingsTableReady) return meetingsTableReady;
  meetingsTableReady = prepareMeetingsTable().catch((error) => {
    meetingsTableReady = null;
    throw error;
  });
  return meetingsTableReady;
}

async function prepareMeetingsTable() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS meetings (
      id TEXT PRIMARY KEY,
      company_name TEXT NOT NULL DEFAULT '',
      contact_name TEXT NOT NULL DEFAULT '',
      contact_email TEXT NOT NULL,
      role_title TEXT NOT NULL DEFAULT '',
      start_time TIMESTAMPTZ,
      status TEXT NOT NULL DEFAULT 'upcoming',
      inbound_id TEXT,
      raw JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS meetings_status_start_idx
    ON meetings (status, start_time DESC)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS meetings_email_idx
    ON meetings (contact_email)
  `;
}

function mapMeeting(row: Record<string, unknown>): MeetingRecord {
  return {
    id: String(row.id),
    companyName: String(row.company_name ?? ""),
    contactName: String(row.contact_name ?? ""),
    contactEmail: String(row.contact_email ?? ""),
    roleTitle: String(row.role_title ?? ""),
    startTime: row.start_time ? new Date(String(row.start_time)).toISOString() : null,
    status: row.status as MeetingStatus,
    inboundId: row.inbound_id ? String(row.inbound_id) : null,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

// Called from the Cal.com webhook for every site-wide booking lifecycle
// event (created/rescheduled/cancelled/no-show/completed), keyed by the
// stable booking id so retries and lifecycle updates upsert the same row.
export async function upsertMeeting(input: {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  roleTitle: string;
  startTime: string | null;
  status: MeetingStatus;
  inboundId: string | null;
  raw: Record<string, unknown>;
}) {
  await ensureMeetingsTable();
  const sql = getSql();
  const rows = await sql`
    INSERT INTO meetings (id, company_name, contact_name, contact_email, role_title, start_time, status, inbound_id, raw)
    VALUES (
      ${input.id}, ${input.companyName}, ${input.contactName}, ${input.contactEmail}, ${input.roleTitle},
      ${input.startTime}, ${input.status}, ${input.inboundId}, ${JSON.stringify(input.raw)}
    )
    ON CONFLICT (id) DO UPDATE SET
      company_name = COALESCE(NULLIF(EXCLUDED.company_name, ''), meetings.company_name),
      contact_name = COALESCE(NULLIF(EXCLUDED.contact_name, ''), meetings.contact_name),
      role_title = COALESCE(NULLIF(EXCLUDED.role_title, ''), meetings.role_title),
      start_time = COALESCE(EXCLUDED.start_time, meetings.start_time),
      status = EXCLUDED.status,
      inbound_id = COALESCE(EXCLUDED.inbound_id, meetings.inbound_id),
      raw = EXCLUDED.raw,
      updated_at = NOW()
    RETURNING *
  `;
  return mapMeeting(rows[0] as Record<string, unknown>);
}

export async function listMeetings() {
  await ensureMeetingsTable();
  const rows = await getSql()`SELECT * FROM meetings ORDER BY start_time DESC NULLS LAST LIMIT 500`;
  return rows.map((row) => mapMeeting(row as Record<string, unknown>));
}
