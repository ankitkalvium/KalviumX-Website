import { redirect } from "next/navigation";
import { getAdminEmail, signOut } from "@/auth";
import BlogAdminDashboard from "@/components/admin/BlogAdminDashboard";
import { getAllPostsForAdmin } from "@/lib/repo/posts";

export const dynamic = "force-dynamic";

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function BlogAdminPage() {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) redirect("/admin/sign-in");
  const posts = await getAllPostsForAdmin();

  return (
    <BlogAdminDashboard
      posts={posts}
      adminEmail={adminEmail}
      onSignOut={adminEmail !== "local-admin@kalvium.com" ? handleSignOut : undefined}
    />
  );
}
