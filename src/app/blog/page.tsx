import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { isSanityConfigured } from "@/sanity/env";
import { urlForImage } from "@/sanity/lib/image";
import { getAllPosts } from "@/sanity/lib/queries";

// x.kalvium.com is an unrelated WordPress site, not this project.
const SITE_URL = "https://kalvium-x-website.vercel.app";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on engineering hiring, intern deployment, GenAI capability building, and what it takes to ship with work-integrated talent. From the KalviumX team.",
  openGraph: {
    title: "Blog | KalviumX",
    description:
      "Insights on engineering hiring, intern deployment, and building with work-integrated talent.",
    url: `${SITE_URL}/blog`,
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
  ],
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="border-b border-line bg-soft">
        <div className="container-x">
          <SectionHeading
            as="h1"
            eyebrow="Blog"
            title={
              <>
                The playbook for <span className="red-pill">engineering hiring</span>
                <br />
                that actually ships.
              </>
            }
            copy="Field notes from deploying engineering talent at scale: what works, what fails, and what nobody tells you about readiness."
          />
        </div>
      </section>

      <section className="py-14">
        <div className="container-x">
          {!isSanityConfigured() ? (
            <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-900">
              Preview content. Connect Sanity to replace this with your real posts. See README for setup.
            </div>
          ) : null}
          {posts.length === 0 ? (
            <div className="border border-line rounded-lg p-12 text-center bg-soft">
              <h2 className="text-xl font-black">No posts published yet</h2>
              <p className="mt-2 text-sm text-[#555] font-medium">Check back soon. New posts will appear here automatically.</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-line border-b-2 border-b-red bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-soft">
                    {post.coverImageUrl || post.coverImage?.asset ? (
                      <Image
                        src={
                          post.coverImageUrl ||
                          urlForImage(post.coverImage!).width(640).height(400).fit("crop").auto("format").url()
                        }
                        alt={post.coverImage?.alt || post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-xs font-bold text-[#777]">
                      {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(post.publishedAt))}
                      {post.authorName ? ` · ${post.authorName}` : ""}
                    </span>
                    <h2 className="mt-2 text-xl font-black leading-tight tracking-[-0.03em] group-hover:text-red transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#555] font-medium line-clamp-3">{post.excerpt}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold text-red">
                      Read more →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 border border-line rounded-lg p-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-5 bg-soft">
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
