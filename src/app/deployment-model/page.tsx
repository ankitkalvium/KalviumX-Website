import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import InteractiveTimeline from "@/components/sections/InteractiveTimeline";
import FaqAccordion from "@/components/sections/FaqAccordion";
import { faqsProcess } from "@/lib/data";

export const metadata: Metadata = {
  title: "Deployment Model",
  description:
    "How KalviumX moves from JD to deployed, mentor-managed engineering interns in 12 days - interactive step-by-step breakdown.",
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
              <li className="flex gap-3"><span className="text-red font-black shrink-0">✓</span>Year 2 students contribute 30 hrs/week, Monday-Friday, remote</li>
              <li className="flex gap-3"><span className="text-red font-black shrink-0">✓</span>Mentors run weekly check-ins on technical and professional progress</li>
              <li className="flex gap-3"><span className="text-red font-black shrink-0">✓</span>Interns work inside your sprints, standups and tooling</li>
              <li className="flex gap-3"><span className="text-red font-black shrink-0">✓</span>Escalation path direct to the Kalvium program team</li>
            </ul>
          </div>
          <div className="border border-line rounded-lg p-8 bg-white">
            <h2 className="text-2xl font-extrabold tracking-[-0.03em] mb-4">Monthly feedback loop</h2>
            <ul className="space-y-3.5 text-[15px] font-semibold text-[#333] leading-snug">
              <li className="flex gap-3"><span className="text-red font-black shrink-0">✓</span>Company shares a short structured review each month</li>
              <li className="flex gap-3"><span className="text-red font-black shrink-0">✓</span>Mentors translate feedback into targeted coaching</li>
              <li className="flex gap-3"><span className="text-red font-black shrink-0">✓</span>Performance notes inform Year 3/4 deployment and FTE conversion</li>
              <li className="flex gap-3"><span className="text-red font-black shrink-0">✓</span>Cohort-level reporting available for leadership reviews</li>
            </ul>
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
    </>
  );
}
