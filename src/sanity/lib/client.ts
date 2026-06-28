import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

// Lazy: `createClient` throws synchronously if `projectId` is falsy, so this
// must not run at module-import time — only call getClient() from behind an
// isSanityConfigured() check (see queries.ts), otherwise every page that
// transitively imports this file crashes before Sanity is set up.
let cachedClient: SanityClient | null = null;

export function getClient(): SanityClient {
  if (!cachedClient) {
    cachedClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    });
  }
  return cachedClient;
}
