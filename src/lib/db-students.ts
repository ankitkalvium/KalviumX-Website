import { getSql } from "@/lib/db";

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
  // Sheet-sourced operational fields — kept as real columns (not JSONB) so
  // the Students page can filter/group by campus, eligibility, etc.
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

let studentsTableReady: Promise<void> | null = null;

export async function ensureStudentsTable() {
  if (studentsTableReady) return studentsTableReady;
  studentsTableReady = prepareStudentsTable().catch((error) => {
    studentsTableReady = null;
    throw error;
  });
  return studentsTableReady;
}

async function prepareStudentsTable() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      year TEXT NOT NULL DEFAULT '',
      role_interests TEXT[] NOT NULL DEFAULT '{}',
      skills TEXT[] NOT NULL DEFAULT '{}',
      status TEXT NOT NULL DEFAULT 'eligible',
      resume_url TEXT NOT NULL DEFAULT '',
      custom_fields JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS squad_number TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS campus_name TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS location TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS placements_status TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS eligibility_status TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS work_integration_status TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS availability_for_work TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'manual'`;
  await sql`CREATE INDEX IF NOT EXISTS students_status_idx ON students (status)`;
  await sql`CREATE INDEX IF NOT EXISTS students_email_idx ON students (email)`;
  await sql`CREATE INDEX IF NOT EXISTS students_campus_idx ON students (campus_name)`;
  // Required for the Google Sheet sync's ON CONFLICT upsert — one row per
  // email regardless of casing.
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS students_email_unique_idx ON students (LOWER(email))`;
}

