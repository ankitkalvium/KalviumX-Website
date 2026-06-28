import { redirect } from "next/navigation";
import { getAdminEmail, signOut } from "@/auth";
import LeadsDashboard from "@/components/admin/LeadsDashboard";
import { listLeads } from "@/lib/db";

export const dynamic = "force-dynamic";

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function HiringInterestPage() {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) redirect("/admin/sign-in");
  const leads = await listLeads();

  return (
    <LeadsDashboard
      leads={leads}
      adminEmail={adminEmail}
      onSignOut={adminEmail !== "local-admin@kalvium.com" ? handleSignOut : undefined}
    />
  );
}
