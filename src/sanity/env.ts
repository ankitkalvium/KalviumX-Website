// Read raw — never throws at import time. The Studio route needs a hard
// failure if these are missing (it's unusable either way), but the public
// /blog pages should degrade to an empty state instead of crashing the
// whole site before Sanity is configured. See isSanityConfigured() below.
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

export function isSanityConfigured() {
  return projectId.length > 0;
}
