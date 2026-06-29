import { defineField, defineType } from "sanity";
import badgeList from "./blocks/badgeList";
import calloutQuote from "./blocks/calloutQuote";
import closingCta from "./blocks/closingCta";
import comparisonCards from "./blocks/comparisonCards";
import statGrid from "./blocks/statGrid";
import timelineBlock from "./blocks/timelineBlock";

export default defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      description: "Short summary shown on the blog index and used as a fallback meta description.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      description: "Optional when using Full custom HTML below. Only used for the thumbnail on the blog index.",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "authorName",
      title: "Author name",
      type: "string",
      initialValue: "KalviumX Team",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (rule) => rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "body",
      title: "Body",
      description: "Leave empty if you're using Full custom HTML below instead.",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
        },
        {
          type: "object",
          name: "htmlEmbed",
          title: "HTML embed",
          fields: [
            defineField({
              name: "html",
              title: "Raw HTML",
              description: "Paste raw HTML, an iframe embed, or a script snippet. Rendered as-is on the page, use only trusted content.",
              type: "text",
              rows: 8,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { html: "html" },
            prepare: ({ html }: { html?: string }) => ({
              title: "HTML embed",
              subtitle: html ? `${html.slice(0, 60)}...` : "Empty",
            }),
          },
        },
        calloutQuote,
        comparisonCards,
        statGrid,
        timelineBlock,
        badgeList,
        closingCta,
      ],
      validation: (rule) =>
        rule.custom((body, context) => {
          const hasFullPageHtml = Boolean((context.document as { fullPageHtml?: string } | undefined)?.fullPageHtml);
          if (hasFullPageHtml) return true;
          return body && body.length > 0 ? true : "Required unless Full custom HTML is set";
        }),
    }),
    defineField({
      name: "fullPageHtml",
      title: "Full custom HTML (advanced)",
      description:
        "If set, this completely replaces the structured Body above for this post's content area. Paste a full HTML article's <body> content. The page header/breadcrumb above it always matches the site, regardless of this setting.",
      type: "text",
      rows: 24,
    }),
    defineField({
      name: "useBrandStyling",
      title: "Match KalviumX brand styling",
      description:
        "Off (default/recommended): renders the imported HTML's own design exactly as pasted (own fonts, colors, layout). On: ignores the imported HTML's own <style> tag and forces the site's plain typography instead — only useful for a quick text-only paste with no real design.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "customStyles",
      title: "Custom CSS (from imported HTML, advanced)",
      description: "Extracted from the imported HTML's <style> tag. Only applied when brand styling above is off.",
      type: "text",
      rows: 12,
    }),
    defineField({
      name: "scripts",
      title: "Scripts (from imported HTML)",
      description:
        "Inline/external <script> tags extracted from an imported HTML article. Browsers don't execute scripts inserted via innerHTML, so these are re-injected as real script elements on the client instead.",
      type: "array",
      of: [
        {
          type: "object",
          name: "scriptTag",
          fields: [
            defineField({ name: "src", title: "Script src URL", type: "url" }),
            defineField({ name: "content", title: "Inline script body", type: "text", rows: 4 }),
          ],
        },
      ],
    }),
    defineField({
      name: "published",
      title: "Published",
      description: "Off = draft, only visible to signed-in admins. On = live on the public blog.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "ogImageUrl",
      title: "Cover / social preview image",
      description:
        "Used as the thumbnail on the blog index and in link previews on Slack/X/LinkedIn. Auto-filled from og:image or the first image when importing HTML — override here if needed.",
      type: "url",
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL override",
      description: "Set if this content is also published elsewhere and this page shouldn't be the canonical source.",
      type: "url",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title override",
      description: "Defaults to the post title if left blank.",
      type: "string",
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description override",
      description: "Defaults to the excerpt if left blank.",
      type: "text",
      rows: 2,
      validation: (rule) => rule.max(160),
    }),
  ],
  preview: {
    select: { title: "title", media: "coverImage", subtitle: "publishedAt" },
  },
});
