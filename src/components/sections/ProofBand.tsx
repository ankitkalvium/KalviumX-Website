"use client";

import { useState } from "react";
import { trustBrands, type TrustBrand } from "@/lib/data";

const brandfetchClientId = process.env.NEXT_PUBLIC_BRANDFETCH_CLIENT_ID;

function getBrandfetchUrl(domain: string) {
  if (!brandfetchClientId) return undefined;

  return `https://cdn.brandfetch.io/domain/${encodeURIComponent(
    domain
  )}/h/72/theme/light/fallback/404/type/logo?c=${encodeURIComponent(
    brandfetchClientId
  )}`;
}

function BrandItem({ brand }: { brand: TrustBrand }) {
  const brandfetchSrc = getBrandfetchUrl(brand.domain);
  const [src, setSrc] = useState(
    brand.preferLocal ? brand.localSrc : brandfetchSrc ?? brand.localSrc
  );

  if (src) {
    return (
      // Brandfetch Logo API is designed for direct browser embedding so the
      // request includes the page origin as its referrer.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={`${brand.name} logo`}
        height={36}
        referrerPolicy="strict-origin-when-cross-origin"
        className="h-9 w-auto max-w-[180px] object-contain brightness-0 invert"
        onError={() =>
          setSrc((currentSrc) =>
            currentSrc !== brand.localSrc ? brand.localSrc : undefined
          )
        }
      />
    );
  }

  return (
    <span className="text-[#f6f6f6] text-xl sm:text-2xl font-extrabold tracking-[-0.04em]">
      {brand.name}
    </span>
  );
}

function MarqueeTrack() {
  return (
    <div className="flex items-center gap-16 pr-16 shrink-0 animate-marquee-logos" aria-hidden>
      {trustBrands.map((brand, i) => (
        <div key={`${brand.name}-${i}`} className="shrink-0">
          <BrandItem brand={brand} />
        </div>
      ))}
    </div>
  );
}

export default function ProofBand() {
  return (
    <section className="bg-[#161616] text-white py-10 overflow-hidden">
      <div className="container-x">
        <p className="text-center text-base font-bold mb-2">
          Trusted by engineering teams and enterprise partners
        </p>
        <p className="text-center text-white/60 text-sm leading-relaxed max-w-2xl mx-auto mb-7">
          Kalvium talent has worked with engineering teams across enterprise, GCC,
          fintech, retail and SaaS environments.
        </p>
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#161616] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#161616] to-transparent z-10" />
        <div className="flex whitespace-nowrap">
          <MarqueeTrack />
          <MarqueeTrack />
        </div>
      </div>
    </section>
  );
}
