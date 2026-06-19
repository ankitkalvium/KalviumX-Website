import { trustLogos } from "@/lib/data";

export default function ProofBand() {
  const doubled = [...trustLogos, ...trustLogos];
  return (
    <section className="bg-[#161616] text-white py-10 overflow-hidden">
      <div className="container-x">
        <p className="text-center text-base font-bold mb-2">
          Trusted by engineering teams and enterprise partners
        </p>
        <p className="text-center text-white/60 text-sm leading-relaxed max-w-2xl mx-auto mb-7">
          Kalvium talent has worked with engineering teams across enterprise, GCC,
          fintech, retail and SaaS environments.
        </p>
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#161616] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#161616] to-transparent z-10" />
        <div className="flex gap-16 whitespace-nowrap animate-marquee w-max">
          {doubled.map((logo, i) => (
            <span
              key={`${logo}-${i}`}
              className="text-[#f6f6f6] text-xl sm:text-2xl font-extrabold tracking-[-0.04em]"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
