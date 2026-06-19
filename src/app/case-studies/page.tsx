import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { caseStudies } from "@/lib/data";

export const metadata: Metadata = {
  title: "Case Studies | KalviumX",
  description: "How enterprise and GCC teams deployed KalviumX engineering interns - timelines, outcomes and conversion rates.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <section className="border-b border-line bg-soft">
        <div className="container-x">
          <SectionHeading
            eyebrow="Case Studies"
            align="center"
            title={
              <>
                Teams that need engineers to{" "}
                <span className="red-pill">perform</span>, not just join
              </>
            }
            copy="Illustrative outcomes from companies that have deployed KalviumX talent across full-stack, backend and QA roles."
          />
        </div>
      </section>

      <section>
        <div className="container-x space-y-6">
          {caseStudies.map((cs) => (
            <article key={cs.slug} className="border border-line rounded-lg p-8 bg-white grid md:grid-cols-[1fr_1.4fr] gap-8">
              <div>
                <span className="inline-block bg-soft border border-line rounded-full px-3 py-1 text-xs font-bold mb-3">
                  {cs.industry}
                </span>
                <h2 className="text-2xl font-extrabold tracking-[-0.03em] mb-2">{cs.headline}</h2>
                <p className="text-sm font-bold text-[#555]">{cs.company} &middot; {cs.role}</p>
                <div className="grid grid-cols-3 gap-3 mt-5">
                  {cs.stat.map((s) => (
                    <div key={s.label} className="bg-soft rounded-lg p-3">
                      <b className="block text-lg text-red tracking-[-0.03em]">{s.value}</b>
                      <span className="block text-[11px] font-bold text-[#555] leading-tight">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-lg leading-relaxed font-medium text-[#242424] mb-4">
                  &ldquo;{cs.quote}&rdquo;
                </p>
                <div className="text-sm font-extrabold">{cs.person}</div>
                <div className="text-sm text-[#555] font-semibold">{cs.title}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-soft border-t border-line text-center">
        <div className="container-x">
          <h2 className="text-[clamp(28px,3.2vw,42px)] font-black tracking-[-0.05em] mb-4 max-w-2xl mx-auto">
            Want results like this for your team?
          </h2>
          <Button href="/start-a-pilot">Start a Pilot</Button>
        </div>
      </section>
    </>
  );
}
