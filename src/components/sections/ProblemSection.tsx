import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const problems = [
  {
    stat: "41%",
    statLabel: "year-one attrition",
    title: "Junior talent leaves before they contribute",
    desc: "Industry average for junior tech hires. Teams restart every hiring cycle before the intern ships a single feature.",
  },
  {
    stat: "6+",
    statLabel: "months to first output",
    title: "Ramp-up swallows the value",
    desc: "Even strong freshers need months of stack learning, codebase context, and process onboarding before they're useful.",
  },
  {
    stat: "5 yrs",
    statLabel: "curriculum lag",
    title: "Universities teach last decade's stack",
    desc: "Students arrive with textbook knowledge. Your team ends up running the upskilling that a degree program should have.",
  },
  {
    stat: "0",
    statLabel: "governance after placement",
    title: "No loop after day one",
    desc: "Campus offices hand over and disappear. Managers absorb mentoring, performance tracking, and intervention entirely.",
  },
  {
    stat: "1x",
    statLabel: "annual hiring window",
    title: "Placement drives are not a pipeline",
    desc: "Campus drives run once a season. You get whoever passed that window, not a continuous supply matched to your JD.",
  },
];

export default function ProblemSection() {
  return (
    <section>
      <div className="container-x">
        <SectionHeading
          eyebrow="The Problem"
          align="center"
          title={
            <>
              Junior hiring is <span className="red-pill">expensive to get wrong</span>
            </>
          }
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {problems.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <div className="border border-line rounded-lg p-7 bg-white h-full flex flex-col gap-5">
                <div className="flex items-end gap-2">
                  <span className="text-[42px] font-black leading-none tracking-[-0.05em] text-red">{p.stat}</span>
                  <span className="text-[11px] font-bold text-[#888] uppercase tracking-[0.12em] pb-1.5">{p.statLabel}</span>
                </div>
                <div>
                  <h3 className="text-[17px] font-extrabold tracking-[-0.03em] mb-2">{p.title}</h3>
                  <p className="text-[#555] text-[14px] leading-relaxed font-medium">{p.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
          <Reveal delay={500}>
            <div className="border-2 border-red rounded-lg p-7 bg-red/[0.03] h-full flex flex-col justify-center">
              <p className="text-[17px] font-extrabold tracking-[-0.02em] text-ink leading-snug">
                KalviumX moves training, stack alignment, and performance governance{" "}
                <span className="red-pill">before deployment.</span>
              </p>
              <p className="mt-4 text-[14px] text-[#555] leading-relaxed font-medium">
                Not another placement drive. A continuous, mentor-managed talent pipeline matched to your JD.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
