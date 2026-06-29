// Reusable importer: turn a full standalone HTML article (own <style>, own
// hero/nav/footer markup) into a blog post using the `fullPageHtml` escape
// hatch on the `post` schema. Re-running with the same file overwrites the
// same post (deterministic _id from the slug) instead of duplicating it.
//
// There's also a web form for this at /admin/blog — this CLI script is for
// anyone who prefers the terminal. Both share src/lib/html-to-post.ts.
//
// Defaults to the article's own custom design (useBrandStyling: false),
// since CLI usage has historically been for fully custom-styled pages. The
// web form defaults the other way (brand styling on) for ordinary posts.
//
// Usage:
//   npx sanity exec scripts/seed-html-post.ts --with-user-token -- path/to/article.html [custom-slug]
import fs from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";
import { buildPostFromHtml } from "../src/lib/html-to-post";

async function main() {
  const [, , filePath, customSlug] = process.argv;
  if (!filePath) {
    console.error("Usage: sanity exec scripts/seed-html-post.ts --with-user-token -- <file.html> [slug]");
    process.exit(1);
  }

  const html = fs.readFileSync(path.resolve(process.cwd(), filePath), "utf-8");
  const post = buildPostFromHtml(html, customSlug);

  const client = getCliClient();
  const result = await client.createOrReplace({
    _id: post.id,
    _type: "post",
    title: post.title,
    slug: { _type: "slug", current: post.slug },
    excerpt: post.excerpt,
    authorName: post.authorName,
    publishedAt: post.publishedAt,
    fullPageHtml: post.fullPageHtml,
    customStyles: post.customStyles || undefined,
    useBrandStyling: false,
    scripts: post.scripts,
    published: true,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    ogImageUrl: post.ogImageUrl || undefined,
    canonicalUrl: post.canonicalUrl || undefined,
  });

  console.log(`Created/updated post "${result.title}" -> /blog/${post.slug}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
