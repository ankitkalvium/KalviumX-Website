import { appendRow, ensureTab, readAllRows, updateRow } from "./_sheets";

const TAB = "AdminUsers";
const HEADERS = ["email", "name", "first_seen", "last_login", "login_count"];

const C = { email: 0, name: 1, firstSeen: 2, lastLogin: 3, loginCount: 4 } as const;

let tabReady: Promise<void> | null = null;
function ready() {
  if (!tabReady) tabReady = ensureTab(TAB, HEADERS).catch((e) => { tabReady = null; throw e; });
  return tabReady;
}

export async function recordAdminLogin(email: string, name?: string | null): Promise<void> {
  await ready();
  const now = new Date().toISOString();
  const rows = await readAllRows(TAB);
  const normalised = email.toLowerCase();

  for (let i = 1; i < rows.length; i++) {
    if ((rows[i][C.email] ?? "").toLowerCase() === normalised) {
      const count = parseInt(rows[i][C.loginCount] ?? "0", 10) + 1;
      const updated = [
        rows[i][C.email],
        name ?? rows[i][C.name] ?? "",
        rows[i][C.firstSeen] ?? now,
        now,
        String(count),
      ];
      await updateRow(TAB, i + 1, updated);
      return;
    }
  }

  await appendRow(TAB, [normalised, name ?? "", now, now, "1"]);
}
