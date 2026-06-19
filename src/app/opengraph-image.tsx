import { ImageResponse } from "next/og";
import { OgImageContent, ogImageSize } from "@/lib/og-image";

export const alt = "KalviumX - Hire engineering interns your tech teams can trust";
export const size = ogImageSize;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<OgImageContent />, { ...size });
}
