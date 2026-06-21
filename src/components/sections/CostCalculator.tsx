"use client";

import { useMemo, useState, useRef } from "react";
import Link from "next/link";
import posthog from "posthog-js";

const TIERS = [
  {
    label: "Year 2",
    semesters: "Sem 3 & 4",
    total: 35000,
    stipend: 25000,
    fee: 10000,
    commitment: "30 hrs/week, remote",
    fullTime: false,
  },
  {
    label: "Year 3",
    semesters: "Sem 5 & 6",
    total: 45000,
    stipend: 35000,
    fee: 10000,
    commitment: "Full-time, onsite",
    fullTime: true,
  },
  {
    label: "Year 4",
    semesters: "Sem 7 & 8",
    total: 55000,
    stipend: 45000,
    fee: 10000,
    commitment: "Full-time, onsite",
    fullTime: true,
  },
] as const;

const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export default function CostCalculator() {
  const [interns, setInterns] = useState(5);
  const [tierIndex, setTierIndex] = useState(1);
  const [fresherLpa, setFresherLpa] = useState(4);
  const interactedRef = useRef(false);

  const tier = TIERS[tierIndex];

  function trackInteraction(params: { interns: number; tier: string; fresher_lpa: number; saving_pct: number }) {
    if (!interactedRef.current) {
      interactedRef.current = true;
      posthog.capture("cost_calculator_interacted", params);
    }
  }

  const result = useMemo(() => {
    const kxMonthly = interns * tier.total;
    const kxStipend = interns * tier.stipend;
    const kxFee = interns * tier.fee;
    const fresherMonthly = (interns * fresherLpa * 100000) / 12;
    const saving = fresherMonthly - kxMonthly;
    const savingPct = fresherMonthly > 0 ? Math.round((saving / fresherMonthly) * 100) : 0;
    return { kxMonthly, kxStipend, kxFee, fresherMonthly, saving, savingPct };
  }, [interns, tier, fresherLpa]);

  return (
    <section className="bg-ink text-white">
      <div className="container-x">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-xs font-extrabold uppercase tracking-[0.16em] text-red mb-3">
            Cost Comparison
          </span>
          <h2 className="text-[clamp(28px,3.6vw,46px)] font-black leading-[1.1] tracking-[-0.05em]">
            How does KalviumX compare to traditional hiring?
          </h2>
          <p className="mt-4 text-white/60 text-base font-medium">
            Enter your team size and what you currently pay freshers. KalviumX
            costs are exact published figures, not estimates.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-10 items-start">
          {/* Controls */}
          <div className="bg-white/5 rounded-xl p-7 space-y-8">
            {/* Interns slider */}
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <label htmlFor="interns-range" className="text-sm font-extrabold">
                  Interns needed
                </label>
                <span className="text-2xl font-black text-red">{interns}</span>
              </div>
              <input
                id="interns-range"
                type="range"
                min={1}
                max={25}
                value={interns}
                onChange={(e) => {
                const val = Number(e.target.value);
                setInterns(val);
                trackInteraction({ interns: val, tier: tier.label, fresher_lpa: fresherLpa, saving_pct: result.savingPct });
              }}
                className="w-full accent-[#f53333]"
              />
              <div className="flex justify-between text-xs text-white/40 font-bold mt-1">
                <span>1</span>
                <span>25</span>
              </div>
            </div>

            {/* Year tier toggle */}
            <div>
              <p className="text-sm font-extrabold mb-3">Engagement year</p>
              <div className="grid grid-cols-3 gap-2">
                {TIERS.map((t, i) => (
                  <button
                    key={t.label}
                    onClick={() => {
                      setTierIndex(i);
                      trackInteraction({ interns, tier: t.label, fresher_lpa: fresherLpa, saving_pct: result.savingPct });
                    }}
                    className={`rounded-lg py-3 px-2 text-center transition-all ${
                      tierIndex === i
                        ? "bg-red text-white font-extrabold"
                        : "bg-white/10 text-white/60 font-semibold hover:bg-white/20"
                    }`}
                  >
                    <span className="block text-[13px]">{t.label}</span>
                    <span className="block text-[10px] mt-0.5 opacity-70">{t.semesters}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/40 font-medium mt-2">
                {tier.commitment}
              </p>
            </div>

            {/* Fresher CTC slider */}
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <label htmlFor="salary-range" className="text-sm font-extrabold">
                  Your current fresher CTC
                </label>
                <span className="text-2xl font-black text-red">₹{fresherLpa}L</span>
              </div>
              <input
                id="salary-range"
                type="range"
                min={4}
                max={15}
                step={0.5}
                value={fresherLpa}
                onChange={(e) => {
                const val = Number(e.target.value);
                setFresherLpa(val);
                trackInteraction({ interns, tier: tier.label, fresher_lpa: val, saving_pct: result.savingPct });
              }}
                className="w-full accent-[#f53333]"
              />
              <div className="flex justify-between text-xs text-white/40 font-bold mt-1">
                <span>₹4L</span>
                <span>₹15L</span>
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Traditional */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/40 mb-2">
                  Traditional fresher
                </div>
                <div className="text-[clamp(26px,3vw,36px)] font-black tracking-[-0.04em] mb-1">
                  {fmt(result.fresherMonthly)}
                </div>
                <div className="text-sm text-white/50 font-semibold">
                  /month for {interns} hire{interns > 1 ? "s" : ""}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/40 font-semibold space-y-1">
                  <div className="flex justify-between">
                    <span>CTC per head</span>
                    <span>₹{fresherLpa}L/yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly per head</span>
                    <span>{fmt((fresherLpa * 100000) / 12)}</span>
                  </div>
                </div>
              </div>

              {/* KalviumX */}
              <div className="bg-gradient-to-br from-red to-red/70 rounded-xl p-6">
                <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/70 mb-2">
                  KalviumX {tier.label}
                </div>
                <div className="text-[clamp(26px,3vw,36px)] font-black tracking-[-0.04em] mb-1">
                  {fmt(result.kxMonthly)}
                </div>
                <div className="text-sm text-white/80 font-semibold">
                  /month for {interns} intern{interns > 1 ? "s" : ""}
                </div>
                <div className="mt-4 pt-4 border-t border-white/20 text-xs text-white/70 font-semibold space-y-1">
                  <div className="flex justify-between">
                    <span>Stipend ({interns} × {fmt(tier.stipend)})</span>
                    <span>{fmt(result.kxStipend)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Program fee ({interns} × ₹10,000)</span>
                    <span>{fmt(result.kxFee)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Saving */}
            <div className="bg-white text-ink rounded-xl p-6">
              {result.saving >= 0 ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#888] mb-1">
                      Monthly saving vs traditional
                    </div>
                    <div className="text-[clamp(26px,3vw,38px)] font-black tracking-[-0.04em] text-red">
                      {fmt(result.saving)}
                      <span className="text-base font-extrabold text-[#888] ml-2">
                        ({result.savingPct}% less)
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/start-a-pilot"
                    onClick={() => posthog.capture("cost_calculator_cta_clicked", {
                      interns,
                      tier: tier.label,
                      fresher_lpa: fresherLpa,
                      saving_pct: result.savingPct,
                    })}
                    className="inline-flex items-center justify-center rounded-md border-2 border-red bg-red text-white px-6 min-h-12 text-[15px] font-extrabold whitespace-nowrap hover:bg-ink hover:border-ink transition-all"
                  >
                    Get Exact Commercials
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#888] mb-1">
                      Cost delta vs traditional
                    </div>
                    <div className="text-[clamp(20px,2.4vw,30px)] font-black tracking-[-0.04em] text-ink">
                      {fmt(Math.abs(result.saving))} more/month
                    </div>
                    <div className="text-sm text-[#666] font-semibold mt-1">
                      {tier.fullTime
                        ? `But KalviumX deploys experienced ${tier.label} talent in 12 days vs months of campus cycles`
                        : "But KalviumX deploys in 12 days vs months of campus cycles"}
                    </div>
                  </div>
                  <Link
                    href="/start-a-pilot"
                    onClick={() => posthog.capture("cost_calculator_cta_clicked", {
                      interns,
                      tier: tier.label,
                      fresher_lpa: fresherLpa,
                      saving_pct: result.savingPct,
                    })}
                    className="inline-flex items-center justify-center rounded-md border-2 border-red bg-red text-white px-6 min-h-12 text-[15px] font-extrabold whitespace-nowrap hover:bg-ink hover:border-ink transition-all"
                  >
                    Get Exact Commercials
                  </Link>
                </div>
              )}
            </div>

            {/* Honest footnote */}
            {!tier.fullTime && (
              <p className="text-xs text-white/40 font-medium">
                Year 2 interns contribute 30 hrs/week. Compare against part-time or
                contract resources for a like-for-like view.
              </p>
            )}
            <p className="text-xs text-white/40 font-medium">
              KalviumX figures are exact published pricing. Fresher CTC is your
              own input. No hidden assumptions on either side.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
