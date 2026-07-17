import { NextResponse } from "next/server";
import { getAdminEmail } from "@/auth";
import { upsertPost } from "@/lib/repo/posts";

// One-time migration endpoint: moves the two real posts that existed in
// Sanity into the new Sheets-backed Posts tab. Delete this route once the
// migration is verified — it's not part of the ongoing blog workflow.
const bearer = (request: Request) => request.headers.get("authorization")?.replace("Bearer ", "");

export async function POST(request: Request) {
  const secret = process.env.BLOG_SEED_SECRET;
  const validBearer = secret && bearer(request) === secret;
  const adminEmail = validBearer ? "migration-script" : await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = (await request.json().catch(() => null)) as Parameters<typeof upsertPost>[0][] | null;
  if (!Array.isArray(posts)) return NextResponse.json({ error: "Expected an array of posts." }, { status: 400 });

  const results = [];
  for (const post of posts) {
    try {
      const saved = await upsertPost(post);
      results.push({ id: saved.id, slug: saved.slug, ok: true });
    } catch (error: unknown) {
      results.push({ id: post.id, ok: false, error: error instanceof Error ? error.message : String(error) });
    }
  }
  return NextResponse.json({ ok: results.every((r) => r.ok), results });
}
