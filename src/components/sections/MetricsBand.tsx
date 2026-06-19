import CountUp from "@/components/ui/CountUp";
import { metrics } from "@/lib/data";

export default function MetricsBand() {
  return (
    <section className="py-12 border-b border-line bg-white">
      <div className="container-x grid grid-cols-1 sm:grid-cols-3 gap-8">
        {metrics.map((m) => (
          <div key={m.label} className="text-center">
            <CountUp
              end={m.value}
              prefix={m.prefix}
              suffix={m.suffix}
              className="block text-[clamp(32px,3.6vw,48px)] font-black tracking-[-0.05em] text-red"
            />
            <span className="block mt-1 text-[13px] font-bold text-[#444] leading-snug max-w-[200px] mx-auto">
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
