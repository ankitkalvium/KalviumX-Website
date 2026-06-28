// Reusable importer: turn a full standalone HTML article (own <style>, own
// hero/nav/footer markup) into a blog post using the `fullPageHtml` escape
// hatch on the `post` schema. Re-running with the same file overwrites the
// same post (deterministic _id from the slug) instead of duplicating it.
//
// Usage:
//   npx sanity exec scripts/seed-html-post.ts --with-user-token -- path/to/article.html [custom-slug]
import fs from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";

function extractTag(html: string, tag: string): string {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? match[1] : "";
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 96);
}

async function main() {
  const [, , filePath, customSlug] = process.argv;
  if (!filePath) {
    console.error("Usage: sanity exec scripts/seed-html-post.ts --with-user-token -- <file.html> [slug]");
    process.exit(1);
  }

  const html = fs.readFileSync(path.resolve(process.cwd(), filePath), "utf-8");

  const rawTitle = stripTags(extractTag(html, "title")) || "Untitled post";
  const title = rawTitle.replace(/\s*[—|-]\s*KalviumX\s*$/i, "").trim();
  const slug = customSlug || slugify(title);

  const styleBlocks = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n");
  const bodyContent = extractTag(html, "body");
  if (!bodyContent) {
    console.error("Could not find a <body> tag in the file — is this a full HTML document?");
    process.exit(1);
  }
  const fullPageHtml = `<style>${styleBlocks}</style>\n${bodyContent}`;

  const heroParagraph = bodyContent.match(/<p[^>]*class="[^"]*hero-sub[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
  const firstParagraph = bodyContent.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  const excerptSource = heroParagraph?.[1] || firstParagraph?.[1] || title;
  const excerpt = stripTags(excerptSource).slice(0, 200);

  const client = getCliClient();
  const doc = {
    _id: `post-${slug}`,
    _type: "post",
    title,
    slug: { _type: "slug", current: slug },
    excerpt,
    authorName: "KalviumX Team",
    publishedAt: new Date().toISOString(),
    fullPageHtml,
  };

  const result = await client.createOrReplace(doc);
  console.log(`Created/updated post "${result.title}" -> /blog/${slug}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
