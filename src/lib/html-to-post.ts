function extractTag(html: string, tag: string): string {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? match[1] : "";
}

function extractMetaContent(html: string, attr: "name" | "property", value: string): string {
  const re = new RegExp(`<meta[^>]*${attr}=["']${value}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0] ?? "";
  return tag.match(/content=["']([^"']*)["']/i)?.[1] ?? "";
}

function extractLinkHref(html: string, rel: string): string {
  const re = new RegExp(`<link[^>]*rel=["']${rel}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0] ?? "";
  return tag.match(/href=["']([^"']*)["']/i)?.[1] ?? "";
}

function extractFirstImageSrc(html: string): string {
  return html.match(/<img[^>]*src=["']([^"']*)["']/i)?.[1] ?? "";
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 96);
}

export interface ExtractedScript {
  src?: string;
  content?: string;
}

export interface PostFromHtml {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  authorName: string;
  publishedAt: string;
  fullPageHtml: string;
  customStyles: string;
  scripts: ExtractedScript[];
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  canonicalUrl: string;
}

// Browsers don't execute <script> tags inserted via innerHTML — that's
// standard DOM behavior, not something dangerouslySetInnerHTML can work
// around. So scripts are stripped out of the body here and returned
// separately; the renderer re-injects them as real script elements on the
// client (see FullPageHtmlRenderer) so embeds/widgets/trackers still run.
function extractScripts(bodyHtml: string): { body: string; scripts: ExtractedScript[] } {
  const scripts: ExtractedScript[] = [];
  const body = bodyHtml.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (_match, attrs: string, content: string) => {
    const src = attrs.match(/src=["']([^"']*)["']/i)?.[1];
    const trimmedContent = content.trim();
    if (src) {
      scripts.push({ src });
    } else if (trimmedContent) {
      scripts.push({ content: trimmedContent });
    }
    return "";
  });
  return { body, scripts };
}

// Turns a full standalone HTML article (own <style>, own hero/nav/footer
// markup) into the document shape the `post` schema expects. Shared between
// the `seed-html-post` CLI script and the admin "Import HTML" web form so
// both stay in sync.
export function buildPostFromHtml(html: string, customSlug?: string): PostFromHtml {
  const rawTitle = stripTags(extractTag(html, "title")) || "Untitled post";
  // Strips any KalviumX brand suffix after a dash, not just an exact
  // "— KalviumX" ending — handles "— KalviumX Engineering Intelligence" and
  // similar longer taglines too.
  const title = rawTitle.replace(/\s*[—|-]\s*KalviumX\b.*$/i, "").trim();
  const slug = customSlug || slugify(title);
  if (!slug) throw new Error("Could not derive a slug from this HTML. Provide one explicitly.");

  // Kept separate from fullPageHtml (not prepended as a <style> tag) so the
  // renderer can choose whether to apply it (custom-design mode) or ignore
  // it in favor of the site's own brand typography (brand-styling mode).
  const customStyles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n");
  const rawBodyContent = extractTag(html, "body");
  if (!rawBodyContent) {
    throw new Error("Could not find a <body> tag in this HTML — is this a full HTML document?");
  }
  const { body: fullPageHtml, scripts } = extractScripts(rawBodyContent);

  const heroParagraph = fullPageHtml.match(/<p[^>]*class="[^"]*hero-sub[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
  const firstParagraph = fullPageHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  const excerptSource = heroParagraph?.[1] || firstParagraph?.[1] || title;
  const excerpt = stripTags(excerptSource).slice(0, 200);

  const metaDescription = extractMetaContent(html, "name", "description");
  const ogTitle = extractMetaContent(html, "property", "og:title");
  const ogDescription = extractMetaContent(html, "property", "og:description");
  const ogImage = extractMetaContent(html, "property", "og:image") || extractFirstImageSrc(rawBodyContent);
  const canonicalUrl = extractLinkHref(html, "canonical");

  return {
    id: `post-${slug}`,
    title,
    slug,
    excerpt,
    authorName: "KalviumX Team",
    publishedAt: new Date().toISOString(),
    fullPageHtml,
    customStyles,
    scripts,
    seoTitle: (ogTitle || title).slice(0, 70),
    seoDescription: (metaDescription || ogDescription || excerpt).slice(0, 160),
    ogImageUrl: ogImage,
    canonicalUrl,
  };
}
