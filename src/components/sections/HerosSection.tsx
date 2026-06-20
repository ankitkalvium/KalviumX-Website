import Reveal from "@/components/ui/Reveal";

const capabilities = [
  "Skip resume stacks. See assessed skill, project output, and professionalism before your first interview.",
  "HEROS flags performance gaps before deployment so your team receives a mentor-managed fix, not an unresolved problem.",
  "Every shortlist is scored against your JD, not a generic rubric. Signal stays high. Volume stays low.",
  "Performance data from HEROS follows each intern into the engagement, giving your team a live growth record from day one.",
];

export default function HerosSection() {
  return (
    <section className="bg-ink text-white relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(245,51,51,.16), transparent 32%)",
        }}
      />
      <div className="container-x relative">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block bg-red text-white font-black text-lg tracking-[0.08em] rounded-md px-8 py-2.5 mb-7">
            HEROS
          </span>
          <h2 className="text-[clamp(30px,3.8vw,48px)] font-black leading-[1.14] tracking-[-0.05em]">
            You do not hire blind. You see readiness before interview.
          </h2>
          <p className="mt-4 text-white/60 text-base leading-relaxed font-medium max-w-2xl mx-auto">
            HEROS is Kalvium&apos;s learning operating system. It tracks skill growth,
            student activity, mentor inputs and performance signals before companies hire.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {capabilities.map((cap, i) => (
            <Reveal key={cap} delay={i * 100}>
              <div className="bg-gradient-to-br from-red to-red-dark rounded-lg p-7 min-h-[180px] flex flex-col justify-between">
                <span className="text-white/70 font-black text-3xl tracking-[-0.04em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-white text-lg font-bold leading-snug tracking-[-0.02em]">
                  {cap}
                </h3>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
