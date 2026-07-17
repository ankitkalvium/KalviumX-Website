import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminEmail } from "@/auth";
import { buildPostFromHtml } from "@/lib/html-to-post";
import { getPostById, upsertPost } from "@/lib/repo/posts";

const schema = z.object({
  html: z.string().min(1).max(2_000_000),
  slug: z.string().trim().max(96).optional(),
  // Omitted on edit -> keep the post's current published state. Required
  // (implicitly false) on a brand-new import -> lands as a draft.
  publish: z.boolean().optional(),
  // Defaults to true (match the site's fonts/colors) when omitted.
  useBrandStyling: z.boolean().optional(),
  // Manual override for the auto-extracted og:image / first <img>.
  coverImageUrl: z.string().trim().max(2000).optional(),
});

export async function POST(request: Request) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  let post;
  try {
    post = buildPostFromHtml(parsed.data.html, parsed.data.slug || undefined);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Could not parse this HTML.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    // Editing an existing post (same slug/id) should keep its original
    // publishedAt and published state unless explicitly overridden.
    const existing = await getPostById(post.id);
    const published = parsed.data.publish ?? existing?.published ?? false;
    const publishedAt = existing?.publishedAt ?? post.publishedAt;
    const useBrandStyling = parsed.data.useBrandStyling ?? false;
    const ogImageUrl = parsed.data.coverImageUrl || post.ogImageUrl || undefined;

    const result = await upsertPost({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      authorName: post.authorName,
      publishedAt,
      published,
      fullPageHtml: post.fullPageHtml,
      useBrandStyling,
      customStyles: post.customStyles || undefined,
      scripts: post.scripts,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      ogImageUrl,
      canonicalUrl: post.canonicalUrl || undefined,
    });
    return NextResponse.json({
      ok: true,
      id: result.id,
      title: result.title,
      slug: post.slug,
      published,
      url: `/blog/${post.slug}`,
    });
  } catch (error: unknown) {
    console.error("Blog post save failed", error);
    const message = error instanceof Error ? error.message : "Could not publish this post.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
