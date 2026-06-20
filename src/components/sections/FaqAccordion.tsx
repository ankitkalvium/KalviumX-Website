"use client";

import { useState, type ReactNode } from "react";
import posthog from "posthog-js";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Faq } from "@/lib/data";

interface FaqAccordionProps {
  faqs: Faq[];
  eyebrow?: string;
  title: ReactNode;
}

export default function FaqAccordion({ faqs, eyebrow = "FAQ", title }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section>
      <div className="container-x max-w-3xl">
        <SectionHeading align="center" eyebrow={eyebrow} title={title} />
        <div className="mt-10 divide-y divide-line border-y border-line">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => {
                    const next = isOpen ? null : i;
                    setOpenIndex(next);
                    if (next !== null) {
                      posthog.capture("faq_expanded", { question: faq.q, index: i });
                    }
                  }}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left py-5 font-extrabold text-lg tracking-[-0.02em]"
                >
                  {faq.q}
                  <span
                    className={`text-red text-2xl font-light shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <p className="overflow-hidden text-[#424242] text-[15px] leading-relaxed font-medium pr-8">
                    <span className="block pb-5">{faq.a}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
