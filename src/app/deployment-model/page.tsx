import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import InteractiveTimeline from "@/components/sections/InteractiveTimeline";
import FaqAccordion from "@/components/sections/FaqAccordion";
import { faqsProcess } from "@/lib/data";

export const metadata: Metadata = {
  title: "Intern Deployment Model: JD to Deployed Engineer in 12 Days | KalviumX",
  description:
    "How KalviumX deploys pre-assessed, mentor-managed engineering interns in 12 days. Interactive step-by-step breakdown: talent assessment, context sprint, deployment, and ongoing oversight.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqsProcess.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

const ownership = [
  { area: "Work allocation & sprint planning", company: true, kalvium: false },
  { area: "Code review & technical direction", company: true, kalvium: false },
  { area: "Skill fundamentals & coaching", company: false, kalvium: true },
  { area: "Performance tracking & interventions", company: false, kalvium: true },
  { area: "Monthly structured feedback", company: true, kalvium: true },
  { area: "Replacement support", company: false, kalvium: true },
];

export default function DeploymentModelPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="border-b border-line bg-soft">
        <div className="container-x">
          <SectionHeading
            eyebrow="Deployment Model"
            title={
              <>
                Click through every step from JD to{" "}
                <span className="red-pill">deployed intern</span>
              </>
            }
            copy="Each stage below is interactive - click a day to see exactly what happens, who is involved, and what your team receives."
          />
          <div className="mt-7">
            <Button href="/start-a-pilot">Share a JD</Button>
          </div>
        </div>
      </section>

      <InteractiveTimeline />

      <section className="border-b border-line">
        <div className="container-x">
          <SectionHeading
            eyebrow="Before Day 1"
            title={
              <>
                A context sprint. <span className="red-pill">Zero ramp-up tax</span> on your team.
              </>
            }
            copy="Every selected intern completes a 2-3 week company-specific context sprint before joining your standups. Your team inherits someone who already knows your stack, tooling, and conventions."
          />
          <div className="mt-10 grid sm:grid-cols-3 gap-5">
            <div className="border border-line rounded-lg p-7 bg-white">
              <div className="w-9 h-9 rounded-full bg-red/10 text-red grid place-items-center mb-4">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                </svg>
              </div>
              <h3 className="font-extrabold text-base mb-2">Stack and codebase walkthrough</h3>
              <p className="text-sm text-[#555] font-medium leading-relaxed">Mentors run structured sessions on your tech stack, repository structure, and codebase conventions aligned to the intern's JD.</p>
            </div>
            <div className="border border-line rounded-lg p-7 bg-white">
              <div className="w-9 h-9 rounded-full bg-red/10 text-red grid place-items-center mb-4">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                </svg>
              </div>
              <h3 className="font-extrabold text-base mb-2">Tooling and workflow orientation</h3>
              <p className="text-sm text-[#555] font-medium leading-relaxed">Ticketing systems, CI/CD pipelines, sprint conventions, communication tools, and pull request norms covered before the first standup.</p>
            </div>
            <div className="border border-line rounded-lg p-7 bg-white">
              <div className="w-9 h-9 rounded-full bg-red/10 text-red grid place-items-center mb-4">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 className="font-extrabold text-base mb-2">Compliance and access setup</h3>
              <p className="text-sm text-[#555] font-medium leading-relaxed">Company-specific compliance modules, tool access provisioning, and security protocols are completed during the bootcamp window.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-soft border-y border-line">
        <div className="container-x">
          <SectionHeading
            eyebrow="After Deployment"
            align="center"
            title={
              <>
                Who owns <span className="red-pill">what</span>
              </>
            }
            copy="A clean split of responsibilities so your managers are never running a training program."
          />
          <div className="mt-10 max-w-3xl mx-auto overflow-x-auto border border-line rounded-lg bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-ink text-white">
                  <th className="px-6 py-4 font-extrabold">Responsibility</th>
                  <th className="px-6 py-4 font-extrabold text-center">Your team</th>
                  <th className="px-6 py-4 font-extrabold text-center">Kalvium</th>
                </tr>
              </thead>
              <tbody>
                {ownership.map((row, i) => (
                  <tr key={row.area} className={i % 2 === 0 ? "bg-white" : "bg-soft"}>
                    <td className="px-6 py-4 font-semibold">{row.area}</td>
                    <td className="px-6 py-4 text-center">
                      {row.company && <span className="text-red font-black">✓</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.kalvium && <span className="text-red font-black">✓</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <div className="container-x grid md:grid-cols-2 gap-6">
          <div className="border border-line rounded-lg p-8 bg-white">
            <h2 className="text-2xl font-extrabold tracking-[-0.03em] mb-4">During the engagement</h2>
            <ul className="space-y-3.5 text-[15px] font-semibold text-[#333] leading-snug">
              <li className="flex gap-3"><span className="text-red font-black shrink-0">✓</span>Interns work inside your timezone, Monday-Friday, within their committed hours</li>
              <li className="flex gap-3"><span className="text-red font-black shrink-0">✓</span>Mentors run weekly check-ins on both technical output and professional conduct</li>
              <li className="flex gap-3"><span className="text-red font-black shrink-0">✓</span>Interns work inside your sprints, standups and tooling</li>
              <li className="flex gap-3"><span className="text-red font-black shrink-0">✓</span>Escalation path direct to the Kalvium program team</li>
            </ul>
          </div>
          <div className="border border-line rounded-lg p-8 bg-white">
            <h2 className="text-2xl font-extrabold tracking-[-0.03em] mb-4">Monthly feedback loop</h2>
            <ul className="space-y-3.5 text-[15px] font-semibold text-[#333] leading-snug">
              <li className="flex gap-3"><span className="text-red font-black shrink-0">✓</span>Company shares a short structured review each month</li>
              <li className="flex gap-3"><span className="text-red font-black shrink-0">✓</span>Mentors translate feedback into targeted coaching</li>
              <li className="flex gap-3"><span className="text-red font-black shrink-0">✓</span>Issues surfaced through the loop trigger mentor intervention within the same month</li>
              <li className="flex gap-3"><span className="text-red font-black shrink-0">✓</span>Cohort-level reporting available for leadership reviews</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="container-x grid md:grid-cols-[1fr_320px] gap-12 items-center">
          <div>
            <span className="inline-block bg-red text-white font-black text-sm tracking-[0.08em] rounded-md px-5 py-1.5 mb-5">HEROS</span>
            <h2 className="text-[clamp(22px,2.8vw,36px)] font-black leading-[1.14] tracking-[-0.05em]">The same system that curated your shortlist tracks performance throughout the engagement.</h2>
            <p className="mt-3 text-white/60 font-medium leading-relaxed">HEROS data powers Day 2-4 talent mapping. From deployment, it feeds the monthly feedback loop with performance signals, giving mentors early warning before gaps surface on your team.</p>
            <div className="mt-7">
              <Button href="/roles" variant="ghost">See what HEROS tracks →</Button>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/40 mb-5">Live signal dashboard</div>
            {[
              { label: "Skill proficiency", pct: 82 },
              { label: "Project output quality", pct: 91 },
              { label: "Learning velocity", pct: 78 },
              { label: "Professionalism score", pct: 88 },
            ].map(({ label, pct }) => (
              <div key={label} className="mb-4">
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-white/70">{label}</span>
                  <span className="text-red">{pct}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full">
                  <div className="h-full bg-red rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.1em]">Updated continuously</span>
              <span className="text-[10px] font-extrabold text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />Live</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container-x">
          <SectionHeading
            eyebrow="Long-Term Arc"
            align="center"
            title={
              <>
                From intern to <span className="red-pill">full-time hire</span>
              </>
            }
            copy="The engagement is structured across years, not quarters. Each phase compounds output and builds toward conversion."
          />
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="bg-white border border-line rounded-xl p-7">
              <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-red mb-1">Year 2</div>
              <h3 className="text-lg font-extrabold tracking-[-0.03em] mb-3">30 hrs/week, remote</h3>
              <p className="text-[14px] font-medium text-[#444] leading-relaxed">Interns contribute Monday to Friday from their campus location. Full sprint participation. Mentor-managed weekly check-ins. Monthly performance loop with your team.</p>
            </div>
            <div className="bg-white border border-line rounded-xl p-7">
              <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-red mb-1">Year 3</div>
              <h3 className="text-lg font-extrabold tracking-[-0.03em] mb-3">Full-time, onsite available</h3>
              <p className="text-[14px] font-medium text-[#444] leading-relaxed">Students transition to full-time availability from Year 3 onward. Onsite deployment is available. Performance notes from Year 2 carry forward as your FTE readiness signal.</p>
            </div>
            <div className="bg-ink text-white rounded-xl p-7">
              <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-red mb-1">Conversion</div>
              <h3 className="text-lg font-extrabold tracking-[-0.03em] mb-3">FTE path built in</h3>
              <p className="text-[14px] font-medium text-white/70 leading-relaxed">The monthly feedback loop generates a performance record that feeds directly into your FTE decision. No cold interviews. Conversion terms are in the commercial sheet.</p>
            </div>
          </div>
        </div>
      </section>

      <FaqAccordion
        faqs={faqsProcess}
        eyebrow="Process FAQ"
        title={
          <>
            How the motion <span className="red-pill">actually works</span>
          </>
        }
      />

      <section className="bg-ink text-white">
        <div className="container-x text-center max-w-2xl mx-auto">
          <h2 className="text-[clamp(28px,3.5vw,44px)] font-black leading-[1.12] tracking-[-0.05em]">
            Ready to see assessed talent in 12 days?
          </h2>
          <p className="mt-4 text-white/60 font-medium leading-relaxed">Share a JD. Get a curated shortlist. Deploy with mentor coverage from day one.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/start-a-pilot">Start a Pilot</Button>
            <Button href="/commercials" variant="ghost">See Pricing →</Button>
          </div>
        </div>
      </section>
    </>
  );
}
