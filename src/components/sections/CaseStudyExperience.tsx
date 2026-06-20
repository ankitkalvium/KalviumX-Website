"use client";

import { useState } from "react";

type Accent = "retention" | "efficiency" | "genai";

interface CaseStudyExperienceProps {
  accent: Accent;
}

const retentionPhases = [
  {
    label: "Accountability",
    title: "Enterprise work was tied to academic progress",
    copy: "Project contribution was not an extracurricular internship. Work performance formed part of the learner's academic context, creating a direct reason to remain consistent.",
    evidence: ["Live project contribution", "Integrated academic accountability", "Professional performance signal"],
  },
  {
    label: "Intervention",
    title: "Performance issues had an escalation path",
    copy: "Company feedback did not stop with the manager. Kalvium mentors could translate it into targeted coaching before a concern became disengagement.",
    evidence: ["Structured company feedback", "Mentor-led support", "Early course correction"],
  },
  {
    label: "Continuity",
    title: "The model sustained contribution for 36 months",
    copy: "The result was not a short retention spike. The engagement maintained zero attrition across a three-year deployment.",
    evidence: ["36-month engagement", "0% attrition", "Continuous performance visibility"],
  },
];

const bfsiViews = [
  {
    label: "Cost model",
    title: "Lower talent cost without changing the expected output",
    copy: "The comparison was not simply intern cost versus employee cost. The deployment was evaluated against Tier-1 engineering talent while maintaining production expectations.",
    left: { title: "Tier-1 benchmark", value: "100", label: "reference talent cost" },
    right: { title: "KalviumX deployment", value: "40", label: "relative cost index" },
    notes: ["~60% cost efficiency", "No performance trade-off", "MERN engineering track"],
  },
  {
    label: "Work scope",
    title: "The team received deployable MERN engineering capacity",
    copy: "The engagement focused on relevant engineering contribution rather than observational internship work.",
    left: { title: "Capability", value: "MERN", label: "engineering deployment" },
    right: { title: "Operating context", value: "Live", label: "product workflows" },
    notes: ["Stack-aligned assessment", "Live team contribution", "Mentor-supported delivery"],
  },
  {
    label: "Governance",
    title: "Cost efficiency remained visible alongside performance",
    copy: "Ongoing feedback and performance oversight made the commercial benefit measurable without losing sight of engineering output.",
    left: { title: "Company", value: "Work", label: "allocation and review" },
    right: { title: "Kalvium", value: "Support", label: "feedback and intervention" },
    notes: ["Manager feedback", "Performance visibility", "Targeted intervention"],
  },
];

const genaiWeeks = [
  {
    week: "Week 1",
    title: "Capability gap and use-case alignment",
    copy: "The sprint started by connecting GenAI learning to the product context instead of teaching prompts as a generic standalone skill.",
    outputs: ["Product use cases mapped", "Prompt fundamentals aligned", "Readiness baseline established"],
  },
  {
    week: "Week 2",
    title: "Prompt patterns and model interaction",
    copy: "Learners moved from basic prompting toward repeatable interaction patterns relevant to product engineering workflows.",
    outputs: ["Prompt structure", "Context handling", "Output evaluation"],
  },
  {
    week: "Week 3",
    title: "Applied GenAI workflow practice",
    copy: "The capability was exercised through implementation-oriented work so the team could judge practical readiness.",
    outputs: ["Workflow prototyping", "Iteration practice", "Engineering application"],
  },
  {
    week: "Week 4",
    title: "Readiness review and expansion decision",
    copy: "The intervention concluded with a capability review. The result was approval for 12 additional hires.",
    outputs: ["Readiness reviewed", "Capability demonstrated", "12 hires sanctioned"],
  },
];

export default function CaseStudyExperience({ accent }: CaseStudyExperienceProps) {
  if (accent === "retention") return <RetentionExperience />;
  if (accent === "efficiency") return <BfsiExperience />;
  return <GenAiExperience />;
}

