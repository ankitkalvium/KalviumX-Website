import type { MetadataRoute } from "next";
import { roles } from "@/lib/data";

const SITE_URL = "https://x.kalvium.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/roles",
    "/deployment-model",
    "/for-gccs",
    "/case-studies",
    "/commercials",
    "/start-a-pilot",
    "/privacy",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/start-a-pilot" ? 0.9 : 0.7,
  }));

  const rolePages = roles.map((role) => ({
    url: `${SITE_URL}/roles/${role.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...rolePages];
}