function mapStudent(row: Record<string, unknown>): StudentRecord {
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    year: String(row.year ?? ""),
    roleInterests: (row.role_interests ?? []) as string[],
    skills: (row.skills ?? []) as string[],
    status: row.status as StudentStatus,
    resumeUrl: String(row.resume_url ?? ""),
    squadNumber: String(row.squad_number ?? ""),
    campusName: String(row.campus_name ?? ""),
    location: String(row.location ?? ""),
    placementsStatus: String(row.placements_status ?? ""),
    eligibilityStatus: String(row.eligibility_status ?? ""),
    workIntegrationStatus: String(row.work_integration_status ?? ""),
    availabilityForWork: String(row.availability_for_work ?? ""),
    source: (row.source as StudentSource) ?? "manual",
    customFields: (row.custom_fields ?? {}) as Record<string, string>,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

export interface StudentInput {
  name: string;
  email: string;
  phone?: string;
  year?: string;
  roleInterests?: string[];
  skills?: string[];
  status?: StudentStatus;
  resumeUrl?: string;
  squadNumber?: string;
  campusName?: string;
  location?: string;
  placementsStatus?: string;
  eligibilityStatus?: string;
  workIntegrationStatus?: string;
  availabilityForWork?: string;
  customFields?: Record<string, string>;
}

export async function createStudent(input: StudentInput) {
  await ensureStudentsTable();
  const id = crypto.randomUUID();
  const rows = await getSql()`
    INSERT INTO students (
      id, name, email, phone, year, role_interests, skills, status, resume_url,
      squad_number, campus_name, location, placements_status, eligibility_status,
      work_integration_status, availability_for_work, custom_fields
    )
    VALUES (
      ${id}, ${input.name}, ${input.email}, ${input.phone ?? ""}, ${input.year ?? ""},
      ${input.roleInterests ?? []}, ${input.skills ?? []}, ${input.status ?? "eligible"},
      ${input.resumeUrl ?? ""}, ${input.squadNumber ?? ""}, ${input.campusName ?? ""},
      ${input.location ?? ""}, ${input.placementsStatus ?? ""}, ${input.eligibilityStatus ?? ""},
      ${input.workIntegrationStatus ?? ""}, ${input.availabilityForWork ?? ""},
      ${JSON.stringify(input.customFields ?? {})}
    )
    RETURNING *
  `;
  return mapStudent(rows[0] as Record<string, unknown>);
}

export async function updateStudent(id: string, input: Partial<StudentInput>) {
  await ensureStudentsTable();
  const existing = await getStudent(id);
  if (!existing) return null;
  const merged: StudentInput = {
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
  };
  const rows = await getSql()`
    UPDATE students SET
      name = ${merged.name},
      email = ${merged.email},
      phone = ${merged.phone ?? ""},
      year = ${merged.year ?? ""},
      role_interests = ${merged.roleInterests ?? []},
      skills = ${merged.skills ?? []},
      status = ${merged.status ?? "eligible"},
      resume_url = ${merged.resumeUrl ?? ""},
      squad_number = ${merged.squadNumber ?? ""},
      campus_name = ${merged.campusName ?? ""},
      location = ${merged.location ?? ""},
      placements_status = ${merged.placementsStatus ?? ""},
      eligibility_status = ${merged.eligibilityStatus ?? ""},
      work_integration_status = ${merged.workIntegrationStatus ?? ""},
      availability_for_work = ${merged.availabilityForWork ?? ""},
      custom_fields = ${JSON.stringify(merged.customFields ?? {})},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] ? mapStudent(rows[0] as Record<string, unknown>) : null;
}

export async function getStudent(id: string) {
  await ensureStudentsTable();
  const rows = await getSql()`SELECT * FROM students WHERE id = ${id} LIMIT 1`;
  return rows[0] ? mapStudent(rows[0] as Record<string, unknown>) : null;
}

export async function listStudents() {
  await ensureStudentsTable();
  const rows = await getSql()`SELECT * FROM students ORDER BY created_at DESC LIMIT 2000`;
  return rows.map((row) => mapStudent(row as Record<string, unknown>));
}

export async function deleteStudent(id: string) {
  await ensureStudentsTable();
  const rows = await getSql()`DELETE FROM students WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

// CSV import: dedupes by email (case-insensitive) within the same import
// batch via upsert, so re-importing an updated sheet refreshes existing
// students instead of duplicating them.
export async function importStudents(rows: StudentInput[]) {
  await ensureStudentsTable();
  let count = 0;
  for (const row of rows) {
    if (!row.email) continue;
    const existing = await getSql()`SELECT id FROM students WHERE LOWER(email) = ${row.email.toLowerCase()} LIMIT 1`;
    if (existing[0]) {
      await updateStudent(String(existing[0].id), row);
    } else {
      await createStudent(row);
    }
    count += 1;
  }
  return count;
}

export interface SheetStudentRow {
  email: string;
  name: string;
  yearOfStudy: string;
  squadNumber: string;
  campusName: string;
  location: string;
  placementsStatus: string;
  eligibilityStatus: string;
  workIntegrationStatus: string;
  availabilityForWork: string;
}

// Real-time push target for the Apps Script trigger on the Google Sheet —
// the sheet always wins on these fields per row (matched by email), but
// never touches roleInterests/skills/resumeUrl/our own pipeline `status`/
// customFields, which stay admin-managed.
export async function upsertStudentsFromSheet(rows: SheetStudentRow[]) {
  await ensureStudentsTable();
  const sql = getSql();
  let count = 0;
  for (const row of rows) {
    if (!row.email) continue;
    const id = crypto.randomUUID();
    await sql`
      INSERT INTO students (id, name, email, year, squad_number, campus_name, location, placements_status, eligibility_status, work_integration_status, availability_for_work, source)
      VALUES (
        ${id}, ${row.name}, ${row.email.toLowerCase()}, ${row.yearOfStudy}, ${row.squadNumber}, ${row.campusName},
        ${row.location}, ${row.placementsStatus}, ${row.eligibilityStatus}, ${row.workIntegrationStatus},
        ${row.availabilityForWork}, 'sheet'
      )
      ON CONFLICT (LOWER(email)) DO UPDATE SET
        name = EXCLUDED.name,
        year = EXCLUDED.year,
        squad_number = EXCLUDED.squad_number,
        campus_name = EXCLUDED.campus_name,
        location = EXCLUDED.location,
        placements_status = EXCLUDED.placements_status,
        eligibility_status = EXCLUDED.eligibility_status,
        work_integration_status = EXCLUDED.work_integration_status,
        availability_for_work = EXCLUDED.availability_for_work,
        source = 'sheet',
        updated_at = NOW()
    `;
    count += 1;
  }
  return count;
}
