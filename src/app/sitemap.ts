import type { MetadataRoute } from "next";
import { roles, caseStudies } from "@/lib/data";
import { isSanityConfigured } from "@/sanity/env";
import { getAllPosts } from "@/sanity/lib/queries";

// x.kalvium.com is an unrelated WordPress site, not this project.
const SITE_URL = "https://kalvium-x-website.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { path: "", priority: 1.0 },
    { path: "/roles", priority: 0.9 },
    { path: "/case-studies", priority: 0.9 },
    { path: "/blog", priority: 0.8 },
    { path: "/deployment-model", priority: 0.8 },
    { path: "/for-gccs", priority: 0.8 },
    { path: "/commercials", priority: 0.8 },
    { path: "/start-a-pilot", priority: 0.9 },
    { path: "/privacy", priority: 0.3 },
  ].map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority,
  }));

  const rolePages = roles.map((role) => ({
    url: `${SITE_URL}/roles/${role.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const caseStudyPages = caseStudies.map((study) => ({
    url: `${SITE_URL}/case-studies/${study.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const posts = isSanityConfigured() ? await getAllPosts().catch(() => []) : [];
  const blogPages = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...rolePages, ...caseStudyPages, ...blogPages];
}
