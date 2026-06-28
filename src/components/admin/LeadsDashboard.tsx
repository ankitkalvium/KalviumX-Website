"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { LeadRecord, LeadStatus } from "@/lib/lead-types";

const PAGE_SIZE = 10;

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-amber-50 text-amber-800 border-amber-200",
  contacted: "bg-green-50 text-green-800 border-green-200",
};

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
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

export default function LeadsDashboard({
  leads,
  adminEmail,
  onSignOut,
}: {
  leads: LeadRecord[];
  adminEmail: string;
  onSignOut?: () => Promise<void>;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openId, setOpenId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");

  const filtered = statusFilter === "all" ? leads : leads.filter((lead) => lead.status === statusFilter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const openLead = leads.find((lead) => lead.id === openId) ?? null;
  const allOnPageSelected = pageItems.length > 0 && pageItems.every((lead) => selected.has(lead.id));

  function selectStatusFilter(next: LeadStatus | "all") {
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
      for (const lead of pageItems) {
        if (allOnPageSelected) next.delete(lead.id);
        else next.add(lead.id);
      }
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  async function bulkUpdate(status: LeadStatus) {
    const ids = [...selected];
    if (!ids.length) return;
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/leads/bulk", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, status }),
    });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(result.error || "Could not update the selected leads.");
      return;
    }
    clearSelection();
    router.refresh();
  }

  async function bulkDelete() {
    const ids = [...selected];
    if (!ids.length) return;
    if (!window.confirm(`Delete ${ids.length} selected lead${ids.length === 1 ? "" : "s"}? This cannot be undone.`)) {
      return;
    }
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/leads/bulk", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(result.error || "Could not delete the selected leads.");
      return;
    }
    if (openId && ids.includes(openId)) setOpenId(null);
    clearSelection();
    router.refresh();
  }

  async function singleUpdate(id: string, status: LeadStatus) {
    setBusy(true);
    setError("");
    const response = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(result.error || "Could not update this lead.");
      return;
    }
    router.refresh();
  }

  async function singleDelete(id: string) {
    if (!window.confirm("Delete this lead? This cannot be undone.")) return;
    setBusy(true);
    setError("");
    const response = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(result.error || "Could not delete this lead.");
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
          <h1 className="text-3xl font-black tracking-[-0.04em] text-ink">Hiring Interest</h1>
          <p className="mt-2 text-sm text-muted">Leads captured by the Share Your JD form, mirrored from Zoho.</p>
        </header>

        <div className="mt-5 flex flex-wrap gap-2">
          {(["all", "new", "contacted"] as const).map((status) => {
            const count = status === "all" ? leads.length : leads.filter((l) => l.status === status).length;
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
              onClick={() => void bulkUpdate("contacted")}
              className="h-9 rounded-lg bg-red px-3.5 text-xs font-extrabold text-white disabled:opacity-50"
            >
              Mark contacted
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
                {leads.length === 0 ? "No hiring interest yet" : "No leads match this filter"}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {leads.length === 0
                  ? "Submissions from the Share Your JD form will appear here immediately."
                  : "Try a different status filter."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
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
                      <th className="px-2 py-4 font-extrabold">Name</th>
                      <th className="px-5 py-4 font-extrabold">Company</th>
                      <th className="px-5 py-4 font-extrabold">Role</th>
                      <th className="px-5 py-4 font-extrabold">Status</th>
                      <th className="px-5 py-4 font-extrabold">Received</th>
                      <th className="w-8 px-5 py-4" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {pageItems.map((lead) => (
                      <tr
                        key={lead.id}
                        className={`cursor-pointer hover:bg-soft/70 ${openId === lead.id ? "bg-red/5" : ""}`}
                        onClick={() => setOpenId(lead.id)}
                      >
                        <td className="px-5 py-4" onClick={(event) => event.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selected.has(lead.id)}
                            onChange={() => toggleOne(lead.id)}
                            aria-label={`Select ${lead.firstName || "lead"}`}
                            className="h-4 w-4 accent-red"
                          />
                        </td>
                        <td className="px-2 py-4">
                          <p className="font-extrabold">{lead.firstName} {lead.lastName}</p>
                          <p className="text-xs text-muted">{lead.email}</p>
                        </td>
                        <td className="px-5 py-4 text-sm">{lead.company || "Unknown"}</td>
                        <td className="px-5 py-4 text-sm">{lead.role || "Not specified"}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-extrabold ${STATUS_STYLES[lead.status]}`}>
                            {STATUS_LABELS[lead.status]}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-muted">{formatDate(lead.createdAt)}</td>
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
                  {filtered.length} leads
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

      {openLead ? (
        <aside className="flex w-[420px] shrink-0 flex-col border-l border-line bg-white">
          <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-5">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em]">
                {openLead.firstName} {openLead.lastName}
              </h2>
              <p className="mt-1 text-xs text-muted">{openLead.email}</p>
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
              <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-extrabold ${STATUS_STYLES[openLead.status]}`}>
                {STATUS_LABELS[openLead.status]}
              </span>
            </div>

            <dl className="mt-6 grid gap-5">
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Company domain</dt>
                <dd className="mt-1 text-sm leading-6 text-ink">{openLead.company || "Unknown"}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Role or stack</dt>
                <dd className="mt-1 text-sm leading-6 text-ink">{openLead.role || "Not specified"}</dd>
              </div>
              {openLead.brief ? (
                <div>
                  <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Brief</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-ink">{openLead.brief}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Source</dt>
                <dd className="mt-1 text-sm leading-6 text-ink">{openLead.source}</dd>
              </div>
              {openLead.zohoId ? (
                <div>
                  <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Zoho lead ID</dt>
                  <dd className="mt-1 text-sm leading-6 text-ink">{openLead.zohoId}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="flex gap-2 border-t border-line px-6 py-4">
            {openLead.status === "new" ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => void singleUpdate(openLead.id, "contacted")}
                className="h-10 flex-1 rounded-lg bg-red text-sm font-extrabold text-white disabled:opacity-50"
              >
                Mark contacted
              </button>
            ) : (
              <button
                type="button"
                disabled={busy}
                onClick={() => void singleUpdate(openLead.id, "new")}
                className="h-10 flex-1 rounded-lg border-2 border-ink text-sm font-extrabold disabled:opacity-50"
              >
                Mark new
              </button>
            )}
            <button
              type="button"
              disabled={busy}
              onClick={() => void singleDelete(openLead.id)}
              className="h-10 rounded-lg border-2 border-red/30 px-3 text-sm font-extrabold text-red disabled:opacity-50"
              aria-label="Delete lead"
            >
              Delete
            </button>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
