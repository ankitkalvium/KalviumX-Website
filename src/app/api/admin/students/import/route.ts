import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminEmail } from "@/auth";
import { importStudents, type StudentInput } from "@/lib/db-students";

const schema = z.object({ csv: z.string().min(1).max(2_000_000) });

// Minimal CSV line parser (handles quoted fields containing commas) — no new
// dependency for what's a one-off admin import tool. Expected header row:
// name,email,phone,year,roleInterests,skills,status,resumeUrl
// roleInterests/skills are semicolon-separated within their cell.
function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells.map((cell) => cell.trim());
}

export async function POST(request: Request) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const lines = parsed.data.csv.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return NextResponse.json({ error: "CSV needs a header row and at least one student." }, { status: 400 });

  // Headers are matched with spaces stripped so both our own CSV format
  // (roleInterests) and the literal Google Sheet column names ("Student
  // Email", "Year of Study", "Eligibility Status", ...) work without
  // requiring an exact match.
  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase().replace(/\s+/g, ""));
  const rows: StudentInput[] = [];
  for (const line of lines.slice(1)) {
    const cells = parseCsvLine(line);
    const get = (...keys: string[]) => {
      for (const key of keys) {
        const index = headers.indexOf(key);
        if (index !== -1) return cells[index] ?? "";
      }
      return "";
    };
    const email = get("email", "studentemail").toLowerCase();
    if (!email) continue;
    rows.push({
      name: get("name"),
      email,
      phone: get("phone"),
      year: get("year", "yearofstudy"),
      roleInterests: get("roleinterests") ? get("roleinterests").split(";").map((v) => v.trim()).filter(Boolean) : [],
      skills: get("skills") ? get("skills").split(";").map((v) => v.trim()).filter(Boolean) : [],
      status: (["eligible", "placed", "inactive"].includes(get("status")) ? get("status") : "eligible") as StudentInput["status"],
      resumeUrl: get("resumeurl"),
      squadNumber: get("squadnumber"),
      campusName: get("campusname"),
      location: get("location"),
      placementsStatus: get("placementsstatus"),
      eligibilityStatus: get("eligibilitystatus"),
      workIntegrationStatus: get("workintegrationstatus"),
      availabilityForWork: get("studentavailabilityforwork", "availabilityforwork"),
    });
  }

  const count = await importStudents(rows);
  return NextResponse.json({ ok: true, count });
}
