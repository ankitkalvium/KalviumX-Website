import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import CalBookingButton from "@/components/ui/CalBookingButton";
import CostCalculator from "@/components/sections/CostCalculator";
import FaqAccordion from "@/components/sections/FaqAccordion";
import { faqsPricing } from "@/lib/data";

export const metadata: Metadata = {
  title: "Intern Deployment Pricing: Transparent Monthly Cost by Year",
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
            as="h1"
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

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {tiers.map((tier) => {
              const managementItems = ["Mentor oversight", "Performance reviews", "Cohort management", "Deployment support"];
              return (
                <div key={tier.year} className="flex flex-col">
                  {/* Reserved badge row — keeps card tops aligned across all 3 */}
                  <div className="h-8 flex items-center justify-center mb-2">
                    {tier.highlight && (
                      <span className="bg-red text-white text-[11px] font-extrabold tracking-[0.14em] uppercase px-4 py-1 rounded-full">
                        Most popular
                      </span>
                    )}
                  </div>
                  <div className={`rounded-xl border-2 overflow-hidden flex flex-col flex-1 ${tier.highlight ? "border-red" : "border-line"}`}>
                    <div className={`p-7 flex flex-col gap-6 flex-1 ${tier.highlight ? "bg-white" : "bg-soft"}`}>
                      <div>
                        <p className="font-extrabold text-[13px] uppercase tracking-[0.12em] text-red mb-1">{tier.year}</p>
                        <p className="text-sm text-[#666] font-semibold">{tier.semesters}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#888] mb-1">Total monthly cost</p>
                        <p className="text-[clamp(38px,4vw,52px)] font-black tracking-[-0.04em] text-ink leading-none">{formatInr(tier.total)}</p>
                        <p className="text-sm text-[#666] font-semibold mt-1">per intern / month</p>
                      </div>
                      <div className="border-t border-line pt-5 space-y-3">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#888] mb-3">Breakdown</p>
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
                      <div className="mt-auto space-y-3">
                        <div className="border border-line rounded-lg px-4 py-3">
                          <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#888] mb-1">Commitment</p>
                          <p className="text-sm font-extrabold text-ink">{tier.commitment}</p>
                        </div>
                        <div className="border border-line rounded-lg px-4 py-3 bg-white">
                          <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#888] mb-2">Full management included</p>
                          <ul className="space-y-1">
                            {managementItems.map((item) => (
                              <li key={item} className="flex items-center gap-2 text-xs font-semibold text-[#444]">
                                <span className="w-1.5 h-1.5 rounded-full bg-red flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-sm text-[#666] font-semibold text-center">
            Stipend figures are fixed per year tier. The ₹10,000 program management fee is constant across all tiers.
            Exact commercial sheet shared within 1-2 business days of your request.
          </p>
        </div>
      </section>

      {/* Startup special offer */}
      <section className="border-t border-b border-line bg-[#FFF5F5]">
        <div className="container-x">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-red px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-white">
                  Startup Special
                </span>
              </div>
              <h2 className="text-[clamp(26px,3vw,40px)] font-black tracking-[-0.05em] leading-[1.1] text-ink mb-5">
                Under 100 people?{" "}
                <span className="text-red">Zero program fee</span>{" "}
                for your first 6 months.
              </h2>
              <p className="text-[#444] text-base font-medium leading-relaxed mb-4">
                We believe the best partnerships start before you scale. Startups with teams
                under 100 pay only the intern stipend for the first 6 months. No program
                management fee. No catch.
              </p>
              <p className="text-[#777] text-sm font-semibold">
                After 6 months, we revisit the conversation together. If KalviumX is
                working for you, we grow with you. If not, you walk away having built
                real product velocity at stipend cost alone.
              </p>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-line">
              {/* Red accent header */}
              <div className="bg-red px-6 py-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/70 mb-0.5">Startup pricing</p>
                <p className="text-white font-extrabold text-base">Fee waived for 6 months</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  {[
                    { label: "Year 2 interns", regular: "₹35,000/mo", startup: "₹25,000/mo" },
                    { label: "Year 3 interns", regular: "₹45,000/mo", startup: "₹35,000/mo" },
                    { label: "Year 4 interns", regular: "₹55,000/mo", startup: "₹45,000/mo" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between border-b border-line pb-3 last:border-0 last:pb-0"
                    >
                      <span className="text-sm font-semibold text-[#555]">{row.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-[#bbb] line-through font-semibold">{row.regular}</span>
                        <span className="text-sm font-extrabold text-white bg-red rounded-md px-2.5 py-1">{row.startup}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-soft rounded-xl px-5 py-4 border border-line">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#888] mb-1">
                    What you save in 6 months
                  </p>
                  <p className="text-2xl font-black text-ink tracking-[-0.04em]">
                    Up to <span className="text-red">₹60,000</span>
                  </p>
                  <p className="text-xs text-[#888] font-semibold mt-1">
                    per intern over 6 months (₹10,000 fee waived × 6)
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#999] font-semibold mb-4">
                    Check eligibility in a 15-min call. No commitment needed.
                  </p>
                  <CalBookingButton variant="primary" className="w-full justify-center">
                    Check startup eligibility
                  </CalBookingButton>
                </div>
              </div>
            </div>
          </div>
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

    </>
  );
}
