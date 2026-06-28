import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { recordAdminLogin } from "@/lib/db";

const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 90; // 90 days

const hasGoogleAuth = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret:
    process.env.AUTH_SECRET ??
    (process.env.NODE_ENV === "development"
      ? "kalviumx-local-development-auth-secret"
      : undefined),
  providers: hasGoogleAuth
    ? [
        Google({
          authorization: { params: { hd: "kalvium.com", prompt: "select_account" } },
        }),
      ]
    : [],
  pages: { signIn: "/admin/sign-in" },
  session: { maxAge: ADMIN_SESSION_MAX_AGE_SECONDS },
  cookies: {
    sessionToken: {
      name: "kalviumx.admin.session-token.v1",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    signIn({ profile }) {
      return profile?.email?.toLowerCase().endsWith("@kalvium.com") ?? false;
    },
    session({ session }) {
      if (session.user?.email && !session.user.email.toLowerCase().endsWith("@kalvium.com")) {
        throw new Error("Unauthorized email domain");
      }
      return session;
    },
  },
  events: {
    async signIn({ profile }) {
      if (!profile?.email?.toLowerCase().endsWith("@kalvium.com")) return;
      try {
        await recordAdminLogin(profile.email, profile.name);
      } catch (error) {
        console.error("Failed to record admin login", error);
      }
    },
  },
  trustHost: true,
});

export async function getAdminEmail() {
  if (process.env.NODE_ENV === "development" && !hasGoogleAuth) {
    return "local-admin@kalvium.com";
  }
  try {
    const session = await auth();
    if (session?.user?.email?.toLowerCase().endsWith("@kalvium.com")) {
      return session.user.email;
    }
  } catch (error) {
    console.error("Admin session could not be read", error);
  }
  return null;
}

export function isGoogleAuthConfigured() {
  return hasGoogleAuth;
}
