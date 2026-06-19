import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const problems = [
  {
    title: "Campus hiring is slow",
    desc: "4-6 month cycles, heavy screening effort, and uncertain readiness once students join.",
  },
  {
    title: "Freshers take too long to ramp",
    desc: "Even strong candidates need months of context-building before they can ship meaningful work.",
  },
  {
    title: "Internships lack accountability",
    desc: "Companies end up owning training, mentorship and performance management themselves.",
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
              Hiring junior engineers is <span className="red-pill">broken</span>
            </>
          }
        />
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {problems.map((p, i) => (
            <Reveal key={p.title} delay={i * 120}>
              <div className="border border-line rounded-lg p-7 bg-white shadow-sm h-full">
                <div className="w-10 h-10 rounded-full bg-red/10 text-red grid place-items-center font-black text-lg mb-5">
                  !
                </div>
                <h3 className="text-xl font-extrabold tracking-[-0.03em] mb-2.5">{p.title}</h3>
                <p className="text-[#424242] text-[15px] leading-relaxed font-medium">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="text-center mt-12 text-xl sm:text-2xl font-extrabold tracking-[-0.03em] max-w-3xl mx-auto">
          KalviumX fixes this by moving training, stack alignment, and performance
          management <span className="red-pill">before deployment.</span>
        </p>
      </div>
    </section>
  );
}
