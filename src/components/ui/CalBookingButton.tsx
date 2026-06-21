"use client";

import Script from "next/script";

export const CAL_LINK = "ankitkalvi/30min";

interface CalBookingButtonProps {
  calLink?: string;
  children: React.ReactNode;
  variant?: "primary" | "dark" | "ghost" | "outline" | "white-outline";
  className?: string;
}

const variantStyles: Record<NonNullable<CalBookingButtonProps["variant"]>, string> = {
  primary: "bg-red border-red text-white hover:bg-ink hover:border-ink",
  dark: "bg-ink border-ink text-white hover:bg-red hover:border-red",
  ghost: "bg-transparent border-white/40 text-white hover:bg-white hover:text-ink",
  outline: "bg-white border-red text-red hover:bg-red hover:text-white",
  "white-outline": "bg-transparent border-white/40 text-white hover:border-white",
};

export default function CalBookingButton({
  calLink = CAL_LINK,
  children,
  variant = "primary",
  className = "",
}: CalBookingButtonProps) {
  return (
    <>
      <Script
        id="cal-embed-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, [L, namespace, ar[2]])} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", {origin:"https://cal.com"});
Cal("ui", {"styles":{"branding":{"brandColor":"#ff3638"}},"hideEventTypeDetails":false,"layout":"month_view"});`,
        }}
      />
      <button
        type="button"
        data-cal-link={calLink}
        data-cal-origin="https://cal.com"
        className={`inline-flex items-center justify-center rounded-md border-2 px-6 min-h-12 text-[15px] font-extrabold whitespace-nowrap transition-all duration-150 hover:-translate-y-0.5 ${variantStyles[variant]} ${className}`}
      >
        {children}
      </button>
    </>
  );
}
