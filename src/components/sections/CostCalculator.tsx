"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const MONTHS_CAMPUS_CYCLE = 5;
const MONTHS_FRESHER_RAMP = 4;
const KALVIUMX_DEPLOY_DAYS = 12;
const KALVIUMX_RAMP_WEEKS = 3;
const RECRUITER_COST_PER_HIRE = 85000;
const MANAGER_SCREENING_HOURS_PER_HIRE = 30;
const MANAGER_HOURLY_COST = 2500;

export default function CostCalculator() {
  const [interns, setInterns] = useState(5);
  const [fresherSalaryLpa, setFresherSalaryLpa] = useState(6);

  const result = useMemo(() => {
    const monthlySalary = (fresherSalaryLpa * 100000) / 12;
    const campusRecruitmentCost = interns * RECRUITER_COST_PER_HIRE;
    const campusScreeningCost =
      interns * MANAGER_SCREENING_HOURS_PER_HIRE * MANAGER_HOURLY_COST;
    const campusRampCost = interns * monthlySalary * MONTHS_FRESHER_RAMP * 0.7;
    const campusTotal = campusRecruitmentCost + campusScreeningCost + campusRampCost;

    const kxScreeningCost = interns * 4 * MANAGER_HOURLY_COST;
    const kxRampCost = interns * monthlySalary * (KALVIUMX_RAMP_WEEKS / 4.33) * 0.3;
    const kxTotal = kxScreeningCost + kxRampCost;

    return {
      campusTotal,
      kxTotal,
      saved: campusTotal - kxTotal,
      campusWeeks: MONTHS_CAMPUS_CYCLE * 4.33 + MONTHS_FRESHER_RAMP * 4.33,
      kxWeeks: KALVIUMX_DEPLOY_DAYS / 7 + KALVIUMX_RAMP_WEEKS,
    };
  }, [interns, fresherSalaryLpa]);

  const formatInr = (value: number) =>
    `₹${Math.round(value).toLocaleString("en-IN")}`;

  return (
    <section className="bg-ink text-white">
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-xs font-extrabold uppercase tracking-[0.16em] text-red mb-3">
            Cost Comparison
          </span>
          <h2 className="text-[clamp(28px,3.6vw,46px)] font-black leading-[1.1] tracking-[-0.05em]">
            What does your current hiring motion actually cost?
          </h2>
          <p className="mt-4 text-white/60 text-base font-medium">
            Adjust the sliders. Estimates compare a typical campus-hiring +
            fresher-ramp motion against the KalviumX pipeline.
          </p>
        </div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <div className="bg-white/5 rounded-xl p-7 space-y-8">
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <label htmlFor="interns-range" className="text-sm font-extrabold">
                  Interns / junior engineers needed
                </label>
                <span className="text-2xl font-black text-red">{interns}</span>
              </div>
              <input
                id="interns-range"
                type="range"
                min={1}
                max={25}
                value={interns}
                onChange={(e) => setInterns(Number(e.target.value))}
                className="w-full accent-[#f53333]"
              />
              <div className="flex justify-between text-xs text-white/40 font-bold mt-1">
                <span>1</span>
                <span>25</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <label htmlFor="salary-range" className="text-sm font-extrabold">
                  Typical fresher CTC (LPA)
                </label>
                <span className="text-2xl font-black text-red">₹{fresherSalaryLpa}L</span>
              </div>
              <input
                id="salary-range"
                type="range"
                min={3}
                max={15}
                value={fresherSalaryLpa}
                onChange={(e) => setFresherSalaryLpa(Number(e.target.value))}
                className="w-full accent-[#f53333]"
              />
              <div className="flex justify-between text-xs text-white/40 font-bold mt-1">
                <span>₹3L</span>
                <span>₹15L</span>
              </div>
            </div>
            <p className="text-xs text-white/40 font-medium leading-relaxed">
              Estimates only. Campus motion assumes recruitment cost, manager
              screening hours and ~4 months of partial-productivity ramp.
              KalviumX motion assumes shortlist interviews and a 3-week ramp at
              deployed readiness. Exact commercials shared on request.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/40 mb-2">
                  Campus + fresher ramp
                </div>
                <div className="text-3xl font-black tracking-[-0.04em] mb-1">
                  {formatInr(result.campusTotal)}
                </div>
                <div className="text-sm text-white/50 font-semibold">
                  ~{Math.round(result.campusWeeks)} weeks to productivity
                </div>
              </div>
              <div className="bg-gradient-to-br from-red to-red-dark rounded-xl p-6">
                <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-white/70 mb-2">
                  KalviumX pipeline
                </div>
                <div className="text-3xl font-black tracking-[-0.04em] mb-1">
                  {formatInr(result.kxTotal)}
                </div>
                <div className="text-sm text-white/80 font-semibold">
                  ~{Math.round(result.kxWeeks)} weeks to productivity
                </div>
              </div>
            </div>
            <div className="bg-white text-ink rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#888] mb-1">
                  Estimated hidden-cost saving
                </div>
                <div className="text-[clamp(26px,3vw,38px)] font-black tracking-[-0.04em] text-red">
                  {formatInr(Math.max(result.saved, 0))}
                </div>
              </div>
              <Link
                href="/start-a-pilot"
                className="inline-flex items-center justify-center rounded-md border-2 border-red bg-red text-white px-6 min-h-12 text-[15px] font-extrabold whitespace-nowrap hover:bg-ink hover:border-ink transition-all"
              >
                Get Exact Commercials
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
