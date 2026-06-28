"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { DEAL_STAGES, type DealRecord, type DealStage, type DealStudentRound } from "@/lib/db-deals";
import type { StudentRecord } from "@/lib/db-students";

const STAGE_LABELS: Record<DealStage, string> = {
  form_sent: "Form Sent",
  form_completed: "Form Completed",
  profiles_shared: "Profiles Shared",
  interviewing: "Interviewing",
  offer: "Offer",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

const ROUND_STATUS_LABELS: Record<string, string> = {
  shared: "Shared",
  interviewing: "Interviewing",
  selected: "Selected",
  rejected: "Rejected",
};

export default function DealsDashboard({
  deals,
  students,
  adminEmail,
  onSignOut,
}: {
  deals: DealRecord[];
  students: StudentRecord[];
  adminEmail: string;
  onSignOut?: () => Promise<void>;
}) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [rounds, setRounds] = useState<DealStudentRound[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(0);

  const openDeal = deals.find((deal) => deal.id === openId) ?? null;

  useEffect(() => {
    if (!openId) return;
    fetch(`/api/admin/deals/${openId}/rounds`)
      .then((response) => (response.ok ? response.json() : { rounds: [] }))
      .then((result) => setRounds(result.rounds ?? []))
      .catch(() => setRounds([]));
  }, [openId]);

  async function moveStage(dealId: string, stage: DealStage) {
    setBusy(true);
    setError("");
    const response = await fetch(`/api/admin/deals/${dealId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(result.error || "Could not move this deal.");
      return;
    }
    router.refresh();
  }

  async function associateStudent() {
    if (!openDeal || !selectedStudentId) return;
    setBusy(true);
    setError("");
    const response = await fetch(`/api/admin/deals/${openDeal.id}/rounds`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId: selectedStudentId, roundIndex: selectedRoundIndex }),
    });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(result.error || "Could not associate this student.");
      return;
    }
    setRounds((current) => [...current, result.round]);
    setSelectedStudentId("");
  }

  async function updateRound(roundId: string, input: { status?: string; feedback?: string }) {
    const response = await fetch(`/api/admin/deals/${openDeal?.id}/rounds/${roundId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const result = await response.json();
    if (response.ok) {
      setRounds((current) => current.map((round) => (round.id === roundId ? result.round : round)));
    }
  }

  async function removeRound(roundId: string) {
    const response = await fetch(`/api/admin/deals/${openDeal?.id}/rounds/${roundId}`, { method: "DELETE" });
    if (response.ok) {
      setRounds((current) => current.filter((round) => round.id !== roundId));
    }
  }

  function studentName(studentId: string) {
    return students.find((student) => student.id === studentId)?.name ?? "Unknown student";
  }

  function roundLabel(index: number) {
    return openDeal?.formData.rounds?.[index]?.type || `Round ${index + 1}`;
  }

  const dealsByStage = DEAL_STAGES.reduce<Record<DealStage, DealRecord[]>>((acc, stage) => {
    acc[stage] = deals.filter((deal) => deal.stage === stage);
    return acc;
  }, {} as Record<DealStage, DealRecord[]>);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f5]">
      <AdminSidebar adminEmail={adminEmail} onSignOut={onSignOut} />

      <main className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden px-6 py-8 sm:px-9">
        <header>
          <h1 className="text-3xl font-black tracking-[-0.04em] text-ink">Deals</h1>
          <p className="mt-2 text-sm text-muted">Pipeline from hiring form to closed.</p>
        </header>

        {error ? <p className="mt-4 text-sm font-semibold text-red">{error}</p> : null}

        <div className="mt-6 flex h-[calc(100%-90px)] gap-4">
          {DEAL_STAGES.map((stage) => (
            <div key={stage} className="flex w-[260px] shrink-0 flex-col rounded-xl border border-line bg-white">
              <div className="border-b border-line px-4 py-3">
                <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-muted">
                  {STAGE_LABELS[stage]} <span className="opacity-60">{dealsByStage[stage].length}</span>
                </p>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto p-3">
                {dealsByStage[stage].map((deal) => (
                  <button
                    key={deal.id}
                    type="button"
                    onClick={() => setOpenId(deal.id)}
                    className="block w-full rounded-lg border border-line bg-soft p-3 text-left hover:border-ink"
                  >
                    <p className="text-sm font-extrabold text-ink">{deal.companyName || "Company unconfirmed"}</p>
                    <p className="mt-1 text-xs text-muted">{deal.roleTitle || "Role not specified"}</p>
                    <p className="mt-1 text-xs text-muted">{deal.contactEmail}</p>
                  </button>
                ))}
                {dealsByStage[stage].length === 0 ? (
                  <p className="px-1 py-2 text-xs text-muted">No deals here yet.</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </main>

      {openDeal ? (
        <aside className="flex w-[440px] shrink-0 flex-col border-l border-line bg-white">
          <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-5">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em]">{openDeal.companyName || "Company unconfirmed"}</h2>
              <p className="mt-1 text-xs text-muted">{openDeal.roleTitle || "Role not specified"}</p>
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
            <p className="text-sm font-bold">{openDeal.contactName}</p>
            <p className="text-sm text-muted">{openDeal.contactEmail}</p>

            <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Stage</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {DEAL_STAGES.map((stage) => (
                <button
                  key={stage}
                  type="button"
                  disabled={busy}
                  onClick={() => void moveStage(openDeal.id, stage)}
                  className={`rounded-full border px-3 py-1 text-xs font-extrabold ${
                    stage === openDeal.stage ? "border-red bg-red/5 text-red" : "border-line text-ink hover:border-ink"
                  }`}
                >
                  {STAGE_LABELS[stage]}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-lg border border-line bg-soft p-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Hiring form link</p>
              <p className="mt-2 break-all text-xs text-ink">
                {typeof window !== "undefined" ? `${window.location.origin}/hiring-form/${openDeal.formToken}` : ""}
              </p>
              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(`${window.location.origin}/hiring-form/${openDeal.formToken}`)
                }
                className="mt-3 h-9 w-full rounded-lg bg-ink text-xs font-extrabold text-white"
              >
                Copy link
              </button>
            </div>

            <dl className="mt-6 grid gap-4">
              {openDeal.formData.jdUrl ? (
                <div>
                  <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">JD</dt>
                  <dd className="mt-1 break-all text-sm text-red underline">
                    <a href={openDeal.formData.jdUrl} target="_blank" rel="noopener noreferrer">
                      {openDeal.formData.jdUrl}
                    </a>
                  </dd>
                </div>
              ) : null}
              {openDeal.formData.expectations ? (
                <div>
                  <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Expectations</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm text-ink">{openDeal.formData.expectations}</dd>
                </div>
              ) : null}
              {openDeal.formData.compensationRange ? (
                <div>
                  <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Compensation</dt>
                  <dd className="mt-1 text-sm text-ink">{openDeal.formData.compensationRange}</dd>
                </div>
              ) : null}
              {openDeal.formData.rounds?.length ? (
                <div>
                  <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Interview rounds</dt>
                  <dd className="mt-1 space-y-1 text-sm text-ink">
                    {openDeal.formData.rounds.map((round, index) => (
                      <p key={index}>
                        {index + 1}. {round.type}
                        {round.notes ? `: ${round.notes}` : ""}
                      </p>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>

            <p className="mt-7 text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">
              Associate a student
            </p>
            <div className="mt-2 flex gap-2">
              <select
                value={selectedRoundIndex}
                onChange={(event) => setSelectedRoundIndex(Number(event.target.value))}
                className="h-10 rounded-lg border-2 border-line px-2 text-xs font-bold"
              >
                {Array.from({ length: Math.max(1, openDeal.formData.rounds?.length ?? 1) }, (_, index) => (
                  <option key={index} value={index}>
                    {roundLabel(index)}
                  </option>
                ))}
              </select>
              <select
                value={selectedStudentId}
                onChange={(event) => setSelectedStudentId(event.target.value)}
                className="h-10 flex-1 rounded-lg border-2 border-line px-2 text-xs font-bold"
              >
                <option value="">Select a student...</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={busy || !selectedStudentId}
                onClick={() => void associateStudent()}
                className="h-10 rounded-lg bg-red px-3 text-xs font-extrabold text-white disabled:opacity-50"
              >
                Add
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {rounds.map((round) => (
                <div key={round.id} className="rounded-lg border border-line p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-extrabold text-ink">{studentName(round.studentId)}</p>
                      <p className="text-xs text-muted">{roundLabel(round.roundIndex)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void removeRound(round.id)}
                      aria-label="Remove"
                      className="text-xs font-bold text-muted hover:text-red"
                    >
                      Remove
                    </button>
                  </div>
                  <select
                    value={round.status}
                    onChange={(event) => void updateRound(round.id, { status: event.target.value })}
                    className="mt-2 h-9 w-full rounded-lg border-2 border-line px-2 text-xs font-bold"
                  >
                    {Object.entries(ROUND_STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <textarea
                    defaultValue={round.feedback ?? ""}
                    onBlur={(event) => void updateRound(round.id, { feedback: event.target.value })}
                    placeholder="Feedback for this student in this round"
                    rows={2}
                    className="mt-2 w-full resize-none rounded-lg border-2 border-line px-2 py-1.5 text-xs"
                  />
                </div>
              ))}
              {rounds.length === 0 ? <p className="text-xs text-muted">No students associated yet.</p> : null}
            </div>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
