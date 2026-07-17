import { appendRow, ensureTab, readAllRows, updateRow } from "./_sheets";

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

const TAB = "Meetings";
const HEADERS = ["id", "company_name", "contact_name", "contact_email", "role_title", "start_time", "status", "inbound_id", "created_at", "updated_at"];

const C = { id: 0, companyName: 1, contactName: 2, contactEmail: 3, roleTitle: 4, startTime: 5, status: 6, inboundId: 7, createdAt: 8, updatedAt: 9 } as const;

let tabReady: Promise<void> | null = null;
function ready() {
  if (!tabReady) tabReady = ensureTab(TAB, HEADERS).catch((e) => { tabReady = null; throw e; });
  return tabReady;
}

function toRecord(row: string[]): MeetingRecord {
  return {
    id: row[C.id] ?? "",
    companyName: row[C.companyName] ?? "",
    contactName: row[C.contactName] ?? "",
    contactEmail: row[C.contactEmail] ?? "",
    roleTitle: row[C.roleTitle] ?? "",
    startTime: row[C.startTime] || null,
    status: (row[C.status] as MeetingStatus) ?? "upcoming",
    inboundId: row[C.inboundId] || null,
    createdAt: row[C.createdAt] ?? "",
    updatedAt: row[C.updatedAt] ?? "",
  };
}

function toRow(r: MeetingRecord): string[] {
  return [r.id, r.companyName, r.contactName, r.contactEmail, r.roleTitle, r.startTime ?? "", r.status, r.inboundId ?? "", r.createdAt, r.updatedAt];
}

export async function upsertMeeting(input: {
  id: string; companyName: string; contactName: string; contactEmail: string;
  roleTitle: string; startTime: string | null; status: MeetingStatus;
  inboundId: string | null; raw: Record<string, unknown>;
}): Promise<MeetingRecord> {
  await ready();
  const now = new Date().toISOString();
  const rows = await readAllRows(TAB);

  for (let i = 1; i < rows.length; i++) {
    if ((rows[i][C.id] ?? "") === input.id) {
      const existing = toRecord(rows[i]);
      const updated: MeetingRecord = {
        ...existing,
        companyName: input.companyName || existing.companyName,
        contactName: input.contactName || existing.contactName,
        roleTitle: input.roleTitle || existing.roleTitle,
        startTime: input.startTime ?? existing.startTime,
        status: input.status,
        inboundId: input.inboundId ?? existing.inboundId,
        updatedAt: now,
      };
      await updateRow(TAB, i + 1, toRow(updated));
      return updated;
    }
  }

  // Not found — insert
  const record: MeetingRecord = {
    id: input.id,
    companyName: input.companyName,
    contactName: input.contactName,
    contactEmail: input.contactEmail,
    roleTitle: input.roleTitle,
    startTime: input.startTime,
    status: input.status,
    inboundId: input.inboundId,
    createdAt: now,
    updatedAt: now,
  };
  await appendRow(TAB, toRow(record));
  return record;
}

export async function listMeetings(): Promise<MeetingRecord[]> {
  await ready();
  const rows = await readAllRows(TAB);
  return rows.slice(1).filter((r) => r[C.id]).map(toRecord)
    .sort((a, b) => (b.startTime ?? "").localeCompare(a.startTime ?? ""));
}
