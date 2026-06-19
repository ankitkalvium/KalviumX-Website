import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  return (
    <section className="bg-soft border-y border-line">
      <div className="container-x">
        <SectionHeading
          eyebrow="Proof by Stakeholder"
          align="center"
          title={
            <>
              Every buyer asks a different question.{" "}
              <span className="red-pill">We answer all three.</span>
            </>
          }
        />
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <Reveal key={t.persona} delay={i * 120}>
              <div className="bg-white border border-line rounded-lg p-7 h-full flex flex-col">
                <span className="inline-flex self-start bg-ink text-white rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.1em] mb-4">
                  {t.persona}
                </span>
                <p className="text-sm font-extrabold text-red mb-3">&ldquo;{t.question}&rdquo;</p>
                <p className="text-[15px] leading-relaxed font-medium text-[#242424] flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 pt-4 border-t border-line flex items-center gap-3">
                  {t.image && (
                    <Image
                      src={t.image}
                      alt={t.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover shrink-0 border border-line"
                    />
                  )}
                  <div>
                    <div className="text-sm font-extrabold">{t.name}</div>
                    <div className="text-xs text-[#666] font-semibold">{t.title}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
