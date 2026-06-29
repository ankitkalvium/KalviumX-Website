import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminEmail } from "@/auth";
import { getPostById } from "@/sanity/lib/queries";
import { getWriteClient } from "@/sanity/lib/client";

const schema = z.object({
  published: z.boolean(),
});

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const post = await getPostById(id);
  if (!post) return NextResponse.json({ error: "Post not found." }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "Blog publishing is not configured on the server." }, { status: 503 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { id } = await context.params;
  try {
    await getWriteClient().patch(id).set({ published: parsed.data.published }).commit();
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("Blog post publish toggle failed", error);
    return NextResponse.json({ error: "Could not update this post." }, { status: 502 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "Blog publishing is not configured on the server." }, { status: 503 });
  }

  const { id } = await context.params;
  try {
    await getWriteClient().delete(id);
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error("Blog post delete failed", error);
    return NextResponse.json({ error: "Could not delete this post." }, { status: 502 });
  }
}
