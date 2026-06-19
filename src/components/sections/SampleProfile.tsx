import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const chips = ["React", "Node.js", "MongoDB", "REST APIs"];

const stats = [
  { value: "82%", label: "JD assessment score" },
  { value: "3", label: "project proof points" },
  { value: "A", label: "professionalism band" },
  { value: "12d", label: "deployment readiness" },
];

export default function SampleProfile() {
  return (
    <section className="bg-soft border-y border-line">
      <div className="container-x grid lg:grid-cols-[0.82fr_1.18fr] gap-14 items-center">
        <div>
          <SectionHeading
            eyebrow="What You Receive"
            title={
              <>
                See readiness before the <span className="red-pill">interview</span>
              </>
            }
            copy="Every shortlist helps your engineering team decide faster. Not just a resume - a clear view of skills, projects, assessment scores and mentor signal."
          />
        </div>
        <Reveal>
          <div className="bg-white border border-line rounded-xl shadow-xl overflow-hidden">
            <div className="grid sm:grid-cols-[110px_1fr] gap-5 p-6 items-center border-b border-line">
              <div className="h-[110px] w-[110px] rounded-lg relative overflow-hidden shrink-0">
                <Image
                  src="/images/intern-avatar.png"
                  alt="Kalvium intern"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center top" }}
                  sizes="110px"
                />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-[-0.05em] mb-1.5">Sample Intern Profile</h3>
                <p className="text-sm text-[#444] font-semibold leading-snug">
                  Role fit: Full-stack intern
                  <br />
                  Availability: 30 hrs/week remote
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {chips.map((chip) => (
                    <span key={chip} className="bg-ink text-white rounded-full px-2.5 py-1 text-[11px] font-extrabold">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-line">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`p-4 ${i < stats.length - 1 ? "sm:border-r border-line" : ""}`}
                >
                  <b className="block text-2xl tracking-[-0.05em] text-red">{stat.value}</b>
                  <span className="block text-[11px] font-bold text-[#444] leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-6">
              <b className="block text-sm mb-2">Mentor note</b>
              <p className="text-[15px] leading-relaxed font-medium text-[#333]">
                Strong ownership, good API fundamentals, consistent sprint
                participation, needs light support on system design depth.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
