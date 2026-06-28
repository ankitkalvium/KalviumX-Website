"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { OpportunityRecord, ReviewStatus } from "@/lib/opportunity-types";

const PAGE_SIZE = 10;

const STATUS_STYLES: Record<ReviewStatus, string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  reviewed: "bg-green-50 text-green-800 border-green-200",
  rejected: "bg-red/5 text-red border-red/20",
};

const STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: "Pending review",
  reviewed: "Reviewed",
  rejected: "Rejected",
};

const ALIGNMENT_STYLES: Record<"Green" | "Yellow" | "Red", string> = {
  Green: "bg-green-50 text-green-800 border-green-200",
  Yellow: "bg-amber-50 text-amber-800 border-amber-200",
  Red: "bg-red/5 text-red border-red/20",
};

const COMPENSATION_MODE_LABELS: Record<string, string> = {
  stipend: "Stipend (internship)",
  ctc: "Full-time",
  either: "Open to either",
  deciding: "Still deciding",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

// Deterministic, template-built from the actual form answers — not an AI
// call — so it never hallucinates and works even without a Gemini key
// configured.
function buildSummary(focused: OpportunityRecord): string {
  const company = focused.companyName || "This company";
  const data = focused.data;
  const sentences: string[] = [];

  const headcountPhrase = data.headcount ? `${data.headcount} hire${data.headcount === "1" ? "" : "s"}` : "an unspecified number of hires";
  const rolePhrase = focused.roleTitle || "an engineering role";
  const skillsPhrase = data.skills ? ` comfortable with ${data.skills}` : "";
  sentences.push(`${company} is looking for ${headcountPhrase} for ${rolePhrase}${skillsPhrase}.`);

  const compParts: string[] = [];
  if (data.compensationType) compParts.push(COMPENSATION_MODE_LABELS[data.compensationType]);
  if (data.compensationRange) compParts.push(data.compensationRange);
  const barPhrase = data.expectations || data.dealbreakers;
  if (compParts.length || barPhrase) {
    const compSentence = compParts.length ? `Compensation is ${compParts.join(", ")}` : "";
    const barSentence = barPhrase
      ? `${compParts.length ? "and the" : "The"} bar for interviews centers on ${barPhrase}`
      : "";
    sentences.push(`${compSentence}${compSentence && barSentence ? ", " : ""}${barSentence}.`);
  }

  return sentences.join(" ");
}

function Detail({ label, value }: { label: string; value?: string }) {
  if (!value?.trim()) return null;
  return (
    <div>
      <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-ink">{value.trim()}</dd>
    </div>
  );
}

function Chip({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "green" | "amber" | "red" }) {
  const toneClass = {
    neutral: "border-line bg-soft text-ink",
    green: "border-green-200 bg-green-50 text-green-800",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    red: "border-red/20 bg-red/5 text-red",
  }[tone];
  return (
    <span className={`inline-flex max-w-full flex-col items-start gap-0.5 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-bold leading-tight ${toneClass}`}>
      <span className="text-[9px] font-extrabold uppercase tracking-[0.08em] opacity-60">{label}</span>
      <span className="truncate">{value}</span>
    </span>
  );
}

function pageWindow(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push("ellipsis");
    result.push(page);
  });
  return result;
}

