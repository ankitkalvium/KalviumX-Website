"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { MeetingRecord, MeetingStatus } from "@/lib/db-meetings";

const STATUS_LABELS: Record<MeetingStatus, string> = {
  upcoming: "Upcoming",
  rescheduled: "Rescheduled",
  cancelled: "Cancelled",
  no_show: "No show",
  completed: "Completed",
};

const STATUS_STYLES: Record<MeetingStatus, string> = {
  upcoming: "border-amber-200 bg-amber-50 text-amber-800",
  rescheduled: "border-blue-200 bg-blue-50 text-blue-800",
  cancelled: "border-red/20 bg-red/5 text-red",
  no_show: "border-line bg-soft text-muted",
  completed: "border-green-200 bg-green-50 text-green-800",
};

function formatDate(value: string | null) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function MeetingsDashboard({
  meetings,
  adminEmail,
  onSignOut,
}: {
  meetings: MeetingRecord[];
  adminEmail: string;
  onSignOut?: () => Promise<void>;
}) {
  const [statusFilter, setStatusFilter] = useState<MeetingStatus | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [shareLink, setShareLink] = useState<string | null>(null);

  const filtered = statusFilter === "all" ? meetings : meetings.filter((meeting) => meeting.status === statusFilter);
  const openMeeting = meetings.find((meeting) => meeting.id === openId) ?? null;

  async function shareForm(meeting: MeetingRecord) {
    setBusy(true);
    setError("");
    setShareLink(null);
    const response = await fetch("/api/admin/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: meeting.companyName,
        contactName: meeting.contactName,
        contactEmail: meeting.contactEmail,
        roleTitle: meeting.roleTitle,
        meetingId: meeting.id,
        inboundId: meeting.inboundId,
      }),
    });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(result.error || "Could not create the hiring form.");
      return;
    }
    setShareLink(`${window.location.origin}/hiring-form/${result.deal.formToken}`);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f5]">
      <AdminSidebar adminEmail={adminEmail} onSignOut={onSignOut} />

      <main className="min-w-0 flex-1 overflow-y-auto px-6 py-8 sm:px-9">
        <header>
          <h1 className="text-3xl font-black tracking-[-0.04em] text-ink">Meetings</h1>
          <p className="mt-2 text-sm text-muted">Every Cal.com booking, mapped to the company that booked it.</p>
        </header>

        <div className="mt-5 flex flex-wrap gap-2">
          {(["all", "upcoming", "rescheduled", "no_show", "cancelled", "completed"] as const).map((status) => {
            const count = status === "all" ? meetings.length : meetings.filter((m) => m.status === status).length;
            const label = status === "all" ? "All" : STATUS_LABELS[status];
            const active = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-extrabold transition-colors ${
                  active ? "border-red bg-red/5 text-red" : "border-line text-ink hover:border-ink"
                }`}
              >
                {label} <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-line bg-white">
          {filtered.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <h2 className="text-xl font-black">No meetings yet</h2>
              <p className="mt-2 text-sm text-muted">Cal.com bookings will appear here automatically.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left">
                <thead className="border-b border-line bg-soft text-[11px] uppercase tracking-[0.1em] text-muted">
                  <tr>
                    <th className="px-5 py-4 font-extrabold">Company</th>
                    <th className="px-5 py-4 font-extrabold">Contact</th>
                    <th className="px-5 py-4 font-extrabold">Role</th>
                    <th className="px-5 py-4 font-extrabold">Status</th>
                    <th className="px-5 py-4 font-extrabold">Scheduled for</th>
                    <th className="w-8 px-5 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtered.map((meeting) => (
                    <tr
                      key={meeting.id}
                      className={`cursor-pointer hover:bg-soft/70 ${openId === meeting.id ? "bg-red/5" : ""}`}
                      onClick={() => {
                        setOpenId(meeting.id);
                        setShareLink(null);
                        setError("");
                      }}
                    >
                      <td className="px-5 py-4 font-extrabold">{meeting.companyName || "Company unconfirmed"}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold">{meeting.contactName}</p>
                        <p className="text-xs text-muted">{meeting.contactEmail}</p>
                      </td>
                      <td className="px-5 py-4 text-sm">{meeting.roleTitle || "Not specified"}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-extrabold ${STATUS_STYLES[meeting.status]}`}>
                          {STATUS_LABELS[meeting.status]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted">{formatDate(meeting.startTime)}</td>
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

      {openMeeting ? (
        <aside className="flex w-[400px] shrink-0 flex-col border-l border-line bg-white">
          <div className="flex items-start justify-between gap-3 border-b border-line px-6 py-5">
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em]">{openMeeting.companyName || "Company unconfirmed"}</h2>
              <p className="mt-1 text-xs text-muted">{openMeeting.roleTitle || "Role not specified"}</p>
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
            <p className="text-sm font-bold">{openMeeting.contactName}</p>
            <p className="text-sm text-muted">{openMeeting.contactEmail}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-extrabold ${STATUS_STYLES[openMeeting.status]}`}>
                {STATUS_LABELS[openMeeting.status]}
              </span>
            </div>

            <dl className="mt-6 grid gap-4">
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Scheduled for</dt>
                <dd className="mt-1 text-sm text-ink">{formatDate(openMeeting.startTime)}</dd>
              </div>
            </dl>

            {error ? <p className="mt-4 text-sm font-semibold text-red">{error}</p> : null}

            {shareLink ? (
              <div className="mt-6 rounded-lg border border-line bg-soft p-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">Hiring form link</p>
                <p className="mt-2 break-all text-xs text-ink">{shareLink}</p>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(shareLink)}
                  className="mt-3 h-9 w-full rounded-lg bg-ink text-xs font-extrabold text-white"
                >
                  Copy link
                </button>
              </div>
            ) : null}
          </div>

          <div className="border-t border-line px-6 py-4">
            <button
              type="button"
              disabled={busy}
              onClick={() => void shareForm(openMeeting)}
              className="h-10 w-full rounded-lg bg-red text-sm font-extrabold text-white disabled:opacity-50"
            >
              {busy ? "Creating..." : "Share hiring form"}
            </button>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
