import { createSign } from "node:crypto";

const SHEETS_BASE = "https://sheets.googleapis.com/v4/spreadsheets";
const OAUTH_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

// Module-level cache — survives across requests in the same process.
// Resets on cold starts, which is fine: we just re-auth.
let cachedToken: { value: string; expiresAt: number } | null = null;
let cachedSheetIds: Record<string, number> | null = null;

function spreadsheetId(): string {
  const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!id) throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is not configured");
  return id;
}

function credentials(): { client_email: string; private_key: string } {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not configured");
  try {
    return JSON.parse(raw);
  } catch {
    // Support base64-encoded JSON as an alternative storage format
    return JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
  }
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value;

  const creds = credentials();
  const now = Math.floor(Date.now() / 1000);

  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({ iss: creds.client_email, scope: SCOPE, aud: OAUTH_URL, exp: now + 3600, iat: now }),
  ).toString("base64url");

  const signingInput = `${header}.${payload}`;
  const sign = createSign("RSA-SHA256");
  sign.update(signingInput);
  const signature = sign.sign(creds.private_key, "base64url");
  const jwt = `${signingInput}.${signature}`;

  const res = await fetch(OAUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
  });

  if (!res.ok) throw new Error(`Sheets auth failed: ${await res.text()}`);
  const { access_token } = (await res.json()) as { access_token: string };
  // Cache for 50 min (tokens last 60)
  cachedToken = { value: access_token, expiresAt: Date.now() + 50 * 60 * 1000 };
  return access_token;
}

async function headers(): Promise<Record<string, string>> {
  return { Authorization: `Bearer ${await getAccessToken()}`, "Content-Type": "application/json" };
}

async function sheetIds(): Promise<Record<string, number>> {
  if (cachedSheetIds) return cachedSheetIds;
  const res = await fetch(`${SHEETS_BASE}/${spreadsheetId()}?fields=sheets.properties`, {
    headers: await headers(),
  });
  if (!res.ok) throw new Error(`Failed to get spreadsheet metadata: ${await res.text()}`);
  const data = (await res.json()) as { sheets: { properties: { title: string; sheetId: number } }[] };
  const map: Record<string, number> = {};
  for (const sheet of data.sheets) map[sheet.properties.title] = sheet.properties.sheetId;
  cachedSheetIds = map;
  return map;
}

// Creates the tab and writes its header row if the tab doesn't already exist.
export async function ensureTab(tab: string, headerRow: string[]): Promise<void> {
  const ids = await sheetIds();
  if (tab in ids) return;

  const res = await fetch(`${SHEETS_BASE}/${spreadsheetId()}:batchUpdate`, {
    method: "POST",
    headers: await headers(),
    body: JSON.stringify({ requests: [{ addSheet: { properties: { title: tab } } }] }),
  });
  if (!res.ok) throw new Error(`Failed to create tab "${tab}": ${await res.text()}`);

  // Bust cache so new tab is picked up
  cachedSheetIds = null;

  await appendRow(tab, headerRow);
}

// Read every row in a tab. Row 0 is the header, row 1+ is data.
export async function readAllRows(tab: string): Promise<string[][]> {
  const res = await fetch(
    `${SHEETS_BASE}/${spreadsheetId()}/values/${encodeURIComponent(tab)}`,
    { headers: await headers() },
  );
  if (!res.ok) throw new Error(`Failed to read tab "${tab}": ${await res.text()}`);
  const data = (await res.json()) as { values?: string[][] };
  return data.values ?? [];
}

// Append a new row at the bottom.
export async function appendRow(tab: string, values: string[]): Promise<void> {
  const res = await fetch(
    `${SHEETS_BASE}/${spreadsheetId()}/values/${encodeURIComponent(tab)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    { method: "POST", headers: await headers(), body: JSON.stringify({ values: [values] }) },
  );
  if (!res.ok) throw new Error(`Failed to append to "${tab}": ${await res.text()}`);
}

// Update a specific row. rowNum is 1-indexed (1 = header, 2 = first data row).
export async function updateRow(tab: string, rowNum: number, values: string[]): Promise<void> {
  const range = `${tab}!A${rowNum}:Z${rowNum}`;
  const res = await fetch(
    `${SHEETS_BASE}/${spreadsheetId()}/values/${encodeURIComponent(range)}?valueInputOption=RAW`,
    { method: "PUT", headers: await headers(), body: JSON.stringify({ range, values: [values] }) },
  );
  if (!res.ok) throw new Error(`Failed to update row ${rowNum} in "${tab}": ${await res.text()}`);
}

// Delete a specific row. rowNum is 1-indexed.
export async function deleteRow(tab: string, rowNum: number): Promise<void> {
  const ids = await sheetIds();
  const sheetId = ids[tab];
  if (sheetId === undefined) throw new Error(`Tab "${tab}" not found`);
  const res = await fetch(`${SHEETS_BASE}/${spreadsheetId()}:batchUpdate`, {
    method: "POST",
    headers: await headers(),
    body: JSON.stringify({
      requests: [{
        deleteDimension: {
          range: { sheetId, dimension: "ROWS", startIndex: rowNum - 1, endIndex: rowNum },
        },
      }],
    }),
  });
  if (!res.ok) throw new Error(`Failed to delete row ${rowNum} from "${tab}": ${await res.text()}`);
}

// Find the first row where column colIndex equals value (case-sensitive).
// Returns the row array and its 1-indexed Sheet row number, or null.
export async function findRow(
  tab: string,
  colIndex: number,
  value: string,
): Promise<{ row: string[]; rowNum: number } | null> {
  const rows = await readAllRows(tab);
  for (let i = 1; i < rows.length; i++) {
    if ((rows[i][colIndex] ?? "") === value) return { row: rows[i], rowNum: i + 1 };
  }
  return null;
}

// Bulk delete: reads once, deletes matching rows from bottom up to avoid index drift.
export async function deleteRowsByColValue(tab: string, colIndex: number, values: string[]): Promise<number> {
  const valueSet = new Set(values);
  const rows = await readAllRows(tab);
  const toDelete: number[] = [];
  for (let i = 1; i < rows.length; i++) {
    if (valueSet.has(rows[i][colIndex] ?? "")) toDelete.push(i + 1);
  }
  toDelete.sort((a, b) => b - a); // highest row first to avoid index drift
  for (const rowNum of toDelete) await deleteRow(tab, rowNum);
  return toDelete.length;
}
