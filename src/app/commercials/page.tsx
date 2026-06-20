import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import CostCalculator from "@/components/sections/CostCalculator";
import FaqAccordion from "@/components/sections/FaqAccordion";
import { faqsPricing } from "@/lib/data";

export const metadata: Metadata = {
  title: "Intern Deployment Pricing: Transparent Monthly Cost by Year | KalviumX",
  description:
    "KalviumX pricing: total monthly cost per intern is ₹35,000 (Year 2), ₹45,000 (Year 3), or ₹55,000 (Year 4). Includes stipend and program management. No placement commission.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqsPricing.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

const tiers = [
  {
    year: "Year 2",
    semesters: "Sem 3 & 4",
    commitment: "30 hrs/week, remote",
    stipend: 25000,
    fee: 10000,
    total: 35000,
    highlight: false,
  },
  {
    year: "Year 3",
    semesters: "Sem 5 & 6",
    commitment: "Full-time, onsite",
    stipend: 35000,
    fee: 10000,
    total: 45000,
    highlight: true,
  },
  {
    year: "Year 4",
    semesters: "Sem 7 & 8",
    commitment: "Full-time, onsite",
    stipend: 45000,
    fee: 10000,
    total: 55000,
    highlight: false,
  },
];

const formatInr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function CommercialsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="border-b border-line bg-soft">
        <div className="container-x">
          <SectionHeading
            eyebrow="Commercials"
            title={
              <>
                Transparent monthly cost.{" "}
                <span className="red-pill">Structured by year.</span>
              </>
            }
            copy="One monthly figure per intern covers everything: their stipend and KalviumX program management. No placement commission, no hidden costs, no surprise invoices."
          />
          <div className="mt-7">
            <Button href="/start-a-pilot">Request Commercial Sheet</Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-line">
        <div className="container-x">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-red mb-4">
              How pricing works
            </p>
            <p className="text-[clamp(16px,1.4vw,20px)] font-semibold text-[#333] leading-relaxed">
              The total monthly cost to your company is made up of two components:
              the intern&apos;s stipend (paid to the student) and a fixed{" "}
              <strong>₹10,000 KalviumX program management fee</strong> per intern
              per month. The program fee covers mentor oversight, structured
              performance reviews, cohort management, and deployment support.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-6">
            {[
              { label: "Intern stipend", note: "Paid to student, varies by year" },
              { label: "+ KalviumX program fee", note: "₹10,000 fixed per intern/month" },
              { label: "= Total monthly cost", note: "One invoice, full visibility" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex-1 min-w-[200px] border border-line rounded-lg px-6 py-5"
              >
                <p className="font-extrabold text-[15px] text-ink">{item.label}</p>
                <p className="text-sm text-[#666] font-medium mt-1">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section>
        <div className="container-x">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-red mb-3">
              Monthly cost per intern
            </p>
            <h2 className="text-[clamp(26px,3vw,40px)] font-black tracking-[-0.05em] leading-[1.1]">
              Pick the engagement year that fits your team
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.year}
                className={`rounded-xl border-2 overflow-hidden flex flex-col ${
                  tier.highlight
                    ? "border-red"
                    : "border-line"
                }`}
              >
                {tier.highlight && (
                  <div className="bg-red text-white text-center text-[11px] font-extrabold tracking-[0.14em] uppercase py-2">
                    Most popular
                  </div>
                )}
                <div className={`p-7 flex flex-col gap-6 flex-1 ${tier.highlight ? "bg-white" : "bg-soft"}`}>
                  {/* Header */}
                  <div>
                    <p className="font-extrabold text-[13px] uppercase tracking-[0.12em] text-red mb-1">
                      {tier.year}
                    </p>
                    <p className="text-sm text-[#666] font-semibold">{tier.semesters}</p>
                  </div>

                  {/* Total */}
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#888] mb-1">
                      Total monthly cost
                    </p>
                    <p className="text-[clamp(38px,4vw,52px)] font-black tracking-[-0.04em] text-ink leading-none">
                      {formatInr(tier.total)}
                    </p>
                    <p className="text-sm text-[#666] font-semibold mt-1">per intern / month</p>
                  </div>

                  {/* Breakdown */}
                  <div className="border-t border-line pt-5 space-y-3">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#888] mb-3">
                      Breakdown
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-[#444]">Intern stipend</span>
                      <span className="text-sm font-extrabold text-ink">{formatInr(tier.stipend)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-[#444]">KalviumX program fee</span>
                      <span className="text-sm font-extrabold text-ink">{formatInr(tier.fee)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-line pt-3 mt-1">
                      <span className="text-sm font-extrabold text-ink">Total</span>
                      <span className="text-sm font-extrabold text-red">{formatInr(tier.total)}</span>
                    </div>
                  </div>

                  {/* Commitment */}
                  <div className="mt-auto border border-line rounded-lg px-4 py-3">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#888] mb-1">
                      Commitment
                    </p>
                    <p className="text-sm font-extrabold text-ink">{tier.commitment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-[#666] font-semibold text-center">
            Stipend figures are fixed per year tier. The ₹10,000 program management fee is constant across all tiers.
            Exact commercial sheet shared within 1-2 business days of your request.
          </p>
        </div>
      </section>

      {/* Cost comparison calculator */}
      <CostCalculator />

      {/* FAQ */}
      <FaqAccordion
        faqs={faqsPricing}
        eyebrow="Pricing FAQ"
        title={
          <>
            Commercial questions, <span className="red-pill">answered</span>
          </>
        }
      />

      {/* CTA */}
      <section className="text-center bg-soft border-t border-line">
        <div className="container-x">
          <h2 className="text-[clamp(28px,3.2vw,42px)] font-black tracking-[-0.05em] mb-4 max-w-2xl mx-auto">
            Get the full commercial breakdown for your role and team size
          </h2>
          <Button href="/start-a-pilot">Request Commercial Sheet</Button>
        </div>
      </section>
    </>
  );
}
