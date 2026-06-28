import { redirect } from "next/navigation";
import { getAdminEmail, signOut } from "@/auth";
import DealsDashboard from "@/components/admin/DealsDashboard";
import { listDeals } from "@/lib/db-deals";
import { listStudents } from "@/lib/db-students";

export const dynamic = "force-dynamic";

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function DealsPage() {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) redirect("/admin/sign-in");
  const [deals, students] = await Promise.all([listDeals(), listStudents()]);

  return (
    <DealsDashboard
      deals={deals}
      students={students}
      adminEmail={adminEmail}
      onSignOut={adminEmail !== "local-admin@kalvium.com" ? handleSignOut : undefined}
    />
  );
}
