import { appendRow, deleteRowsByColValue, ensureTab, findRow, readAllRows, updateRow } from "./_sheets";
import type { BookingDetails, ChatMessage, JourneyStatus, OpportunityDraft, OpportunityRecord } from "@/lib/opportunity-types";

export type { BookingDetails, ChatMessage, JourneyStatus, OpportunityDraft, OpportunityRecord };
export type { ReviewStatus } from "@/lib/opportunity-types";

const TAB = "Opportunities";
const HEADERS = [
  "id", "status", "company_name", "role_title", "contact_name", "email",
  "alignment", "journey_status", "current_step", "intent_level",
  "data", "transcript", "advice", "booking", "confirmed_at",
  "rejection_reason", "reviewed_by", "reviewed_at", "ip", "created_at", "updated_at",
];

const C = {
  id: 0, status: 1, companyName: 2, roleTitle: 3, contactName: 4, email: 5,
  alignment: 6, journeyStatus: 7, currentStep: 8, intentLevel: 9,
  data: 10, transcript: 11, advice: 12, booking: 13, confirmedAt: 14,
  rejectionReason: 15, reviewedBy: 16, reviewedAt: 17, ip: 18, createdAt: 19, updatedAt: 20,
} as const;

const IP_RESUME_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

let tabReady: Promise<void> | null = null;
function ready() {
  if (!tabReady) tabReady = ensureTab(TAB, HEADERS).catch((e) => { tabReady = null; throw e; });
  return tabReady;
}

function parseJson<T>(str: string, fallback: T): T {
  try { return str ? JSON.parse(str) : fallback; } catch { return fallback; }
}

function toRecord(row: string[]): OpportunityRecord {
  return {
    id: row[C.id] ?? "",
    status: (row[C.status] as OpportunityRecord["status"]) ?? "pending",
    companyName: row[C.companyName] ?? "",
    roleTitle: row[C.roleTitle] ?? "",
    contactName: row[C.contactName] ?? "",
    email: row[C.email] ?? "",
    alignment: (row[C.alignment] as OpportunityRecord["alignment"]) ?? "Yellow",
    journeyStatus: (row[C.journeyStatus] as JourneyStatus) ?? "started",
    currentStep: parseInt(row[C.currentStep] ?? "0", 10),
    intentLevel: (row[C.intentLevel] as OpportunityRecord["intentLevel"]) ?? "started",
    data: parseJson<OpportunityDraft>(row[C.data] ?? "", {}),
    transcript: parseJson<ChatMessage[]>(row[C.transcript] ?? "", []),
    advice: parseJson<string[]>(row[C.advice] ?? "", []),
    booking: parseJson<BookingDetails | null>(row[C.booking] ?? "", null),
    confirmedAt: row[C.confirmedAt] || null,
    rejectionReason: row[C.rejectionReason] || null,
    reviewedBy: row[C.reviewedBy] || null,
    reviewedAt: row[C.reviewedAt] || null,
    createdAt: row[C.createdAt] ?? "",
    updatedAt: row[C.updatedAt] ?? "",
  };
}

function toRow(r: OpportunityRecord, ip?: string): string[] {
  return [
    r.id, r.status, r.companyName, r.roleTitle, r.contactName, r.email,
    r.alignment, r.journeyStatus, String(r.currentStep), r.intentLevel,
    JSON.stringify(r.data), JSON.stringify(r.transcript),
    JSON.stringify(r.advice), r.booking ? JSON.stringify(r.booking) : "",
    r.confirmedAt ?? "", r.rejectionReason ?? "", r.reviewedBy ?? "",
    r.reviewedAt ?? "", ip ?? "", r.createdAt, r.updatedAt,
  ];
}

export async function startOpportunity(data: OpportunityDraft, transcript: ChatMessage[], ip?: string): Promise<OpportunityRecord> {
  await ready();
  const now = new Date().toISOString();
  const record: OpportunityRecord = {
    id: crypto.randomUUID(), status: "pending",
    companyName: data.companyName ?? "", roleTitle: "",
    contactName: data.contactName ?? "", email: data.email ?? "",
    alignment: "Yellow", journeyStatus: "started", currentStep: 0,
    intentLevel: "started", data, transcript, advice: [], booking: null,
    confirmedAt: null, rejectionReason: null, reviewedBy: null, reviewedAt: null,
    createdAt: now, updatedAt: now,
  };
  await appendRow(TAB, toRow(record, ip));
  return record;
}

