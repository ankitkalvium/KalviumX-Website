"use client";

import { useState } from "react";
import Image from "next/image";
import type { DealRecord, DealRound } from "@/lib/repo/deals";

export default function HiringForm({ deal }: { deal: DealRecord }) {
  const [companyName, setCompanyName] = useState(deal.companyName);
  const [contactName, setContactName] = useState(deal.contactName);
  const [roleTitle, setRoleTitle] = useState(deal.roleTitle);
  const [jdUrl, setJdUrl] = useState(deal.formData.jdUrl ?? "");
  const [roundsCount, setRoundsCount] = useState(deal.formData.rounds?.length ?? deal.formData.roundsCount ?? 0);
  const [rounds, setRounds] = useState<DealRound[]>(deal.formData.rounds ?? []);
  const [expectations, setExpectations] = useState(deal.formData.expectations ?? "");
  const [dealbreakers, setDealbreakers] = useState(deal.formData.dealbreakers ?? "");
  const [headcount, setHeadcount] = useState(deal.formData.headcount ?? "");
  const [compensationType, setCompensationType] = useState(deal.formData.compensationType ?? "");
  const [compensationRange, setCompensationRange] = useState(deal.formData.compensationRange ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(deal.stage !== "form_sent");

  function setRoundsCountAndResize(count: number) {
    setRoundsCount(count);
    setRounds((current) => {
      const next = [...current];
      while (next.length < count) next.push({ type: "" });
      return next.slice(0, count);
    });
  }

  function updateRound(index: number, patch: Partial<DealRound>) {
    setRounds((current) => current.map((round, i) => (i === index ? { ...round, ...patch } : round)));
  }

  async function submit() {
    setBusy(true);
    setError("");
    const response = await fetch(`/api/hiring-form/${deal.formToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName,
        contactName,
        roleTitle,
        jdUrl,
        roundsCount,
        rounds,
        expectations,
        dealbreakers,
        headcount,
        compensationType,
        compensationRange,
      }),
    });
    const result = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(result.error || "Could not submit this form.");
      return;
    }
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Image
          src="/images/brand/logo-primary.png"
          alt="KalviumX"
          width={150}
          height={28}
          priority
          className="h-7 w-auto"
        />

        <h1 className="mt-7 text-3xl font-black tracking-[-0.04em] text-ink">Hiring details</h1>
        <p className="mt-2 text-sm text-muted">
          A few details about the role so we can prepare the right shortlist. Edit anything that&apos;s already filled in.
        </p>

        {submitted ? (
          <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-900">
            Submitted. You can still update anything below and resubmit if details change.
          </div>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-lg border border-red/20 bg-red/5 px-4 py-2.5 text-sm font-semibold text-red">
            {error}
          </p>
        ) : null}

        <div className="mt-6 grid gap-5 rounded-xl border border-line bg-white p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-wide text-muted">Company</span>
              <input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                className="mt-1.5 h-11 w-full rounded-lg border-2 border-line px-3 text-sm outline-none focus:border-red"
              />
            </label>
            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-wide text-muted">Your name</span>
              <input
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                className="mt-1.5 h-11 w-full rounded-lg border-2 border-line px-3 text-sm outline-none focus:border-red"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-extrabold uppercase tracking-wide text-muted">Role title</span>
            <input
              value={roleTitle}
              onChange={(event) => setRoleTitle(event.target.value)}
              placeholder="e.g. Backend Engineering Intern"
              className="mt-1.5 h-11 w-full rounded-lg border-2 border-line px-3 text-sm outline-none focus:border-red"
            />
          </label>

          <label className="block">
            <span className="text-xs font-extrabold uppercase tracking-wide text-muted">JD link</span>
            <input
              value={jdUrl}
              onChange={(event) => setJdUrl(event.target.value)}
              placeholder="Paste a link to the job description (Drive, Notion, etc.)"
              className="mt-1.5 h-11 w-full rounded-lg border-2 border-line px-3 text-sm outline-none focus:border-red"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-wide text-muted">Headcount</span>
              <input
                value={headcount}
                onChange={(event) => setHeadcount(event.target.value)}
                placeholder="e.g. 2-3"
                className="mt-1.5 h-11 w-full rounded-lg border-2 border-line px-3 text-sm outline-none focus:border-red"
              />
            </label>
            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-wide text-muted">Number of interview rounds</span>
              <input
                type="number"
                min={0}
                max={20}
                value={roundsCount}
                onChange={(event) => setRoundsCountAndResize(Math.max(0, Number(event.target.value)))}
                className="mt-1.5 h-11 w-full rounded-lg border-2 border-line px-3 text-sm outline-none focus:border-red"
              />
            </label>
          </div>

          {rounds.length > 0 ? (
            <div className="grid gap-3 rounded-lg border border-line bg-soft p-4">
              <span className="text-xs font-extrabold uppercase tracking-wide text-muted">Round breakdown</span>
              {rounds.map((round, index) => (
                <div key={index} className="grid gap-2 sm:grid-cols-[1fr_2fr]">
                  <input
                    value={round.type}
                    onChange={(event) => updateRound(index, { type: event.target.value })}
                    placeholder={`Round ${index + 1} type (e.g. Technical screen)`}
                    className="h-10 rounded-lg border-2 border-line px-3 text-sm outline-none focus:border-red"
                  />
                  <input
                    value={round.notes ?? ""}
                    onChange={(event) => updateRound(index, { notes: event.target.value })}
                    placeholder="Notes (optional)"
                    className="h-10 rounded-lg border-2 border-line px-3 text-sm outline-none focus:border-red"
                  />
                </div>
              ))}
            </div>
          ) : null}

          <label className="block">
            <span className="text-xs font-extrabold uppercase tracking-wide text-muted">
              What does success look like in this role?
            </span>
            <textarea
              rows={3}
              value={expectations}
              onChange={(event) => setExpectations(event.target.value)}
              className="mt-1.5 w-full resize-none rounded-lg border-2 border-line px-3 py-2.5 text-sm outline-none focus:border-red"
            />
          </label>

          <label className="block">
            <span className="text-xs font-extrabold uppercase tracking-wide text-muted">Dealbreakers</span>
            <textarea
              rows={3}
              value={dealbreakers}
              onChange={(event) => setDealbreakers(event.target.value)}
              placeholder="Gaps or red flags that would rule a candidate out"
              className="mt-1.5 w-full resize-none rounded-lg border-2 border-line px-3 py-2.5 text-sm outline-none focus:border-red"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-wide text-muted">Compensation type</span>
              <select
                value={compensationType}
                onChange={(event) => setCompensationType(event.target.value)}
                className="mt-1.5 h-11 w-full rounded-lg border-2 border-line px-3 text-sm outline-none focus:border-red"
              >
                <option value="">Select...</option>
                <option value="stipend">Stipend (internship)</option>
                <option value="ctc">Full-time</option>
                <option value="either">Open to either</option>
                <option value="deciding">Still deciding</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-wide text-muted">Range</span>
              <input
                value={compensationRange}
                onChange={(event) => setCompensationRange(event.target.value)}
                placeholder="e.g. ₹35k-50k per month"
                className="mt-1.5 h-11 w-full rounded-lg border-2 border-line px-3 text-sm outline-none focus:border-red"
              />
            </label>
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={() => void submit()}
            className="h-12 rounded-lg bg-red text-sm font-extrabold text-white disabled:opacity-50"
          >
            {busy ? "Submitting..." : submitted ? "Update details" : "Submit"}
          </button>
        </div>
      </div>
    </main>
  );
}
