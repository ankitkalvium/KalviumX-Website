import type { PortableTextBlock } from "@portabletext/react";
import { isSanityConfigured } from "@/sanity/env";
import { getClient } from "@/sanity/lib/client";
import { previewPost } from "@/sanity/lib/mockPosts";

export interface SanityImageRef {
  asset?: { _ref: string; _type: "reference" };
  alt?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
}

export interface BlogPostSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: SanityImageRef;
  authorName: string;
  publishedAt: string;
  // Set only on the local preview post (see mockPosts.ts) — a plain /public
  // URL, since there's no real Sanity asset to resolve before a project is
  // configured. Real CMS posts never set this.
  coverImageUrl?: string;
}

export interface BlogPost extends BlogPostSummary {
  body?: PortableTextBlock[];
  // Advanced escape hatch: a fully custom HTML article (style tags
  // included), rendered as-is in place of the structured body above.
  fullPageHtml?: string;
  seoTitle?: string;
  seoDescription?: string;
}

const summaryProjection = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  authorName,
  publishedAt
}`;

export async function getAllPosts(): Promise<BlogPostSummary[]> {
  if (!isSanityConfigured()) return [previewPost];
  return getClient().fetch(
    `*[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc) ${summaryProjection}`,
  );
}

export async function getPostSlugs(): Promise<string[]> {
  if (!isSanityConfigured()) return [previewPost.slug];
  const slugs: { slug: string }[] = await getClient().fetch(
    `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`,
  );
  return slugs.map((entry) => entry.slug);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSanityConfigured()) return slug === previewPost.slug ? previewPost : null;
  return getClient().fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      _id, title, "slug": slug.current, excerpt, coverImage, authorName, publishedAt,
      body, fullPageHtml, seoTitle, seoDescription
    }`,
    { slug },
  );
}
