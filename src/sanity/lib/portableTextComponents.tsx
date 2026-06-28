import Image from "next/image";
import Link from "next/link";
import type { PortableTextComponents } from "@portabletext/react";
import { urlForImage } from "@/sanity/lib/image";
import type { SanityImageRef } from "@/sanity/lib/queries";

export const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-12 text-[clamp(24px,3vw,32px)] font-black leading-tight tracking-[-0.03em]">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-9 text-[clamp(20px,2.4vw,26px)] font-extrabold leading-tight tracking-[-0.02em]">{children}</h3>
    ),
    normal: ({ children }) => <p className="mt-5 text-[17px] leading-relaxed text-[#444] font-medium">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-4 border-red pl-5 text-lg font-semibold italic text-ink">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-5 space-y-2 pl-1">{children}</ul>,
    number: ({ children }) => <ol className="mt-5 space-y-2 pl-1 list-decimal list-inside">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-2.5 text-[17px] leading-relaxed text-[#444] font-medium">
        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red" aria-hidden />
        <span>{children}</span>
      </li>
    ),
    number: ({ children }) => <li className="text-[17px] leading-relaxed text-[#444] font-medium">{children}</li>,
  },
  marks: {
    link: ({ value, children }) => (
      <Link
        href={value?.href ?? "#"}
        className="font-bold text-red underline hover:text-red-dark"
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    ),
    strong: ({ children }) => <strong className="font-extrabold text-ink">{children}</strong>,
  },
  types: {
    image: ({ value }: { value: SanityImageRef }) => {
      if (!value?.asset) return null;
      const url = urlForImage(value).width(1200).fit("max").auto("format").url();
      return (
        <span className="mt-8 block overflow-hidden rounded-lg border border-line">
          <Image
            src={url}
            alt={value.alt || ""}
            width={1200}
            height={720}
            className="h-auto w-full"
            sizes="(min-width: 1024px) 720px, 100vw"
          />
        </span>
      );
    },
    // Editor-authored raw HTML (iframe embeds, forms, scripts). Trust
    // boundary: only @kalvium.com Studio editors behind Sanity auth can
    // write this field — same trust level as any other CMS body content.
    htmlEmbed: ({ value }: { value: { html?: string } }) => {
      if (!value?.html) return null;
      return <div className="mt-8" dangerouslySetInnerHTML={{ __html: value.html }} />;
    },
    calloutQuote: ({ value }: { value: { quote?: string; caption?: string; tone?: "dark" | "red" | "light" } }) => {
      if (!value?.quote) return null;
      const toneClass = {
        dark: "bg-ink text-white",
        red: "bg-red text-white",
        light: "bg-soft text-ink",
      }[value.tone ?? "dark"];
      return (
        <div className={`mt-8 rounded-xl p-8 text-center ${toneClass}`}>
          <p className="text-xl font-semibold italic leading-snug">&ldquo;{value.quote}&rdquo;</p>
          {value.caption ? <p className="mt-3 text-sm opacity-70">{value.caption}</p> : null}
        </div>
      );
    },
    comparisonCards: ({
      value,
    }: {
      value: { items?: { tone?: "red" | "dark" | "light"; label?: string; heading?: string; body?: string }[] };
    }) => {
      if (!value?.items?.length) return null;
      const toneClass = {
        red: "bg-red text-white",
        dark: "bg-ink text-white",
        light: "border border-line bg-soft text-ink",
      };
      return (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {value.items.map((item, index) => (
            <div key={index} className={`rounded-xl p-7 ${toneClass[item.tone ?? "light"]}`}>
              {item.label ? <p className="text-xs font-extrabold uppercase tracking-[0.1em] opacity-70">{item.label}</p> : null}
              <p className="mt-3 text-xl font-black leading-snug">{item.heading}</p>
              {item.body ? <p className="mt-2 text-sm leading-relaxed opacity-85">{item.body}</p> : null}
            </div>
          ))}
        </div>
      );
    },
    statGrid: ({ value }: { value: { items?: { value?: string; label?: string; description?: string }[] } }) => {
      if (!value?.items?.length) return null;
      return (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {value.items.map((item, index) => (
            <div key={index} className="rounded-xl border border-line bg-white p-7">
              <p className="text-3xl font-black tracking-[-0.03em] text-red">{item.value}</p>
              <p className="mt-1 text-sm font-extrabold uppercase tracking-[0.08em] text-muted">{item.label}</p>
              {item.description ? <p className="mt-2 text-sm leading-relaxed text-[#555]">{item.description}</p> : null}
            </div>
          ))}
        </div>
      );
    },
    timelineBlock: ({ value }: { value: { items?: { tag?: string; title?: string; body?: string }[] } }) => {
      if (!value?.items?.length) return null;
      return (
        <div className="mt-8">
          {value.items.map((item, index) => (
            <div key={index} className="flex gap-5">
              <div className="flex flex-col items-center">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-sm font-extrabold text-white">
                  {index + 1}
                </span>
                {index < value.items!.length - 1 ? <span className="mt-1 w-px flex-1 bg-line" /> : null}
              </div>
              <div className="pb-8">
                {item.tag ? (
                  <span className="inline-block rounded bg-soft px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-muted">
                    {item.tag}
                  </span>
                ) : null}
                <p className="mt-2 text-base font-extrabold text-ink">{item.title}</p>
                {item.body ? <p className="mt-1 text-sm leading-relaxed text-[#555]">{item.body}</p> : null}
              </div>
            </div>
          ))}
        </div>
      );
    },
    badgeList: ({ value }: { value: { items?: string[] } }) => {
      if (!value?.items?.length) return null;
      return (
        <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
          {value.items.map((item, index) => (
            <div key={index} className="flex items-center gap-3 rounded-lg border border-line bg-soft px-4 py-3 text-sm font-bold text-ink">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red text-[11px] font-black text-white">✓</span>
              {item}
            </div>
          ))}
        </div>
      );
    },
    closingCta: ({
      value,
    }: {
      value: { kicker?: string; heading?: string; body?: string; buttonLabel?: string; buttonHref?: string };
    }) => {
      if (!value?.heading) return null;
      return (
        <div className="mt-10 rounded-xl bg-ink px-8 py-14 text-center text-white">
          {value.kicker ? (
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-red">{value.kicker}</p>
          ) : null}
          <p className="mt-5 text-3xl font-black leading-tight tracking-[-0.03em]">{value.heading}</p>
          {value.body ? <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/70">{value.body}</p> : null}
          {value.buttonLabel && value.buttonHref ? (
            <Link
              href={value.buttonHref}
              className="mt-7 inline-flex items-center justify-center rounded-lg bg-red px-7 py-3.5 text-sm font-extrabold text-white hover:bg-red-dark"
            >
              {value.buttonLabel}
            </Link>
          ) : null}
        </div>
      );
    },
  },
};