export default function OpportunitiesDashboard({
  opportunities,
  adminEmail,
  onSignOut,
}: {
  opportunities: OpportunityRecord[];
  adminEmail: string;
  onSignOut?: () => Promise<void>;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openId, setOpenId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "all">("all");

  const filtered =
    statusFilter === "all" ? opportunities : opportunities.filter((opportunity) => opportunity.status === statusFilter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const openOpportunity = opportunities.find((opportunity) => opportunity.id === openId) ?? null;
  const allOnPageSelected = pageItems.length > 0 && pageItems.every((opportunity) => selected.has(opportunity.id));

  function selectStatusFilter(next: ReviewStatus | "all") {
    setStatusFilter(next);
    setPage(1);
  }

  function toggleOne(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllOnPage() {
    setSelected((current) => {
      const next = new Set(current);
      for (const opportunity of pageItems) {
        if (allOnPageSelected) next.delete(opportunity.id);
        else next.add(opportunity.id);
      }
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  async function bulkUpdate(status: "reviewed" | "rejected") {
    const ids = [...selected];
    if (!ids.length) return;
    const rejectionReason =
      status === "rejected"
        ? window.prompt(`Reason for rejecting ${ids.length} selected opportunit${ids.length === 1 ? "y" : "ies"}?`)?.trim()
        : undefined;
    if (status === "rejected" && !rejectionReason) return;

    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/opportunities/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, status, rejectionReason }),
    });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(result.error || "Could not update the selected opportunities.");
      return;
    }
    clearSelection();
    router.refresh();
  }

  async function bulkDelete() {
    const ids = [...selected];
    if (!ids.length) return;
    if (!window.confirm(`Delete ${ids.length} selected opportunit${ids.length === 1 ? "y" : "ies"}? This cannot be undone.`)) {
      return;
    }
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/opportunities/bulk", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(result.error || "Could not delete the selected opportunities.");
      return;
    }
    if (openId && ids.includes(openId)) setOpenId(null);
    clearSelection();
    router.refresh();
  }

  async function singleUpdate(id: string, status: "reviewed" | "rejected") {
    const rejectionReason =
      status === "rejected" ? window.prompt("Why is this opportunity being rejected?")?.trim() : undefined;
    if (status === "rejected" && !rejectionReason) return;

    setBusy(true);
    setError("");
    const response = await fetch(`/api/admin/opportunities/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, rejectionReason }),
    });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(result.error || "Could not update this opportunity.");
      return;
    }
    router.refresh();
  }

  async function singleDelete(id: string) {
    if (!window.confirm("Delete this opportunity? This cannot be undone.")) return;
    setBusy(true);
    setError("");
    const response = await fetch(`/api/admin/opportunities/${id}`, { method: "DELETE" });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(result.error || "Could not delete this opportunity.");
      return;
    }
    setOpenId(null);
    setSelected((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
    router.refresh();
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f5]">
      <AdminSidebar adminEmail={adminEmail} onSignOut={onSignOut} />

      <main className="min-w-0 flex-1 overflow-y-auto px-6 py-8 sm:px-9">
        <header>
          <h1 className="text-3xl font-black tracking-[-0.04em] text-ink">Inbounds</h1>
          <p className="mt-2 text-sm text-muted">Review and evaluate hiring-role submissions captured by Kal.</p>
        </header>

        <div className="mt-5 flex flex-wrap gap-2">
          {(["all", "pending", "reviewed", "rejected"] as const).map((status) => {
            const count = status === "all" ? opportunities.length : opportunities.filter((o) => o.status === status).length;
            const label = status === "all" ? "All" : STATUS_LABELS[status];
            const active = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => selectStatusFilter(status)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition-colors ${
                  active ? "border-red bg-red/5 text-red" : "border-line text-ink hover:border-ink"
                }`}
              >
                {label} <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        {error ? (
          <p className="mt-4 rounded-lg border border-red/20 bg-red/5 px-4 py-2.5 text-sm font-semibold text-red">
            {error}
          </p>
        ) : null}

        {selected.size > 0 ? (
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white px-4 py-3">
            <span className="text-sm font-extrabold text-ink">{selected.size} selected</span>
            <button
              type="button"
              disabled={busy}
              onClick={() => void bulkUpdate("reviewed")}
              className="h-9 rounded-lg bg-red px-3.5 text-xs font-extrabold text-white disabled:opacity-50"
            >
              Mark reviewed
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void bulkUpdate("rejected")}
              className="h-9 rounded-lg border-2 border-ink px-3.5 text-xs font-extrabold disabled:opacity-50"
            >
              Reject
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void bulkDelete()}
              className="h-9 rounded-lg border-2 border-red/30 px-3.5 text-xs font-extrabold text-red disabled:opacity-50"
            >
              Delete
            </button>
            <button type="button" onClick={clearSelection} className="ml-auto text-xs font-bold text-muted hover:text-ink">
              Clear selection
            </button>
          </div>
        ) : null}

        <div className="mt-5 overflow-hidden rounded-xl border border-line bg-white">
          {filtered.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <h2 className="text-xl font-black">
                {opportunities.length === 0 ? "No inbounds yet" : "No inbounds match this filter"}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {opportunities.length === 0
                  ? "Started KAL AI conversations will appear here immediately."
                  : "Try a different status filter."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[960px] text-left">
                  <thead className="border-b border-line bg-soft text-[11px] uppercase tracking-[0.1em] text-muted">
                    <tr>
                      <th className="w-10 px-5 py-4">
                        <input
                          type="checkbox"
                          checked={allOnPageSelected}
                          onChange={toggleAllOnPage}
                          aria-label="Select all on this page"
                          className="h-4 w-4 accent-red"
                        />
                      </th>
                      <th className="px-2 py-4 font-extrabold">Company</th>
                      <th className="px-5 py-4 font-extrabold">Role</th>
                      <th className="px-5 py-4 font-extrabold">Contact</th>
                      <th className="px-5 py-4 font-extrabold">Alignment</th>
                      <th className="px-5 py-4 font-extrabold">Status</th>
                      <th className="px-5 py-4 font-extrabold">Received</th>
                      <th className="w-8 px-5 py-4" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {pageItems.map((opportunity) => (
                      <tr
                        key={opportunity.id}
                        className={`cursor-pointer hover:bg-soft/70 ${openId === opportunity.id ? "bg-red/5" : ""}`}
                        onClick={() => setOpenId(opportunity.id)}
                      >
                        <td className="px-5 py-4" onClick={(event) => event.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selected.has(opportunity.id)}
                            onChange={() => toggleOne(opportunity.id)}
                            aria-label={`Select ${opportunity.companyName || "opportunity"}`}
                            className="h-4 w-4 accent-red"
                          />
                        </td>
                        <td className="px-2 py-4 font-extrabold">
                          {opportunity.companyName || "Company unconfirmed"}
                        </td>
                        <td className="px-5 py-4 text-sm">{opportunity.roleTitle || "Not answered"}</td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-bold">{opportunity.contactName}</p>
                          <p className="text-xs text-muted">{opportunity.email}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-extrabold ${ALIGNMENT_STYLES[opportunity.alignment]}`}>
                            {opportunity.alignment}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-extrabold ${STATUS_STYLES[opportunity.status]}`}>
                            {STATUS_LABELS[opportunity.status]}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-muted">{formatDate(opportunity.createdAt)}</td>
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

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4 text-sm">
                <span className="text-muted">
                  Showing {(safePage - 1) * PAGE_SIZE + 1} to {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
                  {filtered.length} submissions
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-line disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  {pageWindow(safePage, totalPages).map((entry, index) =>
                    entry === "ellipsis" ? (
                      <span key={`ellipsis-${index}`} className="px-1 text-muted">
                        ...
                      </span>
                    ) : (
                      <button
                        key={entry}
                        type="button"
                        onClick={() => setPage(entry)}
                        className={`grid h-8 w-8 place-items-center rounded-lg border text-xs font-extrabold ${
                          entry === safePage ? "border-red text-red" : "border-line text-ink hover:border-ink"
                        }`}
                      >
                        {entry}
                      </button>
                    ),
                  )}
                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-line disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {openOpportunity ? (
        <aside className="flex w-[420px] shrink-0 flex-col border-l border-line bg-white">
          <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-5">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em]">
                {openOpportunity.companyName || "Company unconfirmed"}
              </h2>
              <p className="mt-1 text-xs text-muted">{openOpportunity.roleTitle || "Requirement in progress"}</p>
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
            <p className="text-sm font-bold">{openOpportunity.contactName}</p>
            <p className="text-sm text-muted">{openOpportunity.email}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Chip
                label="Status"
                value={STATUS_LABELS[openOpportunity.status]}
                tone={openOpportunity.status === "rejected" ? "red" : openOpportunity.status === "reviewed" ? "green" : "amber"}
              />
              <Chip
                label="Alignment"
                value={openOpportunity.alignment}
                tone={openOpportunity.alignment === "Red" ? "red" : openOpportunity.alignment === "Green" ? "green" : "amber"}
              />
              {openOpportunity.data.headcount ? <Chip label="Headcount" value={openOpportunity.data.headcount} /> : null}
              {openOpportunity.data.compensationType ? (
                <Chip label="Mode" value={COMPENSATION_MODE_LABELS[openOpportunity.data.compensationType]} />
              ) : null}
              {openOpportunity.data.compensationRange ? (
                <Chip label="Comp" value={openOpportunity.data.compensationRange} />
              ) : null}
            </div>

            <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Summary</p>
            <p className="mt-2 text-sm leading-6 text-ink">{buildSummary(openOpportunity)}</p>

            <dl className="mt-6 grid gap-5">
              <Detail label="Skills" value={openOpportunity.data.skills} />
              <Detail label="Must demonstrate" value={openOpportunity.data.expectations} />
              <Detail label="Dealbreakers" value={openOpportunity.data.dealbreakers} />
              <Detail label="Common interview gaps" value={openOpportunity.data.interviewGaps} />
              <Detail
                label="Post-interview readiness"
                value={openOpportunity.data.readinessCustom || openOpportunity.data.readinessPreference}
              />
              <Detail label="Alignment notes" value={openOpportunity.data.alignmentNotes} />
            </dl>


            {openOpportunity.rejectionReason ? (
              <div className="mt-4 rounded-lg border border-red/20 bg-red/5 p-4 text-sm text-red">
                <strong>Rejection reason:</strong> {openOpportunity.rejectionReason}
              </div>
            ) : null}

            <p className="mt-7 text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Conversation</p>
            <div className="mt-3 space-y-3">
              {openOpportunity.transcript.map((message, index) => (
                <div key={index}>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted">
                    {message.role === "assistant" ? "Kal" : openOpportunity.contactName}
                  </p>
                  <p className="mt-1 rounded-lg bg-soft px-3 py-2.5 text-sm leading-5">{message.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 border-t border-line px-6 py-4">
            {openOpportunity.status === "pending" ? (
              <>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void singleUpdate(openOpportunity.id, "reviewed")}
                  className="h-10 flex-1 rounded-lg bg-red text-sm font-extrabold text-white disabled:opacity-50"
                >
                  Mark reviewed
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void singleUpdate(openOpportunity.id, "rejected")}
                  className="h-10 flex-1 rounded-lg border-2 border-ink text-sm font-extrabold disabled:opacity-50"
                >
                  Reject
                </button>
              </>
            ) : null}
            <button
              type="button"
              disabled={busy}
              onClick={() => void singleDelete(openOpportunity.id)}
              className="h-10 rounded-lg border-2 border-red/30 px-3 text-sm font-extrabold text-red disabled:opacity-50"
              aria-label="Delete opportunity"
            >
              Delete
            </button>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
