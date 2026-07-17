import { redirect } from "next/navigation";
import { getAdminEmail, signOut } from "@/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SetupSheetsButton from "@/components/admin/SetupSheetsButton";

export const dynamic = "force-dynamic";

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function SettingsPage() {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) redirect("/admin/sign-in");

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <AdminSidebar
        adminEmail={adminEmail}
        onSignOut={adminEmail !== "local-admin@kalvium.com" ? handleSignOut : undefined}
      />
      <main className="flex-1 overflow-auto px-6 py-8">
        <div className="mx-auto max-w-[720px]">
          <h1 className="text-3xl font-black tracking-[-0.055em]">Settings</h1>
          <p className="mt-1 text-sm text-muted">Admin configuration and data setup.</p>

          <div className="mt-8">
            <SetupSheetsButton />
          </div>

          <div className="mt-6 rounded-xl border border-line bg-white p-6">
            <h2 className="text-lg font-black">Spreadsheet</h2>
            <p className="mt-1 text-sm text-muted">
              All admin data (leads, students, deals, meetings, inbounds) writes to the spreadsheet
              configured in <code className="rounded bg-soft px-1 py-0.5 font-mono text-xs">GOOGLE_SHEETS_SPREADSHEET_ID</code>.
            </p>
            <p className="mt-3 text-sm">
              ID:{" "}
              <code className="rounded bg-soft px-1.5 py-0.5 font-mono text-xs">
                {process.env.GOOGLE_SHEETS_SPREADSHEET_ID ?? "not configured"}
              </code>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
