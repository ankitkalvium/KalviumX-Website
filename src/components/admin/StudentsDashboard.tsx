"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { DealRecord, DealStudentRound } from "@/lib/db-deals";
import type { StudentRecord, StudentStatus } from "@/lib/db-students";

const STATUS_LABELS: Record<StudentStatus, string> = {
  eligible: "Eligible",
  placed: "Placed",
  inactive: "Inactive",
};

const STATUS_STYLES: Record<StudentStatus, string> = {
  eligible: "border-green-200 bg-green-50 text-green-800",
  placed: "border-blue-200 bg-blue-50 text-blue-800",
  inactive: "border-line bg-soft text-muted",
};

interface HistoryEntry {
  round: DealStudentRound;
  deal: DealRecord | null;
}

function emptyForm() {
  return {
    name: "",
    email: "",
    phone: "",
    year: "",
    roleInterests: "",
    skills: "",
    status: "eligible" as StudentStatus,
    resumeUrl: "",
  };
}

export default function StudentsDashboard({
  students,
  adminEmail,
  onSignOut,
}: {
  students: StudentRecord[];
  adminEmail: string;
  onSignOut?: () => Promise<void>;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryEntry[] | null>(null);
  const [search, setSearch] = useState("");

  const [campusFilter, setCampusFilter] = useState("all");
  const campuses = [...new Set(students.map((student) => student.campusName).filter(Boolean))].sort();

  const openStudent = students.find((student) => student.id === openId) ?? null;
  const filtered = students.filter((student) => {
    const haystack = `${student.name} ${student.email} ${student.skills.join(" ")}`.toLowerCase();
    const matchesSearch = haystack.includes(search.toLowerCase());
    const matchesCampus = campusFilter === "all" || student.campusName === campusFilter;
    return matchesSearch && matchesCampus;
  });

  async function createStudent() {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        year: form.year.trim(),
        roleInterests: form.roleInterests.split(",").map((v) => v.trim()).filter(Boolean),
        skills: form.skills.split(",").map((v) => v.trim()).filter(Boolean),
        status: form.status,
        resumeUrl: form.resumeUrl.trim(),
      }),
    });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(result.error || "Could not add this student.");
      return;
    }
    setShowAddForm(false);
    setForm(emptyForm());
    router.refresh();
  }

  async function deleteStudent(id: string) {
    if (!window.confirm("Remove this student from the pool? This cannot be undone.")) return;
    setBusy(true);
    const response = await fetch(`/api/admin/students/${id}`, { method: "DELETE" });
    setBusy(false);
    if (response.ok) {
      setOpenId(null);
      router.refresh();
    }
  }

  async function updateStudentStatus(id: string, status: StudentStatus) {
    await fetch(`/api/admin/students/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function loadHistory(id: string) {
    setHistory(null);
    const response = await fetch(`/api/admin/students/${id}/history`);
    const result = await response.json();
    if (response.ok) setHistory(result.history);
  }

  async function importCsv(file: File) {
    const csv = await file.text();
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/students/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv }),
    });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(result.error || "Could not import this file.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f5]">
      <AdminSidebar adminEmail={adminEmail} onSignOut={onSignOut} />

      <main className="min-w-0 flex-1 overflow-y-auto px-6 py-8 sm:px-9">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-[-0.04em] text-ink">Student pool</h1>
            <p className="mt-2 text-sm text-muted">Your total eligible student list, associated into deal rounds.</p>
          </div>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void importCsv(file);
                event.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-10 rounded-lg border-2 border-ink px-4 text-sm font-extrabold"
            >
              Import CSV
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm((current) => !current)}
              className="h-10 rounded-lg bg-red px-4 text-sm font-extrabold text-white"
            >
              Add student
            </button>
          </div>
        </header>

        <p className="mt-3 text-xs text-muted">
          CSV columns: name, email, phone, year (or &quot;Year of Study&quot;), roleInterests (semicolon-separated), skills
          (semicolon-separated), status, resumeUrl, squadNumber, campusName, location, placementsStatus,
          eligibilityStatus, workIntegrationStatus, availabilityForWork. Your sheet&apos;s exact column names
          (&quot;Student Email&quot;, &quot;Year of Study&quot;, etc.) work too.
        </p>

        {error ? <p className="mt-4 text-sm font-semibold text-red">{error}</p> : null}

        {showAddForm ? (
          <div className="mt-5 grid gap-3 rounded-xl border border-line bg-white p-5 sm:grid-cols-2">
            <input
              placeholder="Name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="h-10 rounded-lg border-2 border-line px-3 text-sm"
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="h-10 rounded-lg border-2 border-line px-3 text-sm"
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              className="h-10 rounded-lg border-2 border-line px-3 text-sm"
            />
            <input
              placeholder="Year (e.g. Sem 5)"
              value={form.year}
              onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))}
              className="h-10 rounded-lg border-2 border-line px-3 text-sm"
            />
            <input
              placeholder="Role interests (comma-separated)"
              value={form.roleInterests}
              onChange={(event) => setForm((current) => ({ ...current, roleInterests: event.target.value }))}
              className="h-10 rounded-lg border-2 border-line px-3 text-sm sm:col-span-2"
            />
            <input
              placeholder="Skills (comma-separated)"
              value={form.skills}
              onChange={(event) => setForm((current) => ({ ...current, skills: event.target.value }))}
              className="h-10 rounded-lg border-2 border-line px-3 text-sm sm:col-span-2"
            />
            <input
              placeholder="Resume URL"
              value={form.resumeUrl}
              onChange={(event) => setForm((current) => ({ ...current, resumeUrl: event.target.value }))}
              className="h-10 rounded-lg border-2 border-line px-3 text-sm sm:col-span-2"
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => void createStudent()}
              className="h-10 rounded-lg bg-ink text-sm font-extrabold text-white sm:col-span-2 disabled:opacity-50"
            >
              {busy ? "Saving..." : "Save student"}
            </button>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          <input
            placeholder="Search by name, email, or skill..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-10 w-full max-w-md rounded-lg border-2 border-line px-3 text-sm"
          />
          <select
            value={campusFilter}
            onChange={(event) => setCampusFilter(event.target.value)}
            className="h-10 rounded-lg border-2 border-line px-3 text-sm font-bold"
          >
            <option value="all">All campuses ({students.length})</option>
            {campuses.map((campus) => (
              <option key={campus} value={campus}>
                {campus} ({students.filter((s) => s.campusName === campus).length})
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white">
          {filtered.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h2 className="text-lg font-black">No students in the pool yet</h2>
              <p className="mt-2 text-sm text-muted">Add students manually or import a CSV.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left">
                <thead className="border-b border-line bg-soft text-[11px] uppercase tracking-[0.1em] text-muted">
                  <tr>
                    <th className="px-5 py-4 font-extrabold">Name</th>
                    <th className="px-5 py-4 font-extrabold">Year</th>
                    <th className="px-5 py-4 font-extrabold">Campus</th>
                    <th className="px-5 py-4 font-extrabold">Eligibility</th>
                    <th className="px-5 py-4 font-extrabold">Work integration</th>
                    <th className="px-5 py-4 font-extrabold">Status</th>
                    <th className="w-8 px-5 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtered.map((student) => (
                    <tr
                      key={student.id}
                      className={`cursor-pointer hover:bg-soft/70 ${openId === student.id ? "bg-red/5" : ""}`}
                      onClick={() => {
                        setOpenId(student.id);
                        void loadHistory(student.id);
                      }}
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-extrabold">{student.name}</p>
                        <p className="text-xs text-muted">{student.email}</p>
                      </td>
                      <td className="px-5 py-4 text-sm">{student.year || "Not set"}</td>
                      <td className="px-5 py-4 text-sm">
                        <p>{student.campusName || "Not set"}</p>
                        <p className="text-xs text-muted">{student.location}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted">{student.eligibilityStatus || "Not set"}</td>
                      <td className="px-5 py-4 text-sm text-muted">{student.workIntegrationStatus || "Not set"}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-extrabold ${STATUS_STYLES[student.status]}`}>
                          {STATUS_LABELS[student.status]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {openStudent ? (
        <aside className="flex w-[420px] shrink-0 flex-col border-l border-line bg-white">
          <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-5">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em]">{openStudent.name}</h2>
              <p className="mt-1 text-xs text-muted">{openStudent.email}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpenId(null)}
              aria-label="Close"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line hover:bg-soft"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="flex flex-wrap gap-2">
              <select
                value={openStudent.status}
                onChange={(event) => void updateStudentStatus(openStudent.id, event.target.value as StudentStatus)}
                className="h-10 rounded-lg border-2 border-line px-3 text-sm font-bold"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {openStudent.source === "sheet" ? (
                <span className="inline-flex h-10 items-center rounded-lg border border-green-200 bg-green-50 px-3 text-xs font-extrabold text-green-800">
                  Synced from Google Sheet
                </span>
              ) : null}
            </div>

            <dl className="mt-5 grid gap-4">
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Phone</dt>
                <dd className="mt-1 text-sm text-ink">{openStudent.phone || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Year of study</dt>
                <dd className="mt-1 text-sm text-ink">{openStudent.year || "Not set"}</dd>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Campus</dt>
                  <dd className="mt-1 text-sm text-ink">{openStudent.campusName || "Not set"}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Location</dt>
                  <dd className="mt-1 text-sm text-ink">{openStudent.location || "Not set"}</dd>
                </div>
              </div>
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Squad number</dt>
                <dd className="mt-1 text-sm text-ink">{openStudent.squadNumber || "Not set"}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Placements status</dt>
                <dd className="mt-1 text-sm text-ink">{openStudent.placementsStatus || "Not set"}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Eligibility status</dt>
                <dd className="mt-1 text-sm text-ink">{openStudent.eligibilityStatus || "Not set"}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Work integration status</dt>
                <dd className="mt-1 text-sm text-ink">{openStudent.workIntegrationStatus || "Not set"}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Availability for work</dt>
                <dd className="mt-1 text-sm text-ink">{openStudent.availabilityForWork || "Not set"}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Role interests</dt>
                <dd className="mt-1 text-sm text-ink">{openStudent.roleInterests.join(", ") || "Not set"}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Skills</dt>
                <dd className="mt-1 text-sm text-ink">{openStudent.skills.join(", ") || "Not set"}</dd>
              </div>
              {openStudent.resumeUrl ? (
                <div>
                  <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Resume</dt>
                  <dd className="mt-1 break-all text-sm text-red underline">
                    <a href={openStudent.resumeUrl} target="_blank" rel="noopener noreferrer">
                      {openStudent.resumeUrl}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>

            <p className="mt-7 text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">
              History across deals
            </p>
            <div className="mt-3 space-y-3">
              {history === null ? (
                <p className="text-xs text-muted">Loading...</p>
              ) : history.length === 0 ? (
                <p className="text-xs text-muted">Not associated with any deal yet.</p>
              ) : (
                history.map(({ round, deal }) => (
                  <div key={round.id} className="rounded-lg border border-line p-3">
                    <p className="text-sm font-extrabold text-ink">{deal?.companyName || "Unknown company"}</p>
                    <p className="text-xs text-muted">
                      {deal?.roleTitle || "Role not specified"} · Round {round.roundIndex + 1} · {round.status}
                    </p>
                    {round.feedback ? <p className="mt-1 text-xs text-ink">{round.feedback}</p> : null}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-line px-6 py-4">
            <button
              type="button"
              disabled={busy}
              onClick={() => void deleteStudent(openStudent.id)}
              className="h-10 w-full rounded-lg border-2 border-red/30 text-sm font-extrabold text-red disabled:opacity-50"
            >
              Remove from pool
            </button>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
