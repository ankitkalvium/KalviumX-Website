import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

const pillars = [
  {
    number: "01",
    title: "Real work, real grade",
    desc: "Every feature shipped, every sprint completed, every code review passed contributes directly to the student's academic CGPA. Not extra credit. The actual degree.",
  },
  {
    number: "02",
    title: "Flaking fails the semester",
    desc: "A student who disengages from your team doesn't just lose the internship. They fail the academic module tied to it. The stakes are built into the program structure.",
  },
  {
    number: "03",
    title: "Mentors close the loop",
    desc: "Company feedback goes to Kalvium mentors who translate it into academic signals. Performance gaps are caught early, not at the exit interview.",
  },
];

export default function GradeSection() {
  return (
    <section className="bg-ink text-white">
      <div className="container-x grid lg:grid-cols-[1fr_1fr] gap-16 items-center">
        <div>
          <p className="text-red text-[11px] font-bold tracking-[0.18em] uppercase mb-5">
            Why they don&apos;t flake
          </p>
          <h2 className="text-[clamp(34px,4.2vw,58px)] font-black leading-[1.04] tracking-[-0.055em] mb-6">
            Their work is <span className="red-pill">their grade.</span>
          </h2>
          <p className="text-white/65 text-[17px] leading-relaxed font-medium max-w-[480px] mb-9">
            KalviumX apprentices are enrolled in a UGC/AICTE-approved B.Tech where
            enterprise output is the academic unit of measurement. The company
            performance review and the university grade are the same thing.
          </p>
          <Button href="/start-a-pilot" variant="ghost">
            See how it works
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {pillars.map((pillar) => (
            <div
              key={pillar.number}
              className="border border-white/10 rounded-xl p-6 flex gap-5 items-start bg-white/[0.03]"
            >
              <span className="text-red text-2xl font-black shrink-0 mt-0.5">{pillar.number}</span>
              <div>
                <h3 className="text-[16px] font-extrabold tracking-[-0.02em] mb-2">{pillar.title}</h3>
                <p className="text-white/55 text-[14px] leading-relaxed font-medium">{pillar.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
