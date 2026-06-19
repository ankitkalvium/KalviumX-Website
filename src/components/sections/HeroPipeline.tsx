"use client";

import { useEffect, useState } from "react";

const rows = [
  { year: "Year 1", desc: "Fundamentals", pct: 100 },
  { year: "Year 2", desc: "30 hrs/wk remote", pct: 78 },
  { year: "Year 3", desc: "Full-time onsite", pct: 45 },
  { year: "Year 4", desc: "Conversion-ready", pct: 20 },
];

const liveStates = ["Matching JD", "Assessing cohort", "Shortlist ready"];

export default function HeroPipeline() {
  const [animated, setAnimated] = useState(false);
  const [liveIndex, setLiveIndex] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setAnimated(true));
    const interval = setInterval(() => {
      setLiveIndex((i) => (i + 1) % liveStates.length);
    }, 2200);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="absolute inset-0 rounded-2xl bg-ink/95 backdrop-blur-sm border border-white/10 p-5 shadow-2xl text-white flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/50">
          Talent Pipeline
        </span>
        <span className="flex items-center gap-2 text-[11px] font-bold text-red bg-white/10 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red animate-pulse" />
          {liveStates[liveIndex]}
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {rows.map((row, i) => (
          <div key={row.year} className="bg-white/5 rounded-lg px-3.5 py-2.5">
            <div className="flex justify-between items-center text-[12px] font-bold mb-1.5">
              <span>{row.year}</span>
              <span className="text-white/50 font-semibold">{row.desc}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-red rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: animated ? `${row.pct}%` : "0%",
                  transitionDelay: `${i * 180}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
