"use client";

import React, { useState } from "react";

// ── Stakeholder tab icons ──────────────────────────────────────────────────
const EngineeringIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const HRIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const FinanceIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a9 9 0 1 0 9 9h-9V3Z" />
    <path d="M15 3.5A9 9 0 0 1 20.5 9H15V3.5Z" />
  </svg>
);

// ── Need card icons ────────────────────────────────────────────────────────
const TargetIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);

const ZapIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const BarChartIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const SyncIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const FileTextIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CoinsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);

const PieChartIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
);

// ── Data ───────────────────────────────────────────────────────────────────
type NeedItem = {
  Icon: () => React.ReactElement;
  title: string;
  desc: string;
};

type Stakeholder = {
  id: string;
  label: string;
  Icon: () => React.ReactElement;
  question: string;
  answer: string;
  needs: NeedItem[];
};

const stakeholders: Stakeholder[] = [
  {
    id: "engineering",
    label: "Engineering Leader",
    Icon: EngineeringIcon,
    question: "Will this reduce management load without lowering output quality?",
    answer:
      "Yes. You own the work and outcomes. KalviumX provides the support system: mentors, interventions, and visibility, so your managers can stay focused on delivery.",
    needs: [
      {
        Icon: TargetIcon,
        title: "Work ownership",
        desc: "My team defines the work. Engineers are embedded in our product teams.",
      },
      {
        Icon: ZapIcon,
        title: "Intervention path",
        desc: "Clear mentor escalation when engineers are blocked. Resolved fast.",
      },
      {
        Icon: BarChartIcon,
        title: "Reporting visibility",
        desc: "Real-time view of output, progress, and intervention history.",
      },
    ],
  },
  {
    id: "hr",
    label: "HR / Workforce",
    Icon: HRIcon,
    question: "How does this fit within our workforce model and headcount policy?",
    answer:
      "KalviumX engineers are structured as interns or apprentices, not permanent headcount. The engagement model is designed to fit within standard workforce frameworks with full compliance documentation.",
    needs: [
      {
        Icon: ClipboardIcon,
        title: "Governed model",
        desc: "Defined engagement structure that fits our internal workforce classification.",
      },
      {
        Icon: EyeIcon,
        title: "Workforce visibility",
        desc: "Clear view of who is deployed, their status, and their development stage.",
      },
      {
        Icon: SyncIcon,
        title: "Consistent experience",
        desc: "A standardised onboarding, review, and offboarding process across cohorts.",
      },
    ],
  },
  {
    id: "legal",
    label: "Legal / Procurement",
    Icon: ShieldIcon,
    question: "What are our IP, data, and contractual risk exposures?",
    answer:
      "IP belongs to your company. Data access is provisioned per your standard security policy. Contracts include clear exit terms and unambiguous IP assignment clauses.",
    needs: [
      {
        Icon: FileTextIcon,
        title: "Clear agreements",
        desc: "IP assignment, data handling, and engagement terms available before sign-off.",
      },
      {
        Icon: ShieldIcon,
        title: "Risk controls",
        desc: "Access provisioned to your security standards. NAPS and Apprentices Act compliance handled.",
      },
      {
        Icon: CheckCircleIcon,
        title: "Audit-ready",
        desc: "Engagement records, performance logs, and compliance documentation maintained throughout.",
      },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    Icon: FinanceIcon,
    question: "How do we model and approve the cost?",
    answer:
      "Fixed monthly cost per engineer. No variable recruitment fees, no one-off placement charges. Built for annual budget cycles with per-engineer cost that is predictable from day one.",
    needs: [
      {
        Icon: CoinsIcon,
        title: "Cost predictability",
        desc: "Fixed monthly cost per engineer. No variable or one-off charges at any stage.",
      },
      {
        Icon: TrendingUpIcon,
        title: "No bench risk",
        desc: "Engineers are deployed on active work from day one. No idle time costs.",
      },
      {
        Icon: PieChartIcon,
        title: "Outcome visibility",
        desc: "Monthly output data and performance reports for budget and planning review.",
      },
    ],
  },
];

export default function AudienceTabs() {
  const [active, setActive] = useState(0);
  const current = stakeholders[active];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 mb-10">
        {stakeholders.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(i)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all border-2 ${
              i === active
                ? "bg-ink border-ink text-white"
                : "bg-white border-line text-ink hover:border-ink"
            }`}
          >
            <s.Icon />
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: question + answer */}
        <div className="bg-soft border border-line rounded-xl p-8">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#888] mb-4">
            Their core question
          </p>
          <h3 className="text-[20px] font-extrabold tracking-[-0.03em] text-ink leading-snug mb-5">
            {current.question}
          </h3>
          <div className="w-8 h-0.5 bg-red mb-5" />
          <p className="text-[15px] font-semibold text-[#444] leading-relaxed">
            {current.answer}
          </p>
        </div>

        {/* Right: what I need to see */}
        <div>
          <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-[#888] mb-5">
            What I need to see
          </p>
          <div className="space-y-4">
            {current.needs.map((n) => (
              <div key={n.title} className="bg-white border border-line rounded-xl p-5 flex gap-4">
                <span className="w-8 h-8 rounded-full bg-red/10 text-red grid place-items-center shrink-0 mt-0.5">
                  <n.Icon />
                </span>
                <div>
                  <h4 className="text-[15px] font-extrabold tracking-[-0.02em] mb-1">
                    {n.title}
                  </h4>
                  <p className="text-[13px] font-medium text-[#555] leading-relaxed">
                    {n.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