export async function updateOpportunityJourney(input: {
  id: string; data: OpportunityDraft; transcript: ChatMessage[];
  journeyStatus: JourneyStatus; currentStep: number;
  advice?: string[]; confirmed?: boolean; booking?: BookingDetails; ip?: string;
}): Promise<OpportunityRecord | null> {
  await ready();
  const found = await findRow(TAB, C.id, input.id);
  if (!found) return null;
  const existing = toRecord(found.row);
  const now = new Date().toISOString();
  const intentLevel =
    input.journeyStatus === "meeting_booked" ? "booked"
    : input.journeyStatus === "requirement_confirmed" ? "confirmed"
    : input.currentStep > 0 ? "engaged"
    : "started";
  const roles = input.data.roles?.join(", ") || input.data.roleTitle || "";
  const updated: OpportunityRecord = {
    ...existing,
    companyName: input.data.companyName ?? existing.companyName,
    roleTitle: roles,
    contactName: input.data.contactName ?? existing.contactName,
    email: input.data.email ?? existing.email,
    alignment: input.data.alignment ?? existing.alignment,
    data: input.data, transcript: input.transcript,
    journeyStatus: input.journeyStatus, currentStep: input.currentStep,
    intentLevel, advice: input.advice ?? existing.advice,
    booking: input.booking ?? existing.booking,
    confirmedAt: input.confirmed ? existing.confirmedAt ?? now : existing.confirmedAt,
    updatedAt: now,
  };
  await updateRow(TAB, found.rowNum, toRow(updated, input.ip ?? found.row[C.ip]));
  return updated;
}

export async function getOpportunity(id: string): Promise<OpportunityRecord | null> {
  await ready();
  const found = await findRow(TAB, C.id, id);
  return found ? toRecord(found.row) : null;
}

export async function getLatestOpportunityForEmail(email: string): Promise<OpportunityRecord | null> {
  await ready();
  const rows = await readAllRows(TAB);
  const matching = rows.slice(1)
    .filter((r) => (r[C.email] ?? "").toLowerCase() === email.toLowerCase())
    .map(toRecord)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return matching[0] ?? null;
}

export async function getLatestOpportunityForIp(ip: string): Promise<OpportunityRecord | null> {
  if (!ip || ip === "local" || ip === "unknown") return null;
  await ready();
  const cutoff = new Date(Date.now() - IP_RESUME_WINDOW_MS).toISOString();
  const rows = await readAllRows(TAB);
  const matching = rows.slice(1)
    .filter((r) => r[C.ip] === ip && (r[C.updatedAt] ?? "") >= cutoff)
    .map(toRecord)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return matching[0] ?? null;
}

export async function listOpportunities(): Promise<OpportunityRecord[]> {
  await ready();
  const rows = await readAllRows(TAB);
  return rows.slice(1).filter((r) => r[C.id]).map(toRecord)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateOpportunityStatus(
  id: string,
  status: "reviewed" | "rejected",
  reviewer: string,
  rejectionReason?: string,
): Promise<OpportunityRecord | null> {
  await ready();
  const found = await findRow(TAB, C.id, id);
  if (!found) return null;
  const now = new Date().toISOString();
  const updated: OpportunityRecord = {
    ...toRecord(found.row),
    status, reviewedBy: reviewer, reviewedAt: now,
    rejectionReason: rejectionReason ?? null, updatedAt: now,
  };
  await updateRow(TAB, found.rowNum, toRow(updated, found.row[C.ip]));
  return updated;
}

export async function updateOpportunityStatusBulk(
  ids: string[], status: "reviewed" | "rejected", reviewer: string, rejectionReason?: string,
): Promise<OpportunityRecord[]> {
  const results = await Promise.all(ids.map((id) => updateOpportunityStatus(id, status, reviewer, rejectionReason)));
  return results.filter(Boolean) as OpportunityRecord[];
}

export async function deleteOpportunity(id: string): Promise<boolean> {
  await ready();
  return (await deleteRowsByColValue(TAB, C.id, [id])) > 0;
}

export async function deleteOpportunitiesBulk(ids: string[]): Promise<number> {
  await ready();
  return deleteRowsByColValue(TAB, C.id, ids);
}