function RetentionExperience() {
  const [active, setActive] = useState(0);
  const phase = retentionPhases[active];

  return (
    <>
      <section className="bg-soft border-y border-line">
        <div className="container-x grid lg:grid-cols-[0.7fr_1.3fr] gap-12 items-start">
          <CaseIntro
            label="Retention mechanism"
            title="What changed the attrition equation"
            copy="Explore the three mechanisms that connected enterprise work, learner accountability and timely support."
          />
          <div>
            <TabRail items={retentionPhases.map((item) => item.label)} active={active} onChange={setActive} />
            <InteractivePanel title={phase.title} copy={phase.copy} items={phase.evidence} number={`0${active + 1}`} />
          </div>
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="container-x">
          <div className="grid lg:grid-cols-[0.75fr_1.25fr] gap-12 items-center">
            <CaseIntro
              dark
              label="Continuity view"
              title="Three years without a drop-off"
              copy="Select a year to inspect the continuity signal. The engagement remained active through the full 36-month period."
            />
            <ContinuityChart />
          </div>
        </div>
      </section>
    </>
  );
}

function BfsiExperience() {
  const [active, setActive] = useState(0);
  const view = bfsiViews[active];

  return (
    <>
      <section className="bg-soft border-y border-line">
        <div className="container-x">
          <div className="grid lg:grid-cols-[0.72fr_1.28fr] gap-12 items-start">
            <CaseIntro
              label="Commercial evidence"
              title="Cost and output have to be read together"
              copy="Switch between the commercial model, engineering scope and governance layer behind the result."
            />
            <div>
              <TabRail items={bfsiViews.map((item) => item.label)} active={active} onChange={setActive} />
              <div className="border border-line bg-white rounded-xl p-7 sm:p-9">
                <h3 className="text-2xl sm:text-3xl font-black tracking-[-0.04em]">{view.title}</h3>
                <p className="mt-3 text-[#555] leading-relaxed font-medium max-w-2xl">{view.copy}</p>
                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  <ComparisonBlock {...view.left} primary />
                  <ComparisonBlock {...view.right} />
                </div>
                <EvidenceList items={view.notes} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container-x">
          <div className="grid lg:grid-cols-[0.75fr_1.25fr] gap-12 items-center">
            <CaseIntro
              label="Decision frame"
              title="The result was not cheaper talent. It was efficient engineering capacity."
              copy="The model only works if lower cost and usable output remain true at the same time."
            />
            <div className="grid sm:grid-cols-3 border border-line rounded-xl overflow-hidden">
              {[
                ["01", "Relevant stack", "MERN capability matched to the requirement."],
                ["02", "Live contribution", "Engineers worked inside product workflows."],
                ["03", "Visible performance", "Feedback kept output and support connected."],
              ].map(([number, title, copy]) => (
                <div key={number} className="p-7 border-b sm:border-b-0 sm:border-r last:border-0 border-line">
                  <span className="text-red text-2xl font-black">{number}</span>
                  <h3 className="mt-5 font-extrabold text-lg">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#555] font-medium">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function GenAiExperience() {
  const [week, setWeek] = useState(0);
  const [after, setAfter] = useState(false);
  const activeWeek = genaiWeeks[week];

  return (
    <>
      <section className="bg-ink text-white">
        <div className="container-x grid lg:grid-cols-[0.68fr_1.32fr] gap-12 items-start">
          <CaseIntro
            dark
            label="Four-week intervention"
            title="A capability sprint, not a generic course"
            copy="Select each week to see how the intervention moved from use-case alignment to a hiring expansion decision."
          />
          <div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {genaiWeeks.map((item, index) => (
                <button
                  key={item.week}
                  type="button"
                  onClick={() => setWeek(index)}
                  aria-pressed={week === index}
                  className={`min-h-12 rounded-md border text-xs sm:text-sm font-extrabold transition-colors ${
                    week === index
                      ? "bg-red border-red text-white"
                      : "border-white/20 text-white/60 hover:border-red hover:text-white"
                  }`}
                >
                  {item.week}
                </button>
              ))}
            </div>
            <div className="border border-white/15 rounded-xl p-7 sm:p-9 bg-white/[0.04]">
              <div className="text-red text-sm font-extrabold uppercase tracking-[0.14em]">{activeWeek.week}</div>
              <h3 className="mt-3 text-2xl sm:text-3xl font-black tracking-[-0.04em]">{activeWeek.title}</h3>
              <p className="mt-4 text-white/65 leading-relaxed font-medium max-w-2xl">{activeWeek.copy}</p>
              <EvidenceList items={activeWeek.outputs} dark />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container-x grid lg:grid-cols-[0.7fr_1.3fr] gap-12 items-center">
          <CaseIntro
            label="Capability shift"
            title="See what changed after four weeks"
            copy="Toggle the capability view to compare the starting deployment with the post-intervention readiness signal."
          />
          <div className="border border-line rounded-xl overflow-hidden">
            <div className="p-4 bg-soft flex items-center justify-between gap-4">
              <span className="text-sm font-extrabold">{after ? "After upskilling" : "Before upskilling"}</span>
              <button
                type="button"
                onClick={() => setAfter((value) => !value)}
                className="inline-flex rounded-full border border-line bg-white p-1"
                aria-label="Toggle before and after capability"
              >
                <span className={`px-4 py-2 rounded-full text-xs font-extrabold ${!after ? "bg-ink text-white" : "text-[#666]"}`}>Before</span>
                <span className={`px-4 py-2 rounded-full text-xs font-extrabold ${after ? "bg-red text-white" : "text-[#666]"}`}>After</span>
              </button>
            </div>
            <CapabilityMatrix after={after} />
          </div>
        </div>
      </section>
    </>
  );
}

function CaseIntro({ label, title, copy, dark = false }: { label: string; title: string; copy: string; dark?: boolean }) {
  return (
    <div>
      <div className="text-xs font-extrabold uppercase tracking-[0.15em] text-red">{label}</div>
      <h2 className={`mt-4 text-[clamp(32px,4vw,50px)] font-black leading-[1.06] tracking-[-0.05em] ${dark ? "text-white" : ""}`}>{title}</h2>
      <p className={`mt-5 leading-relaxed font-medium ${dark ? "text-white/60" : "text-[#555]"}`}>{copy}</p>
    </div>
  );
}

function TabRail({ items, active, onChange }: { items: string[]; active: number; onChange: (index: number) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4" role="tablist">
      {items.map((item, index) => (
        <button
          key={item}
          type="button"
          role="tab"
          aria-selected={active === index}
          onClick={() => onChange(index)}
          className={`px-5 min-h-11 rounded-full border text-sm font-extrabold transition-colors ${
            active === index ? "bg-red border-red text-white" : "bg-white border-line text-[#555] hover:border-red hover:text-red"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function InteractivePanel({ title, copy, items, number }: { title: string; copy: string; items: string[]; number: string }) {
  return (
    <div className="border border-line bg-white rounded-xl p-7 sm:p-9 grid sm:grid-cols-[90px_1fr] gap-6">
      <span className="text-6xl font-black tracking-[-0.07em] text-red/20">{number}</span>
      <div>
        <h3 className="text-2xl sm:text-3xl font-black tracking-[-0.04em]">{title}</h3>
        <p className="mt-4 text-[#555] leading-relaxed font-medium">{copy}</p>
        <EvidenceList items={items} />
      </div>
    </div>
  );
}

function EvidenceList({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <div className="grid sm:grid-cols-3 gap-3 mt-7">
      {items.map((item) => (
        <div key={item} className={`p-4 rounded-md border text-sm font-bold ${dark ? "border-white/15 bg-white/[0.04] text-white/80" : "border-line bg-soft text-[#333]"}`}>
          <span className="text-red mr-2">✓</span>{item}
        </div>
      ))}
    </div>
  );
}

function ContinuityChart() {
  const [year, setYear] = useState(0);
  const years = [
    ["Year 1", "Foundation", "The engagement established the work, feedback and accountability rhythm."],
    ["Year 2", "Sustained contribution", "The same operating model continued without an attrition break."],
    ["Year 3", "Long-term continuity", "The deployment reached 36 months with zero attrition."],
  ];

  return (
    <div className="border border-white/15 rounded-xl p-7 sm:p-9">
      <div className="grid grid-cols-3 gap-2">
        {years.map((item, index) => (
          <button
            key={item[0]}
            type="button"
            onClick={() => setYear(index)}
            className={`rounded-md min-h-12 text-sm font-extrabold border ${year === index ? "bg-red border-red" : "border-white/15 text-white/55"}`}
          >
            {item[0]}
          </button>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-12 gap-1.5" aria-label="36 month continuity chart">
        {Array.from({ length: 36 }, (_, index) => (
          <span key={index} className={`h-16 rounded-sm ${index < (year + 1) * 12 ? "bg-red" : "bg-white/10"}`} />
        ))}
      </div>
      <div className="mt-7 flex items-end justify-between gap-6">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-[0.13em] text-red">{years[year][1]}</div>
          <p className="mt-2 text-white/65 font-medium">{years[year][2]}</p>
        </div>
        <strong className="text-4xl font-black whitespace-nowrap">{(year + 1) * 12} months</strong>
      </div>
    </div>
  );
}

function ComparisonBlock({ title, value, label, primary = false }: { title: string; value: string; label: string; primary?: boolean }) {
  const numeric = Number(value);
  return (
    <div className={`rounded-lg p-6 ${primary ? "bg-soft border border-line" : "bg-ink text-white"}`}>
      <span className={`text-xs font-extrabold uppercase tracking-[0.12em] ${primary ? "text-[#777]" : "text-white/45"}`}>{title}</span>
      <strong className={`block mt-5 text-4xl font-black tracking-[-0.05em] ${primary ? "text-ink" : "text-red"}`}>{value}</strong>
      <span className={`block mt-1 text-xs font-bold ${primary ? "text-[#666]" : "text-white/55"}`}>{label}</span>
      {!Number.isNaN(numeric) && (
        <div className={`mt-6 h-2 rounded-full ${primary ? "bg-line" : "bg-white/10"}`}>
          <div className="h-full rounded-full bg-red" style={{ width: `${numeric}%` }} />
        </div>
      )}
    </div>
  );
}

function CapabilityMatrix({ after }: { after: boolean }) {
  const rows = [
    ["MERN engineering foundation", "Existing deployment", "Existing deployment"],
    ["Prompt and GenAI capability", "Capability gap", "4-week upskilling completed"],
    ["Hiring expansion decision", "Not yet sanctioned", "12 hires sanctioned"],
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6">
      {rows.map(([label, before, improved], index) => (
          <div key={label} className="grid sm:grid-cols-[1fr_1.1fr] gap-3 items-center border-b border-line pb-5 last:border-0 last:pb-0">
            <div>
              <span className="text-xs font-extrabold text-red">0{index + 1}</span>
              <div className="mt-1 text-sm font-bold">{label}</div>
            </div>
            <div className={`rounded-md p-4 text-sm font-extrabold transition-colors ${after ? "bg-red text-white" : "bg-soft text-[#555]"}`}>
              {after ? improved : before}
            </div>
          </div>
        ))}
      <div className={`rounded-lg p-5 text-sm font-bold ${after ? "bg-red text-white" : "bg-soft text-[#555]"}`}>
        {after ? "Post-intervention outcome: practical GenAI capability demonstrated and 12 additional hires sanctioned." : "Starting point: strong MERN foundation, but limited practical GenAI readiness for new product work."}
      </div>
    </div>
  );
}
