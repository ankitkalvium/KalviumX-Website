import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const steps = [
  {
    n: "01",
    title: "Select",
    desc: "Students enter through KNET - aptitude, learnability and psychometric screening.",
  },
  {
    n: "02",
    title: "Train",
    desc: "70 hrs/week Year-1 rigor, daily coding practice, real projects, professional discipline.",
  },
  {
    n: "03",
    title: "Align",
    desc: "Company-specific JD assessment, stack mapping, and a 2-3 week pre-deployment bootcamp.",
  },
  {
    n: "04",
    title: "Deploy",
    desc: "Year 2 remote at 30 hrs/week. Years 3-4 move to full-time onsite engagements.",
  },
  {
    n: "05",
    title: "Manage",
    desc: "Mentor oversight, monthly feedback loops, performance tracking and replacement support.",
  },
];

export default function ModelSteps() {
  return (
    <section className="bg-soft border-y border-line">
      <div className="container-x">
        <SectionHeading
          eyebrow="The KalviumX Model"
          align="center"
          title={
            <>
              We do not find engineers.{" "}
              <span className="red-pill">We build them</span> before you need
              them.
            </>
          }
        />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 100} className="relative">
              <div className="relative bg-white border border-line rounded-lg p-6 pt-7 h-full">
                <span className="text-red font-black text-3xl tracking-[-0.04em]">{step.n}</span>
                <h3 className="text-lg font-extrabold tracking-[-0.03em] mt-3 mb-2">{step.title}</h3>
                <p className="text-[#424242] text-sm leading-relaxed font-medium">{step.desc}</p>
                {i < steps.length - 1 && (
                  <span className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 text-red text-2xl font-light z-10">
                    →
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
