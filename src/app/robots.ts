import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    // x.kalvium.com is an unrelated WordPress site, not this project.
    sitemap: "https://kalvium-x-website.vercel.app/sitemap.xml",
  };
}
