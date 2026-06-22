// Zoho CRM (India DC) lead upsert. Self-client OAuth: a long-lived refresh
// token is exchanged for a short-lived access token, cached in module memory.
// Deduplication: search by Email first; merge tags + upgrade status if found.

import { createHmac, timingSafeEqual } from "node:crypto";

interface ZohoConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  accountsDomain: string;
  apiDomain: string;
}

function getConfig(): ZohoConfig | null {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;
  return {
    clientId,
    clientSecret,
    refreshToken,
    accountsDomain: process.env.ZOHO_ACCOUNTS_DOMAIN ?? "https://accounts.zoho.in",
    apiDomain: process.env.ZOHO_API_DOMAIN ?? "https://www.zohoapis.in",
  };
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(config: ZohoConfig): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) return cachedToken.value;

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: config.refreshToken,
  });

  const res = await fetch(`${config.accountsDomain}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) throw new Error(`Zoho token refresh failed: ${res.status}`);

  const data: { access_token?: string; expires_in?: number; error?: string } = await res.json();
  if (!data.access_token) throw new Error(`Zoho token error: ${data.error ?? "no token"}`);

  const expiresInMs = (data.expires_in ?? 3600) * 1000;
  cachedToken = { value: data.access_token, expiresAt: now + expiresInMs };
  return data.access_token;
}

// Status rank: higher = more progressed. Never downgrade a lead's status.
const STATUS_RANK: Record<string, number> = {
  "Not Contacted": 1,
  "Attempted to Contact": 2,
  "Contact in Future": 2,
  "Contacted": 3,
  "Appointment Scheduled": 4,
};

function mergeStatus(existing: string, incoming: string): string {
  return (STATUS_RANK[incoming] ?? 0) > (STATUS_RANK[existing] ?? 0) ? incoming : existing;
}

export interface ZohoLeadInput {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role?: string;
  brief?: string;
  source: string;
  companySize?: string;
  tags: string[];
  status: string;
}

interface ExistingRecord {
  id: string;
  tags: string[];
  status: string;
}

// A non-204 error response means the search itself failed (auth, scope,
// rate limit) — distinct from a genuine "no record matches." Conflating the
// two would silently skip dedup and blind-create duplicates whenever Zoho
// access is misconfigured, so callers must see this as an error, not a miss.
async function findByEmail(
  config: ZohoConfig,
  token: string,
  email: string,
): Promise<ExistingRecord | null> {
  const criteria = `(Email:equals:${encodeURIComponent(email)})`;
  const res = await fetch(
    `${config.apiDomain}/crm/v2/Leads/search?criteria=${criteria}&fields=id,Tag,Lead_Status`,
    { headers: { Authorization: `Zoho-oauthtoken ${token}` } },
  );
  if (res.status === 204) return null;
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Zoho search failed: ${res.status} ${body}`);
  }

  const data: { data?: { id?: string; Lead_Status?: string; Tag?: { name: string }[] }[] } =
    await res.json();
  const record = data.data?.[0];
  if (!record?.id) return null;

  return {
    id: record.id,
    tags: (record.Tag ?? []).map((t) => t.name),
    status: record.Lead_Status ?? "Not Contacted",
  };
}

async function getById(
  config: ZohoConfig,
  token: string,
  id: string,
): Promise<ExistingRecord | null> {
  const res = await fetch(`${config.apiDomain}/crm/v2/Leads/${id}?fields=id,Tag,Lead_Status`, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  });
  if (!res.ok) return null;

  const data: { data?: { id?: string; Lead_Status?: string; Tag?: { name: string }[] }[] } =
    await res.json();
  const record = data.data?.[0];
  if (!record?.id) return null;

  return {
    id: record.id,
    tags: (record.Tag ?? []).map((t) => t.name),
    status: record.Lead_Status ?? "Not Contacted",
  };
}

async function updateExisting(
  config: ZohoConfig,
  token: string,
  existing: ExistingRecord,
  lead: Readonly<ZohoLeadInput>,
): Promise<{ ok: true; id: string; action: "updated" } | { ok: false; error: string }> {
  // Merge tags (union) and upgrade status if incoming is higher.
  const mergedTags = Array.from(new Set([...existing.tags, ...lead.tags])).map((name) => ({
    name,
  }));
  const mergedStatus = mergeStatus(existing.status, lead.status);

  const updatePayload = {
    data: [
      {
        Tag: mergedTags,
        Lead_Status: mergedStatus,
        Lead_Source: lead.source,
        ...(lead.role ? { Designation: lead.role } : {}),
        ...(lead.brief ? { Description: lead.brief } : {}),
        ...(lead.companySize ? { No_of_Employees: lead.companySize } : {}),
      },
    ],
    trigger: ["workflow"],
  };

  const res = await fetch(`${config.apiDomain}/crm/v2/Leads/${existing.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatePayload),
  });

  const result: { data?: { code?: string }[] } = await res.json();
  const record = result.data?.[0];

  if (res.ok && record?.code === "SUCCESS") {
    return { ok: true, id: existing.id, action: "updated" };
  }
  return { ok: false, error: `Zoho update failed: ${res.status}` };
}

export async function upsertZohoLead(
  lead: Readonly<ZohoLeadInput>,
): Promise<{ ok: true; id: string; action: "created" | "updated" } | { ok: false; error: string }> {
  const config = getConfig();
  if (!config) return { ok: false, error: "Zoho not configured" };

  let token: string;
  try {
    token = await getAccessToken(config);
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : "token error" };
  }

  try {
    const existing = await findByEmail(config, token, lead.email);

    if (existing) {
      return await updateExisting(config, token, existing, lead);
    }

    // No existing record found via search — create fresh.
    const createPayload = {
      data: [
        {
          Last_Name: lead.lastName,
          First_Name: lead.firstName,
          Email: lead.email,
          Company: lead.company,
          Lead_Status: lead.status,
          Lead_Source: lead.source,
          Tag: lead.tags.map((name) => ({ name })),
          ...(lead.role ? { Designation: lead.role } : {}),
          ...(lead.brief ? { Description: lead.brief } : {}),
          ...(lead.companySize ? { No_of_Employees: lead.companySize } : {}),
        },
      ],
      trigger: ["workflow"],
    };

    const res = await fetch(`${config.apiDomain}/crm/v2/Leads`, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createPayload),
    });

    const result: {
      data?: {
        code?: string;
        details?: { id?: string; duplicate_record?: { id?: string } };
        message?: string;
      }[];
    } = await res.json();
    const record = result.data?.[0];

    if (res.ok && record?.code === "SUCCESS" && record.details?.id) {
      return { ok: true, id: record.details.id, action: "created" };
    }

    // Search-by-email can lag right after a record is created elsewhere (e.g.
    // a Cal booking moments before a form submit). Zoho's create call still
    // catches the duplicate — fall back to updating that record directly.
    const duplicateId = record?.details?.duplicate_record?.id;
    if (record?.code === "DUPLICATE_DATA" && duplicateId) {
      const existingById = await getById(config, token, duplicateId);
      if (existingById) {
        return await updateExisting(config, token, existingById, lead);
      }
    }

    return { ok: false, error: record?.message ?? `Zoho create failed: ${res.status}` };
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : "request error" };
  }
}

// Cal.com webhook signature verification (HMAC-SHA256).
export function verifyCalSignature(rawBody: string, header: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(header), Buffer.from(expected));
  } catch {
    return false;
  }
}
