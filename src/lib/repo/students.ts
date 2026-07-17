import { appendRow, deleteRow, deleteRowsByColValue, ensureTab, findRow, readAllRows, updateRow } from "./_sheets";

export type StudentStatus = "eligible" | "placed" | "inactive";
export type StudentSource = "manual" | "sheet";

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  year: string;
  roleInterests: string[];
  skills: string[];
  status: StudentStatus;
  resumeUrl: string;
  squadNumber: string;
  campusName: string;
  location: string;
  placementsStatus: string;
  eligibilityStatus: string;
  workIntegrationStatus: string;
  availabilityForWork: string;
  source: StudentSource;
  customFields: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface StudentInput {
  name: string; email: string; phone?: string; year?: string;
  roleInterests?: string[]; skills?: string[]; status?: StudentStatus; resumeUrl?: string;
  squadNumber?: string; campusName?: string; location?: string;
  placementsStatus?: string; eligibilityStatus?: string;
  workIntegrationStatus?: string; availabilityForWork?: string;
  customFields?: Record<string, string>;
}

export interface SheetStudentRow {
  email: string; name: string; yearOfStudy: string; squadNumber: string;
  campusName: string; location: string; placementsStatus: string;
  eligibilityStatus: string; workIntegrationStatus: string; availabilityForWork: string;
}

const TAB = "Students";
const HEADERS = [
  "id", "name", "email", "phone", "year", "role_interests", "skills",
  "status", "resume_url", "squad_number", "campus_name", "location",
  "placements_status", "eligibility_status", "work_integration_status",
  "availability_for_work", "source", "custom_fields", "created_at", "updated_at",
];

const C = {
  id: 0, name: 1, email: 2, phone: 3, year: 4, roleInterests: 5, skills: 6,
  status: 7, resumeUrl: 8, squadNumber: 9, campusName: 10, location: 11,
  placementsStatus: 12, eligibilityStatus: 13, workIntegrationStatus: 14,
  availabilityForWork: 15, source: 16, customFields: 17, createdAt: 18, updatedAt: 19,
} as const;

let tabReady: Promise<void> | null = null;
function ready() {
  if (!tabReady) tabReady = ensureTab(TAB, HEADERS).catch((e) => { tabReady = null; throw e; });
  return tabReady;
}

function parseJson<T>(str: string, fallback: T): T {
  try { return str ? JSON.parse(str) : fallback; } catch { return fallback; }
}

function toRecord(row: string[]): StudentRecord {
  return {
    id: row[C.id] ?? "",
    name: row[C.name] ?? "",
    email: row[C.email] ?? "",
    phone: row[C.phone] ?? "",
    year: row[C.year] ?? "",
    roleInterests: parseJson<string[]>(row[C.roleInterests] ?? "", []),
    skills: parseJson<string[]>(row[C.skills] ?? "", []),
    status: (row[C.status] as StudentStatus) ?? "eligible",
    resumeUrl: row[C.resumeUrl] ?? "",
    squadNumber: row[C.squadNumber] ?? "",
    campusName: row[C.campusName] ?? "",
    location: row[C.location] ?? "",
    placementsStatus: row[C.placementsStatus] ?? "",
    eligibilityStatus: row[C.eligibilityStatus] ?? "",
    workIntegrationStatus: row[C.workIntegrationStatus] ?? "",
    availabilityForWork: row[C.availabilityForWork] ?? "",
    source: (row[C.source] as StudentSource) ?? "manual",
    customFields: parseJson<Record<string, string>>(row[C.customFields] ?? "", {}),
    createdAt: row[C.createdAt] ?? "",
    updatedAt: row[C.updatedAt] ?? "",
  };
}

function toRow(r: StudentRecord): string[] {
  return [
    r.id, r.name, r.email, r.phone, r.year,
    JSON.stringify(r.roleInterests), JSON.stringify(r.skills),
    r.status, r.resumeUrl, r.squadNumber, r.campusName, r.location,
    r.placementsStatus, r.eligibilityStatus, r.workIntegrationStatus, r.availabilityForWork,
    r.source, JSON.stringify(r.customFields), r.createdAt, r.updatedAt,
  ];
}

export async function createStudent(input: StudentInput): Promise<StudentRecord> {
  await ready();
  const now = new Date().toISOString();
  const record: StudentRecord = {
    id: crypto.randomUUID(), name: input.name, email: input.email,
    phone: input.phone ?? "", year: input.year ?? "",
    roleInterests: input.roleInterests ?? [], skills: input.skills ?? [],
    status: input.status ?? "eligible", resumeUrl: input.resumeUrl ?? "",
    squadNumber: input.squadNumber ?? "", campusName: input.campusName ?? "",
    location: input.location ?? "", placementsStatus: input.placementsStatus ?? "",
    eligibilityStatus: input.eligibilityStatus ?? "",
    workIntegrationStatus: input.workIntegrationStatus ?? "",
    availabilityForWork: input.availabilityForWork ?? "",
    source: "manual", customFields: input.customFields ?? {},
    createdAt: now, updatedAt: now,
  };
  await appendRow(TAB, toRow(record));
  return record;
}

