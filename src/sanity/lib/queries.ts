import type { PortableTextBlock } from "@portabletext/react";
import { isSanityConfigured } from "@/sanity/env";
import { getClient, getWriteClient } from "@/sanity/lib/client";
import { previewPost } from "@/sanity/lib/mockPosts";

export interface SanityImageRef {
  asset?: { _ref: string; _type: "reference" };
  alt?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
}

export interface ExtractedScript {
  src?: string;
  content?: string;
}

export interface BlogPostSummary {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: SanityImageRef;
  authorName: string;
  publishedAt: string;
  published?: boolean;
  updatedAt?: string;
  // True only for posts created via the HTML importer (have a fullPageHtml
  // body). Posts authored directly in Sanity Studio with a structured body
  // don't have one — the admin "Edit" form only knows how to edit HTML, so
  // it uses this to avoid opening an empty editor that would overwrite a
  // real Studio post on save.
  hasFullPageHtml?: boolean;
  // Cover/social image for HTML-import posts (plain URL, no Sanity asset
  // upload needed) — used as the blog index thumbnail when `coverImage`
  // (the Studio asset field) isn't set.
  ogImageUrl?: string;
  // Set only on the local preview post (see mockPosts.ts) — a plain /public
  // URL, since there's no real Sanity asset to resolve before a project is
  // configured. Real CMS posts never set this.
  coverImageUrl?: string;
}

export interface BlogPost extends BlogPostSummary {
  body?: PortableTextBlock[];
  // Advanced escape hatch: a fully custom HTML article, rendered as-is (or
  // brand-styled, see useBrandStyling) in place of the structured body above.
  fullPageHtml?: string;
  useBrandStyling?: boolean;
  customStyles?: string;
  scripts?: ExtractedScript[];
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
}

const summaryProjection = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  ogImageUrl,
  authorName,
  publishedAt,
  published
}`;

// Public site — only ever shows posts explicitly marked published. Drafts
// are invisible here regardless of publishedAt.
export async function getAllPosts(): Promise<BlogPostSummary[]> {
  if (!isSanityConfigured()) return [previewPost];
  return getClient().fetch(
    `*[_type == "post" && defined(slug.current) && (published == true || !defined(published)) && publishedAt <= now()] | order(publishedAt desc) ${summaryProjection}`,
  );
}

export async function getPostSlugs(): Promise<string[]> {
  if (!isSanityConfigured()) return [previewPost.slug];
  const slugs: { slug: string }[] = await getClient().fetch(
    `*[_type == "post" && defined(slug.current) && (published == true || !defined(published))]{ "slug": slug.current }`,
  );
  return slugs.map((entry) => entry.slug);
}

// Unfiltered — used by the public /blog/[slug] route too, which separately
// gates unpublished posts behind an admin-session check (see page.tsx) so
// admins can preview a draft via its real URL before publishing.
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSanityConfigured()) return slug === previewPost.slug ? previewPost : null;
  return getClient().fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      _id, title, "slug": slug.current, excerpt, coverImage, authorName, publishedAt, published,
      body, fullPageHtml, useBrandStyling, customStyles, scripts, seoTitle, seoDescription, ogImageUrl, canonicalUrl
    }`,
    { slug },
  );
}

// Admin-only — every post regardless of published status, for the
// /admin/blog list (newest edited first). Uses the uncached write client so
// a just-published/edited post shows up immediately, not after the public
// read client's CDN cache expires.
export async function getAllPostsForAdmin(): Promise<BlogPostSummary[]> {
  if (!isSanityConfigured() || !process.env.SANITY_API_WRITE_TOKEN) return [];
  return getWriteClient().fetch(
    `*[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))] | order(_updatedAt desc) ${summaryProjection.replace(
      "}",
      ', "updatedAt": _updatedAt, "hasFullPageHtml": defined(fullPageHtml) }',
    )}`,
  );
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  if (!isSanityConfigured() || !process.env.SANITY_API_WRITE_TOKEN) return null;
  return getWriteClient().fetch(
    `*[_type == "post" && _id == $id][0]{
      _id, title, "slug": slug.current, excerpt, coverImage, authorName, publishedAt, published,
      body, fullPageHtml, useBrandStyling, customStyles, scripts, seoTitle, seoDescription, ogImageUrl, canonicalUrl
    }`,
    { id },
  );
}
