import { appendRow, deleteRowsByColValue, ensureTab, findRow, readAllRows, updateRow } from "./_sheets";
import type { LeadRecord, LeadStatus } from "@/lib/lead-types";

export type { LeadRecord, LeadStatus };

const TAB = "Leads";
const HEADERS = ["id", "first_name", "last_name", "email", "company", "role", "brief", "source", "status", "zoho_id", "created_at"];

const C = { id: 0, firstName: 1, lastName: 2, email: 3, company: 4, role: 5, brief: 6, source: 7, status: 8, zohoId: 9, createdAt: 10 } as const;

let tabReady: Promise<void> | null = null;
function ready() {
  if (!tabReady) tabReady = ensureTab(TAB, HEADERS).catch((e) => { tabReady = null; throw e; });
  return tabReady;
}

function toRecord(row: string[]): LeadRecord {
  return {
    id: row[C.id] ?? "",
    firstName: row[C.firstName] ?? "",
    lastName: row[C.lastName] ?? "",
    email: row[C.email] ?? "",
    company: row[C.company] ?? "",
    role: row[C.role] ?? "",
    brief: row[C.brief] ?? "",
    source: row[C.source] ?? "website",
    status: (row[C.status] as LeadStatus) ?? "new",
    zohoId: row[C.zohoId] || null,
    createdAt: row[C.createdAt] ?? new Date().toISOString(),
  };
}

function toRow(r: LeadRecord): string[] {
  return [r.id, r.firstName, r.lastName, r.email, r.company, r.role, r.brief, r.source, r.status, r.zohoId ?? "", r.createdAt];
}

export async function insertLead(input: {
  firstName: string; lastName: string; email: string;
  company: string; role: string; brief: string; source: string; zohoId?: string | null;
}): Promise<LeadRecord> {
  await ready();
  const record: LeadRecord = {
    id: crypto.randomUUID(),
    firstName: input.firstName, lastName: input.lastName, email: input.email,
    company: input.company, role: input.role, brief: input.brief,
    source: input.source, status: "new", zohoId: input.zohoId ?? null,
    createdAt: new Date().toISOString(),
  };
  await appendRow(TAB, toRow(record));
  return record;
}

export async function listLeads(): Promise<LeadRecord[]> {
  await ready();
  const rows = await readAllRows(TAB);
  return rows.slice(1).filter((r) => r[C.id]).map(toRecord).reverse();
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<LeadRecord | null> {
  await ready();
  const found = await findRow(TAB, C.id, id);
  if (!found) return null;
  const updated = { ...toRecord(found.row), status };
  await updateRow(TAB, found.rowNum, toRow(updated));
  return updated;
}

export async function updateLeadStatusBulk(ids: string[], status: LeadStatus): Promise<LeadRecord[]> {
  const results = await Promise.all(ids.map((id) => updateLeadStatus(id, status)));
  return results.filter(Boolean) as LeadRecord[];
}

export async function deleteLead(id: string): Promise<boolean> {
  await ready();
  const found = await findRow(TAB, C.id, id);
  if (!found) return false;
  const { deleteRow } = await import("./_sheets");
  await deleteRow(TAB, found.rowNum);
  return true;
}

export async function deleteLeadsBulk(ids: string[]): Promise<number> {
  await ready();
  return deleteRowsByColValue(TAB, C.id, ids);
}
