"use client";

import { useState } from "react";
import { deploymentSteps } from "@/lib/data";

export default function InteractiveTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = deploymentSteps[activeIndex];

  return (
    <section>
      <div className="container-x">
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {deploymentSteps.map((step, i) => (
            <button
              key={step.day}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-pressed={activeIndex === i}
              className={`rounded-full px-5 py-2.5 text-sm font-extrabold border-2 transition-all ${
                activeIndex === i
                  ? "bg-red border-red text-white"
                  : "bg-white border-line text-[#333] hover:border-red hover:text-red"
              }`}
            >
              {step.day}
            </button>
          ))}
        </div>

        <div className="relative h-1.5 rounded-full bg-line max-w-2xl mx-auto mb-10 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-red rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((activeIndex + 1) / deploymentSteps.length) * 100}%` }}
          />
        </div>

        <div className="max-w-3xl mx-auto border border-line rounded-xl p-8 sm:p-10 bg-white shadow-lg">
          <div className="flex items-center gap-4 mb-5">
            <span className="w-12 h-12 rounded-full bg-red text-white grid place-items-center font-black text-lg shrink-0">
              {activeIndex + 1}
            </span>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#888]">
                {activeStep.day}
              </div>
              <h3 className="text-2xl font-black tracking-[-0.04em]">{activeStep.title}</h3>
            </div>
          </div>
          <p className="text-[17px] leading-relaxed font-medium text-[#242424]">
            {activeStep.detail}
          </p>
          <div className="flex justify-between mt-8 pt-5 border-t border-line">
            <button
              type="button"
              onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
              disabled={activeIndex === 0}
              className="text-sm font-extrabold text-red disabled:text-[#bbb] disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((i) => Math.min(deploymentSteps.length - 1, i + 1))
              }
              disabled={activeIndex === deploymentSteps.length - 1}
              className="text-sm font-extrabold text-red disabled:text-[#bbb] disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