export async function updateStudent(id: string, input: Partial<StudentInput>): Promise<StudentRecord | null> {
  await ready();
  const found = await findRow(TAB, C.id, id);
  if (!found) return null;
  const existing = toRecord(found.row);
  const now = new Date().toISOString();
  const updated: StudentRecord = {
    ...existing,
    name: input.name ?? existing.name,
    email: input.email ?? existing.email,
    phone: input.phone ?? existing.phone,
    year: input.year ?? existing.year,
    roleInterests: input.roleInterests ?? existing.roleInterests,
    skills: input.skills ?? existing.skills,
    status: input.status ?? existing.status,
    resumeUrl: input.resumeUrl ?? existing.resumeUrl,
    squadNumber: input.squadNumber ?? existing.squadNumber,
    campusName: input.campusName ?? existing.campusName,
    location: input.location ?? existing.location,
    placementsStatus: input.placementsStatus ?? existing.placementsStatus,
    eligibilityStatus: input.eligibilityStatus ?? existing.eligibilityStatus,
    workIntegrationStatus: input.workIntegrationStatus ?? existing.workIntegrationStatus,
    availabilityForWork: input.availabilityForWork ?? existing.availabilityForWork,
    customFields: input.customFields ?? existing.customFields,
    updatedAt: now,
  };
  await updateRow(TAB, found.rowNum, toRow(updated));
  return updated;
}

export async function getStudent(id: string): Promise<StudentRecord | null> {
  await ready();
  const found = await findRow(TAB, C.id, id);
  return found ? toRecord(found.row) : null;
}

export async function listStudents(): Promise<StudentRecord[]> {
  await ready();
  const rows = await readAllRows(TAB);
  return rows.slice(1).filter((r) => r[C.id]).map(toRecord).reverse();
}

export async function deleteStudent(id: string): Promise<boolean> {
  await ready();
  const found = await findRow(TAB, C.id, id);
  if (!found) return false;
  await deleteRow(TAB, found.rowNum);
  return true;
}

export async function importStudents(inputRows: StudentInput[]): Promise<number> {
  await ready();
  let count = 0;
  for (const input of inputRows) {
    if (!input.email) continue;
    const found = await findRow(TAB, C.email, input.email.toLowerCase());
    if (found) {
      await updateStudent(found.row[C.id], input);
    } else {
      await createStudent({ ...input, email: input.email.toLowerCase() });
    }
    count++;
  }
  return count;
}

// Called by the Apps Script trigger on the student Google Sheet.
// Sheet fields always win; admin-managed fields (skills, status, etc.) are untouched.
export async function upsertStudentsFromSheet(inputRows: SheetStudentRow[]): Promise<number> {
  await ready();
  const now = new Date().toISOString();
  let count = 0;
  for (const input of inputRows) {
    if (!input.email) continue;
    const normalised = input.email.toLowerCase();
    const found = await findRow(TAB, C.email, normalised);
    if (found) {
      const existing = toRecord(found.row);
      const updated: StudentRecord = {
        ...existing,
        name: input.name || existing.name,
        year: input.yearOfStudy || existing.year,
        squadNumber: input.squadNumber || existing.squadNumber,
        campusName: input.campusName || existing.campusName,
        location: input.location || existing.location,
        placementsStatus: input.placementsStatus || existing.placementsStatus,
        eligibilityStatus: input.eligibilityStatus || existing.eligibilityStatus,
        workIntegrationStatus: input.workIntegrationStatus || existing.workIntegrationStatus,
        availabilityForWork: input.availabilityForWork || existing.availabilityForWork,
        source: "sheet",
        updatedAt: now,
      };
      await updateRow(TAB, found.rowNum, toRow(updated));
    } else {
      const record: StudentRecord = {
        id: crypto.randomUUID(), name: input.name, email: normalised,
        phone: "", year: input.yearOfStudy, roleInterests: [], skills: [],
        status: "eligible", resumeUrl: "", squadNumber: input.squadNumber,
        campusName: input.campusName, location: input.location,
        placementsStatus: input.placementsStatus, eligibilityStatus: input.eligibilityStatus,
        workIntegrationStatus: input.workIntegrationStatus,
        availabilityForWork: input.availabilityForWork,
        source: "sheet", customFields: {}, createdAt: now, updatedAt: now,
      };
      await appendRow(TAB, toRow(record));
    }
    count++;
  }
  return count;
}

export async function deleteStudentById(id: string): Promise<boolean> {
  await ready();
  return (await deleteRowsByColValue(TAB, C.id, [id])) > 0;
}
