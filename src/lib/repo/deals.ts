import { appendRow, deleteRowsByColValue, ensureTab, findRow, readAllRows, updateRow } from "./_sheets";

export const DEAL_STAGES = [
  "form_sent", "form_completed", "profiles_shared",
  "interviewing", "offer", "closed_won", "closed_lost",
] as const;

export type DealStage = (typeof DEAL_STAGES)[number];

export interface DealRound { type: string; notes?: string; }

export interface DealFormData {
  jdUrl?: string; roundsCount?: number; rounds?: DealRound[];
  expectations?: string; dealbreakers?: string; headcount?: string;
  compensationType?: string; compensationRange?: string; notes?: string;
}

export interface DealRecord {
  id: string; companyName: string; contactName: string; contactEmail: string;
  roleTitle: string; stage: DealStage; inboundId: string | null; meetingId: string | null;
  formToken: string; formData: DealFormData; customFields: Record<string, string>;
  createdAt: string; updatedAt: string;
}

export interface DealStudentRound {
  id: string; dealId: string; studentId: string; roundIndex: number;
  status: string; feedback: string | null; createdAt: string; updatedAt: string;
}

// --- Deals tab ---

const DEALS_TAB = "Deals";
const DEALS_HEADERS = [
  "id", "company_name", "contact_name", "contact_email", "role_title",
  "stage", "inbound_id", "meeting_id", "form_token", "form_data", "custom_fields",
  "created_at", "updated_at",
];

const D = {
  id: 0, companyName: 1, contactName: 2, contactEmail: 3, roleTitle: 4,
  stage: 5, inboundId: 6, meetingId: 7, formToken: 8, formData: 9,
  customFields: 10, createdAt: 11, updatedAt: 12,
} as const;

let dealsReady: Promise<void> | null = null;
function readyDeals() {
  if (!dealsReady) dealsReady = ensureTab(DEALS_TAB, DEALS_HEADERS).catch((e) => { dealsReady = null; throw e; });
  return dealsReady;
}

function parseJson<T>(str: string, fallback: T): T {
  try { return str ? JSON.parse(str) : fallback; } catch { return fallback; }
}

function toDeal(row: string[]): DealRecord {
  return {
    id: row[D.id] ?? "", companyName: row[D.companyName] ?? "",
    contactName: row[D.contactName] ?? "", contactEmail: row[D.contactEmail] ?? "",
    roleTitle: row[D.roleTitle] ?? "", stage: (row[D.stage] as DealStage) ?? "form_sent",
    inboundId: row[D.inboundId] || null, meetingId: row[D.meetingId] || null,
    formToken: row[D.formToken] ?? "",
    formData: parseJson<DealFormData>(row[D.formData] ?? "", {}),
    customFields: parseJson<Record<string, string>>(row[D.customFields] ?? "", {}),
    createdAt: row[D.createdAt] ?? "", updatedAt: row[D.updatedAt] ?? "",
  };
}

function dealToRow(r: DealRecord): string[] {
  return [
    r.id, r.companyName, r.contactName, r.contactEmail, r.roleTitle, r.stage,
    r.inboundId ?? "", r.meetingId ?? "", r.formToken,
    JSON.stringify(r.formData), JSON.stringify(r.customFields),
    r.createdAt, r.updatedAt,
  ];
}

export async function createDeal(input: {
  companyName: string; contactName: string; contactEmail: string; roleTitle: string;
  inboundId: string | null; meetingId: string | null; formData: DealFormData;
}): Promise<DealRecord> {
  await readyDeals();
  const now = new Date().toISOString();
  const record: DealRecord = {
    id: crypto.randomUUID(), ...input, stage: "form_sent",
    formToken: crypto.randomUUID().replace(/-/g, ""),
    customFields: {}, createdAt: now, updatedAt: now,
  };
  await appendRow(DEALS_TAB, dealToRow(record));
  return record;
}

