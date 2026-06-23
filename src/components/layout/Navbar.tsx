"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { navLinks } from "@/lib/data";
import Button from "@/components/ui/Button";

const CAL_LINK = "ankitkalvi/30min";

type CalFunction = (...args: unknown[]) => void;

function LetsTalkButton({
  booked,
  className = "",
  onClick,
}: {
  booked: boolean;
  className?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-cal-link={CAL_LINK}
      data-cal-origin="https://cal.com"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-md border-2 border-ink px-5 min-h-[42px] text-[14px] font-extrabold whitespace-nowrap transition-all duration-300 ${
        booked
          ? "border-green-600 bg-green-50 text-green-700"
          : "text-ink hover:bg-ink hover:text-white"
      } ${className}`}
    >
      {booked ? (
        <>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 shrink-0 animate-[scale-in_0.25s_ease-out]"
            style={{ animation: "navTickPop 0.3s ease-out" }}
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Booked
        </>
      ) : (
        "Let's Talk"
      )}
    </button>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [booked, setBooked] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    const tryListen = () => {
      const cal = (window as { Cal?: CalFunction }).Cal;
      if (typeof cal !== "function") return false;
      cal("on", {
        action: "bookingSuccessful",
        callback: () => {
          posthog.capture("booking_confirmed", { source: "navbar_lets_talk" });
          setBooked(true);
          setTimeout(() => setBooked(false), 3000);
        },
      });
      return true;
    };

    if (!tryListen()) {
      const interval = setInterval(() => {
        if (tryListen()) clearInterval(interval);
      }, 400);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <>
      <Script
        id="cal-embed-navbar"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, [L, namespace, ar[2]])} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", {origin:"https://cal.com"});
Cal("ui", {"styles":{"branding":{"brandColor":"#ff3638"}},"hideEventTypeDetails":false,"layout":"month_view"});`,
        }}
      />
      <style>{`@keyframes navTickPop { 0% { transform: scale(0.4); opacity: 0; } 60% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }`}</style>

      <header className="sticky top-0 z-50 bg-white border-b border-ink">
        <div className="container-x flex items-center justify-between gap-7 h-[72px]">
          <Link href="/" aria-label="KalviumX home">
            <Image
              src="/images/brand/logo-primary.png"
              alt="KalviumX"
              width={184}
              height={34}
              priority
              className="h-[34px] w-auto"
              style={{ height: 34, width: "auto" }}
            />
          </Link>

          <nav className="hidden lg:flex items-center justify-center gap-8 flex-1 text-sm font-bold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`relative py-1 transition-colors hover:text-red ${
                  isActive(link.href)
                    ? "text-red after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:bg-red"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <LetsTalkButton
              booked={booked}
              onClick={() => posthog.capture("lets_talk_clicked")}
            />
            <Button
              href="/start-a-pilot"
              onClick={() => posthog.capture("navbar_cta_clicked", { location: "navbar_desktop" })}
            >
              Get Shortlist
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden flex items-center justify-center w-10 h-10 border-2 border-ink rounded-md"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-ink fill-none" strokeWidth="2.2" strokeLinecap="round">
              {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-line bg-white">
            <nav className="container-x flex flex-col gap-1 py-4 text-base font-bold">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`py-3 border-b border-line last:border-none ${
                    isActive(link.href) ? "text-red" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-3">
                <LetsTalkButton
                  booked={booked}
                  className="w-full"
                  onClick={() => posthog.capture("lets_talk_clicked")}
                />
                <Button
                  href="/start-a-pilot"
                  onClick={() => posthog.capture("navbar_cta_clicked", { location: "navbar_mobile" })}
                  className="w-full"
                >
                  Get Shortlist
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
