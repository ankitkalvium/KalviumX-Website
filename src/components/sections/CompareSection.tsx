import SectionHeading from "@/components/ui/SectionHeading";

const normal = [
  "Random applications, no fitment",
  "Weak signals, no project proof",
  "Heavy screening for your team",
  "Interns need training from scratch",
  "Unclear performance and conversion",
];

const kalvium = [
  "Pre-assessed, JD-matched interns",
  "Project and coding visibility upfront",
  "Curated shortlist, faster decisions",
  "Mentor-managed, work-ready talent",
  "Built for strong intern-to-FTE pipeline",
];

export default function CompareSection() {
  return (
    <section>
      <div className="container-x">
        <SectionHeading
          align="center"
          eyebrow="The Difference"
          title={
            <>
              Normal intern hiring vs.{" "}
              <span className="red-pill">KalviumX</span>
            </>
          }
        />
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="border border-line rounded-lg p-9 bg-white">
            <h3 className="text-2xl font-extrabold tracking-[-0.05em] mb-6">
              Normal campus intern hiring
            </h3>
            <ul className="space-y-4">
              {normal.map((item) => (
                <li key={item} className="flex gap-3 items-start text-[15px] font-medium text-[#242424]">
                  <span className="w-[22px] h-[22px] rounded-full bg-[#c9c9c9] text-white grid place-items-center text-xs font-black shrink-0">
                    ✕
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg p-9 bg-gradient-to-br from-red to-red-dark text-white">
            <h3 className="text-2xl font-extrabold tracking-[-0.05em] mb-6">KalviumX intern hiring</h3>
            <ul className="space-y-4">
              {kalvium.map((item) => (
                <li key={item} className="flex gap-3 items-start text-[15px] font-medium">
                  <span className="w-[22px] h-[22px] rounded-full bg-white text-red grid place-items-center text-xs font-black shrink-0">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
