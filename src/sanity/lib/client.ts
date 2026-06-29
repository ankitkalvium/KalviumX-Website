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

let cachedWriteClient: SanityClient | null = null;

// Server-only — requires SANITY_API_WRITE_TOKEN (editor-scoped token, not a
// user session). Used by admin tooling (e.g. the HTML blog importer) that
// needs to write documents without an interactive `sanity login`.
export function getWriteClient(): SanityClient {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error("SANITY_API_WRITE_TOKEN is not configured");
  if (!cachedWriteClient) {
    cachedWriteClient = createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
    });
  }
  return cachedWriteClient;
}
