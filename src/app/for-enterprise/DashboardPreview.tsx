"use client";

import { useState } from "react";

const engineers = [
  {
    initial: "A",
    name: "A. Sharma",
    role: "Frontend Engineer",
    team: "Web Platform",
    status: "On track",
    statusClass: "text-green-700 bg-green-50",
    bar: "bg-green-500",
    barW: "w-[72%]",
    interventions: 0,
    ownership: "Your team",
    action: "Code review",
  },
  {
    initial: "R",
    name: "R. Iyer",
    role: "Backend Engineer",
    team: "Payments",
    status: "On track",
    statusClass: "text-green-700 bg-green-50",
    bar: "bg-green-500",
    barW: "w-[68%]",
    interventions: 1,
    ownership: "Your team",
    action: "Mentor sync",
  },
  {
    initial: "S",
    name: "S. Khan",
    role: "QA Engineer",
    team: "Platform QA",
    status: "Needs attention",
    statusClass: "text-orange-700 bg-orange-50",
    bar: "bg-orange-400",
    barW: "w-[44%]",
    interventions: 1,
    ownership: "KalviumX",
    action: "Plan support",
  },
  {
    initial: "K",
    name: "K. Patel",
    role: "DevOps Engineer",
    team: "Infra",
    status: "At risk",
    statusClass: "text-red-700 bg-red-50",
    bar: "bg-red-500",
    barW: "w-[28%]",
    interventions: 2,
    ownership: "KalviumX",
    action: "Escalate",
  },
];

const viewTabs = ["Engineering", "HR", "Leadership"];

export default function DashboardPreview() {
  const [activeView, setActiveView] = useState(0);

  return (
    <div className="flex flex-col lg:flex-row gap-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Left sidebar tabs */}
      <div className="lg:w-36 bg-[#0d0d0d] border-b lg:border-b-0 lg:border-r border-white/10 flex lg:flex-col flex-row">
        {viewTabs.map((v, i) => (
          <button
            key={v}
            type="button"
            onClick={() => setActiveView(i)}
            className={`flex-1 lg:flex-none px-4 py-3 text-left text-[12px] font-bold transition-colors ${
              i === activeView
                ? "bg-white/10 text-white border-l-2 border-red"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Main dashboard panel */}
      <div className="flex-1 bg-[#111] p-5 overflow-x-auto">
        {/* Cohort health row */}
        <div className="flex flex-wrap items-center gap-6 mb-5 pb-5 border-b border-white/10">
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.1em] mb-0.5">
              Active cohort
            </p>
            <p className="text-[22px] font-black text-white tracking-[-0.04em] leading-none">
              24
            </p>
            <p className="text-[10px] font-bold text-white/40 mt-0.5">Engineers</p>
          </div>
          <div className="w-px h-10 bg-white/10 hidden sm:block" />
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.1em] mb-0.5">
              On track
            </p>
            <p className="text-[22px] font-black text-green-400 tracking-[-0.04em] leading-none">
              17
            </p>
            <p className="text-[10px] font-bold text-white/40 mt-0.5">71%</p>
          </div>
          <div className="w-px h-10 bg-white/10 hidden sm:block" />
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.1em] mb-0.5">
              Needs attention
            </p>
            <p className="text-[22px] font-black text-orange-400 tracking-[-0.04em] leading-none">
              4
            </p>
            <p className="text-[10px] font-bold text-white/40 mt-0.5">17%</p>
          </div>
          <div className="w-px h-10 bg-white/10 hidden sm:block" />
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.1em] mb-0.5">
              At risk
            </p>
            <p className="text-[22px] font-black text-red tracking-[-0.04em] leading-none">
              3
            </p>
            <p className="text-[10px] font-bold text-white/40 mt-0.5">12%</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.1em] mb-0.5">
              Next review
            </p>
            <p className="text-[13px] font-bold text-white">May 24, 2026</p>
            <p className="text-[10px] text-white/40 font-medium">In 11 days</p>
          </div>
        </div>

        {/* Engineer table header */}
        <div className="grid grid-cols-[1fr_1fr_1fr_80px_80px_100px_90px] gap-3 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white/30 mb-3 px-2">
          <span>Engineer</span>
          <span>Role</span>
          <span>Workstream</span>
          <span>Progress</span>
          <span>Interventions</span>
          <span>Ownership</span>
          <span>Next action</span>
        </div>

        {/* Engineer rows */}
        <div className="space-y-2">
          {engineers.map((e) => (
            <div
              key={e.name}
              className="grid grid-cols-[1fr_1fr_1fr_80px_80px_100px_90px] gap-3 items-center bg-white/[0.03] rounded-lg px-2 py-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white/10 text-white text-[10px] font-black grid place-items-center shrink-0">
                  {e.initial}
                </span>
                <span className="text-[12px] font-semibold text-white truncate">
                  {e.name}
                </span>
              </div>
              <span className="text-[11px] font-medium text-white/60 truncate">{e.role}</span>
              <span className="text-[11px] font-medium text-white/60 truncate">{e.team}</span>
              <div className="flex flex-col gap-1">
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden w-full">
                  <div className={`h-full rounded-full ${e.bar} ${e.barW}`} />
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block ${e.statusClass}`}>
                  {e.status}
                </span>
              </div>
              <span className="text-[12px] font-bold text-white/70 text-center">{e.interventions}</span>
              <span className={`text-[11px] font-bold ${e.ownership === "KalviumX" ? "text-red" : "text-white/60"}`}>
                {e.ownership}
              </span>
              <span className="text-[11px] font-semibold text-white/50">{e.action}</span>
            </div>
          ))}
        </div>

        {/* Bottom action links */}
        <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-white/10">
          {["Intervention log", "Mentor notes", "Ownership map", "Monthly review pack"].map((l) => (
            <span
              key={l}
              className="text-[11px] font-bold text-white/40 hover:text-white/70 transition-colors cursor-pointer"
            >
              {l}
            </span>
          ))}
          <span className="ml-auto text-[11px] font-bold text-red cursor-pointer hover:text-red/80 transition-colors">
            Export report
          </span>
        </div>
      </div>
    </div>
  );
}
