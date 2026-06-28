import { redirect } from "next/navigation";
import { getAdminEmail, signOut } from "@/auth";
import OpportunitiesDashboard from "@/components/admin/OpportunitiesDashboard";
import { listOpportunities } from "@/lib/db";

export const dynamic = "force-dynamic";

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function OpportunitiesPage() {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) redirect("/admin/sign-in");
  const opportunities = await listOpportunities();

  return (
    <OpportunitiesDashboard
      opportunities={opportunities}
      adminEmail={adminEmail}
      onSignOut={adminEmail !== "local-admin@kalvium.com" ? handleSignOut : undefined}
    />
  );
}
