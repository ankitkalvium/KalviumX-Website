import { NextResponse } from "next/server";
import { getAdminEmail } from "@/auth";
import { getWriteClient } from "@/sanity/lib/client";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

export async function POST(request: Request) {
  const adminEmail = await getAdminEmail();
  if (!adminEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json({ error: "Image upload is not configured on the server." }, { status: 503 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Unsupported image type. Use JPEG, PNG, WEBP, GIF, or SVG." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is too large (max 8MB)." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await getWriteClient().assets.upload("image", buffer, {
      filename: file.name || "cover",
      contentType: file.type,
    });
    return NextResponse.json({ ok: true, url: asset.url });
  } catch (error: unknown) {
    console.error("Blog cover image upload failed", error);
    return NextResponse.json({ error: "Could not upload this image." }, { status: 502 });
  }
}
