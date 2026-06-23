import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import CaseStudyVisual from "@/components/sections/CaseStudyVisual";
import { caseStudies } from "@/lib/data";

// x.kalvium.com is an unrelated WordPress site, not this project.
const SITE_URL = "https://kalvium-x-website.vercel.app";

export const metadata: Metadata = {
  title: "Engineering Intern Deployment Results",
  description:
    "Real outcomes from enterprise engineering teams: 0% intern attrition across 36 months, ~60% cost reduction vs Tier-1 benchmark, GenAI capability added in 4 weeks. Anonymized KalviumX deployment case studies.",
  openGraph: {
    title: "Engineering Intern Deployment Results | KalviumX Case Studies",
    description:
      "Real outcomes from enterprise engineering teams: 0% intern attrition, ~60% cost reduction, GenAI capability in 4 weeks. KalviumX.",
    url: `${SITE_URL}/case-studies`,
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Case Studies", item: `${SITE_URL}/case-studies` },
  ],
};

export default function CaseStudiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="border-b border-line">
        <div className="container-x grid lg:grid-cols-[1fr_0.7fr] gap-12 items-center">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-red mb-4">
              Case Studies
            </div>
            <h1 className="text-[clamp(42px,5.5vw,70px)] font-black leading-[1.03] tracking-[-0.06em]">
              Deployment results, <span className="text-red">made visible</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[#555] font-medium max-w-xl">
              Real outcomes from anonymized engineering teams that deployed KalviumX apprentices across roles and capabilities.
            </p>
          </div>
          <div className="hidden lg:block relative h-64" aria-hidden>
            <div className="absolute left-5 bottom-5 w-14 h-14 bg-red" />
            <div className="absolute right-6 top-6 w-16 h-44 bg-soft" />
            <div className="absolute right-28 top-20 w-12 h-28 bg-[#ededed]" />
            <svg viewBox="0 0 360 220" className="absolute inset-0 w-full h-full" fill="none">
              <path d="m30 185 68-70 57 45 65-91 54 45 64-94" stroke="#f53333" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m316 24 22-4-4 22" stroke="#f53333" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="30" cy="185" r="8" fill="#f53333" />
            </svg>
          </div>
        </div>
      </section>

      <section className="pt-12">
        <div className="container-x space-y-4">
          {caseStudies.map((study) => (
            <Link
              key={study.slug}
              href={`/case-studies/${study.slug}`}
              className="group grid md:grid-cols-[280px_1fr] border border-line border-b-2 border-b-red rounded-lg overflow-hidden bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              <CaseStudyVisual accent={study.accent} />
              <div className="p-7 sm:p-9 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
                <div>
                  <h2 className="text-[clamp(26px,3vw,38px)] font-black leading-[1.02] tracking-[-0.05em]">
                    {study.region === "United Kingdom"
                      ? `UK ${study.company}`
                      : study.region === "Japan"
                        ? `Japan ${study.company}`
                        : study.company}
                  </h2>
                  <div className="mt-3 flex items-center gap-2 text-sm font-bold text-[#555]">
                    <span className="text-red" aria-hidden>◇</span>
                    {study.role}
                  </div>
                  <p className="mt-4 text-[15px] leading-relaxed text-[#444] font-semibold max-w-2xl">
                    <span className="text-ink font-extrabold">Problem:</span> {study.problem}
                  </p>
                  <div className="mt-6 inline-grid grid-cols-[auto_auto] items-stretch gap-3 sm:gap-6">
                    {study.stat.slice(0, 2).map((stat, index) => (
                      <div
                        key={stat.label}
                        className={`min-w-0 ${index === 1 ? "border-l border-line pl-3 sm:pl-6" : ""}`}
                      >
                        <strong className="block text-[clamp(1.35rem,7vw,1.75rem)] sm:text-3xl font-black leading-none tracking-[-0.05em] text-red whitespace-nowrap">
                          {stat.value}
                        </strong>
                        <span className="block mt-1.5 text-[10px] sm:text-xs leading-tight font-bold text-[#555]">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <span className="w-14 h-14 rounded-full border border-[#aaa] grid place-items-center text-red text-2xl group-hover:bg-red group-hover:text-white group-hover:border-red transition-colors" aria-hidden>
                  →
                </span>
              </div>
            </Link>
          ))}

          <div className="border border-line rounded-lg p-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-5 bg-soft">
            <div>
              <h2 className="text-xl font-extrabold tracking-[-0.03em]">Ready to build results like these?</h2>
              <p className="text-sm text-[#555] font-medium mt-1">Share your JD and stack. We&apos;ll map the right talent.</p>
            </div>
            <Button href="/start-a-pilot">Start a Pilot →</Button>
          </div>
        </div>
      </section>
    </>
  );
}
