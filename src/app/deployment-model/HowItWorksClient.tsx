"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import InteractiveTimeline from "@/components/sections/InteractiveTimeline";
import FaqAccordion from "@/components/sections/FaqAccordion";
import { faqsProcess } from "@/lib/data";

type Tab = "deployment" | "talent";

const ownership = [
  { area: "Work allocation & sprint planning", company: true, kalvium: false },
  { area: "Code review & technical direction", company: true, kalvium: false },
  { area: "Skill fundamentals & coaching", company: false, kalvium: true },
  { area: "Performance tracking & interventions", company: false, kalvium: true },
  { area: "Monthly structured feedback", company: true, kalvium: true },
  { area: "Replacement support", company: false, kalvium: true },
];

const universities = [
  "Kalasalingam University",
  "Lovely Professional University",
  "Manipal University, Jaipur",
  "MIT-ADT University",
  "NICHE, Kanniyakumari",
  "Takshashila University",
  "St. Joseph University",
  "SRM University, Amaravati",
  "SRM University, Trichy",
  "SGT University",
  "Alliance University",
  "AMET University",
  "Chitkara University",
  "Christ University",
  "Yenepoya University, Mangalore",
  "Yenepoya University, Bengaluru",
  "VELS University",
  "The Apollo University",
  "RV University",
];

const talentPillars = [
  {
    n: "01",
    title: "KNET selection",
    body: "Kalvium's own aptitude test covering coding, problem solving, CEFR-level English, and professionalism markers. The standard university entrance plays no role.",
    featured: false,
  },
  {
    n: "02",
    title: "Curriculum refreshed every 6 months",
    body: "Non-CS theory cleared out. Curriculum rebuilt around the live industry stack and refreshed every 6 months so students arrive on your tools, not last year's syllabus. Lower ramp-up. Faster output.",
    featured: true,
  },
  {
    n: "03",
    title: "Remote Delivery Centers",
    body: "Co-working RDCs deployed on every partner campus. Access-controlled, CCTV-monitored, dedicated Wi-Fi, on-site technical mentor. 12pm to 7pm, Mon to Fri.",
    featured: false,
  },
  {
    n: "04",
    title: "Uninterrupted talent: remote then onsite",
    body: "Sem 3-5: 30 hrs/week, remote from campus RDCs. Sem 6-8: full-time, onsite at your office. One continuous engagement across 2-3 years with zero handover gaps.",
    featured: false,
  },
  {
    n: "05",
    title: "CGPA tied to delivery",
    body: "Academic performance is measured by company work output, not theory exams. The degree and the delivery are the same instrument.",
    featured: false,
  },
  {
    n: "06",
    title: "Continuous eligibility tracking",
    body: "Only students holding scores across coding, communication, and professionalism stay deployed. Tracked by the hour, not the month.",
    featured: true,
  },
];

