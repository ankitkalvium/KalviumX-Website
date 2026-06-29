import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminEmail } from "@/auth";
import { buildPostFromHtml } from "@/lib/html-to-post";
import { getWriteClient } from "@/sanity/lib/client";

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

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "Blog publishing is not configured on the server." }, { status: 503 });
  }

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
    const client = getWriteClient();
    // Editing an existing post (same slug) should keep its original
    // publishedAt and published state unless explicitly overridden —
    // createOrReplace would otherwise reset both on every save.
    const existing = await client.fetch<{ publishedAt?: string; published?: boolean } | null>(
      `*[_id == $id][0]{ publishedAt, published }`,
      { id: post.id },
    );
    const published = parsed.data.publish ?? existing?.published ?? false;
    const publishedAt = existing?.publishedAt ?? post.publishedAt;
    const useBrandStyling = parsed.data.useBrandStyling ?? false;
    const ogImageUrl = parsed.data.coverImageUrl || post.ogImageUrl || undefined;

    const result = await client.createOrReplace({
      _id: post.id,
      _type: "post",
      title: post.title,
      slug: { _type: "slug", current: post.slug },
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
      id: result._id,
      title: result.title,
      slug: post.slug,
      published,
      url: `/blog/${post.slug}`,
    });
  } catch (error: unknown) {
    console.error("Sanity HTML import failed", error);
    const message = error instanceof Error ? error.message : "Could not publish this post.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
