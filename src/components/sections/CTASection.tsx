import CTAForm from "@/components/sections/CTAForm";

const points = [
  { icon: "✓", label: "Pre-assessed talent" },
  { icon: "↗", label: "Faster time to shortlist" },
  { icon: "∞", label: "Built for intern-to-FTE conversion" },
];

export default function CTASection() {
  return (
    <section id="cta" className="bg-soft">
      <div className="container-x grid lg:grid-cols-[0.9fr_1.1fr] gap-14 items-center">
        <div>
          <h2 className="text-[clamp(36px,4.6vw,58px)] font-black leading-[1.06] tracking-[-0.06em]">
            Share one internship JD. Get a curated{" "}
            <span className="red-pill">shortlist.</span>
          </h2>
          <p className="mt-[18px] text-base leading-relaxed font-semibold text-[#222]">
            Tell us what you need. We&apos;ll map the right students from
            Kalvium&apos;s work-integrated engineering talent pool.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-lg mt-7">
            {points.map((point) => (
              <div key={point.label} className="flex items-center gap-2 text-[13px] font-bold text-[#333]">
                <span className="w-[25px] h-[25px] border-2 border-red text-red rounded-full grid place-items-center shrink-0 text-[13px] font-black">
                  {point.icon}
                </span>
                {point.label}
              </div>
            ))}
          </div>
        </div>
        <CTAForm source="homepage" />
      </div>
    </section>
  );
}
