import type { Metadata } from "next";
import CTAForm from "@/components/sections/CTAForm";

export const metadata: Metadata = {
  title: "Start a Pilot | KalviumX",
  description:
    "Share your internship JD and get a curated, pre-assessed shortlist of KalviumX engineering interns in 7-12 days.",
};

const nextSteps = [
  {
    title: "We respond in 1-2 business days",
    desc: "A program lead reviews your JD and books a 30-minute role-discovery call.",
  },
  {
    title: "Talent mapping starts immediately",
    desc: "Your brief is matched against the student pool - skills, projects, availability.",
  },
  {
    title: "Shortlist in 7-12 days",
    desc: "You receive assessed profiles with project proof, scores and mentor notes.",
  },
];

export default function StartAPilotPage() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-x grid lg:grid-cols-[0.95fr_1.05fr] gap-14 items-start">
        <div>
          <span className="inline-block text-xs font-extrabold uppercase tracking-[0.16em] text-red mb-3">
            Start a Pilot
          </span>
          <h1 className="text-[clamp(36px,4.8vw,60px)] font-black leading-[1.06] tracking-[-0.06em] mb-5">
            One JD in. A curated <span className="red-pill">shortlist</span> out.
          </h1>
          <p className="text-lg leading-relaxed text-[#303030] font-medium mb-9 max-w-md">
            Tell us the role and stack you&apos;re hiring for. Share a JD or a
            one-line brief, and we&apos;ll map a small pool of relevant,
            pre-assessed candidates. No resume dump.
          </p>
          <div className="space-y-5 border-l-2 border-red pl-6">
            {nextSteps.map((step, i) => (
              <div key={step.title} className="relative">
                <span className="absolute -left-[31px] top-0.5 w-2.5 h-2.5 rounded-full bg-red" />
                <div className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#888] mb-1">
                  Step {i + 1}
                </div>
                <div className="font-extrabold text-base tracking-[-0.02em] mb-1">{step.title}</div>
                <p className="text-sm text-[#555] font-medium leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <CTAForm source="start-a-pilot" />
      </div>
    </section>
  );
}
