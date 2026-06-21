import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import CalBookingButton from "@/components/ui/CalBookingButton";
import Reveal from "@/components/ui/Reveal";
import FaqAccordion from "@/components/sections/FaqAccordion";
import { faqsEnterprise } from "@/lib/data";
import AudienceTabs from "./AudienceTabs";

export const metadata: Metadata = {
  title: "Engineering Talent for Companies",
  description:
    "One engineering talent model. Every company stakeholder aligned. KalviumX deploys mentor-managed B.Tech engineers for GCCs, MNCs, product companies, and startups, with governance, compliance, and reporting built in.",
  alternates: { canonical: "/for-companies" },
  openGraph: {
    title: "Engineering Talent for Companies | KalviumX",
    description:
      "One engineering talent model. Every company stakeholder aligned. NAPS compliant, mentor-managed, 48-hour shortlist.",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqsEnterprise.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

const rolloutSteps = [
  {
    n: "01",
    title: "Business fit",
    items: ["Problem and roles clearly defined", "Pilot scope and success criteria set"],
  },
  {
    n: "02",
    title: "Operating ownership",
    items: [
      "Work and outcomes owned by your teams",
      "KalviumX support model agreed and documented",
    ],
  },
  {
    n: "03",
    title: "Risk clearance",
    items: ["Legal, security, and IP aligned", "Governance and data access approved"],
  },
  {
    n: "04",
    title: "Scale readiness",
    items: ["Pilot evidence meets quality bar", "Plan for cohort growth and role expansion"],
  },
];

const companySizes = [
  {
    tag: "Startup",
    title: "Move fast. No ramp-up tax.",
    accent: false,
    points: [
      "Production-ready engineers within 48 hours",
      "Mentor-managed so founders stay focused on product",
      "No recruitment overhead or one-off placement fees",
      "Flexible engagement: expand or exit with 30 days notice",
    ],
  },
  {
    tag: "Mid-size",
    title: "Scale supply as your teams grow.",
    accent: true,
    points: [
      "Stack-aligned cohorts per team or product line",
      "Governance model that fits your HR and headcount policy",
      "Start with a pilot, expand without renegotiating",
      "Consistent performance evidence across every cohort",
    ],
  },
  {
    tag: "Large / GCC",
    title: "Multi-team rollout. Full compliance.",
    accent: false,
    points: [
      "Parallel deployment across multiple teams and locations",
      "Legal, procurement, and IP documentation ready to review",
      "Stakeholder-level reporting for engineering, HR, and finance",
      "NAPS and Apprentices Act compliance managed end-to-end",
    ],
  },
];

const addOnFeatures = [
  {
    tag: "Campus Presence",
    title: "Your brand embedded in our university network.",
    desc: "Companies working with KalviumX get visibility across Kalvium's 18 partner universities. Co-branded JDs, campus events, and a pipeline of students already familiar with your stack and culture before they ever reach deployment.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    tag: "L&D",
    title: "Upskilling built around your engineering teams.",
    desc: "AI-driven learning paths mapped to your specific stack and roles. Continuous growth tracks for deployed engineers, structured skill-gap analysis, and team upskilling support that runs alongside active delivery.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    tag: "Regulatory Coverage",
    title: "Full apprenticeship compliance, end-to-end.",
    desc: "For companies where regulatory coverage is a priority: NAPS-compliant contracts, Apprentices Act documentation, and a complete legal framework managed by KalviumX across every engineer you deploy.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
];

const procurementDocs = [
  { title: "Engagement structure", icon: "📄" },
  { title: "IP & confidentiality", icon: "🔒" },
  { title: "Access and security checklist", icon: "🛡️" },
  { title: "Apprenticeship documentation", icon: "🎓" },
  { title: "Exit and replacement terms", icon: "📋" },
];

export default function ForCompaniesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-line bg-soft">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading
              as="h1"
              eyebrow="For Companies"
              title={
                <>
                  One engineering talent model.{" "}
                  <span className="red-pill">Every enterprise stakeholder aligned.</span>
                </>
              }
              copy="Give engineering leaders usable talent, HR a governed workforce model, and legal a clear operating structure, without creating another internal program to run."
            />
            <div className="mt-7 flex flex-wrap gap-4">
              <CalBookingButton variant="primary">Schedule a briefing</CalBookingButton>
              <Button href="/commercials" variant="dark">See pricing</Button>
            </div>
          </div>

          <div className="relative h-[360px] lg:h-[420px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/gcc-office.png"
              alt="Engineering team in a modern office"
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <span className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                Building Global Solutions from Bengaluru
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Four teams evaluate this differently ─────────────────────────── */}
      <section>
        <div className="container-x">
          <SectionHeading
            eyebrow="Stakeholder view"
            title={
              <>
                Four teams evaluate this{" "}
                <span className="red-pill">differently.</span>
              </>
            }
            copy="Each stakeholder has a different question when evaluating a new talent model. Here is how KalviumX answers each one."
          />
          <div className="mt-12">
            <AudienceTabs />
          </div>
        </div>
      </section>

      {/* ── 2b. Built for every team structure ──────────────────────────────── */}
      <section className="border-b border-line">
        <div className="container-x">
          <SectionHeading
            eyebrow="Who it works for"
            title={
              <>
                Built for every{" "}
                <span className="red-pill">team structure.</span>
              </>
            }
            copy="Whether you have a 3-person engineering team or 30,000, KalviumX flexes to your headcount model, governance needs, and growth pace."
          />
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {companySizes.map((size, i) => (
              <Reveal key={size.tag} delay={i * 80}>
                <div className={`rounded-2xl p-8 h-full flex flex-col ${size.accent ? "bg-ink text-white" : "bg-white border border-line"}`}>
                  <span className={`inline-block text-[11px] font-extrabold uppercase tracking-[0.14em] mb-4 ${size.accent ? "text-red" : "text-red"}`}>
                    {size.tag}
                  </span>
                  <h3 className={`text-[20px] font-black tracking-[-0.03em] leading-snug mb-6 ${size.accent ? "text-white" : "text-ink"}`}>
                    {size.title}
                  </h3>
                  <ul className="space-y-3 mt-auto">
                    {size.points.map((point) => (
                      <li key={point} className={`flex items-start gap-2.5 text-[13px] font-semibold leading-snug ${size.accent ? "text-white/70" : "text-[#444]"}`}>
                        <span className="text-red font-black shrink-0 mt-0.5">✓</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. What needs to be true before rollout ──────────────────────────── */}
      <section className="bg-soft border-y border-line">
        <div className="container-x">
          <SectionHeading
            eyebrow="Before rollout"
            align="center"
            title={
              <>
                What needs to be true before{" "}
                <span className="red-pill">enterprise rollout.</span>
              </>
            }
            copy="KalviumX runs a structured pre-rollout checklist with your team so every stakeholder is aligned before the first engineer is deployed."
          />

          <div className="mt-14 relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-[22px] left-[1.375rem] right-[calc(25%-2.5rem)] h-0.5 bg-line" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rolloutSteps.map((step, i) => (
                <Reveal key={step.n} delay={i * 80}>
                  <div className="relative">
                    <div className="relative z-10 w-11 h-11 rounded-full bg-red text-white grid place-items-center font-black text-sm mb-5 mx-auto lg:mx-0">
                      {step.n}
                    </div>
                    <h3 className="text-[17px] font-extrabold tracking-[-0.03em] mb-4">
                      {step.title}
                    </h3>
                    <ul className="space-y-2.5">
                      {step.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-[13px] font-semibold text-[#444]"
                        >
                          <span className="text-red font-black mt-0.5 shrink-0">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Governance ────────────────────────────────────────────────────── */}
      <section className="bg-ink text-white">
        <div className="container-x">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.16em] text-red mb-4">
                Governance
              </span>
              <h2 className="text-[clamp(26px,3vw,38px)] font-black leading-[1.1] tracking-[-0.05em] mb-5">
                We stay connected to every team. You focus on delivery.
              </h2>
              <p className="text-white/60 text-[14px] font-semibold leading-relaxed mb-8">
                KalviumX runs structured check-ins with your engineering, HR, and leadership teams. We surface issues, coordinate interventions, and keep all stakeholders in sync without adding to your team&apos;s plate.
              </p>
              <ul className="space-y-3">
                {[
                  "Regular touchpoints with each stakeholder team",
                  "Intervention tracking and escalation handled by us",
                  "Summary reports shared on your cadence",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[13px] font-semibold text-white/70">
                    <span className="text-red font-black shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: hub graphic */}
            <div className="flex items-center justify-center py-8 lg:py-0">
              <svg
                viewBox="0 0 480 300"
                className="w-full max-w-[480px]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <path id="path-tl" d="M189 123 L102 78" />
                  <path id="path-tr" d="M291 123 L378 78" />
                  <path id="path-bl" d="M189 177 L102 222" />
                  <path id="path-br" d="M291 177 L378 222" />
                </defs>

                <path d="M189 123 L102 78" stroke="white" strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="4 5" />
                <path d="M291 123 L378 78" stroke="white" strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="4 5" />
                <path d="M189 177 L102 222" stroke="white" strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="4 5" />
                <path d="M291 177 L378 222" stroke="white" strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="4 5" />

                <circle r="2.5" fill="#ff3638">
                  <animateMotion dur="2.4s" repeatCount="indefinite" begin="0s">
                    <mpath xlinkHref="#path-tl" />
                  </animateMotion>
                </circle>
                <circle r="2.5" fill="#ff3638">
                  <animateMotion dur="2.8s" repeatCount="indefinite" begin="0.6s">
                    <mpath xlinkHref="#path-tr" />
                  </animateMotion>
                </circle>
                <circle r="2.5" fill="#ff3638">
                  <animateMotion dur="2.6s" repeatCount="indefinite" begin="1.2s">
                    <mpath xlinkHref="#path-bl" />
                  </animateMotion>
                </circle>
                <circle r="2.5" fill="#ff3638">
                  <animateMotion dur="3s" repeatCount="indefinite" begin="0.3s">
                    <mpath xlinkHref="#path-br" />
                  </animateMotion>
                </circle>

                <circle cx="68" cy="60" r="38" fill="#1a1a1a" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
                <text x="68" y="55" textAnchor="middle" fill="white" fillOpacity="0.85" fontSize="9.5" fontWeight="700" fontFamily="Inter, sans-serif">Engineering</text>
                <text x="68" y="68" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="8.5" fontFamily="Inter, sans-serif">Leader</text>

                <circle cx="412" cy="60" r="38" fill="#1a1a1a" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
                <text x="412" y="55" textAnchor="middle" fill="white" fillOpacity="0.85" fontSize="9.5" fontWeight="700" fontFamily="Inter, sans-serif">HR /</text>
                <text x="412" y="68" textAnchor="middle" fill="white" fillOpacity="0.85" fontSize="9.5" fontWeight="700" fontFamily="Inter, sans-serif">Workforce</text>

                <circle cx="68" cy="240" r="38" fill="#1a1a1a" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
                <text x="68" y="235" textAnchor="middle" fill="white" fillOpacity="0.85" fontSize="9.5" fontWeight="700" fontFamily="Inter, sans-serif">Legal /</text>
                <text x="68" y="248" textAnchor="middle" fill="white" fillOpacity="0.85" fontSize="9.5" fontWeight="700" fontFamily="Inter, sans-serif">Procurement</text>

                <circle cx="412" cy="240" r="38" fill="#1a1a1a" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" />
                <text x="412" y="238" textAnchor="middle" fill="white" fillOpacity="0.85" fontSize="9.5" fontWeight="700" fontFamily="Inter, sans-serif">Finance</text>
                <text x="412" y="251" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="8.5" fontFamily="Inter, sans-serif">Team</text>

                <circle cx="240" cy="150" r="58" fill="#0d0d0d" stroke="#ff3638" strokeWidth="2" />
                <text x="240" y="145" textAnchor="middle" fill="white" fontSize="13" fontWeight="800" fontFamily="Inter, sans-serif" letterSpacing="-0.4">KalviumX</text>
                <text x="240" y="162" textAnchor="middle" fill="white" fillOpacity="0.45" fontSize="9.5" fontFamily="Inter, sans-serif">Operating Layer</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Everything procurement asks for ───────────────────────────────── */}
      <section className="bg-soft border-y border-line">
        <div className="container-x">
          <SectionHeading
            eyebrow="Procurement ready"
            title={
              <>
                Everything procurement asks for,{" "}
                <span className="red-pill">in one place.</span>
              </>
            }
            copy="No hunting across teams for documentation. Every document your procurement and legal team needs is maintained and available on request."
          />

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {procurementDocs.map((doc, i) => (
              <Reveal key={doc.title} delay={i * 60}>
                <div className="bg-white border border-line rounded-xl p-6 flex items-start gap-4 h-full">
                  <div className="text-2xl shrink-0">{doc.icon}</div>
                  <div>
                    <h3 className="text-[15px] font-extrabold tracking-[-0.02em] mb-2">
                      {doc.title}
                    </h3>
                    <span className="inline-block text-[11px] font-bold text-red uppercase tracking-[0.08em]">
                      Available for review
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={300}>
              <div className="bg-red rounded-xl p-6 flex flex-col justify-between h-full min-h-[100px]">
                <p className="text-white font-extrabold text-[15px] tracking-[-0.02em] mb-4">
                  Request enterprise documentation
                </p>
                <Link
                  href="/start-a-pilot"
                  className="inline-flex items-center gap-2 text-white font-black text-[14px] hover:gap-3 transition-all"
                >
                  Get the full pack
                  <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current" aria-hidden>
                    <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
                  </svg>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 7. Start contained. Scale with evidence. ─────────────────────────── */}
      <section>
        <div className="container-x">
          <SectionHeading
            eyebrow="How to start"
            title={
              <>
                Start contained.{" "}
                <span className="red-pill">Scale with evidence.</span>
              </>
            }
            copy="Every enterprise engagement starts as a pilot. The model is proven before you expand it."
          />

          <div className="mt-12 grid lg:grid-cols-[1fr_260px] gap-10 items-start">
            {/* Steps flow */}
            <div className="grid sm:grid-cols-3 gap-0">
              {[
                {
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  ),
                  title: "Pilot cohort",
                  sub: "2-5 engineers",
                  desc: "Run real work with clear scope and success criteria.",
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  ),
                  title: "Review checkpoint",
                  sub: null,
                  desc: "Evaluate outcomes with your teams and governance view.",
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                    </svg>
                  ),
                  title: "Scale decision",
                  sub: null,
                  desc: "Expand cohort size, roles, and workstreams.",
                },
              ].map((step, i) => (
                <div key={step.title} className={`relative p-6 ${i > 0 ? "sm:border-l border-t sm:border-t-0 border-line" : ""}`}>
                  <div className="w-10 h-10 rounded-full border-2 border-red bg-white text-red grid place-items-center mb-4">
                    {step.icon}
                  </div>
                  {i < 2 && (
                    <span className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 text-red font-bold text-base leading-none">→</span>
                  )}
                  <h3 className="text-[15px] font-extrabold tracking-[-0.02em]">
                    {step.title}
                  </h3>
                  {step.sub && (
                    <p className="text-red text-[12px] font-bold mt-0.5">{step.sub}</p>
                  )}
                  <p className="text-[13px] font-medium text-[#555] leading-relaxed mt-2">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Decision criteria */}
            <div className="bg-soft border border-line rounded-xl p-6">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#888] mb-4">
                Decision criteria
              </p>
              <ul className="space-y-3">
                {[
                  "Output quality",
                  "Manager load",
                  "Governance quality",
                  "Role expansion readiness",
                ].map((c) => (
                  <li key={c} className="flex items-center gap-2.5 text-[14px] font-semibold text-ink">
                    <span className="text-red font-black text-sm shrink-0">✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7b. Extend your engagement ──────────────────────────────────────── */}
      <section className="bg-soft border-y border-line">
        <div className="container-x">
          <SectionHeading
            eyebrow="Go further"
            title={
              <>
                More ways to build{" "}
                <span className="red-pill">with KalviumX.</span>
              </>
            }
            copy="Beyond base deployment, companies work with us on campus brand presence, team capability growth, and full regulatory coverage."
          />
          <div className="mt-12 grid sm:grid-cols-3 gap-6">
            {addOnFeatures.map((feature, i) => (
              <Reveal key={feature.tag} delay={i * 80}>
                <div className="bg-white border border-line rounded-2xl p-8 h-full flex flex-col">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-red mb-5 block">
                    {feature.tag}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-red/8 text-red grid place-items-center mb-5 shrink-0">
                    {feature.icon}
                  </div>
                  <h3 className="text-[17px] font-extrabold tracking-[-0.03em] leading-snug mb-3 text-ink">
                    {feature.title}
                  </h3>
                  <p className="text-[13px] font-medium text-[#555] leading-relaxed mt-auto pt-3">
                    {feature.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <FaqAccordion
        faqs={faqsEnterprise}
        eyebrow="Enterprise FAQ"
        title={
          <>
            Questions legal, HR, and tech{" "}
            <span className="red-pill">ask first</span>
          </>
        }
      />

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-red to-red-dark text-white">
        <div className="container-x">
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <h2 className="text-[clamp(28px,3.5vw,48px)] font-black leading-[1.06] tracking-[-0.05em]">
                Bring one open role.
                <br />
                Leave with an enterprise rollout plan.
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <CalBookingButton variant="dark">
                Book a conversation
              </CalBookingButton>
              <Link
                href="/commercials"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border-2 border-white/40 text-white font-bold text-[15px] hover:border-white transition-colors whitespace-nowrap"
              >
                Get the commercial sheet
                <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current" aria-hidden>
                  <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
