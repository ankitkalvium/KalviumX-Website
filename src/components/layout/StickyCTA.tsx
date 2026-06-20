"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/start-a-pilot") return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      <Link
        href="/start-a-pilot"
        onClick={() => posthog.capture("sticky_cta_clicked", { source_path: pathname })}
        className="flex items-center gap-2 bg-red text-white rounded-full pl-5 pr-6 py-3.5 text-sm font-extrabold shadow-2xl hover:bg-ink transition-colors"
      >
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        Share a JD, get a shortlist
      </Link>
    </div>
  );
}