export default function HowItWorksClient() {
  const [activeTab, setActiveTab] = useState<Tab>("deployment");
  const contentRef = useRef<HTMLDivElement>(null);
  const [activePillars, setActivePillars] = useState<Set<string>>(new Set());
  const pillarRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const refs = pillarRefs.current.filter(Boolean) as HTMLDivElement[];
    if (refs.length === 0) return;
    const observers = refs.map((ref, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          setActivePillars((prev) => {
            const next = new Set(prev);
            if (entry.isIntersecting) {
              next.add(talentPillars[i].n);
            } else {
              next.delete(talentPillars[i].n);
            }
            return next;
          });
        },
        { threshold: 0.4 }
      );
      obs.observe(ref);
      return obs;
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [activeTab]);

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 30);
  };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative border-b border-line overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <Image
            src="/images/students-working.png"
            alt="Kalvium students working in Remote Delivery Center"
            fill
            className="object-cover object-center opacity-25"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/55 to-ink/95" />
        </div>

        <div className="relative container-x pt-[78px] pb-0">
          <div className="max-w-2xl pb-10">
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.16em] text-red mb-4">
              How It Works
            </span>
            <h1 className="text-[clamp(36px,5vw,64px)] font-black leading-[1.02] tracking-[-0.05em] text-white mb-5">
              Two models. One integrated system.
            </h1>
            <p className="text-[16px] font-semibold text-white/55 leading-relaxed max-w-lg">
              KalviumX runs on two interlocking engines. The Talent Model builds engineers inside universities. The Deployment Model puts them to work inside your team.
            </p>
          </div>

          {/* Tab switcher */}
          <div className="grid sm:grid-cols-2 gap-px bg-white/10 rounded-t-2xl overflow-hidden border border-b-0 border-white/10">
            <button
              onClick={() => switchTab("deployment")}
              className={`group relative text-left px-8 py-7 transition-all ${
                activeTab === "deployment" ? "bg-white" : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className={`text-[16px] font-black tracking-[-0.02em] mb-1 ${activeTab === "deployment" ? "text-ink" : "text-white"}`}>
                Deployment Model
              </div>
              <div className={`text-[13px] font-medium leading-snug ${activeTab === "deployment" ? "text-[#666]" : "text-white/45"}`}>
                JD to deployed engineer in 12 days
              </div>
              <div className={`absolute bottom-5 right-6 font-black text-lg ${activeTab === "deployment" ? "text-red" : "text-white/25"}`}>
                {activeTab === "deployment" ? "↓" : "→"}
              </div>
            </button>

            <button
              onClick={() => switchTab("talent")}
              className={`group relative text-left px-8 py-7 transition-all ${
                activeTab === "talent" ? "bg-white" : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className={`text-[16px] font-black tracking-[-0.02em] mb-1 ${activeTab === "talent" ? "text-ink" : "text-white"}`}>
                Talent Model
              </div>
              <div className={`text-[13px] font-medium leading-snug ${activeTab === "talent" ? "text-[#666]" : "text-white/45"}`}>
                How engineers are built from Semester 3
              </div>
              <div className={`absolute bottom-5 right-6 font-black text-lg ${activeTab === "talent" ? "text-red" : "text-white/25"}`}>
                {activeTab === "talent" ? "↓" : "→"}
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ── Scroll anchor ────────────────────────────────────────────────────── */}
      <div ref={contentRef} />

      {/* ── Deployment Model ─────────────────────────────────────────────────── */}
      {activeTab === "deployment" && (
        <>
          <InteractiveTimeline />

          <section className="border-b border-line">
            <div className="container-x">
              <SectionHeading
                eyebrow="Before Day 1"
                title={<>A context sprint. <span className="red-pill">Zero ramp-up tax</span> on your team.</>}
                copy="Every selected intern completes a 2-3 week company-specific context sprint before joining your standups."
              />
              <div className="mt-10 grid sm:grid-cols-3 gap-5">
                {[
                  {
                    icon: <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
                    title: "Stack and codebase walkthrough",
                    body: "Mentors run structured sessions on your tech stack, repository structure, and codebase conventions aligned to the intern's JD.",
                  },
                  {
                    icon: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></>,
                    title: "Tooling and workflow orientation",
                    body: "Ticketing systems, CI/CD pipelines, sprint conventions, communication tools, and pull request norms covered before the first standup.",
                  },
                  {
                    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
                    title: "Compliance and access setup",
                    body: "Company-specific compliance modules, tool access provisioning, and security protocols completed during the bootcamp window.",
                  },
                ].map((card) => (
                  <div key={card.title} className="group relative border border-line rounded-xl p-7 bg-white hover:border-red/30 transition-colors overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-10 h-10 rounded-xl bg-red/8 text-red grid place-items-center mb-5">
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {card.icon}
                      </svg>
                    </div>
                    <h3 className="font-extrabold text-[15px] mb-3 tracking-[-0.02em]">{card.title}</h3>
                    <p className="text-[13px] text-[#555] font-medium leading-relaxed">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-b border-line bg-ink text-white">
            <div className="container-x">
              <div className="grid lg:grid-cols-[1fr_340px] gap-16 items-start">
                <div>
                  <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.16em] text-red mb-4">After Deployment</span>
                  <h2 className="text-[clamp(26px,3vw,40px)] font-black leading-[1.1] tracking-[-0.05em] mb-4">
                    Who owns what.
                  </h2>
                  <p className="text-white/55 font-medium mb-10 max-w-md">A clean split of responsibilities so your managers are never running a training program.</p>
                  <div className="border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="px-5 py-3.5 font-extrabold text-white/40 text-[11px] uppercase tracking-[0.12em]">Responsibility</th>
                          <th className="px-5 py-3.5 font-extrabold text-white/40 text-[11px] uppercase tracking-[0.12em] text-center">Your team</th>
                          <th className="px-5 py-3.5 font-extrabold text-white/40 text-[11px] uppercase tracking-[0.12em] text-center">Kalvium</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ownership.map((row, i) => (
                          <tr key={row.area} className={`border-b border-white/5 ${i === ownership.length - 1 ? "border-b-0" : ""}`}>
                            <td className="px-5 py-4 font-semibold text-white/75 text-[13px]">{row.area}</td>
                            <td className="px-5 py-4 text-center">{row.company && <span className="text-red font-black text-base">✓</span>}</td>
                            <td className="px-5 py-4 text-center">{row.kalvium && <span className="text-red font-black text-base">✓</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="space-y-4 lg:pt-16">
                  <div className="border border-white/10 rounded-xl p-6 bg-white/5">
                    <h3 className="font-extrabold text-base mb-4 text-white">During the engagement</h3>
                    <ul className="space-y-3">
                      {[
                        "Interns work inside your timezone, Mon to Fri",
                        "Mentors run weekly technical and conduct check-ins",
                        "Full sprint, standup, and tooling integration",
                        "Direct escalation path to Kalvium program team",
                      ].map((item) => (
                        <li key={item} className="flex gap-2.5 text-[13px] font-semibold text-white/65 leading-snug">
                          <span className="text-red shrink-0 mt-0.5">✓</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border border-white/10 rounded-xl p-6 bg-white/5">
                    <h3 className="font-extrabold text-base mb-4 text-white">Monthly feedback loop</h3>
                    <ul className="space-y-3">
                      {[
                        "Company shares structured review each month",
                        "Mentors translate feedback into targeted coaching",
                        "Issues trigger intervention within the same month",
                        "Cohort-level reporting for leadership",
                      ].map((item) => (
                        <li key={item} className="flex gap-2.5 text-[13px] font-semibold text-white/65 leading-snug">
                          <span className="text-red shrink-0 mt-0.5">✓</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-b border-line">
            <div className="container-x grid md:grid-cols-[1fr_300px] gap-12 items-center">
              <div>
                <span className="inline-block bg-red text-white font-black text-[11px] tracking-[0.1em] uppercase rounded-md px-4 py-1.5 mb-5">HEROS</span>
                <h2 className="text-[clamp(22px,2.8vw,36px)] font-black leading-[1.14] tracking-[-0.05em] mb-4">The same system that curated your shortlist tracks performance throughout.</h2>
                <p className="text-[#555] font-medium leading-relaxed mb-6">HEROS data powers Day 2-4 talent mapping. From deployment, it feeds the monthly feedback loop with performance signals, giving mentors early warning before gaps surface on your team.</p>
                <Button href="/roles" variant="dark">See what HEROS tracks →</Button>
              </div>
              <div className="bg-ink rounded-2xl p-6">
                <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/30 mb-5">Live signal dashboard</div>
                {[
                  { label: "Skill proficiency", pct: 82 },
                  { label: "Project output quality", pct: 91 },
                  { label: "Learning velocity", pct: 78 },
                  { label: "Professionalism score", pct: 88 },
                ].map(({ label, pct }) => (
                  <div key={label} className="mb-4 last:mb-0">
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-white/60">{label}</span>
                      <span className="text-red">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/8 rounded-full">
                      <div className="h-full bg-gradient-to-r from-red/80 to-red rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
                <div className="mt-5 pt-4 border-t border-white/8 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.1em]">Updated continuously</span>
                  <span className="text-[10px] font-extrabold text-emerald-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />Live</span>
                </div>
              </div>
            </div>
          </section>

          <section className="border-b border-line bg-soft">
            <div className="container-x">
              <SectionHeading
                eyebrow="Long-Term Arc"
                align="center"
                title={<>From intern to <span className="red-pill">full-time hire</span></>}
                copy="The engagement is structured across years, not quarters. Each phase compounds output."
              />
              <div className="mt-10 grid md:grid-cols-3 gap-0 border border-line rounded-2xl overflow-hidden">
                {[
                  {
                    label: "Year 2", title: "30 hrs/week, remote",
                    body: "Interns contribute Monday to Friday from their campus RDC. Full sprint participation. Mentor-managed weekly check-ins. Monthly performance loop.",
                    dark: false,
                  },
                  {
                    label: "Year 3", title: "Full-time, onsite available",
                    body: "Students transition to full-time from Year 3 onward. Onsite deployment available. Year 2 performance record carries forward as your FTE readiness signal.",
                    dark: false,
                  },
                  {
                    label: "Conversion", title: "FTE path built in",
                    body: "The monthly feedback loop generates a performance record that feeds directly into your FTE decision. No cold interviews. Conversion terms in the commercial sheet.",
                    dark: true,
                  },
                ].map((card, i) => (
                  <div key={card.label} className={`p-8 ${i < 2 ? "border-b md:border-b-0 md:border-r border-line" : ""} ${card.dark ? "bg-ink text-white" : "bg-white"}`}>
                    <div className={`text-[11px] font-extrabold uppercase tracking-[0.16em] mb-2 ${card.dark ? "text-red" : "text-red"}`}>{card.label}</div>
                    <h3 className={`text-[18px] font-extrabold tracking-[-0.03em] mb-3 ${card.dark ? "text-white" : "text-ink"}`}>{card.title}</h3>
                    <p className={`text-[13px] font-medium leading-relaxed ${card.dark ? "text-white/55" : "text-[#555]"}`}>{card.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <FaqAccordion
            faqs={faqsProcess}
            eyebrow="Process FAQ"
            title={<>How the motion <span className="red-pill">actually works</span></>}
          />

          <section className="bg-ink text-white">
            <div className="container-x text-center max-w-2xl mx-auto">
              <h2 className="text-[clamp(28px,3.5vw,44px)] font-black leading-[1.12] tracking-[-0.05em]">
                Ready to see assessed talent in 12 days?
              </h2>
              <p className="mt-4 text-white/50 font-medium leading-relaxed">Share a JD. Get a curated shortlist. Deploy with mentor coverage from day one.</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Button href="/start-a-pilot">Start a Pilot</Button>
                <Button href="/commercials" variant="ghost">See Pricing →</Button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── Talent Model ─────────────────────────────────────────────────────── */}
      {activeTab === "talent" && (
        <>
          {/* Intro: supply chain story */}
          <section className="border-b border-line">
            <div className="container-x grid lg:grid-cols-[1fr_360px] gap-14 items-start">
              <div className="lg:py-4">
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.16em] text-red mb-4">
                  The Supply Chain
                </span>
                <h2 className="text-[clamp(30px,4vw,52px)] font-black leading-[1.04] tracking-[-0.05em] mb-6">
                  Not sourced.<br />Built from Semester 3, inside 23+ partner universities.
                </h2>
                <p className="text-[15px] font-semibold text-[#444] leading-relaxed mb-4 max-w-lg">
                  Kalvium runs as a program embedded inside 23+ UGC and AICTE approved universities across India. Students are admitted through Kalvium&apos;s own aptitude process, not the standard university route.
                </p>
                <p className="text-[15px] font-semibold text-[#444] leading-relaxed max-w-lg">
                  The B.Tech degree comes from the partner university. The curriculum, mentors, learning platform, and work-integration infrastructure are all Kalvium. When a student deploys into your team, they are a work-integrated engineer whose academic CGPA is directly tied to your engineering output.
                </p>
              </div>

              <div className="space-y-4 lg:sticky lg:top-8">
                <div className="bg-ink rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red/10 rounded-full translate-x-12 -translate-y-12" />
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-red mb-4 relative">
                    By graduation
                  </p>
                  <div className="flex items-baseline gap-2 relative">
                    <span className="text-[80px] font-black text-white leading-none tracking-[-0.06em]">18-24</span>
                    <span className="text-[28px] font-black text-white/60 leading-none">mo.</span>
                  </div>
                  <p className="text-white/80 text-[15px] font-bold mt-2 leading-snug">
                    of real industry experience
                  </p>
                  <p className="text-white/35 text-[12px] font-medium mt-1">
                    before a Kalvium student graduates
                  </p>
                  <div className="border-t border-white/8 mt-6 pt-5">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-white/25 mb-1.5">
                      Traditional B.Tech graduate, Day 1
                    </p>
                    <p className="text-white/45 text-[13px] font-semibold">
                      0 months of professional engineering experience.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-soft border border-line rounded-xl p-5">
                    <div className="text-red font-black text-[36px] tracking-[-0.04em] leading-none">23+</div>
                    <p className="text-[12px] font-semibold text-[#555] mt-1.5 leading-snug">UGC and AICTE approved university partners</p>
                  </div>
                  <div className="bg-soft border border-line rounded-xl p-5">
                    <div className="text-red font-black text-[36px] tracking-[-0.04em] leading-none">Sem 3</div>
                    <p className="text-[12px] font-semibold text-[#555] mt-1.5 leading-snug">earliest real engineering work begins</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Semester arc visual */}
          <section className="border-b border-line bg-soft">
            <div className="container-x">
              <div className="text-center mb-12">
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.16em] text-red mb-4">Progression Arc</span>
                <h2 className="text-[clamp(24px,3vw,38px)] font-black leading-[1.1] tracking-[-0.05em]">
                  How commitment deepens across semesters.
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                {/* Sem 3-5 */}
                <div className="bg-white border border-line rounded-2xl p-8">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-red mb-6">Sem 3 to 5</div>
                  <div className="text-[56px] font-black text-ink leading-none tracking-[-0.06em] mb-1">30hrs</div>
                  <div className="text-[15px] font-bold text-[#999] mb-7">weekly, remote</div>
                  <ul className="space-y-3 border-t border-line pt-6">
                    {[
                      "Work from campus RDC, not dorm rooms",
                      "12pm to 7pm, Mon to Fri",
                      "First production commit by Week 2",
                      "On-site technical mentor available",
                    ].map((i) => (
                      <li key={i} className="text-[13px] font-semibold text-[#444] flex gap-2.5 leading-snug">
                        <span className="text-red shrink-0 font-black">✓</span>{i}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sem 6-8 */}
                <div className="bg-white border-2 border-ink rounded-2xl p-8">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-red mb-6">Sem 6 to 8</div>
                  <div className="text-[56px] font-black text-ink leading-none tracking-[-0.06em] mb-1">Full-time</div>
                  <div className="text-[15px] font-bold text-[#999] mb-7">onsite available</div>
                  <ul className="space-y-3 border-t border-line pt-6">
                    {[
                      "Full-time availability, 5 days/week",
                      "Onsite deployment at your office",
                      "Sprint lead and senior pairing eligible",
                      "Deep codebase ownership capacity",
                    ].map((i) => (
                      <li key={i} className="text-[13px] font-semibold text-[#444] flex gap-2.5 leading-snug">
                        <span className="text-red shrink-0 font-black">✓</span>{i}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* By Graduation */}
                <div className="bg-ink rounded-2xl p-8">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-red mb-6">By Graduation</div>
                  <div className="text-[56px] font-black text-white leading-none tracking-[-0.06em] mb-1">FTE Ready</div>
                  <div className="text-[15px] font-bold text-white/40 mb-7">18-24 months of experienced talent</div>
                  <ul className="space-y-3 border-t border-white/10 pt-6">
                    {[
                      "Performance record built over 2-3 years",
                      "No cold interviews needed",
                      "CGPA reflects engineering output",
                      "Conversion terms pre-agreed",
                    ].map((i) => (
                      <li key={i} className="text-[13px] font-semibold text-white/60 flex gap-2.5 leading-snug">
                        <span className="text-red shrink-0 font-black">✓</span>{i}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Six pillars */}
          <section className="border-b border-line bg-white">
            <div className="container-x">
              <div className="pt-16 pb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-line">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-red block mb-3">How it&apos;s built</span>
                  <h2 className="text-[clamp(28px,4vw,46px)] font-black leading-[1.05] tracking-[-0.05em]">
                    Six layers that make a <span className="red-pill">Kalvium engineer</span>
                  </h2>
                </div>
                <p className="text-[14px] font-semibold text-[#666] max-w-[280px] leading-relaxed pb-1">
                  Each pillar removes a gap that traditional B.Tech programs leave open.
                </p>
              </div>
              <div className="divide-y divide-line">
                {talentPillars.map((p, i) => (
                  <div
                    key={p.n}
                    ref={(el) => { pillarRefs.current[i] = el; }}
                    className="grid grid-cols-[56px_1fr] md:grid-cols-[56px_1fr_1.6fr] gap-x-8 gap-y-2 py-8 items-start"
                  >
                    <div className={`text-[36px] font-black leading-none tracking-[-0.06em] pt-1 transition-colors duration-500 ${activePillars.has(p.n) ? "text-red" : "text-[#ddd]"}`}>{p.n}</div>
                    <h3 className={`text-[15px] font-extrabold tracking-[-0.02em] leading-snug pt-1 md:pt-[3px] transition-colors duration-500 ${activePillars.has(p.n) ? "text-ink" : "text-[#aaa]"}`}>{p.title}</h3>
                    <p className={`col-start-2 md:col-start-3 text-[13px] font-medium leading-relaxed transition-colors duration-500 ${activePillars.has(p.n) ? "text-[#444]" : "text-[#bbb]"}`}>{p.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RDC deep-dive */}
          <section className="border-b border-line">
            <div className="container-x grid lg:grid-cols-[1fr_1fr] gap-14 items-center">
              <div>
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.16em] text-red mb-4">
                  Remote Delivery Centers
                </span>
                <h2 className="text-[clamp(24px,3vw,38px)] font-black leading-[1.1] tracking-[-0.05em] mb-5">
                  Co-working infrastructure deployed inside university campuses.
                </h2>
                <p className="text-[15px] font-semibold text-[#444] leading-relaxed mb-6">
                  Every Kalvium partner university has a dedicated RDC. Think WeWork inside the campus. Students don&apos;t work from dorm rooms. They work from a structured professional environment, within walking distance of their academic block.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Access-controlled entry",
                    "Attendance logging",
                    "CCTV monitored",
                    "Dedicated Wi-Fi",
                    "On-site technical mentor",
                    "Mon to Fri",
                    "No commute overhead",
                  ].map((chip) => (
                    <span key={chip} className="inline-flex items-center gap-1.5 bg-soft border border-line rounded-full px-3.5 py-1.5 text-[12px] font-bold text-ink">
                      <span className="w-1.5 h-1.5 rounded-full bg-red shrink-0" />{chip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Day schedule visual */}
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden border border-line">
                  <div className="bg-soft px-6 py-4 border-b border-line">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#999]">A student&apos;s day at the RDC</p>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-line">
                    <div className="p-6">
                      <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#aaa] mb-3">8:00 AM to 12:00 PM</div>
                      <div className="text-[22px] font-black text-ink tracking-[-0.03em] mb-1">Academics</div>
                      <p className="text-[12px] font-semibold text-[#777] leading-relaxed">University lectures and coursework on campus</p>
                    </div>
                    <div className="p-6 bg-red/8">
                      <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-red mb-3">12:00 PM to 7:00 PM</div>
                      <div className="text-[22px] font-black text-ink tracking-[-0.03em] mb-1">Engineering</div>
                      <p className="text-[12px] font-semibold text-[#555] leading-relaxed">Live team work from RDC. Sprints, standups, real output.</p>
                    </div>
                  </div>
                  <div className="bg-soft px-6 py-3 border-t border-line flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red" />
                    <p className="text-[12px] font-bold text-[#666]">Academics never overlap with engineering hours. No split attention.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-soft border border-line rounded-xl p-5">
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#aaa] mb-2">Sem 3 to 5</div>
                    <div className="text-[15px] font-black text-ink">30 hrs/week</div>
                    <div className="text-[12px] font-semibold text-[#888]">remote from campus RDC</div>
                  </div>
                  <div className="bg-red/8 border border-red/20 rounded-xl p-5">
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-red mb-2">Sem 6 to 8</div>
                    <div className="text-[15px] font-black text-ink">Full-time</div>
                    <div className="text-[12px] font-semibold text-[#555]">onsite at your office</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* GenAI ready */}
          <section className="border-b border-line bg-soft">
            <div className="container-x grid lg:grid-cols-2 gap-14 items-center">
              <div>
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.16em] text-red mb-4">
                  GenAI Ready
                </span>
                <h2 className="text-[clamp(24px,3vw,38px)] font-black leading-[1.1] tracking-[-0.05em] mb-5">
                  Every Kalvium engineer ships with GenAI in their workflow from day one.
                </h2>
                <p className="text-[15px] font-semibold text-[#444] leading-relaxed mb-6">
                  AI tooling is not an add-on module. It is part of how students work from Semester 3. Copilot workflows, prompt engineering, AI-assisted code review, and model evaluation are standard practice before students reach your standups.
                </p>
                <ul className="space-y-3">
                  {[
                    "GitHub Copilot and AI-assisted development from Sem 3",
                    "Prompt engineering and LLM integration patterns",
                    "AI code review workflows embedded in sprint process",
                    "Evaluation and testing of AI-generated output",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[14px] font-semibold text-[#333]">
                      <span className="text-red font-black shrink-0 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                {[
                  { skill: "Production engineering", level: 88 },
                  { skill: "GenAI tool proficiency", level: 85 },
                  { skill: "Code review and PR quality", level: 90 },
                  { skill: "Sprint and delivery norms", level: 92 },
                  { skill: "Professional communication", level: 83 },
                ].map(({ skill, level }) => (
                  <div key={skill} className="bg-white border border-line rounded-xl px-5 py-4">
                    <div className="flex justify-between text-[13px] font-bold mb-2">
                      <span className="text-ink">{skill}</span>
                      <span className="text-red font-extrabold">{level}%</span>
                    </div>
                    <div className="h-2 bg-line rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red/70 to-red rounded-full" style={{ width: `${level}%` }} />
                    </div>
                  </div>
                ))}
                <p className="text-[11px] font-semibold text-[#999] text-center pt-1">Indicative skills profile at point of deployment</p>
              </div>
            </div>
          </section>

          {/* Fitment */}
          <section className="border-b border-line">
            <div className="container-x">
              <SectionHeading
                eyebrow="How fitment works"
                align="center"
                title={<>How we match a student <span className="red-pill">to your JD</span></>}
                copy="Before a student deploys into your team, fitment is evaluated against your specific engineering context."
              />
              <div className="mt-10 grid sm:grid-cols-3 gap-4">
                {[
                  {
                    n: "01",
                    title: "Portfolio and GitHub review",
                    body: "Commit history, project quality, stack alignment, and output consistency reviewed against your JD before shortlisting.",
                  },
                  {
                    n: "02",
                    title: "Live capstone signals",
                    body: "Students in Semester 3-6 work on continuous live capstone projects. Team collaboration, velocity, and delivery quality feed directly into the HEROS profile.",
                  },
                  {
                    n: "03",
                    title: "HEROS talent mapping",
                    body: "HEROS maps skill profile, communication score, and professionalism markers to your engineering context. Shortlist is curated, not ranked by GPA.",
                  },
                ].map((card, i) => (
                  <div key={card.n} className={`rounded-2xl p-7 border ${i === 1 ? "bg-ink border-ink text-white" : "bg-white border-line"}`}>
                    <div className={`text-[32px] font-black tracking-[-0.05em] mb-4 leading-none ${i === 1 ? "text-red" : "text-red/25"}`}>{card.n}</div>
                    <h3 className={`text-[16px] font-extrabold tracking-[-0.02em] mb-3 ${i === 1 ? "text-white" : "text-ink"}`}>{card.title}</h3>
                    <p className={`text-[13px] font-medium leading-relaxed ${i === 1 ? "text-white/55" : "text-[#555]"}`}>{card.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Comparison table */}
          <section className="border-b border-line bg-soft">
            <div className="container-x">
              <SectionHeading
                eyebrow="Program comparison"
                align="center"
                title={<>Traditional B.Tech vs <span className="red-pill">Kalvium B.Tech</span></>}
                copy="The gap isn't in student potential. It's in what the program demands of them."
              />
              <div className="mt-10 overflow-x-auto rounded-2xl border border-line">
                <table className="w-full text-left text-sm min-w-[640px]">
                  <thead>
                    <tr>
                      <th className="px-6 py-4 bg-soft border-b border-line font-extrabold text-[12px] uppercase tracking-[0.1em] text-[#888] w-[30%]">Criteria</th>
                      <th className="px-6 py-4 bg-soft border-b border-l border-line font-extrabold text-[12px] uppercase tracking-[0.1em] text-[#888] w-[35%]">Traditional B.Tech CSE</th>
                      <th className="px-6 py-4 bg-red border-b border-red font-extrabold text-[12px] uppercase tracking-[0.1em] text-white w-[35%]">Kalvium B.Tech CSE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        criteria: "Engineering output",
                        traditional: "Starts after graduation",
                        kalvium: "Starts Week 2 of Semester 3",
                      },
                      {
                        criteria: "Curriculum freshness",
                        traditional: "Fixed syllabus, updated rarely",
                        kalvium: "Refreshed every 6 months against live industry stack",
                      },
                      {
                        criteria: "Work experience by graduation",
                        traditional: "0 months",
                        kalvium: "18-24 months in real engineering teams",
                      },
                      {
                        criteria: "Availability during study",
                        traditional: "Not available",
                        kalvium: "30 hrs/week (Sem 3-5), full-time onsite (Sem 6-8)",
                      },
                      {
                        criteria: "Work environment",
                        traditional: "Classrooms and dorm rooms",
                        kalvium: "Remote Delivery Centers, professional setup",
                      },
                      {
                        criteria: "Assessment basis",
                        traditional: "Written exams",
                        kalvium: "Company work output. CGPA = delivery quality",
                      },
                      {
                        criteria: "GenAI readiness",
                        traditional: "None or optional elective",
                        kalvium: "Copilot, LLM workflows built in from Sem 3",
                      },
                      {
                        criteria: "Mentor model",
                        traditional: "Academic faculty",
                        kalvium: "Industry technical mentors + Kalvium program team",
                      },
                      {
                        criteria: "Deployment ramp-up needed",
                        traditional: "6-12 months minimum",
                        kalvium: "Day 1 productive. Stack aligned before joining.",
                      },
                    ].map((row, i) => (
                      <tr key={row.criteria} className={i % 2 === 0 ? "bg-white" : "bg-soft"}>
                        <td className="px-6 py-4 font-bold text-ink border-b border-line text-[13px]">{row.criteria}</td>
                        <td className="px-6 py-4 font-medium text-[#777] border-b border-l border-line text-[13px]">{row.traditional}</td>
                        <td className="px-6 py-4 border-b border-l border-line text-[13px]">
                          <span className="flex items-start gap-2 font-semibold text-ink">
                            <span className="text-red font-black shrink-0 mt-0.5">✓</span>
                            {row.kalvium}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* University marquee */}
          <section className="border-b border-line bg-soft py-12 overflow-hidden">
            <div className="container-x mb-6">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-red">University Partners</span>
                <span className="text-[13px] font-bold text-[#888]">23+ UGC and AICTE approved institutions</span>
              </div>
            </div>
            <div className="relative">
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-soft to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-soft to-transparent z-10 pointer-events-none" />
              <div
                className="flex gap-4 w-max"
                style={{
                  animation: "marquee-uni 40s linear infinite",
                }}
              >
                {[...universities, ...universities].map((uni, i) => (
                  <div key={`${uni}-${i}`} className="shrink-0 bg-white border border-line rounded-xl px-5 py-3 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red shrink-0" />
                    <span className="text-[13px] font-bold text-ink whitespace-nowrap">{uni}</span>
                  </div>
                ))}
              </div>
            </div>
            <style>{`
              @keyframes marquee-uni {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
            `}</style>
          </section>

          {/* CTA */}
          <section className="bg-ink text-white">
            <div className="container-x">
              <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">
                <div>
                  <h2 className="text-[clamp(26px,3.5vw,42px)] font-black leading-[1.1] tracking-[-0.05em] mb-3">
                    See the Deployment Model next.
                  </h2>
                  <p className="text-white/45 font-medium max-w-lg">
                    Talent is built by the Kalvium Model. It lands in your team through the Deployment Model.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => { switchTab("deployment"); }}
                    className="inline-flex items-center justify-center gap-2 bg-white text-ink font-extrabold text-sm px-6 py-3 rounded-lg hover:bg-white/90 transition-colors whitespace-nowrap"
                  >
                    View Deployment Model
                  </button>
                  <Button href="/start-a-pilot" variant="ghost">Start a Pilot →</Button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
