import postcss, { type Rule } from "postcss";

// Browsers never scope a <style> tag to where it sits in the DOM — a rule
// like `body { background: #fff }` pasted into one blog post's HTML applies
// to the whole page, including the site's own Navbar and Footer. This
// rewrites every selector so the imported article's CSS only ever affects
// its own container, no matter what the author wrote (full-page resets,
// `body`/`html`/`*` rules included).
export function scopeCss(css: string, scopeClass: string): string {
  if (!css.trim()) return "";
  try {
    const root = postcss.parse(css);
    root.walkRules((rule: Rule) => {
      const parent = rule.parent;
      if (parent && parent.type === "atrule") {
        const name = (parent as { name?: string }).name?.toLowerCase() ?? "";
        // @keyframes selectors are percentages/from/to, not real selectors.
        if (name.includes("keyframes")) return;
      }
      rule.selector = rule.selectors.map((selector) => scopeSelector(selector, scopeClass)).join(", ");
    });
    return root.toString();
  } catch {
    // Malformed CSS from a pasted article — fail safe by dropping it rather
    // than risk unscoped CSS leaking into the rest of the site.
    return "";
  }
}

function scopeSelector(selector: string, scopeClass: string): string {
  const trimmed = selector.trim();
  if (trimmed === "*" || /^(html|body|:root)$/i.test(trimmed)) {
    return `.${scopeClass}`;
  }
  if (trimmed.startsWith("*")) {
    return `.${scopeClass}${trimmed.slice(1)}`;
  }
  if (/^(html|body)\s+/i.test(trimmed)) {
    return `.${scopeClass} ${trimmed.replace(/^(html|body)\s+/i, "")}`;
  }
  return `.${scopeClass} ${trimmed}`;
}
