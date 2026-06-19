import Image from "next/image";
import Button from "@/components/ui/Button";

const proofPoints = [
  { value: "0%", label: "attrition" },
  { value: "60%", label: "cheaper" },
  { value: "12 days", label: "to deploy" },
  { value: "Pre-screened", label: "to your JD" },
];

const PulsingCheck = () => (
  <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
    <span className="absolute inline-flex h-1.5 w-1.5 rounded-full bg-sky-400 opacity-75 animate-ping" />
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className="relative">
      <circle cx="6" cy="6" r="5" stroke="#38bdf8" strokeWidth="1.2" />
      <path d="M3.5 6.1l1.7 1.7 3.3-3.3" stroke="#38bdf8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

const PulsingBolt = () => (
  <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
    <span className="absolute inline-flex h-1.5 w-1.5 rounded-full bg-amber-400 opacity-75 animate-ping" />
    <svg width="10" height="11" viewBox="0 0 11 12" fill="none" className="relative">
      <path d="M6.5 1L2 6.5h3.5L4 11l5.5-5.5H6L6.5 1z" fill="#fbbf24" />
    </svg>
  </span>
);

const trustPills = [
  { text: "240+ engineers", icon: "live" as const },
  { text: "UGC / AICTE approved", icon: "check" as const },
  { text: "Industry-grade stack", icon: "bolt" as const },
];

export default function Hero() {
  return (
    <section className="bg-white border-b border-line">
      <div className="container-x grid lg:grid-cols-[1fr_1fr] gap-12 xl:gap-20 items-center">

        {/* LEFT: copy */}
        <div>
          <p className="text-red text-[11px] font-bold tracking-[0.18em] uppercase mb-5">
            Enterprise Engineering Talent
          </p>

          <h1 className="text-[clamp(40px,4.8vw,66px)] font-black leading-[1.03] tracking-[-0.06em] text-ink mb-6">
            Interns who <span className="red-pill">ship.</span><br />
            Not interns you babysit.
          </h1>

          <p className="text-[#424242] text-[17px] leading-relaxed font-medium max-w-[460px] mb-9">
            Their B.Tech runs on real client work, graded on what they deliver,
            so you get output from week one, not a six-month ramp-up. Remote or
            on-site, your call.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-10">
            {proofPoints.map((p, i) => (
              <div key={p.value} className="flex items-center gap-6">
                {i > 0 && (
                  <span className="hidden sm:block w-px h-8 bg-line" />
                )}
                <div>
                  <b className="block text-red text-[19px] font-black tracking-[-0.03em] leading-none">
                    {p.value}
                  </b>
                  <span className="block text-[12px] font-semibold text-ink/40 mt-1">
                    {p.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3.5">
            <Button href="/start-a-pilot">Get Intern Shortlist</Button>
            <Button href="/deployment-model" variant="dark">
              See How Matching Works
            </Button>
          </div>
        </div>

        {/* RIGHT: image with trust pill strip */}
        <div className="hidden lg:flex justify-center">
          <div className="relative w-full max-w-[520px]">

            {/* Image */}
            <div
              className="relative h-[520px] rounded-2xl overflow-hidden"
              style={{
                boxShadow:
                  "0 20px 56px rgba(14,14,14,0.14), 0 4px 14px rgba(14,14,14,0.06)",
              }}
            >
              <Image
                src="/images/hero-tech.png"
                alt="Kalvium engineering students collaborating"
                fill
                className="object-cover object-center"
                priority
                sizes="480px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />

              {/* Trust pill strip — bottom of image */}
              <div className="absolute bottom-0 left-0 right-0 px-4 py-4 backdrop-blur-sm bg-ink/40 border-t border-white/10">
                <div className="flex items-center gap-2">
                  {trustPills.map((pill) => (
                    <div
                      key={pill.text}
                      className="flex flex-1 items-center justify-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5"
                    >
                      {pill.icon === "live" && (
                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                      )}
                      {pill.icon === "check" && <PulsingCheck />}
                      {pill.icon === "bolt" && <PulsingBolt />}
                      <span className="text-white text-[11px] font-bold whitespace-nowrap">
                        {pill.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
