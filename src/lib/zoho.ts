// Zoho CRM (India DC) lead creation. Self-client OAuth: a long-lived refresh
// token is exchanged for a short-lived access token, cached in module memory.

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

// Cached access token shared across warm serverless invocations.
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(config: ZohoConfig): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.value;
  }

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: config.refreshToken,
  });

  const response = await fetch(`${config.accountsDomain}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`Zoho token refresh failed: ${response.status}`);
  }

  const data: { access_token?: string; expires_in?: number; error?: string } =
    await response.json();

  if (!data.access_token) {
    throw new Error(`Zoho token refresh error: ${data.error ?? "no access_token"}`);
  }

  const expiresInMs = (data.expires_in ?? 3600) * 1000;
  cachedToken = { value: data.access_token, expiresAt: now + expiresInMs };
  return data.access_token;
}

export interface ZohoLead {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  brief: string;
  source: string;
  companySize?: string;
}

export async function createZohoLead(
  lead: Readonly<ZohoLead>,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const config = getConfig();
  if (!config) {
    return { ok: false, error: "Zoho not configured" };
  }

  let token: string;
  try {
    token = await getAccessToken(config);
  } catch (error: unknown) {
    return { ok: false, error: error instanceof Error ? error.message : "token error" };
  }

  const payload = {
    data: [
      {
        Last_Name: lead.lastName,
        First_Name: lead.firstName,
        Email: lead.email,
        Company: lead.company,
        Designation: lead.role,
        Description: lead.brief,
        Lead_Source: "Website - KalviumX",
        Tag: [{ name: "Inbound" }],
        ...(lead.companySize ? { No_of_Employees: lead.companySize } : {}),
      },
    ],
    trigger: ["workflow"],
  };

  try {
    const response = await fetch(`${config.apiDomain}/crm/v2/Leads`, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result: {
      data?: { code?: string; details?: { id?: string }; message?: string }[];
    } = await response.json();

    const record = result.data?.[0];
    if (response.ok && record?.code === "SUCCESS" && record.details?.id) {
      return { ok: true, id: record.details.id };
    }

    return { ok: false, error: record?.message ?? `Zoho create failed: ${response.status}` };
  } catch (error: unknown) {
    return { ok: false, error: error instanceof Error ? error.message : "request error" };
  }
}
