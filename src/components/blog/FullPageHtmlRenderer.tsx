"use client";

import { useEffect, useRef } from "react";
import type { ExtractedScript } from "@/lib/repo/posts";

// Browsers never execute <script> tags inserted via innerHTML, so the
// importer strips them out and stores them separately (see html-to-post.ts).
// This re-injects them as real <script> DOM nodes after mount, which the
// browser does execute, so embeds/widgets/trackers from the source HTML
// still work on the live page.
export default function FullPageHtmlRenderer({
  html,
  scripts,
  useBrandStyling = false,
  customStyles,
  scopeClass,
}: {
  html: string;
  scripts?: ExtractedScript[];
  useBrandStyling?: boolean;
  // Pre-scoped by the server (see src/lib/css-scope.ts) before reaching this
  // client component — every selector here is already prefixed so it can
  // never leak out and affect the rest of the page (Navbar, Footer, etc.).
  customStyles?: string;
  scopeClass?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scripts?.length || !containerRef.current) return;
    const injected: HTMLScriptElement[] = [];
    for (const script of scripts) {
      const el = document.createElement("script");
      if (script.src) el.src = script.src;
      else if (script.content) el.textContent = script.content;
      else continue;
      containerRef.current.appendChild(el);
      injected.push(el);
    }
    return () => {
      injected.forEach((el) => el.remove());
    };
  }, [scripts]);

  const className = useBrandStyling ? "kx-imported-post" : scopeClass;

  return (
    <>
      {/* Custom-design mode only — brand mode deliberately ignores the
          imported HTML's own <style> tag (see globals.css .kx-imported-post). */}
      {!useBrandStyling && customStyles ? <style dangerouslySetInnerHTML={{ __html: customStyles }} /> : null}
      <div ref={containerRef} className={className} dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
