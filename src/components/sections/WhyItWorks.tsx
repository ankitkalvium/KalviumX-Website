import SectionHeading from "@/components/ui/SectionHeading";

const points = [
  {
    vstat: "semester 3",
    title: "Work-integrated from Semester 3",
    desc: "Students move from classroom simulation to real company contribution early - not in their final year.",
  },
  {
    vstat: "proof on day 1",
    title: "Real project portfolio",
    desc: "Every student builds an industry-fit software project by the end of Year 1, with proof you can review.",
  },
  {
    vstat: "GPA = sprint output",
    title: "Professional habits are graded",
    desc: "Attendance, ownership, communication, sprint delivery and discipline are built into evaluation.",
  },
  {
    vstat: "daily / tracked",
    title: "Daily coding practice",
    desc: "Belt-style mastery through Kalvium's DOJO - daily, measurable, and visible to mentors.",
  },
  {
    vstat: "curriculum / live",
    title: "Curriculum updates with industry",
    desc: "Kalvium's Live Books evolve as industry tooling and expectations change.",
  },
  {
    vstat: "always visible",
    title: "Mentor-managed performance",
    desc: "Your team reviews outcomes. Kalvium manages fundamentals, interventions and feedback loops.",
  },
];

export default function WhyItWorks() {
  return (
    <section className="bg-ink text-white">
      <div className="container-x">
        <SectionHeading
          eyebrow="Why It Works"
          align="center"
          title={
            <span className="text-white">
              Why <span className="red-pill">KalviumX</span> talent ramps faster
            </span>
          }
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {points.map((p, i) => (
            <div key={p.title} className="border border-white/10 rounded-lg p-7 bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-[0.14em] text-red mb-3 font-mono">
                {p.vstat}
              </span>
              <span className="block text-red font-black text-2xl tracking-[-0.04em] mb-3">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-extrabold tracking-[-0.03em] mb-2">{p.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed font-medium">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
