import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import CostCalculator from "@/components/sections/CostCalculator";
import FaqAccordion from "@/components/sections/FaqAccordion";
import { faqsPricing } from "@/lib/data";

export const metadata: Metadata = {
  title: "Intern Hiring Cost: Zero Recruitment Fee, Monthly Stipend Model | KalviumX",
  description:
    "KalviumX pricing: monthly stipend plus program management fee. No recruitment or placement commission. ~60% below Tier-1 talent cost. Structured by year of engagement.",
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

const yearRows = [
  {
    year: "Year 2",
    commitment: "30 hrs/week, remote",
    structure: "Monthly stipend + program management fee",
  },
  {
    year: "Year 3",
    commitment: "Full-time, onsite",
    structure: "Monthly stipend + program management fee",
  },
  {
    year: "Year 4",
    commitment: "Full-time, onsite",
    structure: "Monthly stipend + program management fee",
  },
];

export default function CommercialsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="border-b border-line bg-soft">
        <div className="container-x">
          <SectionHeading
            eyebrow="Commercials"
            title={
              <>
                Predictable monthly cost.{" "}
                <span className="red-pill">Zero recruitment fee.</span>
              </>
            }
            copy="KalviumX runs on a monthly stipend plus a program management fee - structured by year of engagement. No placement commissions, no surprise costs."
          />
          <div className="mt-7">
            <Button href="/start-a-pilot">Request Commercial Sheet</Button>
          </div>
        </div>
      </section>

      <section>
        <div className="container-x">
          <div className="overflow-x-auto border border-line rounded-lg">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-ink text-white">
                  <th className="px-6 py-4 font-extrabold">Engagement Year</th>
                  <th className="px-6 py-4 font-extrabold">Commitment</th>
                  <th className="px-6 py-4 font-extrabold">Commercial Structure</th>
                </tr>
              </thead>
              <tbody>
                {yearRows.map((row, i) => (
                  <tr key={row.year} className={i % 2 === 0 ? "bg-white" : "bg-soft"}>
                    <td className="px-6 py-4 font-extrabold text-red">{row.year}</td>
                    <td className="px-6 py-4 font-semibold">{row.commitment}</td>
                    <td className="px-6 py-4 font-semibold">{row.structure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-sm text-[#555] font-semibold max-w-2xl">
            Exact stipend and program management fee figures are shared in a
            commercial sheet tailored to role, stack and number of interns.
          </p>
        </div>
      </section>

      <CostCalculator />

      <FaqAccordion
        faqs={faqsPricing}
        eyebrow="Pricing FAQ"
        title={
          <>
            Commercial questions, <span className="red-pill">answered</span>
          </>
        }
      />

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
