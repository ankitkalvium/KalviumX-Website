// Quick smoke test for all 7 Google Sheets repo modules.
// Writes one test row per tab, reads it back, then deletes it.
// Run: node --env-file=.env.local scripts/test-sheets.mjs

import { createSign } from "node:crypto";

const SHEETS_BASE = "https://sheets.googleapis.com/v4/spreadsheets";
const OAUTH_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

function spreadsheetId() {
  const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!id) throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID not set");
  return id;
}

function credentials() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not set");
  try { return JSON.parse(raw); }
  catch { return JSON.parse(Buffer.from(raw, "base64").toString("utf-8")); }
}

async function getToken() {
  const creds = credentials();
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ iss: creds.client_email, scope: SCOPE, aud: OAUTH_URL, exp: now + 3600, iat: now })).toString("base64url");
  const input = `${header}.${payload}`;
  const sign = createSign("RSA-SHA256");
  sign.update(input);
  const sig = sign.sign(creds.private_key, "base64url");
  const jwt = `${input}.${sig}`;
  const res = await fetch(OAUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
  });
  if (!res.ok) throw new Error(`Auth failed: ${await res.text()}`);
  const { access_token } = await res.json();
  return access_token;
}

async function h(token) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

async function append(tab, values, token) {
  const url = `${SHEETS_BASE}/${spreadsheetId()}/values/${encodeURIComponent(tab)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  const res = await fetch(url, { method: "POST", headers: await h(token), body: JSON.stringify({ values: [values] }) });
  if (!res.ok) throw new Error(`append "${tab}": ${await res.text()}`);
}

async function read(tab, token) {
  const res = await fetch(`${SHEETS_BASE}/${spreadsheetId()}/values/${encodeURIComponent(tab)}`, { headers: await h(token) });
  if (!res.ok) throw new Error(`read "${tab}": ${await res.text()}`);
  const data = await res.json();
  return data.values ?? [];
}

async function getSheetIds(token) {
  const res = await fetch(`${SHEETS_BASE}/${spreadsheetId()}?fields=sheets.properties`, { headers: await h(token) });
  if (!res.ok) throw new Error(`metadata: ${await res.text()}`);
  const data = await res.json();
  const map = {};
  for (const s of data.sheets) map[s.properties.title] = s.properties.sheetId;
  return map;
}

async function deleteRow(tab, rowNum, sheetId, token) {
  const res = await fetch(`${SHEETS_BASE}/${spreadsheetId()}:batchUpdate`, {
    method: "POST",
    headers: await h(token),
    body: JSON.stringify({ requests: [{ deleteDimension: { range: { sheetId, dimension: "ROWS", startIndex: rowNum - 1, endIndex: rowNum } } }] }),
  });
  if (!res.ok) throw new Error(`delete row ${rowNum} from "${tab}": ${await res.text()}`);
}

const TS = `TEST_${Date.now()}`;

const TESTS = [
  {
    tab: "Leads",
    row: [TS, "Test", "User", "test@example.com", "TestCo", "Engineer", "brief", "form", "new", "", new Date().toISOString()],
    idCol: 0,
  },
  {
    tab: "Meetings",
    row: [TS, "TestCo", "Test User", "test@example.com", "Engineer", new Date().toISOString(), "upcoming", "", new Date().toISOString(), new Date().toISOString()],
    idCol: 0,
  },
  {
    tab: "AdminUsers",
    row: ["test-admin@kalvium.com_" + TS, "Test Admin", new Date().toISOString(), new Date().toISOString(), "1"],
    idCol: 0,
  },
  {
    tab: "Students",
    row: [TS, "Test Student", "student_test@kalvium.com", "9999999999", "Sem 5", "[]", "[]", "eligible", "", "", "Test Campus", "Bangalore", "", "", "", "", "manual", "{}", new Date().toISOString(), new Date().toISOString()],
    idCol: 0,
  },
  {
    tab: "Deals",
    row: [TS, "TestCo", "Test Contact", "contact@test.com", "Engineer", "form_sent", "", "", TS + "token", "{}", "{}", new Date().toISOString(), new Date().toISOString()],
    idCol: 0,
  },
  {
    tab: "DealStudentRounds",
    row: [TS, "deal-" + TS, "student-" + TS, "0", "shared", "", new Date().toISOString(), new Date().toISOString()],
    idCol: 0,
  },
  {
    tab: "Opportunities",
    row: [TS, "pending", "TestCo", "Engineer", "Test User", "test@example.com", "Yellow", "started", "0", "started", "{}", "[]", "[]", "", "", "", "", "", "1.2.3.4", new Date().toISOString(), new Date().toISOString()],
    idCol: 0,
  },
];

async function run() {
  console.log("Authenticating with Google...");
  const token = await getToken();
  console.log("Auth OK\n");

  const ids = await getSheetIds(token);
  const results = [];

  for (const { tab, row, idCol } of TESTS) {
    process.stdout.write(`  ${tab.padEnd(22)}`);
    try {
      // Write
      await append(tab, row, token);

      // Read back and find our row
      const rows = await read(tab, token);
      const found = rows.find((r) => r[idCol] === TS || r[idCol] === row[idCol]);
      if (!found) throw new Error("row not found after write");

      // Find actual row number (1-indexed)
      const rowNum = rows.indexOf(found) + 1;

      // Delete it
      const sheetId = ids[tab];
      if (sheetId === undefined) throw new Error(`no sheetId for "${tab}"`);
      await deleteRow(tab, rowNum, sheetId, token);

      console.log("PASS  (write → read → delete)");
      results.push({ tab, ok: true });
    } catch (err) {
      console.log(`FAIL  ${err.message}`);
      results.push({ tab, ok: false, error: err.message });
    }
  }

  console.log("\n" + "─".repeat(44));
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log(`${passed}/${results.length} tabs passed${failed ? ` — ${failed} failed` : ""}`);

  if (failed) {
    console.log("\nFailed:");
    for (const r of results.filter((r) => !r.ok)) console.log(`  ${r.tab}: ${r.error}`);
    process.exit(1);
  }
}

run().catch((err) => { console.error(err.message); process.exit(1); });
