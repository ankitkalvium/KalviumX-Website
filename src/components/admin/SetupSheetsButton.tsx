"use client";

import { useState } from "react";

interface TabResult {
  tab: string;
  ok: boolean;
  error?: string;
}

export default function SetupSheetsButton() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [results, setResults] = useState<TabResult[]>([]);

  async function run() {
    setState("loading");
    try {
      const res = await fetch("/api/admin/setup-sheets", { method: "POST" });
      const data = (await res.json()) as { ok: boolean; results: TabResult[] };
      setResults(data.results ?? []);
      setState(data.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="rounded-xl border border-line bg-white p-6">
      <h2 className="text-lg font-black">Google Sheets setup</h2>
      <p className="mt-1 text-sm text-muted">
        Creates all required tabs with header rows in your spreadsheet. Safe to run more than once.
        Existing tabs and their data are never overwritten.
      </p>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={run}
          disabled={state === "loading"}
          className="rounded-lg bg-red px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-50"
        >
          {state === "loading" ? "Setting up..." : "Set up all tabs"}
        </button>
        {state === "done" && <span className="text-sm font-bold text-green-700">All tabs ready</span>}
        {state === "error" && <span className="text-sm font-bold text-red">Some tabs failed. See details below.</span>}
      </div>

      {results.length > 0 && (
        <ul className="mt-5 space-y-2">
          {results.map((r) => (
            <li key={r.tab} className="flex items-start gap-3 text-sm">
              <span className={r.ok ? "text-green-600" : "text-red"}>{r.ok ? "✓" : "✗"}</span>
              <span className="font-bold">{r.tab}</span>
              {r.error && <span className="text-muted">{r.error}</span>}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 border-t border-line pt-5">
        <h3 className="text-sm font-extrabold">Tabs that will be created</h3>
        <ul className="mt-3 grid grid-cols-2 gap-1 text-sm text-muted sm:grid-cols-3">
          {["Leads", "Meetings", "AdminUsers", "Students", "Deals", "DealStudentRounds", "Opportunities"].map((t) => (
            <li key={t} className="font-mono">{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
