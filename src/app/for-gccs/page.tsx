import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import FaqAccordion from "@/components/sections/FaqAccordion";
import { faqsGcc } from "@/lib/data";

export const metadata: Metadata = {
  title: "For GCCs | KalviumX",
  description:
    "A predictable, mentor-managed engineering talent pipeline for Global Capability Centres scaling junior engineering teams in India.",
};

const gccPoints = [
  {
    title: "Predictable monthly supply",
    desc: "Plan headcount growth against a continuous pipeline instead of one-off hiring drives.",
  },
  {
    title: "Stack-aligned before day one",
    desc: "Each cohort completes a company-specific bootcamp mapped to your tooling and codebase conventions.",
  },
  {
    title: "Built-in performance governance",
    desc: "Monthly feedback loops and mentor oversight give GCC leadership clean visibility for global stakeholders.",
  },
  {
    title: "Conversion-ready bench",
    desc: "Years 3-4 move to full-time onsite, giving you a pre-vetted bench for permanent roles.",
  },
];

export default function ForGccsPage() {
  return (
    <>
      {/* Hero — split layout with GCC office photo */}
      <section className="border-b border-line bg-soft">
        <div className="container-x grid lg:grid-cols-[1fr_1fr] gap-12 items-center py-16 lg:py-20">
          <div>
            <SectionHeading
              eyebrow="For GCCs"
              title={
                <>
                  A talent pipeline built for{" "}
                  <span className="red-pill">Global Capability Centres</span>
                </>
              }
              copy="GCCs need predictable junior engineering supply with governance that satisfies global stakeholders. KalviumX is structured around exactly that: mapped talent, assessment, deployment and continuous performance reporting."
            />
            <div className="mt-7">
              <Button href="/start-a-pilot">Start a Pilot</Button>
            </div>
          </div>

          <div className="relative h-[360px] lg:h-[420px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/gcc-office.png"
              alt="GCC engineering team in a modern Bengaluru office, Building Global Solutions"
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

      <section>
        <div className="container-x grid sm:grid-cols-2 gap-5">
          {gccPoints.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <div className="border border-line rounded-lg p-7 bg-white h-full">
                <h3 className="text-xl font-extrabold tracking-[-0.03em] mb-2.5">{p.title}</h3>
                <p className="text-[#424242] text-[15px] leading-relaxed font-medium">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="container-x text-center">
          <h2 className="text-[clamp(28px,3.2vw,42px)] font-black tracking-[-0.05em] mb-4">
            Year-wise scaling model
          </h2>
          <p className="max-w-2xl mx-auto text-white/60 text-base font-medium mb-10">
            Build a layered bench across cohorts, each year group at a different
            stage of readiness and commitment.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { year: "Year 1", desc: "Fundamentals build, not yet deployed", commitment: "Not deployed" },
              { year: "Year 2", desc: "Remote contribution, stack-aligned", commitment: "30 hrs/week" },
              { year: "Year 3", desc: "Full-time onsite, broader scope", commitment: "Full-time" },
              { year: "Year 4", desc: "Full-time onsite, conversion-ready", commitment: "Full-time" },
            ].map((row) => (
              <div key={row.year} className="border border-white/10 rounded-lg p-6 bg-white/[0.03] text-left">
                <div className="text-red font-black text-2xl tracking-[-0.04em] mb-2">{row.year}</div>
                <p className="text-white/70 text-sm font-semibold leading-snug mb-3">{row.desc}</p>
                <span className="inline-block bg-white/10 rounded-full px-3 py-1 text-xs font-bold">
                  {row.commitment}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqAccordion
        faqs={faqsGcc}
        eyebrow="GCC FAQ"
        title={
          <>
            What GCC leaders <span className="red-pill">ask first</span>
          </>
        }
      />

      <section className="bg-gradient-to-br from-red to-red-dark text-white text-center">
        <div className="container-x">
          <h2 className="text-[clamp(30px,3.8vw,48px)] font-black leading-[1.08] tracking-[-0.05em] max-w-3xl mx-auto mb-5">
            Build your India engineering bench before your next planning cycle.
          </h2>
          <p className="text-white/85 text-base font-semibold max-w-xl mx-auto mb-8">
            Start with a pilot cohort. Scale quarter by quarter with full
            performance governance built in.
          </p>
          <Button href="/start-a-pilot" variant="dark">
            Start a GCC Pilot
          </Button>
        </div>
      </section>
    </>
  );
}
