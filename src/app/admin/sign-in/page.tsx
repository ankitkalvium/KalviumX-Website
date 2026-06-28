import Image from "next/image";
import { redirect } from "next/navigation";
import { getAdminEmail, isGoogleAuthConfigured, signIn } from "@/auth";

export const dynamic = "force-dynamic";

export default async function AdminSignInPage() {
  const adminEmail = await getAdminEmail();
  if (adminEmail) redirect("/admin/opportunities");
  const configured = isGoogleAuthConfigured();

  return (
    <main className="min-h-[70vh] bg-soft px-6 py-20">
      <div className="mx-auto max-w-md rounded-2xl border border-line bg-white p-8 shadow-xl">
        <Image
          src="/images/brand/logo-primary.png"
          alt="KalviumX"
          width={184}
          height={34}
          className="h-[34px] w-auto"
          style={{ height: 34, width: "auto" }}
        />
        <h1 className="mt-8 text-3xl font-black tracking-[-0.05em]">Admin access</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Sign in with a Kalvium Google Workspace account to review hiring opportunities.
        </p>
        {configured ? (
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/admin/opportunities" });
            }}
          >
            <button className="mt-7 h-12 w-full rounded-lg bg-ink text-sm font-extrabold text-white hover:bg-red">
              Continue with Google
            </button>
          </form>
        ) : (
          <div className="mt-7 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            Google OAuth is not configured locally. In development, visit the dashboard directly to use the safe local-admin fallback.
          </div>
        )}
      </div>
    </main>
  );
}
