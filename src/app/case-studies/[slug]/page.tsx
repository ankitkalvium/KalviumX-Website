import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import CaseStudyExperience from "@/components/sections/CaseStudyExperience";
import { caseStudies } from "@/lib/data";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) return {};

  return {
    title: study.headline,
    description: study.summary,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  if (!study) notFound();

  const related = caseStudies.filter((item) => item.slug !== study.slug);
  const displayCompany =
    study.region === "United Kingdom"
      ? `UK ${study.company}`
      : study.region === "Japan"
        ? `Japan ${study.company}`
        : study.company;

  return (
    <>
      <section className="border-b border-line py-9 lg:py-12">
        <div className="container-x">
          <div className="flex items-center justify-between gap-5 mb-9">
            <div className="flex items-center gap-2 text-sm font-bold text-[#777]">
              <Link href="/case-studies" className="text-red hover:underline">Case Studies</Link>
              <span aria-hidden>›</span>
              <span>{displayCompany}</span>
            </div>
            <Link href="/case-studies" className="hidden sm:inline-flex text-sm font-extrabold text-red">
              ← Back to results
            </Link>
          </div>

          <div className="grid lg:grid-cols-[1fr_290px] gap-12 items-start">
            <div>
              <h1 className="text-[clamp(38px,5.2vw,66px)] font-black leading-[1.02] tracking-[-0.065em] max-w-4xl">
                {study.headline}
              </h1>
              <div className="w-14 h-1 bg-red mt-6" />
              <p className="mt-6 text-lg leading-relaxed text-[#555] font-medium max-w-3xl">
                {study.problem} {study.summary}
              </p>
            </div>
            <aside className="border-l border-line lg:pl-8 grid grid-cols-2 lg:grid-cols-1 gap-5">
              <MetaItem icon="industry" label="Industry" value={study.industry} />
              <MetaItem icon="calendar" label="Engagement" value={study.duration} />
              <MetaItem icon="capability" label="Capability" value={study.role} />
              <MetaItem icon="location" label="Region" value={study.region} />
            </aside>
          </div>
        </div>
      </section>

      <section className="py-7">
        <div className="container-x bg-ink text-white rounded-lg grid sm:grid-cols-3">
          {study.stat.map((stat, index) => (
            <div
              key={stat.label}
              className={`py-7 px-7 flex items-center gap-4 ${index < study.stat.length - 1 ? "sm:border-r border-white/20" : ""}`}
            >
              <MetricIcon accent={study.accent} index={index} />
              <div>
                <strong className="block text-3xl font-black tracking-[-0.05em]">{stat.value}</strong>
                <span className="block text-xs font-bold text-white/55 mt-1">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Narrative: context + challenge / model / outcome */}
      {(study.context || study.challenge || study.model || study.outcome) && (
        <section>
          <div className="container-x space-y-10">
            {study.context && (
              <div className="max-w-3xl">
                <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-red mb-3">Context</div>
                <p className="text-[17px] leading-relaxed text-[#444] font-medium">{study.context}</p>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: "Challenge", body: study.challenge },
                { label: "Approach", body: study.model },
                { label: "Outcome", body: study.outcome },
              ].map(({ label, body }) => (
                <div key={label} className="border border-line rounded-xl p-7">
                  <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-red mb-4">{label}</div>
                  <p className="text-[15px] leading-relaxed text-[#444] font-medium">{body}</p>
                </div>
              ))}
            </div>

            {study.signal && (
              <div className="border-l-4 border-red pl-6 py-1 max-w-3xl">
                <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-red mb-2">Signal</div>
                <p className="text-[16px] leading-relaxed font-semibold text-ink">{study.signal}</p>
              </div>
            )}

            {study.timeline && study.timeline.length > 0 && (
              <div>
                <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#888] mb-6">How the deployment unfolded</div>
                <div className="grid sm:grid-cols-5 gap-4">
                  {study.timeline.map((item, index) => (
                    <div key={item.step} className="relative">
                      {index < study.timeline.length - 1 && (
                        <div className="hidden sm:block absolute top-5 left-[calc(50%+20px)] right-[-50%] h-px bg-line" />
                      )}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-10 h-10 rounded-full bg-red text-white text-xs font-black grid place-items-center shrink-0">{item.step}</span>
                          <span className="text-sm font-extrabold tracking-[-0.02em]">{item.title}</span>
                        </div>
                        <p className="text-[13px] leading-relaxed text-[#555] font-medium pl-0.5">{item.copy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <CaseStudyExperience accent={study.accent} />

      <section className="bg-soft border-y border-line py-10">
        <div className="container-x grid lg:grid-cols-[1fr_320px] gap-8">
          <div>
            <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#777] mb-4">
              Related case studies
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/case-studies/${item.slug}`}
                  className="group bg-white border border-line rounded-md p-5 flex items-center justify-between gap-4 hover:border-red transition-colors"
                >
                  <div>
                    <strong className="block text-sm">{item.region === "United Kingdom" ? "UK" : item.region} {item.company}</strong>
                    <span className="block text-xs text-[#666] mt-1">{item.stat[0].value} {item.stat[0].label.toLowerCase()}</span>
                  </div>
                  <span className="text-red group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-white border border-line rounded-lg p-6 text-center">
            <h2 className="text-xl font-extrabold tracking-[-0.03em]">Build these results for your team.</h2>
            <Button href="/start-a-pilot" className="mt-5">Start a Pilot →</Button>
          </div>
        </div>
      </section>
    </>
  );
}

function MetaItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-red mt-0.5"><SmallIcon type={icon} /></span>
      <div>
        <span className="block text-[11px] font-bold text-[#777]">{label}</span>
        <strong className="block text-sm leading-snug mt-0.5">{value}</strong>
      </div>
    </div>
  );
}

function MetricIcon({ accent, index }: { accent: string; index: number }) {
  const type = index === 0 ? accent : index === 1 ? "calendar" : "visibility";
  return <span className="text-red shrink-0"><SmallIcon type={type} large /></span>;
}

function SmallIcon({ type, large = false }: { type: string; large?: boolean }) {
  const className = large ? "w-9 h-9" : "w-6 h-6";
  const common = { className, viewBox: "0 0 32 32", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  if (type === "calendar") return <svg {...common}><rect x="5" y="7" width="22" height="20" rx="2" /><path d="M10 4v6M22 4v6M5 13h22M10 18h4M18 18h4M10 23h4" /></svg>;
  if (type === "capability" || type === "model") return <svg {...common}><path d="m16 4 11 6-11 6L5 10l11-6ZM8 14v8l8 5 8-5v-8" /><path d="M27 10v8" /></svg>;
  if (type === "location") return <svg {...common}><path d="M25 13c0 7-9 15-9 15S7 20 7 13a9 9 0 1 1 18 0Z" /><circle cx="16" cy="13" r="3" /></svg>;
  if (type === "industry" || type === "visibility") return <svg {...common}><path d="M5 27V16h5v11M14 27V9h5v18M23 27V4h5v23M3 27h27" /></svg>;
  if (type === "retention") return <svg {...common}><circle cx="11" cy="10" r="4" /><circle cx="22" cy="11" r="3" /><path d="M3 27c1-7 4-11 8-11s8 4 9 11M19 18c5 0 8 3 9 9" /></svg>;
  if (type === "efficiency") return <svg {...common}><path d="M4 26h24M7 22v-6h5v6M15 22V9h5v13M23 22V4h5v18" /><path d="m5 10 6 4 6-7 6 3 6-6" /></svg>;
  if (type === "genai") return <svg {...common}><path d="M12 5a5 5 0 0 0-5 5v1a5 5 0 0 0-2 9 5 5 0 0 0 7 6M20 5a5 5 0 0 1 5 5v1a5 5 0 0 1 2 9 5 5 0 0 1-7 6M16 4v24" /><path d="M10 12h6M16 9h6M9 20h7M16 17h7" /></svg>;
  return <svg {...common}><circle cx="16" cy="16" r="11" /></svg>;
}
