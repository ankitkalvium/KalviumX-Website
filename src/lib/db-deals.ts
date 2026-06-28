import { getSql } from "@/lib/db";

export const DEAL_STAGES = [
  "form_sent",
  "form_completed",
  "profiles_shared",
  "interviewing",
  "offer",
  "closed_won",
  "closed_lost",
] as const;

export type DealStage = (typeof DEAL_STAGES)[number];

export interface DealRound {
  type: string;
  notes?: string;
}

export interface DealFormData {
  jdUrl?: string;
  roundsCount?: number;
  rounds?: DealRound[];
  expectations?: string;
  dealbreakers?: string;
  headcount?: string;
  compensationType?: string;
  compensationRange?: string;
  notes?: string;
}

export interface DealRecord {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  roleTitle: string;
  stage: DealStage;
  inboundId: string | null;
  meetingId: string | null;
  formToken: string;
  formData: DealFormData;
  customFields: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

let dealsTableReady: Promise<void> | null = null;

export async function ensureDealsTable() {
  if (dealsTableReady) return dealsTableReady;
  dealsTableReady = prepareDealsTable().catch((error) => {
    dealsTableReady = null;
    throw error;
  });
  return dealsTableReady;
}

async function prepareDealsTable() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS deals (
      id TEXT PRIMARY KEY,
      company_name TEXT NOT NULL DEFAULT '',
      contact_name TEXT NOT NULL DEFAULT '',
      contact_email TEXT NOT NULL,
      role_title TEXT NOT NULL DEFAULT '',
      stage TEXT NOT NULL DEFAULT 'form_sent',
      inbound_id TEXT,
      meeting_id TEXT,
      form_token TEXT UNIQUE NOT NULL,
      form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
      custom_fields JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS deals_stage_idx ON deals (stage, updated_at DESC)`;
  await sql`
    CREATE TABLE IF NOT EXISTS deal_student_rounds (
      id TEXT PRIMARY KEY,
      deal_id TEXT NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
      student_id TEXT NOT NULL,
      round_index INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'shared',
      feedback TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS deal_student_rounds_deal_idx ON deal_student_rounds (deal_id)`;
  await sql`CREATE INDEX IF NOT EXISTS deal_student_rounds_student_idx ON deal_student_rounds (student_id)`;
}

function mapDeal(row: Record<string, unknown>): DealRecord {
  return {
    id: String(row.id),
    companyName: String(row.company_name ?? ""),
    contactName: String(row.contact_name ?? ""),
    contactEmail: String(row.contact_email ?? ""),
    roleTitle: String(row.role_title ?? ""),
    stage: row.stage as DealStage,
    inboundId: row.inbound_id ? String(row.inbound_id) : null,
    meetingId: row.meeting_id ? String(row.meeting_id) : null,
    formToken: String(row.form_token),
    formData: (row.form_data ?? {}) as DealFormData,
    customFields: (row.custom_fields ?? {}) as Record<string, string>,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

export async function createDeal(input: {
  companyName: string;
  contactName: string;
  contactEmail: string;
  roleTitle: string;
  inboundId: string | null;
  meetingId: string | null;
  formData: DealFormData;
}) {
  await ensureDealsTable();
  const sql = getSql();
  const id = crypto.randomUUID();
  const formToken = crypto.randomUUID().replace(/-/g, "");
  const rows = await sql`
    INSERT INTO deals (id, company_name, contact_name, contact_email, role_title, stage, inbound_id, meeting_id, form_token, form_data)
    VALUES (
      ${id}, ${input.companyName}, ${input.contactName}, ${input.contactEmail}, ${input.roleTitle},
      'form_sent', ${input.inboundId}, ${input.meetingId}, ${formToken}, ${JSON.stringify(input.formData)}
    )
    RETURNING *
  `;
  return mapDeal(rows[0] as Record<string, unknown>);
}

export async function listDeals() {
  await ensureDealsTable();
  const rows = await getSql()`SELECT * FROM deals ORDER BY updated_at DESC LIMIT 500`;
  return rows.map((row) => mapDeal(row as Record<string, unknown>));
}

export async function getDeal(id: string) {
  await ensureDealsTable();
  const rows = await getSql()`SELECT * FROM deals WHERE id = ${id} LIMIT 1`;
  return rows[0] ? mapDeal(rows[0] as Record<string, unknown>) : null;
}

export async function getDealByToken(token: string) {
  await ensureDealsTable();
  const rows = await getSql()`SELECT * FROM deals WHERE form_token = ${token} LIMIT 1`;
  return rows[0] ? mapDeal(rows[0] as Record<string, unknown>) : null;
}

export async function updateDealStage(id: string, stage: DealStage) {
  await ensureDealsTable();
  const rows = await getSql()`
    UPDATE deals SET stage = ${stage}, updated_at = NOW() WHERE id = ${id} RETURNING *
  `;
  return rows[0] ? mapDeal(rows[0] as Record<string, unknown>) : null;
}

export async function submitDealForm(
  token: string,
  formData: DealFormData,
  contactDetails?: { companyName?: string; contactName?: string; roleTitle?: string },
) {
  await ensureDealsTable();
  const rows = await getSql()`
    UPDATE deals
    SET
      form_data = ${JSON.stringify(formData)},
      stage = 'form_completed',
      company_name = COALESCE(${contactDetails?.companyName ?? null}, company_name),
      contact_name = COALESCE(${contactDetails?.contactName ?? null}, contact_name),
      role_title = COALESCE(${contactDetails?.roleTitle ?? null}, role_title),
      updated_at = NOW()
    WHERE form_token = ${token}
    RETURNING *
  `;
  return rows[0] ? mapDeal(rows[0] as Record<string, unknown>) : null;
}

export async function deleteDeal(id: string) {
  await ensureDealsTable();
  const rows = await getSql()`DELETE FROM deals WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export interface DealStudentRound {
  id: string;
  dealId: string;
  studentId: string;
  roundIndex: number;
  status: string;
  feedback: string | null;
  createdAt: string;
  updatedAt: string;
}

function mapDealStudentRound(row: Record<string, unknown>): DealStudentRound {
  return {
    id: String(row.id),
    dealId: String(row.deal_id),
    studentId: String(row.student_id),
    roundIndex: Number(row.round_index ?? 0),
    status: String(row.status ?? "shared"),
    feedback: row.feedback ? String(row.feedback) : null,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

export async function associateStudentToDeal(input: {
  dealId: string;
  studentId: string;
  roundIndex: number;
}) {
  await ensureDealsTable();
  const id = crypto.randomUUID();
  const rows = await getSql()`
    INSERT INTO deal_student_rounds (id, deal_id, student_id, round_index)
    VALUES (${id}, ${input.dealId}, ${input.studentId}, ${input.roundIndex})
    RETURNING *
  `;
  return mapDealStudentRound(rows[0] as Record<string, unknown>);
}

export async function updateDealStudentRound(id: string, input: { status?: string; feedback?: string }) {
  await ensureDealsTable();
  const rows = await getSql()`
    UPDATE deal_student_rounds
    SET
      status = COALESCE(${input.status ?? null}, status),
      feedback = COALESCE(${input.feedback ?? null}, feedback),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] ? mapDealStudentRound(rows[0] as Record<string, unknown>) : null;
}

export async function removeDealStudentRound(id: string) {
  await ensureDealsTable();
  const rows = await getSql()`DELETE FROM deal_student_rounds WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function listDealStudentRounds(dealId: string) {
  await ensureDealsTable();
  const rows = await getSql()`
    SELECT * FROM deal_student_rounds WHERE deal_id = ${dealId} ORDER BY round_index ASC, created_at ASC
  `;
  return rows.map((row) => mapDealStudentRound(row as Record<string, unknown>));
}

// Powers the per-student "history" view: every deal/round a student has ever
// been associated with, across every company, with the feedback attached.
export async function listDealStudentRoundsForStudent(studentId: string) {
  await ensureDealsTable();
  const rows = await getSql()`
    SELECT * FROM deal_student_rounds WHERE student_id = ${studentId} ORDER BY created_at DESC
  `;
  return rows.map((row) => mapDealStudentRound(row as Record<string, unknown>));
}
