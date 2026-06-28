import { redirect } from "next/navigation";
import { getAdminEmail, signOut } from "@/auth";
import MeetingsDashboard from "@/components/admin/MeetingsDashboard";
import { listMeetings } from "@/lib/db-meetings";

export const dynamic = "force-dynamic";

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function MeetingsPage() {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) redirect("/admin/sign-in");
  const meetings = await listMeetings();

  return (
    <MeetingsDashboard
      meetings={meetings}
      adminEmail={adminEmail}
      onSignOut={adminEmail !== "local-admin@kalvium.com" ? handleSignOut : undefined}
    />
  );
}
