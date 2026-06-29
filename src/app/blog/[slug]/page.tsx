import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminEmail } from "@/auth";
import FullPageHtmlRenderer from "@/components/blog/FullPageHtmlRenderer";
import Button from "@/components/ui/Button";
import { scopeCss } from "@/lib/css-scope";
import { isSanityConfigured } from "@/sanity/env";
import { urlForImage } from "@/sanity/lib/image";
import { portableTextComponents } from "@/sanity/lib/portableTextComponents";
import { getPostBySlug, getPostSlugs } from "@/sanity/lib/queries";

// x.kalvium.com is an unrelated WordPress site, not this project.
const SITE_URL = "https://kalvium-x-website.vercel.app";

export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const ogImage =
    post.ogImageUrl ||
    post.coverImageUrl ||
    (post.coverImage?.asset ? urlForImage(post.coverImage).width(1200).height(630).fit("crop").url() : undefined);

  return {
    title,
    description,
    alternates: post.canonicalUrl ? { canonical: post.canonicalUrl } : undefined,
    openGraph: {
      title: `${title} | KalviumX`,
      description,
      url: `${SITE_URL}/blog/${slug}`,
      type: "article",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // Drafts are invisible to the public — only a signed-in admin can preview
  // one via its real URL before publishing. Posts predating the `published`
  // field (no value at all) are treated as published, not as drafts.
  const isDraft = post.published === false;
  if (isDraft) {
    const adminEmail = await getAdminEmail();
    if (!adminEmail) notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Organization", name: post.authorName || "KalviumX", url: SITE_URL },
    publisher: { "@type": "Organization", name: "KalviumX", url: SITE_URL },
    datePublished: post.publishedAt,
    url: `${SITE_URL}/blog/${slug}`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${slug}` },
    ],
  };

  // Full custom HTML posts completely replace the structured layout below —
  // title/cover/breadcrumb/CTA all come from the author's own HTML instead.
  if (post.fullPageHtml) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        {isDraft ? (
          <div className="border-b border-amber-200 bg-amber-50 py-2.5 text-center text-sm font-extrabold text-amber-900">
            Draft preview — only visible to signed-in admins
          </div>
        ) : null}
        <div className="border-b border-line py-4">
          <div className="container-x flex items-center justify-between gap-5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#777]">
              <Link href="/blog" className="text-red hover:underline">Blog</Link>
              <span aria-hidden>›</span>
              <span className="truncate max-w-[60vw]">{post.title}</span>
            </div>
            <Link href="/blog" className="hidden sm:inline-flex text-sm font-extrabold text-red">
              ← Back to blog
            </Link>
          </div>
        </div>
        <div className="container-x py-2">
          <FullPageHtmlRenderer
            html={post.fullPageHtml}
            scripts={post.scripts}
            useBrandStyling={post.useBrandStyling ?? false}
            customStyles={post.customStyles ? scopeCss(post.customStyles, `kx-post-${post.slug}`) : undefined}
            scopeClass={`kx-post-${post.slug}`}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {isDraft ? (
        <div className="border-b border-amber-200 bg-amber-50 py-2.5 text-center text-sm font-extrabold text-amber-900">
          Draft preview — only visible to signed-in admins
        </div>
      ) : null}

      <section className="border-b border-line py-9 lg:py-12">
        <div className="container-x">
          {!isSanityConfigured() ? (
            <div className="mb-7 rounded-lg border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-900">
              Preview content. Connect Sanity to replace this with your real posts.
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-5 mb-9">
            <div className="flex items-center gap-2 text-sm font-bold text-[#777]">
              <Link href="/blog" className="text-red hover:underline">Blog</Link>
              <span aria-hidden>›</span>
              <span className="truncate max-w-[60vw]">{post.title}</span>
            </div>
            <Link href="/blog" className="hidden sm:inline-flex text-sm font-extrabold text-red">
              ← Back to blog
            </Link>
          </div>

          <h1 className="text-[clamp(32px,5vw,58px)] font-black leading-[1.05] tracking-[-0.055em] max-w-4xl">
            {post.title}
          </h1>
          <div className="w-14 h-1 bg-red mt-6" />
          <p className="mt-5 text-sm font-bold text-[#777]">
            {new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date(post.publishedAt))}
            {post.authorName ? ` · ${post.authorName}` : ""}
          </p>
        </div>
      </section>

      {post.coverImageUrl || post.coverImage?.asset ? (
        <section className="pt-9">
          <div className="container-x">
            <div className="relative aspect-[16/8] w-full overflow-hidden rounded-lg border border-line">
              <Image
                src={
                  post.coverImageUrl ||
                  urlForImage(post.coverImage!).width(1600).height(800).fit("crop").auto("format").url()
                }
                alt={post.coverImage?.alt || post.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-12">
        <div className="container-x max-w-3xl">
          <PortableText value={post.body} components={portableTextComponents} />
        </div>
      </section>

      <section className="pb-16">
        <div className="container-x">
          <div className="border border-line rounded-lg p-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-5 bg-soft">
            <div>
              <h2 className="text-xl font-extrabold tracking-[-0.03em]">Ready to build with talent like this?</h2>
              <p className="text-sm text-[#555] font-medium mt-1">Share your JD and stack. We&apos;ll map the right talent.</p>
            </div>
            <Button href="/start-a-pilot">Start a Pilot →</Button>
          </div>
        </div>
      </section>
    </>
  );
}
