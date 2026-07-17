import { redirect } from "next/navigation";
import { getAdminEmail, signOut } from "@/auth";
import StudentsDashboard from "@/components/admin/StudentsDashboard";
import { listStudents } from "@/lib/repo/students";

export const dynamic = "force-dynamic";

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function StudentsPage() {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) redirect("/admin/sign-in");
  const students = await listStudents();

  return (
    <StudentsDashboard
      students={students}
      adminEmail={adminEmail}
      onSignOut={adminEmail !== "local-admin@kalvium.com" ? handleSignOut : undefined}
    />
  );
}