export async function listDeals(): Promise<DealRecord[]> {
  await readyDeals();
  const rows = await readAllRows(DEALS_TAB);
  return rows.slice(1).filter((r) => r[D.id]).map(toDeal)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getDeal(id: string): Promise<DealRecord | null> {
  await readyDeals();
  const found = await findRow(DEALS_TAB, D.id, id);
  return found ? toDeal(found.row) : null;
}

// Magic-link tokens never expired before this — a leaked link (forwarded
// email, browser history, referrer header) stayed valid forever. Derived
// from the existing created_at column so no sheet migration is needed.
const FORM_TOKEN_TTL_MS = 60 * 24 * 60 * 60 * 1000; // 60 days

function isTokenExpired(deal: DealRecord): boolean {
  const createdAt = Date.parse(deal.createdAt);
  if (Number.isNaN(createdAt)) return false;
  return Date.now() - createdAt > FORM_TOKEN_TTL_MS;
}

export async function getDealByToken(token: string): Promise<DealRecord | null> {
  await readyDeals();
  const found = await findRow(DEALS_TAB, D.formToken, token);
  if (!found) return null;
  const deal = toDeal(found.row);
  return isTokenExpired(deal) ? null : deal;
}

export async function updateDealStage(id: string, stage: DealStage): Promise<DealRecord | null> {
  await readyDeals();
  const found = await findRow(DEALS_TAB, D.id, id);
  if (!found) return null;
  const updated = { ...toDeal(found.row), stage, updatedAt: new Date().toISOString() };
  await updateRow(DEALS_TAB, found.rowNum, dealToRow(updated));
  return updated;
}

export async function submitDealForm(
  token: string,
  formData: DealFormData,
  contactDetails?: { companyName?: string; contactName?: string; roleTitle?: string },
): Promise<DealRecord | null> {
  await readyDeals();
  const found = await findRow(DEALS_TAB, D.formToken, token);
  if (!found) return null;
  const existing = toDeal(found.row);
  if (isTokenExpired(existing)) return null;
  const updated: DealRecord = {
    ...existing,
    formData,
    stage: "form_completed",
    companyName: contactDetails?.companyName || existing.companyName,
    contactName: contactDetails?.contactName || existing.contactName,
    roleTitle: contactDetails?.roleTitle || existing.roleTitle,
    updatedAt: new Date().toISOString(),
  };
  await updateRow(DEALS_TAB, found.rowNum, dealToRow(updated));
  return updated;
}

export async function deleteDeal(id: string): Promise<boolean> {
  await readyDeals();
  return (await deleteRowsByColValue(DEALS_TAB, D.id, [id])) > 0;
}

// --- DealStudentRounds tab ---

const ROUNDS_TAB = "DealStudentRounds";
const ROUNDS_HEADERS = ["id", "deal_id", "student_id", "round_index", "status", "feedback", "created_at", "updated_at"];

const R = { id: 0, dealId: 1, studentId: 2, roundIndex: 3, status: 4, feedback: 5, createdAt: 6, updatedAt: 7 } as const;

let roundsReady: Promise<void> | null = null;
function readyRounds() {
  if (!roundsReady) roundsReady = ensureTab(ROUNDS_TAB, ROUNDS_HEADERS).catch((e) => { roundsReady = null; throw e; });
  return roundsReady;
}

function toRound(row: string[]): DealStudentRound {
  return {
    id: row[R.id] ?? "", dealId: row[R.dealId] ?? "", studentId: row[R.studentId] ?? "",
    roundIndex: parseInt(row[R.roundIndex] ?? "0", 10),
    status: row[R.status] ?? "shared", feedback: row[R.feedback] || null,
    createdAt: row[R.createdAt] ?? "", updatedAt: row[R.updatedAt] ?? "",
  };
}

function roundToRow(r: DealStudentRound): string[] {
  return [r.id, r.dealId, r.studentId, String(r.roundIndex), r.status, r.feedback ?? "", r.createdAt, r.updatedAt];
}

export async function associateStudentToDeal(input: { dealId: string; studentId: string; roundIndex: number }): Promise<DealStudentRound> {
  await readyRounds();
  const now = new Date().toISOString();
  const record: DealStudentRound = {
    id: crypto.randomUUID(), ...input, status: "shared", feedback: null, createdAt: now, updatedAt: now,
  };
  await appendRow(ROUNDS_TAB, roundToRow(record));
  return record;
}

export async function updateDealStudentRound(id: string, input: { status?: string; feedback?: string }): Promise<DealStudentRound | null> {
  await readyRounds();
  const found = await findRow(ROUNDS_TAB, R.id, id);
  if (!found) return null;
  const updated: DealStudentRound = {
    ...toRound(found.row),
    status: input.status ?? toRound(found.row).status,
    feedback: input.feedback ?? toRound(found.row).feedback,
    updatedAt: new Date().toISOString(),
  };
  await updateRow(ROUNDS_TAB, found.rowNum, roundToRow(updated));
  return updated;
}

export async function removeDealStudentRound(id: string): Promise<boolean> {
  await readyRounds();
  return (await deleteRowsByColValue(ROUNDS_TAB, R.id, [id])) > 0;
}

export async function listDealStudentRounds(dealId: string): Promise<DealStudentRound[]> {
  await readyRounds();
  const rows = await readAllRows(ROUNDS_TAB);
  return rows.slice(1).filter((r) => r[R.dealId] === dealId).map(toRound)
    .sort((a, b) => a.roundIndex - b.roundIndex || a.createdAt.localeCompare(b.createdAt));
}

export async function listDealStudentRoundsForStudent(studentId: string): Promise<DealStudentRound[]> {
  await readyRounds();
  const rows = await readAllRows(ROUNDS_TAB);
  return rows.slice(1).filter((r) => r[R.studentId] === studentId).map(toRound)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
