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
        className={`w-auto object-contain brightness-0 invert ${
          brand.name === "7-Eleven"
            ? "h-12 max-w-[48px]"
            : "h-9 max-w-[180px]"
        }`}
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

function BrandSequence({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-10 pr-10 sm:gap-16 sm:pr-16"
      aria-hidden={hidden || undefined}
    >
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
        <div className="absolute inset-y-0 left-0 w-8 sm:w-20 bg-gradient-to-r from-[#161616] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 sm:w-20 bg-gradient-to-l from-[#161616] to-transparent z-10 pointer-events-none" />
        <div className="flex w-max whitespace-nowrap animate-marquee-logos">
          <BrandSequence />
          <BrandSequence hidden />
        </div>
      </div>
    </section>
  );
}
