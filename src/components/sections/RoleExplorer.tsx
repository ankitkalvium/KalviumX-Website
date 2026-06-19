"use client";

import { useMemo, useState } from "react";
import RoleIcon from "@/components/ui/RoleIcon";
import Link from "next/link";
import { roles } from "@/lib/data";

const allStacks = Array.from(new Set(roles.flatMap((role) => role.stack))).sort();

export default function RoleExplorer() {
  const [query, setQuery] = useState("");
  const [activeStacks, setActiveStacks] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return roles.filter((role) => {
      const matchesQuery =
        query.trim() === "" ||
        role.title.toLowerCase().includes(query.toLowerCase()) ||
        role.summary.toLowerCase().includes(query.toLowerCase()) ||
        role.stack.some((s) => s.toLowerCase().includes(query.toLowerCase()));
      const matchesStacks =
        activeStacks.length === 0 ||
        activeStacks.every((stack) => role.stack.includes(stack));
      return matchesQuery && matchesStacks;
    });
  }, [query, activeStacks]);

  function toggleStack(stack: string) {
    setActiveStacks((prev) =>
      prev.includes(stack) ? prev.filter((s) => s !== stack) : [...prev, stack]
    );
  }

  return (
    <section>
      <div className="container-x">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between mb-8">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by role, skill or stack…"
            className="w-full lg:max-w-sm border border-line rounded-md h-12 px-4 text-sm font-medium outline-none focus:border-red"
            aria-label="Search roles"
          />
          <div className="flex flex-wrap gap-2">
            {allStacks.map((stack) => {
              const active = activeStacks.includes(stack);
              return (
                <button
                  key={stack}
                  type="button"
                  onClick={() => toggleStack(stack)}
                  aria-pressed={active}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold border transition-colors ${
                    active
                      ? "bg-red border-red text-white"
                      : "bg-white border-line text-[#333] hover:border-red hover:text-red"
                  }`}
                >
                  {stack}
                </button>
              );
            })}
            {activeStacks.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveStacks([])}
                className="rounded-full px-3.5 py-1.5 text-xs font-bold text-red underline underline-offset-2"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="border-2 border-dashed border-line rounded-lg p-14 text-center">
            <p className="text-lg font-extrabold mb-2">No exact match - yet.</p>
            <p className="text-[#555] text-sm font-medium mb-5 max-w-md mx-auto">
              Custom stacks are covered through the pre-deployment bootcamp. Share
              your JD and we&apos;ll map the closest-fit cohort.
            </p>
            <Link
              href="/start-a-pilot"
              className="inline-flex items-center justify-center rounded-md border-2 border-red bg-red text-white px-6 min-h-12 text-[15px] font-extrabold hover:bg-ink hover:border-ink transition-all"
            >
              Share Your JD
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((role) => (
              <Link
                key={role.slug}
                href={`/roles/${role.slug}`}
                className="group border border-line rounded-lg p-7 bg-white hover:border-red hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="mb-4">
                  <RoleIcon type={role.shortTitle} className="w-10 h-10" />
                </div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-xl font-extrabold tracking-[-0.03em] group-hover:text-red transition-colors">
                    {role.shortTitle}
                  </h3>
                  <span className="bg-soft border border-line rounded-full px-2.5 py-1 text-[11px] font-extrabold text-red whitespace-nowrap">
                    {role.readiness[0]?.value} avg
                  </span>
                </div>
                <p className="text-[#424242] text-[15px] leading-relaxed font-medium mb-4">
                  {role.summary}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {role.stack.map((s) => (
                    <span
                      key={s}
                      className={`rounded-full px-3 py-1 text-xs font-bold border ${
                        activeStacks.includes(s)
                          ? "bg-red border-red text-white"
                          : "bg-soft border-line"
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <span className="text-sm font-extrabold text-red inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  View role details <span aria-hidden>→</span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
