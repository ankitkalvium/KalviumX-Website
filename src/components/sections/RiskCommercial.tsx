const riskItems = [
  "Mentor intervention when performance gaps appear",
  "Monthly company feedback loop feeds back into student development",
  "Replacement support if the fit genuinely isn't right",
  "Performance notes feed directly into conversion decisions",
];

const commercialItems = [
  "No recruitment fee model",
  "Monthly stipend + program management fee",
  "Year-wise engagement structure (Year 2 -> Year 4)",
  "Built for internship-to-FTE conversion",
];

export default function RiskCommercial() {
  return (
    <section className="bg-soft border-y border-line">
      <div className="container-x grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-line rounded-lg p-9">
          <h2 className="text-[clamp(28px,3.2vw,40px)] font-black tracking-[-0.05em] mb-3">
            What if the fit is <span className="red-pill">not right?</span>
          </h2>
          <p className="text-[#303030] text-base font-medium mb-6">
            Reduce hiring risk with clear performance visibility after deployment.
          </p>
          <ul className="space-y-3.5">
            {riskItems.map((item) => (
              <li key={item} className="flex gap-3 text-[15px] font-semibold text-[#333] leading-snug">
                <span className="text-red font-black shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-line rounded-lg p-9">
          <h2 className="text-[clamp(28px,3.2vw,40px)] font-black tracking-[-0.05em] mb-3">
            Simple commercial <span className="red-pill">model</span>
          </h2>
          <p className="text-[#303030] text-base font-medium mb-6">
            Predictable monthly cost, structured by year of engagement.
          </p>
          <ul className="space-y-3.5">
            {commercialItems.map((item) => (
              <li key={item} className="flex gap-3 text-[15px] font-semibold text-[#333] leading-snug">
                <span className="text-red font-black shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
