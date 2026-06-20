import { roleOptions } from "@/lib/data";

// Personal/free mail domains are rejected — we only want work emails. Keeps the
// CRM clean and blocks the most common throwaway-signup spam.
const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.in",
  "yahoo.co.in",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "zoho.com",
  "rediffmail.com",
  "ymail.com",
  "gmx.com",
  "mail.com",
  "yandex.com",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Minimum time (ms) a human takes to fill the form. Faster = bot.
const MIN_FILL_MS = 3000;

export interface RawLeadInput {
  name?: unknown;
  email?: unknown;
  role?: unknown;
  brief?: unknown;
  source?: unknown;
  // Honeypot — must stay empty. Bots fill every field.
  website?: unknown;
  // Client timestamp (ms) of when the form mounted.
  loadedAt?: unknown;
}

export interface CleanLead {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  brief: string;
  source: string;
}

export type ValidationResult =
  | { ok: true; lead: CleanLead }
  // Silent drop: looks like a bot. Return fake success to the client.
  | { ok: false; silent: true }
  // Real validation error shown to the user.
  | { ok: false; silent: false; error: string };

function deriveNames(name: string, email: string): { firstName: string; lastName: string } {
  const trimmed = name.trim();
  if (trimmed) {
    const parts = trimmed.split(/\s+/);
    const firstName = parts[0];
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : firstName;
    return { firstName, lastName };
  }
  // Fallback to the email local part if no name was given.
  const local = email.split("@")[0] ?? "Lead";
  const cleaned = local.replace(/[._-]+/g, " ").trim();
  const firstName = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return { firstName, lastName: firstName };
}

export function validateLead(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, silent: false, error: "Invalid request." };
  }
  const b = body as RawLeadInput;

  // 1. Honeypot — silently drop if the hidden field was filled.
  if (typeof b.website === "string" && b.website.trim() !== "") {
    return { ok: false, silent: true };
  }

  // 2. Timing — silently drop submissions faster than a human can fill.
  if (typeof b.loadedAt === "number" && Date.now() - b.loadedAt < MIN_FILL_MS) {
    return { ok: false, silent: true };
  }

  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  const role = typeof b.role === "string" ? b.role.trim() : "";
  const name = typeof b.name === "string" ? b.name.trim().slice(0, 120) : "";
  const brief = typeof b.brief === "string" ? b.brief.trim().slice(0, 3000) : "";
  const source = typeof b.source === "string" ? b.source.trim().slice(0, 100) : "website";

  if (!EMAIL_RE.test(email)) {
    return { ok: false, silent: false, error: "Enter a valid work email." };
  }

  const domain = email.split("@")[1] ?? "";
  if (FREE_EMAIL_DOMAINS.has(domain)) {
    return { ok: false, silent: false, error: "Please use your work email, not a personal one." };
  }

  if (!role || !(roleOptions as readonly string[]).includes(role)) {
    return { ok: false, silent: false, error: "Select a role or stack." };
  }

  const { firstName, lastName } = deriveNames(name, email);

  return {
    ok: true,
    lead: { firstName, lastName, email, company: domain, role, brief, source },
  };
}

// Best-effort in-memory rate limit. On serverless this is per-instance, so it
// throttles bursts from a warm instance; honeypot + timing catch the rest.
const RATE_LIMIT = 4;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const hits = new Map<string, number[]>();

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}
